# Teaching sketch of opt_clean control flow (upstream: passes/opt/opt_clean.cc)

OptCleanPass : Pass("opt_clean", "remove unused cells and wires")
  execute(args, design):
    extra_args → apply selection
    for module in selected_whole_modules:
      if module.processes not empty: warn (prefer proc first)
      rmunused_module(module):
        1. mark_used from output wires / keep attributes / drivers
        2. rmunused_module_cells  — drop cells that never drive used signals
        3. rmunused_module_signals — drop leftover wires

Compare with Part C algo_opt_clean on tiny_algo.json — same *move*, real C++ lives here.
