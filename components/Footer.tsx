import Link from "next/link";
import Logo from "@/components/Logo";
import { CONTACT_EMAIL, GITHUB_URL } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="px-6 md:px-8 pt-16 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="h-px w-full bg-gradient-to-r from-white/0 via-white/12 to-white/0 mb-8" />
        <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <Logo size={28} />
            <p className="text-sm text-white/45">Simple tools for real problems.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/55">
            <Link href="/tools/" className="hover:text-white transition-colors">
              Tools
            </Link>
            <Link href="/contact/" className="hover:text-white transition-colors">
              Request a tool
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors">
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
        <p className="mt-8 text-xs text-white/35">© {new Date().getFullYear()} SkipIt. Free and open source.</p>
      </div>
    </footer>
  );
}
