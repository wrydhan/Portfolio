# Waleed Rydhan — portfolio

A monochrome, editorial portfolio built around a pre-rendered ASCII turntable of a
Su-47 "Berkut". Next.js 15 (App Router) · Tailwind CSS v4 · TypeScript.

## The ASCII turntable

The hero animation is **not** a live 3D render. Frames are baked ahead of time and
shipped as a static asset:

```bash
python3 scripts/generate-ascii-frames.py
```

That script

1. describes the airframe as triangle meshes (lofted fuselage, forward-swept wings,
   canards, canted twin tails, engine nacelles),
2. spins it on a turntable with a CPU rasteriser (z-buffer + Lambert shading +
   silhouette pass),
3. quantises ink density onto a character ramp, and
4. writes 60 frames (126 × 52 cells) to `public/ascii/su47-frames.json`.

`src/components/Su47Ascii.tsx` fetches that JSON once and swaps pre-joined strings
inside a single `requestAnimationFrame` loop (18 fps, paused when the tab is hidden,
static first frame under `prefers-reduced-motion`). No three.js, no GLB, no runtime
3D dependency.

## Design system

| | |
| --- | --- |
| Display | Instrument Serif 400, set solid (line-height 0.95) and stroked `0.05em` in ink |
| Body / UI | Instrument Sans, `-0.02em` tracking (`-0.04em` on labels and buttons) |
| Mono | Fragment Mono — ASCII frames, figures, labels |
| Ink | `#000` on `#FFF`, secondary `rgba(0,0,0,0.40)` |
| Separation | `#F1F1F1` fills and whitespace, no borders |
| Radii | pills (100px) for actions and tags, 15px cards, 8px controls |

Tokens live in `src/app/globals.css` under `@theme`.

## Routes

- `/` — hero turntable, about, experience, selected work, contact
- `/founders-track-day` — case study: idea, spec sheet, responsibilities, flagship,
  sponsors, gallery, the software built to run it

## Develop

```bash
npm install
npm run dev
```

Content lives in `src/data/resume.ts` and `src/data/founders-track-day.ts`.
