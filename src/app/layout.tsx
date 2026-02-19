import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Changed to Outfit for premium feel
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Connect Algo | Institutional Grade Copy Trading",
  description: "Automated crypto and forex copy trading strategies for Bybit. Verified performance records, no login required.",
  keywords: ["copy trading", "bybit strategies", "forex signals", "crypto trading bot", "passive income"],
  openGraph: {
    title: "Connect Algo | Premium Copy Trading",
    description: "View our verified trading strategies and start copying on Bybit today.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} antialiased bg-slate-950 text-slate-200`}
      >
        {children}
      </body>
    </html>
  );
}
