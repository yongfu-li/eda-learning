# Multi-layer rule deck — step-by-step (for slides / transcript)

**Module:** `module03-01-multi-layer-deck`  
**Lab / algo:** `multi-layer-deck`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=multi-layer-deck&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Cross

![Step 1](steps/01-cross.png)

**Caption (transcript):** Deck rules span M1, M2, and VIA.

**Slide bullets:**

- layers

**On-screen metrics:**

```
M1/M2/VIA
```

## Step 2 — Enc rules

![Step 2](steps/02-enc.png)

**Caption (transcript):** Two enclosure rules: E.VIA_M1 and E.VIA_M2.

**Slide bullets:**

- enc

**On-screen metrics:**

```
2
```

## Step 3 — Boolean

![Step 3](steps/03-bool.png)

**Caption (transcript):** B.VIA_M1_not_M2 boolean rule on VIA.

**Slide bullets:**

- boolean

**On-screen metrics:**

```
1
```

## Step 4 — Fire

![Step 4](steps/04-fire.png)

**Caption (transcript):** E.VIA_M2 fires — V not enclosed by M2.

**Slide bullets:**

- fire

**On-screen metrics:**

```
V
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: 2 enclosure rules; fires E.VIA_M2.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
2
```

