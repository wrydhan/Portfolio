#!/usr/bin/env python3
"""
Su-47 Berkut -> coloured ASCII frames, derived from real flight footage.

Nothing is modelled. Each frame is an actual video frame of the aircraft:

  source : "Su-47 Berkut - Extreme Maneuverability" (YouTube, c2MW8DoJJXg),
           MAKS flight-display footage of the Berkut.

Pipeline per frame
  1. key the aircraft off the sky by colour (sky is blue, airframe is not),
  2. take the largest connected blob, fill its holes, crop to it,
  3. map that crop onto a 200 x 84 glyph grid (area-averaged),
  4. set the glyph from luminance and the colour from the pixel's own tone,
     snapped to an ink-on-paper palette plus two accents.

Fetch the source first:

  yt-dlp -f "b[height<=480]/b" -o fly2.mp4 https://www.youtube.com/watch?v=c2MW8DoJJXg

then

  python3 scripts/generate-ascii-frames.py

Writes public/ascii/su47-frames.json and two preview PNGs.
"""

import io
import json
import os
import subprocess

import numpy as np
from PIL import Image
from scipy import ndimage

VIDEO = os.environ.get("SU47_VIDEO", "fly2.mp4")
W, H = 360, 270          # source frame
GW, GH = 200, 84         # glyph grid
CELL = 0.52              # glyph cell width / height
RAMP = " .`:;~-+=xo*OX#%@&"
FPS = 12
WINDOW = (60.0, 130.0)   # seconds of the source used
TARGET = 72              # frames kept

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_JSON = os.path.join(ROOT, "public", "ascii", "su47-frames.json")
OUT_PNG = os.path.join(ROOT, "public", "ascii")

PALETTE = [
    "#ffffff",  # 0 paper
    "#eef1f3",  # 1 sunlit airframe
    "#d8dfe4",  # 2 airframe white
    "#bcc7ce",  # 3
    "#9aa8b3",  # 4 shaded
    "#77858f",  # 5 shadow
    "#525d66",  # 6 deep shade
    "#2f373d",  # 7 dark structure
    "#000000",  # 8 ink outline
    "#b3271e",  # 9 red markings
    "#8c5a2b",  # 10 warm nozzle / bare metal
]


def read_frames():
    """Decode the used window of the source video to RGB frames."""
    start, end = WINDOW
    p = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", str(start), "-t", str(end - start), "-i", VIDEO,
         "-vf", f"fps={FPS}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True,
    )
    if p.returncode != 0:
        raise SystemExit(f"ffmpeg failed: {p.stderr.decode()[:400]}")
    buf = np.frombuffer(p.stdout, np.uint8)
    n = len(buf) // (W * H * 3)
    return start, buf[: n * W * H * 3].reshape(n, H, W, 3).astype(np.int16)


def key_jet(a):
    """Aircraft mask: everything that is not sky."""
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    lum = a.mean(2)
    sky = (b > r + 10) & (b > g - 4) & (lum > 70)
    m = ndimage.binary_opening(~sky, np.ones((2, 2)))
    lab, k = ndimage.label(m, np.ones((3, 3)))
    if k == 0:
        return None
    sizes = ndimage.sum(m, lab, range(1, k + 1))
    i = int(np.argmax(sizes)) + 1
    if sizes[i - 1] < 900:
        return None
    return ndimage.binary_fill_holes(lab == i)


def good(a, m):
    """Reject frames where the jet is clipped, tiny or a keying artefact."""
    ys, xs = np.where(m)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    if x0 <= 1 or y0 <= 1 or x1 >= W - 2 or y1 >= H - 2:
        return None
    w, h = x1 - x0, y1 - y0
    if w < 75 or h < 26:
        return None
    if m.sum() / (w * h) < 0.22:
        return None
    return int(x0), int(y0), int(x1) + 1, int(y1) + 1


def to_grid(a, m, box):
    x0, y0, x1, y1 = box
    pad = 3
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(W, x1 + pad), min(H, y1 + pad)
    crop, cm = a[y0:y1, x0:x1], m[y0:y1, x0:x1]

    aspect = crop.shape[1] / max(1, crop.shape[0])
    cw = GW
    ch = int(round(cw * CELL / aspect))
    if ch > GH:
        ch = GH
        cw = int(round(ch * aspect / CELL))

    img = Image.fromarray(crop.astype(np.uint8)).resize((cw, ch), Image.LANCZOS)
    cov = np.array(Image.fromarray((cm * 255).astype(np.uint8)).resize((cw, ch), Image.BOX)) / 255.0
    rgb = np.array(img).astype(float)

    ox, oy = (GW - cw) // 2, (GH - ch) // 2
    chars = np.full((GH, GW), " ", dtype="<U1")
    bands = np.full((GH, GW), -1, np.int8)

    for j in range(ch):
        for i in range(cw):
            if cov[j, i] < 0.35:
                continue
            r, g, b = rgb[j, i]
            ink = 1.0 - (r + g + b) / 765.0
            chars[oy + j, ox + i] = RAMP[min(len(RAMP) - 1, int(round(ink * (len(RAMP) - 1))))]
            mx, mn = max(r, g, b), min(r, g, b)
            sat = (mx - mn) / max(1.0, mx)
            y = oy + j
            x = ox + i
            if sat > 0.40 and r > g + 14 and r > b + 14:
                bands[y, x] = 9
            elif ink > 0.72:
                bands[y, x] = 8
            elif sat > 0.16 and b > r + 8:
                bands[y, x] = 2
            else:
                bands[y, x] = int(min(7, max(0, round(ink * 7.4))))
    return chars, bands


def to_runs(chars, bands):
    rows = []
    for y in range(GH):
        runs, cur, buf = [], None, ""
        for x in range(GW):
            b = int(bands[y, x])
            ch = chars[y, x]
            if b != cur:
                if buf:
                    runs.append([cur, buf])
                cur, buf = b, ch
            else:
                buf += ch
        if buf:
            runs.append([cur, buf])
        while runs and not runs[-1][1].strip():
            runs.pop()
        rows.append(runs)
    while rows and not rows[-1]:
        rows.pop()
    return rows


def preview(frame_runs, path, scale=6):
    from PIL import ImageDraw, ImageFont
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 12)
    cw, chh = font.getbbox("M")[2], 15
    img = Image.new("RGB", (GW * cw, GH * chh), "#ffffff")
    d = ImageDraw.Draw(img)
    for y, row in enumerate(frame_runs):
        x = 0
        for b, text in row:
            if b < 0:
                pass
            else:
                d.text((x, y * chh), text, font=font, fill=PALETTE[b])
            x += len(text) * cw
    img = img.resize((GW * cw * scale // 2, GH * chh * scale // 2), Image.LANCZOS)
    img.save(path)
    print("preview", path)


def main():
    start, frames = read_frames()
    kept, times = [], []
    for idx, a in enumerate(frames):
        m = key_jet(a)
        if m is None:
            continue
        box = good(a, m)
        if box is None:
            continue
        kept.append((a, m, box))
        times.append(round(start + idx / FPS, 3))
    print(f"clean frames {len(kept)} of {len(frames)}")

    if len(kept) > TARGET:
        step = len(kept) / TARGET
        sel = [int(i * step) for i in range(TARGET)]
        kept = [kept[i] for i in sel]
        times = [times[i] for i in sel]

    out = []
    for a, m, box in kept:
        chars, bands = to_grid(a, m, box)
        out.append(to_runs(chars, bands))

    payload = {
        "meta": {
            "subject": "Su-47 Berkut",
            "source": {
                "title": "Su-47 Berkut - Extreme Maneuverability",
                "video": "https://www.youtube.com/watch?v=c2MW8DoJJXg",
                "frames": "real video frames, keyed off the sky; nothing modelled",
                "timestamps": times[:3] + ["..."] + times[-2:],
            },
            "grid": [GW, GH],
            "frames": len(out),
            "charAspect": CELL,
            "palette": PALETTE,
            "generator": "scripts/generate-ascii-frames.py",
        },
        "frames": out,
    }
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, "w") as fh:
        json.dump(payload, fh, separators=(",", ":"))
    print("wrote", OUT_JSON, os.path.getsize(OUT_JSON), "bytes,", len(out), "frames")

    for i, name in ((0, "preview-01.png"), (len(out) // 2, "preview-02.png")):
        preview(out[i], os.path.join(OUT_PNG, name))


if __name__ == "__main__":
    main()
