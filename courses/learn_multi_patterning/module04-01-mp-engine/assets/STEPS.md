# Multi-patterning engine — step-by-step (for slides / transcript)

**Module:** `module04-01-mp-engine`  
**Lab / algo:** `mp-engine`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=mp-engine&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Try DP

![Step 1](steps/01-dp.png)

**Caption (transcript):** First try LELE double.

**Slide bullets:**

- DP

**On-screen metrics:**

```
2
```

## Step 2 — Fail

![Step 2](steps/02-fail.png)

**Caption (transcript):** DP fails on the triangle.

**Slide bullets:**

- fail

**On-screen metrics:**

```
ok=false
```

## Step 3 — Try TP

![Step 3](steps/03-tp.png)

**Caption (transcript):** Fall back to triple.

**Slide bullets:**

- TP

**On-screen metrics:**

```
3
```

## Step 4 — Best 3

![Step 4](steps/04-best.png)

**Caption (transcript):** best_masks=3.

**Slide bullets:**

- best

**On-screen metrics:**

```
3
```

## Step 5 — Report

![Step 5](steps/05-rep.png)

**Caption (transcript):** Engine reports DP/TP/QP outcome.

**Slide bullets:**

- report

**On-screen metrics:**

```
GOLDEN
```

