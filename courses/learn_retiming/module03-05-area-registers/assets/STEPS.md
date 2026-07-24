# Register area tradeoff — step-by-step (for slides / transcript)

**Module:** `module03-05-area-registers`  
**Lab / algo:** `area-registers`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=area-registers&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Registers ≈ area

![Step 1](steps/01-proxy.png)

**Caption (transcript):** Total w is a stand-in for flip-flop area.

**Slide bullets:**

- FF count

**On-screen metrics:**

```
sum w
```

## Step 2 — Baseline 2

![Step 2](steps/02-base.png)

**Caption (transcript):** Starter has two registers.

**Slide bullets:**

- cheap

**On-screen metrics:**

```
regs=2
```

## Step 3 — Timing vs area

![Step 3](steps/03-trade.png)

**Caption (transcript):** Forward on a buys P=5 for one extra register.

**Slide bullets:**

- tradeoff

**On-screen metrics:**

```
2→3
```

## Step 4 — Where they sit

![Step 4](steps/04-edges.png)

**Caption (transcript):** After forward a, registers sit on e1, e2, e4.

**Slide bullets:**

- moved

**On-screen metrics:**

```
labels
```

## Step 5 — Done

![Step 5](steps/05-done.png)

**Caption (transcript):** Next: offline compare, then wrap toward equivalence or STA.

**Slide bullets:**

- learn_equivalence

**On-screen metrics:**

```
Wrap
```

