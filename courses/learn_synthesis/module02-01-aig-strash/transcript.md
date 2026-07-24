# Structural hashing (strash)

**Module id:** module02-01-aig-strash
**Lab:** aig-strash
**Tracks:** A (implement) · B (browser lab)

## Slide 1 — Strash

Strash reuses identical AND structures so the graph stays compact.

## Slide 2 — The idea

Canonical key sorts the two literals; table maps key → node id.

<!-- algorithm-walkthrough -->

## Slide 3 — Table

![Table](assets/steps/01-table.png)

Four AND nodes → four strash entries on the toy.

## Slide 4 — Key

![Key](assets/steps/02-key.png)

Key orders fanin literals so AND(a,b)=AND(b,a).

## Slide 5 — Lookup

![Lookup](assets/steps/03-lookup.png)

Identical fanins would hit the same entry.

## Slide 6 — No dup

![No dup](assets/steps/04-dup.png)

Toy has no duplicate keys.

## Slide 7 — Why

![Why](assets/steps/05-why.png)

Strash is the first cleanup before rewrite.

<!-- /algorithm-walkthrough -->


## Slide 8 — Browser lab track

![Browser lab starter](assets/lab-starter.png)

Open **aig-strash**. Confirm strash entries = 4.

## Slide 9 — Implement track

Call build_strash_table; assert len==4.

## Slide 10 — Pitfalls

Forgetting to sort fanins. Hashing node id instead of literals.

## Slide 11 — Your turn

Next: local rewrite opportunities.
