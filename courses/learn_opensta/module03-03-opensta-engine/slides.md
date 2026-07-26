---
marp: true
title: Why OpenSTA
paginate: true
---

# Why OpenSTA

Run the full Part A engine; ok when every golden matches

---

## The idea
- GOLDEN: opensta_engine ok=True

---

## Graph ok
![Graph ok](assets/steps/01-graph.png)

---

## SDC ok
![SDC ok](assets/steps/02-sdc.png)

---

## Arrival ok
![Arrival ok](assets/steps/03-arr.png)

---

## Slack ok
![Slack ok](assets/steps/04-slack.png)

---

## Engine golden
![Engine golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **opensta-engine**
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
opensta_engine ok=True.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the OpenSTA Part A map, then the real CLI track

