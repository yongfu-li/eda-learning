#!/usr/bin/env python3
from pathlib import Path
root = Path(__file__).resolve().parents[1] / "scripts"
for name in ("capture_part_d.sh", "build_part_d_media.sh"):
    p = root / name
    b = p.read_bytes().replace(b"\r\n", b"\n").replace(b"\r", b"\n")
    p.write_bytes(b)
    print("fixed", p)
