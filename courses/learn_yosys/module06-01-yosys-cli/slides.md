---
marp: true
title: Why yosys
paginate: true
---

# Why yosys

Real Yosys is a pass engine you drive with a .ys script or an interactive shell , not a toy button

---

## The idea
- GOLDEN: first three cmds = read_verilog, hierarchy, proc; invoke with yosys -s script.ys

---

## Empty design
![Empty design](assets/steps/01-empty.png)

---

## read_verilog
![read_verilog](assets/steps/02-read.png)

---

## hierarchy -top
![hierarchy -top](assets/steps/03-hier.png)

---

## proc next
![proc next](assets/steps/04-proc.png)

---

## Golden order
![Golden order](assets/steps/05-golden.png)

---

## Browser lab track
- Open **yosys-cli**
- Open **yosys-cli**
- Append read_verilog, hierarchy, proc in order

---

## Implement track
- Call pass_cli_check(['read_verilog','hierarchy','proc']); assert ok

---

## Pitfalls
- Starting with proc
- Skipping hierarchy -top

---

## Try these
- From the common folder, run the real solvers self-test, or call `pass_cli_check` directly

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
append read_verilog; hierarchy; proc
ok if prefix matches golden
```

---

## Next
- Complete the quiz for this part
- Next: RTLIL vocabulary

