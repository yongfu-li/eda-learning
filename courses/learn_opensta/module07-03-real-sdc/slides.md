---
marp: true
title: Why real OpenSTA
paginate: true
---

# Why real OpenSTA

Apply create_clock period 10 and I/O delays

---

## The idea
- GOLDEN: clock clk period=10

---

## create_clock
![create_clock](assets/steps/01-clk.png)

---

## Input delay
![Input delay](assets/steps/02-in.png)

---

## Output delay
![Output delay](assets/steps/03-out.png)

---

## Ideal network
![Ideal network](assets/steps/04-ideal.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **real-sdc**
- Build the Tcl recipe or open evidence stages, then Check

---

## Implement track
- From common/, run real_solvers.py and confirm REAL_OPENSTA_OK

---

## Pitfalls
- Editing goldens by hand without re-running sta
- Confusing Part A map JSON with real liberty delays

---

## Try these
- From the common folder, run the real OpenSTA self-test

---

## Try these — try these

```
cd courses/learn_opensta/common
python3 real_solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
clock clk period=10.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the Part B evidence track, then wrap , algorithms and internals come later

