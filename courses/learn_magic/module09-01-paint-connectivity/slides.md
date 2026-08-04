---
marp: true
title: Why algorithms
paginate: true
---

# Why algorithms

Flood-fill metal1 nets; contact bridges poly and metal1

---

## The idea
- GOLDEN: metal1_net_shapes=2; contact_count=1

---

## metal1 shapes
![metal1 shapes](assets/steps/01-m1.png)

---

## One metal1 net
![One metal1 net](assets/steps/02-net.png)

---

## Contact ca
![Contact ca](assets/steps/03-ca.png)

---

## poly link
![poly link](assets/steps/04-poly.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **paint-connectivity**
- Run connectivity / DRC / extract / bind, then Check

---

## Implement track
- From common/, run algo_solvers.py and partc_bind.py

---

## Pitfalls
- Changing tiny_algo_magic without updating Part B goldens
- Ignoring the bind side

---

## Try these
- From the common folder, run the Part C self-tests

---

## Try these — try these

```
cd courses/learn_magic/common
python3 algo_solvers.py
python3 partc_bind.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
metal1_net_shapes=2; contact_count=1.
ok if goldens match and bind
```

---

## Next
- Complete the quiz for this part
- Continue Part C, then internals literacy

