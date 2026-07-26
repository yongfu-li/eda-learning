# Threshold rules — step-by-step (for slides / transcript)

**Module:** `module03-01-threshold-rules`  
**Lab / algo:** `threshold-rules`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=threshold-rules&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Limit

![Step 1](steps/01-limit.png)

**Caption (transcript):** limit_ratio=10; flag ratio > limit.

**Slide bullets:**

- limit

**On-screen metrics:**

```
10
```

## Step 2 — n1 fail

![Step 2](steps/02-n1v.png)

**Caption (transcript):** n1 ratio 25 > 10 — violation.

**Slide bullets:**

- n1

**On-screen metrics:**

```
25
```

## Step 3 — n2 ok

![Step 3](steps/03-n2ok.png)

**Caption (transcript):** n2 ratio 4 ≤ 10 — pass.

**Slide bullets:**

- n2

**On-screen metrics:**

```
4
```

## Step 4 — n3 fail

![Step 4](steps/04-n3v.png)

**Caption (transcript):** n3 ratio 45 > 10 — violation.

**Slide bullets:**

- n3

**On-screen metrics:**

```
45
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: raw violations=2 (n1,n3).

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
2
```

