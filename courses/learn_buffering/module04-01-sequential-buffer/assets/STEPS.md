# Sequential buffering pass — step-by-step (for slides / transcript)

**Module:** `module04-01-sequential-buffer`  
**Lab / algo:** `sequential-buffer`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=sequential-buffer&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Pipeline

![Step 1](steps/01-pipe.png)

**Caption (transcript):** Sites → VG/slew → fanout compose.

**Slide bullets:**

- Full pass

**On-screen metrics:**

```
Toy flow
```

## Step 2 — Run pass

![Step 2](steps/02-run.png)

**Caption (transcript):** Sequential pass paints buffers and sites.

**Slide bullets:**

- One click

**On-screen metrics:**

```
Compose
```

## Step 3 — Metrics

![Step 3](steps/03-met.png)

**Caption (transcript):** Read VG delay vs wire delay.

**Slide bullets:**

- improved

**On-screen metrics:**

```
Overlay
```

## Step 4 — Mode slew

![Step 4](steps/04-slew.png)

**Caption (transcript):** Alternate primary mode is slew-driven.

**Slide bullets:**

- Heuristic

**On-screen metrics:**

```
Compare
```

## Step 5 — Handoff

![Step 5](steps/05-done.png)

**Caption (transcript):** Next deepen timing/signoff courses.

**Slide bullets:**

- learn_signoff
- learn_sta

**On-screen metrics:**

```
Wrap
```

