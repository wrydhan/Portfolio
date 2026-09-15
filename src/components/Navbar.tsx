"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/data/resume";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Track Day", href: "/founders-track-day" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "panel border-b py-3 shadow-lg shadow-black/20" : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="font-display shrink-0 text-sm font-semibold tracking-wide text-white transition hover:text-accent"
        >
          {siteConfig.name}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = link.href === pathname;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm transition-colors hover:text-accent ${
                    active ? "text-accent" : "text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/founders-track-day"
            className={`text-sm transition hover:text-accent md:hidden ${
              pathname === "/founders-track-day" ? "text-accent" : "text-muted"
            }`}
          >
            Track Day
          </Link>
          <Link
            href="/#contact"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-background transition hover:bg-accent-dim"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
