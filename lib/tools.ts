export type Platform = "Windows" | "Android" | "Raspberry Pi";

export type ToolIconName = "download" | "slides" | "wave" | "eye" | "sync" | "power";

export type Download = {
  label: string;
  platform: Platform;
  url: string;
};

export type Tool = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  version: string;
  icon: ToolIconName;
  /** Gradient used for the tool's icon tile. */
  accent: [string, string];
  tags: string[];
  repoUrl: string;
  docsUrl?: string;
  /** Shown under the downloads when the tool needs more than one install. */
  note?: string;
  isNew?: boolean;
  downloads: Download[];
};

// Newest first. To publish a tool, add it here: the home page and /tools both read this list.
export const tools: Tool[] = [
  {
    slug: "tailcontrol",
    name: "TailControl",
    tagline: "Power your PCs on and off from your phone.",
    description:
      "Wake, shut down, lock or sleep your own computers from anywhere over Tailscale. Signed requests, a fixed command list and fingerprint confirmation, with a Raspberry Pi as the always-on hub.",
    version: "0.1.0",
    icon: "power",
    accent: ["#4cc9ff", "#8b7bff"],
    tags: ["remote", "wake-on-lan", "tailscale"],
    repoUrl: "https://github.com/papura-octavian/tailcontrol",
    docsUrl: "https://github.com/papura-octavian/tailcontrol/blob/main/docs/setup-checklist.md",
    note: "Needs Tailscale and a Raspberry Pi. Follow the setup guide; checksums are in the release.",
    isNew: true,
    downloads: [
      {
        label: "App for Android 11+",
        platform: "Android",
        url: "https://github.com/papura-octavian/tailcontrol/releases/download/v0.1.0/TailControl-0.1.0.apk",
      },
      {
        label: "App for Windows",
        platform: "Windows",
        url: "https://github.com/papura-octavian/tailcontrol/releases/download/v0.1.0/TailControl-Client-Setup-0.1.0.exe",
      },
      {
        label: "Agent for each PC",
        platform: "Windows",
        url: "https://github.com/papura-octavian/tailcontrol/releases/download/v0.1.0/TailControl-Agent-Setup-0.1.0.exe",
      },
      {
        label: "Hub for Raspberry Pi",
        platform: "Raspberry Pi",
        url: "https://github.com/papura-octavian/tailcontrol/releases/download/v0.1.0/tailcontrol-hub-linux-arm.tar.gz",
      },
    ],
  },
  {
    slug: "pocketsync",
    name: "PocketSync",
    tagline: "Move files between PC and phone, both ways.",
    description:
      "A simple app that lets you send files from your PC to your phone and back, without cables or cloud uploads.",
    version: "1.0.0",
    icon: "sync",
    accent: ["#3ee8b5", "#4cc9ff"],
    tags: ["sync", "transfer", "files"],
    repoUrl: "https://github.com/papura-octavian/PocketSync",
    downloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/papura-octavian/PocketSync/releases/download/v1.0.0/PocketSync-Setup-1.0.0.exe",
      },
      {
        label: "Android APK",
        platform: "Android",
        url: "https://github.com/papura-octavian/PocketSync/releases/download/v1.0.0/PocketSync-1.0.0.apk",
      },
    ],
  },
  {
    slug: "omniview",
    name: "OmniView",
    tagline: "Open HEIC, AVIF, HEVC and 25+ formats.",
    description:
      "Universal media viewer that opens HEIC, AVIF, TIFF, HEVC and 25+ other formats without any system codecs.",
    version: "1.0.0",
    icon: "eye",
    accent: ["#8b7bff", "#ff4fb0"],
    tags: ["images", "video", "viewer"],
    repoUrl: "https://github.com/SkipIt-Labs/OmniView",
    downloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/SkipIt-Labs/OmniView/releases/download/v1.0.0/OmniView.Setup.1.0.0.exe",
      },
    ],
  },
  {
    slug: "pitchchanger",
    name: "PitchChanger",
    tagline: "Shift pitch by ±24 semitones.",
    description:
      "Shift the pitch of audio and video files by up to ±24 semitones with drag-and-drop.",
    version: "1.2.1",
    icon: "wave",
    accent: ["#ff4fb0", "#ff9a5c"],
    tags: ["audio", "video", "pitch"],
    repoUrl: "https://github.com/papura-octavian/Pitch_changher",
    downloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/papura-octavian/Pitch_changher/releases/download/v1.2.1/PitchShifter-Setup-1.2.1.exe",
      },
    ],
  },
  {
    slug: "vers2go",
    name: "Vers2Go",
    tagline: "Lyrics to PowerPoint in one click.",
    description:
      "Turn song lyrics into ready-to-present PowerPoint slides, one stanza per slide.",
    version: "1.0.0",
    icon: "slides",
    accent: ["#ffb547", "#ff4fb0"],
    tags: ["lyrics", "powerpoint", "slides"],
    repoUrl: "https://github.com/SkipIt-Labs/Vers2Go",
    downloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/SkipIt-Labs/Vers2Go/releases/download/v1.0.0/Vers2Go-Setup-1.0.0.exe",
      },
    ],
  },
  {
    slug: "media-saver",
    name: "Media Saver",
    tagline: "Save playlists and long videos.",
    description: "Download playlists, long videos, or full matches without limits.",
    version: "0.1.3",
    icon: "download",
    accent: ["#4cc9ff", "#3ee8b5"],
    tags: ["video", "audio", "offline"],
    repoUrl: "https://github.com/SkipIt-Labs/Media-Saver",
    downloads: [
      {
        label: "Windows installer",
        platform: "Windows",
        url: "https://github.com/SkipIt-Labs/Media-Saver/releases/download/v0.1.3/Media.Saver-Setup-0.1.3.exe",
      },
    ],
  },
];

export const platforms: Platform[] = ["Windows", "Android", "Raspberry Pi"];

export function toolPlatforms(tool: Tool): Platform[] {
  return platforms.filter((p) => tool.downloads.some((d) => d.platform === p));
}
