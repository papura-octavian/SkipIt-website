// Renders each tool's app icon exactly like its tile on the site (components/ToolIcon.tsx):
// the accent gradient at 135deg, a rounded square, and the Lucide glyph in #0a0a12.
//
//   node scripts/make-app-icons.mjs [outDir]      (default: ./app-icons, git-ignored)
//
// Per tool it writes:
//   icon.svg, icon-<size>.png       the full tile
//   icon.ico                        16-256 px; small sizes get a bigger, bolder glyph so they stay legible
//   android-background.svg          adaptive icon layers for .NET MAUI (MauiIcon + ForegroundFile)
//   android-foreground.svg
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
import { tools } from "../lib/tools.ts";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.resolve(process.argv[2] ?? path.join(root, "app-icons"));

// Same mapping as components/ToolIcon.tsx.
const lucideFile = {
  book: "book-open-text",
  download: "download",
  slides: "presentation",
  wave: "audio-waveform",
  eye: "scan-eye",
  sync: "arrow-left-right",
  power: "power",
};
const GLYPH = "#0a0a12";

async function iconNode(name) {
  const file = path.join(root, "node_modules", "lucide-react", "dist", "esm", "icons", `${lucideFile[name]}.js`);
  const mod = await import(pathToFileURL(file).href);
  return mod.__iconNode;
}

function glyphMarkup(node) {
  return node
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs)
        .filter(([k]) => k !== "key")
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${tag} ${a}/>`;
    })
    .join("");
}

// One square SVG of `size` px. `tile` is the tile's share of the canvas, `glyph` the glyph's share of the tile.
function tileSvg(tool, node, { size, tile = 1, glyph = 0.5, stroke = 2, radius = 0.3, rounded = true }) {
  const t = size * tile;
  const o = (size - t) / 2;
  const g = t * glyph;
  const go = o + (t - g) / 2;
  const [a, b] = tool.accent;
  const shape = rounded
    ? `<rect x="${o}" y="${o}" width="${t}" height="${t}" rx="${t * radius}" fill="url(#bg)"/>`
    : `<rect x="0" y="0" width="${size}" height="${size}" fill="url(#bg)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
${shape}
<svg x="${go}" y="${go}" width="${g}" height="${g}" viewBox="0 0 24 24" fill="none" stroke="${GLYPH}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${glyphMarkup(node)}</svg>
</svg>
`;
}

// Proportions per pixel size: the site's 50% glyph reads well from 64 px up; below that it needs more room.
function sizeSpec(size) {
  if (size <= 20) return { size, tile: 1, glyph: 0.72, stroke: 2.6, radius: 0.22 };
  if (size <= 32) return { size, tile: 1, glyph: 0.66, stroke: 2.4, radius: 0.25 };
  if (size <= 48) return { size, tile: 0.96, glyph: 0.6, stroke: 2.2, radius: 0.28 };
  return { size, tile: 0.92, glyph: 0.52, stroke: 2, radius: 0.3 };
}

const render = (svg) => sharp(Buffer.from(svg), { density: 72 }).png().toBuffer();

// ICO with 32-bit DIB entries below 256 px (widest compatibility: Tk, Inno Setup, rcedit) and PNG at 256.
async function buildIco(tool, node, sizes) {
  const images = [];
  for (const size of sizes) {
    const svg = tileSvg(tool, node, sizeSpec(size));
    if (size >= 256) {
      images.push({ size, data: await render(svg) });
      continue;
    }
    const { data } = await sharp(Buffer.from(svg), { density: 72 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const header = Buffer.alloc(40);
    header.writeUInt32LE(40, 0);
    header.writeInt32LE(size, 4);
    header.writeInt32LE(size * 2, 8);
    header.writeUInt16LE(1, 12);
    header.writeUInt16LE(32, 14);
    const xor = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const s = (y * size + x) * 4;
        const d = ((size - 1 - y) * size + x) * 4;
        xor[d] = data[s + 2];
        xor[d + 1] = data[s + 1];
        xor[d + 2] = data[s];
        xor[d + 3] = data[s + 3];
      }
    }
    const andRow = Math.ceil(size / 32) * 4;
    const and = Buffer.alloc(andRow * size); // all zero: alpha channel decides
    images.push({ size, data: Buffer.concat([header, xor, and]) });
  }
  const dir = Buffer.alloc(6 + images.length * 16);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(images.length, 4);
  let offset = dir.length;
  images.forEach((img, i) => {
    const e = 6 + i * 16;
    dir[e] = img.size >= 256 ? 0 : img.size;
    dir[e + 1] = img.size >= 256 ? 0 : img.size;
    dir.writeUInt16LE(1, e + 4);
    dir.writeUInt16LE(32, e + 6);
    dir.writeUInt32LE(img.data.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += img.data.length;
  });
  return Buffer.concat([dir, ...images.map((i) => i.data)]);
}

for (const tool of tools) {
  const node = await iconNode(tool.icon);
  const dir = path.join(outDir, tool.slug);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, "icon.svg"), tileSvg(tool, node, sizeSpec(512)));
  for (const size of [16, 32, 48, 64, 128, 180, 192, 256, 512, 1024]) {
    fs.writeFileSync(path.join(dir, `icon-${size}.png`), await render(tileSvg(tool, node, sizeSpec(size))));
  }
  fs.writeFileSync(path.join(dir, "icon.ico"), await buildIco(tool, node, [16, 20, 24, 32, 40, 48, 64, 96, 128, 256]));

  // Android adaptive layers: the launcher masks the background, the glyph sits in the safe zone.
  const bg = tileSvg(tool, node, { size: 456, rounded: false, glyph: 0 }).replace(/<svg x=[\s\S]*?<\/svg>\n/, "");
  const fg = tileSvg(tool, node, { size: 456, glyph: 0.5, stroke: 2 }).replace(/<defs>[\s\S]*?<\/defs>\n<rect[^>]*\/>\n/, "");
  fs.writeFileSync(path.join(dir, "android-background.svg"), bg);
  fs.writeFileSync(path.join(dir, "android-foreground.svg"), fg);

  console.log(`${tool.slug.padEnd(14)} -> ${path.relative(process.cwd(), dir)}`);
}
