/*
  The couple, the peacock and the opening doors.

  - The couple and the peacock are the illustrations in assets/figures (cut out of their
    backgrounds), placed into the palace as SVG images.
  - The cover is a pair of carved sandstone doors under a marigold toran, with bougainvillea at
    the corners and a plaque of Ganesha and the couple's monogram between two peacocks.

  Drawn in the same "bay units" as art.js (an arch bay is 1000 x 1900).
*/
window.FIGURES = (function () {
  'use strict';

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function n(v) { return Math.round(v * 10) / 10; }
  function attrs(o) {
    var s = '';
    for (var k in o) if (o[k] !== undefined && o[k] !== null) s += ' ' + k + '="' + o[k] + '"';
    return s;
  }
  function el(tag, o, inner) { return '<' + tag + attrs(o) + (inner === undefined ? '/>' : '>' + inner + '</' + tag + '>'); }
  function g(o, inner) { return el('g', o, inner); }
  function P(d, fill, o) { return el('path', Object.assign({ d: d, fill: fill }, o || {})); }
  function S(d, stroke, w, o) { return el('path', Object.assign({ d: d, fill: 'none', stroke: stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, o || {})); }
  function C(cx, cy, r, fill, o) { return el('circle', Object.assign({ cx: n(cx), cy: n(cy), r: r, fill: fill }, o || {})); }
  function stops(list) {
    return list.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] !== undefined ? ' stop-opacity="' + s[2] + '"' : '') + '/>'; }).join('');
  }
  function lin(id, list, o) { return '<linearGradient id="' + id + '"' + attrs(Object.assign({ x1: 0, y1: 0, x2: 1, y2: 0 }, o || {})) + '>' + stops(list) + '</linearGradient>'; }
  function rad(id, list, o) { return '<radialGradient id="' + id + '"' + attrs(o || {}) + '>' + stops(list) + '</radialGradient>'; }
  function qpt(a, c, b, t) { var u = 1 - t; return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]; }
  function cpt(p0, p1, p2, p3, t) {
    var u = 1 - t;
    return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
            u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
  }
  // Beads (pearls, stones) strung along a curve.
  function beads(a, c, b, count, r, fill) {
    var s = '';
    for (var k = 0; k <= count; k++) { var p = qpt(a, c, b, k / count); s += C(p[0], p[1], r, fill || 'url(#p-pearl)'); }
    return s;
  }
  var uid = 0;

  /* ---------- shared definitions (inserted once, used by the palace and the cover) ---------- */
  function defs() {
    return '<defs>' +
      '<filter id="p-blur10" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>' +
      '<filter id="p-blur4" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>' +
      lin('p-goldmetal', [[0, '#8E6420'], [0.35, '#F4DA92'], [0.6, '#C29540'], [1, '#7C5518']]) +
      // Cover: carved sandstone doors with gold, in the palace's own colours.
      lin('cd-wine', [[0, '#F7E0CC'], [0.35, '#F3D2B7'], [0.7, '#EEC5A6'], [1, '#E5B593']], { x2: 0, y2: 1 }) +
      rad('cd-glow', [[0, '#FFF8EE', 0.75], [0.5, '#FFF8EE', 0.25], [1, '#FFF8EE', 0]], { cx: 0.5, cy: 0.44, r: 0.6 }) +
      lin('cd-gold', [[0, '#8E6622'], [0.3, '#B48A3C'], [0.5, '#A97F30'], [0.72, '#E2C27A'], [1, '#86601C']], { x2: 1, y2: 1 }) +
      '<pattern id="cd-jaali" patternUnits="userSpaceOnUse" width="60" height="60"><path d="M30 8 C34 18 42 26 52 30 C42 34 34 42 30 52 C26 42 18 34 8 30 C18 26 26 18 30 8Z" fill="none" stroke="#C98B68" stroke-width="1" opacity=".3"/><circle cx="30" cy="30" r="2.2" fill="#C98B68" opacity=".3"/><circle cx="0" cy="0" r="1.8" fill="#C98B68" opacity=".25"/><circle cx="60" cy="0" r="1.8" fill="#C98B68" opacity=".25"/><circle cx="0" cy="60" r="1.8" fill="#C98B68" opacity=".25"/><circle cx="60" cy="60" r="1.8" fill="#C98B68" opacity=".25"/></pattern>' +
      lin('cd-leaf', [[0, '#5C8F3C'], [1, '#2E5A26']], { x2: 0, y2: 1 }) +
      lin('cd-ivory', [[0, '#FBF2E1'], [1, '#EFDDBE']], { x2: 0, y2: 1 }) +
      '</defs>';
  }

  /* ---------- the peacock and the couple ---------- */
  var PEACOCK = { src: 'assets/figures/peacock.webp', w: 495, h: 502, footX: 0.78 };
  var COUPLE = { src: 'assets/figures/couple.webp', w: 389, h: 523 };

  // A peacock standing with its feet at (x, y), about 330 units tall at sc = 1, its tail spread
  // behind it. It faces right when flip is true and left otherwise.
  function peacock(x, y, sc, flip) {
    var h = 330, w = h * PEACOCK.w / PEACOCK.h;
    var shadow = el('ellipse', { cx: n(-w * 0.28), cy: 3, rx: n(w * 0.46), ry: 10, fill: '#3A1E10', opacity: 0.22, filter: 'url(#p-blur4)' });
    var img = el('image', { href: PEACOCK.src, x: n(-w * PEACOCK.footX), y: -h, width: n(w), height: h });
    return g({ class: 'peacock', transform: 'translate(' + x + ' ' + y + ') scale(' + (flip ? sc : -sc) + ' ' + sc + ')' }, shadow + img);
  }

  // The couple standing with their feet at (x, y), about 640 units tall at sc = 1, as one group
  // (with its ground shadow) that the opening can bring in.
  function coupleGroup(x, y, sc) {
    var h = 640, w = h * COUPLE.w / COUPLE.h;
    var body = el('ellipse', { cx: 0, cy: 4, rx: n(w * 0.46), ry: 14, fill: '#3A1E10', opacity: 0.28, filter: 'url(#p-blur10)' }) +
      el('image', { href: COUPLE.src, x: n(-w / 2), y: -h, width: n(w), height: h });
    return g({ class: 'couple', transform: 'translate(' + x + ' ' + y + ') scale(' + sc + ')' }, g({ class: 'couple-body' }, body));
  }

  // Bougainvillea spilling from the top corners of the doors, in the palace's pinks. One corner is
  // drawn from a few reusable blossoms and leaves, and mirrored for the other.
  function flora() {
    var r = rng(77);
    var tones = [['#D3698F', '#EDA3BC'], ['#C2527E', '#E58AAE'], ['#A9466F', '#D3698F'], ['#E07FA2', '#F4C1D2']];
    var sym = '';
    tones.forEach(function (c, i) {
      var t = '';
      for (var k = 0; k < 3; k++) t += P('M0 0 C-7 -4 -9 -14 -4 -18 C-1 -20 1 -20 4 -18 C9 -14 7 -4 0 0Z', k === 1 ? c[1] : c[0], { transform: 'rotate(' + (k * 120) + ')' });
      sym += '<symbol id="cv-b' + i + '" overflow="visible">' + t + C(0, 0, 2.2, '#FFF4D6') + '</symbol>';
    });
    sym += '<symbol id="cv-l0" overflow="visible">' + P('M0 0 C6 -7 18 -7 27 0 C18 7 6 7 0 0Z', '#4F8650') + S('M3 0 L23 0', '#8DB57E', 0.8) + '</symbol>';
    sym += '<symbol id="cv-l1" overflow="visible">' + P('M0 0 C6 -7 18 -7 27 0 C18 7 6 7 0 0Z', '#3F7444') + S('M3 0 L23 0', '#7FA870', 0.8) + '</symbol>';
    function use(id, x, y, sc, rot) { return el('use', { href: '#' + id, transform: 'translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(rot) + ') scale(' + n(sc) + ')' }); }
    var stem = [[-30, 6], [60, 70], [150, 90], [120, 220], [70, 330], [40, 440]];
    function at(t) {
      var f = t * (stem.length - 1), i = Math.min(stem.length - 2, Math.floor(f)), u = f - i;
      return [stem[i][0] + (stem[i + 1][0] - stem[i][0]) * u, stem[i][1] + (stem[i + 1][1] - stem[i][1]) * u];
    }
    var side = S('M-30 6 C30 50 140 60 150 90 C160 130 120 200 100 260 C80 320 60 360 40 440', '#6B4A33', 3.2) +
      S('M150 90 C190 100 230 96 260 80 M100 260 C130 270 150 300 160 330', '#6B4A33', 2);
    var k, t, p, spread;
    for (k = 0; k < 55; k++) {
      t = Math.pow(r(), 1.5); p = at(t); spread = 70 * (1 - t) + 22;
      side += use('cv-l' + (k % 2), p[0] + (r() - 0.4) * spread, p[1] + (r() - 0.5) * spread * 0.8, 0.8 + r() * 0.5, r() * 360);
    }
    for (k = 0; k < 95; k++) {
      t = Math.pow(r(), 1.7); p = at(t); spread = 80 * (1 - t) + 20;
      side += use('cv-b' + Math.floor(r() * 4), p[0] + (r() - 0.35) * spread, p[1] + (r() - 0.5) * spread * 0.8, 0.75 + r() * 0.55, r() * 120);
    }
    for (k = 0; k < 10; k++) side += use('cv-b' + Math.floor(r() * 4), 200 + r() * 70, 60 + r() * 40, 0.7 + r() * 0.3, r() * 120);
    return '<svg viewBox="0 0 1000 520" aria-hidden="true" focusable="false" overflow="visible"><defs>' + sym + '</defs>' +
      '<g id="cv-flora">' + side + '</g>' + el('use', { href: '#cv-flora', transform: 'translate(1000 0) scale(-1 1)' }) + '</svg>';
  }

  /* ---------- the cover ---------- */
  // A paisley (kairi) with a scrolling vine, in gold line.
  function paisley(x, y, sc, flip) {
    var s = '';
    s += S('M0 0 C-30 -10 -44 -46 -26 -72 C-10 -94 22 -90 30 -66 C36 -48 24 -34 10 -38 C0 -41 -2 -54 8 -58', '#B48A3C', 2.2);
    s += S('M-6 -12 C-26 -22 -32 -46 -20 -62 C-8 -78 14 -76 20 -60', '#B48A3C', 1.2, { opacity: 0.7 });
    s += S('M0 0 C30 12 70 6 96 -20 C110 -34 130 -36 140 -24', '#B48A3C', 1.6);
    s += S('M48 4 C52 -10 62 -16 72 -14 M88 -12 C86 -26 92 -36 104 -38', '#B48A3C', 1.3);
    s += P('M60 -14 C66 -24 78 -26 84 -18 C76 -12 66 -10 60 -14Z', '#B48A3C', { opacity: 0.6 });
    s += C(4, -52, 3.2, '#B48A3C') + C(140, -24, 2.6, '#B48A3C') + C(-36, -18, 2, '#B48A3C') + C(-44, -36, 1.6, '#B48A3C');
    return g({ transform: 'translate(' + x + ' ' + y + ') scale(' + (flip ? -sc : sc) + ' ' + sc + ')' }, s);
  }

  // A Rajasthani palace in fine gold line, standing along the foot of the doors.
  function palaceLine() {
    var s = '', ln = { fill: 'rgba(255, 247, 238, 0.45)', stroke: '#B48A3C', 'stroke-width': 1.5, 'stroke-linejoin': 'round' };
    function dome(cx, base, w, h) {
      return P('M' + (cx - w / 2) + ' ' + base + ' C' + (cx - w / 2) + ' ' + (base - h * 0.55) + ' ' + (cx - w * 0.12) + ' ' + (base - h * 0.7) + ' ' + cx + ' ' + (base - h) +
        ' C' + (cx + w * 0.12) + ' ' + (base - h * 0.7) + ' ' + (cx + w / 2) + ' ' + (base - h * 0.55) + ' ' + (cx + w / 2) + ' ' + base + 'Z', ln.fill, ln) +
        S('M' + cx + ' ' + (base - h) + ' l0 ' + (-h * 0.28), '#B48A3C', 1.5) + C(cx, base - h * 1.3, 2.2, '#B48A3C');
    }
    function arches(x0, x1, base, h, count) {
      var w = (x1 - x0) / count, t = '';
      for (var k = 0; k < count; k++) {
        var a = x0 + k * w + w * 0.18, b = x0 + (k + 1) * w - w * 0.18, m = (a + b) / 2;
        t += P('M' + n(a) + ' ' + base + ' L' + n(a) + ' ' + n(base - h * 0.6) + ' Q' + n(a) + ' ' + n(base - h) + ' ' + n(m) + ' ' + n(base - h) + ' Q' + n(b) + ' ' + n(base - h) + ' ' + n(b) + ' ' + n(base - h * 0.6) + ' L' + n(b) + ' ' + base + 'Z', 'rgba(201, 139, 104, 0.18)', { stroke: '#B48A3C', 'stroke-width': 1.1 });
      }
      return t;
    }
    function chhatri(cx, base, w) {
      return el('rect', Object.assign({ x: cx - w / 2, y: base - 4, width: w, height: 4 }, ln)) +
        S('M' + (cx - w * 0.38) + ' ' + (base - 4) + ' l0 -' + (w * 0.7) + ' M' + (cx + w * 0.38) + ' ' + (base - 4) + ' l0 -' + (w * 0.7), '#B48A3C', 1.3) +
        el('rect', Object.assign({ x: cx - w * 0.55, y: base - 4 - w * 0.7 - 5, width: w * 1.1, height: 5 }, ln)) +
        dome(cx, base - 9 - w * 0.7, w * 0.95, w * 0.75);
    }
    // Wings, towers and the central block.
    s += el('rect', Object.assign({ x: 176, y: 1690, width: 210, height: 140 }, ln)) + el('rect', Object.assign({ x: 614, y: 1690, width: 210, height: 140 }, ln));
    s += arches(176, 386, 1830, 64, 5) + arches(614, 824, 1830, 64, 5);
    s += arches(176, 386, 1752, 40, 7) + arches(614, 824, 1752, 40, 7);
    s += S('M170 1690 L392 1690 M608 1690 L830 1690 M170 1760 L392 1760 M608 1760 L830 1760', '#B48A3C', 1.4);
    [214, 290, 350, 650, 710, 786].forEach(function (x, i) { s += i % 3 === 1 ? chhatri(x, 1690, 30) : dome(x, 1690, 22, 20); });
    s += el('rect', Object.assign({ x: 134, y: 1640, width: 42, height: 190 }, ln)) + el('rect', Object.assign({ x: 824, y: 1640, width: 42, height: 190 }, ln));
    s += dome(155, 1640, 40, 46) + dome(845, 1640, 40, 46);
    s += el('rect', Object.assign({ x: 386, y: 1606, width: 228, height: 224 }, ln));
    s += P('M452 1830 L452 1730 C452 1694 476 1676 500 1666 C524 1676 548 1694 548 1730 L548 1830Z', 'rgba(201, 139, 104, 0.24)', { stroke: '#B48A3C', 'stroke-width': 1.5 });
    s += S('M466 1830 L466 1734 C466 1706 484 1692 500 1684 C516 1692 534 1706 534 1734 L534 1830', '#B48A3C', 1);
    s += arches(392, 448, 1700, 40, 1) + arches(552, 608, 1700, 40, 1) + arches(392, 448, 1790, 40, 1) + arches(552, 608, 1790, 40, 1);
    s += S('M380 1606 L620 1606 M386 1640 L614 1640', '#B48A3C', 1.4);
    s += dome(500, 1606, 150, 110) + chhatri(404, 1606, 34) + chhatri(596, 1606, 34);
    s += S('M110 1830 L890 1830', '#B48A3C', 2);
    return s;
  }

  // The doors: wine lacquer, a gold jaali, a cusped arch, paisleys and the palace in gold line.
  function doors() {
    var s = '<svg viewBox="0 0 1000 1900" preserveAspectRatio="none" aria-hidden="true" focusable="false">';
    s += el('rect', { width: 1000, height: 1900, fill: 'url(#cd-wine)' });
    s += el('rect', { width: 1000, height: 1900, fill: 'url(#cd-jaali)' });
    s += el('rect', { width: 1000, height: 1900, fill: 'url(#cd-glow)' });
    s += el('rect', { x: 26, y: 26, width: 948, height: 1848, fill: 'none', stroke: 'url(#cd-gold)', 'stroke-width': 3 });
    s += el('rect', { x: 40, y: 40, width: 920, height: 1820, fill: 'none', stroke: '#B48A3C', 'stroke-width': 1, opacity: 0.55 });
    // The arch, with a scalloped (cusped) inner line.
    s += S('M90 1846 L90 620 C90 380 270 215 470 190 Q490 182 500 160 Q510 182 530 190 C730 215 910 380 910 620 L910 1846', 'url(#cd-gold)', 3.2);
    s += S('M112 1846 L112 622 C112 398 284 238 474 212 Q492 205 500 186 Q508 205 526 212 C716 238 888 398 888 622 L888 1846', '#B48A3C', 1.2, { opacity: 0.8 });
    var p0 = [132, 640], p1 = [132, 420], p2 = [298, 262], p3 = [478, 236], pts = [];
    for (var k = 0; k <= 12; k++) pts.push(cpt(p0, p1, p2, p3, k / 12));
    pts.push([500, 214]);
    for (k = 12; k >= 0; k--) pts.push([1000 - pts[k][0], pts[k][1]]);
    var cusp = 'M132 1846 L132 640';
    for (k = 1; k < pts.length; k++) {
      var a = pts[k - 1], b = pts[k], r = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.62;
      cusp += ' A' + n(r) + ' ' + n(r) + ' 0 0 1 ' + n(b[0]) + ' ' + n(b[1]);
    }
    cusp += ' L868 1846';
    s += S(cusp, '#B48A3C', 1.6, { opacity: 0.85 });
    for (k = 1; k < pts.length - 1; k++) s += C(pts[k][0] + (pts[k][0] < 500 ? 6 : -6), pts[k][1] + 7, 2, '#B48A3C', { opacity: 0.8 });
    // Paisleys in the spandrels.
    s += paisley(150, 340, 0.95, false) + paisley(850, 340, 0.95, true);
    // Corner rosettes.
    [[58, 58], [942, 58], [58, 1842], [942, 1842]].forEach(function (c) {
      for (var p = 0; p < 8; p++) {
        var an = p * Math.PI / 4;
        s += el('ellipse', { cx: n(c[0] + Math.cos(an) * 9), cy: n(c[1] + Math.sin(an) * 9), rx: 6, ry: 3, fill: '#B48A3C', opacity: 0.8, transform: 'rotate(' + n(an * 180 / Math.PI) + ' ' + n(c[0] + Math.cos(an) * 9) + ' ' + n(c[1] + Math.sin(an) * 9) + ')' });
      }
      s += C(c[0], c[1], 4, '#CFA453');
    });
    s += palaceLine();
    // The seam where the two doors meet.
    s += el('rect', { x: 498, y: 40, width: 4, height: 1820, fill: '#B98564', opacity: 0.55 });
    s += S('M494 40 L494 1860 M506 40 L506 1860', '#B48A3C', 1, { opacity: 0.45 });
    return s + '</svg>';
  }

  // A toran of mango leaves and marigolds across the top of the doors.
  function toran() {
    var s = '<svg viewBox="0 0 1000 190" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">';
    function rope(t) { return [-20 + 1040 * t, 24 + 30 * t * (1 - t)]; }
    function marigold(x, y, r, tone) {
      var t = '';
      t += C(x, y, r, tone ? '#E9850E' : '#E8A10E');
      for (var p = 0; p < 10; p++) {
        var an = p * Math.PI / 5;
        t += C(x + Math.cos(an) * r * 0.72, y + Math.sin(an) * r * 0.72, n(r * 0.34), tone ? '#F7A529' : '#F7C437');
      }
      t += C(x, y, n(r * 0.42), tone ? '#FBBE4A' : '#FCD970') + C(x, y, n(r * 0.16), '#B65E07', { opacity: 0.6 });
      return t;
    }
    var leaves = '', flowers = '', strands = '';
    for (var k = 0; k <= 26; k++) {
      var t = k / 26, p = rope(t), len = 64 + (k % 2) * 16, ang = (k % 2 ? 4 : -4);
      leaves += g({ transform: 'translate(' + n(p[0]) + ' ' + n(p[1]) + ') rotate(' + ang + ')' },
        P('M0 0 C14 ' + n(len * 0.25) + ' 12 ' + n(len * 0.75) + ' 0 ' + len + ' C-12 ' + n(len * 0.75) + ' -14 ' + n(len * 0.25) + ' 0 0Z', 'url(#cd-leaf)') +
        S('M0 4 L0 ' + (len - 6), '#A9C98A', 1, { opacity: 0.6 }));
    }
    for (k = 0; k <= 52; k++) { var q = rope(k / 52); flowers += marigold(q[0], q[1], 9, k % 2); }
    [62, 187, 312, 437, 562, 687, 812, 937].forEach(function (x, i) {
      var top = 24 + 30 * ((x + 20) / 1040) * (1 - (x + 20) / 1040);
      strands += S('M' + x + ' ' + n(top) + ' L' + x + ' ' + n(top + 104), '#C99A3E', 1.2);
      for (var m = 0; m < 4; m++) strands += marigold(x, top + 22 + m * 22, 10, (m + i) % 2);
      strands += P('M' + (x - 5) + ' ' + n(top + 112) + ' L' + (x + 5) + ' ' + n(top + 112) + ' L' + x + ' ' + n(top + 128) + 'Z', 'url(#p-goldmetal)');
    });
    s += leaves + S('M-20 24 Q500 54 1020 24', '#B98A35', 4) + strands + flowers;
    return s + '</svg>';
  }

  // The plaque: Ganesha above the couple's monogram, between two peacocks perched on a ledge.
  function crest(ganeshaSvg, initials) {
    var s = '<svg viewBox="0 0 1000 700" aria-hidden="true" focusable="false" overflow="visible">';
    s += P('M40 430 L960 430 L946 446 L54 446Z', 'url(#cd-gold)');
    s += peacock(282, 431, 0.86, true) + peacock(718, 431, 0.86, false);
    [320, 500, 680].forEach(function (x) { s += P('M' + (x - 14) + ' 446 L' + (x + 14) + ' 446 C' + (x + 10) + ' 462 ' + (x + 2) + ' 470 ' + x + ' 474 C' + (x - 2) + ' 470 ' + (x - 10) + ' 462 ' + (x - 14) + ' 446Z', 'url(#cd-gold)'); });
    var body = 'M390 430 L390 250 C390 232 400 222 414 220 L586 220 C600 222 610 232 610 250 L610 430Z';
    var dome = 'M400 224 C400 170 450 140 480 120 C492 112 498 100 500 86 C502 100 508 112 520 120 C550 140 600 170 600 224Z';
    s += P(dome, 'url(#cd-ivory)', { stroke: 'url(#cd-gold)', 'stroke-width': 3 }) + P(body, 'url(#cd-ivory)', { stroke: 'url(#cd-gold)', 'stroke-width': 3 });
    s += P('M404 420 L404 254 C404 242 410 236 420 234 L580 234 C590 236 596 242 596 254 L596 420Z', 'none', { stroke: '#C9A04B', 'stroke-width': 1.2 });
    s += P('M492 86 C492 74 508 74 508 86 Z M496 74 C496 62 504 62 504 74Z', 'url(#cd-gold)') + S('M500 62 L500 46', '#C9A04B', 2) + C(500, 44, 3, '#C9A04B');
    s += ganeshaSvg.replace('<svg ', '<svg x="458" y="128" width="84" height="84" color="#86601C"');
    s += el('text', { x: 500, y: 352, 'text-anchor': 'middle', 'font-family': 'Cinzel, serif', 'font-size': 92, 'font-weight': 500, fill: '#6A1426', 'letter-spacing': 6 }, initials[0] + '<tspan fill="#B8892E" font-size="40" dy="-16" dx="10">&#x2726;</tspan><tspan dy="16" dx="10">' + initials[1] + '</tspan>');
    s += S('M440 384 L480 384 M520 384 L560 384', '#C9A04B', 1.4);
    s += P('M500 372 C495 378 495 390 500 396 C505 390 505 378 500 372Z', '#B8892E') + P('M500 396 C492 394 486 388 484 382 C491 383 497 388 500 396Z M500 396 C508 394 514 388 516 382 C509 383 503 388 500 396Z', '#B8892E', { opacity: 0.7 });
    return s + '</svg>';
  }

  return { defs: defs, peacock: peacock, couple: coupleGroup, doors: doors, toran: toran, crest: crest, flora: flora };
})();
