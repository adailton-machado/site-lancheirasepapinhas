(function () {
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

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
      window.addEventListener('mousemove', function (e) {
        set(e.clientX / innerWidth - .5, e.clientY / innerHeight - .5);
      }, { passive: true });
    } else {
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma == null) return;
        set(Math.max(-1, Math.min(1, e.gamma / 30)) * .5, Math.max(-1, Math.min(1, (e.beta - 45) / 30)) * .5);
      }, { passive: true });
    }
  }

  // Vídeos opcionais: só entram se o arquivo existir (sem quebrar o layout)
  // O build.sh troca data-video="off" por "on" quando o arquivo existe em assets/video/
  function exists(el) { return Promise.resolve(el.getAttribute('data-video') === 'on'); }
  var hv = d.querySelector('.hero-video');
  if (hv && !reduce) {
    exists(hv).then(function (ok) {
      if (!ok) return;
      [['webm', hv.dataset.srcWebm], ['mp4', hv.dataset.srcMp4]].forEach(function (s) {
        var src = d.createElement('source'); src.src = s[1]; src.type = 'video/' + s[0]; hv.appendChild(src);
      });
      hv.addEventListener('playing', function () { hv.classList.add('ready'); });
      hv.load(); hv.play().catch(function () {});
    });
  }
  var slot = d.querySelector('[data-video-slot]');
  if (slot) {
    exists(slot).then(function (ok) {
      if (!ok) return;
      slot.innerHTML = '<video controls playsinline preload="metadata" poster="/assets/img/hero-explosao-alimentos-900.webp"><source src="/assets/video/passo-a-passo.mp4" type="video/mp4"></video>';
    });
  }

  // Barra fixa de CTA no celular: aparece depois do hero, some no rodapé
  var bar = d.querySelector('[data-sticky]'), hero = d.querySelector('.hero'), foot = d.querySelector('.site-footer'), fin = d.querySelector('.final');
  if (bar && hero && hasIO) {
    var past = false, atEnd = false, link = bar.querySelector('a');
    var upd = function () {
      var show = past && !atEnd;
      bar.classList.toggle('show', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      link.tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(function (es) { past = !es[0].isIntersecting && es[0].boundingClientRect.top < 0; upd(); }).observe(hero);
    var vis = new Set();
    var endIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? vis.add(e.target) : vis.delete(e.target); });
      atEnd = vis.size > 0; upd();
    });
    [fin, foot].forEach(function (el) { if (el) endIO.observe(el); });
  }

  // Medição: evento Lead em todo clique para o Instagram (Meta Pixel / GA4, se ativos)
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="ig.me/m/lancheirasepapinhas"]');
    if (!a) return;
    var pos = a.getAttribute('data-cta') || 'link';
    try { if (window.fbq) fbq('track', 'Lead', { content_name: pos }); } catch (_) {}
    try { if (window.gtag) gtag('event', 'generate_lead', { cta_position: pos }); } catch (_) {}
  });
})();
