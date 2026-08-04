---
marp: true
title: Why read FindPath
paginate: true
---

# Why read FindPath

Part C algorithms match moves

---

## The idea
- GOLDEN: tag endpoints

---

## Tag endpoints
![Tag endpoints](assets/steps/01-tag.png)

---

## Walk back
![Walk back](assets/steps/02-walk.png)

---

## Emit path
![Emit path](assets/steps/03-emit.png)

---

## report_checks
![report_checks](assets/steps/04-report.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **read-find-path**
- Step the FindPath pipeline and check

---

## Implement track
- Call read_find_path(); assert stage order and Part B slack bind

---

## Pitfalls
- Expecting FindPath to replace Liberty
- Ignoring the Part B delay and slack goldens

---

## Try these
- From the common folder, call read_find_path and print the stages

---

## Try these — try these

```
cd courses/learn_opensta/common
python3 -c "from internals_solvers import read_find_path; print(read_find_path())"
```

---

## Pseudocode
- Here is the FindPath teaching flow in plain steps

---

## Pseudocode — try these

```
tag_endpoints
walk_back from worst slack
emit_path → [b, n1, n2, y]
report_checks → delay 2, slack 8 MET
```

---

## Next
- Complete the quiz for this part
- Next: contribute a minimal Tcl command of your own

