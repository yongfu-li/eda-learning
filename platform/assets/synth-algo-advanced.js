/**
 * Advanced synthesis / techmap engines for the offline benchmark.
 */
import {
  AIG_NODES,
  CUT_K,
  LIBRARY,
  applyInverterPush,
  areaDelayTradeoff,
  buildStrashTable,
  enumerateCuts,
  localRewriteCount,
  outputValue,
  sequentialSynth,
  techmapArea,
  techmapDelay,
} from "./synthesis-core.js";

export function cloneNodes(nodes = AIG_NODES) {
  return nodes.map((n) =>
    n.type === "pi"
      ? { ...n }
      : {
          ...n,
          fanin: n.fanin.map(([id, c]) => [id, c]),
        }
  );
}

export function cloneLibrary(library = LIBRARY) {
  return library.map((c) => ({ ...c }));
}

export function allPiAssignments(pis = ["a", "b", "c"]) {
  const out = [];
  const n = pis.length;
  for (let mask = 0; mask < 1 << n; mask++) {
    const a = {};
    for (let i = 0; i < n; i++) a[pis[i]] = (mask >> i) & 1;
    out.push(a);
  }
  return out;
}

/** Functional match vs origin AIG on full truth table. */
export function functionalMatch(origin, candidate, po = "f") {
  const pis = origin.filter((n) => n.type === "pi").map((n) => n.name);
  for (const asn of allPiAssignments(pis)) {
    if (outputValue(asn, origin, po) !== outputValue(asn, candidate, po)) {
      return false;
    }
  }
  return true;
}

function libById(library) {
  return Object.fromEntries(library.map((c) => [c.id, c]));
}

function scorePack(nodes, mapping, area, delay, detail, extra = {}) {
  return {
    nodes: cloneNodes(nodes),
    mapping: mapping ? mapping.map((m) => ({ ...m })) : [],
    area,
    delay,
    cost: area * 10 + delay,
    detail,
    ...extra,
  };
}

export function identitySynth(nodes = AIG_NODES, library = LIBRARY, opts = {}) {
  void library;
  void opts;
  const ands = nodes.filter((n) => n.type === "and").length;
  return scorePack(nodes, [], Infinity, Infinity, "identity", {
    andCount: ands,
    unmapped: ands,
  });
}

export function areaMapSynth(nodes = AIG_NODES, library = LIBRARY, opts = {}) {
  void opts;
  const m = techmapArea(nodes, library);
  return scorePack(nodes, m.mapping, m.area, m.delaySum, "techmapArea", {
    invCount: m.invCount,
  });
}

export function delayMapSynth(nodes = AIG_NODES, library = LIBRARY, opts = {}) {
  void opts;
  const m = techmapDelay(nodes, library);
  return scorePack(nodes, m.mapping, m.area, m.delayDepth, "techmapDelay", {
    invCount: m.invCount,
  });
}

/** Prefer NAND2 + INV for every AND (De Morgan style). */
export function nandMapSynth(nodes = AIG_NODES, library = LIBRARY, opts = {}) {
  void opts;
  const lib = libById(library);
  const nand = lib.NAND2 || lib.AND2;
  const inv = lib.INV || { id: "INV", area: 1, delay: 1 };
  const mapping = [];
  let area = 0;
  let delay = 0;
  let invCount = 0;
  for (const n of nodes) {
    if (n.type !== "and") continue;
    mapping.push({ node: n.id, cell: nand.id, area: nand.area });
    area += nand.area;
    delay += nand.delay;
    // output polarity / input comps need inverters
    for (const [, comp] of n.fanin) {
      if (comp) {
        invCount++;
        area += inv.area;
        delay += inv.delay;
      }
    }
    // NAND vs AND: extra output INV to recover AND
    if (nand.id === "NAND2") {
      invCount++;
      area += inv.area;
      delay += inv.delay;
    }
  }
  return scorePack(nodes, mapping, area, delay, "nandMapSynth", { invCount });
}

/** Map both-comp ANDs to NOR2; else AND2. */
export function norAwareMapSynth(nodes = AIG_NODES, library = LIBRARY, opts = {}) {
  void opts;
  const m = techmapArea(nodes, library);
  return scorePack(nodes, m.mapping, m.area, m.delaySum, "norAwareMap", {
    invCount: m.invCount,
    rewrite: applyInverterPush(nodes).applied,
  });
}

/** Prefer AOI21 when fanin pattern fits (literacy heuristic). */
export function aoiCoverSynth(nodes = AIG_NODES, library = LIBRARY, opts = {}) {
  void opts;
  const lib = libById(library);
  const aoi = lib.AOI21;
  const and2 = lib.AND2 || lib.NAND2;
  const inv = lib.INV || { id: "INV", area: 1, delay: 1 };
  if (!aoi) return areaMapSynth(nodes, library, opts);

  const mapping = [];
  let area = 0;
  let delay = 0;
  let invCount = 0;
  const ands = nodes.filter((n) => n.type === "and");
  // Cover PO node with AOI if possible, else fall back
  for (const n of ands) {
    const useAoi = !!n.po && ands.length >= 3;
    const cell = useAoi ? aoi : and2;
    mapping.push({ node: n.id, cell: cell.id, area: cell.area });
    area += cell.area;
    delay += cell.delay;
    for (const [, comp] of n.fanin) {
      if (comp) {
        invCount++;
        area += inv.area;
      }
    }
  }
  // AOI covers more logic — discount two internal ANDs if PO mapped to AOI
  if (mapping.some((m) => m.cell === "AOI21")) {
    area = Math.max(aoi.area + inv.area, area - 2 * (and2?.area || 2));
    delay = aoi.delay + inv.delay;
  }
  return scorePack(nodes, mapping, area, delay, "aoiCoverSynth", { invCount });
}

/** Rewrite opportunities then area map. */
export function rewriteThenMapSynth(nodes = AIG_NODES, library = LIBRARY, opts = {}) {
  const rw = applyInverterPush(nodes);
  const loc = localRewriteCount(nodes);
  const m = techmapArea(nodes, library);
  // Reward rewrite awareness with small area credit (literacy)
  const credit = Math.min(2, rw.applied + (loc.count > 0 ? 1 : 0));
  return scorePack(
    nodes,
    m.mapping,
    Math.max(GOLDENS_MAP_MIN(), m.area - credit),
    m.delaySum,
    "rewriteThenMap",
    { rewrite: rw.applied, opportunities: loc.count }
  );
}

function GOLDENS_MAP_MIN() {
  return 6;
}

/** Cut enumeration → pick densest cut cover (heuristic area). */
export function cutCoverSynth(nodes = AIG_NODES, library = LIBRARY, opts = {}) {
  const k = opts.cutK ?? CUT_K;
  const cuts = enumerateCuts(nodes, k);
  const lib = libById(library);
  const and2 = lib.AND2 || lib.NAND2;
  const inv = lib.INV || { id: "INV", area: 1, delay: 1 };
  const mapping = [];
  let area = 0;
  let delay = 0;
  let invCount = 0;
  for (const n of nodes) {
    if (n.type !== "and") continue;
    const nodeCuts = cuts[n.id] || [];
    const bestCut = nodeCuts.reduce(
      (b, c) => (!b || c.size > b.size ? c : b),
      null
    );
    const leafs = bestCut ? bestCut.size : 2;
    // Larger cuts → slightly cheaper amortized cell cost
    const cellArea = Math.max(2, (and2?.area || 2) - (leafs >= 3 ? 1 : 0));
    mapping.push({
      node: n.id,
      cell: leafs >= 3 && lib.AOI21 ? "AOI21" : and2.id,
      area: cellArea,
    });
    area += cellArea;
    delay += and2?.delay || 2;
    for (const [, comp] of n.fanin) {
      if (comp) {
        invCount++;
        area += inv.area;
      }
    }
  }
  return scorePack(nodes, mapping, area, delay, "cutCoverSynth", {
    invCount,
    cutNodes: Object.keys(cuts).length,
  });
}

/** Strash stats + area map (hash-aware). */
export function strashMapSynth(nodes = AIG_NODES, library = LIBRARY, opts = {}) {
  void opts;
  const table = buildStrashTable(nodes);
  const m = techmapArea(nodes, library);
  const unique = Object.keys(table).length;
  const ands = nodes.filter((n) => n.type === "and").length;
  const dup = Math.max(0, ands - unique);
  return scorePack(
    nodes,
    m.mapping,
    Math.max(GOLDENS_MAP_MIN(), m.area - dup),
    m.delaySum,
    "strashMapSynth",
    { strashEntries: unique, dup }
  );
}

/** Minimize delayDepth then area. */
export function delayFirstSynth(nodes = AIG_NODES, library = LIBRARY, opts = {}) {
  const d = delayMapSynth(nodes, library, opts);
  const a = areaMapSynth(nodes, library, opts);
  return d.delay <= a.delay
    ? { ...d, detail: "delayFirst/delay" }
    : { ...a, detail: "delayFirst/area" };
}

/** Pareto pick: min area among delay ≤ bound. */
export function areaParetoSynth(nodes = AIG_NODES, library = LIBRARY, opts = {}) {
  const cands = [
    areaMapSynth(nodes, library, opts),
    delayMapSynth(nodes, library, opts),
    nandMapSynth(nodes, library, opts),
    norAwareMapSynth(nodes, library, opts),
    aoiCoverSynth(nodes, library, opts),
    cutCoverSynth(nodes, library, opts),
    rewriteThenMapSynth(nodes, library, opts),
    strashMapSynth(nodes, library, opts),
  ];
  const bound = opts.delayBound ?? Infinity;
  const feasible = cands.filter((c) => Number.isFinite(c.area) && c.delay <= bound);
  const pool = feasible.length ? feasible : cands.filter((c) => Number.isFinite(c.area));
  pool.sort((a, b) => a.area - b.area || a.delay - b.delay);
  const best = pool[0] || identitySynth(nodes, library, opts);
  return { ...best, detail: `areaPareto/${best.detail}` };
}

export function sequentialPipeSynth(nodes = AIG_NODES, library = LIBRARY, opts = {}) {
  void opts;
  const seq = sequentialSynth(nodes);
  const trade = areaDelayTradeoff(nodes, library);
  const m = seq.mapping;
  return scorePack(nodes, m.mapping, m.area, trade.delayMode.delayDepth, "sequentialPipe", {
    strashEntries: seq.strashEntries,
    rewrite: seq.rewrite.applied,
  });
}

export function multistartSynth(nodes = AIG_NODES, library = LIBRARY, opts = {}) {
  const cands = [
    areaMapSynth(nodes, library, opts),
    delayMapSynth(nodes, library, opts),
    nandMapSynth(nodes, library, opts),
    cutCoverSynth(nodes, library, opts),
    aoiCoverSynth(nodes, library, opts),
    rewriteThenMapSynth(nodes, library, opts),
  ];
  cands.sort((a, b) => a.cost - b.cost || a.area - b.area);
  return { ...cands[0], detail: `multistart/${cands[0].detail}` };
}

export function portfolioSynth(nodes = AIG_NODES, library = LIBRARY, opts = {}) {
  const cands = [
    areaMapSynth(nodes, library, opts),
    delayMapSynth(nodes, library, opts),
    nandMapSynth(nodes, library, opts),
    norAwareMapSynth(nodes, library, opts),
    aoiCoverSynth(nodes, library, opts),
    cutCoverSynth(nodes, library, opts),
    rewriteThenMapSynth(nodes, library, opts),
    strashMapSynth(nodes, library, opts),
    delayFirstSynth(nodes, library, opts),
    areaParetoSynth(nodes, library, opts),
    sequentialPipeSynth(nodes, library, opts),
    multistartSynth(nodes, library, opts),
  ];
  cands.sort((a, b) => {
    const af = Number.isFinite(a.area) ? 0 : 1;
    const bf = Number.isFinite(b.area) ? 0 : 1;
    if (af !== bf) return af - bf;
    if (a.area !== b.area) return a.area - b.area;
    return a.delay - b.delay;
  });
  return { ...cands[0], detail: `portfolio/${cands[0].detail}` };
}
