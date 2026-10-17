/* Chiao's Anthill — shared script */
(function () {
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Language ---------- */
  function applyLang(lang) {
    root.dataset.lang = lang;
    root.lang = lang === 'en' ? 'en' : 'zh-Hant';
    const t = root.dataset['title' + (lang === 'en' ? 'En' : 'Zh')];
    if (t) document.title = t;
    document.querySelectorAll('[data-ph-zh]').forEach(el => {
      el.placeholder = lang === 'en' ? el.dataset.phEn : el.dataset.phZh;
    });
    document.querySelectorAll('[data-text-zh]').forEach(el => {
      el.textContent = lang === 'en' ? el.dataset.textEn : el.dataset.textZh;
    });
    document.querySelectorAll('[data-aria-zh]').forEach(el => {
      el.setAttribute('aria-label', lang === 'en' ? el.dataset.ariaEn : el.dataset.ariaZh);
    });
    const toggle = document.querySelector('.lang-toggle');
    if (toggle) toggle.setAttribute('aria-label', lang === 'en' ? '切換成中文' : 'Switch to English');
  }
  applyLang(store.get('lang') === 'en' ? 'en' : 'zh');

  document.querySelector('.lang-toggle')?.addEventListener('click', () => {
    const next = root.dataset.lang === 'en' ? 'zh' : 'en';
    store.set('lang', next);
    applyLang(next);
  });

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.querySelector('.menu-btn');
  const links = document.getElementById('nav-links');
  if (menuBtn && links) {
    const close = () => { links.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); };
    menuBtn.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && links.classList.contains('is-open')) { close(); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 761px)').addEventListener('change', close);
  }

  /* ---------- Anteater slurp ---------- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-slurp]').forEach(stage => {
    const play = () => {
      if (reduce) return;
      stage.classList.remove('is-slurping');
      void stage.offsetWidth; // restart animation
      stage.classList.add('is-slurping');
    };
    if (stage.dataset.slurp === 'auto') setTimeout(play, 600);
    stage.querySelector('.mascot-btn')?.addEventListener('click', play);
  });

  /* ---------- Toast ---------- */
  const toast = document.querySelector('.toast');
  let toastTimer;
  function showToast(zh, en) {
    if (!toast) return;
    toast.textContent = root.dataset.lang === 'en' ? en : zh;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2200);
  }

  /* ---------- Copy email ---------- */
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        showToast('已複製 Email', 'Email copied');
      } catch (e) {
        showToast('無法自動複製，請手動選取 Email', 'Couldn’t copy automatically. Select the email to copy it.');
      }
    });
  });

  /* ---------- Writing filters ---------- */
  const filters = document.querySelectorAll('.filter[data-filter]');
  filters.forEach(f => {
    f.addEventListener('click', () => {
      const cat = f.dataset.filter;
      filters.forEach(x => x.setAttribute('aria-pressed', String(x === f)));
      let shown = 0;
      document.querySelectorAll('.archive li[data-cat]').forEach(li => {
        const match = cat === 'all' || li.dataset.cat === cat;
        li.hidden = !match;
        if (match) shown++;
      });
      const empty = document.querySelector('.archive-empty');
      if (empty) empty.hidden = shown > 0;
    });
  });

  /* ---------- Contact form → mailto ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let firstBad = null;
      form.querySelectorAll('[required]').forEach(input => {
        const field = input.closest('.field');
        const bad = !input.value.trim() || (input.type === 'email' && !input.checkValidity());
        field.classList.toggle('has-error', bad);
        input.setAttribute('aria-invalid', String(bad));
        if (bad && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }

      const name = form.name.value.trim();
      const topic = form.topic.options[form.topic.selectedIndex].text;
      const body = form.message.value.trim() + '\n\n— ' + name + (form.email.value ? ' <' + form.email.value.trim() + '>' : '');
      const subject = '[Anthill] ' + topic + ' — ' + name;
      window.location.href = 'mailto:' + form.dataset.to +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      showToast('已開啟你的郵件程式', 'Opened your mail app');
    });
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => input.closest('.field')?.classList.remove('has-error'));
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
