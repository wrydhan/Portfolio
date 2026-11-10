/**
 * The drift intro, drawn as characters.
 *
 * Pure and deterministic: the same geometry, the same seeded smoke, the same
 * frame for a given index. Nothing is fetched, decoded or drawn to a canvas —
 * the player just swaps a string on a <pre>.
 *
 * The shot: the camera is planted low behind a tyre wall, looking down the
 * outside of a corner. A white SW20 comes through it small and far, grows as it
 * closes, throws the back end at the barrier, kisses it with the near rear tyre
 * filling the frame — and then carries straight on past the camera and off the
 * right edge. Only after it is gone does the picture cut to ink.
 *
 * Art direction: one flat ink. The car is a single mass with the glass, arches
 * and panel details knocked out; the barrier is structure, not shading; the
 * smoke is the only thing that thins, because that is what characters do well.
 */

export type Frame = string[];
export type SceneConfig = { cols: number; rows: number };
export type Pose = { scale: number; x: number; base: number; roll: number };

/** width / height of one character cell. */
export const CELL_ASPECT = 0.6;
/** SW20 length over roof height, in the same units, gives the sprite its box. */
const CAR_ASPECT = 3.32;

/** The sprite box in millimetres: a 4.48 m long slab, 1.35 m tall. */
const MM_W = 4480;
const MM_H = 1348;

/** Rows of scene below the track: the barrier the camera is parked behind. */
const BARRIER_ROWS = 5;

type Pt = [number, number];

const PRIORITY: Record<string, number> = {
  "#": 9,
  "@": 8,
  "*": 7,
  "+": 6,
  "=": 5,
  ":": 4,
  "-": 3,
  ".": 2,
};

/* ------------------------------------------------------------------ shapes */

function inPoly(px: number, py: number, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
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

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* -------------------------------------------------------------------- car */
/**
 * The car is drafted in a fixed 88 × 16 cell box (88 * 0.6 / 16 = 3.3, the SW20's
 * 4.17 m over 1.26 m) and rasterised from there at whatever size the shot asks
 * for, so a distant frame and the frame where the tyre fills the screen come out
 * of the same geometry.
 *
 * Drafted from the car's real measurements: 4.17 m long, 1.24 m to the roof,
 * 2.4 m between the axles, 0.30 m to the centre of each wheel.
 */
const DW = 88;
const DH = 16;

/** Silhouette top edge, tail to nose, in design rows. */
const TOP: Pt[] = [
  [3.0, 6.60], [7.0, 6.30], [13.0, 6.16], [17.0, 6.10], [19.4, 6.05],
  [26.4, 1.55], [29.6, 1.26], [41.8, 1.26], [43.4, 1.62], [54.6, 6.05],
  [61.0, 6.55], [70.0, 7.15], [79.0, 7.75], [84.5, 8.15], [85.5, 8.55],
];
/** Underbody, tail to nose. */
const BOT: Pt[] = [
  [3.0, 13.90], [9.0, 13.70], [13.0, 14.00], [38.0, 14.00], [56.0, 14.00],
  [62.0, 13.90], [76.0, 13.60], [83.0, 13.30], [85.5, 13.00],
];

const AXLE_Y = 12.44;
const WHEEL_R = 3.35;
const ARCH_R = 4.30;
const RIM_R = 2.43;
const AXLE_REAR = 21.7;
const AXLE_FRONT = 69.2;

/** Side glass, the intake ahead of the rear arch, the livery band, the lamps. */
const SIDE_GLASS: Pt[] = [[20.4, 5.95], [29.8, 2.20], [41.2, 2.18], [52.6, 5.86]];
const C_PILLAR: Pt[] = [[25.6, 6.10], [28.4, 2.05], [29.6, 2.05], [28.2, 6.08]];
const A_PILLAR: Pt[] = [[41.0, 2.10], [43.4, 2.20], [53.4, 5.88], [51.6, 6.02]];
const B_PILLAR: Pt[] = [[34.8, 2.02], [36.8, 2.02], [37.2, 5.96], [35.2, 5.96]];
const INTAKE: Pt[] = [[22.4, 7.40], [29.6, 7.70], [29.8, 9.40], [22.6, 9.10]];
const DECAL: Pt[] = [[31.0, 11.50], [56.0, 11.15], [56.0, 12.05], [31.0, 12.40]];
const LAMPS: Pt[] = [[4.2, 6.90], [9.2, 6.95], [9.2, 7.85], [4.2, 7.80]];
const DIFFUSER: Pt[] = [[5.4, 12.90], [14.2, 12.70], [14.2, 13.50], [5.4, 13.70]];
const SPLITTER: Pt[] = [[80.0, 12.40], [87.0, 12.20], [87.0, 13.10], [80.0, 13.20]];

/** GT wing: upper plane, lower plane, two struts onto the engine deck. */
const WING: Pt[][] = [
  [[0.8, 1.55], [9.6, 1.95], [9.6, 2.55], [0.6, 2.15]],
  [[1.6, 2.85], [10.4, 3.25], [10.4, 3.70], [1.4, 3.30]],
  [[4.4, 2.35], [6.2, 2.55], [6.4, 6.40], [4.6, 6.40]],
  [[7.6, 3.25], [9.4, 3.45], [9.6, 6.40], [7.8, 6.40]],
];

export type Sprite = { w: number; h: number; ink: Uint8Array };

const spriteCache = new Map<number, Sprite>();

/** Linear read of one of the silhouette polylines at design column x. */
function edgeAt(edge: Pt[], x: number): number {
  if (x <= edge[0][0]) return edge[0][1];
  for (let i = 1; i < edge.length; i++) {
    const [x0, y0] = edge[i - 1];
    const [x1, y1] = edge[i];
    if (x <= x1) {
      const k = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
      return y0 + (y1 - y0) * clamp(k, 0, 1);
    }
  }
  return edge[edge.length - 1][1];
}

/**
 * Rasterise the car at a given sprite width in cells. Cached by width: the shot
 * asks for a handful of sizes, not one per frame.
 */
export function sprite(wCells: number): Sprite {
  const w = Math.max(16, Math.round(wCells));
  const cached = spriteCache.get(w);
  if (cached) return cached;

  const h = Math.max(6, Math.round((w * CELL_ASPECT) / (DW * 0.6) * (DH / 1) * 1));
  const hh = Math.max(6, Math.round((w / DW) * DH));
  const rows = hh;
  void h;

  const ink = new Uint8Array(w * rows);
  const px = (x: number) => ((x + 0.5) / w) * DW; // cell -> design column
  const py = (y: number) => ((y + 0.5) / rows) * DH; // cell -> design row
  const at = (x: number, y: number) => y * w + x;

  // Silhouette: fill between the top edge and the underbody, column by column.
  for (let x = 0; x < w; x++) {
    const cx = px(x);
    const t = edgeAt(TOP, cx);
    const b = edgeAt(BOT, cx);
    for (let y = 0; y < rows; y++) {
      const cy = py(y);
      if (cy >= t && cy <= b) ink[at(x, y)] = 1;
    }
  }

  const poly = (p: Pt[], on: boolean) => {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < w; x++) {
        if (inPoly(px(x), py(y), p)) ink[at(x, y)] = on ? 1 : 0;
      }
    }
  };

  const disc = (cu: number, cv: number, r: number, on: boolean) => {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < w; x++) {
        const du = (px(x) - cu) / (r / CELL_ASPECT);
        const dv = py(y) - cv;
        if (du * du + dv * dv <= r * r) ink[at(x, y)] = on ? 1 : 0;
      }
    }
  };

  const fine = w >= 44;

  // Cut: arches, glasshouse, intake, lamps, diffuser. Details only survive at
  // sizes where there is a cell to hold them.
  disc(AXLE_REAR, AXLE_Y, ARCH_R, false);
  disc(AXLE_FRONT, AXLE_Y, ARCH_R, false);
  poly(SIDE_GLASS, false);
  poly(C_PILLAR, true);
  poly(A_PILLAR, true);
  poly(B_PILLAR, true);
  if (fine) {
    poly(INTAKE, false);
    poly(DECAL, false);
    poly(LAMPS, false);
    poly(DIFFUSER, false);
    poly(SPLITTER, true);
    // bonnet vent strip, following the hood line
    for (let x = 0; x < w; x++) {
      const cx = px(x);
      if (cx < 66 || cx > DW * 0.94) continue;
      const t = edgeAt(TOP, cx);
      for (let y = 0; y < rows; y++) {
        const cy = py(y);
        if (cy >= t + 0.15 && cy <= t + 0.95) ink[at(x, y)] = 0;
      }
    }
    // door shut line
    const door = Math.round((58 / DW) * w);
    for (let y = 0; y < rows; y++) if (py(y) > 7.2) ink[at(door, y)] = 0;
  }
  WING.forEach((p) => poly(p, true));

  // Wheels last, inside the arch cut-outs. The driven rear wheel is spinning,
  // so it is a solid slotted disc; the front shows its spokes.
  wheel(ink, w, rows, AXLE_REAR, "blur", px, py, at);
  wheel(ink, w, rows, AXLE_FRONT, fine ? 6 : 4, px, py, at, "spoke");

  const out = { w, h: rows, ink };
  spriteCache.set(w, out);
  return out;
}

function wheel(
  ink: Uint8Array,
  w: number,
  rows: number,
  cu: number,
  spokes: number | "blur",
  px: (x: number) => number,
  py: (y: number) => number,
  at: (x: number, y: number) => number,
  style: "spoke" | "blur" = "spoke",
) {
  // Tyre
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < w; x++) {
      const du = (px(x) - cu) / (WHEEL_R / CELL_ASPECT);
      const dv = py(y) - AXLE_Y;
      if (du * du + dv * dv <= WHEEL_R * WHEEL_R) ink[at(x, y)] = 1;
    }
  }
  // Rim face knocked back out
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < w; x++) {
      const du = (px(x) - cu) / (RIM_R / CELL_ASPECT);
      const dv = py(y) - AXLE_Y;
      if (du * du + dv * dv <= RIM_R * RIM_R) ink[at(x, y)] = 0;
    }
  }

  if (style === "blur" || typeof spokes !== "number") {
    // Spinning hard: two bladed strokes through the rim instead of spokes.
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < w; x++) {
        const ax = (px(x) - cu) * CELL_ASPECT;
        const ay = py(y) - AXLE_Y;
        const r = Math.hypot(ax, ay);
        if (r > RIM_R || r < RIM_R * 0.28) continue;
        if (Math.abs(ay) < 0.55) ink[at(x, y)] = 1;
      }
    }
    return;
  }

  const n = spokes;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < w; x++) {
      const ax = (px(x) - cu) * CELL_ASPECT;
      const ay = py(y) - AXLE_Y;
      const r = Math.hypot(ax, ay);
      if (r > RIM_R || r < RIM_R * 0.26) continue;
      const a = (Math.atan2(ay, ax) / (Math.PI * 2)) * n;
      if (Math.abs(a - Math.round(a)) < 0.17) ink[at(x, y)] = 1;
    }
  }
}

/** The sprite as text rows. */
export function spriteRows(wCells: number): string[] {
  const s = sprite(wCells);
  const out: string[] = [];
  for (let y = 0; y < s.h; y++) {
    let row = "";
    for (let x = 0; x < s.w; x++) row += s.ink[y * s.w + x] ? "#" : " ";
    out.push(row);
  }
  return out;
}

/* ------------------------------------------------------------------ scene */

type Grid = string[][];

function blank(w: number, h: number): Grid {
  return Array.from({ length: h }, () => Array<string>(w).fill(" "));
}

function put(g: Grid, x: number, y: number, ch: string) {
  const px = Math.round(x);
  const py = Math.round(y);
  if (py < 0 || py >= g.length || px < 0 || px >= g[0].length) return;
  if ((PRIORITY[ch] ?? 0) >= (PRIORITY[g[py][px]] ?? 0)) g[py][px] = ch;
}

/**
 * The tyre wall the camera is standing behind: staggered stacks of tyres, an
 * ad panel band along the top, and the line of the barrier itself.
 */
function drawBarrier(g: Grid, rows: number, cols: number) {
  const top = rows - BARRIER_ROWS;
  for (let x = 0; x < cols; x++) {
    if (top >= 0) {
      // top edge of the wall
      g[top][x] = "-";
      // ad panel: stencilled blocks, knocked out of the band
      if (top + 1 < rows) g[top + 1][x] = x % 7 === 3 || x % 7 === 4 ? " " : "=";
    }
    // two staggered courses of tyres
    if (top + 2 < rows) g[top + 2][x] = x % 3 === 0 ? "(" : x % 3 === 1 ? "O" : ")";
    if (top + 3 < rows) g[top + 3][x] = x % 3 === 0 ? ")" : x % 3 === 1 ? "O" : "(";
    if (top + 4 < rows) g[top + 4][x] = x % 2 === 0 ? "#" : "=";
  }
}

function blit(g: Grid, rows: string[], x0: number, yBottom: number, roll: number) {
  const h = rows.length;
  const w = rows[0]?.length ?? 0;
  const tan = Math.tan(roll);
  const pivot = w / 2;
  for (let sy = 0; sy < h; sy++) {
    const row = rows[sy];
    const yBase = yBottom - (h - 1 - sy);
    for (let sx = 0; sx < w; sx++) {
      if (row[sx] !== "#") continue;
      const dy = -tan * (sx - pivot);
      put(g, x0 + sx, yBase + dy, "#");
    }
  }
}

type Puff = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  ch: string;
  size: number;
};

function smokeGlyph(a: number): string {
  if (a < 0.18) return "@";
  if (a < 0.36) return "*";
  if (a < 0.55) return "+";
  if (a < 0.76) return ":";
  return ".";
}

/* -------------------------------------------------------------- choreography */

type Key = { t: number; scale: number; x: number; base: number; roll: number };

/**
 * The camera path, as keys over the drift. `scale` is the sprite width in cells,
 * `x` the sprite's left edge, `base` the row the tyres sit on (relative to the
 * top of the barrier), `roll` the body's lean into the slide.
 */
const KEYS: Key[] = [
  { t: 0.0, scale: 26, x: 0.26, base: -7.5, roll: 0.2 },
  { t: 0.14, scale: 30, x: 0.3, base: -6.6, roll: 0.18 },
  { t: 0.32, scale: 44, x: 0.36, base: -5.0, roll: 0.15 },
  { t: 0.48, scale: 66, x: 0.42, base: -3.4, roll: 0.12 },
  { t: 0.62, scale: 108, x: 0.44, base: -1.6, roll: 0.08 },
  { t: 0.72, scale: 176, x: 0.34, base: 0.4, roll: 0.04 },
  { t: 0.8, scale: 300, x: -0.34, base: 2.4, roll: 0.0 },
  { t: 0.87, scale: 360, x: 0.6, base: 2.0, roll: -0.04 },
  { t: 0.94, scale: 360, x: 2.0, base: 1.4, roll: -0.04 },
  { t: 1.0, scale: 360, x: 3.2, base: 1.0, roll: -0.04 },
];

/** Frames of drift, and frames of black at the end. */
const DRIFT_FRAMES = 62;
const BLACK_FRAMES = 3;
export const FRAME_COUNT = DRIFT_FRAMES + BLACK_FRAMES;
export const FPS = 30;

const ease = (u: number) => u * u * (3 - 2 * u);

function poseAt(t: number, cfg: SceneConfig): Pose {
  let a = KEYS[0];
  let b = KEYS[KEYS.length - 1];
  for (let i = 1; i < KEYS.length; i++) {
    if (t <= KEYS[i].t) {
      a = KEYS[i - 1];
      b = KEYS[i];
      break;
    }
  }
  const span = b.t - a.t || 1;
  const k = ease(clamp((t - a.t) / span, 0, 1));
  const barriers = cfg.rows - BARRIER_ROWS;
  return {
    scale: Math.round(a.scale + (b.scale - a.scale) * k),
    x: (a.x + (b.x - a.x) * k) * cfg.cols,
    base: barriers + (a.base + (b.base - a.base) * k),
    roll: a.roll + (b.roll - a.roll) * k,
  };
}

/** Where the tyres touch the road, in cells — the smoke's source. */
function contact(pose: Pose) {
  return { x: pose.x + 0.228 * pose.scale, y: pose.base - 0.05 * pose.scale };
}

export function buildFrames(cfg: SceneConfig): Frame[] {
  const { cols, rows } = cfg;
  const frames: Frame[] = [];
  const puffs: Puff[] = [];
  const rand = rng(0x5a20);
  let prev = poseAt(0, cfg);

  for (let f = 0; f < DRIFT_FRAMES; f++) {
    const t = f / (DRIFT_FRAMES - 1);
    const pose = poseAt(t, cfg);
    const speed = Math.abs(pose.x - prev.x) + Math.abs(pose.scale - prev.scale) * 0.9;
    const settled = speed < 0.6;

    const g = blank(cols, rows);
    const c = contact(pose);

    // Smoke off the driven tyre: heavier the faster it is coming, and it keeps
    // pouring as the car goes past the lens.
    if (speed > 0.3) {
      const n = clamp(Math.round(speed * 0.55), 1, 4);
      for (let i = 0; i < n; i++) {
        puffs.push({
          x: c.x - pose.scale * 0.06 + rand() * 2,
          y: c.y - rand() * 1.5,
          vx: -0.7 - rand() * 1.5,
          vy: -0.25 - rand() * 0.7,
          age: 0,
          life: 16 + Math.round(rand() * 12),
          ch: "@",
          size: pose.scale / 108,
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
      p.x += p.vx * (1 - a * 0.6) + Math.sin(p.age * 0.8 + p.y * 0.3) * 0.3;
      p.y += p.vy * (1 - a * 0.5);
      p.ch = smokeGlyph(a);
      const spread = Math.max(1, Math.round(p.size * 1.4));
      for (let k = 0; k < spread; k++) {
        if (k > 0 && rand() > 0.55) continue;
        put(g, p.x + k * 0.5, p.y + (k % 2 === 0 ? 0 : 0.5), p.ch);
      }
    }

    drawBarrier(g, rows, cols);
    blit(g, spriteRows(pose.scale), pose.x, pose.base, pose.roll);
    if (settled) void settled;

    frames.push(g.map((row) => row.join("").replace(/\s+$/, "")));
    prev = pose;
  }

  // Cut to ink while the last of the smoke is still on screen.
  const black = "#".repeat(cols);
  for (let i = 0; i < BLACK_FRAMES; i++) frames.push(Array.from({ length: rows }, () => black));
  return frames;
}

/** The still the page hero sits on: the car planted on the barrier line. */
export function heroFrame(cfg: SceneConfig): Frame {
  const { cols, rows } = cfg;
  const g = blank(cols, rows);
  drawBarrier(g, rows, cols);
  const scale = clamp(Math.round(cols * 0.52), 30, 120);
  blit(
    g,
    spriteRows(scale),
    (cols - scale) / 2,
    rows - BARRIER_ROWS - 0.5,
    0.05,
  );
  return g.map((row) => row.join("").replace(/\s+$/, ""));
}
