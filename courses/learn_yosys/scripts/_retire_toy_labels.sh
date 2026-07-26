#!/usr/bin/env bash
# Patch MODULES.md + key READMEs: drop "(toy)" labels; refresh intro titles.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

python3 <<'PY'
from pathlib import Path
import re

root = Path(".")

# MODULES.md titles
mods = root / "docs" / "MODULES.md"
text = mods.read_text(encoding="utf-8")
text = text.replace("(toy)", "").replace("Welcome to Yosys (toy + real)", "Welcome to Yosys")
text = re.sub(r"  +\|", " |", text)
mods.write_text(text, encoding="utf-8")

replacements = {
    "module00-00-intro/README.md": (
        "# Module 00-00-intro: Welcome to Yosys (toy + real + algorithms)",
        "# Module 00-00-intro: Welcome to Yosys",
    ),
    "module05-01-yosys-engine/README.md": None,  # fix via regex
}

for path in root.glob("module*/README.md"):
    t = path.read_text(encoding="utf-8")
    n = t.replace(" (toy)", "").replace("(toy + real + algorithms)", "").replace("(toy + real)", "")
    n = re.sub(r"Welcome to Yosys\s*$", "Welcome to Yosys", n, flags=re.M)
    if n != t:
        path.write_text(n, encoding="utf-8")
        print("README", path)

# Course README blurb
cr = root / "README.md"
ct = cr.read_text(encoding="utf-8")
ct2 = ct.replace(
    "Part A toy pass literacy on `tiny_yosys.json`, Part B **real Yosys CLI/RTLIL evidence** on `rtl/tiny_and_or.v`, then Part C **Yosys algorithms** on `tiny_algo.json`",
    "Part A **pass map** on `tiny_yosys.json`, Part B **real Yosys CLI/RTLIL evidence** on `rtl/tiny_and_or.v`, then Part C **algorithms bound to real Yosys** on `tiny_algo.json` (+ dedicated RTL)",
)
ct2 = ct2.replace("Yosys engine (toy)", "Yosys engine")
if ct2 != ct:
    cr.write_text(ct2, encoding="utf-8")
    print("course README")

print("rename_ok")
PY
