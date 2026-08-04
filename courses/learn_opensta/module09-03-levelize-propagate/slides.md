---
marp: true
title: Why algorithms
paginate: true
---

# Why algorithms

Levelize the graph and propagate arrivals/required

---

## The idea
- GOLDEN: levels a/b=0…y=3; A(y)=2 R(y)=10

---

## Levelize
![Levelize](assets/steps/01-level.png)

---

## Level n1
![Level n1](assets/steps/02-n1.png)

---

## Arrival y
![Arrival y](assets/steps/03-ay.png)

---

## Required y
![Required y](assets/steps/04-ry.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **levelize-propagate**
- Run Graph / Levelize / Propagate / Slack / Bind, then Check

---

## Implement track
- From common/, run algo_solvers.py and partc_bind.py

---

## Pitfalls
- Changing tiny_algo_sta without updating Part B liberty delays
- Ignoring the bind side

---

## Try these
- From the common folder, run the Part C self-tests

---

## Try these — try these

```
cd courses/learn_opensta/common
python3 algo_solvers.py
python3 partc_bind.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
levels a/b=0…y=3; A(y)=2 R(y)=10.
ok if goldens match and bind
```

---

## Next
- Complete the quiz for this part
- Continue Part C, then wrap , internals literacy is next

