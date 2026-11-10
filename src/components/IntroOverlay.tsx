"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HeroStage } from "./HeroStage";

/** Set once the intro has played in this tab, so a back-navigation doesn't replay it. */
const SESSION_KEY = "wr:intro:v1";
/** The drift itself is 72 frames at 30fps (~2.4s); the name lands a beat before it ends. */
const LIFT_AT = 2500;
const GONE_AT = 2980;
const SEEN_ATTR = "data-intro";

function lockScroll(lock: boolean) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
  document.body.style.overflow = lock ? "hidden" : "";
}

/**
 * The opening sequence: the car drifts in, the name wipes up, then the overlay
 * lifts and the page becomes scrollable.
 *
 * It never blocks anyone for long — it is skippable on any click, key, wheel or
 * touch, it does not replay twice in one session, and with reduced motion
 * requested it is not shown at all (the hero underneath is the same picture).
 */
export function IntroOverlay() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const finished = useRef(false);
  const timers = useRef<number[]>([]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* private mode — the intro simply plays again next time */
    }
    setLeaving(true);
    timers.current.push(
      window.setTimeout(() => lockScroll(false), 300),
      window.setTimeout(() => setGone(true), GONE_AT - LIFT_AT),
    );
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = document.documentElement.getAttribute(SEEN_ATTR) === "seen";

    if (reduced || seen) {
      finished.current = true;
      setGone(true);
      return;
    }

    lockScroll(true);
    window.scrollTo(0, 0);

    const onSkip = () => finish();
    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener("pointerdown", onSkip, opts);
    window.addEventListener("wheel", onSkip, opts);
    window.addEventListener("touchstart", onSkip, opts);
    window.addEventListener("keydown", onSkip);

    timers.current.push(window.setTimeout(finish, LIFT_AT));

    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
      window.removeEventListener("pointerdown", onSkip, opts);
      window.removeEventListener("wheel", onSkip, opts);
      window.removeEventListener("touchstart", onSkip, opts);
      window.removeEventListener("keydown", onSkip);
      lockScroll(false);
    };
  }, [finish]);

  if (gone) return null;

  return (
    <div
      data-intro-root=""
      className={`fixed inset-0 z-[80] bg-paper ${leaving ? "intro-leaving" : ""}`}
    >
      <HeroStage play={!leaving} onDone={finish} reveal />
      <p className="label intro-fade absolute bottom-5 right-5 text-mute sm:right-8">
        Click anywhere to enter
      </p>
    </div>
  );
}
