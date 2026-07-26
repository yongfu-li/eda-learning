#!/usr/bin/env python3
"""Fix Part D transcripts so TTS has spoken prose before code fences."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REPLACEMENTS = {
    "module14-01-rtlil-cpp-model": """## Slide 11 — Try these

From the common folder, run the internals solvers self-test.

```bash
cd courses/learn_yosys/common
python3 internals_solvers.py
```

## Slide 12 — Pseudocode

Here is the RTLIL nesting in plain steps.

```text
design.modules[name] → module
module.wires / module.cells / module.processes
cell.connections[port] → SigSpec
```
""",
    "module14-03-pass-registration": """## Slide 11 — Try these

From the common folder, call pass_registration and print the recipe.

```bash
cd courses/learn_yosys/common
python3 -c "from internals_solvers import pass_registration; print(pass_registration())"
```

## Slide 12 — Pseudocode

Here is the Pass registration shape in plain steps.

```text
struct MyPass : Pass { MyPass(): Pass("my_pass", "help") {}
  void execute(args, design) override { ... } };
REGISTER_PASS(MyPass)
```
""",
    "module15-01-read-opt-clean": """## Slide 11 — Try these

From the common folder, call read_opt_clean and print the stages.

```bash
cd courses/learn_yosys/common
python3 -c "from internals_solvers import read_opt_clean; print(read_opt_clean())"
```

## Slide 12 — Pseudocode

Here is the opt_clean flow in plain steps.

```text
for module in selected:
  if processes: warn/skip
  mark_used(outputs)
  rmunused_module_cells
  rmunused_module_signals
```
""",
    "module15-03-contribute-pass": """## Slide 11 — Try these

From the common folder, call contribute_pass and print the checklist.

```bash
cd courses/learn_yosys/common
python3 -c "from internals_solvers import contribute_pass; print(contribute_pass())"
```

## Slide 12 — Pseudocode

Here is the contribute checklist in plain steps.

```text
path ← passes/demo/hello_pass.cc
REGISTER_PASS(HelloPass)
add to Makefile; rebuild
smoke ← yosys -h hello_pass
```
""",
}


def main() -> None:
    for mid, block in REPLACEMENTS.items():
        p = ROOT / mid / "transcript.md"
        t = p.read_text(encoding="utf-8")
        t2, n = re.subn(
            r"## Slide 11 — Try these\n.*?\n## Slide 13 — Next",
            block.rstrip() + "\n\n## Slide 13 — Next",
            t,
            count=1,
            flags=re.S,
        )
        if n != 1:
            raise SystemExit(f"NOCHANGE {mid}")
        p.write_text(t2, encoding="utf-8", newline="\n")
        print("fixed", mid)


if __name__ == "__main__":
    main()
