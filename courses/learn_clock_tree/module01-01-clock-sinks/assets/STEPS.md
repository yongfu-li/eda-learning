# Clock sinks from placement — step-by-step (for slides / transcript)

**Module:** `module01-01-clock-sinks`  
**Lab / algo:** `clock-sinks`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=clock-sinks&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — 12×8 chip

![Step 1](steps/01-chip.png)

**Caption (transcript):** Six sinks A–F sit on the same spread placement as routing labs.

**Slide bullets:**

- Same PD spine
- Toy CTS

**On-screen metrics:**

```
6 sinks
```

## Step 2 — Clock source

![Step 2](steps/02-src.png)

**Caption (transcript):** CLK star at chip center (6,4) — the root of every tree.

**Slide bullets:**

- Fixed source
- Yellow star

**On-screen metrics:**

```
(6,4)
```

## Step 3 — Sink A

![Step 3](steps/03-a.png)

**Caption (transcript):** A at (1,1) southwest corner.

**Slide bullets:**

- Cell centers
- Drag to move

**On-screen metrics:**

```
A=(1,1)
```

## Step 4 — Sink D

![Step 4](steps/04-d.png)

**Caption (transcript):** D at (8,5) northeast.

**Slide bullets:**

- Opposite corner
- Long path to A

**On-screen metrics:**

```
D=(8,5)
```

## Step 5 — All six

![Step 5](steps/05-all.png)

**Caption (transcript):** E/F sit near the center corridor beside the source.

**Slide bullets:**

- E≈(5,3)
- F≈(6,3)

**On-screen metrics:**

```
Ready for trees
```

