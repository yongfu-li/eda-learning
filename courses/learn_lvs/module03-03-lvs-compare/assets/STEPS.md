# LVS graph compare — step-by-step (for slides / transcript)

**Module:** `module03-03-lvs-compare`  
**Lab / algo:** `lvs-compare`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=lvs-compare&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Rename

![Step 1](steps/01-rename.png)

**Caption (transcript):** Map layout nets to schematic via binding.

**Slide bullets:**

- rename

**On-screen metrics:**

```
bind
```

## Step 2 — Pins

![Step 2](steps/02-pins.png)

**Caption (transcript):** Walk each device pin on both sides.

**Slide bullets:**

- pins

**On-screen metrics:**

```
G/D/S
```

## Step 3 — Check

![Step 3](steps/03-check.png)

**Caption (transcript):** Mapped layout net must equal schematic net.

**Slide bullets:**

- check

**On-screen metrics:**

```
eq
```

## Step 4 — Nets

![Step 4](steps/04-nets.png)

**Caption (transcript):** All four bound nets match.

**Slide bullets:**

- nets

**On-screen metrics:**

```
4
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: mismatch_count=0, matched_nets=4.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
0/4
```

