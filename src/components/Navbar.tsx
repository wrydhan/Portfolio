"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/data/resume";

const navLinks = [
  { label: "About", href: "/#about", index: "01" },
  { label: "Experience", href: "/#experience", index: "02" },
  { label: "Work", href: "/#projects", index: "03" },
  { label: "Track day", href: "/founders-track-day", index: "04" },
];

export function Navbar() {
  const [compact, setCompact] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter] duration-300 ${
        compact ? "bg-paper/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link href="/" className="label shrink-0 text-ink" aria-label="Home">
          WR<span className="text-mute">·</span>
          <span className="hidden sm:inline"> PORTFOLIO</span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const active = link.href === pathname;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`label transition-colors ${
                    active ? "text-ink" : "text-mute hover:text-ink"
                  }`}
                >
                  <span className="mr-1.5 text-[9px]">{link.index}</span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${siteConfig.email}`}
            className="pill pill-ink label text-[10px] transition-opacity"
          >
            {siteConfig.email}
          </a>
        </div>
      </nav>
    </header>
  );
}
