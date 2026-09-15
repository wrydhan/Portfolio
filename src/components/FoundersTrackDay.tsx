import Image from "next/image";
import Link from "next/link";
import { foundersTrackDay } from "@/data/founders-track-day";
import { projects } from "@/data/resume";

const data = foundersTrackDay;

export function FoundersTrackDay() {
  const tools = data.relatedProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is (typeof projects)[number] => Boolean(project));

  return (
    <>
      <Hero />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>The idea</SectionLabel>
          <h2 className="font-display mt-2 max-w-3xl text-3xl font-bold text-white md:text-4xl">
            The most exciting founders event in the world.
          </h2>
          <div className="mt-8 max-w-3xl space-y-4 text-lg leading-relaxed text-muted">
            {data.idea.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/30 px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>The Stats</SectionLabel>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {data.stats.map((stat) => (
              <article key={stat.label} className="panel rounded-xl px-4 py-5">
                <p className="font-display text-2xl font-semibold text-white md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted">{stat.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>What I did</SectionLabel>
          <h2 className="font-display mt-2 text-3xl font-bold text-white md:text-4xl">
            End to end, by myself
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            {data.role} · {data.operator}. Venue, budget, sponsors, and the day itself.
          </p>

          <div className="mt-10 grid gap-3 md:grid-cols-2">
            {data.responsibilities.map((item) => (
              <article key={item.title} className="panel rounded-xl p-5">
                <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-surface px-3 py-1 text-sm text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/30 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <article className="panel overflow-hidden rounded-xl">
            <div className="accent-bar h-1 w-full" />
            <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-10">
              <div>
                <SectionLabel>{data.flagship.kicker}</SectionLabel>
                <h2 className="font-display mt-3 text-4xl font-bold text-white md:text-5xl">
                  {data.flagship.venue}
                </h2>
                <p className="mt-2 text-lg text-accent">{data.flagship.date}</p>
                <p className="mt-5 max-w-xl leading-relaxed text-muted">{data.flagship.body}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                {data.flagship.facts.map((fact) => (
                  <div key={fact.label} className="rounded-lg border border-border bg-background/60 px-4 py-4">
                    <p className="font-display text-2xl font-semibold text-white">{fact.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-widest text-muted">{fact.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Sponsors</SectionLabel>
          <h2 className="font-display mt-2 text-3xl font-bold text-white md:text-4xl">
            Who&apos;s on the car
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            $30K closed from Rho, MongoDB, and Warp — enough to fund the Sonoma production.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {data.sponsors.map((sponsor) => (
              <a
                key={sponsor.name}
                href={sponsor.href}
                target="_blank"
                rel="noopener noreferrer"
                className="panel group flex min-h-44 flex-col rounded-xl px-6 py-6 transition hover:border-accent/40 hover:bg-surface-hover"
              >
                <div className="flex h-12 items-center gap-3">
                  {sponsor.logoSrc ? (
                    <Image
                      src={sponsor.logoSrc}
                      alt={sponsor.name}
                      width={180}
                      height={48}
                      className="h-8 w-auto object-contain"
                    />
                  ) : (
                    <>
                      {sponsor.markSrc && (
                        <Image
                          src={sponsor.markSrc}
                          alt=""
                          width={40}
                          height={40}
                          className="h-9 w-9 rounded-md border border-border object-cover"
                        />
                      )}
                      <p className="font-display text-2xl font-semibold text-white transition group-hover:text-accent">
                        {sponsor.name}
                      </p>
                    </>
                  )}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">{sponsor.blurb}</p>
                <p className="mt-auto pt-5 text-xs text-accent">
                  {new URL(sponsor.href).hostname.replace("www.", "")} ↗
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/30 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>From the paddock</SectionLabel>
          <h2 className="font-display mt-2 text-3xl font-bold text-white md:text-4xl">
            Event photos
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Stills from the first event at {data.firstEventReel.venue}. For the full vibe, there&apos;s a
            reel from that day too.
          </p>
          <a
            href={data.firstEventReel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center text-sm font-medium text-accent underline-offset-4 transition hover:underline"
          >
            {data.firstEventReel.label} ↗
          </a>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {data.gallery.map((photo, index) =>
              photo.src ? (
                <figure key={photo.alt} className="panel overflow-hidden rounded-xl">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={800}
                    height={500}
                    className="h-56 w-full object-cover"
                  />
                  {photo.caption && (
                    <figcaption className="px-4 py-3 text-sm text-muted">{photo.caption}</figcaption>
                  )}
                </figure>
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

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Software</SectionLabel>
          <h2 className="font-display mt-2 text-3xl font-bold text-white md:text-4xl">
            Tools I built for this
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Running a track day is a lot of moving parts. I wrote the software I actually use, instead of
            stitching it together in a spreadsheet the night before.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {tools.map((project) => (
              <article key={project.id} className="panel rounded-xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {project.year && <p className="text-xs font-medium text-accent">{project.year}</p>}
                    <h3 className="font-display mt-1 text-xl font-semibold text-white">{project.title}</h3>
                  </div>
                  {project.status === "in-progress" && (
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs text-accent">
                      In progress
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
                <ul className="mt-4 space-y-2">
                  {project.details.map((detail) => (
                    <li key={detail} className="flex gap-2 text-sm text-muted">
                      <span className="text-accent">—</span>
                      {detail}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded bg-background px-2 py-0.5 text-xs text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
                {project.links.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-accent underline-offset-4 transition hover:underline"
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[78vh] overflow-hidden">
      {data.heroImage.src ? (
        <Image
          src={data.heroImage.src}
          alt={data.heroImage.alt}
          fill
          priority
          className="object-cover object-[center_40%]"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <MediaTodo label="Hero photo" hint="public/images/founders-track-day/hero.jpg" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />

      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-6 pb-16 pt-28">
        <Link
          href="/#projects"
          className="mb-6 w-fit text-sm text-muted transition hover:text-accent"
        >
          ← Back to projects
        </Link>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{data.eyebrow}</p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          {data.title}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">{data.tagline}</p>
        <p className="mt-6 text-sm text-muted">
          {data.role} · {data.operator} · {data.period}
        </p>
      </div>

      <div className="accent-bar absolute bottom-0 left-0 h-1 w-full opacity-80" />
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{children}</p>
  );
}

function MediaTodo({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="flex aspect-[16/10] flex-col items-center justify-center rounded-xl border border-dashed border-accent/30 bg-surface/60 px-4 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">TODO</p>
      <p className="font-display mt-2 text-lg text-white">{label}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
