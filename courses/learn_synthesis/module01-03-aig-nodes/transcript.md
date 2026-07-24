# And-Inverter Graph nodes

**Module id:** module01-03-aig-nodes
**Lab:** aig-nodes
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — AIG nodes

AIGs use only AND + optional edge complement — not arbitrary gates yet.

## Slide 2 — The idea

Each AND has two fanins (id, complemented). Evaluate bottom-up with bitwise AND.

<!-- algorithm-walkthrough -->

## Slide 3 — Kinds

![Kinds](assets/steps/01-kinds.png)

PI circles vs AND rectangles.

## Slide 4 — Fanin

![Fanin](assets/steps/02-fanin.png)

Node 5 takes ~4 and c.

## Slide 5 — Eval

![Eval](assets/steps/03-eval.png)

With a=1,b=0,c=1 the PO f equals 1.

## Slide 6 — Select

![Select](assets/steps/04-sel.png)

Select node 5 to highlight fanins.

## Slide 7 — Count

![Count](assets/steps/05-count.png)

GOLDENS: 3 PI, 4 AND, 1 PO.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **aig-nodes**. Toggle to a=1,b=1,c=1 and confirm f=0.

## Slide 9 — Implement track

Call output_value for assignments (1,0,1) and (1,1,1).

## Slide 10 — Pitfalls

Evaluating complemented edges wrongly. Mixing PI names with ids.

## Slide 11 — Your turn

Next: structural hashing.
