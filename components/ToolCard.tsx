"use client";

import { ArrowDownToLine, ArrowUpRight, BookOpen, Github, Globe, Monitor, Cpu, Smartphone } from "lucide-react";
import { Spotlight, useSpotlight } from "@/components/Spotlight";
import ToolIcon from "@/components/ToolIcon";
import { toolPlatforms, type Download, type Platform, type Tool } from "@/lib/tools";

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  Windows: Monitor,
  Android: Smartphone,
  "Raspberry Pi": Cpu,
  Web: Globe,
};

/** Web apps open in a new tab; installers download in place. */
function linkProps(d: Download) {
  return d.platform === "Web" ? { href: d.url, target: "_blank", rel: "noreferrer" } : { href: d.url };
}

export function PlatformChips({ tool }: { tool: Tool }) {
  return (
    <div className="flex flex-wrap gap-2">
      {toolPlatforms(tool).map((p) => {
        const Icon = platformIcons[p];
        return (
          <span key={p} className="chip">
            <Icon className="w-3.5 h-3.5" />
            {p}
          </span>
        );
      })}
    </div>
  );
}

export default function ToolCard({ tool }: { tool: Tool }) {
  const { ref, onMouseMove } = useSpotlight<HTMLElement>();
  const single = tool.downloads.length === 1;

  return (
    <article
      id={tool.slug}
      ref={ref}
      onMouseMove={onMouseMove}
      className="group glass gradient-border relative overflow-hidden rounded-3xl p-6 md:p-7 flex flex-col h-full scroll-mt-28"
    >
      <Spotlight color={`${tool.accent[0]}22`} />

      <div className="relative flex items-start gap-4">
        <ToolIcon tool={tool} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold tracking-tight">{tool.name}</h3>
            {tool.isNew && (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0a0a12] bg-gradient-to-r from-cyan to-pink">
                New
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-white/40 mt-1">{tool.version ? `v${tool.version}` : "web app"}</p>
        </div>
      </div>

      <p className="relative mt-4 text-[15px] text-white/80 font-medium">{tool.tagline}</p>
      <p className="relative mt-2 text-sm text-white/55 leading-relaxed">{tool.description}</p>

      <div className="relative mt-5">
        <PlatformChips tool={tool} />
      </div>

      <div className="relative mt-auto pt-6 flex flex-col gap-2.5">
        {single ? (
          <a {...linkProps(tool.downloads[0])} className="btn btn-primary w-full px-5 py-3">
            {tool.downloads[0].platform === "Web" ? (
              <>
                Open in browser
                <ArrowUpRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <ArrowDownToLine className="w-4 h-4" />
                Download for {tool.downloads[0].platform}
              </>
            )}
          </a>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-black/25 divide-y divide-white/[0.07] overflow-hidden">
            {tool.downloads.map((d) => {
              const Icon = platformIcons[d.platform];
              return (
                <a
                  key={d.url}
                  {...linkProps(d)}
                  className="group/dl flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/[0.06] transition-colors"
                >
                  <Icon className="w-4 h-4 text-white/45 group-hover/dl:text-cyan transition-colors" />
                  <span className="flex-1 text-white/80 group-hover/dl:text-white">{d.label}</span>
                  <ArrowDownToLine className="w-4 h-4 text-white/35 group-hover/dl:text-cyan group-hover/dl:translate-y-0.5 transition-all" />
                </a>
              );
            })}
          </div>
        )}

        {tool.note && <p className="text-xs text-white/45 leading-relaxed px-1">{tool.note}</p>}

        <div className="flex gap-2.5">
          {tool.docsUrl && (
            <a
              href={tool.docsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost flex-1 px-4 py-2.5 text-sm"
            >
              <BookOpen className="w-4 h-4" />
              Setup guide
            </a>
          )}
          <a
            href={tool.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost flex-1 px-4 py-2.5 text-sm"
          >
            <Github className="w-4 h-4" />
            Source
          </a>
        </div>
      </div>
    </article>
  );
}
