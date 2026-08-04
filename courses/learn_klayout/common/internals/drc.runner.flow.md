# DRC runner flow (batch)

```
load_layout(tiny_rect.gds)
load_drc(tiny_rect.drc)
run_drc()
emit_markers()
report()
```

Teaching golden: width_violations=1 on m0, marker_count=1.
