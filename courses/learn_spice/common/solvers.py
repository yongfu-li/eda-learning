"""Track A SPICE-lite solvers — MNA, NR, sparse LU lite, transient, engine."""
from __future__ import annotations

from typing import Any

from spiceutil import (
    clone,
    diode_g,
    diode_i,
    load_toy,
    mat_zeros,
    solve_dense,
    unknown_nodes,
    vec_zeros,
)

GOLDENS = {
    "element_count": 5,
    "unknown_nodes": 2,  # 1, 2
    "mna_size_dc_linear": 3,  # v1,v2,i_Vin
    "v2_dc_linear": 3.0,  # divider 5 * 3/(2+3)
    "v1_dc_linear": 5.0,
    "nnz_mna": 6,
    "nr_iters_linear": 1,
    "diode_nr_converged": True,
    "tran_dt": 0.5,
    "tran_steps": 4,
    "tran_final_v2": 2.255181,  # BE RC from 0, rounded
    "engine_v2_dc": 3.0,
}


def netlist_stats(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    return {
        "element_count": len(d["elements"]),
        "node_count": len(d["nodes"]),
        "unknown_nodes": len(unknown_nodes(d)),
        "ground": d["ground"],
        "ids": [e["id"] for e in d["elements"]],
    }


def _idx_map(data: dict[str, Any]) -> dict[str, int]:
    """Map node name → MNA index; ground is None. Voltage sources append branch currents."""
    un = unknown_nodes(data)
    idx = {n: i for i, n in enumerate(un)}
    return idx


def _stamp_g(G: list[list[float]], idx: dict[str, int], a: str, b: str, g: float) -> None:
    def add(i, j, v):
        if i is None or j is None:
            return
        G[i][j] += v

    ia = idx.get(a)
    ib = idx.get(b)
    add(ia, ia, g)
    add(ib, ib, g)
    add(ia, ib, -g)
    add(ib, ia, -g)


def build_mna_linear_dc(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """Stamp R + V only (ignore C, D) for linear DC MNA."""
    d = clone(data or load_toy())
    idx = _idx_map(d)
    n_node = len(idx)
    vsources = [e for e in d["elements"] if e["type"] == "V"]
    n = n_node + len(vsources)
    G = mat_zeros(n)
    b = vec_zeros(n)
    v_branch = {}
    for k, e in enumerate(vsources):
        v_branch[e["id"]] = n_node + k

    for e in d["elements"]:
        if e["type"] == "R":
            _stamp_g(G, idx, e["a"], e["b"], 1.0 / e["r"])
        elif e["type"] == "V":
            bi = v_branch[e["id"]]
            ip = idx.get(e["p"])
            inn = idx.get(e["n"])
            if ip is not None:
                G[ip][bi] += 1.0
                G[bi][ip] += 1.0
            if inn is not None:
                G[inn][bi] -= 1.0
                G[bi][inn] -= 1.0
            b[bi] += e["dc"]
    return {"G": G, "b": b, "idx": idx, "v_branch": v_branch, "size": n, "nodes": list(idx.keys())}


def dc_linear_solve(data: dict[str, Any] | None = None) -> dict[str, Any]:
    m = build_mna_linear_dc(data)
    x = solve_dense(m["G"], m["b"])
    volts = {n: x[i] for n, i in m["idx"].items()}
    currents = {vid: x[bi] for vid, bi in m["v_branch"].items()}
    return {"volts": volts, "currents": currents, "x": x, "size": m["size"], "G": m["G"], "b": m["b"]}


def sparse_lu_lite(A: list[list[float]]) -> dict[str, Any]:
    """Dense LU as sparse-LU literacy (report nnz + factors)."""
    n = len(A)
    L = mat_zeros(n)
    U = [row[:] for row in A]
    for i in range(n):
        L[i][i] = 1.0
        for j in range(i + 1, n):
            if abs(U[i][i]) < 1e-15:
                raise ValueError("zero pivot")
            L[j][i] = U[j][i] / U[i][i]
            for k in range(i, n):
                U[j][k] -= L[j][i] * U[i][k]
    nnz = sum(1 for row in A for v in row if abs(v) > 1e-15)
    return {"L": L, "U": U, "nnz": nnz, "n": n}


def device_callback_diode(v: float, Is: float = 1e-14, Vt: float = 0.026) -> dict[str, float]:
    return {"i": diode_i(v, Is, Vt), "g": diode_g(v, Is, Vt), "v": v}


def newton_raphson_dc(
    data: dict[str, Any] | None = None,
    include_diode: bool = False,
    max_iter: int = 20,
    tol: float = 1e-9,
) -> dict[str, Any]:
    """Nonlinear DC MNA. Default ignores diode → 1 NR step equals linear OP."""
    d = clone(data or load_toy())
    lin = dc_linear_solve(d)
    idx = _idx_map(d)
    vsources = [e for e in d["elements"] if e["type"] == "V"]
    n_node = len(idx)
    n = n_node + len(vsources)
    v_branch = {e["id"]: n_node + k for k, e in enumerate(vsources)}
    x = lin["x"][:]
    residuals = []
    iters = 0
    for it in range(max_iter):
        iters = it + 1
        G = mat_zeros(n)
        rhs = vec_zeros(n)
        for e in d["elements"]:
            if e["type"] == "R":
                _stamp_g(G, idx, e["a"], e["b"], 1.0 / e["r"])
            elif e["type"] == "V":
                bi = v_branch[e["id"]]
                ip = idx.get(e["p"])
                inn = idx.get(e["n"])
                if ip is not None:
                    G[ip][bi] += 1.0
                    G[bi][ip] += 1.0
                if inn is not None:
                    G[inn][bi] -= 1.0
                    G[bi][inn] -= 1.0
                rhs[bi] += e["dc"]
            elif e["type"] == "D" and include_diode:
                ia = idx.get(e["a"])
                ib = idx.get(e["b"])
                va = x[ia] if ia is not None else 0.0
                vb = x[ib] if ib is not None else 0.0
                vd = va - vb
                g = diode_g(vd, e["Is"], e["Vt"])
                i = diode_i(vd, e["Is"], e["Vt"])
                _stamp_g(G, idx, e["a"], e["b"], g)
                ieq = i - g * vd
                if ia is not None:
                    rhs[ia] -= ieq
                if ib is not None:
                    rhs[ib] += ieq
        x_new = solve_dense(G, rhs)
        dx = [x_new[i] - x[i] for i in range(n)]
        err = max(abs(v) for v in dx)
        residuals.append(err)
        x = x_new
        if err < tol:
            break
    volts = {nm: x[i] for nm, i in idx.items()}
    return {
        "volts": volts,
        "x": x,
        "iters": iters,
        "residuals": residuals,
        "converged": bool(residuals) and residuals[-1] < tol,
        "v2": volts.get("2"),
    }


def diode_loop_newton(
    V: float = 1.0,
    R: float = 1000.0,
    Is: float = 1e-12,
    Vt: float = 0.026,
    max_iter: int = 30,
    tol: float = 1e-12,
) -> dict[str, Any]:
    """1-D Newton for series R + diode: (V - vd)/R = Is*(exp(vd/Vt)-1)."""
    vd = 0.0
    residuals = []
    for it in range(max_iter):
        cb = device_callback_diode(vd, Is, Vt)
        f = (V - vd) / R - cb["i"]
        df = -1.0 / R - cb["g"]
        dvd = -f / df
        vd += dvd
        residuals.append(abs(dvd))
        if abs(dvd) < tol:
            return {
                "vd": vd,
                "iters": it + 1,
                "converged": True,
                "residuals": residuals,
                "i": diode_i(vd, Is, Vt),
            }
    return {
        "vd": vd,
        "iters": max_iter,
        "converged": False,
        "residuals": residuals,
        "i": diode_i(vd, Is, Vt),
    }


def transient_be(
    data: dict[str, Any] | None = None,
    dt: float = 0.5,
    steps: int = 4,
    v2_init: float = 0.0,
) -> dict[str, Any]:
    """
    Backward-Euler RC transient on linear divider+C (ignore diode).
    Companion: G_c = C/dt, Ieq = G_c * v_prev.
    """
    d = clone(data or load_toy())
    caps = [e for e in d["elements"] if e["type"] == "C"]
    hist = []
    vc = {e["id"]: v2_init for e in caps}
    for s in range(steps):
        idx = _idx_map(d)
        vsources = [e for e in d["elements"] if e["type"] == "V"]
        n_node = len(idx)
        n = n_node + len(vsources)
        v_branch = {e["id"]: n_node + k for k, e in enumerate(vsources)}
        G = mat_zeros(n)
        rhs = vec_zeros(n)
        for e in d["elements"]:
            if e["type"] == "R":
                _stamp_g(G, idx, e["a"], e["b"], 1.0 / e["r"])
            elif e["type"] == "V":
                bi = v_branch[e["id"]]
                ip = idx.get(e["p"])
                inn = idx.get(e["n"])
                if ip is not None:
                    G[ip][bi] += 1.0
                    G[bi][ip] += 1.0
                if inn is not None:
                    G[inn][bi] -= 1.0
                    G[bi][inn] -= 1.0
                rhs[bi] += e["dc"]
            elif e["type"] == "C":
                gc = e["c"] / dt
                _stamp_g(G, idx, e["a"], e["b"], gc)
                ia = idx.get(e["a"])
                ib = idx.get(e["b"])
                vprev = vc[e["id"]]
                ieq = gc * vprev
                if ia is not None:
                    rhs[ia] += ieq
                if ib is not None:
                    rhs[ib] -= ieq
        x = solve_dense(G, rhs)
        volts = {nm: x[i] for nm, i in idx.items()}
        for e in caps:
            va = volts.get(e["a"], 0.0)
            vb = volts.get(e["b"], 0.0)
            vc[e["id"]] = va - vb
        hist.append({"step": s + 1, "t": (s + 1) * dt, "volts": volts, "v2": volts.get("2", 0.0)})
    return {"history": hist, "dt": dt, "steps": steps, "final_v2": hist[-1]["v2"] if hist else None}


def spice_engine(data: dict[str, Any] | None = None) -> dict[str, Any]:
    """OP linear → NR (linear stamps) → short TRAN + diode 1-D NR."""
    d = clone(data or load_toy())
    lin = dc_linear_solve(d)
    nr = newton_raphson_dc(d, include_diode=False)
    tr = transient_be(d, dt=GOLDENS["tran_dt"], steps=GOLDENS["tran_steps"], v2_init=0.0)
    return {
        "dc_v2": lin["volts"]["2"],
        "nr_v2": nr["v2"],
        "nr_iters": nr["iters"],
        "nr_converged": nr["converged"],
        "tran_final_v2": tr["final_v2"],
        "mna_size": lin["size"],
        "diode": diode_loop_newton(),
        "ok": abs(lin["volts"]["2"] - GOLDENS["v2_dc_linear"]) < 1e-9,
    }


def spice_compare(data: dict[str, Any] | None = None) -> dict[str, Any]:
    d = clone(data or load_toy())
    st = netlist_stats(d)
    eng = spice_engine(d)
    return {**st, **eng, "goldens": GOLDENS}
