import { siteConfig } from "@/data/resume";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} {siteConfig.name}</p>
        <p>Built with Next.js · Deploy on Vercel</p>
      </div>
    </footer>
  );
}
