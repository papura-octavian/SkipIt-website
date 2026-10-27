import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SkipIt - Simple tools for real problems",
    template: "%s · SkipIt",
  },
  description:
    "Small, focused desktop and mobile tools. Download, install, solve the problem. No accounts, no subscriptions.",
  openGraph: {
    title: "SkipIt - Simple tools for real problems",
    description: "Small, focused tools. Download, install, solve the problem.",
    url: SITE_URL,
    siteName: "SkipIt",
    images: ["/skipit-icon.png"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#06060b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <div className="aurora" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <Providers>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
