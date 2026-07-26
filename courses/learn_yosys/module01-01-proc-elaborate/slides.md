---
marp: true
title: Why proc
paginate: true
---

# Why proc

The proc pass lowers RTL to a gate-level netlist Yosys can optimize

---

## The idea
- GOLDEN: rtl_cell_count=6, module_count=2

---

## RTL gate view
![RTL gate view](assets/steps/01-gates.png)

---

## AND c1
![AND c1](assets/steps/02-and1.png)

---

## OR c2
![OR c2](assets/steps/03-or.png)

---

## Duplicate AND
![Duplicate AND](assets/steps/04-dup.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
![Browser lab starter](assets/lab-starter.png)

---

## Implement track
- Call pass_proc(); assert cell_count==6

---

## Pitfalls
- Confusing proc with synth
- Expecting fewer cells before opt

---

## Your turn
- Next: hierarchy flatten

