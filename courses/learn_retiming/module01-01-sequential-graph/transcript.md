# Sequential circuit graph

**Module id:** module01-01-sequential-graph
**Lab:** sequential-graph
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Seq graph

Retiming starts from a sequential circuit graph — not just a Boolean network.

## Slide 2 — The idea

Nodes carry combinational delay; edges carry register counts w. Our toy has five nodes and five edges.

<!-- algorithm-walkthrough -->

## Slide 3 — Topology

![Topology](assets/steps/01-topo.png)

Five nodes: PI u, comb a/b/c, PO v, plus shortcut a→c.

## Slide 4 — PI/PO

![PI/PO](assets/steps/02-pi.png)

Blue circle u is the primary input; red v is the primary output.

## Slide 5 — Comb boxes

![Comb boxes](assets/steps/03-comb.png)

Green boxes a, b, c carry combinational delay.

## Slide 6 — Five edges

![Five edges](assets/steps/04-edges.png)

Edge labels show register weight w. Five edges total.

## Slide 7 — Stats

![Stats](assets/steps/05-stats.png)

GOLDENS: 5 nodes, 5 edges, 3 comb, 2 base registers.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **sequential-graph**. Click nodes; read delay labels and edge ids.

## Slide 9 — Implement track

Load tiny_retime.json; call graph_stats — expect 5 nodes, 5 edges.

## Slide 10 — Pitfalls

Treating edge w as delay. Confusing PO v with a comb node.

## Slide 11 — Your turn

Next: edge register counts in detail.
