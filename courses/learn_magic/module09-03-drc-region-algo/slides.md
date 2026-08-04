---
marp: true
title: Why algorithms
paginate: true
---

# Why algorithms

Region scan for width violations on painted rects

---

## The idea
- GOLDEN: drc_error_count=1 on thin metal1

---

## Region scan
![Region scan](assets/steps/01-scan.png)

---

## thin violation
![thin violation](assets/steps/02-thin.png)

---

## Other shapes
![Other shapes](assets/steps/03-ok.png)

---

## One error
![One error](assets/steps/04-count.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **drc-region-algo**
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
drc_error_count=1 on thin metal1.
ok if goldens match and bind
```

---

## Next
- Complete the quiz for this part
- Continue Part C, then internals literacy

