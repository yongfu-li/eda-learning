# Pass registration — step-by-step (for slides / transcript)

**Module:** `module14-03-pass-registration`  
**Lab / algo:** `pass-registration`  
**Viewer:** `/tools/algorithm-walkthrough/?algo=pass-registration&step=1`

Use each **Caption** as spoken prose (or a shortened slide note).
Use **Bullets** on the PPT; pair with the PNG in `assets/steps/`.

## Step 1 — Pass class

![Step 1](steps/01-pass.png)

**Caption (transcript):** Pass stores the command name and short help.

**Slide bullets:**

- Pass

**On-screen metrics:**

```
name
```

## Step 2 — REGISTER_PASS

![Step 2](steps/02-register.png)

**Caption (transcript):** The macro installs the pass into the global command table.

**Slide bullets:**

- REGISTER_PASS

**On-screen metrics:**

```
table
```

## Step 3 — execute

![Step 3](steps/03-execute.png)

**Caption (transcript):** execute receives args and the live Design pointer.

**Slide bullets:**

- execute

**On-screen metrics:**

```
Design*
```

## Step 4 — Selection

![Step 4](steps/04-selection.png)

**Caption (transcript):** extra_args applies the selection stack.

**Slide bullets:**

- selection

**On-screen metrics:**

```
mods
```

## Step 5 — Golden

![Step 5](steps/05-golden.png)

**Caption (transcript):** GOLDEN: name → register → execute → selected modules.

**Slide bullets:**

- GOLDEN

**On-screen metrics:**

```
ok
```

