#!/usr/bin/env python3
"""Capture algorithm walkthrough frames for module-slides (EDA / clustering).

Step frames live in ``assets/steps/*.png`` with captions in ``assets/STEPS.md``.
Embed them in ``transcript.md`` so PPTX rebuilds as full-slide visualizations.

Prereqs:
  pip install playwright && playwright install chromium
  python -m http.server 8080 --directory platform

Examples:
  python capture_algorithm_walkthrough.py \\
    courses/learn_clustering/module02-07-fiduccia-mattheyses

  python capture_algorithm_walkthrough.py \\
    courses/learn_clustering/module02-07-fiduccia-mattheyses \\
    --inject-transcript

  python capture_algorithm_walkthrough.py \\
    courses/learn_clustering/module01-01-affinity-metrics \\
    --algo affinity-metrics --inject-transcript
"""

from __future__ import annotations

import argparse
import re
import sys
import urllib.request
from pathlib import Path

DEFAULT_BASE = "http://127.0.0.1:8080/tools/algorithm-walkthrough"

# Lab id (README Primary lab) → walkthrough algo + expected step count
LAB_TO_ALGO: dict[str, tuple[str, int]] = {
    "affinity-metrics": ("affinity-metrics", 5),
    "greedy-pair-merge": ("greedy-pair-merge", 5),
    "size-constrained-agglomerative": ("size-constrained-agglomerative", 5),
    "label-propagation": ("label-propagation", 5),
    "spectral-bisection": ("spectral-bisection", 5),
    "kernighan-lin": ("kernighan-lin", 5),
    "fiduccia-mattheyses": ("fiduccia-mattheyses", 5),
    "multilevel-clustering": ("multilevel-clustering", 5),
    "hypergraph-clustering": ("hypergraph-clustering", 5),
    "congestion-aware-clustering": ("congestion-aware-clustering", 5),
    "timing-aware-clustering": ("timing-aware-clustering", 5),
    "cutsize-balance": ("cutsize-balance", 5),
    "initial-bipartition": ("initial-bipartition", 5),
    "kl-partition": ("kl-partition", 5),
    "fm-partition": ("fm-partition", 5),
    "spectral-partition": ("spectral-partition", 5),
    "recursive-bisection": ("recursive-bisection", 5),
    "multiway-partition": ("multiway-partition", 5),
    "terminal-propagation": ("terminal-propagation", 5),
    "hypergraph-partition": ("hypergraph-partition", 5),
    "multilevel-partition": ("multilevel-partition", 5),
    "fixed-outline": ("fixed-outline", 5),
    "area-deadspace": ("area-deadspace", 5),
    "slicing-floorplan": ("slicing-floorplan", 5),
    "bstar-tree": ("bstar-tree", 5),
    "sequence-pair": ("sequence-pair", 5),
    "simulated-annealing-fp": ("simulated-annealing-fp", 5),
    "soft-module-sizing": ("soft-module-sizing", 5),
    "macro-placement": ("macro-placement", 5),
    "hierarchical-floorplan": ("hierarchical-floorplan", 5),
    "pin-assignment": ("pin-assignment", 5),
    "timing-graph": ("timing-graph", 5),
    "arrival-required": ("arrival-required", 5),
    "slack-setup-hold": ("slack-setup-hold", 5),
    "critical-path": ("critical-path", 5),
    "incremental-update": ("incremental-update", 5),
    "false-multicycle-lite": ("false-multicycle-lite", 5),
    "hpwl-metrics": ("hpwl-metrics", 5),
    "net-models": ("net-models", 5),
    "force-directed-place": ("force-directed-place", 5),
    "quadratic-place": ("quadratic-place", 5),
    "analytical-place": ("analytical-place", 5),
    "sa-placement": ("sa-placement", 5),
    "density-bins": ("density-bins", 5),
    "spread-legalize-lite": ("spread-legalize-lite", 5),
    "timing-driven-place": ("timing-driven-place", 5),
    "site-row-model": ("site-row-model", 5),
    "legality-metrics": ("legality-metrics", 5),
    "greedy-snap": ("greedy-snap", 5),
    "overlap-removal": ("overlap-removal", 5),
    "abacus-row-pack": ("abacus-row-pack", 5),
    "tetris-row-pack": ("tetris-row-pack", 5),
    "fixed-macros": ("fixed-macros", 5),
    "displacement-hpwl": ("displacement-hpwl", 5),
    "detailed-vs-global": ("detailed-vs-global", 5),
    "gcell-grid": ("gcell-grid", 5),
    "capacity-demand": ("capacity-demand", 5),
    "rudy-estimate": ("rudy-estimate", 5),
    "probabilistic-demand": ("probabilistic-demand", 5),
    "congestion-map": ("congestion-map", 5),
    "overflow-metrics": ("overflow-metrics", 5),
    "cell-inflator": ("cell-inflator", 5),
    "net-weighting": ("net-weighting", 5),
    "placement-feedback": ("placement-feedback", 5),
    "routing-graph": ("routing-graph", 5),
    "terminal-gcells": ("terminal-gcells", 5),
    "pattern-l-route": ("pattern-l-route", 5),
    "pattern-z-route": ("pattern-z-route", 5),
    "maze-gcell-route": ("maze-gcell-route", 5),
    "multipin-tree": ("multipin-tree", 5),
    "edge-overflow": ("edge-overflow", 5),
    "ripup-reroute": ("ripup-reroute", 5),
    "sequential-global": ("sequential-global", 5),
    "routing-grid": ("routing-grid", 5),
    "pin-access": ("pin-access", 5),
    "lee-maze": ("lee-maze", 5),
    "astar-route": ("astar-route", 5),
    "track-usage": ("track-usage", 5),
    "via-assignment": ("via-assignment", 5),
    "drc-spacing": ("drc-spacing", 5),
    "ripup-detailed": ("ripup-detailed", 5),
    "sequential-detailed": ("sequential-detailed", 5),
    "clock-sinks": ("clock-sinks", 5),
    "latency-skew": ("latency-skew", 5),
    "h-tree": ("h-tree", 5),
    "mmm-tree": ("mmm-tree", 5),
    "zero-skew-merge": ("zero-skew-merge", 5),
    "tapping-points": ("tapping-points", 5),
    "clock-buffering": ("clock-buffering", 5),
    "skew-bound": ("skew-bound", 5),
    "sequential-cts": ("sequential-cts", 5),
}

BEGIN_MARK = "<!-- algorithm-walkthrough -->"
END_MARK = "<!-- /algorithm-walkthrough -->"


def _lab_from_readme(module_dir: Path) -> str | None:
    readme = module_dir / "README.md"
    if not readme.is_file():
        return None
    text = readme.read_text(encoding="utf-8")
    m = re.search(r"Primary lab:\s*`([a-z0-9-]+)`", text)
    if m:
        return m.group(1)
    m = re.search(r"\*\*Lab:\*\*\s*`([a-z0-9-]+)`", text)
    if m:
        return m.group(1)
    return None


def _lab_from_transcript(module_dir: Path) -> str | None:
    tr = module_dir / "transcript.md"
    if not tr.is_file():
        return None
    m = re.search(r"^\*\*Lab:\*\*\s*([a-z0-9-]+)\s*$", tr.read_text(encoding="utf-8"), re.M)
    return m.group(1) if m else None


def _ensure_playwright() -> None:
    try:
        from playwright.sync_api import sync_playwright  # noqa: F401
    except ImportError as exc:
        raise SystemExit(
            "Playwright required:\n"
            "  pip install playwright\n"
            "  playwright install chromium"
        ) from exc


def _check_server(base: str) -> None:
    try:
        urllib.request.urlopen(base.rstrip("/") + "/", timeout=3)
    except Exception as exc:
        raise SystemExit(
            f"Cannot reach {base}\n"
            "Start: python -m http.server 8080 --directory platform\n"
            f"Detail: {exc}"
        ) from exc


def capture(
    *,
    module_dir: Path,
    algo: str,
    n_steps: int,
    base: str,
    width: int,
    height: int,
    wait_ms: int,
    title: str,
) -> Path:
    from playwright.sync_api import sync_playwright

    out_dir = module_dir / "assets" / "steps"
    out_dir.mkdir(parents=True, exist_ok=True)

    steps_doc = [
        f"# {title} — step-by-step (for slides / transcript)",
        "",
        f"**Module:** `{module_dir.name}`  ",
        f"**Lab / algo:** `{algo}`  ",
        f"**Viewer:** `/tools/algorithm-walkthrough/?algo={algo}&step=1`",
        "",
        "Use each **Caption** as spoken prose (or a shortened slide note).",
        "Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.",
        "",
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": width, "height": height})
        for i in range(1, n_steps + 1):
            url = f"{base.rstrip('/')}/?algo={algo}&step={i}"
            page.goto(url, wait_until="networkidle", timeout=60_000)
            page.wait_for_selector("#walk-frame[data-ready='1']", timeout=15_000)
            page.wait_for_timeout(wait_ms)

            step_id = page.get_attribute("#walk-frame", "data-step-id") or f"step-{i}"
            step_title = page.locator(".walk-banner h1").inner_text().strip()
            caption = page.locator(".walk-explain .caption").inner_text().strip()
            bullets = [b.strip() for b in page.locator(".walk-explain li").all_inner_texts()]
            metrics = page.locator(".walk-metrics").inner_text().strip()

            png_name = f"{i:02d}-{step_id}.png"
            png_path = out_dir / png_name
            page.locator("#walk-frame").screenshot(path=str(png_path))
            print(f"wrote {png_path}")

            steps_doc += [
                f"## Step {i} — {step_title}",
                "",
                f"![Step {i}](steps/{png_name})",
                "",
                f"**Caption (transcript):** {caption}",
                "",
                "**Slide bullets:**",
                "",
                *[f"- {b}" for b in bullets],
                "",
                "**On-screen metrics:**",
                "",
                "```",
                metrics,
                "```",
                "",
            ]
        browser.close()

    steps_md = module_dir / "assets" / "STEPS.md"
    steps_md.write_text("\n".join(steps_doc) + "\n", encoding="utf-8")
    print(f"wrote {steps_md}")
    return steps_md


def _parse_steps_md(steps_md: Path) -> list[dict[str, str]]:
    text = steps_md.read_text(encoding="utf-8")
    parts = re.split(r"^## Step (\d+) — (.+)$", text, flags=re.M)
    # parts: [preamble, n, title, body, n, title, body, ...]
    out: list[dict[str, str]] = []
    i = 1
    while i + 2 < len(parts):
        n, title, body = parts[i], parts[i + 1], parts[i + 2]
        img = re.search(r"!\[[^\]]*\]\((steps/[^)]+)\)", body)
        cap = re.search(r"\*\*Caption \(transcript\):\*\*\s*(.+)", body)
        if not img or not cap:
            i += 3
            continue
        out.append(
            {
                "n": n,
                "title": title.strip(),
                "image": f"assets/{img.group(1)}",
                "caption": cap.group(1).strip(),
            }
        )
        i += 3
    return out


def _next_slide_num(transcript: str) -> int:
    nums = [int(x) for x in re.findall(r"^## Slide (\d+)\b", transcript, flags=re.M)]
    return (max(nums) + 1) if nums else 1


def build_walkthrough_block(steps: list[dict[str, str]], start_n: int) -> str:
    lines = [BEGIN_MARK, ""]
    n = start_n
    for s in steps:
        lines += [
            f"## Slide {n} — {s['title']}",
            "",
            f"![{s['title']}]({s['image']})",
            "",
            s["caption"],
            "",
        ]
        n += 1
    lines.append(END_MARK)
    return "\n".join(lines).rstrip() + "\n"


def inject_transcript(module_dir: Path, steps_md: Path) -> Path:
    """Insert or replace the algorithm-walkthrough region in transcript.md."""
    tr_path = module_dir / "transcript.md"
    if not tr_path.is_file():
        raise SystemExit(f"missing transcript: {tr_path}")
    steps = _parse_steps_md(steps_md)
    if not steps:
        raise SystemExit(f"no steps parsed from {steps_md}")

    text = tr_path.read_text(encoding="utf-8")

    if BEGIN_MARK in text and END_MARK in text:
        # Keep slide numbers inside existing block: re-number from first walkthrough slide
        m = re.search(
            rf"{re.escape(BEGIN_MARK)}\s*\n## Slide (\d+)",
            text,
        )
        start_n = int(m.group(1)) if m else 3
        block = build_walkthrough_block(steps, start_n)
        text = re.sub(
            rf"{re.escape(BEGIN_MARK)}.*?{re.escape(END_MARK)}\n?",
            block + "\n",
            text,
            count=1,
            flags=re.S,
        )
        # Renumber slides after the block so the deck stays sequential
        text = _renumber_slides(text)
    else:
        # Insert after Slide 2 if present, else after Slide 1, else append
        start_n = 3
        block = build_walkthrough_block(steps, start_n)
        m2 = re.search(r"^## Slide 2 — .+$", text, flags=re.M)
        if m2:
            # find end of slide 2 body (next ## Slide or EOF)
            after = text[m2.end() :]
            m_next = re.search(r"^## Slide \d+ — ", after, flags=re.M)
            insert_at = m2.end() + (m_next.start() if m_next else len(after))
            text = text[:insert_at].rstrip() + "\n\n" + block + "\n" + text[insert_at:].lstrip()
        else:
            m1 = re.search(r"^## Slide 1 — .+$", text, flags=re.M)
            if m1:
                after = text[m1.end() :]
                m_next = re.search(r"^## Slide \d+ — ", after, flags=re.M)
                insert_at = m1.end() + (m_next.start() if m_next else len(after))
                # walkthrough becomes slides 2..
                block = build_walkthrough_block(steps, 2)
                text = text[:insert_at].rstrip() + "\n\n" + block + "\n" + text[insert_at:].lstrip()
            else:
                text = text.rstrip() + "\n\n" + build_walkthrough_block(steps, _next_slide_num(text))
        text = _renumber_slides(text)

    tr_path.write_text(text if text.endswith("\n") else text + "\n", encoding="utf-8")
    print(f"updated {tr_path}")
    return tr_path


def _renumber_slides(text: str) -> str:
    """Force ## Slide N sequential from 1."""
    n = 0

    def repl(m: re.Match[str]) -> str:
        nonlocal n
        n += 1
        return f"## Slide {n} — {m.group(1)}"

    return re.sub(r"^## Slide \d+ — (.+)$", repl, text, flags=re.M)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("module_dir", type=Path, help="courses/<course>/moduleNN-slug")
    ap.add_argument("--algo", help="Walkthrough algo id (default: from README/transcript lab)")
    ap.add_argument("--base", default=DEFAULT_BASE)
    ap.add_argument("--width", type=int, default=1100)
    ap.add_argument("--height", type=int, default=900)
    ap.add_argument("--wait-ms", type=int, default=400)
    ap.add_argument(
        "--inject-transcript",
        action="store_true",
        help="Insert/replace algorithm-walkthrough slides in transcript.md",
    )
    ap.add_argument(
        "--skip-capture",
        action="store_true",
        help="Only inject from existing assets/STEPS.md (no Playwright)",
    )
    args = ap.parse_args()
    module_dir = args.module_dir.resolve()
    if not module_dir.is_dir():
        print(f"not a directory: {module_dir}", file=sys.stderr)
        return 2

    lab = args.algo or _lab_from_readme(module_dir) or _lab_from_transcript(module_dir)
    if not lab:
        print("Could not resolve lab/algo id; pass --algo", file=sys.stderr)
        return 2
    if lab not in LAB_TO_ALGO:
        print(
            f"No walkthrough mapping for lab `{lab}`.\n"
            f"Known: {', '.join(LAB_TO_ALGO)}",
            file=sys.stderr,
        )
        return 2
    algo, n_steps = LAB_TO_ALGO[lab]
    # Allow --algo to override even if not in map as lab key
    if args.algo and args.algo in LAB_TO_ALGO:
        algo, n_steps = LAB_TO_ALGO[args.algo]

    title = module_dir.name
    tr = module_dir / "transcript.md"
    if tr.is_file():
        m = re.match(r"^#\s+(.+)$", tr.read_text(encoding="utf-8"), re.M)
        if m:
            title = m.group(1).strip()

    steps_md = module_dir / "assets" / "STEPS.md"
    if not args.skip_capture:
        _ensure_playwright()
        _check_server(args.base)
        steps_md = capture(
            module_dir=module_dir,
            algo=algo,
            n_steps=n_steps,
            base=args.base,
            width=args.width,
            height=args.height,
            wait_ms=args.wait_ms,
            title=title,
        )
    elif not steps_md.is_file():
        print(f"missing {steps_md}; run without --skip-capture", file=sys.stderr)
        return 1

    if args.inject_transcript:
        inject_transcript(module_dir, steps_md)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
