/**
 * Course / lab / path-map page renderers (depends on site.js → window.DDV).
 */
(() => {
  const D = window.DDV;
  if (!D) return;

  function kindLabel(kind) {
    const map = { intro: "Intro", lab: "Lab", wrap: "Wrap", bridge: "Bridge", offline: "Offline" };
    return map[kind] || kind || "Lab";
  }

  function toolHref(toolId, depth) {
    if (!toolId) return null;
    const prefix = "../".repeat(depth);
    // First-class benchmark surfaces (not under tools/)
    if (toolId === "partition-benchmark" || toolId === "benchmarks/partitioning") {
      return `${prefix}benchmarks/partitioning/index.html`;
    }
    if (toolId === "cluster-benchmark" || toolId === "benchmarks/clustering") {
      return `${prefix}benchmarks/clustering/index.html`;
    }
    if (toolId === "clock-tree-benchmark" || toolId === "benchmarks/clock-tree") {
      return `${prefix}benchmarks/clock-tree/index.html`;
    }
    if (toolId === "buffer-benchmark" || toolId === "benchmarks/buffering") {
      return `${prefix}benchmarks/buffering/index.html`;
    }
    if (toolId === "legal-benchmark" || toolId === "benchmarks/legalization") {
      return `${prefix}benchmarks/legalization/index.html`;
    }
    if (toolId === "cong-benchmark" || toolId === "benchmarks/congestion") {
      return `${prefix}benchmarks/congestion/index.html`;
    }
    if (toolId === "gr-benchmark" || toolId === "benchmarks/global-routing") {
      return `${prefix}benchmarks/global-routing/index.html`;
    }
    if (toolId === "dr-benchmark" || toolId === "benchmarks/detailed-routing") {
      return `${prefix}benchmarks/detailed-routing/index.html`;
    }
    if (toolId === "place-benchmark" || toolId === "benchmarks/placement") {
      return `${prefix}benchmarks/placement/index.html`;
    }
    if (toolId === "floor-benchmark" || toolId === "benchmarks/floorplanning") {
      return `${prefix}benchmarks/floorplanning/index.html`;
    }
    if (toolId === "compact-benchmark" || toolId === "benchmarks/compaction") {
      return `${prefix}benchmarks/compaction/index.html`;
    }
    if (toolId === "sta-benchmark" || toolId === "benchmarks/sta") {
      return `${prefix}benchmarks/sta/index.html`;
    }
    if (toolId === "retime-benchmark" || toolId === "benchmarks/retiming") {
      return `${prefix}benchmarks/retiming/index.html`;
    }
    if (toolId === "equiv-benchmark" || toolId === "benchmarks/equivalence") {
      return `${prefix}benchmarks/equivalence/index.html`;
    }
    if (toolId === "synth-benchmark" || toolId === "benchmarks/synthesis") {
      return `${prefix}benchmarks/synthesis/index.html`;
    }
    if (String(toolId).startsWith("benchmarks/")) {
      return `${prefix}${toolId}/index.html`;
    }
    return `${prefix}tools/${toolId}/index.html`;
  }

  function moduleDir(lab) {
    // Hierarchical ids (learn_clustering): module02-07-fiduccia-mattheyses
    if (lab && lab.moduleId) return lab.moduleId;
    return `module${lab.n}-${lab.slug}`;
  }

  /** Prefer monorepo course media when authoring on localhost. */
  function useLocalMedia(cfg) {
    const mode = String(cfg.mediaSource || "cdn").toLowerCase();
    if (mode === "local") return true;
    if (mode === "cdn") return false;
    // "auto": localhost only — falls back to CDN if course-media is missing
    const h = (location && location.hostname) || "";
    return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
  }

  function cdnFileUrl(cfg, org, repo, branch, pathParts, file) {
    const dir = (pathParts || []).filter(Boolean).join("/");
    const rel = dir ? `${dir}/${file}` : file;
    const cdn = (cfg.mediaCdn || "jsdelivr").toLowerCase();
    if (cdn === "raw") {
      return `https://raw.githubusercontent.com/${org}/${repo}/${branch}/${rel}`;
    }
    return `https://cdn.jsdelivr.net/gh/${org}/${repo}@${branch}/${rel}`;
  }

  function localFileUrl(courseId, dir, file) {
    const depth = document.querySelector("[data-asset-base]");
    const assetBase = (depth && depth.getAttribute("data-asset-base")) || "../../assets/";
    const prefix = String(assetBase).replace(/assets\/?$/, "course-media/");
    return `${prefix}${courseId}/${dir}/${file}`;
  }

  /**
   * Media URLs from the eda-learning monorepo (video.mp4, slides.pptx, …).
   * CDN: gh/<org>/<mediaRepo>@<branch>/<mediaPathPrefix>/<courseId>/<moduleDir>/<file>
   * Local: /course-media/<courseId>/<moduleDir>/<file>
   */
  function mediaUrls(course, lab) {
    const cfg = D.cfg || {};
    const org = cfg.githubOrg || "SJTU-YONGFU-RESEARCH-GRP";
    const branch = cfg.mediaBranch || "main";
    const mediaRepo = cfg.mediaRepo || "eda-learning";
    const pathPrefix = cfg.mediaPathPrefix != null ? String(cfg.mediaPathPrefix) : "courses";
    const courseId = (course && course.repo) || (course && course.id) || "";
    const dir = moduleDir(lab);
    const local = useLocalMedia(cfg);
    const cdnParts = [pathPrefix, courseId, dir].filter(Boolean);
    const fileUrls = (file) => {
      const cdn = cdnFileUrl(cfg, org, mediaRepo, branch, cdnParts, file);
      const loc = courseId ? localFileUrl(courseId, dir, file) : cdn;
      return {
        primary: local && courseId ? loc : cdn,
        fallbacks: local && courseId ? [cdn] : [],
      };
    };
    const video = fileUrls("video.mp4");
    const slidesPptx = fileUrls("slides.pptx");
    const slidesPdf = fileUrls("slides.pdf");
    const quiz = fileUrls("quiz.json");
    const transcript = fileUrls("transcript.md");
    const treePath = cdnParts.join("/");
    return {
      org,
      repo: mediaRepo,
      courseId,
      branch,
      dir,
      local,
      moduleGithub: `https://github.com/${org}/${mediaRepo}/tree/${branch}/${treePath}`,
      repoGithub: `https://github.com/${org}/${mediaRepo}`,
      video: video.primary,
      videoFallbacks: video.fallbacks,
      slidesPptx: slidesPptx.primary,
      slidesPdf: slidesPdf.primary,
      quiz: quiz.primary,
      quizFallbacks: quiz.fallbacks,
      transcript: transcript.primary,
    };
  }

  /** Courses map rows (top → bottom, left → right). Keep in sync with
   *  publish_course_platform.py PATH_LADDER_ROWS and eda.md. */
  const PATH_LADDER_ROWS = [
    ["learn_eda"],
    ["learn_ir", "learn_geometry", "learn_techlib"],
    ["learn_synthesis", "learn_retiming", "learn_equivalence"],
    ["learn_sta", "learn_sdc", "learn_si"],
    ["learn_partitioning", "learn_clustering"],
    ["learn_floorplanning", "learn_placement", "learn_legalization", "learn_congestion"],
    ["learn_clock_tree", "learn_buffering"],
    ["learn_global_routing", "learn_routing", "learn_compaction"],
    ["learn_pattern_matching", "learn_drc", "learn_lvs", "learn_pex"],
    ["learn_multi_patterning", "learn_rule_dsl"],
    ["learn_spice", "learn_erc", "learn_antenna"],
    ["learn_power", "learn_dft_insert", "learn_signoff"],
    ["learn_yosys", "learn_opensta", "learn_magic", "learn_netgen"],
    ["learn_klayout", "learn_openroad", "learn_openlane", "learn_fpga_cad"],
    ["learn_analog_layout", "learn_ml_eda", "learn_pdks"],
  ];

  function renderCourseLabs(root, courseId) {
    D.loadCatalog().then((cat) => {
      const course = (cat.courses || []).find((c) => c.id === courseId);
      if (!course) {
        root.innerHTML = `<p class="lead">Course not found in catalog.</p>`;
        return;
      }
      const stats = D.courseStats(course);
      const progressEl = document.querySelector("[data-course-progress]");
      if (progressEl) {
        progressEl.innerHTML = stats.total
          ? `<div class="progress-bar" aria-label="Course progress">
               <div class="progress-bar-fill" style="width:${stats.pct}%"></div>
             </div>
             <p class="progress-meta">${stats.done} of ${stats.total} labs marked done (${stats.pct}%)
               · <button type="button" class="btn-link" data-reset-course="${courseId}">Reset progress</button></p>`
          : `<p class="progress-meta">No labs listed yet.</p>`;
        const reset = progressEl.querySelector("[data-reset-course]");
        if (reset) {
          reset.addEventListener("click", () => {
            if (confirm("Clear saved progress for this course?")) {
              D.resetProgress(courseId);
              renderCourseLabs(root, courseId);
            }
          });
        }
      }

      if (!course.labs || !course.labs.length) {
        const media = mediaUrls(course, { n: "00", slug: "intro" });
        root.innerHTML = `
          <div class="placeholder-panel">
            <h2>Labs coming soon</h2>
            <p>Guided lab pages for <code>${escape(courseId)}</code> are not on the site yet.
            Meanwhile use the <a href="../../tools/index.html">tools shelf</a>, the
            <a href="../../syllabus.md">syllabus</a>, and the course repo
            <a href="${escape(media.repoGithub)}">${escape(media.repoGithub)}</a>.</p>
          </div>`;
        return;
      }

      const ul = document.createElement("ul");
      ul.className = "chapter-list lab-list";
      course.labs.forEach((lab) => {
        const done = D.labDone(courseId, lab.slug);
        const planned = lab.status === "planned";
        const href = `labs/${lab.slug}/index.html`;
        const li = document.createElement("li");
        if (planned) {
          li.className = "is-planned";
          li.innerHTML = `<span class="tool-title">
              <span class="lab-num">Lab ${lab.n}</span> ${escape(lab.title)}
              <span class="pill-soon">Coming soon</span>
              ${done ? '<span class="pill-done">Done</span>' : ""}
            </span>
            <div class="chapter-meta">${kindLabel(lab.kind)}${lab.toolId ? ` · tool <code>${escape(lab.toolId)}</code>` : ""}</div>`;
        } else {
          li.innerHTML = `<a href="${href}" class="${done ? "is-done" : ""}">
              <span class="tool-title">
                <span class="lab-num">Lab ${lab.n}</span> ${escape(lab.title)}
                ${done ? '<span class="pill-done">Done</span>' : ""}
              </span>
              <div class="chapter-meta">${kindLabel(lab.kind)}${lab.toolId ? ` · open tool after the clip` : ""}</div>
            </a>`;
        }
        ul.appendChild(li);
      });
      root.innerHTML = "";
      root.appendChild(ul);
    });
  }

  function renderLabPage(courseId, slug) {
    const root = document.querySelector("[data-lab-root]");
    if (!root) return;
    D.loadCatalog().then((cat) => {
      const course = (cat.courses || []).find((c) => c.id === courseId);
      const labs = (course && course.labs) || [];
      const idx = labs.findIndex((l) => l.slug === slug);
      const lab = labs[idx];
      if (!lab) {
        root.innerHTML = `<p class="lead">Lab not found.</p>`;
        return;
      }
      const prev = idx > 0 ? labs[idx - 1] : null;
      const next = idx < labs.length - 1 ? labs[idx + 1] : null;
      const done = D.labDone(courseId, slug);
      const tool = toolHref(lab.toolId, 4);
      const isBench =
        lab.toolId === "partition-benchmark" ||
        lab.toolId === "cluster-benchmark" ||
        lab.toolId === "clock-tree-benchmark" ||
        lab.toolId === "buffer-benchmark" ||
        lab.toolId === "legal-benchmark" ||
        lab.toolId === "cong-benchmark" ||
        lab.toolId === "gr-benchmark" ||
        lab.toolId === "dr-benchmark" ||
        lab.toolId === "place-benchmark" ||
        lab.toolId === "floor-benchmark" ||
        lab.toolId === "compact-benchmark" ||
        lab.toolId === "sta-benchmark" ||
        lab.toolId === "retime-benchmark" ||
        lab.toolId === "equiv-benchmark" ||
        lab.toolId === "synth-benchmark" ||
        String(lab.toolId || "").startsWith("benchmarks/");
      const openLabel = isBench ? "Open benchmark" : "Open tool";
      const openHint = isBench
        ? ` — run the shared dataset scoreboard (upload optional).`
        : ` — load the starter example, then try challenges.`;
      const media = mediaUrls(course, lab);
      const titleEl = document.querySelector("[data-lab-title]");
      if (titleEl) titleEl.textContent = lab.title;
      document.title = `${lab.title} — ${course.title}`;

      const crumbHere = document.querySelector("[data-lab-crumb]");
      if (crumbHere) crumbHere.textContent = `Lab ${lab.n}`;

      root.innerHTML = `
        <div class="eyebrow">${escape(course.title)} · Guided lab</div>
        <section class="hero">
          <h1>${escape(lab.title)}</h1>
          <div class="clip-meta">
            <span class="pill">Lab ${escape(lab.n)} of ${String(labs.length).padStart(2, "0")}</span>
            <span class="pill pill-muted">${escape(kindLabel(lab.kind))}</span>
            ${lab.status === "planned" ? '<span class="pill-soon">Coming soon</span>' : ""}
            ${done ? '<span class="pill-done">Done</span>' : ""}
          </div>
          <nav class="clip-toolbar" aria-label="Lab actions">
            ${
              prev
                ? `<a class="btn btn-secondary" href="../${prev.slug}/index.html">← Previous</a>`
                : `<span class="btn btn-secondary is-disabled">← Previous</span>`
            }
            ${
              tool
                ? `<a class="btn btn-primary" href="${tool}">${openLabel}</a>`
                : `<span class="btn btn-ghost is-disabled">No browser tool</span>`
            }
            <a class="btn btn-secondary" href="${escape(media.slidesPptx)}">Download PPTX</a>
            <a class="btn btn-secondary" href="${escape(media.slidesPdf)}">Download PDF</a>
            <a class="btn btn-ghost" href="#quiz">Jump to quiz</a>
            <a class="btn btn-ghost" href="${escape(media.moduleGithub)}" rel="noopener">Module on GitHub</a>
            <button type="button" class="btn ${done ? "btn-ghost" : "btn-secondary"}" data-toggle-done>
              ${done ? "Mark not done" : "Mark lab done"}
            </button>
            ${
              next
                ? `<a class="btn btn-secondary" href="../${next.slug}/index.html">Next →</a>`
                : `<a class="btn btn-secondary" href="../../index.html">Course map →</a>`
            }
          </nav>
        </section>

        <section class="video-panel" aria-label="Lab video">
          <div class="video-wrap">
            <video controls preload="metadata" playsinline data-video-primary="${escape(media.video)}" data-video-fallbacks="${escape((media.videoFallbacks || []).join("|"))}">
              <source src="${escape(media.video)}" type="video/mp4">
            </video>
          </div>
        </section>

        <h2>What to do</h2>
        <ol class="lab-steps">
          <li>Watch the clip (from the course repo) or skim the slides.</li>
          ${
            tool
              ? `<li><a href="${tool}">${isBench ? "Open the benchmark" : "Open the browser tool"}</a>${lab.toolId ? ` (<code>${escape(lab.toolId)}</code>)` : ""}${openHint}</li>`
              : `<li>This step is ${escape(kindLabel(lab.kind)).toLowerCase()} — no primary tool; follow the module README on GitHub.</li>`
          }
          <li>Optional: practice Track A from
            <a href="${escape(media.repoGithub)}" rel="noopener">${escape(media.repo)}</a>.</li>
          <li>Mark the lab done when you are satisfied (saved in this browser only).</li>
        </ol>

        <div id="quiz" class="quiz-section" hidden>
          <h2>Quiz</h2>
          <p class="lead">Loading…</p>
        </div>

        <p class="lead" style="margin-top:1.5rem">
          Media source:
          <a href="${escape(media.moduleGithub)}" rel="noopener"><code>${escape(media.org)}/${escape(media.repo)}/${escape(media.dir)}/</code></a>
          · <a href="../../../../syllabus.md">Syllabus</a>
        </p>
      `;

      const toggle = root.querySelector("[data-toggle-done]");
      if (toggle) {
        toggle.addEventListener("click", () => {
          D.setLabDone(courseId, slug, !D.labDone(courseId, slug));
          renderLabPage(courseId, slug);
        });
      }

      wireLabVideo(root.querySelector("video"));

      const nextHref = next ? `../${next.slug}/index.html` : "../../index.html";
      const nextLabel = next ? "Next lab →" : "Course map →";
      loadAndMountQuiz(
        [media.quiz].concat(media.quizFallbacks || []),
        root.querySelector("#quiz"),
        {
          nextHref,
          nextLabel,
          onPass: () => {
            D.setLabDone(courseId, slug, true);
          },
        }
      );
    });
  }

  function wireLabVideo(video) {
    if (!video) return;
    const panel = video.closest(".video-panel");
    const fallbacks = String(video.getAttribute("data-video-fallbacks") || "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
    let fi = 0;
    video.addEventListener("error", () => {
      if (fi < fallbacks.length) {
        const next = fallbacks[fi++];
        const source = video.querySelector("source");
        if (source) source.src = next;
        video.src = next;
        video.load();
        return;
      }
      if (panel) panel.hidden = true;
    });
  }

  function ensureQuizScript() {
    if (window.DDVQuiz) return Promise.resolve();
    const base = (document.querySelector("[data-asset-base]") || {}).getAttribute?.("data-asset-base")
      || "assets/";
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `${base}quiz.js`;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("quiz.js failed to load"));
      document.head.appendChild(s);
    });
  }

  function normalizeQuiz(quiz) {
    if (!quiz || typeof quiz !== "object") return quiz;
    if (Array.isArray(quiz.items) && quiz.items.length) return quiz;
    // Compact author form: { questions: [{ prompt, choices, answer }, …] }
    if (Array.isArray(quiz.questions) && quiz.questions.length) {
      return {
        ...quiz,
        title: quiz.title || "Check your understanding",
        items: quiz.questions.map((q, i) => ({
          id: q.id || `q${i + 1}`,
          type: q.type || "multiple_choice",
          prompt: q.prompt || "",
          choices: q.choices || [],
          answer: q.answer,
          explain: q.explain,
        })),
      };
    }
    return quiz;
  }

  function fetchJsonFirst(urls) {
    const list = (urls || []).filter(Boolean);
    const tryAt = (i) => {
      if (i >= list.length) return Promise.reject(new Error("all urls failed"));
      return fetch(list[i], { cache: "no-cache" }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }).catch(() => tryAt(i + 1));
    };
    return tryAt(0);
  }

  function loadAndMountQuiz(quizUrls, quizRoot, opts) {
    if (!quizRoot) return;
    ensureQuizScript()
      .then(() => fetchJsonFirst(Array.isArray(quizUrls) ? quizUrls : [quizUrls]))
      .then((quiz) => {
        quizRoot.hidden = false;
        window.DDVQuiz.mount(quizRoot, normalizeQuiz(quiz), opts);
      })
      .catch(() => {
        // Courses ship quiz.json with modules — hide quietly if missing.
        quizRoot.hidden = true;
        quizRoot.innerHTML = "";
      });
  }

  function renderPathMap(root) {
    D.loadCatalog().then((cat) => {
      const byId = Object.fromEntries((cat.courses || []).map((c) => [c.id, c]));
      const html = PATH_LADDER_ROWS
        .map((row) => {
          const cells = row
            .map((id) => {
              const c = byId[id];
              if (!c) return "";
              const stats = D.courseStats(c);
              // Open any course that has published shells (ready / scaffold / labs[]).
              const open =
                c.status === "ready" ||
                c.status === "scaffold" ||
                (Array.isArray(c.labs) && c.labs.length > 0);
              const href = open ? `${id}/index.html` : "#courses-map";
              const cls = [
                "ladder-node",
                open ? "is-ready" : "is-placeholder",
                c.status === "scaffold" ? "is-scaffold" : "",
                stats.pct === 100 && stats.total ? "is-complete" : "",
                stats.done > 0 && stats.pct < 100 ? "is-progress" : "",
              ]
                .filter(Boolean)
                .join(" ");
              const meta = !open
                ? "Soon"
                : c.status === "scaffold"
                  ? `In progress · ${stats.pct}%`
                  : `${stats.pct}%`;
              return `<a class="${cls}" href="${href}">
                <span class="ladder-id">${escape(id)}</span>
                <span class="ladder-title">${escape(c.title)}</span>
                <span class="ladder-meta">${meta}</span>
              </a>`;
            })
            .join("");
          return `<div class="ladder-row">${cells}</div>`;
        })
        .join('<div class="ladder-arrow" aria-hidden="true">↓</div>');

      root.innerHTML = `<div class="ladder-map">${html}</div>`;
    });
  }

  function renderStories(root) {
    const empty = `
      <div class="story-empty">
        <p>No stories published yet — be the first.</p>
        <p class="story-empty-meta">Submissions are reviewed before they appear on this page.</p>
        <p><a class="btn btn-secondary" href="#share-story">Share your story</a></p>
      </div>`;
    const url = D.storiesUrl ? D.storiesUrl() : "../../assets/stories.json";
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("stories fetch failed");
        return r.json();
      })
      .then((data) => {
        const list = (data && data.stories) || [];
        if (!list.length) {
          root.innerHTML = empty;
          return;
        }
        root.innerHTML = `<ul class="story-list">${list
          .map((s) => {
            const role = s.role ? ` · ${escape(s.role)}` : "";
            const course = s.course
              ? ` <span class="story-course">${escape(s.course)}</span>`
              : "";
            const nameHtml = s.url
              ? `<a class="story-name" href="${escape(s.url)}" rel="noopener noreferrer" target="_blank">${escape(s.name || "Reader")}</a>`
              : `<span class="story-name">${escape(s.name || "Reader")}</span>`;
            return `<li class="story">
              <blockquote class="story-quote"><p>${escape(s.quote || s.message || "")}</p></blockquote>
              <p class="story-by">${nameHtml}${role}${course}</p>
            </li>`;
          })
          .join("")}</ul>`;
      })
      .catch(() => {
        root.innerHTML = empty;
      });
  }

  function escape(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.querySelectorAll("[data-render]").forEach((el) => {
    const mode = el.getAttribute("data-render");
    if (mode === "course-labs") renderCourseLabs(el, el.getAttribute("data-course"));
    if (mode === "path-map") renderPathMap(el);
    if (mode === "stories") renderStories(el);
    if (mode === "lab") {
      renderLabPage(el.getAttribute("data-course"), el.getAttribute("data-lab"));
    }
  });
})();
