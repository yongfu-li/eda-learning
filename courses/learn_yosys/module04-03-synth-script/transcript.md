# Synth script

**Module id:** module04-03-synth-script
**Lab:** synth-script
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Why synth

A Yosys synth script chains named passes into one recipe.

## Slide 2 — The idea

GOLDEN: full chain completes with nand area mapping.

<!-- algorithm-walkthrough -->

## Slide 3 — Pass recipe chain

![Pass recipe chain](assets/steps/01-chain.png)

proc → flatten → opt → strash → rewrite → techmap.

## Slide 4 — proc step

![proc step](assets/steps/02-proc.png)

Start from RTL gate netlist.

## Slide 5 — Mid passes

![Mid passes](assets/steps/03-mid.png)

opt/strash/rewrite shrink to mapped base.

## Slide 6 — techmap area

![techmap area](assets/steps/04-map.png)

Final techmap emits NAND library.

## Slide 7 — Golden

![Golden](assets/steps/05-golden.png)

GOLDEN: synth recipe completes.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **synth-script**. Run synth; confirm mapped netlist.

## Slide 9 — Implement track

Call pass_synth_script(); assert nand_count==6.

## Slide 10 — Pitfalls

Skipping flatten. Wrong pass order.

## Slide 11 — Your turn

Next: yosys engine.
