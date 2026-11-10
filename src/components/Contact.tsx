import { siteConfig } from "@/data/resume";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contact" className="px-5 pb-24 pt-16 sm:px-8 md:pb-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="rounded-[15px] bg-fill px-6 py-14 sm:px-10 md:px-14 md:py-20">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <p className="label text-mute">04 — Contact</p>
              <h2 className="display mt-4 text-[clamp(2.6rem,7vw,6rem)]">
                Let&apos;s talk
                <br />
                cars or code.
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex flex-col items-start gap-4 md:items-end">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="label text-[11px] underline decoration-[0.5px] underline-offset-[6px] hover:opacity-60"
                >
                  {siteConfig.email}
                </a>
                <p className="mono text-[11px] text-mute">{siteConfig.phone}</p>
                <div className="flex flex-wrap gap-2">
                  {siteConfig.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="pill pill-ink label text-[10px]"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
