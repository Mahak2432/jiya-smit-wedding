"""
Builds the share-preview image (1200 x 630) used by WhatsApp, Facebook, iMessage and Slack link previews.

Output: assets/og-image.jpg
Usage:  python tools/make_og.py   (needs Pillow: pip install pillow)
Fonts come from Windows (Georgia, Nirmala UI). On other systems, change FONT_* below to any installed font.
"""
import math
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "og-image.jpg")

IVORY = (251, 245, 232)
PAPER = (255, 251, 244)
BLUSH = (244, 213, 201)
GOLD = (177, 132, 58)
GOLD_SOFT = (230, 205, 151)
MARIGOLD = (232, 150, 31)
INK = (94, 26, 42)
INK_SOFT = (125, 75, 87)

FONT_SERIF = r"C:\Windows\Fonts\georgia.ttf"
FONT_SERIF_ITALIC = r"C:\Windows\Fonts\georgiai.ttf"


def font(path, size, index=0):
    return ImageFont.truetype(path, size, index=index)


def background():
    img = Image.new("RGB", (W, H), IVORY)
    # Soft blush glows.
    glow = Image.new("RGB", (W, H), IVORY)
    d = ImageDraw.Draw(glow)
    d.ellipse((760, -220, 1380, 330), fill=BLUSH)
    d.ellipse((-260, 380, 340, 880), fill=(247, 227, 185))
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    img = Image.blend(img, glow, 0.85)
    return img


def arch_points(cx, top, width, height, steps=120):
    """Outline of an arch: a semicircle on top of a straight, rounded-corner body."""
    r = width / 2.0
    pts = []
    for i in range(steps + 1):
        a = math.pi + math.pi * i / steps  # from left (pi) over the top to right (2pi)
        pts.append((cx + r * math.cos(a), top + r + r * math.sin(a)))
    pts.append((cx + r, top + height))
    pts.append((cx - r, top + height))
    return pts


def draw_arch(img):
    draw = ImageDraw.Draw(img)
    cx, top, width, height = 905, 70, 350, 490
    outer = arch_points(cx, top - 14, width + 28, height + 28)
    inner = arch_points(cx, top, width, height)

    # Paper panel
    draw.polygon(inner, fill=PAPER)
    # Gold double rule
    draw.line(outer + [outer[0]], fill=GOLD, width=3)
    draw.line(inner + [inner[0]], fill=GOLD_SOFT, width=2)

    # Marigold beads just outside the outer rule.
    beads = arch_points(cx, top - 30, width + 60, height + 60, steps=90)[:-2]  # arch only, no bottom corners
    for x, y in beads[::2]:
        draw.ellipse((x - 6, y - 6, x + 6, y + 6), fill=MARIGOLD)


def text_block(img):
    draw = ImageDraw.Draw(img)
    left = 90

    f_names = font(FONT_SERIF, 104)
    f_sub = font(FONT_SERIF_ITALIC, 52)
    f_line = font(FONT_SERIF, 40)
    f_small = font(FONT_SERIF, 34)

    draw.text((left, 160), "Jiya & Smit", font=f_names, fill=INK)
    draw.text((left + 4, 318), "Shubh Vivah", font=f_sub, fill=INK_SOFT)
    draw.line((left + 4, 402, left + 300, 402), fill=GOLD, width=2)
    draw.text((left + 4, 428), "Saturday, 12 December 2026", font=f_line, fill=INK)
    draw.text((left + 4, 484), "Jamuna Resort, Jhunjhunu, Rajasthan", font=f_small, fill=INK_SOFT)

    # Inside the arch: the monogram and the date.
    f_mono = font(FONT_SERIF, 96)
    f_arch_small = font(FONT_SERIF, 34)
    mono = "J & S"
    mw = draw.textlength(mono, font=f_mono)
    draw.text((905 - mw / 2, 260), mono, font=f_mono, fill=INK)
    d12 = "12 December"
    dw = draw.textlength(d12, font=f_arch_small)
    draw.text((905 - dw / 2, 390), d12, font=f_arch_small, fill=INK_SOFT)
    y2026 = "2026"
    yw = draw.textlength(y2026, font=f_arch_small)
    draw.text((905 - yw / 2, 430), y2026, font=f_arch_small, fill=INK_SOFT)


def main():
    img = background()
    draw_arch(img)
    text_block(img)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    img.convert("RGB").save(OUT, "JPEG", quality=90, optimize=True, progressive=True)
    print("Wrote", os.path.normpath(OUT), img.size)


if __name__ == "__main__":
    main()
