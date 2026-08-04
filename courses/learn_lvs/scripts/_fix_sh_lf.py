#!/usr/bin/env python3
from pathlib import Path
root = Path(__file__).resolve().parent
for p in root.glob("*.sh"):
    b = p.read_bytes().replace(b"\r\n", b"\n").replace(b"\r", b"\n")
    p.write_bytes(b)
    print("lf", p.name)
