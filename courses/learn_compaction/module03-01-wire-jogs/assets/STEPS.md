# Wire jogs / stretch — step-by-step (for slides / transcript)

**Module:** `module03-01-wire-jogs`  
**Lab / algo:** `wire-jogs`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=wire-jogs&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Wire W

![Step 1](steps/01-w.png)

**Caption (transcript):** W is horizontal at y=7 spanning x=4..16.

**Slide bullets:**

- wire

**On-screen metrics:**

```
M1
```

## Step 2 — Jog

![Step 2](steps/02-jog.png)

**Caption (transcript):** add_jog records a bend point.

**Slide bullets:**

- bend

**On-screen metrics:**

```
polyline
```

## Step 3 — Stretch

![Step 3](steps/03-stretch.png)

**Caption (transcript):** After compact, stretch W to cell bbox.

**Slide bullets:**

- retarget

**On-screen metrics:**

```
x0/x1
```

## Step 4 — Points

![Step 4](steps/04-pts.png)

**Caption (transcript):** points list holds polyline vertices.

**Slide bullets:**

- geometry

**On-screen metrics:**

```
3 pts
```

## Step 5 — Why

![Step 5](steps/05-why.png)

**Caption (transcript):** Without jogs, wires disconnect from moving pins.

**Slide bullets:**

- connectivity

**On-screen metrics:**

```
need bend
```

