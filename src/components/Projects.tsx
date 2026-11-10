import Image from "next/image";
import Link from "next/link";
import { projects, type Project } from "@/data/resume";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function Projects() {
  const featured = projects.find((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <section id="projects" className="px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <SectionHead
            index="03"
            label="Selected work"
            title="Things I actually run."
            note="A series I founded, a scheduler I use, and the tools I built along the way."
          />
        </Reveal>

        {featured && (
          <Reveal delay={0.05}>
            <FeaturedProject project={featured} />
          </Reveal>
        )}

        <div className="mt-16 grid gap-x-10 gap-y-2 md:grid-cols-2 md:gap-y-0">
          {rest.map((project, i) => (
            <Reveal key={project.id} delay={0.04 * i}>
              <ProjectRow project={project} index={i + 2} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  const href = project.internalHref ?? project.links[0]?.href;

  return (
    <article className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
      <div className="relative overflow-hidden rounded-[15px] bg-fill">
        <Image
          src="/images/founders-track-day/gallery-paddock.jpg"
          alt="Founders Track Day paddock at Thunderhill"
          width={1400}
          height={950}
          className="h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0"
          sizes="(min-width: 1024px) 52vw, 100vw"
          priority={false}
        />
        <p className="label absolute left-4 top-4 rounded-full bg-paper px-3 py-1.5 text-ink">
          Featured · {project.year}
        </p>
      </div>

      <div className="flex flex-col justify-between gap-8">
        <div>
          <p className="label text-mute">01 — Case study</p>
          <h3 className="display mt-3 text-[clamp(2.2rem,4.6vw,3.6rem)]">{project.title}</h3>
          <p className="mt-4 max-w-lg text-[15px] leading-[1.6]">{project.description}</p>

          <ul className="mt-7 space-y-3">
            {project.details.map((detail) => (
              <li key={detail} className="grid grid-cols-[auto_1fr] gap-3 text-[13px] text-mute">
                <span aria-hidden className="mono text-ink">
                  +
                </span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="pill label text-[9px] text-mute">
              {tag}
            </span>
          ))}
          {href && (
            <Link href={href} className="pill pill-ink label ml-auto text-[10px]">
              Read the case study ↗
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <article className="group py-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="mono text-[11px] text-mute">{String(index).padStart(2, "0")}</p>
        <div className="flex items-center gap-2">
          {project.status === "in-progress" && (
            <span className="pill label text-[9px] text-ink">In progress</span>
          )}
          <p className="mono text-[11px] text-mute">{project.year}</p>
        </div>
      </div>

      <h3 className="display mt-2 text-[clamp(1.5rem,2.6vw,2.1rem)]">{project.title}</h3>
      <p className="mt-2 max-w-md text-[13px] leading-[1.6] text-mute">{project.summary}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="pill label text-[9px] text-mute">
            {tag}
          </span>
        ))}
      </div>

      {project.links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {project.links.map((link) => {
            const cls =
              "label text-[10px] text-ink underline decoration-[0.5px] underline-offset-4 hover:opacity-60";
            const external = link.href.startsWith("http");
            return external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
              >
                {link.label} ↗
              </a>
            ) : (
              <Link key={link.label} href={link.href} className={cls}>
                {link.label} ↗
              </Link>
            );
          })}
        </div>
      )}
    </article>
  );
}
