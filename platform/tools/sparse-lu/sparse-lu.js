import { GOLDENS } from "../../assets/spice-core.js";
import { createInteractiveSpiceLab } from "../../assets/interactive-spice-lab.js";
const root = document.getElementById("lab-root");

createInteractiveSpiceLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Factor G; confirm nnz=6.</p>`,
  challenges: [
    { id: "run", title: "LU", level: "Intro", prompt: "Click Sparse LU.",
      setup: (_c, api) => api.sparseLu(), check: (_c, api) => api.getMode() === "lu" },
    { id: "nnz", title: "NNZ 6", level: "Intro", prompt: "nnz is 6.",
      setup: (_c, api) => api.sparseLu(), check: (_c, api) => api.getLast().nnz === GOLDENS.nnz },
    { id: "n", title: "n 3", level: "Practice", prompt: "n is 3.",
      setup: (_c, api) => api.sparseLu(), check: (_c, api) => api.getLast().n === 3 },
    { id: "L", title: "Has L", level: "Practice", prompt: "L present.",
      setup: (_c, api) => api.sparseLu(), check: (_c, api) => api.getLast().L.length === 3 },
    { id: "U", title: "Has U", level: "Practice", prompt: "U present.",
      setup: (_c, api) => api.sparseLu(), check: (_c, api) => api.getLast().U.length === 3 },
    { id: "diag", title: "L diag 1", level: "Practice", prompt: "L[0][0]=1.",
      setup: (_c, api) => api.sparseLu(), check: (_c, api) => api.getLast().L[0][0] === 1 },
    { id: "mode", title: "Mode lu", level: "Practice", prompt: "mode lu.",
      setup: (_c, api) => api.sparseLu(), check: (_c, api) => api.getMode()==="lu" },
    { id: "golden", title: "nnz", level: "Challenge", prompt: "nnz=6.", check: () => GOLDENS.nnz === 6 },
  ],
});
