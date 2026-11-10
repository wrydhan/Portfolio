#!/usr/bin/env python3
"""
Hero art pipeline, as it now stands: the reference photograph is MATTED (its
background removed) before any character conversion, then cropped to the
airframe and handed to ascii-magic.

Where each step runs
  1. matte   - on the Mac, where the seven originals live:
               rembg / u2net session -> alpha cut-out, largest component kept,
               holes filled, cropped to the alpha bbox -> <tag>.png (RGBA).
               Outputs: ~/su47_out/matte/{f6,cd8,3920,22a,060e,bf50,0957}.png
  2. convert - ascii-magic (same package as ascii-magic.com) on the cut-out.
               Two adjustments matter:
                 * invert luminance, because ascii-magic maps BRIGHTNESS to
                   glyph density and the jet is the dark object - without this
                   the knocked-out background renders as text and the airframe
                   as blank;
                 * point the alpha at 0 so the empty background can never
                   produce a glyph: this is what the un-matted attempts lacked,
                   and why they came back as tarmac noise with a black blob.
               Rendered at 150 columns, width_ratio = character aspect (1.667)
               so the planform is not stretched.
  3. mount   - rows are written to src/data/su47-static.json and drawn as one
               ink (#000) on paper. No palette, no coloured fills.
"""
import pathlib
print("Run steps 1 and 2 on the Mac that holds the originals; step 3 is the "
      "payload in src/data/su47-static.json.")
print(__doc__)
