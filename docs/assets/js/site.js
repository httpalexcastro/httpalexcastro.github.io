/* ============================================================
   Alex Castro — Portfolio site logic
   Reads /data/*.json and renders cards + detail pages.
   No build step — this runs directly in the browser on GitHub Pages.
   ============================================================ */

const ARROW_SVG = `<svg class="btn-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 7H11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7.5 3L11.5 7L7.5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

async function fetchJSON(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.json();
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}

/**
 * Renders a grid of cards into `gridEl` from a JSON array at `dataUrl`.
 * `nameField` is which JSON key holds the bold card title ("company" for
 * experience, "name" for built-projects). `detailPage` is the detail
 * template this card's button should link to. When `showThumbnail` is
 * true and the item has an `images` array, the first image is shown as
 * a thumbnail at the top of the card.
 */
async function renderCardGrid({ dataUrl, gridEl, emptyEl, nameField, detailPage, showThumbnail, showTitleField = true }) {
  try {
    const items = await fetchJSON(dataUrl);
    if (!items || items.length === 0) {
      gridEl.hidden = true;
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    gridEl.innerHTML = items.map((item) => {
      const firstImage = showThumbnail && item.images && item.images.length ? item.images[0] : null;
      const thumb = firstImage
        ? `<div class="card-thumb"><img src="${escapeHTML(firstImage)}" alt="${escapeHTML(item[nameField])}" loading="lazy" onerror="this.closest('.card-thumb').remove()"></div>`
        : "";
      const titleRow = showTitleField
        ? `<div class="card-meta-row">
            <span class="meta-label">Title</span>
            <span class="meta-value">${escapeHTML(item.title)}</span>
          </div>`
        : "";
      return `
      <article class="card">
        ${thumb}
        <h3 class="card-title">${escapeHTML(item[nameField])}</h3>
        <p class="card-body">${escapeHTML(item.summary)}</p>
        <div class="card-meta">
          <div class="card-meta-row">
            <span class="meta-label">Date</span>
            <span class="meta-value">${escapeHTML(item.date)}</span>
          </div>
          ${titleRow}
        </div>
        <a class="btn" href="${detailPage}?id=${encodeURIComponent(item.id)}">
          Read More Details ${ARROW_SVG}
        </a>
      </article>
    `;
    }).join("");
  } catch (err) {
    console.error(err);
    if (gridEl) gridEl.innerHTML = `<p class="card-body">Couldn't load content right now. Try refreshing.</p>`;
  }
}

/**
 * Renders a single item's full detail view based on the ?id= query param.
 */
async function renderDetail({ dataUrl, containerEl, nameField, showTitleField = true, responsibilitiesHeading = "What I did" }) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  try {
    const items = await fetchJSON(dataUrl);
    const item = items.find((i) => i.id === id);
    if (!item) {
      containerEl.innerHTML = `<div class="empty-state"><p>Couldn't find that entry. It may have been renamed or removed.</p></div>`;
      return;
    }

    document.title = `${item[nameField]} — Alex Castro`;

    const paragraphs = (item.fullDescription || [item.summary])
      .map((p) => `<p>${escapeHTML(p)}</p>`).join("");

    const gallery = (item.images || []).length
      ? `<div class="gallery">${item.images.map((src) => `
          <div class="gallery-item">
            <img src="${escapeHTML(src)}" alt="${escapeHTML(item[nameField])}" loading="lazy" onerror="this.closest('.gallery-item').remove()">
          </div>`).join("")}</div>`
      : "";

    const responsibilities = (item.responsibilities || []).length
      ? `<h2>${escapeHTML(responsibilitiesHeading)}</h2><ul>${item.responsibilities.map((r) => `<li>${escapeHTML(r)}</li>`).join("")}</ul>`
      : "";

    const tech = (item.technologies || []).length
      ? `<h2>Tools &amp; technologies</h2><div class="tag-list">${item.technologies.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join("")}</div>`
      : "";

    const link = item.link
      ? `<p><a class="btn" href="${escapeHTML(item.link)}" target="_blank" rel="noopener">View it ${ARROW_SVG}</a></p>`
      : "";

    const titleField = showTitleField
      ? `<div class="detail-meta-item">
              <span class="meta-label">Title</span>
              <span class="meta-value">${escapeHTML(item.title)}</span>
            </div>`
      : "";

    containerEl.innerHTML = `
      <div class="detail-hero">
        <div class="wrap">
          <h1>${escapeHTML(item[nameField])}</h1>
          <div class="detail-meta-strip">
            ${titleField}
            <div class="detail-meta-item">
              <span class="meta-label">Date</span>
              <span class="meta-value">${escapeHTML(item.date)}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="wrap">
        <div class="detail-content">
          ${paragraphs}
          ${responsibilities}
          ${tech}
          ${gallery}
          ${link}
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    containerEl.innerHTML = `<div class="empty-state"><p>Couldn't load this content right now. Try refreshing.</p></div>`;
  }
}

async function renderContact(dataUrl, containerEl) {
  try {
    const c = await fetchJSON(dataUrl);
    containerEl.innerHTML = `
      <p class="lede">${escapeHTML(c.intro)}</p>
      <div class="contact-card">
        <div class="contact-row">
          <span class="contact-label">Email</span>
          <a class="btn btn-outline" href="mailto:${escapeHTML(c.email)}">${escapeHTML(c.email)}</a>
        </div>
        <div class="contact-row">
          <span class="contact-label">LinkedIn</span>
          <a class="btn btn-outline" href="${escapeHTML(c.linkedin)}" target="_blank" rel="noopener">View profile ${ARROW_SVG}</a>
        </div>
        ${c.resume ? `
        <div class="contact-row">
          <span class="contact-label">Resume</span>
          <a class="btn btn-outline" href="${escapeHTML(c.resume)}" target="_blank" rel="noopener">View resume ${ARROW_SVG}</a>
        </div>` : ""}
        ${c.github ? `
        <div class="contact-row">
          <span class="contact-label">GitHub</span>
          <a class="btn btn-outline" href="${escapeHTML(c.github)}" target="_blank" rel="noopener">View profile ${ARROW_SVG}</a>
        </div>` : ""}
      </div>
    `;
  } catch (err) {
    console.error(err);
    containerEl.innerHTML = `<div class="empty-state"><p>Couldn't load contact info right now. Try refreshing.</p></div>`;
  }
}

/* ---------------- Background audio toggle ---------------- */
(function initAudioToggle() {
  const audio = document.getElementById("bg-audio");
  const toggle = document.getElementById("audio-toggle");
  if (!audio || !toggle) return;

  const STORAGE_KEY = "bgAudioOn";

  function setPlayingUI(isPlaying) {
    toggle.classList.toggle("is-playing", isPlaying);
    toggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    const label = isPlaying ? "Pause background music" : "Play background music";
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
  }

  function play() {
    audio.play().then(() => {
      setPlayingUI(true);
      localStorage.setItem(STORAGE_KEY, "true");
    }).catch(() => {
      // Autoplay was blocked (e.g. no prior user gesture on this page load).
      setPlayingUI(false);
    });
  }

  function pause() {
    audio.pause();
    setPlayingUI(false);
    localStorage.setItem(STORAGE_KEY, "false");
  }

  toggle.addEventListener("click", () => {
    if (audio.paused) {
      play();
    } else {
      pause();
    }
  });

  audio.addEventListener("play", () => setPlayingUI(true));
  audio.addEventListener("pause", () => setPlayingUI(false));

  // If the visitor turned audio on earlier in this browsing session, keep it
  // going on the next page too. Browsers may still block this without a
  // fresh user gesture on the new page load; if so the toggle just falls
  // back to its "off" state and the visitor can tap it again.
  if (localStorage.getItem(STORAGE_KEY) === "true") {
    play();
  }
})();
