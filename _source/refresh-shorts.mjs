/**
 * Refreshes the "Highlighted Shorts" grid from the Pindrop YouTube channel.
 *
 *   node _source/refresh-shorts.mjs          # pull the 8 most recent Shorts
 *   node _source/refresh-shorts.mjs 12       # pull 12 instead
 *
 * WHY THIS IS A SCRIPT AND NOT LIVE JAVASCRIPT
 * A page opened straight from the filesystem has an opaque (null) origin, and
 * YouTube sends no CORS headers, so the browser blocks any attempt to read the
 * channel from the page itself — there is no API key or proxy that changes this
 * for a local file. So the pull happens here instead: run this one command and
 * the grid, thumbnails, and pages are all refreshed from the live channel.
 *
 * Dependencies: none. Plain Node (18+). If `sharp` happens to be installed the
 * thumbnails are re-encoded smaller; otherwise they are saved as delivered.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const THUMBS = path.join(ROOT, 'assets/media/shorts');
const OUT = path.join(HERE, 'shorts.json');

const HANDLE = '@PindropMedia';
const COUNT = Number(process.argv[2]) || 8;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

/** Pulls every Short on the channel's Shorts tab, newest first. */
async function fetchShorts() {
  const res = await fetch(`https://www.youtube.com/${HANDLE}/shorts`, {
    headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9' },
  });
  if (!res.ok) throw new Error(`YouTube returned ${res.status}`);
  const html = await res.text();

  const match = html.match(/var ytInitialData = (\{.+?\});<\/script>/s);
  if (!match) throw new Error('Could not find ytInitialData — YouTube changed its markup.');
  const data = JSON.parse(match[1]);

  const found = [];
  const seen = new Set();
  (function walk(node) {
    if (!node || typeof node !== 'object') return;
    const s = node.shortsLockupViewModel;
    if (s) {
      const id = s.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId ?? s.entityId;
      const title = s.overlayMetadata?.primaryText?.content ?? '';
      const views = s.overlayMetadata?.secondaryText?.content ?? '';
      if (id && !seen.has(id)) {
        seen.add(id);
        found.push({ id, title, views });
      }
    }
    for (const key of Object.keys(node)) walk(node[key]);
  })(data);

  return found;
}

/** Saves the vertical (9:16) thumbnail, shrinking it when sharp is available. */
async function saveThumb(id) {
  const file = path.join(THUMBS, `${id}.jpg`);
  const res = await fetch(`https://i.ytimg.com/vi/${id}/oardefault.jpg`, {
    headers: { 'user-agent': UA },
  });
  if (!res.ok) throw new Error(`thumbnail ${id}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());

  try {
    const { default: sharp } = await import('sharp');
    // Some Shorts are 16:9 films posted vertically, so YouTube's thumbnail has
    // black bars baked in. Trimming them lets the card frame crop the picture
    // itself rather than the padding.
    let base = sharp(buf).trim({ threshold: 8 });
    try {
      await base.clone().toBuffer();
    } catch {
      base = sharp(buf); // Trim found no border; use the frame as delivered.
    }
    const img = base.resize({ width: 540, withoutEnlargement: true });
    await img.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(file);
    await img
      .clone()
      .webp({ quality: 80 })
      .toFile(file.replace(/\.jpg$/, '.webp'));
  } catch {
    // sharp is not installed: keep YouTube's frame exactly as delivered. The
    // grid still works; letterboxed Shorts just keep their bars.
    fs.writeFileSync(file, buf);
  }
  return `assets/media/shorts/${id}.jpg`;
}

async function main() {
  fs.mkdirSync(THUMBS, { recursive: true });

  // Titles listed here are skipped — use it to keep something off the grid.
  const previous = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  const exclude = new Set(previous.exclude ?? []);

  console.log(`Fetching Shorts from youtube.com/${HANDLE} …`);
  const all = await fetchShorts();
  console.log(`  ${all.length} Shorts on the channel`);

  const picked = all.filter((s) => !exclude.has(s.id)).slice(0, COUNT);
  const items = [];
  for (const s of picked) {
    const thumb = await saveThumb(s.id);
    items.push({ ...s, thumb });
    console.log(`  + ${s.id}  ${s.views.padStart(10)}  ${s.title.slice(0, 58)}`);
  }

  // Thumbnails for Shorts that are no longer listed are removed.
  const keep = new Set(items.map((i) => `${i.id}.jpg`).concat(items.map((i) => `${i.id}.webp`)));
  for (const f of fs.readdirSync(THUMBS)) {
    if (!keep.has(f)) fs.unlinkSync(path.join(THUMBS, f));
  }

  fs.writeFileSync(
    OUT,
    JSON.stringify(
      {
        channel: HANDLE,
        channelUrl: `https://youtube.com/${HANDLE}`,
        fetched: new Date().toISOString().slice(0, 10),
        totalOnChannel: all.length,
        exclude: [...exclude],
        items,
      },
      null,
      2
    ) + '\n'
  );
  console.log(`\nWrote ${path.relative(ROOT, OUT)} (${items.length} shorts).`);

  // Regenerate the pages so the grid is live immediately.
  await import('./build.mjs');
}

main().catch((e) => {
  console.error('\nCould not refresh Shorts:', e.message);
  console.error('The site still builds — the previous grid stays in place.');
  process.exit(1);
});
