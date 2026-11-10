/**
 * The drift intro, drawn as characters.
 *
 * Everything here is pure and deterministic: the same segment geometry, the same
 * seeded puff of tyre smoke, the same frame for a given index. The component only
 * steps an index through `buildFrames()` — no canvas, no image, no 3D.
 *
 * Art direction: one ink, flat. The car is a solid silhouette with the glass and
 * the wheel arches cut out of it; the smoke is the only place characters thin out.
 */

export const COLS = 94;
export const ROWS = 22;
export const SPRITE_W = 56;
export const SPRITE_H = 11;

/** The row the tyres rest on. Smoke rises above it. */
const GROUND_ROW = 17;
/** Where the car comes to rest, in stage columns. */
const PARK_X = 19;
/** Frames in the animation, at 30fps. */
export const FRAME_COUNT = 72;

type Grid = string[][];
type Pt = [number, number];

const PRIORITY: Record<string, number> = {
  "#": 9,
  "@": 7,
  "*": 6,
  "+": 5,
  "=": 4,
  ":": 3,
  "-": 2,
  ".": 1,
};

function blank(w: number, h: number): Grid {
  return Array.from({ length: h }, () => Array<string>(w).fill(" "));
}

function inPoly(x: number, y: number, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function fillPoly(g: Grid, poly: Pt[], ch = "#") {
  for (let y = 0; y < g.length; y++) {
    for (let x = 0; x < g[0].length; x++) {
      if (inPoly(x + 0.5, y + 0.5, poly)) g[y][x] = ch;
    }
  }
}

function ellipse(
  g: Grid,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  ch: string,
) {
  for (let y = 0; y < g.length; y++) {
    for (let x = 0; x < g[0].length; x++) {
      const dx = (x + 0.5 - cx) / rx;
      const dy = (y + 0.5 - cy) / ry;
      if (dx * dx + dy * dy <= 1) g[y][x] = ch;
    }
  }
}

/**
 * A rear-drive coupe in side profile, facing right, drawn in character cells.
 * Character cells are taller than they are wide, which is why the wheels are wide
 * ellipses rather than circles.
 */
function buildSprite(): string[] {
  const g = blank(SPRITE_W, SPRITE_H);
  const rearAxle = 15.2;
  const frontAxle = 44.6;
  const axleY = 7.9;

  // Greenhouse: roof, A and C pillars as one mass; the glass is cut out after.
  fillPoly(g, [
    [13.6, 4.4],
    [18.4, 0.9],
    [31.0, 0.6],
    [38.6, 4.2],
  ]);

  // Body: rear deck, sills, raked nose.
  fillPoly(g, [
    [2.0, 4.4],
    [20.0, 4.2],
    [34.0, 4.1],
    [44.0, 4.3],
    [51.5, 4.9],
    [55.4, 5.7],
    [55.9, 6.9],
    [54.4, 7.6],
    [50.0, 7.8],
    [36.0, 7.8],
    [20.0, 7.8],
    [6.0, 7.7],
    [2.6, 7.2],
    [2.0, 6.0],
  ]);

  // Rear wing: blade and its upright. Two flat strokes that read at 11 rows.
  fillPoly(g, [
    [1.2, 2.7],
    [8.0, 2.7],
    [8.0, 3.4],
    [1.2, 3.4],
  ]);
  fillPoly(g, [
    [6.0, 3.4],
    [7.6, 3.4],
    [7.6, 4.6],
    [6.0, 4.6],
  ]);

  // Glass, split by a B-pillar.
  fillPoly(
    g,
    [
      [15.6, 4.2],
      [19.4, 1.9],
      [30.2, 1.7],
      [36.8, 4.1],
    ],
    " ",
  );
  fillPoly(
    g,
    [
      [26.4, 1.8],
      [27.8, 1.8],
      [27.8, 4.2],
      [26.4, 4.2],
    ],
  );

  // Wheel arches and tyres: the arch is cut wider than the tyre so the wheel
  // separates from the body instead of merging into it.
  for (const cx of [rearAxle, frontAxle]) {
    ellipse(g, cx, axleY - 0.5, 5.4, 2.9, " ");
    ellipse(g, cx, axleY, 4.2, 2.15, "#");
    ellipse(g, cx, axleY, 2.0, 1.0, " ");
  }

  return g.map((row) => row.join("").replace(/\s+$/, ""));
}

const SPRITE = buildSprite();

function put(g: Grid, x: number, y: number, ch: string) {
  const px = Math.round(x);
  const py = Math.round(y);
  if (py < 0 || py >= g.length || px < 0 || px >= g[0].length) return;
  const cur = g[py][px];
  if ((PRIORITY[ch] ?? 0) >= (PRIORITY[cur] ?? 0)) g[py][px] = ch;
}

/** Vertical shear that reads as body roll: pivot at the car's centre. */
function blit(g: Grid, x: number, yBottom: number, roll: number) {
  const cx = SPRITE_W / 2;
  const tan = Math.tan(roll);
  for (let sy = 0; sy < SPRITE.length; sy++) {
    const row = SPRITE[sy];
    for (let sx = 0; sx < row.length; sx++) {
      const ch = row[sx];
      if (ch === " ") continue;
      const dy = -tan * (sx - cx);
      put(g, x + sx, yBottom - (SPRITE_H - 1 - sy) + dy, ch);
    }
  }
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Puff = { x: number; y: number; vx: number; vy: number; age: number; life: number; ch: string };

function smokeGlyph(a: number): string {
  if (a < 0.16) return "@";
  if (a < 0.34) return "*";
  if (a < 0.56) return "+";
  if (a < 0.78) return ":";
  return ".";
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeOutQuart = (u: number) => 1 - Math.pow(1 - u, 4);

/** The car's column at progress `u` through the slide (0 = off stage, 1 = parked). */
function carX(u: number) {
  return -SPRITE_W + 2 + (PARK_X + SPRITE_W - 2) * easeOutQuart(u);
}

export type Frame = string[];

export const ARRIVE_AT = 0.7;

/** The parked car: what the hero renders, and what the intro ends on. */
export function staticFrame(): Frame {
  const g = blank(COLS, ROWS);
  blit(g, PARK_X, GROUND_ROW, 0);
  return g.map((row) => row.join("").replace(/\s+$/, ""));
}

/** All frames of the drift, in order. Pure: cheap enough to build on mount. */
export function buildFrames(count = FRAME_COUNT): Frame[] {
  const frames: Frame[] = [];
  const puffs: Puff[] = [];
  const rand = rng(0x51c7);
  const scuffs = Array.from({ length: 18 }, () => ({
    x: -1,
    age: 0,
    life: 26 + Math.round(rand() * 18),
  }));

  const step = 1 / 30;
  let prevX = carX(0);

  for (let f = 0; f < count; f++) {
    const t = f / (count - 1);
    const u = clamp(t / ARRIVE_AT, 0, 1);
    const x = carX(u);
    const v = x - prevX; // columns per frame
    prevX = x;

    const g = blank(COLS, ROWS);
    const roll = 0.055 * (1 - u) * (1 - u) + 0.012 * Math.sin(t * 9) * (1 - u);
    const bob = Math.sin(t * 41) * 0.22 * (1 - u);

    // Ground scuff: the tyre leaves marks on the road that scroll away with it.
    if (v > 0.25) {
      for (const mark of scuffs) {
        mark.age += 1;
        mark.x -= v * 0.9;
        if (mark.age > mark.life) {
          mark.life = 26 + Math.round(rand() * 18);
          mark.age = 0;
          mark.x = x + 15 + rand() * 2;
        }
        if (mark.x < -1 || mark.age > mark.life) continue;
        put(g, mark.x, GROUND_ROW, mark.age < 6 ? "=" : "-");
      }
    }

    // Tyre smoke off the driven wheel.
    if (v > 0.3) {
      const n = clamp(Math.round(v * 1.4), 2, 3);
      const wx = x + 15.2;
      for (let i = 0; i < n; i++) {
        puffs.push({
          x: wx - 1 + rand() * 2,
          y: GROUND_ROW - 0.8 - rand() * 1.2,
          vx: -v * 0.28 - rand() * 0.7,
          vy: -0.30 - rand() * 0.7,
          age: 0,
          life: 13 + Math.round(rand() * 8),
          ch: "@",
        });
      }
    }

    for (let i = puffs.length - 1; i >= 0; i--) {
      const p = puffs[i];
      p.age += 1;
      if (p.age > p.life) {
        puffs.splice(i, 1);
        continue;
      }
      const a = p.age / p.life;
      p.x += p.vx * (1 - a * 0.7) + Math.sin(p.age * 0.9 + p.y) * 0.35;
      p.y += p.vy * (1 - a * 0.5);
      p.vx *= 0.965;
      p.ch = smokeGlyph(a);
      put(g, p.x, p.y, p.ch);
      if (a < 0.45) put(g, p.x + (p.age % 2 === 0 ? 1 : -1), p.y + (p.age % 3 === 0 ? 1 : 0), p.ch);
    }

    blit(g, x, GROUND_ROW + bob, roll);
    void step;

    frames.push(g.map((row) => row.join("").replace(/\s+$/, "")));
  }

  // The tail of the timeline is the parked car, so the hand-off to the hero is seamless.
  frames.push(staticFrame(), staticFrame());
  return frames;
}
