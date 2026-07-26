# Floating nets — step-by-step (for slides / transcript)

**Module:** `module02-01-floating-nets`  
**Lab / algo:** `floating-nets`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=floating-nets&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — No driver

![Step 1](steps/01-nodrv.png)

**Caption (transcript):** float_n has zero output pins.

**Slide bullets:**

- no-driver

**On-screen metrics:**

```
0
```

## Step 2 — Has load

![Step 2](steps/02-load.png)

**Caption (transcript):** u2.A loads float_n.

**Slide bullets:**

- load

**On-screen metrics:**

```
u2.A
```

## Step 3 — Not port

![Step 3](steps/03-port.png)

**Caption (transcript):** float_n is not a primary port.

**Slide bullets:**

- ports

**On-screen metrics:**

```
a/b/y
```

## Step 4 — Not supply

![Step 4](steps/04-sup.png)

**Caption (transcript):** float_n is not vdd/vss.

**Slide bullets:**

- supplies

**On-screen metrics:**

```
vdd/vss
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: floating_count=1.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
1
```

