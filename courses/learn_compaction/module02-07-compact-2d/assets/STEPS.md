# 2-D compaction — step-by-step (for slides / transcript)

**Module:** `module02-07-compact-2d`  
**Lab / algo:** `compact-2d`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=compact-2d&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Order

![Step 1](steps/01-order.png)

**Caption (transcript):** Default order is X then Y.

**Slide bullets:**

- axes

**On-screen metrics:**

```
x,y
```

## Step 2 — X step

![Step 2](steps/02-xstep.png)

**Caption (transcript):** First step shrinks width.

**Slide bullets:**

- pass 1

**On-screen metrics:**

```
X
```

## Step 3 — Y step

![Step 3](steps/03-ystep.png)

**Caption (transcript):** Second step rebuilds Y constraints.

**Slide bullets:**

- pass 2

**On-screen metrics:**

```
Y
```

## Step 4 — Final

![Step 4](steps/04-final.png)

**Caption (transcript):** final_width=14 on the toy.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
14
```

## Step 5 — Trade

![Step 5](steps/05-trade.png)

**Caption (transcript):** Axis order can change results in richer layouts.

**Slide bullets:**

- order

**On-screen metrics:**

```
literacy
```

