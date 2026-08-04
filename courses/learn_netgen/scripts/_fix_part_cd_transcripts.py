#!/usr/bin/env python3
"""Fix learn_netgen Part C/D transcripts that open code fences with no spoken prose."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PART_C = [
    "module09-01-hash-devices-algo",
    "module09-03-match-nets-algo",
    "module10-01-permute-pins-algo",
    "module10-03-netgen-algo-engine",
]
PART_D = [
    "module14-01-netcomp-model",
    "module14-03-read-compare-c",
    "module15-03-contribute-netgen",
]


def fix(path: Path, try_prose: str, pseudo_prose: str) -> bool:
    t = path.read_text(encoding="utf-8")
    orig = t
    t, n1 = re.subn(r"(## Slide \d+ — Try these)\n\n```", rf"\1\n\n{try_prose}\n\n```", t, count=1)
    t, n2 = re.subn(r"(## Slide \d+ — Pseudocode)\n\n```", rf"\1\n\n{pseudo_prose}\n\n```", t, count=1)
    if t != orig:
        path.write_text(t, encoding="utf-8", newline="\n")
    print(f"{path.parent.name}: try={n1} pseudo={n2}")
    return t != orig


def main() -> None:
    for mid in PART_C:
        fix(ROOT / mid / "transcript.md", "From the common folder, run the Part C self-tests.", "Here is the check in plain steps.")
    for mid in PART_D:
        fix(ROOT / mid / "transcript.md", "From the common folder, run the internals self-test.", "Here is the checklist in plain steps.")


if __name__ == "__main__":
    main()
