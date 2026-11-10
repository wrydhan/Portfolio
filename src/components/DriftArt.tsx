"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildFrames, heroFrame, FPS, type SceneConfig } from "@/lib/drift";

type Props = {
  /** play the shot; otherwise dump the hero still */
  play?: boolean;
  onDone?: () => void;
  className?: string;
  /** character height in px; the grid is derived from the measured box */
  maxChar?: number;
};

/** Grid for a measured box: chars sized so the frame fills it without wrapping. */
function configFor(w: number, h: number, maxChar: number): SceneConfig {
  const font = Math.max(4.5, Math.min(maxChar, w / 64, h / 22));
  const cols = Math.max(40, Math.floor(w / (font * 0.6)));
  const rows = Math.max(14, Math.floor(h / font));
  return { cols, rows };
}

/**
 * The intro picture. Frames come out of a pure function in `@/lib/drift`; the
 * player only swaps the text content of one <pre>, so a 60-frame shot costs a
 * string assignment per frame and nothing else.
 */
export function DriftArt({ play = false, onDone, className, maxChar = 21 }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [cfg, setCfg] = useState<SceneConfig>({ cols: 116, rows: 30 });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) setCfg(configFor(r.width, r.height, maxChar));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxChar]);

  const frames = useMemo(() => buildFrames(cfg), [cfg]);
  const still = useMemo(() => heroFrame(cfg), [cfg]);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    if (!play) {
      pre.textContent = still.join("\n");
      return;
    }
    let raf = 0;
    let started: number | null = null;
    let shown = -1;
    const tick = (now: number) => {
      if (started === null) started = now;
      const i = Math.min(frames.length - 1, Math.floor(((now - started) / 1000) * FPS));
      if (i !== shown) {
        pre.textContent = frames[i].join("\n");
        shown = i;
      }
      if (i >= frames.length - 1) {
        onDone?.();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, frames, still, onDone]);

  const font = cfg.cols > 0 ? undefined : undefined;

  return (
    <div ref={boxRef} className={`flex items-center justify-center overflow-hidden ${className ?? ""}`}>
      <pre
        ref={preRef}
        className="ascii drift-stage select-none"
        aria-hidden="true"
        style={{ fontSize: `calc(min(100vw / ${cfg.cols}, 100vh / ${cfg.rows}) / 0.6)` }}
      >
        {(play ? frames[0] : still).join("\n")}
      </pre>
      <span className="sr-only">
        A white Toyota MR2 sliding through a corner, tyre smoke pouring off the driven wheel.
      </span>
    </div>
  );
}
