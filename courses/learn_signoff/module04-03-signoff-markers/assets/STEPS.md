# Fail markers — step-by-step (for slides / transcript)

**Module:** `module04-03-signoff-markers`  
**Lab / algo:** `signoff-markers`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=signoff-markers&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Check fail

![Step 1](steps/01-kind.png)

**Caption (transcript):** Markers tag each failing check for review.

**Slide bullets:**

- markers

**On-screen metrics:**

```
2
```

## Step 2 — STA marker

![Step 2](steps/02-sta.png)

**Caption (transcript):** STA fail emits check_fail marker.

**Slide bullets:**

- sta

**On-screen metrics:**

```
1
```

## Step 3 — Antenna marker

![Step 3](steps/03-ant.png)

**Caption (transcript):** Antenna fail emits second marker.

**Slide bullets:**

- antenna

**On-screen metrics:**

```
1
```

## Step 4 — No pass markers

![Step 4](steps/04-pass.png)

**Caption (transcript):** Passing checks do not emit markers.

**Slide bullets:**

- pass

**On-screen metrics:**

```
0
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: marker_count=2.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
2
```

