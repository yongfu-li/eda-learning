# Truth-table CEC — step-by-step (for slides / transcript)

**Module:** `module02-01-truth-table-cec`  
**Lab / algo:** `truth-table-cec`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=truth-table-cec&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Eight rows

![Step 1](steps/01-eight.png)

**Caption (transcript):** Three PIs → 8 assignments to exhaust.

**Slide bullets:**

- 2^n

**On-screen metrics:**

```
rows=8
```

## Step 2 — Good passes

![Step 2](steps/02-good.png)

**Caption (transcript):** truth_table_cec(spec, good) → equivalent true.

**Slide bullets:**

- pass

**On-screen metrics:**

```
8 checked
```

## Step 3 — Bad fails

![Step 3](steps/03-bad.png)

**Caption (transcript):** Bad fails; first mismatch is the counterexample.

**Slide bullets:**

- fail

**On-screen metrics:**

```
cex
```

## Step 4 — Cex a1b1c0

![Step 4](steps/04-cex.png)

**Caption (transcript):** GOLDEN counterexample a=1, b=1, c=0.

**Slide bullets:**

- witness

**On-screen metrics:**

```
spec1 bad0
```

## Step 5 — Scales poorly

![Step 5](steps/05-scale.png)

**Caption (transcript):** Exhaustive CEC is literacy; real tools use SAT/BDD.

**Slide bullets:**

- toy only

**On-screen metrics:**

```
Next hash
```

