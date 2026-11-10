import type { Metadata } from "next";
import { FoundersTrackDay } from "@/components/FoundersTrackDay";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { siteConfig } from "@/data/resume";

export const metadata: Metadata = {
  title: `Founders Track Day — ${siteConfig.name}`,
  description:
    "Founders Track Day is a racetrack event series I founded for founders, investors, and car people. Two events in, $30K in sponsorship closed, and a flagship at Sonoma Raceway on October 26, 2026.",
};

export default function FoundersTrackDayPage() {
  return (
    <main className="bg-paper">
      <Navbar />
      <FoundersTrackDay />
      <Footer />
    </main>
  );
}
