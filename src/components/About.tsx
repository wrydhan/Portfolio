import { about, education, skills } from "@/data/resume";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

const skillGroups = [
  { title: "Languages", items: skills.languages },
  { title: "Frameworks", items: skills.frameworks },
  { title: "Tools", items: skills.tools },
  { title: "AI", items: skills.ai },
  { title: "Integrations", items: skills.integrations },
  { title: "GTM", items: skills.marketing },
];

export function About() {
  return (
    <section id="about" className="px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <Reveal>
          <SectionHead
            index="01"
            label="About"
            title="Builds the whole thing."
            note="Front end, back end, and the parts that happen in a parking lot at 7am."
          />
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-[0.38fr_0.62fr]">
          <div className="space-y-8">
            <Reveal delay={0.05}>
              <p className="text-[17px] leading-[1.5]">{about.summary}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-[15px] bg-fill p-6">
                <p className="label text-mute">Education</p>
                {education.map((edu) => (
                  <div key={edu.school} className="mt-4 first:mt-3">
                    <p className="display text-[1.45rem] leading-[1.05]">{edu.degree}</p>
                    <p className="mt-2 text-[13px]">{edu.school}</p>
                    <p className="mono mt-1 text-[11px] text-mute">{edu.period}</p>
                    {"details" in edu && edu.details && (
                      <p className="mt-3 text-[13px] leading-snug text-mute">{edu.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div>
                <p className="label text-mute">Off the clock</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {about.interests.map((item) => (
                    <span key={item} className="pill label text-[10px] text-ink">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div>
            <div className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
              {skillGroups.map((group, i) => (
                <Reveal key={group.title} delay={0.05 * i}>
                  <div className="py-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="label text-ink">{group.title}</p>
                      <p className="mono text-[10px] text-mute">
                        {String(group.items.length).padStart(2, "0")}
                      </p>
                    </div>
                    <p className="mt-2 text-[13px] leading-[1.7] text-mute">
                      {group.items.join(" · ")}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
