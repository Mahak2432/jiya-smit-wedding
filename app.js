/*
  The invitation story.
  A camera walks along an illustrated palace colonnade. Each swipe pans to the next arch, the time
  of day moves on (morning to moonlight), and that step's details settle into the sky.
*/
(function () {
  'use strict';

  var W = window.WEDDING;
  var ART = window.ART;
  if (!W || !ART) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function clamp(v, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, v)); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  /* ----------------------------------------------------------
     Times of day. Colours are what the guest finally sees; the sky
     is pre-adjusted so it lands there under the night tint.
     ---------------------------------------------------------- */
  var MOODS = {
    day:     { sky: ['#F7F2E9', '#F2ECE1', '#EBE0CF'], tint: ['#FFFFFF', 0],    sun: 0.85, stars: 0,    moon: 0, night: false },
    dawn:    { sky: ['#F3E4E1', '#F6EADF', '#F3D9C4'], tint: ['#F4D6CF', 0.12], sun: 1,    stars: 0,    moon: 0, night: false },
    morning: { sky: ['#EFF1EA', '#F6F0E3', '#F3E3C8'], tint: ['#FFF1D8', 0.08], sun: 1,    stars: 0,    moon: 0, night: false },
    golden:  { sky: ['#F4DDBA', '#F1C595', '#E9A574'], tint: ['#F0AA6E', 0.27], sun: 1,    stars: 0,    moon: 0, night: false },
    dusk:    { sky: ['#6E6C9C', '#C392A0', '#EEB28A'], tint: ['#7A689A', 0.34], sun: 0.3,  stars: 0.35, moon: 0, night: true },
    night:   { sky: ['#151B3D', '#262C58', '#4B3F66'], tint: ['#2E356C', 0.6],  sun: 0,    stars: 1,    moon: 0, night: true },
    moon:    { sky: ['#131939', '#242B58', '#473D65'], tint: ['#2E356C', 0.6],  sun: 0,    stars: 1,    moon: 1, night: true },
  };

  function hexToRgb(h) { var v = parseInt(h.slice(1), 16); return [v >> 16 & 255, v >> 8 & 255, v & 255]; }
  function rgbStr(c) { return 'rgb(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ')'; }
  function mixRgb(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }

  Object.keys(MOODS).forEach(function (k) {
    var m = MOODS[k];
    var tint = hexToRgb(m.tint[0]), a = m.tint[1];
    m.tintRgb = tint;
    m.skyRgb = m.sky.map(function (hex) {
      var c = hexToRgb(hex);
      return c.map(function (v, i) {
        var f = 1 - a + a * tint[i] / 255;
        return Math.min(255, v / f);
      });
    });
  });

  /* ----------------------------------------------------------
     Language. The invitation opens in English; guests can switch to Hindi
     from the EN / हिं switch in the top bar, and a shared link can start in
     Hindi with ?lang=hi.
     ---------------------------------------------------------- */
  var UI = {
    en: {
      saveA: 'Save', saveThe: 'the', saveB: 'Date',
      celebrate: 'To celebrate the wedding of',
      venueKicker: 'The celebrations are at',
      units: ['Days', 'Hours', 'Mins', 'Secs'],
      until: 'until the Ashirwad Samaroh, 7:15 PM on 12 December',
      begun: 'The celebration has begun',
      maps: 'Open in maps', saveDates: 'Save the dates',
      call: 'Call', whatsapp: 'WhatsApp',
      waText: 'Namaste, we will be happy to join the wedding of Jeeya & Smit.',
      replay: 'Watch again', swipe: 'Swipe to continue', step: 'Step', of: 'of',
      labels: ['Save the date', 'Shri Ganesh', 'The invitation', "The bride's family", "The groom's family", '9 December', '11 December', '12 December', 'Venue and countdown', 'With love', 'Awaiting you'],
    },
    hi: {
      shubh: 'शुभ विवाह', sang: 'संग',
      venueKicker: 'निमंत्रित स्थल',
      units: ['दिन', 'घंटे', 'मिनट', 'सेकंड'],
      until: 'आशीर्वाद समारोह तक, 12 दिसम्बर, सायं 7.15 बजे',
      begun: 'समारोह आरम्भ हो चुका है',
      maps: 'नक्शे में देखें', saveDates: 'कैलेंडर में जोड़ें',
      call: 'कॉल करें', whatsapp: 'व्हाट्सऐप',
      waText: 'नमस्ते, हम जिया एवं स्मित के विवाह में अवश्य पधारेंगे।',
      replay: 'फिर से देखें', swipe: 'आगे देखने के लिए स्वाइप करें', step: 'पृष्ठ', of: '/',
      labels: ['शुभ विवाह', 'श्री गणेश', 'निमंत्रण', 'वधु पक्ष', 'वर पक्ष', '9 दिसम्बर', '11 दिसम्बर', '12 दिसम्बर', 'निमंत्रित स्थल', 'स्नेह सहित', 'आपकी प्रतीक्षा में'],
    },
  };
  var LANG = /[?&]lang=hi\b/.test(location.search) ? 'hi' : 'en';
  function L(v) { return v && typeof v === 'object' && !Array.isArray(v) ? (v[LANG] !== undefined ? v[LANG] : v.en) : v; }
  function T(key) { return UI[LANG][key]; }

  /* ----------------------------------------------------------
     Scene content
     ---------------------------------------------------------- */
  // A fine gold rule with a diamond, as in the first design.
  var ORN = '<div class="orn rv" aria-hidden="true"><i></i></div>';
  function line(cls, text) { return '<p class="' + cls + ' rv">' + esc(text) + '</p>'; }
  var bride = W.couple.bride, groom = W.couple.groom;
  function town() { return L(W.wedding.city).split(/[,(]/)[0].trim(); }
  var HI = function () { return LANG === 'hi'; };

  function coupleNames() {
    if (HI()) {
      return '<h2 class="names rv" aria-label="' + esc(bride.hi + ' ' + T('sang') + ' ' + groom.hi) + '">' +
        esc(bride.hi) + ' <span class="sang">' + T('sang') + '</span> ' + esc(groom.hi) + '</h2>';
    }
    return '<h2 class="names rv" aria-label="' + esc(bride.en + ' and ' + groom.en) + '">' +
      esc(bride.en) + ' <span class="amp">&amp;</span> ' + esc(groom.en) + '</h2>';
  }

  function sceneHero() {
    var s = '<div class="ganesha-wrap rv">' + ART.ganesha() + '</div>';
    if (HI()) s += line('hi-title', T('shubh')) + coupleNames();
    else s += '<p class="std rv">' + T('saveA') + ' <span class="the">' + T('saveThe') + '</span> ' + T('saveB') + '</p>' + line('caps-sm gap-sm', T('celebrate')) + coupleNames();
    return s + line('caps', L(W.wedding.date)) + line('caps-sm', L(W.wedding.venue) + ', ' + town());
  }

  function sceneBlessing() {
    var B = W.blessing;
    var s = '<div class="ganesha-wrap rv">' + ART.ganesha() + '</div>';
    if (HI()) {
      s += line('hi-title', B.title.hi) + ORN + B.shloka.hi.map(function (l) { return line('hi-verse', l); }).join('') + ORN + line('hi-quote', B.quote.hi);
    } else {
      s += line('title-en', B.title.en) + ORN + B.shloka.en.map(function (l) { return line('verse-en', l); }).join('') + ORN + line('en-it', B.quote.en);
    }
    return s;
  }

  // The invitation itself unrolls on a paper scroll hanging in the arch.
  function sceneInvitation() {
    var I = W.invitation;
    var inner = HI()
      ? line('hi-label', I.salutation.hi) + line('hi-body gap-sm', I.body.hi) + ORN + line('hi-sign', W.closing.signed.hi)
      : line('en-label', I.salutation.en) + line('en-body gap-sm', I.body.en) + ORN + line('en-it', W.closing.signed.en);
    return '<div class="scroll rv">' +
        '<div class="scroll-rod"></div>' +
        '<div class="scroll-body"><div class="scroll-paper">' + inner + '</div></div>' +
        '<div class="scroll-rod"></div>' +
      '</div>';
  }

  function sceneFamily(f, extra) {
    return line(HI() ? 'hi-label' : 'en-label', L(f.side)) +
      '<h2 class="script rv">' + esc(L(f.title)) + '</h2>' +
      ORN +
      L(f.lines).map(function (l) { return line('en', l); }).join('') +
      line('caps-sm gap', L(f.firm)) +
      (extra || '');
  }

  function sceneDay(d) {
    var rows = d.events.map(function (ev) {
      return '<li class="ev rv' + (ev.main ? ' is-main' : '') + '">' +
        '<time>' + esc(L(ev.time)) + '</time>' +
        '<span class="ev-name">' + esc(L(ev.name)) + '</span>' +
      '</li>';
    }).join('');
    return line('caps-sm', L(d.weekday)) +
      '<p class="day-num rv">' + esc(d.day) + '</p>' +
      line('caps', L(d.month)) +
      line('place', L(d.place)) +
      ORN +
      '<ol class="events">' + rows + '</ol>';
  }

  function sceneVenue() {
    var u = T('units');
    var units = [['days', u[0]], ['hours', u[1]], ['minutes', u[2]], ['seconds', u[3]]].map(function (x) {
      return '<div><strong data-unit="' + x[0] + '">00</strong><span>' + x[1] + '</span></div>';
    }).join('');
    return line(HI() ? 'hi-label' : 'en-label', T('venueKicker')) +
      '<h2 class="script rv">' + esc(L(W.wedding.venue)) + '</h2>' +
      line('caps-sm', L(W.wedding.city)) +
      ORN +
      '<div class="count rv" id="count" role="timer" aria-label="' + esc(T('until')) + '">' + units + '</div>' +
      '<p class="en-it rv" id="count-done" hidden>' + esc(T('begun')) + '</p>' +
      line('en-it', T('until')) +
      '<div class="pills rv">' +
        '<a class="pill" href="' + esc(W.wedding.mapUrl) + '" target="_blank" rel="noopener">' + esc(T('maps')) + '</a>' +
        '<button class="pill" id="save-dates" type="button">' + esc(T('saveDates')) + '</button>' +
      '</div>';
  }

  function sceneGreetings() {
    var G = W.guests;
    function block(group, inline) {
      var list = L(group.names);
      return '<div class="gblock rv">' +
        '<p class="' + (HI() ? 'hi-label' : 'en-label') + '">' + esc(L(group.title)) + '</p>' +
        (inline
          ? '<p class="gline">' + esc(list.join(', ')) + '</p>'
          : '<ul class="glist">' + list.map(function (nm) { return '<li>' + esc(nm) + '</li>'; }).join('') + '</ul>') +
      '</div>';
    }
    return block(G.darshan) + block(G.special) + block(G.sweet, true) + line('en-sm gap', L(G.ladies));
  }

  function sceneClosing() {
    var C = W.closing;
    var calls = W.contacts.map(function (c) {
      return '<a class="pill" href="tel:' + esc(c.tel) + '">' + esc(T('call')) + ' ' + esc(c.display) + '</a>';
    }).join('');
    var whatsapp = W.contacts[0]
      ? '<a class="pill" href="https://wa.me/' + esc(W.contacts[0].wa) + '?text=' + encodeURIComponent(T('waText')) + '" target="_blank" rel="noopener">' + esc(T('whatsapp')) + '</a>'
      : '';
    var head = HI()
      ? line('hi-title', C.title.hi) + line('hi-sign gap', C.signed.hi)
      : '<p class="script-md rv">' + esc(C.title.en) + '</p>' + line('en-sm gap-sm', C.signed.en);
    return head +
      '<div class="pills rv">' + calls + whatsapp + '</div>' +
      '<button class="text-btn rv" id="replay" type="button">' + esc(T('replay')) + '</button>';
  }

  function nanihal() { return line('en-sm gap-sm', L(W.families.maternal)); }

  // The richer couple and peacock (figures.js) replace the simple ones when present.
  var PR = Object.assign({}, ART.props, window.FIGURES ? { peacock: FIGURES.peacock, couple: FIGURES.couple } : {});
  var SLIDES = [
    { id: 'save-the-date', mood: 'day', box: [150, 270, 850, 905], html: sceneHero,
      props: function () { return { arch: PR.peacock(200, 1566, 1.05, true) + PR.couple(575, 1552, 0.98) }; } },
    { id: 'blessing', mood: 'dawn', box: [180, 290, 820, 1130], html: sceneBlessing,
      props: function () { return { arch: PR.bells() }; } },
    { id: 'invitation', mood: 'day', box: [120, 350, 880, 1520], top: true, html: sceneInvitation,
      props: function () { return { arch: '' }; } },
    { id: 'bride', mood: 'day', box: [140, 300, 860, 1130], html: function () { return sceneFamily(W.families.bride, nanihal()); },
      props: function () { return { arch: PR.peacock(205, 1566, 1, true) }; } },
    { id: 'groom', mood: 'day', box: [140, 300, 860, 1130], html: function () { return sceneFamily(W.families.groom); },
      props: function () { return { arch: PR.peacock(795, 1566, 1, false) }; } },
    { id: 'day-1', mood: 'morning', box: [175, 280, 825, 1070], html: function () { return sceneDay(W.days[0]); },
      props: function () { return { arch: PR.marigolds() }; } },
    { id: 'day-2', mood: 'golden', box: [175, 300, 825, 1130], html: function () { return sceneDay(W.days[1]); },
      props: function () { return { arch: PR.marigolds() + PR.peacock(205, 1566, 1, true) }; } },
    { id: 'day-3', mood: 'dusk', box: [175, 300, 825, 1130], html: function () { return sceneDay(W.days[2]); },
      props: function () { return { glow: PR.lanterns() }; } },
    { id: 'venue', mood: 'night', box: [170, 300, 830, 1130], html: sceneVenue,
      props: function () { return { glow: PR.lanterns() + PR.diyas() }; } },
    { id: 'family', mood: 'night', box: [170, 290, 830, 1190], html: sceneGreetings,
      props: function () { return { glow: PR.lanterns() + PR.diyas() }; } },
    { id: 'rsvp', mood: 'moon', box: [150, 392, 850, 990], html: sceneClosing,
      props: function () { return { arch: PR.couple(505, 1556, 0.8), glow: PR.diyas([150, 250, 760, 860]) }; } },
  ];
  var N = SLIDES.length;

  /* ----------------------------------------------------------
     Build
     ---------------------------------------------------------- */
  var story = $('#story');
  var world = $('#world');
  var skyEl = $('#sky');
  var tintEl = $('#tint');
  var langBtns = $$('[data-set-lang]');
  var panelsEl = $('#panels');
  var progressEl = $('#progress');
  var cover = $('#cover');
  var hint = $('#hint');
  var statusEl = $('#status');
  var prevBtn = $('#prev');
  var nextBtn = $('#next');
  var musicBtn = $('#music');
  var canvas = $('#flock');
  var ctx = canvas.getContext('2d');

  $('#l-sky').innerHTML = ART.sky();
  $('#l-far').innerHTML = ART.far();
  $('#l-garden').innerHTML = ART.garden();
  $('#l-bal').innerHTML = ART.balustrade();
  $('#l-arch').innerHTML = ART.arch();
  $('#l-stars').innerHTML = ART.stars();
  $('#l-glow').innerHTML = ART.glowLayer();
  if (window.FIGURES) {
    // Fabric, metal and peacock definitions, shared by the palace and the cover.
    document.body.insertAdjacentHTML('afterbegin', '<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false">' + FIGURES.defs() + '</svg>');
    $$('.door', cover).forEach(function (d) { d.innerHTML = FIGURES.doors(); });
    $('.toran', cover).innerHTML = FIGURES.toran();
    $('.cover-flora', cover).innerHTML = FIGURES.flora();
    // A few rose and marigold petals drifting down over the doors.
    if (!reduced) {
      var petals = '';
      for (var pk = 0; pk < 14; pk++) {
        petals += '<i class="petal' + (pk % 3 === 0 ? ' petal--gold' : '') + '" style="left:' + (Math.random() * 96).toFixed(1) + '%;--d:' + (9 + Math.random() * 7).toFixed(1) +
          's;--delay:' + (Math.random() * 9).toFixed(1) + 's;--dx:' + Math.round(Math.random() * 90 - 45) + 'px;--s:' + (0.7 + Math.random() * 0.6).toFixed(2) + '"></i>';
      }
      $('.cover-petals', cover).innerHTML = petals;
    }
    $('.cover-crest', cover).innerHTML = FIGURES.crest(ART.ganesha(), [bride.en.charAt(0), groom.en.charAt(0)]);
  }

  var MOVING = $$('.layer[data-p]').map(function (el) { return { el: el, p: parseFloat(el.dataset.p) }; });
  var FIXED = $$('.layer--fixed');
  var sunEl = $('#l-sky .sun');
  var starsEl = $('#l-stars .stars');
  var moonEl = $('#l-stars .moon');
  var skyClip = $('#sky-clip-path');
  var archSlots = {}, glowSlots = {};
  $$('#l-arch .slot').forEach(function (g) { archSlots[g.getAttribute('data-slot')] = g; });
  $$('#l-glow .slot').forEach(function (g) { glowSlots[g.getAttribute('data-slot')] = g; });

  // The words for every scene, in the chosen language. Rebuilt when the language changes.
  var panels = [];
  function renderPanels() {
    var labels = T('labels');
    panelsEl.innerHTML = SLIDES.map(function (s, i) {
      var night = MOODS[s.mood].night;
      return '<section class="panel' + (night ? ' is-night' : '') + (s.top ? ' panel--top' : '') + '" lang="' + LANG + '" style="--l:' + s.box[0] + ';--t:' + s.box[1] + ';--r:' + s.box[2] + ';--b:' + s.box[3] + '"' +
        ' role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' / ' + N + ': ' + esc(labels[i]) + '" aria-hidden="true">' +
        s.html() + '</section>';
    }).join('');
    panels = $$('.panel', panelsEl);
    panels.forEach(function (el) {
      $$('.rv', el).forEach(function (ln, k) { ln.style.setProperty('--i', k); });
      el.inert = true;
    });
  }

  function setLang(l, rerender) {
    LANG = l === 'hi' ? 'hi' : 'en';
    document.documentElement.lang = LANG;
    story.classList.toggle('lang-hi', LANG === 'hi');
    langBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-set-lang') === LANG ? 'true' : 'false'); });
    $('span', hint).textContent = T('swipe');
    if (!rerender) return;
    if (pan) endPan();
    renderPanels();
    if (opened && !intro && cur >= 0) {
      void panels[cur].offsetWidth;
      setPanel(cur, 'active');
      updateChrome(cur);
    }
    tick();
  }

  renderPanels();

  progressEl.innerHTML = SLIDES.map(function () { return '<span class="seg"><i></i></span>'; }).join('');
  var segs = $$('.seg', progressEl);

  /* ----------------------------------------------------------
     Layout: map bay units to pixels for this screen
     ---------------------------------------------------------- */
  var U = 1, OX = 0, OY = 0, CW = 0, CH = 0, DPR = 1;
  var ZOOM = 1.25, ZOOM_Y = 698;

  function layout() {
    var r = story.getBoundingClientRect();
    CW = r.width; CH = r.height;
    U = Math.max(CW / 1000, CH / 1900);
    OX = (CW - 1000 * U) / 2;
    OY = (CH - 1900 * U) / 2;
    story.style.setProperty('--u', U + 'px');
    story.style.setProperty('--ox', OX + 'px');
    story.style.setProperty('--oy', OY + 'px');
    story.style.setProperty('--ch', CH + 'px');
    MOVING.forEach(function (L) {
      L.el.style.width = 3000 * U + 'px';
      L.el.style.height = 1900 * U + 'px';
      L.el.style.left = (OX - 1000 * U) + 'px';
      L.el.style.top = OY + 'px';
    });
    FIXED.forEach(function (el) {
      el.style.width = 1000 * U + 'px';
      el.style.height = 1900 * U + 'px';
      el.style.left = OX + 'px';
      el.style.top = OY + 'px';
    });
    var origin = (OX + 500 * U) + 'px ' + (OY + ZOOM_Y * U) + 'px';
    world.style.transformOrigin = origin;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(CW * DPR);
    canvas.height = Math.round(CH * DPR);
    if (pan) renderPan(pan.e);
  }

  /* ----------------------------------------------------------
     Mood (time of day)
     ---------------------------------------------------------- */
  function applyMood(a, b, t) {
    var A = MOODS[a], B = MOODS[b || a];
    t = b ? t : 0;
    var s0 = mixRgb(A.skyRgb[0], B.skyRgb[0], t), s1 = mixRgb(A.skyRgb[1], B.skyRgb[1], t), s2 = mixRgb(A.skyRgb[2], B.skyRgb[2], t);
    skyEl.style.background = 'linear-gradient(' + rgbStr(s0) + ', ' + rgbStr(s1) + ' 50%, ' + rgbStr(s2) + ' 68%)';
    tintEl.style.background = rgbStr(mixRgb(A.tintRgb, B.tintRgb, t));
    tintEl.style.opacity = A.tint[1] + (B.tint[1] - A.tint[1]) * t;
    sunEl.style.opacity = A.sun + (B.sun - A.sun) * t;
    starsEl.style.opacity = A.stars + (B.stars - A.stars) * t;
    moonEl.style.opacity = A.moon + (B.moon - A.moon) * t;
    var night = (t < 0.5 ? A : B).night;
    story.classList.toggle('is-night', night);
    document.body.classList.toggle('is-night', night);
  }

  /* ----------------------------------------------------------
     Props for each scene live in "slots": the bay on screen and
     the bays either side, used while the camera pans.
     ---------------------------------------------------------- */
  function fillSlot(k, i) {
    var pr = i >= 0 && i < N ? SLIDES[i].props() : {};
    archSlots[k].innerHTML = pr.arch || '';
    glowSlots[k].innerHTML = pr.glow || '';
  }

  /* ----------------------------------------------------------
     Navigation
     ---------------------------------------------------------- */
  var cur = -1;
  var opened = false;
  var moved = false;
  var pan = null;
  var intro = null;

  function setPanel(i, state) {
    var el = panels[i];
    if (!el) return;
    el.style.transform = '';
    el.style.opacity = state === 'off' ? '' : '1';
    el.classList.toggle('is-shown', state !== 'off');
    el.classList.toggle('is-active', state === 'active');
    el.inert = state !== 'active';
    el.setAttribute('aria-hidden', state === 'active' ? 'false' : 'true');
  }

  function updateChrome(i) {
    segs.forEach(function (seg, k) {
      seg.classList.toggle('is-done', k < i);
      seg.classList.remove('is-current');
    });
    void segs[i].offsetWidth;
    segs[i].classList.add('is-current');
    statusEl.textContent = T('step') + ' ' + (i + 1) + ' ' + T('of') + ' ' + N + ': ' + T('labels')[i];
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === N - 1;
    try { history.replaceState(null, '', '#' + SLIDES[i].id); } catch (e) { /* some in-app browsers block this */ }
  }

  // Put scene i on screen with nothing moving.
  function settle(i, showText) {
    cur = i;
    MOVING.forEach(function (L) { L.el.style.transform = ''; });
    skyClip.removeAttribute('transform');
    fillSlot('0', i);
    fillSlot('-1', -1);
    fillSlot('1', -1);
    applyMood(SLIDES[i].mood);
    panels.forEach(function (el, k) { if (k !== i) setPanel(k, 'off'); });
    if (showText !== false) setPanel(i, 'active');
    updateChrome(i);
  }

  function renderPan(e) {
    var off = -pan.dir * e * 1000;
    MOVING.forEach(function (L) { L.el.style.transform = 'translate3d(' + (off * L.p * U) + 'px,0,0)'; });
    skyClip.setAttribute('transform', 'translate(' + off + ' 0)');
    applyMood(SLIDES[pan.from].mood, SLIDES[pan.to].mood, e);
    var out = panels[pan.from], inn = panels[pan.to];
    out.style.transform = 'translate3d(' + (off * U) + 'px,0,0)';
    out.style.opacity = clamp(1 - e * 2.6);
    inn.style.transform = 'translate3d(' + ((off + pan.dir * 1000) * U) + 'px,0,0)';
    inn.style.opacity = clamp((e - 0.35) / 0.5);
  }

  function frame(now) {
    if (!pan) return;
    var t = clamp((now - pan.t0) / pan.dur);
    pan.e = easeInOut(t);
    renderPan(pan.e);
    if (t > 0.5 && !pan.revealed) {
      pan.revealed = true;
      panels[pan.to].classList.add('is-active');
    }
    if (t < 1) pan.raf = requestAnimationFrame(frame);
    else endPan();
  }

  function endPan() {
    if (!pan) return;
    cancelAnimationFrame(pan.raf);
    var to = pan.to;
    pan = null;
    settle(to);
  }

  function go(i) {
    if (i < 0 || i >= N || i === cur) return;
    if (pan) endPan();
    if (intro) finishIntro();
    if (cur < 0 || reduced) { settle(i); return; }
    var dir = i > cur ? 1 : -1;
    fillSlot(String(dir), i);
    var inn = panels[i];
    inn.classList.add('is-shown');
    inn.classList.remove('is-active');
    inn.inert = false;
    inn.setAttribute('aria-hidden', 'false');
    panels[cur].inert = true;
    panels[cur].setAttribute('aria-hidden', 'true');
    pan = { from: cur, to: i, dir: dir, t0: performance.now(), dur: 1500, e: 0, revealed: false };
    renderPan(0);
    pan.raf = requestAnimationFrame(frame);
    updateChrome(i);
    hint.classList.remove('is-on');
  }

  function step(delta) {
    if (!opened) return;
    if (intro) { finishIntro(); return; }
    moved = true;
    hint.classList.remove('is-on');
    go((pan ? pan.to : cur) + delta);
  }

  /* ----------------------------------------------------------
     Opening: the camera pulls back from the monogram to the palace,
     butterflies gather into a heart, and the couple walks in.
     ---------------------------------------------------------- */
  var startIndex = 0;
  SLIDES.forEach(function (s, i) { if (location.hash === '#' + s.id) startIndex = i; });

  function setZoom(scale, animate) {
    world.style.transition = animate ? 'transform 2.9s cubic-bezier(.5, 0, .15, 1)' : 'none';
    world.style.transform = 'scale(' + scale + ')';
  }

  // Opening the invitation: the words fade, the palace doors swing open, and the camera pulls back.
  var opening = false;
  function openCover() {
    if (opening || opened) return;
    opening = true;
    story.classList.add('is-warm');
    playMusic();
    cover.classList.add('is-opening');
    setTimeout(openInvite, reduced ? 0 : 700);
  }

  function openInvite() {
    if (opened) return;
    opened = true;
    story.classList.add('is-open');
    document.body.classList.add('is-open');
    settle(startIndex, false);
    if (reduced) {
      setZoom(1, false);
      setPanel(startIndex, 'active');
      return;
    }
    void world.offsetWidth;
    setZoom(1, true);
    var t0 = performance.now();
    intro = { t0: t0, hero: startIndex === 0, timers: [] };
    if (intro.hero) {
      prepareWalk();
      startFlock(t0 + 1300);
      intro.timers.push(setTimeout(function () { startWalk(); }, 3600));
      intro.timers.push(setTimeout(revealHero, 7200));
    } else {
      intro.timers.push(setTimeout(revealHero, 2300));
    }
  }

  function revealHero() {
    if (!intro) return;
    intro.timers.forEach(clearTimeout);
    intro = null;
    setPanel(cur, 'active');
    if (!moved && cur === 0) setTimeout(function () { if (!moved && cur === 0) hint.classList.add('is-on'); }, 2600);
  }

  function finishIntro() {
    if (!intro) return;
    setZoom(1, false);
    stopFlock();
    finishWalk();
    revealHero();
  }

  /* The couple walks in, hand in hand: the groom's legs swing at the hip and her lehenga sways. */
  var walk = null;
  var WALK_FROM = 680;

  function coupleParts() {
    var g = $('#l-arch .slot[data-slot="0"] .couple');
    if (!g) return null;
    function leg(sel) {
      var el = $(sel, g);
      return el ? { el: el, pivot: el.getAttribute('data-pivot'), base: parseFloat(el.getAttribute('data-base')) } : null;
    }
    var skirt = $('.skirt', g);
    return {
      g: g,
      body: $('.couple-body', g),
      legF: leg('.leg--f'),
      legB: leg('.leg--b'),
      skirt: skirt,
      waist: skirt ? parseFloat(skirt.getAttribute('data-waist')) : 0,
      base: g.getAttribute('transform'),
    };
  }

  function placeCouple(parts, dx, phase, amp) {
    // A couple illustration (no moving legs) fades in and rises into place instead of walking.
    if (!parts.legF) {
      var p = 1 - dx / WALK_FROM;
      parts.body.setAttribute('opacity', p.toFixed(3));
      parts.body.setAttribute('transform', 'translate(0 ' + ((1 - p) * 30).toFixed(2) + ')');
      return;
    }
    var m = /translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+)\)/.exec(parts.base);
    var x = parseFloat(m[1]) + dx, y = parseFloat(m[2]), sc = m[3];
    parts.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y + ') scale(' + sc + ')');
    var swing = Math.sin(phase) * 13 * amp;
    if (parts.legF) parts.legF.el.setAttribute('transform', 'rotate(' + (parts.legF.base * (1 - amp) + swing).toFixed(2) + ' ' + parts.legF.pivot + ')');
    if (parts.legB) parts.legB.el.setAttribute('transform', 'rotate(' + (parts.legB.base * (1 - amp) - swing).toFixed(2) + ' ' + parts.legB.pivot + ')');
    parts.body.setAttribute('transform', 'translate(0 ' + (-Math.abs(Math.sin(phase)) * 5 * amp).toFixed(2) + ')');
    if (parts.skirt) parts.skirt.setAttribute('transform', 'translate(0 ' + parts.waist + ') skewX(' + (Math.sin(phase) * 2.4 * amp).toFixed(2) + ') translate(0 ' + (-parts.waist) + ')');
  }

  function prepareWalk() {
    var parts = coupleParts();
    if (!parts) return;
    walk = { parts: parts, done: false };
    placeCouple(parts, WALK_FROM, 0, 1);
  }

  function startWalk() {
    if (!walk) return;
    var t0 = performance.now(), dur = walk.parts.legF ? 3900 : 2000;
    function tick(now) {
      if (!walk || walk.done) return;
      var t = clamp((now - t0) / dur);
      var e = walk.parts.legF ? 1 - Math.pow(1 - t, 1.7) : easeOut(t);
      var dist = WALK_FROM * (1 - e);
      placeCouple(walk.parts, dist, (WALK_FROM - dist) / 34, t < 0.86 ? 1 : (1 - t) / 0.14);
      if (t < 1) walk.raf = requestAnimationFrame(tick);
      else finishWalk();
    }
    walk.raf = requestAnimationFrame(tick);
  }

  function finishWalk() {
    if (!walk) return;
    cancelAnimationFrame(walk.raf);
    placeCouple(walk.parts, 0, 0, 0);
    walk.done = true;
    walk = null;
  }

  /* Butterflies gathering into a heart */
  var flock = null;

  function startFlock(at) {
    var birds = [], count = 64;
    for (var k = 0; k < count; k++) {
      var t = k / count * Math.PI * 2;
      var hx = 16 * Math.pow(Math.sin(t), 3);
      var hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      var tx = 500 + hx * 13.5 + (Math.random() - 0.5) * 10;
      var ty = 600 - hy * 13.5 + (Math.random() - 0.5) * 10;
      var sx = -160 - Math.random() * 360, sy = 330 + Math.random() * 560;
      birds.push({
        s: [sx, sy], c: [sx + 380 + Math.random() * 200, sy - 260 + Math.random() * 200], t: [tx, ty],
        e: [1180 + Math.random() * 300, 120 + Math.random() * 420],
        arrive: 2.1 + (k / count) * 0.7 + Math.random() * 0.35,
        leave: 4.7 + Math.random() * 0.5,
        hue: Math.random(),
        size: 0.8 + Math.random() * 0.45,
        flap: 9 + Math.random() * 5,
        ph: Math.random() * 6,
      });
    }
    flock = { birds: birds, t0: at, raf: 0 };
    flock.raf = requestAnimationFrame(drawFlock);
  }

  function stopFlock() {
    if (!flock) return;
    cancelAnimationFrame(flock.raf);
    flock = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function bez(a, b, c, t) { var u = 1 - t; return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]; }

  function drawFlock(now) {
    if (!flock) return;
    var t = (now - flock.t0) / 1000;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (t < 0) { flock.raf = requestAnimationFrame(drawFlock); return; }
    var alive = false;
    flock.birds.forEach(function (b) {
      var pos, prev;
      if (t < b.arrive) {
        var q = easeInOut(clamp(t / b.arrive));
        pos = bez(b.s, b.c, b.t, q);
        prev = bez(b.s, b.c, b.t, Math.max(0, q - 0.02));
      } else if (t < b.leave) {
        var w = t - b.arrive;
        pos = [b.t[0] + Math.sin(w * 2 + b.ph) * 4, b.t[1] + Math.cos(w * 2.6 + b.ph) * 4];
        prev = [pos[0] - 1, pos[1]];
      } else {
        var r = clamp((t - b.leave) / 2.2);
        var q2 = r * r;
        var mid = [b.t[0] + 140, b.t[1] - 160];
        pos = bez(b.t, mid, b.e, q2);
        prev = bez(b.t, mid, b.e, Math.max(0, q2 - 0.02));
        if (r >= 1) return;
      }
      alive = true;
      var x = (OX + pos[0] * U) * DPR, y = (OY + pos[1] * U) * DPR;
      var ang = Math.atan2(pos[1] - prev[1], pos[0] - prev[0]) * 0.25;
      var flap = Math.abs(Math.sin(t * b.flap + b.ph));
      var s = b.size * U * DPR;
      ctx.setTransform(1, 0, 0, 1, x, y);
      ctx.rotate(ang);
      ctx.fillStyle = b.hue > 0.5 ? '#C9839B' : '#DDA0B4';
      ctx.beginPath();
      ctx.ellipse(-5 * s * (0.3 + 0.7 * flap), -4 * s, 6 * s * (0.3 + 0.7 * flap), 7 * s, -0.5, 0, Math.PI * 2);
      ctx.ellipse(5 * s * (0.3 + 0.7 * flap), -4 * s, 6 * s * (0.3 + 0.7 * flap), 7 * s, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = b.hue > 0.5 ? '#E7B9C7' : '#B76F88';
      ctx.beginPath();
      ctx.ellipse(-4 * s * (0.3 + 0.7 * flap), 4 * s, 4 * s * (0.3 + 0.7 * flap), 4.5 * s, 0.4, 0, Math.PI * 2);
      ctx.ellipse(4 * s * (0.3 + 0.7 * flap), 4 * s, 4 * s * (0.3 + 0.7 * flap), 4.5 * s, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5A3B42';
      ctx.fillRect(-1 * s, -7 * s, 2 * s, 14 * s);
    });
    if (alive) flock.raf = requestAnimationFrame(drawFlock);
    else stopFlock();
  }

  /* ----------------------------------------------------------
     Music
     ---------------------------------------------------------- */
  var audio = null;
  var wasPlaying = false;

  function setMusicUI(playing) {
    musicBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    musicBtn.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  }

  // The first track in the list that loads is used, so a song added later takes over from the default.
  var tracks = [].concat(W.music.src);
  function loadTrack(i) {
    try {
      var a = new Audio(tracks[i]);
      a.loop = true;
      a.preload = 'auto';
      a.volume = 0.55;
      a.addEventListener('error', function () {
        if (audio !== a) return;
        var resume = wasPlaying || !a.paused;
        if (i + 1 < tracks.length) { loadTrack(i + 1); if (resume) playMusic(); }
        else { audio = null; musicBtn.hidden = true; }
      });
      a.addEventListener('play', function () { setMusicUI(true); });
      a.addEventListener('pause', function () { setMusicUI(false); });
      audio = a;
      musicBtn.hidden = false;
    } catch (e) {
      audio = null;
      musicBtn.hidden = true;
    }
  }
  loadTrack(0);

  function playMusic() {
    if (!audio) return;
    var pr = audio.play();
    if (pr && pr.catch) pr.catch(function () { setMusicUI(false); });
  }

  musicBtn.addEventListener('click', function () {
    if (!audio) return;
    if (audio.paused) playMusic(); else audio.pause();
  });

  document.addEventListener('visibilitychange', function () {
    if (!audio) return;
    if (document.hidden) { wasPlaying = !audio.paused; audio.pause(); }
    else if (wasPlaying) playMusic();
  });

  /* ----------------------------------------------------------
     Countdown
     ---------------------------------------------------------- */
  var target = new Date(W.wedding.startsAt).getTime();

  function tick() {
    var box = $('#count');
    if (!box) return;
    var diff = target - Date.now();
    if (diff <= 0) {
      box.hidden = true;
      var done = $('#count-done');
      if (done) done.hidden = false;
      return;
    }
    $('[data-unit="days"]', box).textContent = pad(Math.floor(diff / 86400000));
    $('[data-unit="hours"]', box).textContent = pad(Math.floor(diff / 3600000) % 24);
    $('[data-unit="minutes"]', box).textContent = pad(Math.floor(diff / 60000) % 60);
    $('[data-unit="seconds"]', box).textContent = pad(Math.floor(diff / 1000) % 60);
  }

  /* ----------------------------------------------------------
     Calendar (.ics) download
     ---------------------------------------------------------- */
  function icsStamp(date) { return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z'); }
  function icsText(v) { return String(v).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  function icsLine(line) {
    if (line.length <= 73) return line;
    var parts = [];
    for (var i = 0; i < line.length; i += 73) parts.push(line.slice(i, i + 73));
    return parts.join('\r\n ');
  }

  function buildICS() {
    var now = icsStamp(new Date());
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Shubh Vivah//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
    W.days.forEach(function (day) {
      day.events.forEach(function (ev, k) {
        var start = new Date(ev.startsAt);
        var end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
        lines.push(
          'BEGIN:VEVENT',
          'UID:' + ev.startsAt.replace(/[^0-9]/g, '') + '-' + k + '@shubh-vivah',
          'DTSTAMP:' + now,
          'DTSTART:' + icsStamp(start),
          'DTEND:' + icsStamp(end),
          'SUMMARY:' + icsText(bride.en + ' & ' + groom.en + ': ' + ev.name.en),
          'LOCATION:' + icsText(day.place.en),
          'DESCRIPTION:' + icsText('Shubh Vivah wedding celebration. All times IST.'),
          'END:VEVENT'
        );
      });
    });
    lines.push('END:VCALENDAR');
    return lines.map(icsLine).join('\r\n');
  }

  function downloadICS() {
    var blob = new Blob([buildICS()], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'jiya-smit-wedding.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* ----------------------------------------------------------
     Input
     ---------------------------------------------------------- */
  $('#open').addEventListener('click', openCover);
  langBtns.forEach(function (b) {
    b.addEventListener('click', function () { if (b.getAttribute('data-set-lang') !== LANG) setLang(b.getAttribute('data-set-lang'), true); });
  });
  prevBtn.addEventListener('click', function () { step(-1); });
  nextBtn.addEventListener('click', function () { step(1); });

  panelsEl.addEventListener('click', function (e) {
    if (e.target.closest('#save-dates')) downloadICS();
    if (e.target.closest('#replay')) { moved = true; go(0); }
  });

  // Swipe in any direction, or tap: the left third goes back, the rest goes forward.
  var sx = 0, sy = 0, st = 0, tracking = false;
  story.addEventListener('pointerdown', function (e) {
    if (!opened || e.target.closest('a, button')) return;
    tracking = true;
    sx = e.clientX; sy = e.clientY; st = Date.now();
  });
  story.addEventListener('pointerup', function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.clientX - sx, dy = e.clientY - sy, ax = Math.abs(dx), ay = Math.abs(dy);
    if (ax > 40 || ay > 40) {
      if (ax > ay) step(dx < 0 ? 1 : -1);
      else step(dy < 0 ? 1 : -1);
      return;
    }
    if (Date.now() - st < 600) {
      var r = story.getBoundingClientRect();
      step(e.clientX - r.left < r.width * 0.3 ? -1 : 1);
    }
  });
  story.addEventListener('pointercancel', function () { tracking = false; });

  var wheelLock = 0;
  window.addEventListener('wheel', function (e) {
    if (!opened || Math.abs(e.deltaY) < 20) return;
    var now = Date.now();
    if (now < wheelLock) return;
    wheelLock = now + 1100;
    step(e.deltaY > 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener('keydown', function (e) {
    if (!opened) {
      if (e.key === 'Enter' && document.activeElement === document.body) openCover();
      return;
    }
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].indexOf(e.key) > -1) { e.preventDefault(); step(1); }
    if (['ArrowLeft', 'ArrowUp', 'PageUp'].indexOf(e.key) > -1) { e.preventDefault(); step(-1); }
  });

  window.addEventListener('resize', layout);

  /* ----------------------------------------------------------
     Start on the cover
     ---------------------------------------------------------- */
  setLang(LANG, false);
  layout();
  // Paint the palace behind the doors once the cover has appeared.
  setTimeout(function () { story.classList.add('is-warm'); }, 2600);
  applyMood(SLIDES[startIndex].mood);
  setZoom(ZOOM, false);
  tick();
  setInterval(tick, 1000);
})();
