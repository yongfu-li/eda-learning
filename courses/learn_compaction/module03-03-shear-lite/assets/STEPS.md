# Shear / channel lite — step-by-step (for slides / transcript)

**Module:** `module03-03-shear-lite`  
**Lab / algo:** `shear-lite`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=shear-lite&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Channel

![Step 1](steps/01-ch.png)

**Caption (transcript):** Pick an X band covering B.

**Slide bullets:**

- band

**On-screen metrics:**

```
7..13
```

## Step 2 — Delta

![Step 2](steps/02-dy.png)

**Caption (transcript):** Apply delta_y to intersecting objects.

**Slide bullets:**

- shift Y

**On-screen metrics:**

```
+1
```

## Step 3 — Moved

![Step 3](steps/03-moved.png)

**Caption (transcript):** Report which ids moved.

**Slide bullets:**

- ids

**On-screen metrics:**

```
B…
```

## Step 4 — Legal check

![Step 4](steps/04-legal.png)

**Caption (transcript):** Re-check spacing after shear.

**Slide bullets:**

- is_legal

**On-screen metrics:**

```
gate
```

## Step 5 — Use

![Step 5](steps/05-use.png)

**Caption (transcript):** Shear is a local cleanup before another compact pass.

**Slide bullets:**

- iterate

**On-screen metrics:**

```
next seq
```

