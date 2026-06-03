#!/usr/bin/env python3
"""미션 꽃 단계 PNG — 여백 트림 + 알파 프린지 정리 (배경 사각형 아티팩트 완화)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "src" / "assets" / "mission-flowers"
PAD = 6
ALPHA_CUT = 40
ALPHA_SOLID = 245


def process(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    cleaned: list[tuple[int, int, int, int]] = []
    for r, g, b, a in im.getdata():
        if a < ALPHA_CUT:
            cleaned.append((0, 0, 0, 0))
        elif a >= ALPHA_SOLID:
            cleaned.append((r, g, b, 255))
        else:
            cleaned.append((r, g, b, a))
    im.putdata(cleaned)
    bbox = im.getbbox()
    if not bbox:
        return
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - PAD)
    y0 = max(0, y0 - PAD)
    x1 = min(im.width, x1 + PAD)
    y1 = min(im.height, y1 + PAD)
    im = im.crop((x0, y0, x1, y1))
    im.save(path, optimize=True)


def main() -> None:
    paths = sorted(ROOT.rglob("stage-*.png"))
    for path in paths:
        before = path.stat().st_size
        process(path)
        after = path.stat().st_size
        print(f"{path.relative_to(ROOT.parents[1])}: {before} -> {after} bytes")


if __name__ == "__main__":
    main()
