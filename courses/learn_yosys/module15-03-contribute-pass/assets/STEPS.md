# Contribute a pass — step-by-step (for slides / transcript)

**Module:** `module15-03-contribute-pass`  
**Lab / algo:** `contribute-pass`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=contribute-pass&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Tree layout

![Step 1](steps/01-tree.png)

**Caption (transcript):** kernel/ holds RTLIL and Pass; passes/ holds commands.

**Slide bullets:**

- kernel
- passes

**On-screen metrics:**

```
tree
```

## Step 2 — Stub file

![Step 2](steps/02-stub.png)

**Caption (transcript):** Minimal .cc: headers, struct MyPass, REGISTER_PASS.

**Slide bullets:**

- stub

**On-screen metrics:**

```
.cc
```

## Step 3 — Build hook

![Step 3](steps/03-build.png)

**Caption (transcript):** Add the object to the Makefile and rebuild.

**Slide bullets:**

- Makefile

**On-screen metrics:**

```
build
```

## Step 4 — Smoke

![Step 4](steps/04-smoke.png)

**Caption (transcript):** yosys -h my_pass proves the command exists.

**Slide bullets:**

- yosys -h

**On-screen metrics:**

```
smoke
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: path + REGISTER_PASS + build + help smoke.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

