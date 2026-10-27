"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import { platforms, toolPlatforms, tools, type Platform } from "@/lib/tools";

type Filter = "All" | Platform;

export default function ToolsBrowser() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      if (filter !== "All" && !toolPlatforms(tool).includes(filter)) return false;
      if (!q) return true;
      return [tool.name, tool.tagline, tool.description, ...tool.tags].some((s) => s.toLowerCase().includes(q));
    });
  }, [query, filter]);

  const filters: Filter[] = ["All", ...platforms];

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-8">
        <div className="flex flex-wrap gap-1 rounded-2xl glass p-1 self-start">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`relative px-4 py-2 rounded-xl text-sm transition-colors ${
                filter === f ? "text-white" : "text-white/55 hover:text-white"
              }`}
            >
              {filter === f && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-xl bg-white/[0.09] border border-white/10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{f}</span>
            </button>
          ))}
        </div>

        <label className="relative md:w-80">
          <span className="sr-only">Search tools</span>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, e.g. video, sync…"
            className="field !pl-10 !pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </label>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        <AnimatePresence mode="popLayout">
          {visible.map((tool, i) => (
            <motion.div
              key={tool.slug}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, delay: Math.min(i, 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <div className="glass rounded-3xl p-10 text-center text-white/60">
          No tool matches that yet.{" "}
          <Link href="/contact/" className="text-cyan hover:underline underline-offset-4">
            Request it
          </Link>
          .
        </div>
      )}
    </div>
  );
}
