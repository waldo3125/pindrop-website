/**
 * Static page generator for the Pindrop Entertainment V3 site.
 *
 * Renders every page from _source/data.mjs into plain .html files at the folder
 * root. The output has no dependencies and no server requirement — the site is
 * opened by double-clicking index.html.
 *
 * Run:  node _source/build.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE,
  NAV,
  SOCIAL,
  STATS,
  RECOGNITION,
  CATEGORIES,
  PROJECTS,
  BOOKS,
  FOUNDERS,
  PIPELINE,
  HERITAGE,
  LIVE_SHORTS,
  AI_DISCLOSURE,
} from './data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Highlighted Shorts, pulled from the YouTube channel by
 * `node _source/refresh-shorts.mjs`. Missing or empty is fine — the section
 * simply does not render.
 */
const SHORTS = (() => {
  const file = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shorts.json');
  if (!fs.existsSync(file)) return { items: [] };
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    console.warn('shorts.json could not be parsed — skipping the Shorts grid.');
    return { items: [] };
  }
})();

/* ----------------------------------------------------------------- helpers */

/**
 * Cache-busting suffix derived from the file's own bytes, so a returning
 * visitor picks up a changed stylesheet or script immediately instead of
 * waiting out the CDN's cache.
 */
const assetVersions = new Map();
function assetV(rel) {
  if (!assetVersions.has(rel)) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) {
      assetVersions.set(rel, '');
    } else {
      const buf = fs.readFileSync(full);
      let h = 5381;
      for (let i = 0; i < buf.length; i++) h = ((h * 33) ^ buf[i]) >>> 0;
      assetVersions.set(rel, `?v=${h.toString(36)}`);
    }
  }
  return assetVersions.get(rel);
}

/**
 * Intrinsic pixel size of a PNG or JPEG, read straight from the file header.
 * Used to give every <img> width/height so nothing shifts as images load.
 */
const dimCache = new Map();
function imageSize(rel) {
  if (dimCache.has(rel)) return dimCache.get(rel);
  let out = null;
  const full = path.join(ROOT, rel);
  try {
    const b = fs.readFileSync(full);
    if (b.length > 24 && b.toString('ascii', 1, 4) === 'PNG') {
      out = { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    } else if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length - 9) {
        if (b[i] !== 0xff) {
          i++;
          continue;
        }
        const marker = b[i + 1];
        // SOF0-SOF15, skipping the non-frame markers in that range.
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          out = { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
          break;
        }
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  } catch {
    out = null;
  }
  dimCache.set(rel, out);
  return out;
}

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Renders a <picture> with the .webp sibling when one exists on disk. */
function picture(src, alt, { className = '', loading = 'lazy', sizes = '' } = {}) {
  if (!src) return '';
  const webp = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const hasWebp = fs.existsSync(path.join(ROOT, webp));
  const dim = imageSize(src);
  const attrs = [
    `src="${esc(src)}"`,
    `alt="${esc(alt)}"`,
    dim ? `width="${dim.w}" height="${dim.h}"` : '',
    `loading="${loading}"`,
    loading === 'eager' ? 'fetchpriority="high"' : 'decoding="async"',
    className ? `class="${className}"` : '',
    sizes ? `sizes="${sizes}"` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return hasWebp
    ? `<picture><source srcset="${esc(webp)}" type="image/webp"><img ${attrs}></picture>`
    : `<img ${attrs}>`;
}

const ICON = {
  arrow:
    '<svg class="ic ic--arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ext: '<svg class="ic" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3h7v7M13 3 5 11M11 13H3V5" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
};

const yearOf = (p) => (p.year ? p.year : '');

/* ------------------------------------------------------------ chrome parts */

/** Absolute production URL for a page file. index.html canonicalises to "/". */
function canonicalFor(file) {
  return file === 'index.html' ? `${SITE.url}/` : `${SITE.url}/${file}`;
}

function head({ title, description, page, canonical, jsonLd = [], noindex = false }) {
  const url = canonical ?? canonicalFor(page);
  const ld = jsonLd
    .filter(Boolean)
    .map((o) => `\n<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
${noindex ? '<meta name="robots" content="noindex, follow">\n' : ''}<meta name="theme-color" content="#08080a">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:locale" content="en_US">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE.url}/assets/brand/pindrop-social-card.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(SITE.name)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE.url}/assets/brand/pindrop-social-card.png">
<link rel="icon" href="assets/brand/favicon.ico" sizes="any">
<link rel="icon" href="assets/brand/favicon-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="assets/brand/favicon-16.png" type="image/png" sizes="16x16">
<link rel="apple-touch-icon" href="assets/brand/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<!-- Fonts are not preloaded: a preload needs crossorigin, which a page opened
     straight from the filesystem cannot satisfy. @font-face loads fine either way. -->
<link rel="stylesheet" href="assets/css/site.css${assetV('assets/css/site.css')}">
<script>document.documentElement.className+=' js';</script>${ld}
</head>
<body data-page="${esc(page)}">
<a class="skip" href="#main">Skip to content</a>`;
}

function header(page) {
  const links = NAV.map(
    (n) =>
      `<a class="nav__link" href="${n.href}"${page === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`
  ).join('\n        ');

  const menuLinks = [{ label: 'Home', href: 'index.html' }, ...NAV]
    .map(
      (n, i) =>
        `<a href="${n.href}" style="--i:${i}"${page === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`
    )
    .join('\n        ');

  return `
<header class="header" data-header>
  <div class="wrap header__inner">
    <a class="brand" href="index.html" aria-label="${esc(SITE.name)} — home">
      ${picture('assets/brand/wordmark-on-dark-420.png', SITE.name, { loading: 'eager' })}
    </a>
    <nav class="nav" aria-label="Primary">
        ${links}
    </nav>
    <div class="header__actions">
      <a class="btn btn--ghost btn--sm" href="https://youtube.com/@PindropMedia" target="_blank" rel="noopener">Watch on YouTube ${ICON.ext}</a>
      <button class="menu-btn" type="button" data-menu-btn aria-expanded="false" aria-controls="menu">
        <span class="menu-btn__bars" aria-hidden="true"><span></span><span></span></span>
        Menu
      </button>
    </div>
  </div>
</header>

<div class="menu" id="menu" data-menu data-open="false">
  <nav class="menu__list" aria-label="Mobile">
        ${menuLinks}
  </nav>
  <div class="menu__foot">
    ${SOCIAL.slice(0, 3)
      .map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a>`)
      .join('\n    ')}
  </div>
</div>`;
}

function footer(extraScripts = '') {
  return `
<footer class="footer">
  <div class="wrap">
    <div class="footer__top">
      <div class="footer__brand">
        ${picture('assets/brand/wordmark-on-dark-420.png', SITE.name)}
        <p class="footer__tagline">Story first, across every format.</p>
      </div>
      <nav class="footer__col" aria-labelledby="ft-explore">
        <p class="footer__col-title" id="ft-explore">Explore</p>
        <ul>
          <li><a href="index.html">Home</a></li>
          ${NAV.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('\n          ')}
        </ul>
      </nav>
      <nav class="footer__col" aria-labelledby="ft-follow">
        <p class="footer__col-title" id="ft-follow">Follow</p>
        <ul>
          ${SOCIAL.map(
            (s) =>
              `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`
          ).join('\n          ')}
        </ul>
      </nav>
      <nav class="footer__col" aria-labelledby="ft-elsewhere">
        <p class="footer__col-title" id="ft-elsewhere">Elsewhere</p>
        <ul>
          <li><a href="https://www.amazon.com/stores/author/B082QP7SX5" target="_blank" rel="noopener">Books on Amazon</a></li>
          <li><a href="https://open.spotify.com/show/4nynxZkGwYRsflfgpADvBN" target="_blank" rel="noopener">Podcast</a></li>
          <li><a href="privacy.html">Privacy</a></li>
        </ul>
      </nav>
    </div>
    <div class="footer__legal">
      <p>© <span data-year>${SITE.copyrightYear}</span> ${esc(SITE.name)}. ${esc(SITE.location)}. All rights reserved.<br>
      Stories, characters, and concepts remain under the ownership of their creators and ${esc(SITE.name)}.</p>
      <p style="text-align:right">Built as a static site.<br>No trackers, no cookies.</p>
    </div>
  </div>
</footer>

<script src="assets/js/site.js${assetV('assets/js/site.js')}" defer></script>${extraScripts}
</body>
</html>`;
}

function page({ title, description, page: p, body, extraScripts = '' }) {
  return `${head({ title, description, page: p })}${header(p)}
<main id="main">
${body}
</main>${footer(extraScripts)}`;
}

/* ------------------------------------------------------- structured data */

const ORG_ID = `${SITE.url}/#organization`;

/** The company itself — referenced by @id from the other page types. */
function orgLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: `${SITE.url}/`,
    logo: `${SITE.url}/assets/brand/icon-512.png`,
    image: `${SITE.url}/assets/brand/pindrop-social-card.png`,
    description: SITE.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rochester',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
    founder: FOUNDERS.map((f) => ({
      '@type': 'Person',
      name: f.name,
      jobTitle: f.role.replace('Co-Founder · ', ''),
      url: `${SITE.url}/studio.html#${f.slug}`,
      sameAs: f.links.map((l) => l.url),
    })),
    sameAs: SOCIAL.map((s) => s.url),
  };
}

function breadcrumbLd(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: t.file === 'index.html' ? `${SITE.url}/` : `${SITE.url}/${t.file}`,
    })),
  };
}

function bookLd(b) {
  const out = {
    '@type': 'Book',
    name: b.title,
    author: { '@type': 'Person', name: 'Thomas Muller' },
    genre: b.genre,
    inLanguage: 'en',
    url: b.amazon,
    image: `${SITE.url}/${b.cover}`,
    description: b.short,
    publisher: { '@type': 'Organization', name: 'Independently published' },
  };
  if (b.isbn) out.isbn = b.isbn;
  if (b.pages) out.numberOfPages = Number(b.pages);
  if (b.year) out.datePublished = b.year;
  return out;
}

function projectLd(p) {
  const out = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${p.title}${p.subtitle ? ` ${p.subtitle}` : ''}`,
    url: canonicalFor(`project-${p.slug}.html`),
    description: p.short,
    genre: p.formatLong ?? p.format,
    inLanguage: 'en',
    creator: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isAccessibleForFree: true,
  };
  if (p.year) out.datePublished = p.year;
  if (p.image) out.image = `${SITE.url}/${p.image}`;
  if (p.youtubeId) out.sameAs = `https://www.youtube.com/watch?v=${p.youtubeId}`;
  const people = p.credits
    .filter((c) => c.name !== SITE.name)
    .map((c) => ({ '@type': 'Person', name: c.name }));
  if (people.length) out.author = people;
  return out;
}

/* -------------------------------------------------------------- fragments */

function projectCard(p, i = 0) {
  const href = `project-${p.slug}.html`;
  // A project can opt its card out of the still it uses elsewhere.
  const cardSrc = p.cardImage !== undefined ? p.cardImage : p.image;
  const media = cardSrc
    ? `<div class="card__media">${picture(cardSrc, `${p.title} — artwork`)}</div>`
    : `<div class="card__media card__media--type"><span class="plate">${esc(p.title)}<small>${esc(p.format)}</small></span></div>`;
  return `<article class="card reveal" style="--i:${i}" data-category="${p.category}">
  ${media}
  <div class="card__body">
    <p class="card__meta"><span>${esc(p.format)}</span>${yearOf(p) ? `<span>${esc(p.year)}</span>` : ''}</p>
    <h3 class="card__title"><a class="card__link" href="${href}">${esc(p.title)}${p.subtitle ? ` <span class="muted">${esc(p.subtitle)}</span>` : ''}</a></h3>
    <p class="card__desc">${esc(p.short)}</p>
    <p class="card__foot"><span>View project</span>${ICON.arrow}</p>
  </div>
</article>`;
}

/**
 * A book jacket. Where the published cover art exists it is the whole card —
 * these are the real covers, so nothing is drawn over them. The typographic
 * face is only a fallback for a title with no artwork.
 */
function bookCover(b, { eager = false } = {}) {
  if (b.cover) {
    return `<span class="book__cover book__cover--art"${b.tone ? ` style="--tone:${b.tone}"` : ''}>
      ${picture(b.cover, `${b.title} by Thomas Muller — cover`, { loading: eager ? 'eager' : 'lazy' })}
    </span>`;
  }
  return `<span class="book__cover"${b.tone ? ` style="--tone:${b.tone}"` : ''}>
      <span class="book__face">
        <span>
          <span class="book__rule"></span>
          <h3>${esc(b.title)}</h3>
          <span class="book__author">Thomas Muller</span>
        </span>
      </span>
    </span>`;
}

function bookCard(b, i = 0) {
  return `<article class="book reveal" style="--i:${i}">
  <a href="${b.amazon}" target="_blank" rel="noopener" aria-label="${esc(b.title)} on Amazon">
    ${bookCover(b)}
  </a>
  <div class="book__info">
    <p class="book__genre">${esc(b.genre)}${b.year ? ` · ${esc(b.year)}` : ''}</p>
    <p class="book__short">${esc(b.short)}</p>
    <a class="tlink" href="${b.amazon}" target="_blank" rel="noopener">Get the book ${ICON.ext}</a>
  </div>
</article>`;
}

function videoFacade(id, title, poster) {
  return `<div class="video" data-video="${esc(id)}" data-video-title="${esc(title)}">
  ${poster ? picture(poster, `${title} — video still`) : ''}
  <button class="video__btn" type="button" data-video-btn>
    <span class="video__play">${ICON.play}</span>
    <span class="video__label">Play — ${esc(title)}</span>
  </button>
</div>
<p class="video__note">The YouTube player loads only when you press play.</p>`;
}

/** A 4-up wall of vertical Shorts pulled from the channel. */
function shortsGrid() {
  if (!SHORTS.items?.length) return '';
  return `<section class="section section--tight section--edge" id="shorts">
  <div class="wrap">
    <div class="section-head section-head--split reveal">
      <p class="eyebrow">Highlighted shorts</p>
      <h2>Straight from the channel.</h2>
      <a class="tlink" href="${esc(SHORTS.channelUrl ?? 'https://youtube.com/@PindropMedia')}/shorts" target="_blank" rel="noopener">View all ${ICON.ext}</a>
    </div>
    <div class="shorts" data-shorts>
      ${SHORTS.items
        .map(
          (s, i) => `<a class="short reveal" style="--i:${i % 4}" href="https://www.youtube.com/shorts/${esc(s.id)}" target="_blank" rel="noopener">
        <span class="short__media">
          ${picture(s.thumb, `${s.title} — still`)}
          <span class="short__play">${ICON.play}</span>
        </span>
        <span class="short__title">${esc(s.title)}</span>
      </a>`
        )
        .join('\n      ')}
    </div>
    <p class="meta mt-md">Straight from the Pindrop channel</p>
  </div>
</section>`;
}

function marquee() {
  const items = RECOGNITION.map((r) => `<span class="marquee__item">${esc(r)}</span>`).join('');
  return `<div class="marquee" aria-label="Recognition">
  <div class="marquee__track">${items}${items}</div>
</div>`;
}

function statsBand() {
  return `<section class="section--edge" aria-label="By the numbers">
  <div class="stats">
    ${STATS.map(
      (s) =>
        `<div class="stat"><p class="stat__value">${esc(s.value)}</p><p class="stat__label">${esc(s.label)}</p></div>`
    ).join('\n    ')}
  </div>
</section>`;
}

function ctaBlock() {
  return `<section class="section">
  <div class="wrap">
    <div class="cta reveal">
      <p class="eyebrow eyebrow--center eyebrow--plain">Work with Pindrop</p>
      <h2>Working on something worth telling?</h2>
      <p class="lead">Collaboration, production, adaptation rights, or press — the studio is reachable through its founders and channels.</p>
      <div class="cta__actions">
        <a class="btn btn--primary" href="contact.html">Get in touch ${ICON.arrow}</a>
        <a class="btn btn--ghost" href="work.html">See the work</a>
      </div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ pages */

function homePage() {
  const featured = PROJECTS.find((p) => p.featured === 1);
  const selected = PROJECTS.filter((p) => p.slug !== featured.slug).slice(0, 6);
  const books = BOOKS.filter((b) => b.featured).concat(BOOKS.filter((b) => !b.featured)).slice(0, 4);

  const body = `
<section class="hero">
  <div class="hero__media">
    <!-- The media queries keep the 3–7 MB animation off phones and tablets
         entirely: no source matches below 48em, so nothing is fetched and the
         poster frame stands in. preload="metadata" keeps it off the critical
         path on desktop too. -->
    <video data-hero-video autoplay muted loop playsinline preload="metadata"
      poster="assets/brand/pindrop-brand-animation-poster.webp" aria-hidden="true" tabindex="-1">
      <source src="assets/brand/pindrop-brand-animation.webm" type="video/webm" media="(min-width: 48em)">
      <source src="assets/brand/pindrop-brand-animation.mp4" type="video/mp4" media="(min-width: 48em)">
    </video>
  </div>
  <div class="hero__scrim" aria-hidden="true"></div>
  <div class="hero__content">
    <p class="eyebrow">Independent studio · ${esc(SITE.location)}</p>
    <h1 class="hero__title">Stories built to <em>travel</em>.</h1>
    <p class="lead hero__lead">Pindrop Entertainment develops narrative work across film, books, audio, and experiments — written first, produced fast, and directed by hand.</p>
    <div class="hero__actions">
      <a class="btn btn--primary" href="work.html">Explore the work ${ICON.arrow}</a>
      <a class="btn btn--ghost" href="#spotlight">See the flagship series</a>
    </div>
    <div class="hero__foot">
      <p class="meta">Film &amp; video · Books &amp; prose · Audio · Experiments</p>
      <span class="scroll-cue"><span class="line"></span> Scroll</span>
    </div>
  </div>
</section>

${marquee()}

<section class="section" id="spotlight">
  <div class="wrap">
    <div class="section-head section-head--split reveal">
      <p class="eyebrow">Now in release</p>
      <h2>The flagship series.</h2>
      <a class="tlink" href="work.html">All work ${ICON.arrow}</a>
    </div>
    <article class="spotlight reveal">
      <div class="spotlight__media">${picture(featured.image, `${featured.title} — key still`, { loading: 'eager' })}</div>
      <div class="spotlight__body">
        <div class="spotlight__row">
          <span class="tag">${esc(featured.status)}</span>
          <span class="tag tag--plain">${esc(featured.format)}</span>
        </div>
        <h3 class="spotlight__title">${esc(featured.title)} <span class="muted">${esc(featured.subtitle)}</span></h3>
        <p class="lead spotlight__desc">${esc(featured.short)}</p>
        <div class="spotlight__row">
          <a class="btn btn--primary" href="project-${featured.slug}.html">View the series ${ICON.arrow}</a>
          <a class="btn btn--ghost" href="https://www.youtube.com/watch?v=${featured.youtubeId}" target="_blank" rel="noopener">Watch the teaser ${ICON.ext}</a>
        </div>
        <div class="spotlight__eps">
          ${featured.episodes
            .map(
              (e) =>
                `<a class="spotlight__ep" href="https://www.youtube.com/watch?v=${e.youtubeId}" target="_blank" rel="noopener">${esc(e.title)} <span>${esc(e.date)}</span></a>`
            )
            .join('\n          ')}
        </div>
      </div>
    </article>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="section-head section-head--split reveal">
      <p class="eyebrow">Selected work</p>
      <h2>Across every format.</h2>
      <a class="tlink" href="work.html">View all ${ICON.arrow}</a>
    </div>
    <div class="grid grid--3">
      ${selected.map((p, i) => projectCard(p, i)).join('\n      ')}
    </div>
  </div>
</section>

${statsBand()}

<section class="section">
  <div class="wrap">
    <div class="section-head section-head--split reveal">
      <p class="eyebrow">Books &amp; prose</p>
      <h2>It starts on the page.</h2>
      <a class="tlink" href="books.html">All ten titles ${ICON.arrow}</a>
    </div>
    <p class="lead reveal" style="max-width:44rem;margin-bottom:2.5rem">Ten published titles by co-founder Thomas Muller — horror, thrillers, and short fiction. Several are already in development as screen work.</p>
    <div class="book-grid">
      ${books.map((b, i) => bookCard(b, i)).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--edge">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">Our method</p>
      <h2>Human direction. New tools.</h2>
      <p class="lead">Pindrop builds the story first and chooses tools second. Some projects use AI-assisted production under direct human direction; others are written entirely by hand. The writers, directors, and editors keep every final decision.</p>
    </div>
    <div class="steps mt-md">
      ${PIPELINE.map(
        (s, i) =>
          `<div class="step reveal" style="--i:${i}"><span class="step__n">${esc(s.n)}</span><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div>`
      ).join('\n      ')}
    </div>
    <p class="mt-lg disclosure">${esc(AI_DISCLOSURE)}</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head section-head--split reveal">
      <p class="eyebrow">The founders</p>
      <h2>Made by two storytellers.</h2>
      <a class="tlink" href="studio.html">About the studio ${ICON.arrow}</a>
    </div>
    <div class="grid grid--2">
      ${FOUNDERS.map(
        (f) => `<article class="founder founder--compact reveal">
        <div class="founder__mark">${f.photo ? picture(f.photo, esc(f.name), { loading: 'lazy' }) : `<span>${esc(f.initials)}</span>`}</div>
        <div>
          <h3 class="founder__name">${esc(f.name)}</h3>
          <p class="founder__role">${esc(f.role)}</p>
          <p class="founder__body">${esc(f.short)}</p>
          <div class="founder__links">
            ${f.links.map((l) => `<a class="tlink" href="${l.url}" target="_blank" rel="noopener">${esc(l.label)} ${ICON.ext}</a>`).join('\n            ')}
          </div>
        </div>
      </article>`
      ).join('\n      ')}
    </div>
  </div>
</section>

${ctaBlock()}`;

  return page({
    jsonLd: [
      orgLd(),
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: `${SITE.url}/`,
        name: SITE.name,
        description: SITE.description,
        inLanguage: 'en',
        publisher: { '@id': ORG_ID },
      },
    ],
    title: `${SITE.name} — Independent film, books, and audio`,
    description: SITE.description,
    page: 'index.html',
    body,
  });
}

function workPage() {
  const counts = CATEGORIES.map((c) => ({
    ...c,
    n: c.id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.category === c.id).length,
  }));

  const body = `
<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Selected work</p>
    <h1 class="pagehead__title">Film, video, audio, and experiments.</h1>
    <p class="lead pagehead__lead">Everything Pindrop has released publicly, from the flagship series to the fast experiments. Books and prose have their own home — <a href="books.html">browse the catalog</a>.</p>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="filters" data-filters>
      ${counts
        .map(
          (c) =>
            `<button class="filter" type="button" data-filter="${c.id}" aria-pressed="${c.id === 'all'}">${esc(c.label)} <b>${c.n}</b></button>`
        )
        .join('\n      ')}
    </div>
    <p class="filter-count" data-filter-count>${PROJECTS.length} projects</p>
    <h2 class="sr-only">All projects</h2>
    <div class="grid grid--3">
      ${PROJECTS.map((p, i) => projectCard(p, i % 3)).join('\n      ')}
    </div>
  </div>
</section>

${ctaBlock()}`;

  return page({
    jsonLd: [
      breadcrumbLd([
        { name: 'Home', file: 'index.html' },
        { name: 'Work', file: 'work.html' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Work — ${SITE.name}`,
        url: canonicalFor('work.html'),
        isPartOf: { '@id': `${SITE.url}/#website` },
        about: { '@id': ORG_ID },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: PROJECTS.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: canonicalFor(`project-${p.slug}.html`),
            name: `${p.title}${p.subtitle ? ` ${p.subtitle}` : ''}`,
          })),
        },
      },
    ],
    title: `Work — ${SITE.name}`,
    description:
      'Films, series, audio, and experiments from Pindrop Entertainment — including UNWANTED, The Prophecy of Nightmares, and Pindrop Perspectives.',
    page: 'work.html',
    body,
  });
}

function projectPage(p) {
  const related = PROJECTS.filter((x) => x.slug !== p.slug).slice(0, 3);
  const book = p.relatedBook ? BOOKS.find((b) => b.slug === p.relatedBook) : null;

  // Two people sharing one credit read as one row, not two.
  const creditRows = [];
  for (const c of p.credits) {
    const existing = creditRows.find((r) => r.role === c.role);
    if (existing) existing.names.push(c.name);
    else creditRows.push({ role: c.role, names: [c.name] });
  }

  const body = `
<section class="detail-hero">
  ${
    // Square logo artwork would be cropped by a wide hero, so it appears as its
    // own block in the aside instead.
    p.image && p.imageFit !== 'contain'
      ? `<div class="detail-hero__media">${picture(p.image, `${p.title} — key still`, { loading: 'eager' })}</div>`
      : ''
  }
  <div class="wrap">
    <p class="eyebrow"><a href="work.html">Back to all work</a></p>
    <h1 class="detail-hero__title">${esc(p.title)}${p.subtitle ? `<span class="detail-hero__sub">${esc(p.subtitle)}</span>` : ''}</h1>
    <p class="lead" style="margin-top:1.35rem;max-width:38rem">${esc(p.short)}</p>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap detail-grid">
    <div>
      <div class="prose stack">
        ${p.synopsis.map((s) => `<p>${esc(s)}</p>`).join('\n        ')}
      </div>

      ${
        p.youtubeId
          ? `<div class="mt-lg">
        <p class="eyebrow" style="margin-bottom:1.25rem">Watch</p>
        ${videoFacade(p.youtubeId, p.title, p.image)}
      </div>`
          : ''
      }

      ${
        p.episodes
          ? `<div class="mt-lg">
        <p class="eyebrow" style="margin-bottom:1.25rem">Episodes</p>
        <ul class="timeline">
          ${p.episodes
            .map(
              (e, n) =>
                `<li><span class="yr">E${String(n + 1).padStart(2, '0')}</span><a class="ttl tlink" href="https://www.youtube.com/watch?v=${e.youtubeId}" target="_blank" rel="noopener">${esc(e.title)} ${ICON.ext}</a><span class="who">${esc(e.date)}</span></li>`
            )
            .join('\n          ')}
        </ul>
      </div>`
          : ''
      }

      ${
        book
          ? `<div class="mt-lg callout">
        <strong>Source material</strong>
        Adapted from <em>${esc(book.title)}</em> by Thomas Muller — ${esc(book.short)}
        <span style="display:block;margin-top:0.85rem"><a class="tlink" href="books.html">See the book ${ICON.arrow}</a></span>
      </div>`
          : ''
      }
    </div>

    <aside>
      ${
        p.image && p.imageFit === 'contain'
          ? `<div class="artwork">${picture(p.image, `${p.title} — cover artwork`, { loading: 'eager' })}</div>`
          : ''
      }
      <dl class="factlist">
        <div><dt>Format</dt><dd>${esc(p.formatLong ?? p.format)}</dd></div>
        ${p.year ? `<div><dt>Year</dt><dd>${esc(p.year)}</dd></div>` : ''}
        <div><dt>Status</dt><dd>${esc(p.status)}</dd></div>
        ${creditRows
          .map((c) => `<div><dt>${esc(c.role)}</dt><dd>${esc(c.names.join(' & '))}</dd></div>`)
          .join('\n        ')}
      </dl>
      <div class="linkstack">
        ${p.links
          .map(
            (l) =>
              `<a class="linkrow" href="${l.url}" target="_blank" rel="noopener"><span>${esc(l.label)}</span>${ICON.ext}</a>`
          )
          .join('\n        ')}
      </div>
      ${
        p.ai
          ? `<div class="callout" style="margin-top:1.75rem"><strong>AI disclosure</strong>${esc(p.aiNote)}</div>`
          : ''
      }
    </aside>
  </div>
</section>

<section class="section section--tight section--edge">
  <div class="wrap">
    <div class="section-head section-head--split reveal">
      <p class="eyebrow">Keep going</p>
      <h2>More from the studio.</h2>
      <a class="tlink" href="work.html">All work ${ICON.arrow}</a>
    </div>
    <div class="grid grid--3">
      ${related.map((r, i) => projectCard(r, i)).join('\n      ')}
    </div>
  </div>
</section>`;

  return page({
    jsonLd: [
      projectLd(p),
      breadcrumbLd([
        { name: 'Home', file: 'index.html' },
        { name: 'Work', file: 'work.html' },
        { name: p.title, file: `project-${p.slug}.html` },
      ]),
    ],
    title: `${p.title}${p.subtitle ? ` ${p.subtitle}` : ''} — ${SITE.name}`,
    description: p.short,
    page: 'work.html',
    body,
  });
}

const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

/** "March 2025" -> 202503, for sorting the publication timeline. */
function bookDateKey(b) {
  const [month, year] = String(b.date ?? '').split(' ');
  const m = MONTHS.indexOf(String(month).toLowerCase());
  return Number(year || b.year || 0) * 100 + (m < 0 ? 0 : m + 1);
}

function booksPage() {
  const featured = BOOKS.filter((b) => b.featured);
  const rest = BOOKS.filter((b) => !b.featured);
  const dated = BOOKS.filter((b) => b.year).sort((a, b) => bookDateKey(a) - bookDateKey(b));

  const body = `
<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Books &amp; prose</p>
    <h1 class="pagehead__title">Ten titles by Thomas Muller.</h1>
    <p class="lead pagehead__lead">Horror, thrillers, crime, and short fiction — written and published independently by the studio’s co-founder, and the source material for much of what Pindrop puts on screen.</p>
    <div class="hero__actions" style="margin-top:2rem">
      <a class="btn btn--ghost" href="https://www.amazon.com/stores/author/B082QP7SX5" target="_blank" rel="noopener">Amazon author page ${ICON.ext}</a>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">In development or on screen</p>
      <h2>Titles with a screen life.</h2>
    </div>
    <div class="feature-books${featured.length % 2 ? ' feature-books--lead' : ''}">
      ${featured
        .map(
          (b, i) => `<article class="feature-book reveal" style="--i:${i}">
        <a class="feature-book__cover" href="${b.amazon}" target="_blank" rel="noopener" aria-label="${esc(b.title)} on Amazon">
          ${bookCover(b, { eager: i === 0 })}
        </a>
        <div class="feature-book__body">
          <p class="card__meta"><span>${esc(b.genre)}</span><span>${esc(b.date)}</span></p>
          <h3 class="feature-book__title">${esc(b.title)}</h3>
          <p class="card__desc">${esc(b.long)}</p>
          <p class="feature-book__links"><a class="tlink" href="${b.amazon}" target="_blank" rel="noopener">Get the book ${ICON.ext}</a>${
            b.trailerId
              ? `<a class="tlink" href="https://www.youtube.com/watch?v=${b.trailerId}" target="_blank" rel="noopener">Watch the trailer ${ICON.ext}</a>`
              : ''
          }</p>
        </div>
      </article>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">The full catalog</p>
      <h2>Everything in print.</h2>
    </div>
    <div class="book-grid">
      ${BOOKS.map((b, i) => bookCard(b, i % 4)).join('\n      ')}
    </div>
    <p class="meta mt-lg">${rest.length + featured.length} titles · Independently published</p>
  </div>
</section>

<section class="section section--tight section--edge">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">Published, year by year</p>
      <h2>${dated.length} titles, in order.</h2>
      <p class="lead">A steady run of books rather than a burst — every title in order of release.</p>
    </div>
    <ul class="timeline reveal">
      ${dated
        .map(
          (b) =>
            `<li><span class="yr">${esc(b.year)}</span><a class="ttl tlink" href="${b.amazon}" target="_blank" rel="noopener">${esc(b.title)} ${ICON.ext}</a><span class="who">${esc(b.genre)} · ${esc(b.date.split(' ')[0])}</span></li>`
        )
        .join('\n      ')}
    </ul>
  </div>
</section>

${ctaBlock()}`;

  return page({
    jsonLd: [
      breadcrumbLd([
        { name: 'Home', file: 'index.html' },
        { name: 'Books', file: 'books.html' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Books — ${SITE.name}`,
        url: canonicalFor('books.html'),
        isPartOf: { '@id': `${SITE.url}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: BOOKS.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: bookLd(b),
          })),
        },
      },
    ],
    title: `Books — ${SITE.name}`,
    description:
      'Eight independently published titles by Thomas Muller — horror, thrillers, and short fiction from Pindrop Entertainment.',
    page: 'books.html',
    body,
  });
}

function studioPage() {
  const body = `
<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">The studio</p>
    <h1 class="pagehead__title">An independent studio built by two writers.</h1>
    <p class="lead pagehead__lead">Pindrop Entertainment is a small company in ${esc(SITE.location)} making narrative work across film, video, books, audio, and experiments — with a catalog that reaches back well before the current tools existed.</p>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap detail-grid">
    <div class="prose stack">
      <p>Pindrop began the way most independent companies do: two people who kept finishing things. Eugene Mont was making short films through the 2010s. Thomas Muller was publishing horror novels and story collections. Together they wrote screenplays — roughly twenty-five of them — and built a body of work that had nowhere obvious to go.</p>
      <p>The company is the answer to that problem. Books come out under Muller’s name. Scripts get written in partnership. Stories that earn it get produced — as trailers, shorts, series, albums, or episodes of the studio’s own podcast — and the format is chosen to fit the story rather than the other way around.</p>
      <p>Since 2025 that output has accelerated sharply, because AI-assisted production removed the gap between a finished script and a watchable scene. What did not change is who decides: every project on this site is written, directed, and cut by its credited creators.</p>
    </div>
    <aside>
      <dl class="factlist">
        <div><dt>Founded by</dt><dd>Eugene Mont &amp; Thomas Muller</dd></div>
        <div><dt>Based in</dt><dd>${esc(SITE.location)}</dd></div>
        <div><dt>Formats</dt><dd>Film &amp; video, books, audio, experiments</dd></div>
        <div><dt>Catalog</dt><dd>10 books, 300+ videos, 32 podcast episodes</dd></div>
        <div><dt>Channel</dt><dd><a class="tlink" href="https://youtube.com/@PindropMedia" target="_blank" rel="noopener">@PindropMedia ${ICON.ext}</a></dd></div>
      </dl>
    </aside>
  </div>
</section>

${statsBand()}

<section class="section">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">The founders</p>
      <h2>Two writers, one company.</h2>
    </div>
    <div class="stack-lg">
      ${FOUNDERS.map(
        (f) => `<article class="founder reveal" id="${f.slug}">
        <div class="founder__mark">${f.photo ? picture(f.photo, esc(f.name), { loading: 'lazy' }) : `<span>${esc(f.initials)}</span>`}</div>
        <div>
          <h3 class="founder__name">${esc(f.name)}</h3>
          <p class="founder__role">${esc(f.role)}</p>
          ${f.bio.map((b) => `<p class="founder__body">${esc(b)}</p>`).join('\n          ')}
          <div class="founder__links">
            ${f.links.map((l) => `<a class="tlink" href="${l.url}" target="_blank" rel="noopener">${esc(l.label)} ${ICON.ext}</a>`).join('\n            ')}
          </div>
        </div>
      </article>`
      ).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--edge">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">How the work gets made</p>
      <h2>Written first. Directed by hand.</h2>
    </div>
    <div class="steps">
      ${PIPELINE.map(
        (s, i) =>
          `<div class="step reveal" style="--i:${i}"><span class="step__n">${esc(s.n)}</span><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div>`
      ).join('\n      ')}
    </div>
    <p class="mt-lg disclosure">${esc(AI_DISCLOSURE)}</p>
  </div>
</section>

${shortsGrid()}

<section class="section section--tight">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">Filmography</p>
      <h2>The run, year by year.</h2>
      <p class="lead">The independent years in full, then the standout release from each year since. Anything with a link is on the channel.</p>
    </div>
    <ul class="timeline reveal">
      ${HERITAGE.map(
        (h) =>
          `<li><span class="yr">${esc(h.year)}</span>${
            h.youtubeId
              ? `<a class="ttl tlink" href="https://www.youtube.com/watch?v=${esc(h.youtubeId)}" target="_blank" rel="noopener">${esc(h.title)} ${ICON.ext}</a>`
              : `<span class="ttl">${esc(h.title)}</span>`
          }<span class="who">${esc(h.who)}</span></li>`
      ).join('\n      ')}
    </ul>
  </div>
</section>

${ctaBlock()}`;

  // The live-refresh script is only emitted once a key is configured.
  const liveShorts =
    LIVE_SHORTS.apiKey && SHORTS.items?.length
      ? `
<script>window.PINDROP_LIVE_SHORTS=${JSON.stringify(LIVE_SHORTS)};</script>
<script src="assets/js/live-shorts.js" defer></script>`
      : '';

  return page({
    extraScripts: liveShorts,
    jsonLd: [
      orgLd(),
      breadcrumbLd([
        { name: 'Home', file: 'index.html' },
        { name: 'Studio', file: 'studio.html' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: `Studio — ${SITE.name}`,
        url: canonicalFor('studio.html'),
        isPartOf: { '@id': `${SITE.url}/#website` },
        about: { '@id': ORG_ID },
      },
    ],
    title: `Studio — ${SITE.name}`,
    description:
      'Pindrop Entertainment is an independent studio in Rochester, New York, founded by writers Eugene Mont and Thomas Muller.',
    page: 'studio.html',
    body,
  });
}

function contactPage() {
  const channels = [
    {
      title: 'LinkedIn — company',
      body: 'The best route for collaboration, production, and business enquiries. Messages reach both founders.',
      handle: 'pindrop-entertainment',
      url: 'https://www.linkedin.com/company/pindrop-entertainment',
    },
    {
      title: 'Eugene Mont',
      body: 'Co-founder. Directing, production, and AI-assisted workflow questions.',
      handle: 'linkedin.com/in/eugenemont',
      url: 'https://linkedin.com/in/eugenemont',
    },
    {
      title: 'Thomas Muller',
      body: 'Co-founder. Books, adaptation rights, and story enquiries.',
      handle: 'linkedin.com/in/thomas-muller',
      url: 'https://www.linkedin.com/in/thomas-muller-98416a90/',
    },
    {
      title: 'YouTube',
      body: 'Every released film, trailer, and episode — the fastest way to see current work.',
      handle: '@PindropMedia',
      url: 'https://youtube.com/@PindropMedia',
    },
    {
      title: 'Bluesky',
      body: 'Short updates and new releases as they go out.',
      handle: 'pindropentertain',
      url: 'https://bsky.app/profile/pindropentertain.bsky.social',
    },
    {
      title: 'Amazon',
      body: 'The full book catalog, including titles available in ebook form only.',
      handle: 'Thomas Muller author page',
      url: 'https://www.amazon.com/stores/author/B082QP7SX5',
    },
  ];

  const body = `
<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Contact</p>
    <h1 class="pagehead__title">Start a conversation.</h1>
    <p class="lead pagehead__lead">Pindrop is a two-person studio, so enquiries go straight to the founders. Pick the channel that fits — collaboration and production through LinkedIn, everything else through the platform it belongs to.</p>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="channels">
      ${channels
        .map(
          (c, i) => `<a class="channel reveal" style="--i:${i}" href="${c.url}" target="_blank" rel="noopener">
        <h2>${esc(c.title)} ${ICON.ext}</h2>
        <p>${esc(c.body)}</p>
        <p class="channel__handle">${esc(c.handle)}</p>
      </a>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--tight section--continue">
  <div class="wrap">
    <div class="grid grid--2">
      <div class="callout reveal">
        <strong>Press &amp; media</strong>
        For press enquiries, screeners, or stills, reach the studio through the company LinkedIn page. Logos and key art can be supplied on request.
      </div>
      <div class="callout reveal">
        <strong>Adaptation &amp; rights</strong>
        Book and story rights sit with Thomas Muller. Screenplay enquiries — the founders have roughly twenty-five scripts between them — go to either founder directly.
      </div>
    </div>
  </div>
</section>

${ctaBlock()}`;

  return page({
    jsonLd: [
      breadcrumbLd([
        { name: 'Home', file: 'index.html' },
        { name: 'Contact', file: 'contact.html' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: `Contact — ${SITE.name}`,
        url: canonicalFor('contact.html'),
        isPartOf: { '@id': `${SITE.url}/#website` },
        about: { '@id': ORG_ID },
      },
    ],
    title: `Contact — ${SITE.name}`,
    description:
      'Reach Pindrop Entertainment — collaboration, production, adaptation rights, and press enquiries.',
    page: 'contact.html',
    body,
  });
}

function privacyPage() {
  const body = `
<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Legal</p>
    <h1 class="pagehead__title">Privacy.</h1>
    <p class="lead pagehead__lead">Short version: this site collects nothing.</p>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap wrap--narrow prose stack">
    <p>This is a static website. It sets no cookies, runs no analytics, and includes no third-party trackers. Fonts, images, and video are served from the site itself rather than from an external network.</p>
    <p><strong>Embedded video.</strong> Project pages include YouTube players that load only after you press play. Nothing is requested from YouTube until you do. Once a player loads, YouTube’s own privacy policy applies to that playback; the site uses the youtube-nocookie.com domain to limit what is stored.</p>
    <p><strong>External links.</strong> Links to YouTube, Amazon, LinkedIn, Spotify, Apple Podcasts, Bluesky, TikTok, and X leave this site. Those services collect data under their own policies.</p>
    <p><strong>Contact.</strong> Enquiries arrive through third-party platforms — principally LinkedIn — and are handled under those platforms' terms. No contact form on this site transmits or stores anything, because there isn’t one.</p>
    <p><strong>Content ownership.</strong> ${esc(AI_DISCLOSURE)}</p>
    
  </div>
</section>`;

  return page({
    title: `Privacy — ${SITE.name}`,
    description: 'Privacy notice for the Pindrop Entertainment website.',
    page: 'privacy.html',
    body,
  });
}


function notFoundPage() {
  const body = `
<section class="pagehead">
  <div class="wrap">
    <p class="eyebrow">Error 404</p>
    <h1 class="pagehead__title">This page has gone dark.</h1>
    <p class="lead pagehead__lead">The link is broken or the page has moved. Everything the studio has published is still one step away.</p>
    <div class="hero__actions" style="margin-top:2rem">
      <a class="btn btn--primary" href="index.html">Back to the home page ${ICON.arrow}</a>
      <a class="btn btn--ghost" href="work.html">See the work</a>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">Everywhere else</p>
      <h2>Try one of these.</h2>
    </div>
    <div class="channels">
      ${[{ label: 'Home', href: 'index.html', note: 'The studio, its flagship series, and the current work.' }]
        .concat(
          NAV.map((n) => ({
            label: n.label,
            href: n.href,
            note:
              n.label === 'Work'
                ? 'Every film, series, and experiment Pindrop has released.'
                : n.label === 'Books'
                  ? 'Ten published titles by Thomas Muller.'
                  : n.label === 'Studio'
                    ? 'Who Pindrop is, and how the work gets made.'
                    : 'Reach the founders.',
          }))
        )
        .map(
          (l) => `<a class="channel" href="${l.href}">
        <h2>${esc(l.label)}</h2>
        <p>${esc(l.note)}</p>
      </a>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;

  return page({
    title: `Page not found — ${SITE.name}`,
    description: 'That page could not be found. Browse the work, books, and studio pages instead.',
    page: '404.html',
    noindex: true,
    body,
  });
}

/* ------------------------------------------------------------ root files */

/** Pages that belong in the sitemap, in crawl-priority order. */
function sitemapUrls() {
  return [
    { file: 'index.html', priority: '1.0' },
    { file: 'work.html', priority: '0.9' },
    { file: 'books.html', priority: '0.9' },
    { file: 'studio.html', priority: '0.8' },
    { file: 'contact.html', priority: '0.7' },
    ...PROJECTS.map((p) => ({ file: `project-${p.slug}.html`, priority: '0.6' })),
    { file: 'privacy.html', priority: '0.2' },
  ];
}

function sitemapXml() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = sitemapUrls()
    .map(
      (u) =>
        `  <url>\n    <loc>${canonicalFor(u.file)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.w3.org/1999/sitemap.xsd/">
</urlset>`.replace(
    '<urlset xmlns="http://www.w3.org/1999/sitemap.xsd/">\n</urlset>',
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
  );
}

function robotsTxt() {
  return `# ${SITE.name}
User-agent: *
Allow: /
Disallow: /404.html

Sitemap: ${SITE.url}/sitemap.xml
`;
}

function webManifest() {
  return JSON.stringify(
    {
      name: SITE.name,
      short_name: SITE.shortName,
      description: SITE.description,
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#08080a',
      theme_color: '#08080a',
      icons: [
        { src: 'assets/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'assets/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
        {
          src: 'assets/brand/icon-512-maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    null,
    2
  );
}

/* ------------------------------------------------------------------ write */

function write(file, html) {
  fs.writeFileSync(path.join(ROOT, file), html, 'utf8');
  return file;
}

/**
 * GitHub Pages serves /404.html for any unknown path, including deep ones like
 * /foo/bar/. Relative URLs would resolve against that phantom directory and
 * break, so this one page gets root-absolute links and asset paths.
 */
function rootAbsolute(html) {
  return html
    .replace(/(href|src)="(?!https?:|\/|#|mailto:)/g, '$1="/')
    .replace(/srcset="(?!https?:|\/)/g, 'srcset="/');
}

const written = [
  write('index.html', homePage()),
  write('404.html', rootAbsolute(notFoundPage())),
  write('work.html', workPage()),
  write('books.html', booksPage()),
  write('studio.html', studioPage()),
  write('contact.html', contactPage()),
  write('privacy.html', privacyPage()),
  ...PROJECTS.map((p) => write(`project-${p.slug}.html`, projectPage(p))),
];

// Deployment + crawler files. CNAME and .nojekyll are what GitHub Pages needs
// to serve this at the apex domain without running it through Jekyll.
write('sitemap.xml', sitemapXml());
write('robots.txt', robotsTxt());
write('site.webmanifest', webManifest());
write('CNAME', `${SITE.domain}\n`);
write('.nojekyll', '');

console.log(`Built ${written.length} pages + sitemap, robots, manifest, CNAME, .nojekyll:`);
written.forEach((f) => console.log('  ' + f));
