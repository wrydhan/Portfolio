import Image from "next/image";
import Link from "next/link";
import { foundersTrackDay } from "@/data/founders-track-day";
import { projects } from "@/data/resume";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

const data = foundersTrackDay;

export function FoundersTrackDay() {
  const tools = data.relatedProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is (typeof projects)[number] => Boolean(project));

  return (
    <>
      <CaseHero />

      <section className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <SectionHead index="01" label="The idea" title="One day, on a real track." />
          </Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr]">
            <Reveal delay={0.05}>
              <p className="label text-mute">Origin</p>
            </Reveal>
            <div className="max-w-2xl space-y-5 text-[17px] leading-[1.55]">
              {data.idea.map((paragraph, i) => (
                <Reveal key={paragraph} delay={0.06 * i}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* spec sheet */}
      <section className="px-5 pb-20 sm:px-8 md:pb-28">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[15px] bg-ink/10 sm:grid-cols-4">
              {data.stats.map((stat) => (
                <div key={stat.label} className="bg-fill px-5 py-7">
                  <p className="display text-[clamp(1.7rem,3.4vw,2.6rem)]">{stat.value}</p>
                  <p className="label mt-2 text-mute">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 md:pb-28">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <SectionHead
              index="02"
              label="What I did"
              title="End to end, by myself."
              note={`${data.role} · ${data.operator}. Venue, budget, sponsors, and the day itself.`}
            />
          </Reveal>

          <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            {data.responsibilities.map((item, i) => (
              <Reveal key={item.title} delay={0.04 * i}>
                <div className="grid grid-cols-[auto_1fr] gap-5">
                  <p className="mono pt-1 text-[11px] text-mute">{String(i + 1).padStart(2, "0")}</p>
                  <div>
                    <h3 className="display text-[clamp(1.4rem,2.4vw,1.9rem)]">{item.title}</h3>
                    <p className="mt-2 text-[13px] leading-[1.6] text-mute">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <span key={tag} className="pill label text-[9px] text-ink">
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* flagship */}
      <section className="px-5 pb-20 sm:px-8 md:pb-28">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <div className="rounded-[15px] bg-ink px-6 py-12 text-paper sm:px-10 md:px-14 md:py-16">
              <p className="label text-paper/50">{data.flagship.kicker}</p>
              <div className="mt-4 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                <div>
                  <h2 className="display text-[clamp(2.6rem,6.5vw,5.6rem)]">
                    {data.flagship.venue}
                  </h2>
                  <p className="label mt-3 text-paper/70">{data.flagship.date}</p>
                  <p className="mt-6 max-w-xl text-[15px] leading-[1.6] text-paper/70">
                    {data.flagship.body}
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  {data.flagship.facts.map((fact) => (
                    <div key={fact.label} className="rounded-[8px] bg-paper/10 px-4 py-4">
                      <p className="display text-[1.7rem] leading-none">{fact.value}</p>
                      <p className="label mt-2 text-paper/50">{fact.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* sponsors */}
      <section className="px-5 pb-20 sm:px-8 md:pb-28">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <SectionHead
              index="03"
              label="Sponsors"
              title="Who's on the car."
              note="$30K closed from Rho, MongoDB, and Warp — enough to fund the Sonoma production."
            />
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-3">
            {data.sponsors.map((sponsor, i) => (
              <Reveal key={sponsor.name} delay={0.05 * i}>
                <a
                  href={sponsor.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col rounded-[15px] bg-fill px-6 py-7 transition-colors hover:bg-fill-deep"
                >
                  <div className="flex h-10 items-center gap-3">
                    {sponsor.logoSrc ? (
                      <Image
                        src={sponsor.logoSrc}
                        alt={sponsor.name}
                        width={180}
                        height={48}
                        className="h-7 w-auto object-contain opacity-80"
                      />
                    ) : (
                      <>
                        {sponsor.markSrc && (
                          <Image
                            src={sponsor.markSrc}
                            alt=""
                            width={40}
                            height={40}
                            className="h-9 w-9 rounded-[8px] object-cover"
                          />
                        )}
                        <p className="display text-[1.6rem]">{sponsor.name}</p>
                      </>
                    )}
                  </div>
                  <p className="mt-4 text-[13px] leading-[1.6] text-mute">{sponsor.blurb}</p>
                  <p className="label mt-auto pt-6 text-ink">
                    {new URL(sponsor.href).hostname.replace("www.", "")} ↗
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* gallery */}
      <section className="px-5 pb-20 sm:px-8 md:pb-28">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <SectionHead
              index="04"
              label="From the paddock"
              title="Event photos."
              note={`Stills from the first event at ${data.firstEventReel.venue}.`}
            />
          </Reveal>

          <Reveal delay={0.05}>
            <a
              href={data.firstEventReel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="pill pill-ink label mb-8 text-[10px]"
            >
              {data.firstEventReel.label} ↗
            </a>
          </Reveal>

          <div className="grid gap-3 md:grid-cols-3">
            {data.gallery.map((photo, index) =>
              photo.src ? (
                <Reveal key={photo.alt} delay={0.05 * index}>
                  <figure className="overflow-hidden rounded-[15px] bg-fill">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={800}
                      height={500}
                      className="h-64 w-full object-cover grayscale transition duration-700 hover:grayscale-0"
                    />
                    {photo.caption && (
                      <figcaption className="px-4 py-4 text-[12px] leading-snug text-mute">
                        {photo.caption}
                      </figcaption>
                    )}
                  </figure>
                </Reveal>
              ) : (
                <MediaTodo
                  key={photo.alt}
                  label={`Event photo ${index + 1}`}
                  hint={`gallery-0${index + 1}.jpg`}
                />
              ),
            )}
          </div>
        </div>
      </section>

      {/* software */}
      <section className="px-5 pb-20 sm:px-8 md:pb-28">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <SectionHead
              index="05"
              label="Software"
              title="Tools I built for this."
              note="Running a track day is a lot of moving parts. I wrote the software I actually use."
            />
          </Reveal>

          <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
            {tools.map((project, i) => (
              <Reveal key={project.id} delay={0.05 * i}>
                <article className="rounded-[15px] bg-fill p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="mono text-[11px] text-mute">{project.year}</p>
                      <h3 className="display mt-1 text-[1.6rem]">{project.title}</h3>
                    </div>
                    {project.status === "in-progress" && (
                      <span className="pill label text-[9px] text-ink">In progress</span>
                    )}
                  </div>
                  <p className="mt-3 text-[13px] leading-[1.6] text-mute">{project.description}</p>
                  <ul className="mt-4 space-y-2">
                    {project.details.map((detail) => (
                      <li
                        key={detail}
                        className="grid grid-cols-[auto_1fr] gap-2.5 text-[12px] leading-snug text-mute"
                      >
                        <span aria-hidden className="mono text-ink">
                          —
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="pill label text-[9px] text-mute">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.links.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-4">
                      {project.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="label text-[10px] text-ink underline decoration-[0.5px] underline-offset-4 hover:opacity-60"
                        >
                          {link.label} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CaseHero() {
  return (
    <section className="px-5 pb-10 pt-24 sm:px-8">
      <div className="mx-auto max-w-[1440px]">
        <Link href="/#projects" className="label text-mute hover:text-ink">
          ← Back to work
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="label text-mute">{data.eyebrow}</p>
            <h1 className="display mt-4 text-[clamp(3rem,9vw,8rem)]">
              Founders
              <br />
              Track Day
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-[1.5]">{data.tagline}</p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[15px] bg-fill px-5 py-5">
                <p className="label text-mute">Role</p>
                <p className="mt-2 text-[14px]">{data.role}</p>
              </div>
              <div className="rounded-[15px] bg-fill px-5 py-5">
                <p className="label text-mute">Operating</p>
                <p className="mt-2 text-[14px]">{data.operator}</p>
              </div>
            </div>
            <div className="rounded-[15px] bg-fill px-5 py-5">
              <p className="label text-mute">Period</p>
              <p className="mono mt-2 text-[12px]">{data.period}</p>
            </div>
          </div>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[15px] bg-fill">
          {data.heroImage.src ? (
            <Image
              src={data.heroImage.src}
              alt={data.heroImage.alt}
              width={1600}
              height={900}
              priority
              className="h-[46vh] w-full object-cover object-[center_40%] grayscale md:h-[62vh]"
              sizes="100vw"
            />
          ) : (
            <div className="h-[46vh] md:h-[62vh]">
              <MediaTodo label="Hero photo" hint="public/images/founders-track-day/hero.jpg" />
            </div>
          )}
          <p className="label absolute bottom-4 left-4 rounded-full bg-paper px-3 py-1.5 text-ink">
            {data.firstEventReel.venue}
          </p>
        </div>
      </div>
    </section>
  );
}

function MediaTodo({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-16 text-center">
      <p className="label text-mute">Image pending</p>
      <p className="display mt-2 text-[1.4rem]">{label}</p>
      <p className="mono mt-1 text-[10px] text-mute">{hint}</p>
    </div>
  );
}
