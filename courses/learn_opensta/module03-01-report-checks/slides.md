---
marp: true
title: Why report_checks
paginate: true
---

# Why report_checks

Read a report_checks-shaped endpoint summary

---

## The idea
- GOLDEN: endpoint y; path delay 2; slack 8

---

## report_checks
![report_checks](assets/steps/01-cmd.png)

---

## Endpoint
![Endpoint](assets/steps/02-endpoint.png)

---

## Path cells
![Path cells](assets/steps/03-path.png)

---

## Reported slack
![Reported slack](assets/steps/04-slack.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **report-checks**
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
endpoint y; path delay 2; slack 8.
ok if goldens match
```

---

## Next
- Complete the quiz for this part
- Continue the OpenSTA Part A map, then the real CLI track

