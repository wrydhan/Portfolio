import Link from "next/link";
import { siteConfig } from "@/data/resume";
import { DriftArt } from "./DriftArt";

/** The name plate, used by the hero and by the last beat of the intro. */
export function NamePlate({ tone = "ink", reveal = false }: { tone?: "ink" | "paper"; reveal?: boolean }) {
  const paper = tone === "paper";
  return (
    <div className="grid gap-6 pb-2 lg:grid-cols-[1.6fr_0.4fr] lg:items-end">
      <h1
        className={`display text-[clamp(3.4rem,12vw,11.5rem)] ${paper ? "text-paper" : ""} ${
          reveal ? "intro-wipe" : ""
        }`}
      >
        Waleed
        <br />
        Rydhan
      </h1>

      <div
        className={`max-w-sm lg:pb-3 ${reveal ? "intro-fade" : ""}`}
        style={reveal ? { animationDelay: "820ms" } : undefined}
      >
        <p className={`text-[15px] leading-snug ${paper ? "text-paper/60" : "text-mute"}`}>
          {siteConfig.headline}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            href="#projects"
            className={`pill label text-[10px] ${paper ? "bg-ink text-paper" : "text-ink"}`}
          >
            Selected work
          </Link>
          <a
            href="/resume.pdf"
            className={`pill label text-[10px] ${paper ? "bg-ink text-paper" : "text-ink"}`}
          >
            Résumé ↓
          </a>
          {siteConfig.links
            .filter((l) => l.label !== "Resume PDF")
            .map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`pill label text-[10px] ${paper ? "bg-ink text-paper" : "text-ink"}`}
              >
                {link.label} ↗
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}

/**
 * The opening screen. The car sits on the barrier line; the same picture is the
 * first frame of the intro and the hero of the page, so the hand-off is clean.
 */
export function HeroStage() {
  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pb-6 pt-20 sm:px-8">
      <div className="label flex items-start justify-between gap-4 text-mute">
        <span>
          Fig. 00 <span className="text-ink">— SW20, through the corner</span>
        </span>
        <span className="hidden text-center sm:block">Character render · one ink</span>
        <span className="text-right">{siteConfig.location}</span>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        <DriftArt className="h-full w-full" />
      </div>

      <NamePlate />
    </div>
  );
}
