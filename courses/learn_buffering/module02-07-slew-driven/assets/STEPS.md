# Slew-driven insertion — step-by-step (for slides / transcript)

**Module:** `module02-07-slew-driven`  
**Lab / algo:** `slew-driven`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=slew-driven&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Check slew

![Step 1](steps/01-check.png)

**Caption (transcript):** Compare estimate_slew to slew_limit.

**Slide bullets:**

- Per edge

**On-screen metrics:**

```
Gate
```

## Step 2 — Tight limit

![Step 2](steps/02-tight.png)

**Caption (transcript):** Limit 1 forces inserts on the toy.

**Slide bullets:**

- Heuristic

**On-screen metrics:**

```
count≥1
```

## Step 3 — Mid buffer

![Step 3](steps/03-mid.png)

**Caption (transcript):** Insertion sits at edge midpoint.

**Slide bullets:**

- BUF_X1

**On-screen metrics:**

```
Orange square
```

## Step 4 — Count

![Step 4](steps/04-count.png)

**Caption (transcript):** Challenges score insertion count.

**Slide bullets:**

- Learner state
- Check

**On-screen metrics:**

```
limit=8
```

## Step 5 — vs VG

![Step 5](steps/05-vs.png)

**Caption (transcript):** Slew-driven is local; VG optimizes delay options.

**Slide bullets:**

- Complementary

**On-screen metrics:**

```
Both useful
```

