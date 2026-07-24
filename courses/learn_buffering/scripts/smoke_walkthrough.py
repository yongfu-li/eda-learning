#!/usr/bin/env python3
from playwright.sync_api import sync_playwright

ALGOS = [
    "wire-rc", "slew-budget", "candidate-sites", "buffer-library", "van-ginneken",
    "slew-driven", "polarity-invert", "fanout-tree", "sequential-buffer",
]

def main() -> int:
    errs: list[str] = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.on("pageerror", lambda e: errs.append(str(e)))
        for algo in ALGOS:
            for step in range(1, 6):
                url = f"http://127.0.0.1:8080/tools/algorithm-walkthrough/?algo={algo}&step={step}"
                page.goto(url, wait_until="networkidle")
                page.wait_for_selector("#walk-frame[data-ready='1']", timeout=15_000)
                print(f"ok {algo} step {step}")
                if errs:
                    print("ERRORS", errs)
                    browser.close()
                    return 1
        browser.close()
    print("WALK_SMOKE_OK")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
