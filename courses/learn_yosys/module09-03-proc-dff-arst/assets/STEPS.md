# proc_dff + async reset — step-by-step (for slides / transcript)

**Module:** `module09-03-proc-dff-arst`  
**Lab / algo:** `proc-dff-arst`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=proc-dff-arst&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Sync process

![Step 1](steps/01-sync.png)

**Caption (transcript):** Posedge clk with async reset.

**Slide bullets:**

- sync

**On-screen metrics:**

```
clk
```

## Step 2 — Emit $adff

![Step 2](steps/02-dff.png)

**Caption (transcript):** Real Yosys emits $adff when async reset is present.

**Slide bullets:**

- $adff

**On-screen metrics:**

```
1
```

## Step 3 — ARST port

![Step 3](steps/03-arst.png)

**Caption (transcript):** Reset becomes ARST on the $adff.

**Slide bullets:**

- ARST

**On-screen metrics:**

```
rst
```

## Step 4 — Processes=0

![Step 4](steps/04-done.png)

**Caption (transcript):** All processes lowered.

**Slide bullets:**

- 0

**On-screen metrics:**

```
proc
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: type=$adff has_arst=True.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

