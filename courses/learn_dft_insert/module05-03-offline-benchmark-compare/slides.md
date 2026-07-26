---
marp: true
title: Offline compare
paginate: true
---

# Offline compare

Track A prints dft_compare without the browser

---

## The idea
- Load tiny_dft.json; print scan_cell_count, stitch_count, lockup_count, marker_count, ok

---

## Why offline
- Print dft_compare metrics offline without the browser

---

## Commands
- Python3 -c "from solvers import dft_compare; print(dft_compare())" in common/

---

## What to compare
- Load tiny_dft.json; print scan_cell_count, stitch_count, lockup_count, marker_count, ok

---

## Next
- Complete the quiz for this part
- Continue to the wrap module

