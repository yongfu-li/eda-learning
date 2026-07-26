#!/usr/bin/env python3
from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parents[1] / "common"
script = root / "scripts" / "run_evidence.sh"
script.write_bytes(script.read_bytes().replace(b"\r\n", b"\n").replace(b"\r", b"\n"))
for p in (root / "scripts").glob("*.tcl"):
    p.write_bytes(p.read_bytes().replace(b"\r\n", b"\n").replace(b"\r", b"\n"))
print("lf ok")
rc = subprocess.call(["bash", str(script)], cwd=str(root))
sys.exit(rc)
