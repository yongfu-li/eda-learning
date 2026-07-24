# Period bound / FEAS lite — step-by-step (for slides / transcript)

**Module:** `module03-01-period-bound`  
**Lab / algo:** `period-bound`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=period-bound&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — FEAS lite

![Step 1](steps/01-feas.png)

**Caption (transcript):** feas_check: legal AND period ≤ target.

**Slide bullets:**

- FEAS

**On-screen metrics:**

```
toy
```

## Step 2 — Target 5

![Step 2](steps/02-target.png)

**Caption (transcript):** GOLDENS.periodTarget = 5.

**Slide bullets:**

- clock

**On-screen metrics:**

```
T=5
```

## Step 3 — Baseline fails

![Step 3](steps/03-base-fail.png)

**Caption (transcript):** Period 8 > 5, so baseline is not feasible for the target.

**Slide bullets:**

- P=8

**On-screen metrics:**

```
fail
```

## Step 4 — Forward passes

![Step 4](steps/04-fwd-pass.png)

**Caption (transcript):** Forward on a: legal and P=5 ≤ 5 — feasible.

**Slide bullets:**

- pass

**On-screen metrics:**

```
P=5
```

## Step 5 — Full WD later

![Step 5](steps/05-wd.png)

**Caption (transcript):** Real tools use W/D matrices; we only try a few retimings.

**Slide bullets:**

- literacy

**On-screen metrics:**

```
not full LP
```

