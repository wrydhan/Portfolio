#!/usr/bin/env python3
"""
Render the hero aircraft: one static, coloured ASCII plot of the Su-47 Berkut.

Method: a BINARY MASK first, then an edge pass. Never a luminance dither, never
a photo.

  1. The airframe silhouette is built as explicit symmetric polygons in
     normalised aircraft units (LENGTH 1.0, HALF_SPAN 0.3695 = the real
     22.6 m / 16.7 m ratio): radome, forebody, canards, forward-swept wings,
     engine booms, tailplanes, canted fins. The right half is rasterised and
     mirrored, so the two halves are identical by construction.
  2. The mask is sampled into character cells at the cell aspect ratio
     (1.667 tall : 1 wide), so the planform is neither stretched nor squashed.
     The grid is 136 columns and the aircraft fills it, with no dead space.
  3. Cells that straddle the mask boundary become a continuous ink stroke; only
     the interior gets the fill palette (plate / shade plate / lit spine).
     Nothing outside the mask is ever drawn.
  4. Detail sits on top of the mask: white radome + pitot spike, canopy, dorsal
     panel lines, twin canted fins, twin nozzles, red stars with white borders.

Outputs
  src/data/su47-static.json      imported by src/components/Su47Static.tsx
  public/ascii/su47-static.json  same payload, for inspection
  refs/preview_static.png        colour preview at true cell aspect
  refs/preview_text.txt          1:1 plain-text preview
"""

from __future__ import annotations

import json
import pathlib

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[1]

COLS = 136
CELL_ASPECT = 1.667          # cell height / cell width
SUPERSAMPLE = 4

HALF_SPAN = 0.3695
LENGTH = 1.0

INK, PLATE, PLATE_DK, LIT, GLASS, LIGHT, WHITE, RED, LINE = range(9)
PALETTE = {
    INK: "#0d0d11",
    PLATE: "#3a3a43",
    PLATE_DK: "#23232b",
    LIT: "#585864",
    GLASS: "#8a8a96",
    LIGHT: "#c6c6ce",
    WHITE: "#ffffff",
    RED: "#b3122c",
    LINE: "#191920",
}

# ---------------------------------------------------------------- planform --
CANARD = [(0.052, 0.272), (0.100, 0.318), (0.166, 0.372),
          (0.166, 0.410), (0.100, 0.420), (0.052, 0.428)]

WING = [(0.080, 0.548), (0.130, 0.505), (0.200, 0.462), (0.280, 0.424),
        (0.3695, 0.394), (0.3695, 0.470), (0.320, 0.512), (0.250, 0.590),
        (0.185, 0.680), (0.130, 0.762), (0.080, 0.838)]

BOOM = [(0.066, 0.640), (0.106, 0.612), (0.150, 0.632), (0.174, 0.700),
        (0.176, 0.830), (0.170, 0.920), (0.146, 0.968), (0.118, 0.986),
        (0.098, 0.958), (0.094, 0.870), (0.086, 0.780), (0.070, 0.700)]

TAILPLANE = [(0.176, 0.812), (0.248, 0.868), (0.246, 0.902), (0.176, 0.880)]

FIN = [(0.132, 0.700), (0.166, 0.748), (0.169, 0.930), (0.135, 0.900)]

BODY_PROFILE = [(0.000, 0.000), (0.020, 0.011), (0.060, 0.024), (0.100, 0.034),
                (0.140, 0.042), (0.190, 0.050), (0.250, 0.057), (0.320, 0.064),
                (0.400, 0.073), (0.470, 0.083), (0.545, 0.094), (0.620, 0.102),
                (0.700, 0.106), (0.780, 0.103), (0.860, 0.094), (0.920, 0.082),
                (0.965, 0.070), (0.990, 0.056)]

CANOPY = [(0.000, 0.156), (0.026, 0.172), (0.034, 0.205), (0.030, 0.240), (0.000, 0.262)]

NOZZLE_Y, NOZZLE_X, NOZZLE_R = 0.930, 0.055, 0.042
STAR_CY, STAR_CX = 0.548, 0.252

STAR = ["    #    ",
        "   ###   ",
        "  #####  ",
        "#########",
        " ####### ",
        "   ###   ",
        "  #   #  "]


def body_hw(y: float) -> float:
    return float(np.interp(y, [p[0] for p in BODY_PROFILE], [p[1] for p in BODY_PROFILE]))


def mirror(pts):
    return [(-x, y) for (x, y) in reversed(pts)]


def _raster(pts_list, W: int, H: int) -> np.ndarray:
    raster = Image.new("L", (W, H), 0)
    dr = ImageDraw.Draw(raster)
    for pts in pts_list:
        dr.polygon([((x + HALF_SPAN) / (2 * HALF_SPAN) * W, y * H) for (x, y) in pts], fill=255)
    arr = np.array(raster) > 127
    arr[:, : W // 2] = arr[:, W // 2:][:, ::-1]
    return arr


def build_mask(W: int, H: int) -> np.ndarray:
    raster = Image.new("L", (W, H), 0)
    dr = ImageDraw.Draw(raster)

    def poly(pts):
        dr.polygon([((x + HALF_SPAN) / (2 * HALF_SPAN) * W, y * H) for (x, y) in pts], fill=255)

    for shape in (CANARD, WING, BOOM, TAILPLANE):
        poly(shape)
        poly(mirror(shape))

    right, left = [], []
    for y in np.linspace(0, 0.99, 240):
        hw = body_hw(float(y))
        right.append(((hw + HALF_SPAN) / (2 * HALF_SPAN) * W, y * H))
        left.append(((-hw + HALF_SPAN) / (2 * HALF_SPAN) * W, y * H))
    dr.polygon(right + left[::-1], fill=255)

    arr = np.array(raster) > 127
    arr[:, : W // 2] = arr[:, W // 2:][:, ::-1]
    return arr


def build_parts(W: int, H: int) -> dict[str, np.ndarray]:
    """Each surface as its own binary mask, mirrored. Seams between them are what
    make the planform read as wings and canards rather than one blob."""
    body_r, body_l = [], []
    for y in np.linspace(0, 0.99, 240):
        hw = body_hw(float(y))
        body_r.append(((hw + HALF_SPAN) / (2 * HALF_SPAN) * W, y * H))
        body_l.append(((-hw + HALF_SPAN) / (2 * HALF_SPAN) * W, y * H))
    parts = {
        "body": [body_r + body_l[::-1]],
        "wing": [WING, mirror(WING)],
        "canard": [CANARD, mirror(CANARD)],
        "boom": [BOOM, mirror(BOOM)],
        "tailplane": [TAILPLANE, mirror(TAILPLANE)],
    }
    return {k: _raster(v, W, H) for k, v in parts.items()}


def main() -> None:
    cell_w = (2 * HALF_SPAN) / COLS
    cell_h = cell_w * CELL_ASPECT
    rows = int(round(LENGTH / cell_h))

    W, H = COLS * SUPERSAMPLE, rows * SUPERSAMPLE
    arr = build_mask(W, H)

    cov = np.zeros((rows, COLS))
    for r in range(rows):
        for c in range(COLS):
            cov[r, c] = arr[r * SUPERSAMPLE:(r + 1) * SUPERSAMPLE,
                            c * SUPERSAMPLE:(c + 1) * SUPERSAMPLE].mean()

    inside = cov > 0.45
    nb = (np.roll(inside, 1, 0) & np.roll(inside, -1, 0)
          & np.roll(inside, 1, 1) & np.roll(inside, -1, 1))
    inside = inside | (nb & (cov > 0.10))

    edge = inside & ~(np.roll(inside, 1, 0) & np.roll(inside, -1, 0)
                      & np.roll(inside, 1, 1) & np.roll(inside, -1, 1))
    outline = edge | ((cov > 0.28) & ~inside)

    dist = np.zeros((rows, COLS))
    reach = outline.copy()
    dist[outline] = 1
    for step in range(2, 60):
        reach = (reach | np.roll(reach, 1, 0) | np.roll(reach, -1, 0)
                 | np.roll(reach, 1, 1) | np.roll(reach, -1, 1)) & inside
        dist[reach & (dist == 0)] = step
    dist[inside & (dist == 0)] = 59

    chars = np.full((rows, COLS), " ", dtype="<U1")
    cols = np.full((rows, COLS), -1, int)
    cx = COLS // 2

    def put(r, c, ch_, col, only_inside=True):
        if 0 <= r < rows and 0 <= c < COLS and (inside[r, c] or not only_inside):
            chars[r, c], cols[r, c] = ch_, col

    # fill: lit spine, shaded band against the hull, plate elsewhere
    for r in range(rows):
        for c in range(COLS):
            if not inside[r, c]:
                continue
            d = int(dist[r, c])
            chars[r, c], cols[r, c] = " ", -1

    # wing surfaces: light the leading and trailing edges so the sweep reads
    for c in range(COLS):
        idx = np.nonzero(inside[:, c])[0]
        if len(idx) == 0:
            continue
        if abs(c - cx) > 9:
            put(int(idx[0]), c, "\u2584", LIGHT)
            put(int(idx[-1]), c, "\u2580", LIGHT)

    # wingtip pods: the Su-47 carries sensor rails on both tips
    edge_cols = [c for c in range(COLS) if inside[:, c].any()]
    for c in (min(edge_cols), min(edge_cols) + 1, max(edge_cols) - 1, max(edge_cols)):
        idx = np.nonzero(inside[:, c])[0]
        if len(idx) == 0:
            continue
        for r in range(idx[0] + 1, idx[-1]):
            put(int(r), c, "\u2588", LIGHT)

    # stroke: hull first
    for r in range(rows):
        for c in range(COLS):
            if outline[r, c]:
                chars[r, c], cols[r, c] = "\u2588", INK

    # wing root seams: a drawn line where each wing meets the fuselage, so the
    # forward sweep reads as a wing rather than one continuous slab
    for side in (-1, 1):
        c = cx + side * int(round(0.098 / cell_w))
        for r in range(int(0.548 / cell_h), min(rows, int(0.838 / cell_h) + 1)):
            if inside[r, c]:
                chars[r, c], cols[r, c] = "\u2588", INK

    # pitot spike above the radome
    r_nose = next((r for r in range(rows) if inside[r, cx] or inside[r, cx - 1]), 0)
    for r in range(max(0, r_nose - 2), r_nose):
        chars[r, cx - 1], cols[r, cx - 1] = "\u2502", INK
        chars[r, cx], cols[r, cx] = "\u2502", INK

    # white radome
    for r in range(rows):
        y = (r + 0.5) * cell_h
        if y > 0.150:
            break
        cols_in = np.nonzero(inside[r])[0]
        if len(cols_in) == 0:
            continue
        lo, hi = int(cols_in[0]), int(cols_in[-1])
        for c in range(lo + 1, hi):
            if y < 0.048:
                put(r, c, "\u2588", WHITE)
            elif y < 0.082:
                put(r, c, "\u2588", WHITE)
            else:
                put(r, c, "\u2588", LIGHT)

    # canopy
    cy0, cy1 = 0.156, 0.262
    for r in range(rows):
        y = (r + 0.5) * cell_h
        if not (cy0 < y < cy1):
            continue
        hw = float(np.interp(y, [p[1] for p in CANOPY], [p[0] for p in CANOPY]))
        c0, c1 = cx - int(round(hw / cell_w)), cx + int(round(hw / cell_w))
        for c in range(c0, c1 + 1):
            if not inside[r, c]:
                continue
            if c in (c0, c1):
                put(r, c, "\u2588", INK)
            elif y < cy0 + 0.024:
                put(r, c, "\u2588", INK)
            elif y < cy0 + 0.055:
                put(r, c, "\u2588", GLASS)
            else:
                put(r, c, "\u2588", INK)

    # dorsal seam + panel lines
    for r in range(rows):
        y = (r + 0.5) * cell_h
        if 0.270 < y < 0.960:
            for c in (cx - 1, cx):
                if inside[r, c]:
                    cols[r, c] = LINE
    for frac in (0.300, 0.392, 0.470, 0.620):
        r = int(frac / cell_h)
        for c in range(cx - 6, cx + 7):
            if 0 <= r < rows and inside[r, c] and chars[r, c] in ("\u2588", "\u2588"):
                chars[r, c], cols[r, c] = "\u00b7", LINE

    # twin canted fins: raised wedge, pale leading edge, ink outline
    r0, r1 = int(FIN[0][1] / cell_h), int(FIN[-1][1] / cell_h)
    for side in (-1, 1):
        for r in range(r0, min(rows, r1 + 1)):
            y = (r + 0.5) * cell_h
            a = float(np.interp(y, [FIN[0][1], FIN[1][1]], [FIN[0][0], FIN[1][0]]))
            b = float(np.interp(y, [FIN[2][1], FIN[3][1]], [FIN[2][0], FIN[3][0]]))
            ca = cx + side * int(round(a / cell_w))
            cb = cx + side * int(round(b / cell_w))
            lo, hi = sorted((ca, cb))
            if hi - lo < 2:
                hi = lo + 3 if side > 0 else hi
                lo = hi - 3 if side < 0 else lo
            for c in range(lo, hi + 1):
                if not inside[r, c]:
                    continue
                if c in (lo, hi):
                    put(r, c, "\u2588", INK)
                elif y < FIN[1][1] and c == (lo + 1 if side > 0 else hi - 1):
                    put(r, c, "\u2588", LIGHT)
                else:
                    put(r, c, "\u2588", PLATE)

    # twin nozzles
    nr = int(NOZZLE_Y / cell_h)
    R = NOZZLE_R / cell_w
    for side in (-1, 1):
        ncx = cx + side * int(round(NOZZLE_X / cell_w))
        for r in range(nr - int(R) - 1, nr + int(R) + 2):
            for c in range(ncx - int(R) - 1, ncx + int(R) + 2):
                if not (0 <= r < rows and 0 <= c < COLS) or not inside[r, c]:
                    continue
                rad = (((r - nr) / R) ** 2 + ((c - ncx) / R) ** 2) ** 0.5
                if rad < 0.38:
                    put(r, c, "\u2588", INK)
                elif rad < 0.80:
                    put(r, c, "\u2588", GLASS)
                elif rad < 1.04:
                    put(r, c, "\u2588", INK)

    # red stars with white border
    sy = int(STAR_CY / cell_h)
    for side in (-1, 1):
        sc = cx + side * int(round(STAR_CX / cell_w))
        rr0, cc0 = sy - len(STAR) // 2, sc - len(STAR[0]) // 2
        star = {(rr0 + i, cc0 + j) for i, line in enumerate(STAR)
                for j, v in enumerate(line) if v == "#"}
        ring = {(r + dr, c + dc) for (r, c) in star
                for dr in (-1, 0, 1) for dc in (-1, 0, 1)} - star
        for (r, c) in sorted(ring):
            put(r, c, "\u2588", WHITE)
        for (r, c) in sorted(star):
            put(r, c, "\u2588", RED)

    # exact symmetry
    for r in range(rows):
        for c in range(COLS // 2):
            chars[r, COLS - 1 - c] = chars[r, c]
            cols[r, COLS - 1 - c] = cols[r, c]

    out_rows = []
    for r in range(rows):
        line = "".join(chars[r])
        runs, c = [], 0
        while c < COLS:
            n = 1
            while c + n < COLS and cols[r, c + n] == cols[r, c]:
                n += 1
            runs.append(f"{cols[r, c]}:{n}")
            c += n
        out_rows.append([line, ",".join(runs)])

    payload = {"meta": {"subject": "Sukhoi Su-47 Berkut", "view": "top-down",
                        "grid": [COLS, rows], "charAspect": CELL_ASPECT,
                        "palette": {str(k): v for k, v in PALETTE.items()},
                        "source": "binary symmetric planform mask, Su-47 three-view"},
               "rows": out_rows}
    blob = json.dumps(payload, separators=(",", ":"))
    for dest in (ROOT / "src" / "data" / "su47-static.json",
                 ROOT / "public" / "ascii" / "su47-static.json"):
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(blob)
    print(f"grid {COLS}x{rows}")

    cw, ch = 6, round(6 * CELL_ASPECT)
    img = Image.new("RGB", (COLS * cw, rows * ch), "#ffffff")
    d2 = ImageDraw.Draw(img)
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", ch)
    for r in range(rows):
        for c in range(COLS):
            if chars[r, c] == " " or cols[r, c] < 0:
                continue
            d2.text((c * cw, r * ch - ch * 0.16), chars[r, c], font=font, fill=PALETTE[cols[r, c]])
    img.save(ROOT / "refs" / "preview_static.png")
    (ROOT / "refs" / "preview_text.txt").write_text("\n".join("".join(r) for r in chars) + "\n")
    print("\n".join("".join(r) for r in chars))


if __name__ == "__main__":
    main()
