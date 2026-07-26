# Techmap delay — step-by-step (for slides / transcript)

**Module:** `module04-01-techmap-delay`  
**Lab / algo:** `techmap-delay`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=techmap-delay&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Extra buffer NAND

![Step 1](steps/01-extra.png)

**Caption (transcript):** Delay mode adds buffer NAND on NOR path.

**Slide bullets:**

- delay

**On-screen metrics:**

```
+1
```

## Step 2 — NOR five NAND

![Step 2](steps/02-nor5.png)

**Caption (transcript):** NOR path uses five NAND vs four in area.

**Slide bullets:**

- NOR

**On-screen metrics:**

```
5
```

## Step 3 — Total NAND

![Step 3](steps/03-total.png)

**Caption (transcript):** Seven NAND2 cells in delay mapping.

**Slide bullets:**

- total

**On-screen metrics:**

```
7
```

## Step 4 — Area vs delay

![Step 4](steps/04-trade.png)

**Caption (transcript):** Compare nand=6 area vs nand=7 delay.

**Slide bullets:**

- trade

**On-screen metrics:**

```
6/7
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: techmap_nand_count_delay=7.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
7
```

