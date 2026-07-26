---
marp: true
title: Engine
paginate: true
---

# Engine

A tiny engine chains all passes and compares report stats to goldens

---

## The idea
- GOLDEN: engine_ok=True, report_cells=7, report_wires=11

---

## Pipeline snapshot
![Pipeline snapshot](assets/steps/01-snap.png)

---

## Opt golden
![Opt golden](assets/steps/02-opt.png)

---

## Strash golden
![Strash golden](assets/steps/03-strash.png)

---

## Report stats
![Report stats](assets/steps/04-report.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call yosys_engine(); assert ok and report cell/wire counts

---

## Pitfalls
- Reporting partial passes
- Changing toy without updating goldens

---

## Your turn
- Next: offline compare, then wrap

