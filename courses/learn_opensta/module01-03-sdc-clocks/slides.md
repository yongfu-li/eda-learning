---
marp: true
title: Why SDC
paginate: true
---

# Why SDC

Declare create_clock period and name on clk

---

## The idea
- GOLDEN: create_clock -period 10 → clk period=10

---

## Clock port
![Clock port](assets/steps/01-port.png)

---

## create_clock
![create_clock](assets/steps/02-create.png)

---

## Period 10
![Period 10](assets/steps/03-period.png)

---

## Ideal network
![Ideal network](assets/steps/04-ideal.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **sdc-clocks**
- Run the stage buttons and Check the goldens

---

## Implement track
- From common/, run solvers.py and confirm OPENSTA_MAP_OK

---

## Pitfalls
- Mixing algorithm STA from learn_sta with OpenSTA command names
- Forgetting the clock period when reading slack

---

## Try these
- From the common folder, run the OpenSTA map self-test

---

## Try these — try these

```
cd courses/learn_opensta/common
python3 solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
create_clock -period 10 → clk period=10.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the OpenSTA Part A map, then the real CLI track

