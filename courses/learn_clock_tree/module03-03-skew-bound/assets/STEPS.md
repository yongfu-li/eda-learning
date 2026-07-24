# Skew bound with buffers — step-by-step (for slides / transcript)

**Module:** `module03-03-skew-bound`  
**Lab / algo:** `skew-bound`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=skew-bound&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Target bound

![Step 1](steps/01-bound.png)

**Caption (transcript):** Challenges ask skew ≤ GOLDENS.skewBoundDefault (2) on the toy.

**Slide bullets:**

- Pass/fail
- skewBoundOk

**On-screen metrics:**

```
bound=2
```

## Step 2 — Zero-skew helps

![Step 2](steps/02-zs.png)

**Caption (transcript):** Zero-skew merge often meets the bound without moving sinks.

**Slide bullets:**

- Try demo

**On-screen metrics:**

```
skew ≤ 2–3
```

## Step 3 — H may miss

![Step 3](steps/03-fail.png)

**Caption (transcript):** H-tree skew can exceed the tight bound on this spread.

**Slide bullets:**

- Move sinks
- Or switch mode

**On-screen metrics:**

```
H≈2
```

## Step 4 — Buffers + bound

![Step 4](steps/04-buf.png)

**Caption (transcript):** Buffering changes latencies — re-check the bound after insert.

**Slide bullets:**

- Recompute skew

**On-screen metrics:**

```
Not automatic
```

## Step 5 — Toward signoff

![Step 5](steps/05-signoff.png)

**Caption (transcript):** Real CTS targets skew under corners; this lab is the scalar habit.

**Slide bullets:**

- learn_buffering
- learn_sta

**On-screen metrics:**

```
Next: sequential
```

