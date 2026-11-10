import Link from "next/link";
import { siteConfig } from "@/data/resume";
import { Su47Ascii } from "./Su47Ascii";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pb-6 pt-20 sm:px-8">
      {/* instrument rail */}
      <div className="label flex items-start justify-between gap-4 text-mute">
        <span>
          Fig. 01 <span className="text-ink">— Su-47 “Berkut”</span>
        </span>
        <span className="hidden text-center sm:block">
          ASCII turntable · 60 pre-rendered frames · 126&times;52 cells
        </span>
        <span className="text-right">{siteConfig.location}</span>
      </div>

      {/* the aircraft */}
      <div className="relative flex flex-1 items-center justify-center">
        <Su47Ascii className="w-full max-w-[1360px]" />
        <p className="sr-only">
          An ASCII-art render of a Sukhoi Su-47 Berkut rotating on a turntable, drawn with
          monospace characters.
        </p>
      </div>

      {/* name plate */}
      <div className="grid gap-6 pb-2 lg:grid-cols-[1.6fr_0.4fr] lg:items-end">
        <h1 className="display text-[clamp(3.4rem,12vw,11.5rem)]">
          Waleed
          <br />
          Rydhan
        </h1>

        <div className="max-w-sm lg:pb-3">
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
    </section>
  );
}
