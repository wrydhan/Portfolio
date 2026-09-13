"use client";

import { siteConfig } from "@/data/resume";

export function Contact() {
  return (
    <section id="contact" className="border-t border-border bg-surface/30 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Contact</p>
        <h2 className="font-display mt-2 text-3xl font-bold text-white md:text-4xl">
          Let&apos;s connect
        </h2>
        <a
          href={`mailto:${siteConfig.email}`}
          className="mt-8 inline-block rounded-md bg-accent px-8 py-3 font-medium text-background transition hover:bg-accent-dim"
        >
          {siteConfig.email}
        </a>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm">
          {siteConfig.phone && <span className="text-muted">{siteConfig.phone}</span>}
          {siteConfig.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-muted transition hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
