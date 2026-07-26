# Scan chain view — step-by-step (for slides / transcript)

**Module:** `module04-03-scan-chain-view`  
**Lab / algo:** `scan-chain-view`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=scan-chain-view&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Draw chain

![Step 1](steps/01-draw.png)

**Caption (transcript):** Visualize full scan path SI→f1→…→f4→SO.

**Slide bullets:**

- chain

**On-screen metrics:**

```
4 flops
```

## Step 2 — Stitch lines

![Step 2](steps/02-stitches.png)

**Caption (transcript):** Three stitch edges between flops.

**Slide bullets:**

- stitch

**On-screen metrics:**

```
3
```

## Step 3 — Lockup highlight

![Step 3](steps/03-lockup.png)

**Caption (transcript):** Lockup dashed between f3 and f4.

**Slide bullets:**

- lockup

**On-screen metrics:**

```
1
```

## Step 4 — SE label

![Step 4](steps/04-se.png)

**Caption (transcript):** scan_enable shown above chain.

**Slide bullets:**

- SE

**On-screen metrics:**

```
se
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: f1→f2→f3→f4 with lockup f3→f4.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

