# Sequential CEC lite — step-by-step (for slides / transcript)

**Module:** `module03-05-sequential-cec`  
**Lab / algo:** `sequential-cec`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=sequential-cec&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Good SEC

![Step 1](steps/01-good.png)

**Caption (transcript):** XOR impl matches OR-of-ANDs for 2 steps.

**Slide bullets:**

- equiv

**On-screen metrics:**

```
pass
```

## Step 2 — Bad SEC

![Step 2](steps/02-bad.png)

**Caption (transcript):** NOT-q impl ignores a and fails within 2 steps.

**Slide bullets:**

- fail

**On-screen metrics:**

```
cex
```

## Step 3 — Bounded only

![Step 3](steps/03-bound.png)

**Caption (transcript):** This is bounded SEC — not full infinite-horizon proof.

**Slide bullets:**

- literacy

**On-screen metrics:**

```
k=2
```

## Step 4 — Same init

![Step 4](steps/04-init.png)

**Caption (transcript):** Both start from q=0.

**Slide bullets:**

- reset

**On-screen metrics:**

```
fair
```

## Step 5 — Done

![Step 5](steps/05-done.png)

**Caption (transcript):** Next: offline compare, then wrap toward formal / STA.

**Slide bullets:**

- learn_formal

**On-screen metrics:**

```
Wrap
```

