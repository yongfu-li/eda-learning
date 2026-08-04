# DRC teaching flow (binds Part B drc_error_count=1 on thin metal1)

```
load_rules     # read tech min_width for metal1
scan_region    # walk tiles on active plane
emit_marker    # flag thin rect (width=1 < limit=2)
```

Part B golden: `DRC_ERRORS=1`, `THIN=thin`, `LAYER=metal1`.

Upstream: `drc/DRCcheck.c` — region scan over tile planes.
