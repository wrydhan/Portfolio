"use client";

import { experience } from "@/data/resume";

export function Experience() {
  return (
    <section id="experience" className="border-t border-border bg-surface/30 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Experience</p>
        <h2 className="font-display mt-2 text-3xl font-bold text-white md:text-4xl">
          Where I&apos;ve worked
        </h2>

        <div className="relative mt-12 space-y-0">
          <div className="absolute bottom-0 left-[7px] top-2 w-px bg-border md:left-[11px]" />

          {experience.map((job) => (
            <article key={job.id} className="relative pb-12 pl-8 md:pl-10">
              <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-accent bg-background md:h-5 md:w-5" />

              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold text-white">{job.role}</h3>
                  <p className="mt-1 text-accent">{job.company}</p>
                </div>
                <div className="text-sm text-muted">
                  <p>{job.period}</p>
                  <p>{job.location}</p>
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {job.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {highlight}
                  </li>
                ))}
              </ul>

              {job.technologies && job.technologies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-border px-2 py-0.5 text-xs text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
