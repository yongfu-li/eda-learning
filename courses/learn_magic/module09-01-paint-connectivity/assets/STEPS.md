# Paint connectivity algorithm — step-by-step (for slides / transcript)

**Module:** `module09-01-paint-connectivity`  
**Lab / algo:** `paint-connectivity`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=paint-connectivity&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — metal1 shapes

![Step 1](steps/01-m1.png)

**Caption (transcript):** Two metal1 rectangles: m1y and thin (touching).

**Slide bullets:**

- m1y
- thin

**On-screen metrics:**

```
2
```

## Step 2 — One metal1 net

![Step 2](steps/02-net.png)

**Caption (transcript):** Flood-fill connects m1y and thin.

**Slide bullets:**

- net

**On-screen metrics:**

```
1
```

## Step 3 — Contact ca

![Step 3](steps/03-ca.png)

**Caption (transcript):** Contact bridges poly gate g and metal1.

**Slide bullets:**

- ca

**On-screen metrics:**

```
1
```

## Step 4 — poly link

![Step 4](steps/04-poly.png)

**Caption (transcript):** poly layer participates via contact.

**Slide bullets:**

- g

**On-screen metrics:**

```
poly
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: metal1_net_shapes=2 contact=1.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
2/1
```

