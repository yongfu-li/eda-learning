# K-feasible cut enumeration — step-by-step (for slides / transcript)

**Module:** `module02-05-cut-enumeration`  
**Lab / algo:** `cut-enumeration`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=cut-enumeration&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — K=3

![Step 1](steps/01-k.png)

**Caption (transcript):** Toy uses cut_k=3.

**Slide bullets:**

- k-feasible

**On-screen metrics:**

```
k=3
```

## Step 2 — PI cuts

![Step 2](steps/02-pi.png)

**Caption (transcript):** Each PI has a single cut.

**Slide bullets:**

- {self}

**On-screen metrics:**

```
3 PIs
```

## Step 3 — Combine

![Step 3](steps/03-comb.png)

**Caption (transcript):** AND cuts combine child cuts under the k limit.

**Slide bullets:**

- Union

**On-screen metrics:**

```
≤k leaves
```

## Step 4 — PO cuts

![Step 4](steps/04-po.png)

**Caption (transcript):** Node 7 lists several feasible cuts.

**Slide bullets:**

- Root

**On-screen metrics:**

```
Select 7
```

## Step 5 — Stats

![Step 5](steps/05-stats.png)

**Caption (transcript):** total_cuts grows with graph depth.

**Slide bullets:**

- cutStats

**On-screen metrics:**

```
total=16
```

