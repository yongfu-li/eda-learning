# Techmap area — step-by-step (for slides / transcript)

**Module:** `module03-03-techmap-area`  
**Lab / algo:** `techmap-area`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=techmap-area&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — NAND2 library

![Step 1](steps/01-lib.png)

**Caption (transcript):** Map AND/NOR to NAND2 cells.

**Slide bullets:**

- techmap

**On-screen metrics:**

```
NAND2
```

## Step 2 — AND → 2 NAND

![Step 2](steps/02-and.png)

**Caption (transcript):** Each AND uses two NAND (inverter trick).

**Slide bullets:**

- AND

**On-screen metrics:**

```
2
```

## Step 3 — NOR → 4 NAND

![Step 3](steps/03-nor.png)

**Caption (transcript):** NOR mapped with four NAND in area mode.

**Slide bullets:**

- NOR

**On-screen metrics:**

```
4
```

## Step 4 — NAND count

![Step 4](steps/04-count.png)

**Caption (transcript):** Count pure NAND2 instances.

**Slide bullets:**

- count

**On-screen metrics:**

```
6
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: techmap_nand_count_area=6.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
6
```

