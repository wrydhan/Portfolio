"use client";

import { projects } from "@/data/resume";

export function Projects() {
  return (
    <section id="projects" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Projects</p>
        <h2 className="font-display mt-2 text-3xl font-bold text-white md:text-4xl">
          Selected work
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <article
      className="group panel relative overflow-hidden rounded-xl transition-all duration-500 ease-out hover:border-accent/40 hover:bg-surface-hover hover:shadow-2xl hover:shadow-black/40"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {project.year && (
              <p className="text-xs font-medium text-accent">{project.year}</p>
            )}
            <h3 className="font-display mt-1 text-xl font-semibold text-white transition-colors group-hover:text-accent">
              {project.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted transition-all group-hover:line-clamp-none">
              {project.summary}
            </p>
          </div>
          <span
            aria-hidden
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 group-hover:rotate-45 group-hover:border-accent group-hover:text-accent"
          >
            +
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-background px-2 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <div className="border-t border-border px-5 pb-5 pt-4 opacity-0 transition-opacity duration-500 delay-75 group-hover:opacity-100">
            <p className="text-sm leading-relaxed text-muted">{project.description}</p>

            <ul className="mt-4 space-y-2">
              {project.details.map((detail) => (
                <li key={detail} className="flex gap-2 text-sm text-muted">
                  <span className="text-accent">—</span>
                  {detail}
                </li>
              ))}
            </ul>

            {project.links.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-accent underline-offset-4 transition hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
