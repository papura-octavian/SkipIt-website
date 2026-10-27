import { ArrowLeftRight, AudioWaveform, BookOpenText, Download, Power, Presentation, ScanEye } from "lucide-react";
import type { Tool, ToolIconName } from "@/lib/tools";

const icons: Record<ToolIconName, React.ComponentType<{ className?: string }>> = {
  book: BookOpenText,
  download: Download,
  slides: Presentation,
  wave: AudioWaveform,
  eye: ScanEye,
  sync: ArrowLeftRight,
  power: Power,
};

export default function ToolIcon({ tool, size = "md" }: { tool: Tool; size?: "sm" | "md" }) {
  const Icon = icons[tool.icon];
  const box = size === "sm" ? "w-10 h-10 rounded-xl" : "w-12 h-12 rounded-2xl";
  const glyph = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  return (
    <span
      className={`${box} shrink-0 grid place-items-center text-[#0a0a12] shadow-lg`}
      style={{
        background: `linear-gradient(135deg, ${tool.accent[0]}, ${tool.accent[1]})`,
        boxShadow: `0 10px 30px -10px ${tool.accent[1]}`,
      }}
    >
      <Icon className={glyph} />
    </span>
  );
}
