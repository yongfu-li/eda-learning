# Examples — Offline benchmark compare

## Platform benchmark (preferred)

Open [`platform/benchmarks/compaction/index.html`](../../../platform/benchmarks/compaction/index.html):

1. Preset **Hard** → **Run benchmark**.
2. Ranking is **illegal first**, then bbox area / width / height.
3. Confirm **portfolio** / **area Pareto** / **tile pack** / **deep SA** beat identity on area for scattered / tall_stack.
4. **Example** → Tile / BL re-pack → **Load example** → **Register solver**.

## Upload contract

```js
export function compact(objects, opts = {}) {
  // opts.chip, opts.minGap
  // objects: [{ id, x0, y0, x1, y1, kind: "cell"|"wire" }, ...]
  return { objects: /* compacted */, detail: "my-compactor" };
}
```

## Built-in engines

| Id | Idea |
|----|------|
| `compact_x` / `compact_y` | Longest-path 1-D on constraint graph |
| `compact_xy` / `compact_yx` | Fixed 2-D axis orders |
| `sequential` | X then Y + wire retarget |
| `iterative` | Alternate axes until stable |
| `order_search` | Try several axis-order sequences |
| `greedy_push` | Push cells toward origin while legal |
| `shear` / `dual_shear` | One or many shear channels, then compact |
| `jog` | Wire jog then sequential |
| `hierarchical` | Split by X median, compact, abut |
| `tile_pack` | Bottom-left re-pack of fixed-size cells |
| `gap_relax` | Compact at gap=0 then restore minGap |
| `sa` / `sa_multi` / `swap_sa` / `deep_sa` / `graph_sa` | Annealing variants |
| `area_pareto` | Best legal area across engines |
| `multistart` / `portfolio` | Best across the above |
