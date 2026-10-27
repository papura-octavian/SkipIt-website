"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import ToolIcon from "@/components/ToolIcon";
import { platforms, tools } from "@/lib/tools";

const ease = [0.22, 1, 0.36, 1] as const;

const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
};

function Orbit() {
  return (
    <div className="relative mx-auto aspect-square w-[min(84vw,440px)]">
      {/* glow + rings */}
      <div
        className="absolute inset-[18%] rounded-full blur-3xl opacity-60"
        style={{ background: "radial-gradient(circle, rgba(139,123,255,0.55), rgba(255,79,176,0.25) 45%, transparent 70%)" }}
      />
      <div className="absolute inset-[5%] rounded-full border border-white/[0.07]" />
      <div className="absolute inset-[22%] rounded-full border border-dashed border-white/[0.08]" />

      {/* logo mark */}
      <div className="absolute inset-[32%] grid place-items-center">
        <div className="float relative w-full h-full rounded-[28%] glass grid place-items-center">
          <Image src="/skipit-mark.png" alt="SkipIt" width={160} height={160} priority className="w-[68%] h-auto" />
        </div>
      </div>

      {/* tools orbiting the mark */}
      <div className="orbit absolute inset-0">
        {tools.map((tool, i) => {
          const angle = (i / tools.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <div
              key={tool.slug}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${50 + Math.cos(angle) * 45}%`, top: `${50 + Math.sin(angle) * 45}%` }}
            >
              <Link
                href={`/tools/#${tool.slug}`}
                title={tool.name}
                className="block rounded-2xl transition-transform duration-300 hover:scale-110"
              >
                <ToolIcon tool={tool} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Hero() {
  const latest = tools.find((t) => t.isNew) ?? tools[0];

  return (
    <section className="px-6 md:px-8 pt-10 md:pt-16 pb-12 md:pb-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.09 } } }}
          className="text-center lg:text-left"
        >
          <motion.div variants={item}>
            <Link
              href={`/tools/#${latest.slug}`}
              className="group inline-flex items-center gap-2 rounded-full glass pl-1.5 pr-3.5 py-1.5 text-sm text-white/75 hover:text-white transition-colors"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan to-pink px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#0a0a12]">
                <Sparkles className="w-3 h-3" /> New
              </span>
              {latest.name} v{latest.version} is out
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-7 text-[clamp(2.6rem,7vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.04em]"
          >
            Small tools.
            <br />
            Real problems.
            <br />
            <span className="text-gradient">Skip the search.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 text-lg text-white/60 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            A depot of focused, open-source apps for {platforms.join(", ").replace(/, ([^,]*)$/, " and $1")}.
            Download, install, done. No accounts, no subscriptions.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
          >
            <Link href="/tools/" className="btn btn-primary px-7 py-3.5">
              Browse tools
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact/" className="btn btn-ghost px-7 py-3.5">
              Request a tool
            </Link>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left"
          >
            {[
              [String(tools.length), "tools"],
              [String(platforms.length), "platforms"],
              ["0", "accounts"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="text-3xl font-bold tracking-tight">{value}</dd>
                <dd className="eyebrow mt-1">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.2 }}
        >
          <Orbit />
        </motion.div>
      </div>
    </section>
  );
}
