/* =============================================================================
   Optional live refresh for the Highlighted Shorts grid.
   =============================================================================
   OFF by default. The grid ships pre-built, so the page works offline and from
   the filesystem with no network at all. This script only does anything when:

     1. the site is served over http(s) — never from a local file, where the
        browser blocks cross-origin reads outright; and
     2. a YouTube Data API key has been configured (see README).

   When both hold, it asks the YouTube Data API for the newest items in a
   playlist and rewrites the grid in place. Any failure — no key, quota spent,
   offline, API shape changed — leaves the pre-built grid exactly as it is, so
   the page never ends up empty.
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.PINDROP_LIVE_SHORTS;
  var grid = document.querySelector('[data-shorts]');

  if (!cfg || !cfg.apiKey || !grid) return;
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;

  var max = cfg.max || 8;
  var url =
    'https://www.googleapis.com/youtube/v3/playlistItems' +
    '?part=snippet&maxResults=' +
    encodeURIComponent(max) +
    '&playlistId=' +
    encodeURIComponent(cfg.playlistId) +
    '&key=' +
    encodeURIComponent(cfg.apiKey);

  fetch(url)
    .then(function (res) {
      if (!res.ok) throw new Error('YouTube API returned ' + res.status);
      return res.json();
    })
    .then(function (data) {
      var items = (data.items || [])
        .map(function (item) {
          var snip = item.snippet || {};
          var id = snip.resourceId && snip.resourceId.videoId;
          return id && snip.title ? { id: id, title: snip.title } : null;
        })
        .filter(Boolean)
        .slice(0, max);

      if (!items.length) return; // Nothing usable — keep what is on the page.

      var html = items
        .map(function (s) {
          // oardefault is YouTube's original-aspect frame: vertical for Shorts.
          return (
            '<a class="short" href="https://www.youtube.com/shorts/' +
            s.id +
            '" target="_blank" rel="noopener">' +
            '<span class="short__media">' +
            '<img src="https://i.ytimg.com/vi/' +
            s.id +
            '/oardefault.jpg" alt="" loading="lazy" decoding="async">' +
            '<span class="short__play"><svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M8 5.5v13l11-6.5z"></path></svg></span>' +
            '</span>' +
            '<span class="short__title"></span>' +
            '</a>'
          );
        })
        .join('');

      grid.innerHTML = html;

      // Titles are set as text, never as markup, so channel copy cannot inject.
      grid.querySelectorAll('.short__title').forEach(function (el, i) {
        el.textContent = items[i].title;
      });
    })
    .catch(function () {
      /* Pre-built grid stays. */
    });
})();
