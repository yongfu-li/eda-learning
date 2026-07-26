# Pass registration

**Module id:** module14-03-pass-registration
**Lab:** pass-registration
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why registration

Yosys is a pass engine. Your code becomes a command when it registers a Pass.

## Slide 2 — The idea

GOLDEN: subclass Pass, REGISTER_PASS, implement execute(args, design).

<!-- algorithm-walkthrough -->

## Slide 3 — Pass class

![Pass class](assets/steps/01-pass.png)

Pass stores the command name and short help.

## Slide 4 — REGISTER_PASS

![REGISTER_PASS](assets/steps/02-register.png)

The macro installs the pass into the global command table.

## Slide 5 — execute

![execute](assets/steps/03-execute.png)

execute receives args and the live Design pointer.

## Slide 6 — Selection

![Selection](assets/steps/04-selection.png)

extra_args applies the selection stack.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: name → register → execute → selected modules.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

Open **pass-registration**. Order the registration steps and check.

## Slide 9 — Implement track

Call pass_registration(); assert recipe ids match the golden sequence.

## Slide 10 — Pitfalls

Forgetting REGISTER_PASS. Mutating modules that are not selected.

## Slide 11 — Try these

From the common folder, call pass_registration and print the recipe.

```bash
cd courses/learn_yosys/common
python3 -c "from internals_solvers import pass_registration; print(pass_registration())"
```

## Slide 12 — Pseudocode

Here is the Pass registration shape in plain steps.

```text
struct MyPass : Pass { MyPass(): Pass("my_pass", "help") {}
  void execute(args, design) override { ... } };
REGISTER_PASS(MyPass)
```

## Slide 13 — Next

Next: read the real opt_clean shape in the Yosys tree.
