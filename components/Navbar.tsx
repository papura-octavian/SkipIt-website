"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import { GITHUB_URL } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/tools/", label: "Tools" },
  { href: "/contact/", label: "Request a tool" },
];

function isActive(pathname: string, href: string) {
  const clean = (p: string) => p.replace(/\/+$/, "") || "/";
  return clean(pathname) === clean(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 md:px-6 pt-3 md:pt-4">
      <nav
        className={`mx-auto max-w-6xl rounded-2xl transition-all duration-300 ${
          scrolled || open ? "glass glass-nav" : "border border-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-3 md:px-4 py-2.5">
          <Link href="/" aria-label="SkipIt home" className="rounded-xl px-1 py-1" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-1 text-sm">
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl transition-colors ${
                    active ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="ml-2 btn btn-ghost px-4 py-2 text-sm"
            >
              GitHub
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-xl text-white/80 hover:bg-white/5"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1 px-3 pb-3">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-xl ${
                      isActive(pathname, link.href)
                        ? "bg-white/[0.08] text-white"
                        : "text-white/70 hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 inline-flex items-center gap-1.5"
                >
                  GitHub <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
