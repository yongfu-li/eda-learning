---
marp: true
title: Why read a real pass
paginate: true
---

# Why read a real pass

Algorithms in Part C match moves

---

## The idea
- GOLDEN: mark used from outputs; delete unused cells; then unused wires
- Prefer proc before opt_clean

---

## File home
![File home](assets/steps/01-home.png)

---

## Mark used
![Mark used](assets/steps/02-mark.png)

---

## Remove cells
![Remove cells](assets/steps/03-rm-cells.png)

---

## Remove wires
![Remove wires](assets/steps/04-rm-wires.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **read-opt-clean**
- Step the mark/delete pipeline and check

---

## Implement track
- Call read_opt_clean(); assert stage order and process guard

---

## Pitfalls
- Expecting opt_clean to lower processes
- Deleting wires before cells blindly

---

## Try these
- From the common folder, call read_opt_clean and print the stages

---

## Try these — try these

```
cd courses/learn_yosys/common
python3 -c "from internals_solvers import read_opt_clean; print(read_opt_clean())"
```

---

## Pseudocode
- Here is the opt_clean flow in plain steps

---

## Pseudocode — try these

```
for module in selected:
  if processes: warn/skip
  mark_used(outputs)
  rmunused_module_cells
  rmunused_module_signals
```

---

## Next
- Complete the quiz for this part
- Next: contribute a minimal pass of your own

