"use client";

import { siteConfig } from "@/data/resume";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      <Image
        src="/images/hero-car.jpg"
        alt="Porsche at the track"
        fill
        priority
        className="object-cover object-[center_40%]"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-6 pb-16 pt-28">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-accent">
          {siteConfig.title}
        </p>

        <h1 className="font-display max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          {siteConfig.name}
        </h1>

        <p className="mt-5 max-w-xl text-lg text-muted">{siteConfig.headline}</p>

        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
          <span className="text-muted">
            {siteConfig.location} · {siteConfig.phone}
          </span>
          {siteConfig.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="rounded-full border border-border px-4 py-1.5 text-foreground transition hover:border-accent hover:text-accent"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>

      <div className="accent-bar absolute bottom-0 left-0 h-1 w-full opacity-80" />
    </section>
  );
}
