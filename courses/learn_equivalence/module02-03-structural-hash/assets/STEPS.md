# Structural hash / FRAIG lite — step-by-step (for slides / transcript)

**Module:** `module02-03-structural-hash`  
**Lab / algo:** `structural-hash`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=structural-hash&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Hash signatures

![Step 1](steps/01-idea.png)

**Caption (transcript):** FRAIG-lite hashes each gate by (op, sorted child hashes).

**Slide bullets:**

- structural

**On-screen metrics:**

```
not functional
```

## Step 2 — Spec hashes

![Step 2](steps/02-spec.png)

**Caption (transcript):** Spec has 2 gates → 2 unique hashes on the toy.

**Slide bullets:**

- unique

**On-screen metrics:**

```
n=2
```

## Step 3 — Good fraig

![Step 3](steps/03-good.png)

**Caption (transcript):** Good rewrite has more gates; fraig_nodes = unique hashes.

**Slide bullets:**

- fraig

**On-screen metrics:**

```
nodes=5
```

## Step 4 — Not enough alone

![Step 4](steps/04-limit.png)

**Caption (transcript):** Different structures can still be functionally equal.

**Slide bullets:**

- need SAT/TT

**On-screen metrics:**

```
literacy
```

## Step 5 — Cleanup first

![Step 5](steps/05-use.png)

**Caption (transcript):** Structural hashing cleans duplicates before CEC.

**Slide bullets:**

- strash/FRAIG

**On-screen metrics:**

```
Next SAT
```

