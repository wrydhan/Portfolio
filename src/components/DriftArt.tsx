"use client";

import { useEffect, useMemo, useRef } from "react";
import { buildFrames, staticFrame } from "@/lib/drift";

type Props = {
  /** play the drift; otherwise the car simply sits parked */
  play?: boolean;
  /** called once, on the last frame */
  onDone?: () => void;
  fps?: number;
  className?: string;
};

/**
 * The hero art: a car drifting through a character grid.
 *
 * The frames are computed by a pure function in `@/lib/drift` (no canvas, no
 * image asset, nothing fetched). Playback writes straight to the <pre>'s text
 * node, so seventy-odd frames cost one string assignment each instead of a
 * React render.
 */
export function DriftArt({ play = false, onDone, fps = 30, className }: Props) {
  const preRef = useRef<HTMLPreElement>(null);
  const frames = useMemo(() => buildFrames(), []);
  const parked = useMemo(() => staticFrame(), []);

  useEffect(() => {
    const pre = preRef.current;
    if (!play || !pre) return;

    let raf = 0;
    let started: number | null = null;
    let shown = -1;

    const tick = (now: number) => {
      if (started === null) started = now;
      const index = Math.min(frames.length - 1, Math.floor(((now - started) / 1000) * fps));
      if (index !== shown) {
        pre.textContent = frames[index].join("\n");
        shown = index;
      }
      if (index >= frames.length - 1) {
        onDone?.();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, fps, frames, onDone]);

  return (
    <div className={`flex w-full justify-center overflow-hidden ${className ?? ""}`} aria-hidden="true">
      <pre
        ref={preRef}
        className="ascii select-none"
        style={{ fontSize: "clamp(3.6px, 2.05vw, 23px)" }}
      >
        {(play ? frames[0] : parked).join("\n")}
      </pre>
    </div>
  );
}
