# DRC engine pass — step-by-step (for slides / transcript)

**Module:** `module04-01-drc-engine`  
**Lab / algo:** `drc-engine`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=drc-engine&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Deck

![Step 1](steps/01-deck.png)

**Caption (transcript):** Load deck rule_count=8.

**Slide bullets:**

- deck

**On-screen metrics:**

```
r=8
```

## Step 2 — Checks

![Step 2](steps/02-checks.png)

**Caption (transcript):** Run width, space, and enclosure checkers.

**Slide bullets:**

- checks

**On-screen metrics:**

```
3
```

## Step 3 — Viol

![Step 3](steps/03-viol.png)

**Caption (transcript):** Collect geometry violations count=3.

**Slide bullets:**

- viol

**On-screen metrics:**

```
3
```

## Step 4 — Bool

![Step 4](steps/04-bool.png)

**Caption (transcript):** Boolean hit=1 on V (separate from viol count).

**Slide bullets:**

- boolean

**On-screen metrics:**

```
1
```

## Step 5 — OK

![Step 5](steps/05-ok.png)

**Caption (transcript):** GOLDEN: ok=True viol=3.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

