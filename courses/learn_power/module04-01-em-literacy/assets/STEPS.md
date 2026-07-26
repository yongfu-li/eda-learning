# EM literacy — step-by-step (for slides / transcript)

**Module:** `module04-01-em-literacy`  
**Lab / algo:** `em-literacy`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=em-literacy&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Current limit

![Step 1](steps/01-limit.png)

**Caption (transcript):** em_limit=0.08 A per edge.

**Slide bullets:**

- em_limit

**On-screen metrics:**

```
0.08
```

## Step 2 — Grid current

![Step 2](steps/02-i.png)

**Caption (transcript):** i_sink=0.1 exceeds limit on all edges.

**Slide bullets:**

- i_sink

**On-screen metrics:**

```
0.1
```

## Step 3 — Edge e1

![Step 3](steps/03-e1.png)

**Caption (transcript):** e1: 0.1 > 0.08 — EM violation.

**Slide bullets:**

- e1

**On-screen metrics:**

```
fail
```

## Step 4 — Edges e2 e3

![Step 4](steps/04-e23.png)

**Caption (transcript):** e2 and e3 also violate.

**Slide bullets:**

- e2
- e3

**On-screen metrics:**

```
fail
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: em_violation_count=3.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
3
```

