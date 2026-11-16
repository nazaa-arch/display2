(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ===== Proteksi: nonaktifkan klik kanan, inspect, view-source, save ===== */
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = (e.key || '').toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey;
    if (
      k === 'f12' ||
      (ctrl && e.shiftKey && ['i', 'j', 'c', 'k'].includes(k)) ||
      (e.metaKey && e.altKey && ['i', 'j', 'c', 'u'].includes(k)) ||
      (ctrl && ['u', 's', 'p'].includes(k))
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);
  document.addEventListener('copy', e => {
    if (!/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) e.preventDefault();
  });

  /* ===== Header & navigasi ===== */
  const header = $('#header'), toTop = $('#toTop');
  const onScroll = () => {
    header.classList.toggle('scrolled', scrollY > 10);
    toTop.classList.toggle('show', scrollY > 700);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', () => { burger.classList.toggle('open'); nav.classList.toggle('open'); });
  $$('#nav a').forEach(a => a.addEventListener('click', () => { burger.classList.remove('open'); nav.classList.remove('open'); }));

  const links = $$('.nav a:not(.nav-cta)');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  /* ===== Reveal on scroll ===== */
  const rev = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); rev.unobserve(en.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => rev.observe(el));

  /* ===== Counter ===== */
  const cnt = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 1600;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString('id-ID') + (p === 1 ? suf : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step); cnt.unobserve(el);
  }), { threshold: .5 });
  $$('[data-count]').forEach(el => cnt.observe(el));

  /* ===== Tabs profil ===== */
  $$('.tab').forEach(t => t.addEventListener('click', () => {
    $$('.tab').forEach(x => x.classList.remove('active'));
    $$('.tab-panel').forEach(x => x.classList.remove('active'));
    t.classList.add('active'); $('#tab-' + t.dataset.tab).classList.add('active');
  }));

  /* ===== Filter ekskul ===== */
  $$('#filters .chip').forEach(c => c.addEventListener('click', () => {
    $$('#filters .chip').forEach(x => x.classList.remove('active')); c.classList.add('active');
    const f = c.dataset.f;
    $$('#ekskulGrid .ek').forEach(e => e.classList.toggle('hide', f !== 'all' && e.dataset.c !== f));
  }));

  /* ===== Testimoni slider ===== */
  const track = $('.testi-track'), slides = $$('.tq'), dots = $('#testiDots');
  let idx = 0;
  slides.forEach((_, i) => {
    const b = document.createElement('button'); b.setAttribute('aria-label', 'Testimoni ' + (i + 1));
    b.addEventListener('click', () => go(i)); dots.appendChild(b);
  });
  const go = i => {
    idx = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    $$('button', dots).forEach((d, j) => d.classList.toggle('active', j === idx));
  };
  go(0); setInterval(() => go(idx + 1), 6000);

  /* ===== Toast & form ===== */
  const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 3200); };
  $('#spmbForm').addEventListener('submit', e => {
    e.preventDefault(); e.target.reset();
    toast('✅ Terima kasih! Panitia SPMB akan menghubungi Anda via WhatsApp.');
  });
  $$('a[href="#"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); toast('Fitur ini akan tersedia di versi final.'); }));
  $$('.gallery figure').forEach(f => f.addEventListener('click', () => toast('📷 ' + $('figcaption', f).textContent)));
})();
