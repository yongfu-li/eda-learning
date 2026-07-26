---
marp: true
title: Why memory
paginate: true
---

# Why memory

Memory passes turn array descriptions into dollar-mem cells with size and width

---

## The idea
- GOLDEN: one dollar mem; depth=8; width=4

---

## Array
![Array](assets/steps/01-arr.png)

---

## Infer
![Infer](assets/steps/02-infer.png)

---

## Ports
![Ports](assets/steps/03-ports.png)

---

## SIZE
![SIZE](assets/steps/04-size.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **memory-map-algo**
- Build the mem cell and Check depth and width

---

## Implement track
- Call algo_memory_map(); assert depth == 8 and width == 4

---

## Pitfalls
- Swapping depth and width
- Ignoring read versus write ports

---

## Try these
- From the common folder, run the algo solvers self-test, or call `algo_memory_map` directly

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
read memory block from tiny_algo
emit dollar mem WIDTH=width SIZE=depth
ok if depth==8 and width==4
```

---

## Next
- Complete the quiz for this part
- Next: FSM detect and encoding bits

