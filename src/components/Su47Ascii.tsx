"use client";

import { useEffect, useRef, useState } from "react";

type FramePayload = {
  meta: {
    subject: string;
    grid: [number, number];
    frames: number;
    charAspect?: number;
  };
  frames: string[][];
};

type Props = {
  className?: string;
  /** played frames per second — the turntable is 60 pre-rendered frames */
  fps?: number;
};

/**
 * Plays the pre-rendered Su-47 turntable.
 *
 * Nothing 3D runs here: the frames are baked at build time by
 * scripts/generate-ascii-frames.py (turntable -> luminance -> character ramp)
 * and shipped as a static JSON asset, so this component is a text swap inside
 * one requestAnimationFrame loop.
 */
export function Su47Ascii({ className, fps = 18 }: Props) {
  const preRef = useRef<HTMLPreElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let index = 0;
    let last = 0;

    const play = (frames: string[]) => {
      const el = preRef.current;
      if (!el || frames.length === 0) return;
      el.textContent = frames[0];
      setLoaded(true);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const interval = 1000 / Math.max(4, fps);
      const step = (now: number) => {
        raf = requestAnimationFrame(step);
        if (document.hidden || now - last < interval) return;
        last = now;
        index = (index + 1) % frames.length;
        el.textContent = frames[index];
      };
      raf = requestAnimationFrame(step);
    };

    fetch("/ascii/su47-frames.json")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("missing frames"))))
      .then((data: FramePayload) => {
        if (cancelled) return;
        play(data.frames.map((rows) => rows.join("\n")));
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [fps]);

  return (
    <div className={`relative select-none ${className ?? ""}`} aria-hidden="true">
      <pre
        ref={preRef}
        className={`ascii transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ fontSize: "clamp(4.2px, 1.02vw, 12.5px)" }}
      >
        {""}
      </pre>
    </div>
  );
}
