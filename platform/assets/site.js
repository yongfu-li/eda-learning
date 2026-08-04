/**
 * Platform shell: GA4 bootstrap, progress, search, path/course helpers, feedback forms.
 */
(() => {
  const cfg = window.SITE_CONFIG || {};
  const PROGRESS_KEY = cfg.progressKey || "ddv.progress.v1";

  /* ---------- GA4 ---------- */
  function initGa4() {
    const id = (cfg.ga4MeasurementId || "").trim();
    if (!id || !/^G-[A-Z0-9]+$/i.test(id)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(s);
    window.gtag("js", new Date());
    window.gtag("config", id, { send_page_view: true });
  }

  function gtagEvent(name, params) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, params || {});
  }

  /* ---------- Progress (localStorage) ---------- */
  function readProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}") || {};
    } catch (_) {
      return {};
    }
  }

  function writeProgress(data) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    } catch (_) {
      /* ignore quota */
    }
  }

  function labDone(courseId, slug) {
    const all = readProgress();
    return !!(all[courseId] && all[courseId][slug] && all[courseId][slug].done);
  }

  function setLabDone(courseId, slug, done) {
    const all = readProgress();
    if (!all[courseId]) all[courseId] = {};
    if (done) {
      all[courseId][slug] = { done: true, at: new Date().toISOString() };
    } else {
      delete all[courseId][slug];
    }
    writeProgress(all);
    gtagEvent(done ? "lab_complete" : "lab_uncomplete", {
      course_id: courseId,
      lab_slug: slug,
    });
    document.dispatchEvent(
      new CustomEvent("ddv:progress", { detail: { courseId, slug, done } })
    );
  }

  function courseStats(course) {
    const labs = (course && course.labs) || [];
    const trackable = labs.filter((l) => l.kind !== "bridge");
    const done = trackable.filter((l) => labDone(course.id, l.slug)).length;
    return { total: trackable.length, done, pct: trackable.length ? Math.round((done / trackable.length) * 100) : 0 };
  }

  function resetProgress(courseId) {
    const all = readProgress();
    if (courseId) delete all[courseId];
    else Object.keys(all).forEach((k) => delete all[k]);
    writeProgress(all);
    document.dispatchEvent(new CustomEvent("ddv:progress", { detail: { reset: true, courseId } }));
  }

  function assetBase() {
    const el = document.querySelector("[data-asset-base]");
    if (el && el.getAttribute("data-asset-base")) {
      return el.getAttribute("data-asset-base");
    }
    const scripts = document.querySelectorAll("script[src]");
    for (const s of scripts) {
      const src = s.getAttribute("src") || "";
      const m = src.match(/^(.*\/)?assets\/site\.js$/);
      if (m) return (m[1] || "") + "assets/";
    }
    return "assets/";
  }

  function siteRoot() {
    return assetBase().replace(/assets\/?$/, "");
  }

  window.DDV = {
    cfg,
    gtagEvent,
    labDone,
    setLabDone,
    courseStats,
    resetProgress,
    readProgress,
    catalogUrl() {
      return `${assetBase()}catalog.json`;
    },
    storiesUrl() {
      return `${assetBase()}stories.json`;
    },
  };

  /* ---------- Catalog ---------- */
  let catalogPromise = null;
  function loadCatalog() {
    if (catalogPromise) return catalogPromise;
    catalogPromise = fetch(window.DDV.catalogUrl())
      .then((r) => {
        if (!r.ok) throw new Error("catalog fetch failed");
        return r.json();
      })
      .catch(() => ({ courses: [], ladder: [], toolsIndex: [] }));
    return catalogPromise;
  }
  window.DDV.loadCatalog = loadCatalog;

  /* ---------- Search ---------- */
  function buildSearchIndex(catalog) {
    const items = [];
    (catalog.courses || []).forEach((c) => {
      items.push({
        type: "course",
        title: c.title,
        subtitle: c.focus || c.id,
        href: `courses/${c.id}/index.html`,
        keys: `${c.id} ${c.title} ${c.focus || ""}`.toLowerCase(),
      });
      (c.labs || []).forEach((lab) => {
        items.push({
          type: "lab",
          title: `Lab ${lab.n} — ${lab.title}`,
          subtitle: c.title,
          href: `courses/${c.id}/labs/${lab.slug}/index.html`,
          keys: `${lab.slug} ${lab.title} ${lab.toolId || ""} ${c.id}`.toLowerCase(),
        });
      });
    });
    (catalog.toolsIndex || []).forEach((t) => {
      items.push({
        type: "tool",
        title: t.title,
        subtitle: t.section || "Tool",
        href: `tools/${t.id}/index.html`,
        keys: `${t.id} ${t.title} ${t.section || ""}`.toLowerCase(),
      });
    });
    items.push(
      { type: "page", title: "Courses map", subtitle: "Courses", href: "courses/index.html#courses-map", keys: "path ladder map learning courses" },
      { type: "page", title: "Benchmarks", subtitle: "Benchmarks", href: "benchmarks/index.html", keys: "benchmark partition runtime memory upload" },
      { type: "page", title: "Partitioning benchmark", subtitle: "Benchmarks", href: "benchmarks/partitioning/index.html", keys: "partition benchmark kl fm spectral upload" },
      { type: "page", title: "HDL Simulator", subtitle: "Simulator", href: "simulator/index.html", keys: "simulator hdl waveform" },
      { type: "page", title: "Tools catalog", subtitle: "Tools", href: "tools/index.html", keys: "tools labs catalog" },
      { type: "page", title: "Community", subtitle: "Feedback", href: "community/index.html", keys: "community feedback stories" },
      { type: "page", title: "Projects", subtitle: "Coming soon", href: "projects/index.html", keys: "projects" }
    );
    return items;
  }

  function resolveHref(href) {
    return siteRoot() + href;
  }

  function mountSearch() {
    const host = document.querySelector("[data-site-search]");
    if (!host) return;

    host.innerHTML = `
      <label class="site-search-label" for="site-search-input">Search</label>
      <input id="site-search-input" class="site-search-input" type="search"
        placeholder="Courses, labs, tools…" autocomplete="off" />
      <div class="site-search-results" hidden role="listbox"></div>
    `;
    const input = host.querySelector("#site-search-input");
    const results = host.querySelector(".site-search-results");
    let index = [];

    loadCatalog().then((cat) => {
      index = buildSearchIndex(cat);
    });

    function render(q) {
      const query = q.trim().toLowerCase();
      if (!query) {
        results.hidden = true;
        results.innerHTML = "";
        return;
      }
      const hits = index
        .filter((it) => it.keys.includes(query) || it.title.toLowerCase().includes(query))
        .slice(0, 8);
      if (!hits.length) {
        results.hidden = false;
        results.innerHTML = `<div class="site-search-empty">No matches</div>`;
        return;
      }
      results.hidden = false;
      results.innerHTML = hits
        .map(
          (h) =>
            `<a class="site-search-hit" role="option" href="${resolveHref(h.href)}">
              <span class="site-search-hit-type">${h.type}</span>
              <span class="site-search-hit-title">${escapeHtml(h.title)}</span>
              <span class="site-search-hit-sub">${escapeHtml(h.subtitle)}</span>
            </a>`
        )
        .join("");
    }

    input.addEventListener("input", () => render(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        input.value = "";
        render("");
        input.blur();
      }
    });
    document.addEventListener("click", (e) => {
      if (!host.contains(e.target)) {
        results.hidden = true;
      }
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function wireFeedbackForms() {
    const base = (cfg.feedbackIssuesUrl || "").trim();
    if (!base) return;

    document.querySelectorAll("form[data-feedback-form]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const formType = fd.get("form_type") || "feedback";
        const title =
          formType === "testimonial"
            ? `[Testimonial] ${fd.get("name") || "Reader"}`
            : `[Feedback] ${fd.get("tool") || "general"}`;
        const lines = [];
        if (formType === "feedback") {
          lines.push(`Area: ${fd.get("tool") || ""}`);
          lines.push(`Type: ${fd.get("feedback_type") || ""}`);
        } else if (fd.get("role")) {
          lines.push(`Role: ${fd.get("role")}`);
        }
        if (fd.get("name")) lines.push(`Name: ${fd.get("name")}`);
        if (fd.get("email")) lines.push(`Email: ${fd.get("email")}`);
        lines.push("");
        lines.push(fd.get("message") || "");

        const url = new URL(base);
        url.searchParams.set("title", title);
        url.searchParams.set("body", lines.join("\n"));
        window.open(url.toString(), "_blank", "noopener");

        const status = form.querySelector(".comm-status");
        if (status) {
          status.hidden = false;
          status.textContent = "Opening GitHub to submit your message.";
          status.className = "comm-status is-ok";
        }
        gtagEvent("community_feedback", { form_type: formType });
      });
    });
  }

  /* ---------- Video placeholder helper ---------- */
  function wireVideos() {
    document.querySelectorAll(".video-wrap").forEach((wrap) => {
      const video = wrap.querySelector("video");
      const placeholder = wrap.querySelector(".video-placeholder");
      if (!video || !placeholder) return;
      video.addEventListener("error", () => {
        video.style.display = "none";
        placeholder.hidden = false;
      });
      const source = video.querySelector("source");
      if (source && !source.getAttribute("src")) {
        video.style.display = "none";
        placeholder.hidden = false;
      }
    });
  }

  /* ---------- Simulator ---------- */
  function wireSimulatorLinks() {
    const url = (cfg.simulatorUrl || "").trim();
    if (!url) return;
    document.querySelectorAll('a[href$="simulator/index.html"]').forEach((a) => {
      a.href = url;
    });
  }

  /* ---------- Mobile nav ---------- */
  function wireMobileNav() {
    const headerInner = document.querySelector(".site-header-inner");
    const tools = document.querySelector(".site-header-tools");
    const nav = document.querySelector(".site-nav");
    if (!headerInner || !tools || !nav || headerInner.querySelector(".nav-toggle")) return;

    if (!nav.id) nav.id = "site-nav";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav-toggle";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", nav.id);
    btn.setAttribute("aria-label", "Open menu");
    btn.innerHTML =
      '<span class="nav-toggle-bars" aria-hidden="true"><span></span><span></span><span></span></span>';

    const brand = headerInner.querySelector(".brand");
    if (brand && brand.nextSibling) {
      headerInner.insertBefore(btn, brand.nextSibling);
    } else {
      headerInner.appendChild(btn);
    }

    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    btn.addEventListener("click", () => {
      setOpen(!nav.classList.contains("is-open"));
    });

    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });

    window.matchMedia("(max-width: 900px)").addEventListener("change", (e) => {
      if (!e.matches) setOpen(false);
    });
  }

  /* ---------- Nav: Benchmarks link on every page ---------- */
  function wireBenchmarksNav() {
    const nav = document.querySelector(".site-nav");
    if (!nav) return;
    const existing = [...nav.querySelectorAll("a")].find((x) =>
      /benchmarks(\/index\.html)?\/?$/i.test(x.getAttribute("href") || "") ||
      (x.getAttribute("href") || "").includes("/benchmarks/")
    );
    if (existing) {
      existing.setAttribute("data-nav", "benchmarks");
      if (location.pathname.includes("/benchmarks")) {
        existing.classList.add("is-active");
        existing.setAttribute("aria-current", "page");
      }
      return;
    }
    const root = siteRoot();
    const href = `${root}benchmarks/index.html`;
    const a = document.createElement("a");
    a.href = href;
    a.setAttribute("data-nav", "benchmarks");
    a.textContent = "Benchmarks";
    if (location.pathname.includes("/benchmarks")) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
    const tools = [...nav.querySelectorAll("a")].find((x) =>
      /tools\/index\.html|\/tools\/?$/i.test(x.getAttribute("href") || "")
    );
    if (tools) nav.insertBefore(a, tools);
    else nav.appendChild(a);
  }

  /* ---------- Boot ---------- */
  initGa4();
  wireBenchmarksNav();
  wireMobileNav();
  mountSearch();
  wireFeedbackForms();
  wireVideos();
  wireSimulatorLinks();
})();
