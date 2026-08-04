# LVS report map — step-by-step (for slides / transcript)

**Module:** `module03-01-lvs-report-map`  
**Lab / algo:** `lvs-report-map`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=lvs-report-map&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Device match

![Step 1](steps/01-dev.png)

**Caption (transcript):** Two devices matched by type count.

**Slide bullets:**

- mn1
- X0

**On-screen metrics:**

```
2
```

## Step 2 — nmos/pmos

![Step 2](steps/02-type.png)

**Caption (transcript):** One nmos + one pmos each side.

**Slide bullets:**

- nmos
- pmos

**On-screen metrics:**

```
2
```

## Step 3 — Zero mismatch

![Step 3](steps/03-mism.png)

**Caption (transcript):** mismatch_count=0 on tiny_inv.

**Slide bullets:**

- mismatch

**On-screen metrics:**

```
0
```

## Step 4 — LVS report

![Step 4](steps/04-report.png)

**Caption (transcript):** Netgen report summarizes compare.

**Slide bullets:**

- report

**On-screen metrics:**

```
LVS
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: matched_devices=2 mismatch=0.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
2/0
```

