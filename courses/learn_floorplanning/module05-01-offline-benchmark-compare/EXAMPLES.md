# Examples — Offline benchmark compare

## Platform benchmark (preferred)

Open [`platform/benchmarks/floorplanning/index.html`](../../../platform/benchmarks/floorplanning/index.html):

1. Preset **Hard** → **Run benchmark**.
2. Ranking is **illegal first**, then cost / HPWL / BB area.
3. Confirm **portfolio** / **legal Pareto** / **SP-SA** / **wire polish** beat identity on illegal+cost for overlap / overflow / corner_jam.
4. **Example** → SP simulated annealing → **Load example** → **Register solver**.

## Upload contract

```js
export function floorplan(pack, opts = {}) {
  // opts.outline, opts.modules, opts.lockedIds
  return { pack: /* { id: {x,y,w,h} } */, detail: "my-floorplanner" };
}
```

## Built-in engines

| Id | Idea |
|----|------|
| `clamp` / `repair` / `compact` | Outline clamp, overlap nudge, left-down push |
| `bottom_left` / `bl_permute` / `skyline` | Geometry packers + order search / shelves |
| `polish` / `polish_search` | Slicing polish + operand swaps |
| `bstar` / `sp` / `sp_multi` | B*-tree / sequence-pair (golden + random) |
| `sp_sa` / `sp_sa_multi` | Annealing on Γ+ / Γ− swaps |
| `hierarchical` | Cluster AB then CDE |
| `soft` | Soft-A aspect sweep |
| `wire_force` | Net springs → repair → compact |
| `sa` / `sa_multi` / `hpwl_sa` / `repair_sa` | Coordinate SA variants |
| `wire_polish` | Force → deep SA |
| `legal_pareto` | Best legal HPWL across engines |
| `multistart` / `portfolio` | Best across representations + SA |
| `golden` | Compact legal reference packing |
