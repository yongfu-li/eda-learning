# Scan enable — step-by-step (for slides / transcript)

**Module:** `module01-03-scan-enable`  
**Lab / algo:** `scan-enable`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=scan-enable&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — SE port

![Step 1](steps/01-se.png)

**Caption (transcript):** scan_enable drives mux select on all SDFFs.

**Slide bullets:**

- SE

**On-screen metrics:**

```
scan_enable
```

## Step 2 — SI port

![Step 2](steps/02-si.png)

**Caption (transcript):** scan_in hooks first cell in chain.

**Slide bullets:**

- SI

**On-screen metrics:**

```
scan_in
```

## Step 3 — SO port

![Step 3](steps/03-so.png)

**Caption (transcript):** scan_out hooks last cell Q.

**Slide bullets:**

- SO

**On-screen metrics:**

```
scan_out
```

## Step 4 — Port names

![Step 4](steps/04-hook.png)

**Caption (transcript):** si=scan_in, so=scan_out, se=scan_enable.

**Slide bullets:**

- ports

**On-screen metrics:**

```
3
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: se=scan_enable, si=scan_in, so=scan_out.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

