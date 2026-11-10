"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DriftArt } from "./DriftArt";
import { NamePlate } from "./HeroStage";

const SEEN_KEY = "wr:intro:v2";
const NAME_HOLD = 1400;
const LIFT_AT = 2400;

function lockScroll(lock: boolean) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
  document.body.style.overflow = lock ? "hidden" : "";
}

/**
 * The shot: a white SW20 comes through the corner, closes on the barrier the
 * camera is behind, kisses it with the near rear tyre filling the frame — then
 * carries past the lens and off the right edge. The picture cuts to ink and the
 * name wipes up. Skippable on any click, key, wheel or touch, never replayed in
 * the same tab, not shown at all for reduced motion.
 */
export function IntroOverlay() {
  const [phase, setPhase] = useState<"drift" | "name" | "gone">("drift");
  const done = useRef(false);

  const skip = useCallback(() => {
    if (done.current) return;
    done.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode: it simply plays again next visit */
    }
    setPhase("gone");
    lockScroll(false);
  }, []);

  const toName = useCallback(() => {
    if (done.current) return;
    setPhase("name");
    window.setTimeout(() => {
      done.current = true;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
      setPhase("gone");
      lockScroll(false);
    }, LIFT_AT);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (reduced || seen) {
      done.current = true;
      setPhase("gone");
      return;
    }
    lockScroll(true);
    window.scrollTo(0, 0);
    const onSkip = () => skip();
    window.addEventListener("pointerdown", onSkip);
    window.addEventListener("keydown", onSkip);
    window.addEventListener("wheel", onSkip, { passive: true });
    window.addEventListener("touchstart", onSkip, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onSkip);
      window.removeEventListener("keydown", onSkip);
      window.removeEventListener("wheel", onSkip);
      window.removeEventListener("touchstart", onSkip);
      lockScroll(false);
    };
  }, [skip]);

  if (phase === "gone") return null;

  if (phase === "drift") {
    return (
      <div className="fixed inset-0 z-[80] bg-paper">
        <DriftArt play onDone={toName} className="h-full w-full" maxChar={22} />
        <p className="label absolute bottom-4 right-5 text-mute sm:right-8">Click to enter</p>
      </div>
    );
  }

  return (
    <div className="intro-cut fixed inset-0 z-[80] flex flex-col justify-end overflow-hidden bg-ink px-5 pb-6 sm:px-8">
      <NamePlate tone="paper" reveal />
      <span className="sr-only">{`Intro complete; hold ${NAME_HOLD}`}</span>
    </div>
  );
}
