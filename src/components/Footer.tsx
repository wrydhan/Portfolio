import { siteConfig } from "@/data/resume";

export function Footer() {
  return (
    <footer className="px-5 pb-10 sm:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="label flex flex-col gap-3 pt-6 text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="hidden sm:block">
            Su-47 turntable pre-rendered to ASCII · 60 frames · no runtime 3D
          </p>
          <p>Next.js · Instrument Serif / Sans / Fragment Mono</p>
        </div>
      </div>
    </footer>
  );
}
