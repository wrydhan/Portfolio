"use client";

import { about, education, skills } from "@/data/resume";

const skillGroups = [
  { title: "Languages", items: skills.languages },
  { title: "Frameworks & Libraries", items: skills.frameworks },
  { title: "Developer Tools", items: skills.tools },
  { title: "AI Tools", items: skills.ai },
  { title: "Integrations & APIs", items: skills.integrations },
  { title: "Marketing & GTM", items: skills.marketing },
];

export function About() {
  return (
    <section id="about" className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionLabel>About</SectionLabel>
        <h2 className="font-display mt-2 text-3xl font-bold text-white md:text-4xl">
          Background & skills
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="leading-relaxed text-muted">{about.summary}</p>

            {about.interests.length > 0 && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-muted">Interests</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {about.interests.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-border bg-surface px-3 py-1 text-sm text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {education.map((edu) => (
            <article key={edu.school} className="panel h-full rounded-xl p-5 lg:p-6">
              <p className="font-display text-lg font-semibold text-white">{edu.degree}</p>
              <p className="mt-1 text-accent">{edu.school}</p>
              <p className="mt-2 text-sm text-muted">{edu.period}</p>
              {"details" in edu && edu.details && (
                <p className="mt-3 text-sm leading-relaxed text-muted">{edu.details}</p>
              )}
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <SkillBlock key={group.title} title={group.title} items={group.items} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{children}</p>
  );
}

function SkillBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="panel rounded-xl p-4">
      <p className="text-xs uppercase tracking-widest text-muted">{title}</p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="rounded bg-background px-2 py-0.5 text-xs text-foreground sm:text-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
