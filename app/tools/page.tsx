import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import ToolsBrowser from "@/components/ToolsBrowser";
import { GITHUB_ORG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tools",
  description: "Every SkipIt tool with a direct download from its latest GitHub release.",
};

export default function ToolsPage() {
  return (
    <main className="px-6 md:px-8 pt-10 md:pt-16">
      <div className="max-w-6xl mx-auto">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow mb-3">Browse tools</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-[-0.04em]">
              Ready to <span className="text-gradient">download.</span>
            </h1>
            <p className="mt-4 text-white/60 max-w-xl">
              Every tool links straight to its latest GitHub release. Pick your platform and go.
            </p>
          </div>
          <a href={GITHUB_ORG} target="_blank" rel="noreferrer" className="btn btn-ghost px-5 py-3 self-start md:self-auto">
            All repositories
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </Reveal>

        <ToolsBrowser />

        <Reveal className="mt-16">
          <div className="glass rounded-3xl p-7 md:p-9 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Want something else?</h2>
              <p className="mt-2 text-white/60">Send your idea and it might become the next tool here.</p>
            </div>
            <Link href="/contact/" className="btn btn-primary px-6 py-3 self-start md:self-auto">
              Request a tool
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
