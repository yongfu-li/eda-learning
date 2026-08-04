---
marp: true
title: Why algorithms
paginate: true
---

# Why algorithms

Compute slack and the critical path

---

## The idea
- GOLDEN: slack=8; path b→n1→n2→y

---

## Slack
![Slack](assets/steps/01-formula.png)

---

## Value 8
![Value 8](assets/steps/02-value.png)

---

## Critical path
![Critical path](assets/steps/03-path.png)

---

## Tie-break
![Tie-break](assets/steps/04-tie.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **slack-algo**
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
slack=8; path b→n1→n2→y.
ok if goldens match and bind
```

---

## Next
- Complete the quiz for this part
- Continue Part C, then wrap , internals literacy is next

