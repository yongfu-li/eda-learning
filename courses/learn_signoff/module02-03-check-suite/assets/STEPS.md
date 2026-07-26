# Check suite — step-by-step (for slides / transcript)

**Module:** `module02-03-check-suite`  
**Lab / algo:** `check-suite`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=check-suite&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Six checks

![Step 1](steps/01-suite.png)

**Caption (transcript):** STA, DRC, LVS, ERC, Antenna, IR in the suite.

**Slide bullets:**

- checks

**On-screen metrics:**

```
6
```

## Step 2 — STA fail

![Step 2](steps/02-sta.png)

**Caption (transcript):** STA slack −0.05 — timing fail.

**Slide bullets:**

- sta

**On-screen metrics:**

```
fail
```

## Step 3 — Layout pass

![Step 3](steps/03-layout.png)

**Caption (transcript):** DRC, LVS, ERC all pass.

**Slide bullets:**

- drc
- lvs
- erc

**On-screen metrics:**

```
pass
```

## Step 4 — Antenna fail

![Step 4](steps/04-ant.png)

**Caption (transcript):** One antenna violation remains.

**Slide bullets:**

- antenna

**On-screen metrics:**

```
fail
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: fail_count=2 (sta, antenna).

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
2
```

