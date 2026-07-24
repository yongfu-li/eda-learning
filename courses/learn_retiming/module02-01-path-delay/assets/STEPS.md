# Zero-weight path delay — step-by-step (for slides / transcript)

**Module:** `module02-01-path-delay`  
**Lab / algo:** `path-delay`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=path-delay&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Zero-weight paths

![Step 1](steps/01-zero.png)

**Caption (transcript):** Clock period is the longest path that only uses edges with w=0.

**Slide bullets:**

- combo path

**On-screen metrics:**

```
P
```

## Step 2 — Hot path

![Step 2](steps/02-hot.png)

**Caption (transcript):** a→b and a→c and c→v create long zero-weight stretches.

**Slide bullets:**

- w=0

**On-screen metrics:**

```
a b c
```

## Step 3 — Baseline P=8

![Step 3](steps/03-base.png)

**Caption (transcript):** On the starter, longest zero-weight delay is 8.

**Slide bullets:**

- GOLDENS

**On-screen metrics:**

```
P=8
```

## Step 4 — Target 5

![Step 4](steps/04-target.png)

**Caption (transcript):** We want period ≤ 5 — retiming must break the long path.

**Slide bullets:**

- target

**On-screen metrics:**

```
T=5
```

## Step 5 — Break with registers

![Step 5](steps/05-idea.png)

**Caption (transcript):** Pushing a register onto a zero-weight edge splits the combo path.

**Slide bullets:**

- forward/back

**On-screen metrics:**

```
Next labs
```

