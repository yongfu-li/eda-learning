---
marp: true
title: Why real
paginate: true
---

# Why real

The evidence engine checks CLI order, RTLIL goldens, proc/flatten/opt, and synth outputs together

---

## The idea
- GOLDEN: engine ok=True; after_synth_cells=2

---

## Full recipe
![Full recipe](assets/steps/01-recipe.png)

---

## RTLIL checks
![RTLIL checks](assets/steps/02-rtlil.png)

---

## proc+flatten
![proc+flatten](assets/steps/03-mid.png)

---

## synth out
![synth out](assets/steps/04-synth.png)

---

## OK
![OK](assets/steps/05-ok.png)

---

## Browser lab track
- Open **real-evidence**
- Open **real-evidence**
- Build golden recipe; run Engine; confirm ok

---

## Implement track
- Call real_yosys_engine(); assert ok

---

## Pitfalls
- Stopping at toy yosys_engine
- Wrong recipe order

---

## Try these
- From the common folder

---

## Try these — try these

```
cd courses/learn_yosys/common
python3 real_solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
run full golden recipe
assert engine ok and synth cells two
```

---

## Next
- Complete the quiz for this part
- Next: offline compare, then wrap

