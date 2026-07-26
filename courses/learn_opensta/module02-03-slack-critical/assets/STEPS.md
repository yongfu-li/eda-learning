# Slack & critical path — step-by-step (for slides / transcript)

**Module:** `module02-03-slack-critical`  
**Lab / algo:** `slack-critical`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=slack-critical&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Critical path

![Step 1](steps/01-path.png)

**Caption (transcript):** The only data path is a/b → u1 → u2 → u3 → y.

**Slide bullets:**

- u1
- u2
- u3

**On-screen metrics:**

```
path
```

## Step 2 — Path delay

![Step 2](steps/02-delay.png)

**Caption (transcript):** Sum of cell delays is 2.0.

**Slide bullets:**

- delay

**On-screen metrics:**

```
2.0
```

## Step 3 — Slack formula

![Step 3](steps/03-formula.png)

**Caption (transcript):** Slack equals required minus arrival.

**Slide bullets:**

- slack

**On-screen metrics:**

```
R-A
```

## Step 4 — Slack value

![Step 4](steps/04-value.png)

**Caption (transcript):** With period 10 and arrival 2, slack is 8.

**Slide bullets:**

- y

**On-screen metrics:**

```
8
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: slack=8 at period 10.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
8
```

