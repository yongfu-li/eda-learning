# Local AIG rewrite — step-by-step (for slides / transcript)

**Module:** `module02-03-rewrite-local`  
**Lab / algo:** `rewrite-local`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=rewrite-local&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Opportunities

![Step 1](steps/01-opp.png)

**Caption (transcript):** Several AND nodes qualify as rewrite candidates.

**Slide bullets:**

- Complements
- AND kids

**On-screen metrics:**

```
n=2
```

## Step 2 — Both comp

![Step 2](steps/02-both.png)

**Caption (transcript):** AND(~, ~) is a NOR mapping hint.

**Slide bullets:**

- De Morgan

**On-screen metrics:**

```
NOR2 later
```

## Step 3 — Push

![Step 3](steps/03-push.png)

**Caption (transcript):** Inverter-push report lists those nodes.

**Slide bullets:**

- Lite rewrite

**On-screen metrics:**

```
applied=0
```

## Step 4 — Preserve

![Step 4](steps/04-fn.png)

**Caption (transcript):** Function f stays the same under rewrite bookkeeping.

**Slide bullets:**

- Equivalence

**On-screen metrics:**

```
Toy
```

## Step 5 — Map later

![Step 5](steps/05-map.png)

**Caption (transcript):** Techmap will use NOR2 when both comps appear.

**Slide bullets:**

- Library

**On-screen metrics:**

```
Techmap
```

