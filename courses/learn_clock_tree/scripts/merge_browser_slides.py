#!/usr/bin/env python3
"""Merge consecutive duplicate 'Browser lab track' slides in transcripts."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def renumber(text: str) -> str:
    i = 0

    def repl(m: re.Match) -> str:
        nonlocal i
        i += 1
        return f"## Slide {i} — {m.group(1)}"

    return re.sub(r"^## Slide \d+ — (.+)$", repl, text, flags=re.M)


def merge(text: str) -> str:
    # Pattern: Browser lab with image + short prose, then another Browser lab with more prose
    pat = re.compile(
        r"(## Slide \d+ — Browser lab track\n\n"
        r"!\[Browser lab starter\]\(assets/lab-starter\.png\)\n\n"
        r")([^\n#].*?)\n\n"
        r"## Slide \d+ — Browser lab track\n\n"
        r"(.+?)(?=\n## Slide |\Z)",
        re.S,
    )

    def repl(m: re.Match) -> str:
        a = m.group(2).strip()
        b = m.group(3).strip()
        # Prefer the longer original browser prose if a is the generic placeholder
        body = b if len(b) > len(a) else f"{a}\n\n{b}"
        if a in b:
            body = b
        elif b in a:
            body = a
        return f"{m.group(1)}{body.strip()}\n\n"

    return renumber(pat.sub(repl, text))


def main() -> None:
    for p in sorted(ROOT.glob("module*/transcript.md")):
        t = p.read_text(encoding="utf-8")
        titles = re.findall(r"^## Slide \d+ — (.+)$", t, re.M)
        if titles.count("Browser lab track") < 2:
            continue
        newt = merge(t)
        if newt != t:
            p.write_text(newt.rstrip() + "\n", encoding="utf-8", newline="\n")
            print("merged", p.parent.name)


if __name__ == "__main__":
    main()
