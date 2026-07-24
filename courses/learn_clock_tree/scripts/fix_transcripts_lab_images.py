#!/usr/bin/env python3
"""Insert lab-starter image + tidy Browser lab slide after walkthrough inject."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
END = "<!-- /algorithm-walkthrough -->"
BEGIN = "<!-- algorithm-walkthrough -->"


def renumber(text: str) -> str:
    i = 0

    def repl(m: re.Match) -> str:
        nonlocal i
        i += 1
        return f"## Slide {i} — {m.group(1)}"

    return re.sub(r"^## Slide \d+ — (.+)$", repl, text, flags=re.M)


def fix(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "assets/lab-starter.png" in text:
        return False

    if BEGIN in text and END in text:
        # Drop empty "Browser lab" heading that only precedes the walkthrough marke
        text = re.sub(
            r"\n## Slide \d+ — Browser lab track\n\n" + re.escape(BEGIN),
            "\n" + BEGIN,
            text,
            count=1,
        )
        pre, post = text.split(END, 1)
        post = post.lstrip()
        # Split post into optional orphan prose vs remaining ## Slide sections
        m = re.search(r"^## Slide \d+ — ", post, re.M)
        if m:
            orphan, rest = post[: m.start()].strip(), post[m.start() :]
        else:
            orphan, rest = post.strip(), ""
        if not orphan:
            orphan = "Open the browser lab, use the challenge panel, then Check your positions. Reveal golden is study-only."
        browser = (
            f"{END}\n\n"
            f"## Slide 99 — Browser lab track\n\n"
            f"![Browser lab starter](assets/lab-starter.png)\n\n"
            f"{orphan}\n\n"
        )
        text = pre.rstrip() + "\n\n" + browser + rest.lstrip()
        text = renumber(text)
        path.write_text(text.rstrip() + "\n", encoding="utf-8", newline="\n")
        return True

    # No walkthrough: add image under Browser lab heading
    text2, n = re.subn(
        r"(## Slide \d+ — Browser lab track\n\n)",
        r"\1![Browser lab starter](assets/lab-starter.png)\n\n",
        text,
        count=1,
    )
    if n:
        path.write_text(text2, encoding="utf-8", newline="\n")
        return True
    return False


def main() -> None:
    fixed = 0
    for p in sorted(ROOT.glob("module*/transcript.md")):
        if (p.parent / "assets" / "lab-starter.png").is_file() and fix(p):
            print("fixed", p.parent.name)
            fixed += 1
    # intro tools-index
    intro = ROOT / "module00-00-intro" / "transcript.md"
    if intro.is_file() and "tools-index.png" not in intro.read_text(encoding="utf-8"):
        t = intro.read_text(encoding="utf-8")
        t2 = re.sub(
            r"(## Slide 2 — Two tracks\n\n)",
            r"\1![Tools index](assets/tools-index.png)\n\n",
            t,
            count=1,
        )
        if t2 != t:
            intro.write_text(t2, encoding="utf-8", newline="\n")
            print("fixed intro")
            fixed += 1
    print("fixed_count", fixed)


if __name__ == "__main__":
    main()
