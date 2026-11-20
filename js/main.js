/* Velune Health — interactions
   No dependencies. Everything degrades to a complete, static page. */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;

  /* ---------- Images: quiet fallback if a photograph can't load ---------- */
  $$('.media img').forEach((img) => {
    const media = img.closest('.media');
    const fail = () => media.classList.add('is-missing');
    const ok = () => media.classList.add('has-image');
    if (img.complete) { (img.naturalWidth > 0 ? ok : fail)(); }
    img.addEventListener('load', ok, { once: true });
    img.addEventListener('error', fail, { once: true });
  });

  /* ---------- Opening sequence, then hero entrance (plays once) ---------- */
  const ready = () => requestAnimationFrame(() => body.classList.add('page-ready'));
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  const loader = $('#loader');

  if (!loader || reduceMotion) {
    if (loader) loader.remove();
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1200))]).then(ready);
  } else {
    const root = document.documentElement;
    const bar = $('#loader-bar');
    const count = $('#loader-count');
    const status = $('#loader-status');
    const start = performance.now();
    let shown = 0;
    let complete = false;
    root.classList.add('is-loading');

    const pageLoaded = new Promise((r) => {
      if (document.readyState === 'complete') r();
      else window.addEventListener('load', r, { once: true });
    });
    const minimum = new Promise((r) => setTimeout(r, 2800));   // heartbeat, then the name
    const ceiling = new Promise((r) => setTimeout(r, 5200));   // never hold the page longer than this
    Promise.race([Promise.all([pageLoaded, fontsReady, minimum]), ceiling]).then(() => { complete = true; });

    const leave = () => {
      status.textContent = 'Welcome';
      loader.classList.add('is-exit');
      setTimeout(() => { loader.classList.add('is-reveal'); root.classList.remove('is-loading'); }, 280);
      setTimeout(ready, 880);
      setTimeout(() => loader.classList.add('is-done'), 1950);
    };

    const tick = (now) => {
      const t = (now - start) / 1000;
      const target = complete ? 100 : 86 * (1 - Math.exp(-t * 1.0));
      shown += (target - shown) * (complete ? 0.14 : 0.08);
      bar.style.transform = `scaleX(${(shown / 100).toFixed(4)})`;
      count.textContent = String(Math.min(100, Math.round(shown)));
      if (shown > 55 && status.dataset.step !== '2') { status.dataset.step = '2'; status.textContent = 'Meeting your care team'; }
      if (complete && shown > 99.4) {
        bar.style.transform = 'scaleX(1)';
        count.textContent = '100';
        setTimeout(leave, 300);
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Section reveals ---------- */
  const revealEls = $$('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach((el) => revealer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Navigation ---------- */
  const nav = $('#site-nav');
  const toggle = $('#menu-toggle');
  const menu = $('#mobile-menu');
  let lastY = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 8);
    if (!body.classList.contains('menu-open')) {
      if (y > lastY + 6 && y > 480) nav.classList.add('is-hidden');
      else if (y < lastY - 6 || y < 480) nav.classList.remove('is-hidden');
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    $('.menu-toggle-label', toggle).textContent = open ? 'Close' : 'Menu';
    if (open) { nav.classList.remove('is-hidden'); nav.classList.add('is-scrolled'); }
    else onScroll();
  };
  toggle.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 1041px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Approach: the image follows the step being read ---------- */
  const steps = $$('.step');
  const frames = $$('.approach-frame');
  const indexItems = $$('.approach-index li');
  const setStep = (i) => {
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    frames.forEach((f, k) => f.classList.toggle('is-active', k === i));
    indexItems.forEach((li, k) => li.classList.toggle('is-active', k === i));
  };
  if ('IntersectionObserver' in window) {
    const stepWatcher = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setStep(Number(entry.target.dataset.step)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach((s) => stepWatcher.observe(s));
  }

  /* ---------- Opening hours in India time ---------- */
  const HOURS = { 0: [8, 14], 1: [7, 21], 2: [7, 21], 3: [7, 21], 4: [7, 21], 5: [7, 21], 6: [7, 21] };
  const nowIST = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const fmtHour = (h) => `${h % 12 === 0 ? 12 : h % 12} ${h >= 12 ? 'pm' : 'am'}`;
  const openStatus = () => {
    const n = nowIST();
    const d = n.getDay();
    const h = n.getHours() + n.getMinutes() / 60;
    const [open, close] = HOURS[d];
    if (h >= open && h < close) return `Open now, until ${fmtHour(close)}`;
    if (h < open) return `Closed now, opens at ${fmtHour(open)}`;
    return `Closed now, opens at ${fmtHour(HOURS[(d + 1) % 7][0])} tomorrow`;
  };
  const paintStatus = () => $$('[data-open-status]').forEach((el) => { el.textContent = openStatus(); });
  paintStatus();
  setInterval(paintStatus, 60000);

  /* ---------- Doctors: next available slot ---------- */
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  (() => {
    const n = nowIST();
    const today = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    const times = ['4:30 pm', '10:30 am', '9:00 am'];
    $$('[data-next]').forEach((el) => {
      const base = Number(el.dataset.next);
      let offset = base;
      if (offset === 0 && n.getHours() >= 16) offset = 1;
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      if (d.getDay() === 0 && offset > 0) d.setDate(d.getDate() + 1);
      const diff = Math.round((d - today) / 864e5);
      const day = diff === 0 ? 'today' : diff === 1 ? 'tomorrow' : DAYS[d.getDay()];
      el.textContent = `Next available ${day}, ${times[base] || '11:00 am'}`;
    });
  })();

  /* ---------- Booking: visit, date and time, details ---------- */
  const WEEK_SLOTS = ['7:30 am', '8:15 am', '9:00 am', '9:45 am', '10:30 am', '11:15 am', '12:00 pm', '2:30 pm', '3:15 pm', '4:00 pm', '4:45 pm', '5:30 pm', '6:15 pm', '7:00 pm', '8:00 pm'];
  const SUN_SLOTS = ['8:30 am', '9:15 am', '10:00 am', '10:45 am', '11:30 am', '12:15 pm', '1:00 pm'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const DOCTORS = {
    'Cardiology': 'Dr. Meera K., Consultant Cardiologist',
    'Diabetes and endocrinology': 'Dr. Arun S., Endocrinologist',
    "Women's health": 'Dr. Leena R., Obstetrician and Gynaecologist',
    'Physiotherapy and sports medicine': 'Dr. Vivek P., Sports and Musculoskeletal Physician',
  };
  const toHour = (s) => {
    const [hm, ap] = s.split(' ');
    let [h, m] = hm.split(':').map(Number);
    if (ap === 'pm' && h !== 12) h += 12;
    return h + m / 60;
  };
  const hash = (str) => Array.from(str).reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 9973, 7);

  const form = $('#booking-form');
  const done = $('#booking-done');
  const formError = $('#form-error');
  const strip = $('#date-strip');
  const timeGroups = $('#time-groups');
  const nextBtn = $('#booker-next');
  const backBtn = $('#booker-back');
  const stepsList = $$('#booker-steps li');
  const stepPanels = $$('.booker-step', form);
  const state = { step: 1, maxStep: 1, days: [], day: null, slot: null };

  const visitValue = () => $('input[name="visit"]:checked', form).value;
  const specValue = () => $('input[name="spec"]:checked', form).value;
  const doctorFor = (spec) => DOCTORS[spec] || 'The first available physician';
  const dayName = (day) => (day.offset === 0 ? 'Today' : day.offset === 1 ? 'Tomorrow' : DAYS[day.date.getDay()]);

  const buildDays = () => {
    const n = nowIST();
    const today = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    const soonest = n.getHours() + n.getMinutes() / 60 + 1;
    const specSeed = hash(specValue() + visitValue());
    const previous = state.day !== null ? state.days[state.day] : null;
    state.days = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const list = date.getDay() === 0 ? SUN_SLOTS : WEEK_SLOTS;
      const slots = list.map((label, k) => {
        const seed = (specSeed + date.getDate() * 37 + date.getMonth() * 11 + k * 23) % 10;
        return { label, ok: (i > 0 || toHour(label) > soonest) && seed > 2 };
      });
      state.days.push({ date, offset: i, slots, open: slots.filter((s) => s.ok).length });
    }
    let keep = previous ? state.days.findIndex((d) => d.offset === previous.offset && d.open > 0) : -1;
    if (keep < 0) keep = state.days.findIndex((d) => d.open > 0);
    renderDays(keep);
  };

  const renderDays = (selected) => {
    strip.innerHTML = '';
    state.days.forEach((day, idx) => {
      const label = document.createElement('label');
      label.className = 'day-option';
      const avail = day.open === 0 ? 'Full' : day.open <= 3 ? `${day.open} left` : `${day.open} times`;
      label.innerHTML = `<input type="radio" name="day" value="${idx}"${day.open === 0 ? ' disabled' : ''}>`
        + `<span class="day-week">${day.offset === 0 ? 'Today' : SHORT[day.date.getDay()]}</span>`
        + `<span class="day-num">${day.date.getDate()}</span>`
        + `<span class="day-month">${MONTHS[day.date.getMonth()]}</span>`
        + `<span class="day-avail">${avail}</span>`;
      const input = $('input', label);
      input.setAttribute('aria-label', `${dayName(day)} ${day.date.getDate()} ${MONTHS[day.date.getMonth()]}, ${avail}`);
      input.addEventListener('change', () => selectDay(idx));
      strip.appendChild(label);
    });
    if (selected >= 0) {
      $$('input', strip)[selected].checked = true;
      selectDay(selected, true);
    }
  };

  const selectDay = (idx, keepSlot = false) => {
    const previousSlot = state.slot;
    state.day = idx;
    const day = state.days[idx];
    state.slot = keepSlot && previousSlot && day.slots.some((s) => s.ok && s.label === previousSlot) ? previousSlot : null;
    const groups = [['Morning', (h) => h < 12], ['Afternoon', (h) => h >= 12 && h < 17], ['Evening', (h) => h >= 17]];
    timeGroups.innerHTML = '';
    groups.forEach(([title, test]) => {
      const slots = day.slots.filter((s) => test(toHour(s.label)));
      if (!slots.length) return;
      const group = document.createElement('div');
      group.className = 'time-group';
      group.innerHTML = `<p class="time-group-title">${title}</p><div class="time-grid"></div>`;
      const grid = $('.time-grid', group);
      slots.forEach((s) => {
        const label = document.createElement('label');
        label.className = 'time-option';
        label.innerHTML = `<input type="radio" name="slot" value="${s.label}"${s.ok ? '' : ' disabled'}${s.label === state.slot ? ' checked' : ''}><span>${s.label}</span>`;
        if (!s.ok) $('input', label).setAttribute('aria-label', `${s.label}, unavailable`);
        $('input', label).addEventListener('change', () => { state.slot = s.label; formError.textContent = ''; updateSummary(); });
        grid.appendChild(label);
      });
      timeGroups.appendChild(group);
    });
    updateSummary();
  };

  const updateSummary = () => {
    const visit = visitValue() === 'Video' ? 'Video visit' : 'In-person visit';
    $('#sum-main').textContent = `${visit}, ${specValue()}`;
    const day = state.day !== null ? state.days[state.day] : null;
    $('#sum-time').textContent = day && state.slot
      ? `${dayName(day)}, ${day.date.getDate()} ${MONTHS[day.date.getMonth()]} at ${state.slot}`
      : 'Choose a day and time';
    $('#booker-doctor').textContent = `With ${doctorFor(specValue()).replace(/^The f/, 'the f')}`;
  };

  const goTo = (step, { focus = true } = {}) => {
    const back = step < state.step;
    state.step = step;
    state.maxStep = Math.max(state.maxStep, step);
    formError.textContent = '';
    stepPanels.forEach((panel) => {
      const active = Number(panel.dataset.step) === step;
      panel.classList.toggle('is-active', active);
      panel.classList.toggle('is-back', active && back);
    });
    stepsList.forEach((li, k) => {
      const n = k + 1;
      li.classList.toggle('is-current', n === step);
      li.classList.toggle('is-done', n < step || (n <= state.maxStep && n !== step));
      li.classList.toggle('is-locked', n > state.maxStep);
      if (n === step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    $('#booker-progress').style.width = `${(step / 3) * 100}%`;
    backBtn.hidden = step === 1;
    nextBtn.firstChild.textContent = step === 3 ? 'Request appointment' : 'Continue';
    if (step === 2) {
      const sel = $('input:checked', strip);
      if (sel) strip.scrollLeft = Math.max(0, sel.closest('.day-option').offsetLeft - strip.offsetLeft - 8);
    }
    if (focus) $('.booker-title', stepPanels[step - 1]).focus({ preventScroll: true });
    const panelTop = $('#booker').getBoundingClientRect().top;
    if (focus && panelTop < 0) $('#booker').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const setFieldError = (input, errEl, message) => {
    errEl.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  };

  const showDone = () => {
    const day = state.days[state.day];
    const name = $('#f-name').value.trim();
    $('#done-name').textContent = name.split(/\s+/)[0];
    const rows = [
      ['Visit', visitValue() === 'Video' ? 'Video, link by SMS' : 'In person, at the clinic'],
      ['Speciality', specValue()],
      ['Doctor', doctorFor(specValue())],
      ['When', `${dayName(day)}, ${day.date.getDate()} ${MONTHS[day.date.getMonth()]} at ${state.slot}`],
      ['Confirmation', `SMS to +91 ${$('#f-phone').value.trim()}`],
    ];
    $('#done-list').innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd></dd></div>`).join('');
    $$('#done-list dd').forEach((dd, k) => { dd.textContent = rows[k][1]; });
    form.hidden = true;
    $('#booker-steps').hidden = true;
    $('.booker-progress').hidden = true;
    done.hidden = false;
    done.focus({ preventScroll: true });
  };

  // Plain button + Enter key handling, so the flow also works inside sandboxed
  // previews where native form submission is blocked.
  const advance = () => {
    if (state.step === 1) { goTo(2); return; }
    if (state.step === 2) {
      if (!state.slot) {
        formError.textContent = 'Choose a time to continue.';
        const first = $('input[name="slot"]:not(:disabled)', timeGroups);
        if (first) first.focus();
        return;
      }
      goTo(3);
      return;
    }
    const nameInput = $('#f-name');
    const phoneInput = $('#f-phone');
    const digits = phoneInput.value.replace(/\D/g, '');
    setFieldError(nameInput, $('#err-name'), nameInput.value.trim() ? '' : 'Enter your full name.');
    setFieldError(phoneInput, $('#err-phone'), digits.length === 10 ? '' : 'Enter a 10-digit mobile number, without +91.');
    const invalid = $('[aria-invalid="true"]', form);
    if (invalid) { invalid.focus(); return; }
    showDone();
  };
  nextBtn.addEventListener('click', advance);
  form.addEventListener('submit', (e) => { e.preventDefault(); advance(); });
  $$('#f-name, #f-phone', form).forEach((input) => input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); advance(); }
  }));
  $('#f-name').addEventListener('input', (e) => setFieldError(e.target, $('#err-name'), ''));
  $('#f-phone').addEventListener('input', (e) => setFieldError(e.target, $('#err-phone'), ''));

  backBtn.addEventListener('click', () => goTo(state.step - 1));
  stepsList.forEach((li, k) => $('button', li).addEventListener('click', () => {
    const target = k + 1;
    if (target > state.maxStep || target === state.step) return;
    if (target === 3 && !state.slot) return;
    goTo(target);
  }));

  $$('input[name="visit"], input[name="spec"]', form).forEach((input) => input.addEventListener('change', () => { buildDays(); updateSummary(); }));
  $('#strip-prev').addEventListener('click', () => strip.scrollBy({ left: -strip.clientWidth * 0.8 }));
  $('#strip-next').addEventListener('click', () => strip.scrollBy({ left: strip.clientWidth * 0.8 }));

  const setSpeciality = (name) => {
    const input = $$('input[name="spec"]', form).find((i) => i.value === name);
    if (!input) return;
    input.checked = true;
    if (!done.hidden) resetBooking();
    buildDays();
    goTo(1, { focus: false });
  };
  $$('[data-spec]').forEach((a) => a.addEventListener('click', () => setSpeciality(a.dataset.spec)));

  const resetBooking = () => {
    form.reset();
    state.day = null; state.slot = null; state.maxStep = 1;
    done.hidden = true;
    form.hidden = false;
    $('#booker-steps').hidden = false;
    $('.booker-progress').hidden = false;
    $$('[aria-invalid]', form).forEach((el) => el.removeAttribute('aria-invalid'));
    $('#err-name').textContent = ''; $('#err-phone').textContent = '';
    buildDays();
  };
  $('#booking-again').addEventListener('click', () => { resetBooking(); goTo(1); });

  buildDays();
  goTo(1, { focus: false });

  /* ---------- FAQ: smooth open and close ---------- */
  $$('.faq-list details').forEach((details) => {
    const summary = $('summary', details);
    const content = $('.faq-body', details);
    summary.addEventListener('click', (e) => {
      if (reduceMotion || !content.animate) return;
      e.preventDefault();
      if (details.open) {
        const h = content.offsetHeight;
        const anim = content.animate([{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 320, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });
        anim.onfinish = () => { details.open = false; };
      } else {
        details.open = true;
        const h = content.offsetHeight;
        content.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
      }
    });
  });
})();
