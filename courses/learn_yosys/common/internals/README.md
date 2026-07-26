# Part D — Yosys internals excerpts

Teaching orientation for the upstream Yosys tree. These are **annotated sketches**
aligned with public Yosys layout (`kernel/`, `passes/opt/opt_clean.cc`), not a
vendored copy of the Yosys source.

## Tree map

```
yosys/
  kernel/          # Design, Module, Pass, register
    rtlil.h
    register.h
  passes/
    opt/
      opt_clean.cc # OptCleanPass example
    proc/
    techmap/
```

## Upstream pointers

- RTLIL model: `kernel/rtlil.h`
- Pass base + `REGISTER_PASS`: `kernel/register.h` / `kernel/yosys.h`
- Example pass: `passes/opt/opt_clean.cc`

Clone upstream when contributing: https://github.com/YosysHQ/yosys
