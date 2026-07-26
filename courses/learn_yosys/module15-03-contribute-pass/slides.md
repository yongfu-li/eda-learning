---
marp: true
title: Why contribute
paginate: true
---

# Why contribute

Reading is not enough

---

## The idea
- GOLDEN: add passes/area/name.cc

---

## Tree layout
![Tree layout](assets/steps/01-tree.png)

---

## Stub file
![Stub file](assets/steps/02-stub.png)

---

## Build hook
![Build hook](assets/steps/03-build.png)

---

## Smoke
![Smoke](assets/steps/04-smoke.png)

---

## Golden
![Golden](assets/steps/05-golden.png)

---

## Browser lab track
- Open **contribute-pass**
- Assemble the contribute checklist and check

---

## Implement track
- Call contribute_pass(); assert checklist length and smoke cmd

---

## Pitfalls
- Editing only docs
- Forgetting the build system entry
- Skipping help smoke

---

## Try these
- From the common folder, call contribute_pass and print the checklist

---

## Try these — try these

```
cd courses/learn_yosys/common
python3 -c "from internals_solvers import contribute_pass; print(contribute_pass())"
```

---

## Pseudocode
- Here is the contribute checklist in plain steps

---

## Pseudocode — try these

```
path ← passes/demo/hello_pass.cc
REGISTER_PASS(HelloPass)
add to Makefile; rebuild
smoke ← yosys -h hello_pass
```

---

## Next
- Complete the quiz for this part
- Wrap the Yosys path , you can use Yosys and open the C++ tree with intent

