#!/usr/bin/env python3
from playwright.sync_api import sync_playwright
ALGOS = ["boolean-network","aig-nodes","aig-strash","rewrite-local","cut-enumeration",
         "library-cells","techmap-cover","area-delay","sequential-synth"]
def main():
    errs=[]
    with sync_playwright() as p:
        b=p.chromium.launch(); page=b.new_page()
        page.on("pageerror", lambda e: errs.append(str(e)))
        for a in ALGOS:
            for s in range(1,6):
                page.goto(f"http://127.0.0.1:8080/tools/algorithm-walkthrough/?algo={a}&step={s}", wait_until="networkidle")
                page.wait_for_selector("#walk-frame[data-ready='1']", timeout=15000)
                print(f"ok {a} step {s}")
                if errs:
                    print(errs); return 1
        b.close()
    print("WALK_SMOKE_OK"); return 0
if __name__ == "__main__":
    raise SystemExit(main())
