import Link from "next/link";
import { ArrowRight, ArrowUpRight, Github, HardDrive, MousePointerClick, Package, Rocket, ShieldCheck, Zap } from "lucide-react";
import Hero from "@/components/home/Hero";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/SpotlightCard";
import ToolIcon from "@/components/ToolIcon";
import { PlatformChips } from "@/components/ToolCard";
import { tools } from "@/lib/tools";

const marqueeWords = [
  "No accounts",
  "Open source",
  "Windows",
  "Android",
  "Raspberry Pi",
  "No subscriptions",
  "Direct downloads",
  "Runs on your machine",
];

const steps = [
  {
    icon: MousePointerClick,
    title: "Pick a tool",
    text: "Each one does a single job. Read one line and you know if it fits.",
  },
  {
    icon: Rocket,
    title: "Download the installer",
    text: "Straight from the GitHub release. No sign-up wall, no email gate.",
  },
  {
    icon: Zap,
    title: "Problem solved",
    text: "Install once and keep it around for the next time you need it.",
  },
];

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
      <div>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em]">{title}</h2>
      </div>
      {action}
    </Reveal>
  );
}

export default function Home() {
  return (
    <main>
      <Hero />

      <div className="marquee overflow-hidden border-y border-white/[0.06] bg-white/[0.015] py-4" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span key={i} className="flex items-center gap-8 pr-8 font-mono text-sm uppercase tracking-[0.2em] text-white/35">
              {word}
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan to-pink" />
            </span>
          ))}
        </div>
      </div>

      <section className="px-6 md:px-8 pt-20 md:pt-28">
        <div className="max-w-6xl mx-auto">
          <SectionHeading eyebrow="Why SkipIt" title="Built to get out of your way." />

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Reveal className="md:col-span-4">
              <SpotlightCard
                eyebrow="Local first"
                title="Your machine, your files."
                description="Tools run on your own devices. No uploads to someone else's server, no account to create, no telemetry dashboard."
                icon={
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5" />
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="eyebrow">No cloud</p>
                    <p className="mt-2 text-sm text-white/80">Your data never leaves your devices.</p>
                  </div>
                  <div className="rounded-2xl border border-cyan/25 bg-black/30 p-4">
                    <p className="eyebrow !text-cyan/80">Fast</p>
                    <p className="mt-2 text-sm text-white/80">Click and go, even offline.</p>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>

            <Reveal className="md:col-span-2" delay={0.08}>
              <SpotlightCard
                eyebrow="Open source"
                title="Every line on GitHub."
                description="Each tool has a public repo and a release page with the installer."
                icon={<Github className="w-5 h-5" />}
              >
                <div className="flex flex-wrap gap-2">
                  <span className="chip">release builds</span>
                  <span className="chip">readme</span>
                  <span className="chip">free</span>
                </div>
              </SpotlightCard>
            </Reveal>

            <Reveal className="md:col-span-3" delay={0.04}>
              <SpotlightCard
                eyebrow="Instant"
                title="Install once, keep forever."
                description="No subscriptions that expire and no feature walls. The version you download keeps working."
                icon={<Rocket className="w-5 h-5" />}
              />
            </Reveal>

            <Reveal className="md:col-span-3" delay={0.12}>
              <SpotlightCard
                eyebrow="Lean"
                title="No bloat."
                description="Small, focused tools that do one thing extremely well, instead of one app that does everything badly."
                icon={<Package className="w-5 h-5" />}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 pt-20 md:pt-28">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="The depot"
            title="Available tools"
            action={
              <Link href="/tools/" className="btn btn-ghost px-5 py-2.5 text-sm self-start sm:self-auto">
                All downloads
                <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, i) => (
              <Reveal key={tool.slug} delay={(i % 3) * 0.06}>
                <Link
                  href={`/tools/#${tool.slug}`}
                  className="group glass gradient-border relative flex h-full flex-col rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-3">
                    <ToolIcon tool={tool} />
                    <ArrowUpRight className="w-5 h-5 text-white/30 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div className="mt-5 flex items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-tight">{tool.name}</h3>
                    {tool.isNew && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0a0a12] bg-gradient-to-r from-cyan to-pink">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-white/55 leading-relaxed">{tool.tagline}</p>
                  <div className="mt-auto pt-5">
                    <PlatformChips tool={tool} />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 pt-20 md:pt-28">
        <div className="max-w-6xl mx-auto">
          <SectionHeading eyebrow="How it works" title="Three steps. That's it." />

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-[52px] left-[16%] right-[16%] h-px bg-gradient-to-r from-cyan/0 via-violet/40 to-pink/0"
            />
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="relative glass rounded-3xl p-7 h-full">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center w-12 h-12 rounded-2xl bg-black/40 border border-white/10 text-cyan">
                      <step.icon className="w-5 h-5" />
                    </span>
                    <span className="font-mono text-xs text-white/35">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-white/55 leading-relaxed">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 pt-20 md:pt-28">
        <Reveal className="max-w-6xl mx-auto">
          <div className="glass relative overflow-hidden rounded-[2rem] px-6 md:px-12 py-14 md:py-20 text-center">
            <div
              aria-hidden="true"
              className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[80%] aspect-square rounded-full blur-3xl opacity-40"
              style={{ background: "radial-gradient(circle, rgba(255,79,176,0.5), rgba(139,123,255,0.3) 40%, transparent 70%)" }}
            />
            <div className="relative">
              <p className="eyebrow mb-4">Missing something?</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.035em] max-w-2xl mx-auto">
                Tell us the problem. <span className="text-gradient">We build the tool.</span>
              </h2>
              <p className="mt-5 text-white/60 max-w-xl mx-auto">
                Describe what slows you down. If it&apos;s useful to others too, it becomes the next SkipIt tool.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact/" className="btn btn-primary px-8 py-3.5">
                  Request a tool
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/tools/" className="btn btn-ghost px-8 py-3.5">
                  Browse tools
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
