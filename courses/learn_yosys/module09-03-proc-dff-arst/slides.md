---
marp: true
title: Why proc dff
paginate: true
---

# Why proc dff

Sync processes become flip-flops; async reset rides on the ARST ports

---

## The idea
- GOLDEN: one dollar adff with arst; processes left = 0
- Real Yosys binds the same

---

## Sync process
![Sync process](assets/steps/01-sync.png)

---

## Emit $adff
![Emit $adff](assets/steps/02-dff.png)

---

## ARST port
![ARST port](assets/steps/03-arst.png)

---

## Processes=0
![Processes=0](assets/steps/04-done.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **proc-dff-arst**
- Emit the $adff with reset ports, clear all processes, and confirm the real bind

---

## Implement track
- Call algo_proc_dff(); assert reg_type is $adff, has_arst is True, processes == 0
- Then run partc_bind.py

---

## Pitfalls
- Emitting plain $dff when async reset is present
- Stopping before processes reach zero

---

## Try these
- From the common folder

---

## Try these — try these

```
cd courses/learn_yosys/common
python3 algo_solvers.py
python3 partc_bind.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
run proc_mux first
for each sync process:
  if reset present: emit $adff (CLK,D,Q,ARST)
  else: emit $dff (CLK,D,Q)
ok if reg_type==$adff and processes==0
```

---

## Next
- Complete the quiz for this part
- Next: opt_clean and opt_expr goldens

