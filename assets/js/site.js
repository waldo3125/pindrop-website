/* =============================================================================
   Pindrop Entertainment — V3 behaviour
   No dependencies, no build step. Every feature degrades to working HTML.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Header: solid glass once scrolled off the hero ------------------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Mobile menu ------------------------------------------------------ */
  var menu = document.querySelector('[data-menu]');
  var menuBtn = document.querySelector('[data-menu-btn]');
  if (menu && menuBtn) {
    var setMenu = function (open) {
      menu.setAttribute('data-open', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        var first = menu.querySelector('a');
        if (first) first.focus();
      }
    };
    menuBtn.addEventListener('click', function () {
      setMenu(menu.getAttribute('data-open') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.getAttribute('data-open') === 'true') {
        setMenu(false);
        menuBtn.focus();
      }
    });
  }

  /* --- Reveal on scroll -------------------------------------------------- */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) {
        el.classList.add('is-in');
      });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in');
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
      );
      revealables.forEach(function (el) {
        io.observe(el);
      });
      // Safety net: anything still hidden after load (e.g. already in view on a
      // restored scroll position) is shown outright.
      window.addEventListener('load', function () {
        setTimeout(function () {
          revealables.forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
          });
        }, 60);
      });
    }
  }

  /* --- Hero video: play when it can, fall back to the poster ------------- */
  var heroVideo = document.querySelector('[data-hero-video]');
  if (heroVideo) {
    var narrow = window.matchMedia('(max-width: 47.99em)').matches;
    // The brand animation opens on a near-black frame; start a few seconds in so
    // the hero has something on screen immediately.
    var START_AT = 5.5;
    heroVideo.addEventListener('loadedmetadata', function () {
      if (heroVideo.duration > START_AT + 2) {
        try {
          heroVideo.currentTime = START_AT;
        } catch (e) {
          /* Seeking can fail before enough data arrives; the poster covers it. */
        }
      }
    });
    if (reduced || narrow) {
      heroVideo.removeAttribute('autoplay');
      heroVideo.pause();
    } else {
      var play = heroVideo.play();
      if (play && typeof play.catch === 'function') {
        play.catch(function () {
          /* Poster frame stays visible; nothing else to do. */
        });
      }
    }
  }

  /* --- Work filters ------------------------------------------------------ */
  var filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-category]'));
    var countEl = document.querySelector('[data-filter-count]');
    var apply = function (id) {
      var shown = 0;
      cards.forEach(function (card) {
        var match = id === 'all' || card.getAttribute('data-category') === id;
        card.hidden = !match;
        if (match) shown++;
      });
      filterBar.querySelectorAll('[data-filter]').forEach(function (btn) {
        btn.setAttribute('aria-pressed', btn.getAttribute('data-filter') === id ? 'true' : 'false');
      });
      if (countEl) {
        countEl.textContent = shown + (shown === 1 ? ' project' : ' projects');
      }
      try {
        // Opaque file:// origins reject some replaceState calls; the filter
        // still works, it just does not update the address bar.
        history.replaceState(null, '', id === 'all' ? location.pathname : '#' + id);
      } catch (e) {
        /* no-op */
      }
    };
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (btn) apply(btn.getAttribute('data-filter'));
    });
    var hash = (location.hash || '').replace('#', '');
    if (hash && filterBar.querySelector('[data-filter="' + hash + '"]')) apply(hash);
  }

  /* --- Click-to-load video facades -------------------------------------- */
  document.querySelectorAll('[data-video]').forEach(function (facade) {
    var btn = facade.querySelector('[data-video-btn]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var id = facade.getAttribute('data-video');
      var title = facade.getAttribute('data-video-title') || 'Video player';
      var frame = document.createElement('iframe');
      frame.setAttribute('title', title);
      frame.setAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      );
      frame.setAttribute('allowfullscreen', '');
      frame.setAttribute('loading', 'lazy');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      facade.innerHTML = '';
      facade.appendChild(frame);
    });
  });

  /* --- Current year in the footer ---------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
