# Device callbacks (diode) — step-by-step (for slides / transcript)

**Module:** `module03-03-device-callbacks`  
**Lab / algo:** `device-callbacks`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=device-callbacks&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — i(v)

![Step 1](steps/01-i.png)

**Caption (transcript):** Diode current Is(exp(v/Vt)-1).

**Slide bullets:**

- i

**On-screen metrics:**

```
exp
```

## Step 2 — g=di/dv

![Step 2](steps/02-g.png)

**Caption (transcript):** Conductance for Jacobian.

**Slide bullets:**

- g

**On-screen metrics:**

```
Is/Vt·exp
```

## Step 3 — 1-D loop

![Step 3](steps/03-loop.png)

**Caption (transcript):** Series R+diode Newton.

**Slide bullets:**

- 1-D

**On-screen metrics:**

```
NR
```

## Step 4 — Converge

![Step 4](steps/04-cv.png)

**Caption (transcript):** diode_loop_newton converges.

**Slide bullets:**

- ok

**On-screen metrics:**

```
true
```

## Step 5 — Hook

![Step 5](steps/05-hook.png)

**Caption (transcript):** Callbacks plug into MNA stamps.

**Slide bullets:**

- API

**On-screen metrics:**

```
i,g
```

