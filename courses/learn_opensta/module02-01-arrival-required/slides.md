---
marp: true
title: Why Arrival
paginate: true
---

# Why Arrival

Propagate arrivals and set required at the endpoint

---

## The idea
- GOLDEN: A(y)=2.0; R(y)=10.0

---

## Input arrivals
![Input arrivals](assets/steps/01-inputs.png)

---

## Forward propagate
![Forward propagate](assets/steps/02-forward.png)

---

## Arrival at y
![Arrival at y](assets/steps/03-ay.png)

---

## Required at y
![Required at y](assets/steps/04-ry.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **arrival-required**
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
A(y)=2.0; R(y)=10.0.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the OpenSTA Part A map, then the real CLI track

