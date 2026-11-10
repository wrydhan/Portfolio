import { experience } from "@/data/resume";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function Experience() {
  return (
    <section id="experience" className="px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <SectionHead
            index="02"
            label="Experience"
            title="Where I've shipped."
            note="Three internships across fintech, go-to-market engineering, and operations."
          />
        </Reveal>

        <div>
          {experience.map((job, i) => (
            <Reveal key={job.id} delay={0.05 * i}>
              <article className="group grid gap-6 py-9 md:grid-cols-[0.22fr_0.44fr_0.34fr] md:gap-10">
                <div>
                  <p className="mono text-[11px] text-mute">{job.period}</p>
                  <p className="label mt-1.5 text-mute">{job.location}</p>
                </div>

                <div>
                  <h3 className="display text-[clamp(1.6rem,3vw,2.4rem)]">{job.role}</h3>
                  <p className="mt-1.5 text-[13px]">
                    {job.company}
                    <span className="text-mute"> · {String(i + 1).padStart(2, "0")}</span>
                  </p>
                  {job.technologies && job.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {job.technologies.map((tech) => (
                        <span key={tech} className="pill label text-[9px] text-mute">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <ul className="space-y-2.5">
                  {job.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2.5 text-[13px] leading-[1.6] text-mute">
                      <span aria-hidden className="mono mt-0.5 shrink-0 text-[10px] text-ink">
                        —
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
