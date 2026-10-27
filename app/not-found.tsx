import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="px-6 md:px-8 pt-20 md:pt-28">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-[clamp(5rem,20vw,9rem)] font-bold leading-none tracking-[-0.06em] text-gradient">404</p>
        <h1 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight">This page skipped itself.</h1>
        <p className="mt-3 text-white/55">The link is wrong or the page moved. The tools are still where you left them.</p>
        <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-ghost px-6 py-3">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <Link href="/tools/" className="btn btn-primary px-6 py-3">
            Browse tools
          </Link>
        </div>
      </div>
    </main>
  );
}
