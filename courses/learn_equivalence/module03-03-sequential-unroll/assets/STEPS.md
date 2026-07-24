# Sequential unrolling — step-by-step (for slides / transcript)

**Module:** `module03-03-sequential-unroll`  
**Lab / algo:** `sequential-unroll`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=sequential-unroll&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Flip-flop

![Step 1](steps/01-ff.png)

**Caption (transcript):** Sequential toy: state q, next_q = a XOR q, output y=q.

**Slide bullets:**

- FF

**On-screen metrics:**

```
init 0
```

## Step 2 — Unroll k

![Step 2](steps/02-steps.png)

**Caption (transcript):** Unrolling k steps builds a combo circuit over time frames.

**Slide bullets:**

- frames

**On-screen metrics:**

```
k=2
```

## Step 3 — Frame PIs

![Step 3](steps/03-pis.png)

**Caption (transcript):** Unroll adds a_0, a_1, … and q_0 as inputs.

**Slide bullets:**

- time

**On-screen metrics:**

```
frames
```

## Step 4 — Copied gates

![Step 4](steps/04-gates.png)

**Caption (transcript):** Each frame copies the combo cone.

**Slide bullets:**

- gates_t

**On-screen metrics:**

```
BUF next
```

## Step 5 — Why unroll

![Step 5](steps/05-why.png)

**Caption (transcript):** Bounded SEC compares unrolled behaviors for k cycles.

**Slide bullets:**

- BMC-ish

**On-screen metrics:**

```
Next SEC
```

