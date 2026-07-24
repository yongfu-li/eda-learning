# Boolean network / subject graph — step-by-step (for slides / transcript)

**Module:** `module01-01-boolean-network`  
**Lab / algo:** `boolean-network`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=boolean-network&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Graph

![Step 1](steps/01-graph.png)

**Caption (transcript):** Seven nodes: three PIs, four ANDs, one PO f.

**Slide bullets:**

- Subject graph
- AIG

**On-screen metrics:**

```
AND=4
```

## Step 2 — PIs

![Step 2](steps/02-pis.png)

**Caption (transcript):** Primary inputs a, b, c sit at the top.

**Slide bullets:**

- Circles

**On-screen metrics:**

```
a b c
```

## Step 3 — AND boxes

![Step 3](steps/03-ands.png)

**Caption (transcript):** Green boxes are AND2 nodes in the AIG.

**Slide bullets:**

- Rectangles

**On-screen metrics:**

```
4 AND
```

## Step 4 — Bubbles

![Step 4](steps/04-comp.png)

**Caption (transcript):** Purple dots mark complemented fanins.

**Slide bullets:**

- Edge invert

**On-screen metrics:**

```
Node 5
```

## Step 5 — PO

![Step 5](steps/05-po.png)

**Caption (transcript):** Node 7 drives output f.

**Slide bullets:**

- Primary out

**On-screen metrics:**

```
f
```

