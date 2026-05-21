#!/usr/bin/env node
/**
 * Builds a self-contained HTML view of the discovery markdown.
 * Source of truth stays in the .md file; re-run on change.
 *
 *   node build.mjs                     -> emits 2026-05-20-marketplace-discovery.html
 *   node build.mjs path/to/input.md    -> emits path/to/input.html
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const inputArg = process.argv[2] ?? "2026-05-20-marketplace-discovery.md";
const inputPath = resolve(__dirname, inputArg);
const outputPath = inputPath.replace(/\.md$/, ".html");

const md = readFileSync(inputPath, "utf8");

// --- Heading slug + section-number maps -----------------------------------
// We need: (a) anchor slugs on every H2/H3, (b) a map from "§4.6" -> "#slug"
// so we can post-process cross-references like "§4.6" in the rendered HTML.
const headings = [];                       // { level, slug, text, sectionNum }
const slugBySection = new Map();           // "4.6" -> "consumer-onboarding..."
const slugify = (text) =>
  text.toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "");

// Custom renderer: capture H2/H3 + emit anchored headings.
const renderer = new marked.Renderer();
renderer.heading = function ({ text, depth }) {
  // Strip italics markers from text shown in TOC
  const cleanText = text.replace(/<[^>]+>/g, "").replace(/\\/g, "");
  const slug = slugify(cleanText);
  // Detect leading "1." / "4.6" / "11.18" / "Appendix A" patterns
  const numMatch = cleanText.match(/^(\d+(?:\.\d+)*)/);
  const sectionNum = numMatch ? numMatch[1] : null;
  if (depth === 2 || depth === 3) {
    headings.push({ level: depth, slug, text: cleanText, sectionNum });
    if (sectionNum) slugBySection.set(sectionNum, slug);
  }
  // Headings include a clickable anchor on hover
  return `<h${depth} id="${slug}"><a class="anchor" href="#${slug}" aria-label="Link to ${cleanText}">#</a>${text}</h${depth}>\n`;
};

// Tables wrapped in a scroll container with a wide-table class when many cols
renderer.table = function ({ header, rows }) {
  const headerHtml = header.map(c => `<th>${this.parser.parseInline(c.tokens)}</th>`).join("");
  const bodyHtml = rows.map(row =>
    `<tr>${row.map(c => `<td>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`
  ).join("");
  const wide = header.length >= 6 ? " amp-table--wide" : "";
  return `<div class="amp-table-wrap${wide}"><table class="amp-table"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>\n`;
};

marked.use({
  renderer,
  gfm: true,
  breaks: false,
});

let body = marked.parse(md);

// --- Post-process: convert "§4.6", "§11.18" etc. into anchor links ---------
body = body.replace(/§(\d+(?:\.\d+)*)/g, (whole, num) => {
  const slug = slugBySection.get(num);
  return slug ? `<a class="xref" href="#${slug}">§${num}</a>` : whole;
});

// --- Build TOC -------------------------------------------------------------
const tocItems = headings.map(h => {
  const cls = h.level === 2 ? "toc__h2" : "toc__h3";
  const sectionPrefix = h.sectionNum ? "" : ""; // numbers already in the text
  return `<li class="${cls}"><a href="#${h.slug}" data-target="${h.slug}">${h.text}</a></li>`;
}).join("\n");

// --- Doc metadata ----------------------------------------------------------
// Pull title from first H1
const titleMatch = md.match(/^#\s+(.+)$/m);
const docTitle = titleMatch ? titleMatch[1] : basename(inputPath);
const today = new Date().toISOString().slice(0, 10);

// --- HTML template ---------------------------------------------------------
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${docTitle}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/govuk-frontend@5.4.0/dist/govuk/govuk-frontend.min.css">
<style>
@font-face {
  font-family: "GDS Transport";
  src: url("https://cdn.jsdelivr.net/npm/govuk-frontend@5.4.0/dist/govuk/assets/fonts/light-94a07e06a1-v2.woff2") format("woff2");
  font-weight: 300; font-style: normal; font-display: swap;
}
@font-face {
  font-family: "GDS Transport";
  src: url("https://cdn.jsdelivr.net/npm/govuk-frontend@5.4.0/dist/govuk/assets/fonts/bold-b542beb274-v2.woff2") format("woff2");
  font-weight: 700; font-style: normal; font-display: swap;
}

:root {
  --amp-bg:        #ffffff;
  --amp-fg:        #0b0c0c;
  --amp-muted:     #505a5f;
  --amp-border:    #b1b4b6;
  --amp-light:     #f3f2f1;
  --amp-blue:      #1d70b8;
  --amp-blue-dark: #003078;
  --amp-yellow:    #fd0;
  --amp-green:     #00703c;
  --amp-red:       #d4351c;
  --amp-purple:    #4c2c92;
  --sidebar-w:     320px;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 24px; }
body {
  font-family: "GDS Transport", arial, sans-serif;
  font-size: 16px; line-height: 1.55;
  color: var(--amp-fg);
  background: var(--amp-bg);
  margin: 0;
}

/* --- Header --- */
.amp-header { background: #0b0c0c; border-bottom: 4px solid var(--amp-blue); color: #fff; }
.amp-header__inner {
  max-width: 1400px; margin: 0 auto; padding: 14px 24px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.amp-header__title { font-weight: 700; font-size: 18px; line-height: 1.2; }
.amp-header__title small { display: block; font-weight: 400; font-size: 13px; opacity: 0.7; margin-top: 2px; }
.amp-header__meta { font-size: 13px; opacity: 0.8; display: flex; gap: 16px; flex-wrap: wrap; }

/* Phase banner */
.amp-phase { background: var(--amp-blue); color: #fff; padding: 8px 0; font-size: 14px; }
.amp-phase__inner { max-width: 1400px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; gap: 12px; }
.amp-phase__tag { background: #fff; color: var(--amp-blue); font-weight: 700; padding: 2px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }

/* --- Layout --- */
.amp-layout {
  max-width: 1400px; margin: 0 auto; padding: 0 24px;
  display: grid; grid-template-columns: var(--sidebar-w) 1fr; gap: 32px;
  align-items: start;
}

/* --- Sidebar / TOC --- */
.amp-sidebar {
  position: sticky; top: 0;
  height: 100vh; overflow-y: auto;
  padding: 24px 0 24px 0;
  border-right: 1px solid var(--amp-border);
}
.amp-sidebar__search {
  position: sticky; top: 0; background: var(--amp-bg); padding-bottom: 12px; z-index: 2;
  border-bottom: 1px solid var(--amp-light); margin-bottom: 12px;
}
.amp-sidebar__search input {
  width: 100%; padding: 8px 10px; font: inherit; font-size: 14px;
  border: 2px solid var(--amp-border); background: #fff;
}
.amp-sidebar__search input:focus { outline: 3px solid var(--amp-yellow); outline-offset: 0; border-color: var(--amp-fg); }

.toc { list-style: none; padding: 0; margin: 0; font-size: 14px; }
.toc li { line-height: 1.35; }
.toc a {
  display: block; text-decoration: none; color: var(--amp-fg);
  padding: 6px 8px 6px 12px; border-left: 3px solid transparent;
}
.toc a:hover { background: var(--amp-light); }
.toc a.active { border-left-color: var(--amp-blue); background: var(--amp-light); font-weight: 700; color: var(--amp-blue-dark); }
.toc__h2 a { font-weight: 700; padding-left: 12px; margin-top: 8px; }
.toc__h3 a { font-weight: 400; padding-left: 28px; font-size: 13px; color: var(--amp-muted); }
.toc__h3 a.active { color: var(--amp-blue-dark); }
.toc li.hidden { display: none; }

/* --- Content --- */
.amp-content {
  padding: 32px 0 64px;
  min-width: 0; /* allow children to shrink */
}
.amp-content > h1 { font-size: 30px; line-height: 1.2; margin: 0 0 16px; }
.amp-content > h2 {
  font-size: 24px; line-height: 1.25; margin: 48px 0 12px;
  padding-bottom: 8px; border-bottom: 2px solid var(--amp-blue);
}
.amp-content > h3 {
  font-size: 18px; line-height: 1.3; margin: 32px 0 10px;
  color: var(--amp-blue-dark);
}
.amp-content h2:first-child, .amp-content h1 + h2 { margin-top: 0; }
.amp-content p, .amp-content ul, .amp-content ol { margin: 0 0 16px; max-width: 80ch; }
.amp-content ul, .amp-content ol { padding-left: 24px; }
.amp-content li { margin-bottom: 6px; }
.amp-content code {
  background: var(--amp-light); padding: 1px 6px; border-radius: 3px;
  font-family: ui-monospace, "Cascadia Mono", Menlo, Consolas, monospace; font-size: 14px;
}
.amp-content pre {
  background: #0b0c0c; color: #f3f2f1; padding: 16px; overflow-x: auto;
  font-family: ui-monospace, "Cascadia Mono", Menlo, Consolas, monospace; font-size: 13px; line-height: 1.5;
  border-left: 4px solid var(--amp-blue);
}
.amp-content pre code { background: transparent; padding: 0; color: inherit; border-radius: 0; }
.amp-content blockquote {
  margin: 16px 0; padding: 12px 20px; border-left: 5px solid var(--amp-blue);
  background: var(--amp-light); color: var(--amp-fg);
  max-width: 80ch;
}
.amp-content blockquote p:last-child { margin-bottom: 0; }
.amp-content hr { border: none; border-top: 1px solid var(--amp-border); margin: 32px 0; }

/* Anchor links on headings — visible on hover */
.amp-content h2 .anchor, .amp-content h3 .anchor {
  text-decoration: none; color: var(--amp-blue); opacity: 0;
  padding-right: 6px; font-weight: 400;
  transition: opacity 0.1s;
}
.amp-content h2:hover .anchor, .amp-content h3:hover .anchor { opacity: 1; }

/* Cross-references like §4.6 */
.xref {
  color: var(--amp-blue); text-decoration: none;
  border-bottom: 1px dotted var(--amp-blue);
}
.xref:hover { background: var(--amp-blue); color: #fff; border-bottom-color: var(--amp-blue); }

/* --- Tables --- */
.amp-table-wrap {
  margin: 16px 0; overflow-x: auto; border: 1px solid var(--amp-border);
  max-width: 100%;
}
.amp-table {
  border-collapse: collapse; width: 100%; font-size: 14px; line-height: 1.4;
  min-width: 600px;
}
.amp-table--wide .amp-table { min-width: 1100px; }
.amp-table th, .amp-table td {
  text-align: left; padding: 10px 12px; vertical-align: top;
  border-bottom: 1px solid var(--amp-light);
}
.amp-table th {
  background: var(--amp-light); font-weight: 700;
  position: sticky; top: 0; z-index: 1;
  border-bottom: 2px solid var(--amp-border);
}
.amp-table td:first-child { font-weight: 600; }
.amp-table tr:hover td { background: #fafafa; }

/* Two-col GOV.UK we-do/we-don't style — match the intro frame visually */
.amp-content blockquote h3 { margin-top: 0; }

/* --- Mobile --- */
.amp-toc-toggle { display: none; }
@media (max-width: 980px) {
  .amp-layout { grid-template-columns: 1fr; }
  .amp-sidebar {
    position: fixed; left: 0; top: 0; bottom: 0; width: 320px; max-width: 88vw;
    background: #fff; z-index: 100; transform: translateX(-100%);
    transition: transform 0.2s ease-out; border-right: 1px solid var(--amp-border);
    padding-left: 16px; padding-right: 16px;
    box-shadow: 0 0 20px rgba(0,0,0,0.15);
  }
  .amp-sidebar.amp-sidebar--open { transform: translateX(0); }
  .amp-toc-toggle {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--amp-blue); color: #fff; border: none;
    padding: 8px 14px; font: inherit; cursor: pointer;
    font-size: 14px; font-weight: 700;
  }
  .amp-toc-toggle:focus { outline: 3px solid var(--amp-yellow); }
  .amp-content { padding-top: 16px; }
}

/* --- Print --- */
@media print {
  .amp-sidebar, .amp-phase, .amp-toc-toggle, #backToTop { display: none !important; }
  .amp-layout { display: block; max-width: none; padding: 0; }
  .amp-content { padding: 0; }
  .amp-content h2 { page-break-before: always; }
  .amp-content h2:first-of-type { page-break-before: avoid; }
  .amp-content pre, .amp-content blockquote, .amp-table-wrap { page-break-inside: avoid; }
  a { color: inherit; text-decoration: underline; }
  .anchor { display: none; }
  body { font-size: 11pt; }
}

/* --- Back-to-top --- */
#backToTop {
  position: fixed; right: 24px; bottom: 24px;
  background: var(--amp-blue); color: #fff;
  border: none; padding: 10px 14px;
  font: inherit; font-size: 14px; font-weight: 700;
  cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  opacity: 0; pointer-events: none; transition: opacity 0.15s;
  z-index: 50;
}
#backToTop:focus { outline: 3px solid var(--amp-yellow); outline-offset: 0; }
#backToTop.visible { opacity: 1; pointer-events: auto; }
</style>
</head>
<body>

<header class="amp-header" role="banner">
  <div class="amp-header__inner">
    <div class="amp-header__title">
      HMCTS API Marketplace
      <small>Discovery report &middot; ${today} &middot; pre-design, pre-implementation</small>
    </div>
    <div class="amp-header__meta">
      <span>Author: Duncan Crawford</span>
      <span>Status: Discovery</span>
    </div>
  </div>
</header>

<div class="amp-phase" role="region" aria-label="Document phase">
  <div class="amp-phase__inner">
    <strong class="amp-phase__tag">Discovery</strong>
    <span>Living document. 19 open questions in §11 — feedback welcome. <button class="amp-toc-toggle" id="tocToggle" aria-expanded="false" aria-controls="sidebar">☰ Contents</button></span>
  </div>
</div>

<div class="amp-layout">

  <aside class="amp-sidebar" id="sidebar" aria-label="Table of contents">
    <div class="amp-sidebar__search">
      <label for="tocSearch" class="govuk-visually-hidden">Filter sections</label>
      <input id="tocSearch" type="search" placeholder="Filter sections…" autocomplete="off">
    </div>
    <nav aria-label="Document sections">
      <ul class="toc" id="toc">
${tocItems}
      </ul>
    </nav>
  </aside>

  <main class="amp-content" id="content">
${body}
  </main>

</div>

<button id="backToTop" type="button" aria-label="Back to top">↑ Top</button>

<script>
(function(){
  // --- TOC active-section highlighting on scroll ---------------------------
  const headings = Array.from(document.querySelectorAll('.amp-content h2, .amp-content h3'));
  const tocLinks = new Map();
  document.querySelectorAll('#toc a').forEach(a => {
    tocLinks.set(a.dataset.target, a);
  });

  function setActive(slug) {
    tocLinks.forEach(a => a.classList.remove('active'));
    const link = tocLinks.get(slug);
    if (link) {
      link.classList.add('active');
      // Scroll the TOC so the active item is visible
      const sidebar = document.getElementById('sidebar');
      const linkRect = link.getBoundingClientRect();
      const sbRect = sidebar.getBoundingClientRect();
      if (linkRect.top < sbRect.top + 60 || linkRect.bottom > sbRect.bottom - 20) {
        link.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
  }

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      // pick the first heading currently in the top quarter of the viewport
      const visible = entries.filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) {
        setActive(visible[0].target.id);
      }
    }, { rootMargin: '0px 0px -75% 0px', threshold: 0 });
    headings.forEach(h => obs.observe(h));
  }

  // --- TOC search filter ---------------------------------------------------
  const search = document.getElementById('tocSearch');
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      document.querySelectorAll('#toc li').forEach(li => {
        const t = li.textContent.toLowerCase();
        li.classList.toggle('hidden', q.length > 0 && !t.includes(q));
      });
    });
  }

  // --- Mobile TOC toggle ---------------------------------------------------
  const tocToggle = document.getElementById('tocToggle');
  const sidebar = document.getElementById('sidebar');
  if (tocToggle) {
    tocToggle.addEventListener('click', () => {
      const open = sidebar.classList.toggle('amp-sidebar--open');
      tocToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close on TOC link click (mobile)
    document.querySelectorAll('#toc a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 980) {
          sidebar.classList.remove('amp-sidebar--open');
          tocToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // --- Back-to-top button --------------------------------------------------
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Copy anchor link on heading anchor click ----------------------------
  document.querySelectorAll('.anchor').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const url = window.location.origin + window.location.pathname + a.getAttribute('href');
      navigator.clipboard?.writeText(url);
      history.pushState(null, '', a.getAttribute('href'));
      // Brief visual feedback
      const orig = a.textContent;
      a.textContent = '✓';
      setTimeout(() => { a.textContent = orig; }, 800);
    });
  });
})();
</script>
</body>
</html>
`;

writeFileSync(outputPath, html, "utf8");

console.log(`✓ Built ${outputPath}`);
console.log(`  ${headings.length} headings  ·  ${(html.length / 1024).toFixed(1)} kB`);
