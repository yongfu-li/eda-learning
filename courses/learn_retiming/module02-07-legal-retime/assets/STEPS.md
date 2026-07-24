# Legal retiming — step-by-step (for slides / transcript)

**Module:** `module02-07-legal-retime`  
**Lab / algo:** `legal-retime`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=legal-retime&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — All w_r ≥ 0

![Step 1](steps/01-rule.png)

**Caption (transcript):** A retiming is legal iff every edge keeps non-negative weight.

**Slide bullets:**

- constraint

**On-screen metrics:**

```
hard
```

## Step 2 — Zero is legal

![Step 2](steps/02-zero.png)

**Caption (transcript):** r≡0 is always legal on the starter.

**Slide bullets:**

- baseline

**On-screen metrics:**

```
yes
```

## Step 3 — Forward a legal

![Step 3](steps/03-fwd.png)

**Caption (transcript):** Forward on a stays legal and improves period.

**Slide bullets:**

- ok

**On-screen metrics:**

```
P=5
```

## Step 4 — Backward c illegal

![Step 4](steps/04-bwd.png)

**Caption (transcript):** Backward on c alone violates e3.

**Slide bullets:**

- fail

**On-screen metrics:**

```
w=-1
```

## Step 5 — Always check

![Step 5](steps/05-check.png)

**Caption (transcript):** Before trusting period, assert legality.

**Slide bullets:**

- is_legal

**On-screen metrics:**

```
gate
```

