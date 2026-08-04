# Read netlists map — step-by-step (for slides / transcript)

**Module:** `module01-01-read-netlists-map`  
**Lab / algo:** `read-netlists-map`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=read-netlists-map&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Schematic

![Step 1](steps/01-sch.png)

**Caption (transcript):** tiny_inv schematic has mn1 (nmos) and mp1 (pmos).

**Slide bullets:**

- mn1
- mp1

**On-screen metrics:**

```
2
```

## Step 2 — Layout

![Step 2](steps/02-lay.png)

**Caption (transcript):** Layout side has X0 (nmos) and X1 (pmos).

**Slide bullets:**

- X0
- X1

**On-screen metrics:**

```
2
```

## Step 3 — Four ports

![Step 3](steps/03-ports.png)

**Caption (transcript):** Ports A, Y, VDD, VSS on both sides.

**Slide bullets:**

- A
- Y

**On-screen metrics:**

```
4
```

## Step 4 — read command

![Step 4](steps/04-read.png)

**Caption (transcript):** Netgen read loads SPICE-like netlists.

**Slide bullets:**

- read

**On-screen metrics:**

```
map
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: sch_devices=2 lay_devices=2.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
2/2
```

