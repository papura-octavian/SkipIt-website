"use client";

import { useRef } from "react";

/** Tracks the pointer so a card can draw a soft spotlight under it. */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };
  return { ref, onMouseMove };
}

/** Place inside a `group relative overflow-hidden` element that uses useSpotlight. */
export function Spotlight({ color = "rgba(76,201,255,0.14)" }: { color?: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background: `radial-gradient(380px circle at var(--sx, 50%) var(--sy, 50%), ${color}, transparent 65%)`,
      }}
    />
  );
}
