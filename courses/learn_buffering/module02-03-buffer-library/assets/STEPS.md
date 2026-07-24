# Buffer library options — step-by-step (for slides / transcript)

**Module:** `module02-03-buffer-library`  
**Lab / algo:** `buffer-library`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=buffer-library&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Three cells

![Step 1](steps/01-three.png)

**Caption (transcript):** Library has BUF_X1, BUF_X2, INV_X1.

**Slide bullets:**

- cin/rout/delay

**On-screen metrics:**

```
lib=3
```

## Step 2 — BUF_X2 stronger

![Step 2](steps/02-x2.png)

**Caption (transcript):** BUF_X2: higher cin, lower rout, slightly less intrinsic delay.

**Slide bullets:**

- Drive strength

**On-screen metrics:**

```
Trade cin
```

## Step 3 — Inverter

![Step 3](steps/03-inv.png)

**Caption (transcript):** INV_X1 flips polarity — used in polarity labs.

**Slide bullets:**

- invert=true

**On-screen metrics:**

```
Purple later
```

## Step 4 — Pick for DP

![Step 4](steps/04-pick.png)

**Caption (transcript):** VG options reference library ids on buffered solutions.

**Slide bullets:**

- buf id

**On-screen metrics:**

```
Van Ginneken
```

## Step 5 — Area trade

![Step 5](steps/05-area.png)

**Caption (transcript):** Real flows also score area; this toy scores delay/slew only.

**Slide bullets:**

- Toy scope

**On-screen metrics:**

```
Next: VG
```

