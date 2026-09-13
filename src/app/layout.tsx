import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { about, siteConfig } from "@/data/resume";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.title}`,
  description: `${siteConfig.name} — ${siteConfig.title}. ${about.summary.slice(0, 140)}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
