(function () {
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (_) { return null; } }

  // Animações só quando o usuário não pediu movimento reduzido
  if (!reduce && hasIO) {
    root.classList.add('motion');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    d.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  // Parallax sutil no hero (mouse no desktop, giro do celular no mobile)
  var art = d.querySelector('[data-parallax]');
  if (art && !reduce) {
    var raf = 0;
    var set = function (x, y) {
      if (raf) return;
      raf = requestAnimationFrame(function () { art.style.setProperty('--px', x.toFixed(3)); art.style.setProperty('--py', y.toFixed(3)); raf = 0; });
    };
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('mousemove', function (e) { set(e.clientX / innerWidth - .5, e.clientY / innerHeight - .5); }, { passive: true });
    } else {
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma == null) return;
        set(Math.max(-1, Math.min(1, e.gamma / 30)) * .5, Math.max(-1, Math.min(1, (e.beta - 45) / 30)) * .5);
      }, { passive: true });
    }
  }

  // UTM: repassa utm_*, gclid e fbclid da página para todos os links do app
  try {
    var incoming = new URLSearchParams(location.search), keep = [];
    incoming.forEach(function (v, k) { if (/^utm_/.test(k) || k === 'gclid' || k === 'fbclid') keep.push([k, v]); });
    if (keep.length) d.querySelectorAll('a[data-app]').forEach(function (a) {
      var u = new URL(a.href);
      keep.forEach(function (p) { u.searchParams.set(p[0], p[1]); });
      a.href = u.toString();
    });
  } catch (_) {}

  // Barra fixa "Abrir o app grátis" no celular: aparece depois do hero, some no fim da página
  var bar = d.querySelector('[data-sticky]'), hero = d.querySelector('.hero'), foot = d.querySelector('.site-footer'), fin = d.querySelector('.final');
  var cookieOpen = false, updBar = function () {};
  if (bar && hero && hasIO) {
    var past = false, atEnd = false, link = bar.querySelector('a');
    updBar = function () {
      var show = past && !atEnd && !cookieOpen;
      bar.classList.toggle('show', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      link.tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(function (es) { past = !es[0].isIntersecting && es[0].boundingClientRect.top < 0; updBar(); }).observe(hero);
    var vis = new Set();
    var endIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? vis.add(e.target) : vis.delete(e.target); });
      atEnd = vis.size > 0; updBar();
    });
    [fin, foot].forEach(function (el) { if (el) endIO.observe(el); });
  }

  // Medição (Meta Pixel / GA4): só carrega com ID preenchido E depois do aceite de cookies
  var cfg = window.LP_ANALYTICS || {}, hasIds = !!(cfg.metaPixelId || cfg.ga4Id);
  function loadAnalytics() {
    if (cfg.metaPixelId && !window.fbq) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, d, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', cfg.metaPixelId); fbq('track', 'PageView');
    }
    if (cfg.ga4Id && !window.gtag) {
      var s = d.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4Id); d.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date()); gtag('config', cfg.ga4Id);
    }
  }
  var banner = d.querySelector('[data-cookie]'), choice = store('lp_cookies');
  if (hasIds) {
    if (choice === 'yes') loadAnalytics();
    else if (choice !== 'no' && banner) {
      banner.hidden = false; cookieOpen = true; updBar();
      var close = function (v) { store('lp_cookies', v); banner.hidden = true; cookieOpen = false; updBar(); if (v === 'yes') loadAnalytics(); };
      banner.querySelector('[data-cookie-yes]').addEventListener('click', function () { close('yes'); });
      banner.querySelector('[data-cookie-no]').addEventListener('click', function () { close('no'); });
    }
  }

  // Evento de conversão em todo clique para o app
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-app]');
    if (!a) return;
    var pos = a.getAttribute('data-cta') || 'link';
    try { if (window.fbq) fbq('track', 'Lead', { content_name: pos }); } catch (_) {}
    try { if (window.gtag) gtag('event', 'generate_lead', { cta_position: pos, transport_type: 'beacon' }); } catch (_) {}
  });
})();
