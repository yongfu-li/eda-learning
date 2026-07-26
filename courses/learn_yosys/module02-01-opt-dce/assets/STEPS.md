# Opt / DCE — step-by-step (for slides / transcript)

**Module:** `module02-01-opt-dce`  
**Lab / algo:** `opt-dce`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=opt-dce&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Dead BUF scan

![Step 1](steps/01-scan.png)

**Caption (transcript):** opt finds BUF tied to const0.

**Slide bullets:**

- opt

**On-screen metrics:**

```
c4
```

## Step 2 — BUF c4

![Step 2](steps/02-buf.png)

**Caption (transcript):** c4: BUF(const0)→dead never reaches PO.

**Slide bullets:**

- BUF

**On-screen metrics:**

```
dead
```

## Step 3 — Remove c4

![Step 3](steps/03-drop.png)

**Caption (transcript):** DCE drops unreachable dead cell.

**Slide bullets:**

- DCE

**On-screen metrics:**

```
−1
```

## Step 4 — Five cells

![Step 4](steps/04-five.png)

**Caption (transcript):** Remaining comb+seq after opt.

**Slide bullets:**

- cells

**On-screen metrics:**

```
5
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: after_opt_cells=5.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
5
```

