#!/usr/bin/env python3
"""
Render ONE static, coloured ASCII frame of the Su-47 from a traced silhouette.

The silhouette is not parametric: refs/mask.npy is a 450x602 binary mask traced
off a real top-down photograph of the aircraft (nose up). The forward sweep,
canards, wing roots, wingtips and tail booms in the output are the real outline.

Outputs:
  public/ascii/su47-static.json   rows of [chars, colour-runs]
  refs/preview_static.png         rendered preview for eyeballing the shape

One cell = one monospace character; cell aspect (advance / line-height) = 0.6.
"""

from __future__ import annotations

import json
import pathlib

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[1]
MASK = ROOT / "refs" / "mask.npy"

COLS = 152
CHAR_ASPECT = 0.6

# palette indices
INK, PLATE, LIT, GLASS, LIGHT, WHITE, RED, LINE, HAZE = range(9)
PALETTE = {
    INK: "#101015",     # silhouette outline / dark structure
    PLATE: "#575762",   # airframe plate
    LIT: "#727280",     # lit airframe surfaces (spine, wing tops)
    GLASS: "#7c7c88",   # canopy glint, nozzle rings
    LIGHT: "#c2c2cb",   # radome interior, leading edges, wingtip rails
    WHITE: "#ffffff",   # star border, nose highlight
    RED: "#c8102e",     # stars
    LINE: "#31313a",    # panel lines
    HAZE: "#cfcfd7",    # sub-cell alias at the silhouette edge
}

# traced anchors, mask pixels (450 x 602)
CENTRE_X = 225.2
RADOME_Y = (4.0, 74.0)
CANOPY_Y = (74.0, 150.0)
STAR_L = (61.7, 354.6)
STAR_R = (388.7, 354.6)
FIN_DX = 60.0
FIN_Y = (466.0, 566.0)
NOZZLE_Y = 572.0
NOZZLE_DX = 31.0
PANEL_Y = [(150.0, 182.0), (192.0, 222.0), (232.0, 262.0), (272.0, 300.0)]

STAR = [
    "   ###   ",
    "  #####  ",
    "#########",
    " ####### ",
    "  ## ##  ",
    "  #   #  ",
]


def runs_of(row: np.ndarray) -> list[tuple[int, int]]:
    idx = np.nonzero(row)[0]
    if len(idx) == 0:
        return []
    out = [(int(idx[0]), int(idx[0]))]
    for v in idx[1:]:
        if v > out[-1][1] + 1:
            out.append((int(v), int(v)))
        else:
            out[-1] = (out[-1][0], int(v))
    return out


def main() -> None:
    mask = np.load(MASK)
    # A top-down aircraft silhouette is solid, so any interior gap in the trace
    # is tracing error: the sunlit glint band across the inner wing, the slit
    # between fin and fuselage, sensor noise. Fill each row between its first and
    # last traced pixel, then fill enclosed holes.
    for y in range(mask.shape[0]):
        idx = np.nonzero(mask[y])[0]
        if len(idx):
            mask[y, idx[0]:idx[-1] + 1] = True
    H, W = mask.shape
    rows = int(round(H / W * COLS * CHAR_ASPECT))
    cw, ch = W / COLS, H / rows

    yedges = np.linspace(0, H, rows + 1).round().astype(int)
    xedges = np.linspace(0, W, COLS + 1).round().astype(int)
    cov = np.zeros((rows, COLS))
    for r in range(rows):
        for c in range(COLS):
            blk = mask[yedges[r]:yedges[r + 1], xedges[c]:xedges[c + 1]]
            if blk.size:
                cov[r, c] = blk.mean()

    inside = cov > 0.5
    cc = int(round(CENTRE_X / cw))

    # distance-to-edge (cells)
    border = inside & ~(
        np.roll(inside, 1, 0) & np.roll(inside, -1, 0)
        & np.roll(inside, 1, 1) & np.roll(inside, -1, 1)
    )
    dist = np.zeros((rows, COLS))
    reach = border.copy()
    dist[border] = 1
    for step in range(2, 34):
        reach = (reach | np.roll(reach, 1, 0) | np.roll(reach, -1, 0)
                 | np.roll(reach, 1, 1) | np.roll(reach, -1, 1)) & inside
        new = reach & (dist == 0)
        dist[new] = step
    dist[inside & (dist == 0)] = 33      # deep interior, never reached by the flood

    chars = np.full((rows, COLS), " ", dtype="<U1")
    cols = np.full((rows, COLS), -1, dtype=int)

    def setc(r: int, c: int, ch_: str, col: int, need_inside: bool = True) -> None:
        if 0 <= r < rows and 0 <= c < COLS and (inside[r, c] or not need_inside):
            chars[r, c] = ch_
            cols[r, c] = col

    # ---------- body ----------
    for r in range(rows):
        for c in range(COLS):
            f = cov[r, c]
            if not inside[r, c]:
                if f > 0.34:
                    chars[r, c], cols[r, c] = "\u2593", INK
                elif f > 0.14:
                    chars[r, c], cols[r, c] = "\u2591", HAZE
                continue
            d = dist[r, c]
            spine = abs(c - cc)
            if d <= 1:
                ch_, col = "\u2588", INK
            elif spine <= 2:
                ch_, col = "\u2592", LIT
            elif spine <= 7:
                ch_, col = "\u2593", LIT
            elif d <= 2:
                ch_, col = "\u2593", PLATE
            else:
                ch_, col = "\u2593", PLATE
            chars[r, c], cols[r, c] = ch_, col

    # leading edges = the forward-most surface of each vertical strip
    for c in range(COLS):
        col_idx = np.nonzero(inside[:, c])[0]
        if len(col_idx) == 0:
            continue
        setc(int(col_idx[0]), c, "\u2584", LIGHT)

    # wingtip rails
    for r in range(rows):
        rr = runs_of(inside[r])
        if not rr:
            continue
        lo, hi = rr[0][0], rr[-1][1]
        if hi - lo > 0.66 * COLS:
            for c in (lo, hi):
                setc(r, c, "\u2588", LIGHT)

    # ---------- white radome + pitot ----------
    for r in range(rows):
        yc = (r + 0.5) * ch
        if yc > RADOME_Y[1]:
            break
        rr = runs_of(inside[r])
        if not rr:
            continue
        lo, hi = min(rr, key=lambda t: abs((t[0] + t[1]) / 2 - cc))
        if hi - lo <= 1:
            setc(r, c, "\u2588", INK)
            continue
        for c in range(lo, hi + 1):
            if c in (lo, hi):
                setc(r, c, "\u2588", INK)
            elif yc < RADOME_Y[0] + 26:
                setc(r, c, "\u2588", WHITE)
            else:
                setc(r, c, "\u2592", LIGHT)

    # ---------- canopy ----------
    for r in range(rows):
        yc = (r + 0.5) * ch
        if not (CANOPY_Y[0] < yc < CANOPY_Y[1]):
            continue
        rr = runs_of(inside[r])
        if not rr:
            continue
        lo, hi = min(rr, key=lambda t: abs((t[0] + t[1]) / 2 - cc))
        if hi - lo < 3:
            continue
        for c in range(lo, hi + 1):
            if c in (lo, hi):
                setc(r, c, "\u2588", INK)
            elif yc < CANOPY_Y[0] + 16:
                setc(r, c, "\u2593", INK)          # windscreen frame
            elif yc < CANOPY_Y[0] + 40:
                setc(r, c, "\u2591", GLASS)        # glass glint
            else:
                setc(r, c, "\u2592", PLATE)        # rear canopy fairing

    # ---------- dorsal panel breaks (a few faint cross-lines, no boxes) ----------
    for y0, y1 in PANEL_Y:
        r0 = int(y0 / ch)
        half = max(3, int(10 / cw))
        for c in range(cc - half, cc + half + 1):
            if inside[r0, c] and chars[r0, c] in ("\u2593", "\u2592"):
                setc(r0, c, "\u00b7", LINE)

    # ---------- twin canted vertical fins (wedges inside the aft booms) ----------
    for side in (-1, 1):
        r0, r1 = int(FIN_Y[0] / ch), int(FIN_Y[1] / ch)
        for r in range(r0, r1 + 1):
            t = (r - r0) / max(1, (r1 - r0))
            c_in = int((CENTRE_X + side * (FIN_DX - 8 * t)) / cw)
            c_out = int((CENTRE_X + side * (FIN_DX + 14 * t)) / cw)
            lo, hi = sorted((c_in, c_out))
            for c in range(lo, hi + 1):
                if not inside[r, c]:
                    continue
                if c in (lo, hi):
                    setc(r, c, "\u2588", INK)
                elif c == lo + 1 or c == hi - 1:
                    setc(r, c, "\u2591", LIGHT)
                else:
                    setc(r, c, "\u2593", PLATE)
        # fin tip catch-light
        setc(r0, int((CENTRE_X + side * FIN_DX) / cw), "\u2591", WHITE)

    # ---------- exhaust nozzles between the booms ----------
    rr0 = int(NOZZLE_Y / ch)
    for side in (-1, 1):
        ccen = int((CENTRE_X + side * NOZZLE_DX) / cw)
        for r in range(rr0 - 5, rr0 + 6):
            for c in range(ccen - 6, ccen + 7):
                if not (0 <= r < rows and 0 <= c < COLS) or not inside[r, c]:
                    continue
                rad = (((r - rr0) / 4.6) ** 2 + ((c - ccen) / 5.4) ** 2) ** 0.5
                if rad < 0.5:
                    setc(r, c, "\u2593", INK)
                elif rad < 0.92:
                    setc(r, c, "\u2592", GLASS)
                elif rad < 1.18:
                    setc(r, c, "\u2588", INK)

    # ---------- red stars with white borders ----------
    for sx, sy in (STAR_L, STAR_R):
        r0 = int(sy / ch) - len(STAR) // 2
        c0 = int(sx / cw) - len(STAR[0]) // 2
        star = {(r0 + i, c0 + j) for i, line in enumerate(STAR)
                for j, v in enumerate(line) if v == "#"}
        ring = {(r + dr, c + dc) for (r, c) in star
                for dr in (-1, 0, 1) for dc in (-1, 0, 1)} - star
        for (r, c) in sorted(ring):
            setc(r, c, "\u2591", WHITE)
        for (r, c) in sorted(star):
            setc(r, c, "\u2588", RED)

    # ---------- emit ----------
    out_rows = []
    for r in range(rows):
        line = "".join(chars[r])
        runs, c = [], 0
        while c < COLS:
            col = cols[r, c]
            n = 1
            while c + n < COLS and cols[r, c + n] == col:
                n += 1
            runs.append(f"{col}:{n}")
            c += n
        out_rows.append([line, ",".join(runs)])

    payload = {
        "meta": {
            "subject": "Sukhoi Su-47 Berkut",
            "view": "top-down",
            "grid": [COLS, rows],
            "charAspect": CHAR_ASPECT,
            "palette": PALETTE,
            "source": "traced from a top-down reference photograph",
        },
        "rows": out_rows,
    }
    blob = json.dumps(payload, separators=(",", ":"))
    for dest in (ROOT / "public" / "ascii" / "su47-static.json",
                 ROOT / "src" / "data" / "su47-static.json"):
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(blob)
        print(f"wrote {dest} grid {COLS}x{rows}")

    # ---------- preview ----------
    cwpx, chpx = 8, 13
    img = Image.new("RGB", (COLS * cwpx + 24, rows * chpx + 24), "#ffffff")
    dr = ImageDraw.Draw(img)
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 13)
    for r in range(rows):
        for c in range(COLS):
            ch_ = chars[r, c]
            if ch_ == " " or cols[r, c] < 0:
                continue
            dr.text((12 + c * cwpx, 12 + r * chpx - 3), ch_, font=font,
                    fill=PALETTE[cols[r, c]])
    prev = ROOT / "refs" / "preview_static.png"
    img.save(prev)
    print(f"wrote {prev} {img.size}")


if __name__ == "__main__":
    main()
