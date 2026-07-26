---
marp: true
title: Why Slack
paginate: true
---

# Why Slack

Compute slack = required − arrival on the critical path

---

## The idea
- GOLDEN: slack = 10 − 2 = 8

---

## Critical path
![Critical path](assets/steps/01-path.png)

---

## Path delay
![Path delay](assets/steps/02-delay.png)

---

## Slack formula
![Slack formula](assets/steps/03-formula.png)

---

## Slack value
![Slack value](assets/steps/04-value.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **slack-critical**
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
slack = 10 − 2 = 8.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the OpenSTA Part A map, then the real CLI track

