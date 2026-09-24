"""
Image pipeline for the Khazna design preview.

Source: Amazon Berkeley Objects (ABO) dataset, (c) Amazon.com, licensed CC BY 4.0
https://amazon-berkeley-objects.s3.amazonaws.com/index.html
Changes made: trimmed, re-framed onto square canvases, resized, re-encoded as
WebP, and (for main images) background removed to produce cut-outs.

Usage: python3 process-images.py <originals_dir> <resolved.json> <out_dir>
Writes <out_dir>/manifest.json describing every generated asset.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC, RESOLVED, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(OUT, exist_ok=True)
resolved = json.load(open(RESOLVED))

PRODUCT_SIZES = [400, 800, 1200]
LIFE_SIZES = [800, 1600]
CUT_SIZES = [600, 1200]


def near_white_mask(arr, lo=238, spread=14):
    mn = arr.min(axis=2)
    mx = arr.max(axis=2)
    return (mn >= lo) & ((mx - mn) <= spread)


def content_bbox(arr):
    mask = ~near_white_mask(arr, lo=246, spread=10)
    # ignore isolated JPEG noise
    mask = ndimage.binary_opening(mask, iterations=2)
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return 0, 0, arr.shape[1], arr.shape[0]
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1


def square_frame(img, margin=0.085):
    arr = np.asarray(img)
    x0, y0, x1, y1 = content_bbox(arr)
    crop = img.crop((x0, y0, x1, y1))
    side = int(max(crop.width, crop.height) * (1 + 2 * margin))
    canvas = Image.new("RGB", (side, side), (255, 255, 255))
    canvas.paste(crop, ((side - crop.width) // 2, (side - crop.height) // 2))
    return canvas


def cutout(img):
    arr = np.asarray(img).astype(np.int16)
    cand = near_white_mask(arr, lo=232, spread=18)
    labels, _ = ndimage.label(cand)
    border = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
    bg = np.isin(labels, list(border))
    fg = ~bg
    fg = ndimage.binary_closing(fg, iterations=2)
    fg = ndimage.binary_fill_holes(fg)
    alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    a = np.asarray(alpha).astype(np.float32) / 255.0
    # soften near-white fringe along the edge
    whiteness = (arr.min(axis=2) - 200).clip(0, 55) / 55.0
    edge = (a > 0) & (a < 1)
    a = np.where(edge, a * (1 - 0.6 * whiteness), a)
    rgba = np.dstack([np.asarray(img), (a * 255).clip(0, 255).astype(np.uint8)])
    out = Image.fromarray(rgba, "RGBA")
    bbox = out.getbbox()
    return out.crop(bbox) if bbox else out


def save_sizes(img, base, sizes, quality, alpha=False):
    written = []
    for w in sizes:
        if img.width < w * 0.9 and w != sizes[0]:
            continue
        im = img.copy()
        if im.width > w:
            h = round(im.height * w / im.width)
            im = im.resize((w, h), Image.LANCZOS)
        path = f"{base}-{w}.webp"
        im.save(os.path.join(OUT, path), "WEBP", quality=quality, method=6)
        written.append({"w": im.width, "h": im.height, "file": path})
    return written


manifest = {}
for slug, spec in resolved.items():
    life = set(spec["life"])
    entries = []
    for n, iid in enumerate(spec["images"]):
        img = Image.open(os.path.join(SRC, f"{iid}.jpg")).convert("RGB")
        if iid in life:
            if img.width > 1600:
                img = img.resize((1600, round(img.height * 1600 / img.width)), Image.LANCZOS)
            files = save_sizes(img, f"{slug}-{n}", LIFE_SIZES, 76)
            entries.append({"kind": "scene", "files": files, "ratio": round(img.width / img.height, 4)})
        else:
            framed = square_frame(img)
            files = save_sizes(framed, f"{slug}-{n}", PRODUCT_SIZES, 80)
            entry = {"kind": "product", "files": files, "ratio": 1}
            if n == 0:
                cut = cutout(img)
                if cut.width > 1200 or cut.height > 1200:
                    s = 1200 / max(cut.width, cut.height)
                    cut = cut.resize((round(cut.width * s), round(cut.height * s)), Image.LANCZOS)
                cfiles = save_sizes(cut, f"{slug}-cut", [600, 1200] if cut.width >= 1000 else [600], 82, alpha=True)
                entry["cutout"] = {"files": cfiles, "ratio": round(cut.width / cut.height, 4)}
            entries.append(entry)
    manifest[slug] = {"source": spec["item"], "images": entries}
    print(slug, len(entries))

json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w"), indent=1)
