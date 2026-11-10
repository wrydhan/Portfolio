#!/usr/bin/env python3
"""
Pre-render a Su-47 "Berkut" turntable to ASCII frames.

Nothing 3D ships to the browser: this script describes the airframe as triangle
meshes, spins it on a turntable with a CPU rasteriser (z-buffer + Lambert
shading + silhouette pass), quantises ink density onto a character ramp, and
writes every frame to public/ascii/su47-frames.json. The React component just
cycles pre-baked strings.

Run:  python3 scripts/generate-ascii-frames.py
"""

import json
import math
import os

import numpy as np

W, H = 126, 52          # character grid
N_FRAMES = 60
CHAR_ASPECT = 0.55      # glyph cell width / height (Fragment Mono)
RAMP = " .:-=+*x#%@"    # sparse -> dense ink
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "ascii", "su47-frames.json")

CAM_Z = 40.0
FOCAL = 84.0


# ---------------------------------------------------------------- geometry ---
def ring(z, cx, cy, rx, ry, n=28, belly=1.0):
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        sx, sy = math.cos(t), math.sin(t)
        pts.append(np.array([cx + rx * sx, cy + ry * sy * (belly if sy < 0 else 1.0), z]))
    return pts


def loft(rings):
    tris = []
    n = len(rings[0])
    for a, b in zip(rings, rings[1:]):
        for i in range(n):
            j = (i + 1) % n
            tris.append((a[i], a[j], b[j]))
            tris.append((a[i], b[j], b[i]))
    return tris


def fuselage():
    # (t nose->tail, half width, half height) — long ogive nose, blended LERX,
    # flat-ish belly, boat-tail into the nozzles.
    profile = [
        (0.000, 0.010, 0.010),
        (0.020, 0.150, 0.130),
        (0.050, 0.300, 0.260),
        (0.085, 0.430, 0.370),
        (0.125, 0.560, 0.470),
        (0.170, 0.700, 0.560),
        (0.220, 0.860, 0.660),
        (0.270, 1.020, 0.760),
        (0.320, 1.180, 0.840),
        (0.380, 1.320, 0.900),
        (0.440, 1.420, 0.950),
        (0.510, 1.480, 0.980),
        (0.580, 1.500, 0.990),
        (0.650, 1.480, 0.980),
        (0.720, 1.400, 0.950),
        (0.790, 1.280, 0.900),
        (0.860, 1.120, 0.820),
        (0.920, 0.960, 0.740),
        (0.970, 0.820, 0.660),
        (1.000, 0.700, 0.600),
    ]
    secs = []
    for t, rx, ry in profile:
        z = 10.6 - 19.6 * t
        secs.append(ring(z, 0.0, 0.0, rx, ry, n=28, belly=0.70))
    tris = loft(secs)
    nose = secs[0]
    tip = np.array([0.0, 0.0, 11.4])
    for i in range(len(nose)):
        tris.append((tip, nose[(i + 1) % len(nose)], nose[i]))
    return tris


def plate(pts2, th, s=1, axis="y"):
    """Thin lifting surface from a 4-point planform in (x,z) or (x,y)."""
    top, bot = [], []
    for (a, b), t in zip(pts2, th):
        if axis == "y":
            top.append(np.array([s * a, t, b]))
            bot.append(np.array([s * a, -t, b]))
        else:  # extrude along x-ish planes (vertical tails)
            pass
    tris = [(top[0], top[1], top[2]), (top[0], top[2], top[3])]
    tris += [(bot[0], bot[2], bot[1]), (bot[0], bot[3], bot[2])]
    for i in range(4):
        j = (i + 1) % 4
        tris += [(top[i], bot[i], bot[j]), (top[i], bot[j], top[j])]
    return tris


def wing(side=True):
    s = 1 if side else -1
    # forward-swept: the tip sits ahead of the root
    pts = [(1.35, 1.30), (7.90, 4.55), (7.90, 2.55), (1.35, -3.35)]
    th = [0.34, 0.075, 0.065, 0.30]
    return plate(pts, th, s)


def canard(side=True):
    s = 1 if side else -1
    pts = [(1.15, 6.35), (3.15, 7.15), (3.15, 6.60), (1.15, 5.70)]
    th = [0.12, 0.04, 0.04, 0.12]
    return plate(pts, th, s)


def tail(side=True):
    """Canted twin tail: quad in x-y, extruded in z."""
    s = 1 if side else -1
    root_le = np.array([s * 1.05, 0.75, -3.80])
    root_te = np.array([s * 1.10, 0.75, -8.40])
    tip_le = np.array([s * 2.35, 3.85, -6.20])
    tip_te = np.array([s * 2.35, 3.85, -8.15])
    d = 0.075
    tris = []
    for a, b, c in [(root_le, tip_le, tip_te), (root_le, tip_te, root_te)]:
        n = np.cross(b - a, c - a)
        n = n / (np.linalg.norm(n) + 1e-9) * d
        tris += [(a + n, b + n, c + n), (a - n, c - n, b - n)]
    shell = [root_le, tip_le, tip_te, root_te]
    for i in range(4):
        a, b = shell[i], shell[(i + 1) % 4]
        e = b - a
        n = np.cross(e, np.array([0.0, 0.0, 1.0]))
        ln = np.linalg.norm(n)
        if ln < 1e-9:
            n = np.array([0.0, 0.0, d])
        else:
            n = n / ln * d
        tris += [(a + n, b + n, b - n), (a + n, b - n, a - n)]
    return tris


def nacelle(side=True):
    s = 1 if side else -1
    cx, cy = s * 0.95, -0.40
    rings = []
    for z, r in [(-2.20, 0.46), (-3.60, 0.62), (-6.40, 0.64), (-8.60, 0.60), (-9.30, 0.52)]:
        pts = []
        for i in range(18):
            t = 2 * math.pi * i / 18
            pts.append(np.array([cx + r * math.cos(t), cy + r * math.sin(t), z]))
        rings.append(pts)
    tris = loft(rings)
    # nozzle face
    back = rings[-1]
    ctr = np.array([cx, cy, -9.30])
    for i in range(len(back)):
        tris.append((ctr, back[i], back[(i + 1) % len(back)]))
    return tris


def build():
    tris = list(fuselage())
    for side in (True, False):
        tris += wing(side) + canard(side) + tail(side) + nacelle(side)
    return np.array([[[float(c) for c in v] for v in t] for t in tris])


# ----------------------------------------------------------------- render ---
def rot_y(a):
    c, s = math.cos(a), math.sin(a)
    return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])


def rot_x(a):
    c, s = math.cos(a), math.sin(a)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])


LIGHT = np.array([-0.42, 0.86, 0.38])


def render(V, yaw, pitch, roll, ppu, light):
    R = rot_y(yaw) @ rot_x(pitch) @ rot_x(roll)
    P = np.einsum("ij,tkj->tki", R, V)
    n = np.cross(P[:, 1] - P[:, 0], P[:, 2] - P[:, 0])
    ln = np.linalg.norm(n, axis=1)
    ok = ln > 1e-9
    n[ok] /= ln[ok, None]

    zc = CAM_Z - P[:, :, 2]
    pr = FOCAL / np.maximum(zc, 1.0) * 3.0
    SX = P[:, :, 0] * pr
    SY = P[:, :, 1] * pr

    vis = (n[:, 2] > 0.015) & ok
    lum = np.clip(n @ light, 0.0, 1.0)

    zb = np.full((H, W), -1e9)
    ink = np.zeros((H, W))

    for ti in range(len(P)):
        if not vis[ti]:
            continue
        tx = W / 2 + (SX[ti] * ppu) / CHAR_ASPECT
        ty = H / 2 - SY[ti] * ppu
        x0 = max(int(np.floor(tx.min())), 0)
        x1 = min(int(np.ceil(tx.max())) + 1, W)
        y0 = max(int(np.floor(ty.min())), 0)
        y1 = min(int(np.ceil(ty.max())) + 1, H)
        if x1 <= x0 or y1 <= y0:
            continue
        ax, ay, bx, by, cx, cy = tx[0], ty[0], tx[1], ty[1], tx[2], ty[2]
        den = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy)
        if abs(den) < 1e-9:
            continue
        yy, xx = np.mgrid[y0:y1, x0:x1]
        gx, gy = xx + 0.5, yy + 0.5
        w0 = ((by - cy) * (gx - cx) + (cx - bx) * (gy - cy)) / den
        w1 = ((cy - ay) * (gx - cx) + (ax - cx) * (gy - cy)) / den
        w2 = 1.0 - w0 - w1
        ins = (w0 >= -1e-7) & (w1 >= -1e-7) & (w2 >= -1e-7)
        if not ins.any():
            continue
        dep = w0 * zc[ti][0] + w1 * zc[ti][1] + w2 * zc[ti][2]
        sub = zb[y0:y1, x0:x1]
        win = np.where(ins, dep, -1e9) > sub
        if not win.any():
            continue
        sub[win] = np.where(ins, dep, -1e9)[win]
        shade = 0.20 + 0.80 * lum[ti] ** 0.85
        ink[y0:y1, x0:x1][win] = np.clip(1.0 - shade, 0.0, 1.0)

    # silhouette pass: a filled cell touching empty space becomes full ink,
    # which is what makes the airframe read as an aircraft at small sizes.
    filled = zb > -1e9
    pad = np.zeros((H + 2, W + 2), dtype=bool)
    pad[1:-1, 1:-1] = filled
    edge = filled & ~(pad[:-2, 1:-1] & pad[2:, 1:-1] & pad[1:-1, :-2] & pad[1:-1, 2:])
    ink[edge] = 1.0

    rows = []
    top = bottom = None
    for y in range(H):
        chars = []
        for x in range(W):
            if not filled[y, x]:
                chars.append(" ")
            else:
                idx = int(round(ink[y, x] * (len(RAMP) - 1)))
                chars.append(RAMP[max(0, min(len(RAMP) - 1, idx))])
        line = "".join(chars)
        if line.strip():
            top = y if top is None else top
            bottom = y
        rows.append(line)
    return rows, top, bottom


def main():
    V = build()
    light = LIGHT / np.linalg.norm(LIGHT)
    pitch = math.radians(-13.0)
    roll = math.radians(5.0)
    yaw0 = math.radians(-24.0)

    def dims(yaw):
        R = rot_y(yaw) @ rot_x(pitch) @ rot_x(roll)
        P = np.einsum("ij,tkj->tki", R, V)
        pr = FOCAL / np.maximum(CAM_Z - P[:, :, 2], 1.0) * 3.0
        return P[:, :, 0] * pr, P[:, :, 1] * pr

    mx = my = 0.0
    for f in range(N_FRAMES):
        sx, sy = dims(yaw0 + 2 * math.pi * f / N_FRAMES)
        mx = max(mx, float(np.abs(sx).max()))
        my = max(my, float(np.abs(sy).max()))
    u = max(2 * my / (H - 4), 2 * mx / ((W - 4) * CHAR_ASPECT))
    ppu = 1.0 / u

    frames = []
    for f in range(N_FRAMES):
        yaw = yaw0 + 2 * math.pi * f / N_FRAMES
        rows, top, bottom = render(V, yaw, pitch, roll, ppu, light)
        frames.append(rows)
        if f % 12 == 0:
            print(f"frame {f}: rows {top}..{bottom}")

    payload = {
        "meta": {
            "subject": "Su-47 Berkut",
            "grid": [W, H],
            "ramp": RAMP,
            "frames": N_FRAMES,
            "charAspect": CHAR_ASPECT,
            "generator": "scripts/generate-ascii-frames.py",
        },
        "frames": frames,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as fh:
        json.dump(payload, fh, separators=(",", ":"))
    print("wrote", os.path.normpath(OUT), os.path.getsize(OUT), "bytes")


if __name__ == "__main__":
    main()
