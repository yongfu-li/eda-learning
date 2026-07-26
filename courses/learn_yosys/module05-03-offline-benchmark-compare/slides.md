---
marp: true
title: Offline compare
paginate: true
---

# Offline compare

Track A prints yosys_compare without the browser

---

## The idea
- Load tiny_yosys.json; print rtl_cells, after_opt, nand_area, report_cells, ok

---

## Why offline
- Print yosys_compare metrics offline without the browser

---

## Commands
- Python3 -c "from solvers import yosys_compare; print(yosys_compare())" in common/

---

## What to compare
- Load tiny_yosys.json; print rtl_cells, after_opt, nand_area, report_cells, ok

---

## Next
- Complete the quiz for this part
- Continue to the wrap module

