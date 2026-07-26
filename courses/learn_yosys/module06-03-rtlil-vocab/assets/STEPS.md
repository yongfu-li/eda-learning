# RTLIL vocabulary — step-by-step (for slides / transcript)

**Module:** `module06-03-rtlil-vocab`  
**Lab / algo:** `rtlil-vocab`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=rtlil-vocab&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Two modules

![Step 1](steps/01-mods.png)

**Caption (transcript):** top + child after hierarchy.

**Slide bullets:**

- modules

**On-screen metrics:**

```
2
```

## Step 2 — Process in child

![Step 2](steps/02-proc.png)

**Caption (transcript):** Child still has 1 process.

**Slide bullets:**

- process

**On-screen metrics:**

```
1
```

## Step 3 — $and×2

![Step 3](steps/03-and.png)

**Caption (transcript):** Two $and cells — duplicate assign.

**Slide bullets:**

- $and

**On-screen metrics:**

```
2
```

## Step 4 — $or and $not

![Step 4](steps/04-ornot.png)

**Caption (transcript):** OR/NOT appear as $or / $not.

**Slide bullets:**

- $or
- $not

**On-screen metrics:**

```
types
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: modules=2 processes=1 and=2.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
2/1/2
```

