# Examples — Sequential buffering pass

## Try these

1. Load `../common/tiny_buf.json`.
2. Run a full pass: candidates + Van Ginneken (or slew) + optional fanout fix.
3. Compare browser lab `sequential-buffer` with Track A.

## Pseudocode

```text
sites ← candidate_sites(data)
vg ← van_ginneken_net(data)
fan ← fanout_buffer_tree(data)
return {sites, vg, fan, primary}
Golden: improved VG delay on tiny_buf
```
