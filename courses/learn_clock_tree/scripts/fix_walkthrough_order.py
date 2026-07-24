#!/usr/bin/env python3
"""Move walkthrough block after slide 2; add Browser lab slide after walkthrough."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BEGIN = "<!-- algorithm-walkthrough -->"
END = "<!-- /algorithm-walkthrough -->"


def renumber(text: str) -> str:
    i = 0

    def repl(m: re.Match) -> str:
        nonlocal i
        i += 1
        return f"## Slide {i} — {m.group(1)}"

    return re.sub(r"^## Slide \d+ — (.+)$", repl, text, flags=re.M)


def fix(text: str) -> str:
    # Remove empty Browser lab slide that only precedes the walkthrough block.
    text = re.sub(
        r"## Slide \d+ — Browser lab track\n\n"
        + re.escape(BEGIN)
        + r"\n\n",
        BEGIN + "\n\n",
        text,
        count=1,
    )

    # Ensure walkthrough begins right after slide 2 (The idea).
    if BEGIN not in text:
        text = re.sub(
            r"(## Slide 2 — .+?\n\n)(?=## Slide 3 — )",
            r"\1" + BEGIN + "\n\n",
            text,
            count=1,
            flags=re.S,
        )

    # Orphan prose between walkthrough end and next slide heading.
    pat = re.compile(
        re.escape(END)
        + r"\n\n+"
        r"((?:(?!^## Slide ).)+?)\n\n"
        r"(## Slide \d+ — )",
        re.S | re.M,
    )

    def orphan_repl(m: re.Match) -> str:
        body = m.group(1).strip()
        if not body or "lab-starter.png" in body:
            return m.group(0)
        return (
            f"{END}\n\n"
            f"## Slide 999 — Browser lab track\n\n"
            f"![Browser lab starter](assets/lab-starter.png)\n\n"
            f"{body}\n\n"
            f"{m.group(2)}"
        )

    text = pat.sub(orphan_repl, text)

    # Add lab-starter image to Browser lab slide if missing.
    if "Browser lab track" in text and "lab-starter.png" not in text:
        text = re.sub(
            r"(## Slide \d+ — Browser lab track\n\n)(?!\!\[)",
            r"\1![Browser lab starter](assets/lab-starter.png)\n\n",
            text,
            count=1,
        )

    return renumber(text)


def main() -> None:
    n = 0
    for path in sorted(ROOT.glob("module*/transcript.md")):
        old = path.read_text(encoding="utf-8")
        if BEGIN not in old:
            continue
        new = fix(old)
        if new != old:
            path.write_text(new.rstrip() + "\n", encoding="utf-8", newline="\n")
            print("fixed", path.parent.name)
            n += 1
    print(f"fixed_count {n}")


if __name__ == "__main__":
    main()
