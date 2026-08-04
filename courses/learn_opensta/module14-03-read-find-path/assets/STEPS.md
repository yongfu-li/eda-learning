# Read find_path / report — step-by-step (for slides / transcript)

**Module:** `module14-03-read-find-path`  
**Lab / algo:** `read-find-path`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=read-find-path&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Tag endpoints

![Step 1](steps/01-tag.png)

**Caption (transcript):** Search tags which pins are report endpoints.

**Slide bullets:**

- tag_endpoints

**On-screen metrics:**

```
ends
```

## Step 2 — Walk back

![Step 2](steps/02-walk.png)

**Caption (transcript):** From the worst slack endpoint, walk previous arcs.

**Slide bullets:**

- walk_back

**On-screen metrics:**

```
back
```

## Step 3 — Emit path

![Step 3](steps/03-emit.png)

**Caption (transcript):** Emit the ordered pin list for the critical path.

**Slide bullets:**

- emit_path

**On-screen metrics:**

```
b→y
```

## Step 4 — report_checks

![Step 4](steps/04-report.png)

**Caption (transcript):** report_checks formats delay 2 and slack 8 MET.

**Slide bullets:**

- report_checks

**On-screen metrics:**

```
8
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: tag → walk → emit → report; slack 8 path b→y.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

