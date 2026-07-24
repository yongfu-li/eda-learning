"""Equivalence checking solvers — CEC literacy (Track A)."""
from __future__ import annotations

from typing import Any, Dict, List, Mapping, MutableMapping, Optional, Sequence, Tuple

from equivutil import (
    all_assignments,
    evaluate_circuit,
    eval_op,
    gate_map,
    get_combo,
    output_gate,
    resolve_value,
    topo_order,
    truth_table,
)


def build_miter(spec: Mapping[str, Any], impl: Mapping[str, Any]) -> dict[str, Any]:
    """
    Build a miter: shared PIs, XOR of spec and impl POs.
    Returns a combinational circuit with PO 'miter_out' = spec_f XOR impl_f.
    """
    pis = list(spec["pis"])
    assert list(impl["pis"]) == pis
    spec_out = output_gate(spec)
    impl_out = output_gate(impl)
    gates: List[dict[str, Any]] = []
    for g in spec.get("gates", []):
        sg = dict(g)
        sg["output"] = False
        gates.append(sg)
    # prefix impl gates to avoid id clash
    impl_prefix = "i_"
    for g in impl.get("gates", []):
        ng = dict(g)
        ng["id"] = impl_prefix + g["id"]
        ng["inputs"] = [
            impl_prefix + x if x in gate_map(impl) else x for x in g["inputs"]
        ]
        if g.get("output"):
            ng["output"] = False
        gates.append(ng)
    xor_id = "miter_xor"
    spec_sig = spec_out["id"]
    impl_sig = impl_prefix + impl_out["id"]
    gates.append({"id": xor_id, "op": "XOR", "inputs": [spec_sig, impl_sig], "output": True})
    return {"pis": pis, "pos": ["miter_out"], "gates": gates}


def miter_output(miter: Mapping[str, Any], assignment: Mapping[str, int]) -> int:
    return evaluate_circuit(miter, assignment)


def truth_table_cec(
    spec: Mapping[str, Any],
    impl: Mapping[str, Any],
    dont_care: Optional[Mapping[str, int]] = None,
) -> dict[str, Any]:
    """
    Exhaustive truth-table CEC over all PI assignments (respecting don't-cares).
    dont_care maps PI -> 0/1/-1 where -1 means X (any value OK on that bit).
    """
    pis = list(spec["pis"])
    dc = dont_care or {}
    rows_checked = 0
    for asn in all_assignments(pis):
        full = dict(asn)
        skip = False
        for pi in pis:
            if pi in dc and dc[pi] == -1:
                continue
            if pi in dc and dc[pi] in (0, 1) and asn[pi] != dc[pi]:
                skip = True
                break
        if skip:
            continue
        rows_checked += 1
        s = evaluate_circuit(spec, full)
        i = evaluate_circuit(impl, full)
        if s != i:
            cex = {pi: full[pi] for pi in pis}
            return {
                "equivalent": False,
                "rows_checked": rows_checked,
                "counterexample": cex,
                "spec_out": s,
                "impl_out": i,
            }
    return {"equivalent": True, "rows_checked": rows_checked, "counterexample": None}


def find_counterexample(
    spec: Mapping[str, Any],
    impl: Mapping[str, Any],
) -> Optional[dict[str, int]]:
    r = truth_table_cec(spec, impl)
    return r.get("counterexample")


def structural_hash_stats(circuit: Mapping[str, Any]) -> dict[str, Any]:
    """
    FRAIG-lite: hash each gate by (op, sorted child hashes); count unique vs total.
    """
    gates = gate_map(circuit)
    pis = set(circuit.get("pis", []))
    state = set(circuit.get("state", []))
    memo: dict[str, str] = {}

    def hash_sig(name: str) -> str:
        if name in memo:
            return memo[name]
        if name in pis or name in state:
            sig = f"PI:{name}"
            memo[name] = sig
            return sig
        g = gates[name]
        child_sigs = sorted(hash_sig(c) for c in g["inputs"])
        sig = f"{g['op']}({','.join(child_sigs)})"
        memo[name] = sig
        return sig

    gate_hashes: dict[str, str] = {}
    for gid in topo_order(circuit):
        gate_hashes[gid] = hash_sig(gid)
    unique = len(set(gate_hashes.values()))
    return {
        "total_gates": len(gate_hashes),
        "unique_hashes": unique,
        "redundant": len(gate_hashes) - unique,
        "gate_hashes": gate_hashes,
    }


def fraig_lite(circuit: Mapping[str, Any]) -> dict[str, Any]:
    """Alias literacy wrapper around structural_hash_stats."""
    stats = structural_hash_stats(circuit)
    stats["fraig_nodes"] = stats["unique_hashes"]
    return stats


def _tseitin_gate(
    gate: Mapping[str, Any],
    var_of: dict[str, int],
    next_var: int,
    clauses: List[List[int]],
) -> Tuple[int, int]:
    """Encode one gate; return (output_var, next_free_var)."""
    op = gate["op"].upper()
    ins = gate["inputs"]
    in_vars = [var_of[i] for i in ins]
    out = next_var
    next_var += 1

    def add_clause(lits: List[int]) -> None:
        clauses.append(lits)

    if op == "NOT":
        a = in_vars[0]
        add_clause([-a, -out])
        add_clause([a, out])
    elif op == "AND":
        a, b = in_vars[0], in_vars[1]
        add_clause([-a, -b, out])
        add_clause([a, -out])
        add_clause([b, -out])
    elif op == "OR":
        a, b = in_vars[0], in_vars[1]
        add_clause([a, b, -out])
        add_clause([-a, out])
        add_clause([-b, out])
    elif op == "XOR":
        a, b = in_vars[0], in_vars[1]
        add_clause([-a, -b, -out])
        add_clause([a, b, -out])
        add_clause([-a, b, out])
        add_clause([a, -b, out])
    elif op == "BUF":
        a = in_vars[0]
        add_clause([-a, out])
        add_clause([a, -out])
    else:
        raise ValueError(op)
    return out, next_var


def encode_sat_cnf_lite(
    circuit: Mapping[str, Any],
    assert_output: Optional[int] = None,
) -> dict[str, Any]:
    """
    Tseitin CNF encoding literacy — returns variables, clauses, clause count.
    PI vars are 1..len(pis); gate outputs get fresh vars.
    """
    pis = list(circuit["pis"])
    var_of: dict[str, int] = {pi: i + 1 for i, pi in enumerate(pis)}
    next_var = len(pis) + 1
    clauses: List[List[int]] = []

    for gid in topo_order(circuit):
        g = gate_map(circuit)[gid]
        out_v, next_var = _tseitin_gate(g, var_of, next_var, clauses)
        var_of[gid] = out_v

    out_g = output_gate(circuit)
    out_sig = out_g["inputs"][0] if out_g["op"] == "BUF" else out_g["id"]
    out_var = var_of[out_sig]
    if assert_output is not None:
        if assert_output == 1:
            clauses.append([out_var])
        else:
            clauses.append([-out_var])

    return {
        "num_vars": next_var - 1,
        "num_clauses": len(clauses),
        "clauses": clauses,
        "var_of": var_of,
        "output_var": out_var,
    }


def _dpll(
    clauses: List[List[int]],
    assignment: dict[int, bool],
    var_order: List[int],
) -> Optional[dict[int, bool]]:
    """Tiny DPLL for literacy — brute on small CNFs."""

    def eval_clause(cl: Sequence[int]) -> Optional[bool]:
        seen_unassigned = False
        for lit in cl:
            v = abs(lit)
            if v not in assignment:
                seen_unassigned = True
                continue
            val = assignment[v]
            if lit > 0 and val:
                return True
            if lit < 0 and not val:
                return True
        if seen_unassigned:
            return None
        return False

    def all_sat() -> bool:
        for cl in clauses:
            r = eval_clause(cl)
            if r is False:
                return False
        return True

    if all_sat() and len(assignment) == len(var_order):
        return dict(assignment)
    if not all_sat():
        return None

    for v in var_order:
        if v in assignment:
            continue
        for val in (False, True):
            assignment[v] = val
            if all_sat():
                res = _dpll(clauses, assignment, var_order)
                if res is not None:
                    return res
            del assignment[v]
        return None
    return dict(assignment) if all_sat() else None


def sat_satisfiable(cnf: Mapping[str, Any]) -> bool:
    n = cnf["num_vars"]
    order = list(range(1, n + 1))
    return _dpll(list(cnf["clauses"]), {}, order) is not None


def dont_care_mask(
    spec: Mapping[str, Any],
    impl: Mapping[str, Any],
    mask: Mapping[str, int],
) -> dict[str, Any]:
    """
    CEC with don't-cares: mask[pi] = -1 means X (any), 0/1 fixes that PI.
    Only assignments matching fixed bits are checked.
    """
    return truth_table_cec(spec, impl, dont_care=mask)


def simulate_cycle(
    circuit: Mapping[str, Any],
    assignment: Mapping[str, int],
) -> tuple[int, dict[str, int]]:
    """One cycle: return (PO value, next state dict)."""
    vals: dict[str, int] = {k: int(v) for k, v in assignment.items()}
    for pi in circuit.get("pis", []):
        vals.setdefault(pi, 0)
    for st in circuit.get("state", []):
        vals.setdefault(st, 0)
    for gid in topo_order(circuit):
        g = gate_map(circuit)[gid]
        ins = [resolve_value(i, vals) for i in g["inputs"]]
        vals[gid] = eval_op(g["op"], ins)
    out_g = output_gate(circuit)
    y = resolve_value(out_g["id"], vals)
    next_state: dict[str, int] = {}
    for ff in circuit.get("ffs", []):
        d_id = ff["d"]
        next_state[ff["q"]] = resolve_value(d_id, vals)
    return y, next_state


def sequential_unroll(
    circuit: Mapping[str, Any],
    steps: int,
    init_state: Optional[Mapping[str, int]] = None,
) -> dict[str, Any]:
    """
    Unroll sequential circuit for `steps` cycles into a combinational circuit.
    PIs: q_0 (initial state), a_0 .. a_{steps-1}. PO: y at cycle steps-1.
    """
    pis = list(circuit["pis"])
    state = list(circuit.get("state", []))
    init = dict(init_state or circuit.get("init", {}))
    gates_out: List[dict[str, Any]] = []
    unroll_pis: List[str] = [f"{s}_0" for s in state]
    for t in range(steps):
        for pi in pis:
            unroll_pis.append(f"{pi}_{t}")

    for t in range(steps):
        rename: dict[str, str] = {}
        for pi in pis:
            rename[pi] = f"{pi}_{t}"
        for s in state:
            rename[s] = f"{s}_{t}"

        for g in circuit.get("gates", []):
            if g.get("output"):
                continue
            gates_out.append(
                {
                    "id": f"{g['id']}_{t}",
                    "op": g["op"],
                    "inputs": [rename.get(i, i) for i in g["inputs"]],
                }
            )

        for ff in circuit.get("ffs", []):
            gates_out.append(
                {
                    "id": f"{ff['q']}_{t + 1}",
                    "op": "BUF",
                    "inputs": [f"{ff['d']}_{t}"],
                }
            )

    last = steps - 1
    y_src = next(g for g in circuit["gates"] if g.get("output"))
    y_in = y_src["inputs"][0]
    y_sig = f"{y_in}_{last}" if y_in in state or y_in in gate_map(circuit) else f"{y_in}_{last}"
    if y_in in state:
        y_sig = f"{y_in}_{last}"
    elif y_in in gate_map(circuit):
        y_sig = f"{y_in}_{last}"
    else:
        y_sig = f"{y_in}_{last}"
    gates_out.append({"id": "y_out", "op": "BUF", "inputs": [y_sig], "output": True})

    return {
        "pis": unroll_pis,
        "pos": ["y"],
        "gates": gates_out,
        "init": init,
        "steps": steps,
    }


def sequential_cec_lite(
    spec: Mapping[str, Any],
    impl: Mapping[str, Any],
    steps: int = 2,
    init_state: Optional[Mapping[str, int]] = None,
) -> dict[str, Any]:
    """
    Sequential CEC lite: enumerate PI sequences for `steps` cycles from init state;
    compare output vectors. Also validates unrolled netlist view.
    """
    init = dict(init_state or spec.get("init", {}))
    pis = list(spec["pis"])

    def run_trace(circuit: Mapping[str, Any], inputs: List[dict[str, int]]) -> List[int]:
        state = dict(init)
        outs: List[int] = []
        for inp in inputs:
            asn = {**inp, **state}
            y, state = simulate_cycle(circuit, asn)
            outs.append(y)
        return outs

    n_in = len(pis)
    for mask in range(1 << (n_in * steps)):
        seq: List[dict[str, int]] = []
        for t in range(steps):
            seq.append({pis[i]: (mask >> (t * n_in + i)) & 1 for i in range(n_in)})
        o_spec = run_trace(spec, seq)
        o_impl = run_trace(impl, seq)
        if o_spec != o_impl:
            cex: dict[str, int] = {}
            for t, inp in enumerate(seq):
                for k, v in inp.items():
                    cex[f"{k}_{t}"] = v
            return {"equivalent": False, "steps": steps, "counterexample": cex}

    u_spec = sequential_unroll(spec, steps, init)
    return {"equivalent": True, "steps": steps, "counterexample": None, "unroll_pis": len(u_spec["pis"])}


def combo_pair_report(data: Mapping[str, Any]) -> dict[str, Any]:
    """Summary metrics for offline benchmark module."""
    spec = get_combo(data, "spec")
    good = get_combo(data, "impl_good")
    bad = get_combo(data, "impl_bad")
    miter_g = build_miter(spec, good)
    miter_b = build_miter(spec, bad)
    tt_spec = truth_table(spec)
    cec_good = truth_table_cec(spec, good)
    cec_bad = truth_table_cec(spec, bad)
    miter_good_all_zero = all(miter_output(miter_g, r) == 0 for r in all_assignments(spec["pis"]))
    return {
        "truth_table_rows": len(tt_spec),
        "spec_impl_good": cec_good["equivalent"],
        "spec_impl_bad": cec_bad["equivalent"],
        "bad_counterexample": cec_bad.get("counterexample"),
        "miter_good_all_zero": miter_good_all_zero,
        "structural_spec": structural_hash_stats(spec),
        "cnf_spec_clauses": encode_sat_cnf_lite(spec)["num_clauses"],
    }
