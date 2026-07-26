# Real proc pass — step-by-step (for slides / transcript)

**Module:** `module07-01-real-proc`  
**Lab / algo:** `real-proc`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=real-proc&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Before: process

![Step 1](steps/01-before.png)

**Caption (transcript):** No $dff yet — child still has a process.

**Slide bullets:**

- before

**On-screen metrics:**

```
process
```

## Step 2 — proc runs

![Step 2](steps/02-run.png)

**Caption (transcript):** proc creates $dff from always @(posedge clk).

**Slide bullets:**

- proc

**On-screen metrics:**

```
$dff
```

## Step 3 — Processes cleared

![Step 3](steps/03-clear.png)

**Caption (transcript):** processes → 0 after proc.

**Slide bullets:**

- processes

**On-screen metrics:**

```
0
```

## Step 4 — $dff present

![Step 4](steps/04-dff.png)

**Caption (transcript):** $dff cell appears in the design.

**Slide bullets:**

- $dff

**On-screen metrics:**

```
1
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: processes=0 has_dff=True.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

