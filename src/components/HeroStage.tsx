import Link from "next/link";
import { siteConfig } from "@/data/resume";
import { DriftArt } from "./DriftArt";

type Props = {
  /** play the drift instead of showing the parked car */
  play?: boolean;
  onDone?: () => void;
  /** stagger the name and the sub-line in as the car settles */
  reveal?: boolean;
};

/**
 * The opening screen — the same component whether it is being played as the
 * intro overlay or shown as the hero underneath it, so the hand-off between the
 * two is invisible.
 */
export function HeroStage({ play = false, onDone, reveal = false }: Props) {
  return (
    <div className="relative flex min-h-[100svh] w-full flex-col overflow-hidden px-5 pb-6 pt-20 sm:px-8">
      {/* instrument rail */}
      <div className="label flex items-start justify-between gap-4 text-mute">
        <span>
          Fig. 00 <span className="text-ink">— Drift</span>
        </span>
        <span className="hidden text-center sm:block">
          Character render · 94 × 22 cells · one ink
        </span>
        <span className="text-right">{siteConfig.location}</span>
      </div>

      {/* the car */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <DriftArt play={play} onDone={onDone} />
        <p className="sr-only">
          A rear-drive coupe sliding across the screen, drawn in monospace characters,
          with tyre smoke trailing off the rear wheel.
        </p>
      </div>

      {/* name plate */}
      <div className="grid gap-6 pb-2 lg:grid-cols-[1.6fr_0.4fr] lg:items-end">
        <h1
          className={`display text-[clamp(3.4rem,12vw,11.5rem)] ${reveal ? "intro-wipe" : ""}`}
          style={reveal ? { animationDelay: "1420ms" } : undefined}
        >
          Waleed
          <br />
          Rydhan
        </h1>

        <div
          className={`max-w-sm lg:pb-3 ${reveal ? "intro-fade" : ""}`}
          style={reveal ? { animationDelay: "1720ms" } : undefined}
        >
          <p className="text-[15px] leading-snug text-mute">{siteConfig.headline}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Link href="#projects" className="pill label text-[10px] text-ink">
              Selected work
            </Link>
            <a href="/resume.pdf" className="pill label text-[10px] text-ink">
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
                  className="pill label text-[10px] text-ink"
                >
                  {link.label} ↗
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
