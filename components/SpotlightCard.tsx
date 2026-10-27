"use client";

import { Spotlight, useSpotlight } from "@/components/Spotlight";

type SpotlightCardProps = {
  title: string;
  eyebrow?: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export default function SpotlightCard({
  title,
  eyebrow,
  description,
  icon,
  className,
  children,
}: SpotlightCardProps) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`group glass gradient-border relative overflow-hidden rounded-3xl h-full ${className ?? ""}`}
    >
      <Spotlight />

      <div className="relative p-6 md:p-7 h-full flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight leading-tight">{title}</h3>
          </div>
          {icon && (
            <div className="shrink-0 rounded-2xl border border-white/10 bg-black/30 p-3 text-cyan transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
              {icon}
            </div>
          )}
        </div>

        <p className="mt-3 text-sm md:text-[15px] text-white/60 leading-relaxed max-w-prose">{description}</p>

        {children && <div className="mt-auto pt-5">{children}</div>}
      </div>
    </div>
  );
}
