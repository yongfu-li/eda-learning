import { GOLDENS } from "../../assets/power-core.js";
import { createInteractivePowerLab } from "../../assets/interactive-power-lab.js";
const root = document.getElementById("lab-root");

createInteractivePowerLab(root, {
  starterHtml: `<p><strong>Your job:</strong> Sum Psw+Pleak; chip Ptot=5.55.</p>`,
  challenges: [
    { id: "run", title: "Total", level: "Intro", prompt: "Click Total.",
      setup: (_c, api) => api.showTotal(), check: (_c, api) => api.getMode() === "total" },
    { id: "chip", title: "chip=5.55", level: "Intro", prompt: "chip Ptot 5.55.",
      setup: (_c, api) => api.showTotal(), check: (_c, api) => api.getLast().total === GOLDENS.chipPtot },
    { id: "n1", title: "n1=1.1", level: "Practice", prompt: "n1 Ptot 1.1.",
      setup: (_c, api) => api.showTotal(), check: (_c, api) => api.getLast().byNet.n1 === GOLDENS.ptotN1 },
    { id: "sw", title: "Psw part", level: "Practice", prompt: "n1 Psw 1.0.",
      setup: (_c, api) => api.showTotal(), check: (_c, api) => api.getLast().switching.byNet.n1 === GOLDENS.pswN1 },
    { id: "lk", title: "Pleak part", level: "Practice", prompt: "n1 Pleak 0.1.",
      setup: (_c, api) => api.showTotal(), check: (_c, api) => api.getLast().leakage.byNet.n1 === GOLDENS.plkN1 },
    { id: "sel", title: "Select n2", level: "Practice", prompt: "Select n2.",
      setup: (_c, api) => api.selectNet("n2"), check: (_c, api) => api.getSelected().includes("n2") },
    { id: "mode", title: "Mode", level: "Practice", prompt: "mode total.",
      setup: (_c, api) => api.showTotal(), check: (_c, api) => api.getMode()==="total" },
    { id: "golden", title: "chipPtot", level: "Challenge", prompt: "chipPtot=5.55.", check: () => GOLDENS.chipPtot === 5.55 },
  ],
});
