# Lockup latch — step-by-step (for slides / transcript)

**Module:** `module03-01-lockup-latch`  
**Lab / algo:** `lockup-latch`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=lockup-latch&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Domain crossing

![Step 1](steps/01-cross.png)

**Caption (transcript):** lockup_between d0 and d1 requires lockup.

**Slide bullets:**

- domain

**On-screen metrics:**

```
d0→d1
```

## Step 2 — f3→f4 pair

![Step 2](steps/02-pair.png)

**Caption (transcript):** Consecutive flops f3 (d0) and f4 (d1).

**Slide bullets:**

- f3
- f4

**On-screen metrics:**

```
pair
```

## Step 3 — Lockup cell

![Step 3](steps/03-cell.png)

**Caption (transcript):** Insert lockup_f3_f4 between domains.

**Slide bullets:**

- lockup

**On-screen metrics:**

```
1
```

## Step 4 — Clock domains

![Step 4](steps/04-clk.png)

**Caption (transcript):** f4 uses clk2; f1–f3 use clk.

**Slide bullets:**

- clk

**On-screen metrics:**

```
2 clk
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: lockup_count=1 on f3→f4.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
1
```

