---
marp: true
title: Why fsm
paginate: true
---

# Why fsm

FSM passes count states and transitions, then choose encoding width

---

## The idea
- GOLDEN: states=3; transitions=3; encoding_bits=2

---

## States
![States](assets/steps/01-states.png)

---

## Transitions
![Transitions](assets/steps/02-trans.png)

---

## Encoding
![Encoding](assets/steps/03-enc.png)

---

## Reset
![Reset](assets/steps/04-reset.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **fsm-detect**
- Read states, edges, and encoding width

---

## Implement track
- Call algo_fsm_detect(); assert states == 3, transitions == 3, encoding_bits == 2

---

## Pitfalls
- Counting encoding bits as state count
- Missing a transition edge

---

## Try these
- From the common folder, run the algo solvers self-test, or call `algo_fsm_detect` directly

---

## Try these — try these

```
cd courses/learn_yosys/common
python3 algo_solvers.py
```

---

## Pseudocode
- Here is the check in plain steps

---

## Pseudocode — try these

```
states ← fsm.states; trans ← fsm.transitions
bits ← max encoding string length
ok if 3, 3, and 2
```

---

## Next
- Complete the quiz for this part
- Next: ABC handoff AND count

