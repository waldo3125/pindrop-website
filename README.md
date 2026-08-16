# Pindrop Entertainment — pindropentertainment.com

The production website for Pindrop Entertainment. Plain static HTML, CSS, and
JavaScript: no server, no database, no build pipeline, no dependencies. It is
built to be served by GitHub Pages at the apex domain `pindropentertainment.com`,
and it also runs straight off a hard drive with no internet connection.

---

## Deploying to GitHub Pages

Everything GitHub Pages needs is already in this folder — `CNAME`, `.nojekyll`,
`404.html`, `robots.txt`, and `sitemap.xml` are generated as part of the build.

### 1. Put the folder in a repository

```bash
cd Pindrop-Website-V3
git init
git add .
git commit -m "Pindrop Entertainment website"
git branch -M main
git remote add origin https://github.com/<your-account>/<your-repo>.git
git push -u origin main
```

The site must sit at the **repository root** — `index.html` at the top level, not
inside a subfolder.

### 2. Turn Pages on

In the repository: **Settings → Pages**

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/ (root)`
- Save

The first build takes a minute or two. The site appears at
`https://<your-account>.github.io/<your-repo>/` until the domain is attached.

### 3. Attach the domain

Still in **Settings → Pages → Custom domain**, enter:

```
pindropentertainment.com
```

Save. GitHub re-writes the `CNAME` file to match (it already contains exactly this,
so nothing changes). GitHub will show a DNS check that fails until step 4 is done and
has propagated — that is expected.

### 4. Add the DNS records at Wix

See "DNS records for Wix" below. Nothing else in Wix needs to change, and no Wix
site should be published on the domain — if one is, disconnect it first, or Wix will
keep its own records pointed at Wix servers.

### 5. Turn on HTTPS

Once the DNS check passes (usually 30 minutes to a few hours, up to 48 in the worst
case), return to **Settings → Pages** and tick **Enforce HTTPS**. GitHub issues a
free Let's Encrypt certificate automatically. Do not skip this — the canonical URLs,
sitemap, and social metadata in this site all say `https://`.

### Updating the site later

Edit content in `_source/data.mjs`, run `node _source/build.mjs`, then commit and
push. GitHub Pages redeploys on every push to `main`, usually within a minute.

---

## DNS records for Wix

Wix stays the registrar. In the Wix dashboard: **Domains → pindropentertainment.com
→ Advanced / DNS Records**, then set:

**A records for the apex domain** — host `@` (or blank, depending on how Wix labels
it), four records, all four are required:

| Type | Host | Value           | TTL     |
| ---- | ---- | --------------- | ------- |
| A    | @    | 185.199.108.153 | 1 Hour  |
| A    | @    | 185.199.109.153 | 1 Hour  |
| A    | @    | 185.199.110.153 | 1 Hour  |
| A    | @    | 185.199.111.153 | 1 Hour  |

**CNAME for www** — so `www.pindropentertainment.com` redirects to the apex:

| Type  | Host | Value                     | TTL    |
| ----- | ---- | ------------------------- | ------ |
| CNAME | www  | `<your-account>.github.io` | 1 Hour |

Note the trailing dot Wix may add automatically, and that the CNAME value is your
GitHub **account** hostname, not the repository — no repository name, no `https://`,
no path.

**Optional IPv6 (AAAA)** — add these too if Wix allows AAAA records; they let
IPv6-only networks reach the site directly:

| Type | Host | Value                  |
| ---- | ---- | ---------------------- |
| AAAA | @    | 2606:50c0:8000::153    |
| AAAA | @    | 2606:50c0:8001::153    |
| AAAA | @    | 2606:50c0:8002::153    |
| AAAA | @    | 2606:50c0:8003::153    |

**Remove or replace** any existing A / AAAA / CNAME records on `@` or `www` that
point at Wix's own servers, or the domain will keep resolving to Wix. Leave MX
records (email) and any TXT verification records alone.

---

## Opening it locally

Double-click **`index.html`** — or **`Open Pindrop Website.bat`**. The whole site
runs from the folder with no server: every page, image, font, and the brand
animation is local.

Two things need the internet, and only when asked for: the YouTube players (which
load only after you press play) and the outbound links to Amazon, LinkedIn, Spotify,
and the rest.

One difference from production: `404.html` uses root-absolute links, because GitHub
Pages serves it for any missing path at any depth. It is the only page that will not
navigate correctly when opened directly from the filesystem.

---

## What's here

| Page                    | File                                        |
| ----------------------- | ------------------------------------------- |
| Home                    | `index.html`                                |
| Work (filterable)       | `work.html`                                 |
| Project pages (9)       | `project-<slug>.html`                       |
| Books                   | `books.html`                                |
| Studio / about          | `studio.html`                               |
| Contact                 | `contact.html`                              |
| Privacy                 | `privacy.html`                              |
| Not found (production)  | `404.html`                                  |

Supporting files:

- `assets/css/site.css` — the entire design system in one stylesheet
- `assets/js/site.js` — ~150 lines: header, menu, filters, scroll reveals, video facades
- `assets/fonts/` — Fraunces and Inter, served locally (no Google Fonts request)
- `assets/brand/` — logo derivatives, icons, brand animation
- `assets/media/` — project stills and book artwork
- `_source/` — the generator that produces the HTML (see below)
- `CNAME`, `.nojekyll` — GitHub Pages: the custom domain, and "do not run Jekyll"
- `robots.txt`, `sitemap.xml`, `site.webmanifest` — crawler and install metadata

---

## What changed from V2

**Design.** A darker, warmer base with layered ambient light and a fine film grain
instead of flat black; a full-bleed brand-animation hero that starts on a visible
frame; an editorial serif (Fraunces, light weights, optical sizing) at display sizes
against Inter for interface text. Buttons lead with paper-on-ink rather than red, so
the ember accent stays rare and means something. Cards have real elevation, hover
motion, and image treatment. New moments carry the page: a recognition marquee and a
full-bleed statistics band. Every page runs on the same dark ground from header to
footer, and the footer ends on the rights line.

**Structure.** Nav is Work / Books / Studio / Contact. The projects catalog gained
per-project pages with credits, links, episode lists, and source-material callouts.

**Imagery.** Nothing on the site is a placeholder where real artwork exists. The book
grid uses the published Amazon jackets for all ten titles; the podcast uses its own
show artwork from the feed the podcast platforms serve; both founders appear as
photographs. Project cards carry the official stills. See "Where the imagery comes
from" below.

**Highlighted Shorts.** The Studio page carries a four-across wall of Shorts pulled
from the YouTube channel, refreshed by one command. See "Refreshing the Shorts grid".

**AI disclosure.** The per-project badges are gone from the artwork. The disclosure
still appears where it carries weight: in full on the home and studio method sections,
and as a per-project note on each project page.

**Content.** Everything is carried over from V2's verified research base and re-checked
against public sources. Added: the recognition strip (Runway Daily Challenge wins on
days 617/651/701/751, Gen:48, Global AI Film Hack, Big Pitch), the statistics band, the
UNWANTED episode list, the page-to-screen pipeline, a studio filmography, and a
publication timeline for the books.

**Two timelines.** The Studio page lists the independent years in full through 2017,
then the standout release from each year since — picked on lifetime views, which are
recorded in the comment above `HERITAGE` in `data.mjs` so the choices can be re-checked.
The Books page lists all ten titles in publication order, which is where the years
without a film release (2018–2020, 2022) show up.

**Contact.** V2's form was a mock that transmitted nothing. It is replaced with real
routes: the company LinkedIn page, both founders, YouTube, Bluesky, and Amazon. No
email address is published anywhere — see below to add one.

**Practical.** No trackers, no cookies, no external requests on load. Reveals and the
marquee stop under `prefers-reduced-motion`. Content is fully visible with JavaScript
switched off.

---

## Where the imagery comes from

Every image ships inside `assets/` — the site makes no external image requests.

| Asset | Source | Fetched |
| ----- | ------ | ------- |
| 10 book covers (`assets/media/books/`) | The published cover on each title's own Amazon product page. Where editions differ, the strongest jacket was chosen per title: hardcover for The Kelleher; Kindle for Indestructible, Nothing To Fear, and The Prophecy of Nightmares; paperback for Honor Among Thieves | 14–16 Aug 2026 |
| Shorts thumbnails (`assets/media/shorts/`) | The channel's Shorts tab, letterboxing trimmed | 16 Aug 2026 |
| Podcast artwork (`assets/media/projects/pindrop-perspectives.*`) | The show's own feed artwork — the same graphic Spotify, Apple, iHeart, and Amazon Music serve | 14 Aug 2026 |
| Eugene Mont (`assets/media/team/eugene-mont.*`) | The Black List profile photo | 14 Aug 2026 |
| Thomas Muller (`assets/media/team/thomas-muller.*`) | Amazon author-profile photo | 14 Aug 2026 |
| Project stills (`assets/media/projects/`) | Official YouTube stills, carried over from V2 | Aug 2026 |

**On Eugene's photo:** LinkedIn blocks automated access to profile pages outright
(HTTP 999), so the photo could not be taken from there. The Black List profile photo
is used instead — the same kind of first-party professional profile. To swap in the
LinkedIn one, save it as `assets/media/team/eugene-mont.jpg` (a matching `.webp` is
optional; the page falls back to the `.jpg`) at roughly 400×400.

Portraits render in grayscale and warm slightly on hover — a CSS treatment, so
replacing the source file is all that is ever needed.

---

## Refreshing the Shorts grid

```bash
node _source/refresh-shorts.mjs
```

That pulls the newest Shorts from `youtube.com/@PindropMedia/shorts`, downloads their
thumbnails into `assets/media/shorts/`, writes `_source/shorts.json`, and rebuilds the
pages. Pass a number to change how many appear — `node _source/refresh-shorts.mjs 12`.
The default is 8, which fills two rows of four.

**Why it is a command and not live JavaScript.** A page opened from the filesystem has
a null origin and YouTube sends no CORS headers, so the browser refuses to let the page
read the channel itself. No API key or setting changes that for a local file. Running
the command is the equivalent — it re-pulls from the live channel in about ten seconds,
and the result then works offline forever.

### Making it live once the site is hosted

Hosting does not by itself make the grid live: scraping `youtube.com` from a browser is
blocked by CORS from **any** origin, not just from a local file. What hosting unlocks is
the official **YouTube Data API v3**, which does send CORS headers and so can be called
straight from the page. The wiring for that already ships here, switched off:

1. Create a YouTube Data API v3 key in Google Cloud and restrict it to the site's
   domain (HTTP referrer restriction — the key is visible in the page, so the
   restriction is what protects it).
2. Put it in `LIVE_SHORTS` in `_source/data.mjs` and rebuild.

`playlistId` defaults to the channel's uploads playlist. Point it at a public "Shorts"
playlist instead and the grid shows exactly what's in that playlist, newest first —
which is the easiest way to curate it without touching the site again.

With a key set, `assets/js/live-shorts.js` refetches the grid on every page load. It
only runs over http/https, and any failure — no key, quota spent, offline, API change —
leaves the pre-built grid in place, so the section can never render empty. The free
quota (10,000 units/day, 1 unit per call) is far more than a site this size will use.

**This path is untested here** — it needs a real API key, which I don't have. The code
is written to the documented API and fails safe, but do check it once after switching
it on.

### The other options, and TikTok

- **Rebuild on a schedule.** If the host runs builds (Netlify, Vercel, Cloudflare
  Pages, GitHub Actions), a daily cron that runs `node _source/refresh-shorts.mjs` and
  redeploys keeps the grid current with no API key and no client-side JavaScript. This
  is the most robust option and keeps the styling exactly as designed.
- **YouTube's own embed.** `youtube.com/embed/videoseries?list=UUR7T3wo9zZJxUvRJiPjfE_Q`
  is an iframe that always shows the newest uploads, no key required — but it is
  YouTube's player chrome, not this site's grid.
- **TikTok.** Worse than YouTube for this, unfortunately. TikTok has no public,
  key-free way to list a creator's videos: the Display API requires OAuth plus app
  review, and the oEmbed endpoint only resolves one known video URL at a time. The one
  genuinely dynamic, no-key option is TikTok's profile embed iframe
  (`tiktok.com/embed/@handle`), which self-updates but again brings TikTok's own styling
  rather than this grid. Worth noting too: the TikTok handle on this site
  (`@pindrop.entertain`) was never verified first-party during research — that would
  need confirming before building anything on top of it.

**Choosing what appears.** The grid takes the most recent Shorts, so the sports and
commentary Shorts on the channel show up alongside the narrative ones. To keep any of
them off, add its video id to the `exclude` array in `_source/shorts.json` and run the
command again:

```json
"exclude": ["_gi4FhfjY2g", "cAojycfozJs"],
```

You can also reorder or delete entries in `items` directly and just run
`node _source/build.mjs` — the grid renders whatever that array holds.

**A note on thumbnails.** Some Shorts are 16:9 films posted vertically, so YouTube's
thumbnail has black bars baked in. When `sharp` is installed the script trims them
automatically (that's how the current set was made). Without it the script still works
— those thumbnails just keep their bars.

---

## Editing content

All copy and data live in **`_source/data.mjs`** — projects, books, founders, stats,
recognition strip, navigation, and the AI disclosure. Edit that file, then regenerate
the pages:

```bash
node _source/build.mjs
```

That rewrites the 15 `.html` files at the root. It needs Node.js (already installed on
this machine) and takes under a second. **You never need to run it just to view the
site** — the finished HTML is already here.

If you'd rather not run anything, you can also edit the `.html` files directly; just
be aware a later rebuild would overwrite those edits.

### To publish an email address

Set `email` in `SITE` at the top of `_source/data.mjs` and add a channel for it in the
`contactPage()` function in `_source/build.mjs`, then rebuild.

### No dates that go stale

Nothing on the site is stamped with a date that would need manual updating. The only
date shown anywhere is the footer copyright year, and that is written by JavaScript
from the visitor's own clock, so it rolls over on its own.

That is also why the statistics band carries no "as of" line. The figures are written
as open-ended (`9.9K+`, `300+`, `650K+`) so they stay true as they grow — they only
need attention if you want them to read higher. `10` books and `32` podcast episodes
are exact, so update `STATS` in `data.mjs` when either changes.

The publication-date columns on the Books timeline are release dates — facts about the
books, not statements about how fresh the site is — so they stay.

---

## Known open items (carried over from V2's research)

- **X handle.** Two accounts exist (`@PindropENT` and `@Pindrop_Ent`); the site links
  the first. Confirm which is canonical.
- **TikTok.** Linked but never verified first-party during research.
- **Podcast cadence.** No episodes since September 2025, so the site says "Season 1 ·
  32 episodes" rather than claiming a weekly release.
- **Founder photos.** Both are pulled from public professional profiles (see above).
  Replace either file with a preferred headshot at any time.

---

## Hosting elsewhere

Deployment steps for GitHub Pages are at the top of this file. The same folder
deploys unchanged to Netlify, Vercel, Cloudflare Pages, or any static host — upload
it as-is, with the publish directory set to the repository root.

If the domain ever changes, edit `url` and `domain` in `SITE` (`_source/data.mjs`)
and rebuild. That one change updates every canonical tag, Open Graph URL, the
sitemap, `robots.txt`, and `CNAME` together.
