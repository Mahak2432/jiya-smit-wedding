/*
  The couple, the peacock and the opening doors.

  - The couple walks in hand in hand, seen from the side: the groom in an ivory-champagne sherwani,
    the bride in a blush-pink lehenga, both in the palace's own colours.
  - The peacock perches on a ledge, its head dipping now and then.
  - The cover is a pair of carved sandstone doors under a marigold toran, with bougainvillea at
    the corners, Ganesha in a lotus medallion at the top, a lotus mandala across the middle that
    holds the couple's names, and a carved ledge at the foot where two peacocks face a brass kalash.

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
      rad('cd-disc', [[0, '#FFFAF3', 0.96], [0.88, '#FFF6EA', 0.9], [1, '#FFF6EA', 0]]) +
      lin('cd-brass', [[0, '#7C5518'], [0.22, '#C3933F'], [0.42, '#F6DE98'], [0.6, '#D2A24C'], [1, '#76501A']]) +
      rad('cd-coconut', [[0, '#A87244'], [0.65, '#704527'], [1, '#4A2C17']], { cx: 0.4, cy: 0.35 }) +
      rad('cd-flame', [[0, '#FFF8D6'], [0.5, '#FFD25A'], [1, '#F08A1E']], { cx: 0.5, cy: 0.75, r: 0.7 }) +
      rad('cd-halo', [[0, '#FFD27A', 0.55], [1, '#FFD27A', 0]]) +
      rad('cd-stud', [[0, '#FFF3C4'], [0.45, '#D8B25F'], [1, '#86601C']], { cx: 0.35, cy: 0.35 }) +
      lin('cd-shade', [[0, '#6E4630', 0.3], [1, '#6E4630', 0]], { x2: 0, y2: 1 }) +
      // Peacock.
      lin('p-pk-body', [[0, '#123C8F'], [0.45, '#2266CC'], [1, '#0E3378']], { x2: 0.6, y2: 1 }) +
      lin('p-pk-neck', [[0, '#1D58C2'], [0.6, '#1E6FCB'], [1, '#178C9A']], { x2: 0, y2: 1 }) +
      lin('p-pk-wing', [[0, '#DE9A5E'], [0.5, '#B86A34'], [1, '#8A4A22']], { x2: 0.4, y2: 1 }) +
      lin('p-vane', [[0, '#2E6A3E', 0.92], [0.5, '#4A8C44', 0.9], [0.85, '#8FA83E', 0.9], [1, '#D6B84A', 0.88]], { x2: 0, y2: 1 }) +
      '<pattern id="p-barbs" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(28)"><line x1="0" y1="0" x2="0" y2="4" stroke="#C3DA92" stroke-width=".5" opacity=".55"/></pattern>' +
      '<pattern id="p-scales" patternUnits="userSpaceOnUse" width="6" height="5"><path d="M0 5 A3 3 0 0 1 6 5" fill="none" stroke="#7FC4F4" stroke-width=".6" opacity=".45"/></pattern>' +
      '<pattern id="p-scales-g" patternUnits="userSpaceOnUse" width="7" height="6"><path d="M0 6 A3.5 3.5 0 0 1 7 6" fill="none" stroke="#F2D27A" stroke-width=".8" opacity=".7"/></pattern>' +
      '<pattern id="p-wing-scale" patternUnits="userSpaceOnUse" width="8" height="7"><path d="M0 7 A4 4 0 0 1 8 7" fill="none" stroke="#6E3414" stroke-width=".9" opacity=".7"/><path d="M-4 3.5 A4 4 0 0 1 4 3.5 M4 3.5 A4 4 0 0 1 12 3.5" fill="none" stroke="#F6BE86" stroke-width=".5" opacity=".55"/></pattern>' +
      '<symbol id="p-feather" overflow="visible">' +
        '<path d="M0 0 C5 40 10 110 12 160 C13 184 8 198 0 202 C-8 198 -13 184 -12 160 C-10 110 -5 40 0 0Z" fill="url(#p-vane)"/>' +
        '<path d="M0 0 C5 40 10 110 12 160 C13 184 8 198 0 202 C-8 198 -13 184 -12 160 C-10 110 -5 40 0 0Z" fill="url(#p-barbs)"/>' +
        '<path d="M0 0 L0 196" stroke="#E2DCA8" stroke-width=".8" opacity=".55"/>' +
      '</symbol>' +
      '<symbol id="p-eye" overflow="visible">' +
        '<path d="M0 -17 C10 -12 13 2 9 10 C6 16 -6 16 -9 10 C-13 2 -10 -12 0 -17Z" fill="#D4924E"/>' +
        '<ellipse cy="2" rx="8.6" ry="10.6" fill="#2BA39A"/>' +
        '<ellipse cy="2.5" rx="6.6" ry="8.2" fill="#2C6FD6"/>' +
        '<path d="M0 -3 C4 -2 4.6 4 2.4 7.5 C1.2 9.4 -1.2 9.4 -2.4 7.5 C-4.6 4 -4 -2 0 -3Z" fill="#13246E"/>' +
        '<ellipse cx="-1.4" cy="0.6" rx="1.2" ry="1.8" fill="#9BE0F0" opacity=".6"/>' +
      '</symbol>' +
      // The couple: faces, hair, and fabrics in the palace's colours.
      rad('p-face', [[0, '#FBDCC4'], [0.6, '#F0C3A2'], [1, '#D69C78']], { cx: 0.42, cy: 0.4, r: 0.68 }) +
      lin('p-skin2', [[0, '#E8B590'], [0.5, '#F4CEB0'], [1, '#D59D7A']]) +
      lin('p-hair-b', [[0, '#6E482C'], [0.5, '#4C2F1C'], [1, '#2E1C10']], { x2: 0.3, y2: 1 }) +
      lin('p-ivory2', [[0, '#D8C6A6'], [0.35, '#FBF4E6'], [0.7, '#F0E3CA'], [1, '#CDB892']]) +
      lin('p-champ', [[0, '#CBB089'], [0.25, '#F2E3C7'], [0.55, '#FAF0DC'], [0.8, '#E6D2AE'], [1, '#C2A577']]) +
      lin('p-blush', [[0, '#E9AFBC'], [0.5, '#F6D2D9'], [1, '#E3A2B1']]) +
      lin('p-rose', [[0, '#B85A76'], [0.5, '#D9809A'], [1, '#B25470']]) +
      lin('p-rosecholi', [[0, '#C4637F'], [0.5, '#E18AA2'], [1, '#BD5C79']]) +
      lin('p-leh2', [[0, '#E58BA2'], [0.55, '#EFA3B6'], [0.72, '#F6D6D6'], [1, '#FBEDE2']], { x2: 0, y2: 1 }) +
      lin('p-leh-shade', [[0, '#7A2440', 0.3], [0.22, '#7A2440', 0], [0.78, '#7A2440', 0], [1, '#7A2440', 0.3]]) +
      lin('p-dup2', [[0, '#F4B6C6', 0.72], [1, '#E994AA', 0.55]], { x2: 0, y2: 1 }) +
      lin('p-zari', [[0, '#A97F30'], [0.3, '#EED58E'], [0.55, '#C9A04B'], [0.8, '#F5E1A6'], [1, '#9B7429']], { x2: 0, y2: 1 }) +
      rad('p-pearl', [[0, '#FFFFFF'], [0.6, '#F1ECE4'], [1, '#C9C0B4']], { cx: 0.35, cy: 0.35 }) +
      '<pattern id="p-zari-pat" patternUnits="userSpaceOnUse" width="16" height="16"><path d="M0 8 Q4 2 8 8 T16 8" stroke="#8C6620" stroke-width="1.2" fill="none" opacity=".6"/><circle cx="8" cy="13" r="1.5" fill="#FFF4CC" opacity=".8"/><circle cx="0" cy="3" r="1" fill="#C9708A" opacity=".8"/></pattern>' +
      '<pattern id="p-motif" patternUnits="userSpaceOnUse" width="30" height="34"><g fill="none" stroke="#C9A04B" stroke-width="1.1" opacity=".85"><path d="M15 5 C19.5 8.5 19.5 14 15 17.5 C10.5 14 10.5 8.5 15 5Z"/><path d="M15 17.5 C9 17.5 6.5 22 8 25.5 M15 17.5 C21 17.5 23.5 22 22 25.5"/></g><circle cx="15" cy="11.5" r="1.5" fill="#E2C27A"/><circle cx="0" cy="30" r="1.2" fill="#D4AE5E"/><circle cx="30" cy="30" r="1.2" fill="#D4AE5E"/></pattern>' +
      '</defs>';
  }

  /* ---------- the peacock ----------
     Perched in profile on a ledge, facing left: a slim cobalt neck that turns teal at the base, white
     face patches and a blue-tipped crest, copper wing coverts, and a long train of fine feathers
     with ringed eyes draped down over the stone. Its head dips now and then (the .pk-head animation). */
  function peacock(x, y, sc, flip) {
    var s = '', r = rng(91);
    var feathers = [];
    for (var k = 0; k < 46; k++) feathers.push({ len: 0.45 + r() * 1.25, ox: 40 + r() * 20, oy: -96 + r() * 12, ang: -15 + r() * 17 });
    feathers.sort(function (a, b) { return b.len - a.len; });
    var train = '';
    feathers.forEach(function (f) {
      var L = 196 * f.len, th = f.ang * Math.PI / 180;
      train += el('use', { href: '#p-feather', transform: 'translate(' + n(f.ox) + ' ' + n(f.oy) + ') rotate(' + n(f.ang) + ') scale(' + n(0.7 + f.len * 0.12) + ' ' + n(f.len) + ')' });
      train += el('use', { href: '#p-eye', transform: 'translate(' + n(f.ox - L * Math.sin(th)) + ' ' + n(f.oy + L * Math.cos(th)) + ') rotate(' + n(f.ang) + ') scale(' + n(0.62 + f.len * 0.12) + ')' });
    });
    for (k = 0; k < 26; k++) {
      var ox = 42 + r() * 18, len = 120 + r() * 220, ang = (-14 + r() * 16) * Math.PI / 180;
      train += S('M' + n(ox) + ' -90 q' + n(-len * Math.sin(ang) * 0.5 + 4) + ' ' + n(len * 0.5) + ' ' + n(-len * Math.sin(ang)) + ' ' + n(len), r() > 0.5 ? '#A9C86E' : '#E0C060', 0.6, { opacity: 0.45 });
    }
    s += el('ellipse', { cx: 30, cy: 12, rx: 50, ry: 6, fill: '#3A1E10', opacity: 0.28, filter: 'url(#p-blur4)' });
    s += train;
    s += S('M-6 -76 L-9 -40 L-6 -2 M12 -78 L12 -40 L14 -2', '#C9A35A', 4.6);
    s += S('M-6 -2 l-14 1 M-6 -2 l-4 3 M-6 -2 l6 2 M14 -2 l-14 1 M14 -2 l-4 3 M14 -2 l6 2', '#B89256', 3.2);
    // Bronze-gold scaled feathers where the train begins.
    s += P('M18 -134 C40 -134 58 -116 62 -94 L46 -84 C42 -100 32 -118 18 -134Z', '#B98A2E') + P('M18 -134 C40 -134 58 -116 62 -94 L46 -84 C42 -100 32 -118 18 -134Z', 'url(#p-scales-g)');
    var body = 'M-34 -98 C-42 -122 -34 -148 -14 -158 C6 -166 30 -158 44 -140 C56 -124 58 -104 48 -90 C34 -76 8 -72 -10 -76 C-24 -80 -31 -88 -34 -98Z';
    s += P(body, 'url(#p-pk-body)') + P(body, 'url(#p-scales)');
    // Wing: copper coverts in rows of scallops, darker flight feathers.
    var wing = 'M-16 -144 C6 -152 34 -146 50 -128 C60 -114 58 -98 50 -90 C34 -86 12 -88 -4 -98 C-16 -106 -22 -126 -16 -144Z';
    s += P(wing, 'url(#p-pk-wing)') + P(wing, 'url(#p-wing-scale)');
    s += P('M22 -98 C38 -104 54 -100 66 -88 C54 -82 38 -82 22 -88Z', '#8A4A22') + S('M28 -92 L60 -88 M30 -96 L58 -93', '#5A2E12', 0.8, { opacity: 0.7 });
    var neck = 'M-34 -112 C-44 -140 -42 -176 -49 -206 C-53 -222 -59 -234 -57 -246 C-55 -257 -43 -259 -39 -249 C-35 -237 -37 -221 -33 -201 C-27 -173 -20 -150 -10 -132Z';
    var head = P(neck, 'url(#p-pk-neck)') + P(neck, 'url(#p-scales)');
    head += S('M-40 -140 C-46 -170 -44 -198 -50 -224', '#7FC2F4', 1.6, { opacity: 0.5 });
    head += el('ellipse', { cx: -51, cy: -252, rx: 10, ry: 8.6, fill: '#1A55AE' });
    head += P('M-60 -255.5 L-77 -251 L-60 -246.5Z', '#C9B48E') + P('M-60 -251 L-77 -251 L-62 -246.5Z', '#A8956F');
    head += P('M-61 -258 C-58 -261 -51 -261 -47 -257 C-51 -254.5 -57 -254.5 -61 -258Z', '#FFFFFF');
    head += S('M-59.5 -248.6 q5.2 3 11 0.4', '#FFFFFF', 2.3);
    head += C(-55, -255.6, 1.9, '#0E0906') + C(-55.6, -256.2, 0.55, '#FFFFFF');
    for (k = 0; k < 13; k++) {
      var ca = (-122 + k * 6.2) * Math.PI / 180, cl = 26 + Math.sin(k / 12 * Math.PI) * 6;
      var tx = -49 + Math.cos(ca) * cl, ty = -260 + Math.sin(ca) * cl;
      head += S('M-49 -260 L' + n(tx) + ' ' + n(ty), '#DCE6F2', 0.8);
      head += el('ellipse', { cx: n(tx), cy: n(ty), rx: 2.4, ry: 3.4, fill: '#2563C8', transform: 'rotate(' + n(ca * 180 / Math.PI + 90) + ' ' + n(tx) + ' ' + n(ty) + ')' });
    }
    s += g({ class: 'pk-head' }, head);
    return g({ class: 'peacock', transform: 'translate(' + x + ' ' + y + ') scale(' + (flip ? -sc : sc) + ' ' + sc + ')' }, s);
  }

  /* ---------- the couple ----------
     Walking in from the right, hand in hand, seen from the side and turned a little towards us:
     the groom ahead in an ivory-champagne sherwani with gold work, a blush inner panel and a
     dusty-rose stole; the bride behind in a blush-pink lehenga that fades to ivory, with rose-gold
     motifs, a gold border and a sheer pink dupatta over her head. Feet rest on y = 0. */
  function limb(pts, ws) {
    var left = [], right = [];
    for (var i = 0; i < pts.length; i++) {
      var a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
      var nx = -dy / L, ny = dx / L;
      left.push([pts[i][0] + nx * ws[i], pts[i][1] + ny * ws[i]]);
      right.push([pts[i][0] - nx * ws[i], pts[i][1] - ny * ws[i]]);
    }
    var all = left.concat(right.reverse());
    return 'M' + all.map(function (p) { return n(p[0]) + ' ' + n(p[1]); }).join(' L') + 'Z';
  }

  // A big, friendly eye: white, a brown iris with two catch-lights, and a dark upper lid.
  function eyeBig(x, y, rx, ry, look, lashes, side) {
    var s = el('ellipse', { cx: x, cy: y, rx: rx, ry: ry, fill: '#FFFFFF' });
    s += el('ellipse', { cx: n(x + look), cy: n(y + 1), rx: n(rx * 0.78), ry: n(ry * 0.76), fill: '#7A4622' });
    s += el('ellipse', { cx: n(x + look), cy: n(y + 1), rx: n(rx * 0.54), ry: n(ry * 0.52), fill: '#43230E' });
    s += el('ellipse', { cx: n(x + look), cy: n(y + 1.5), rx: n(rx * 0.3), ry: n(ry * 0.3), fill: '#150804' });
    s += C(x + look + rx * 0.3, y - ry * 0.28, n(rx * 0.27), '#FFFFFF');
    s += C(x + look - rx * 0.3, y + ry * 0.34, n(rx * 0.12), '#FFFFFF', { opacity: 0.85 });
    s += S('M' + n(x - rx - 1) + ' ' + n(y + 1.5) + ' C' + n(x - rx * 0.6) + ' ' + n(y - ry * 1.28) + ' ' + n(x + rx * 0.6) + ' ' + n(y - ry * 1.28) + ' ' + n(x + rx + 1) + ' ' + n(y - 0.5), '#2A140A', lashes ? 2.8 : 2.2);
    if (lashes) {
      var ox = x + side * (rx + 0.5);
      s += S('M' + n(ox) + ' ' + n(y - 1) + ' l' + n(side * 4.2) + ' -3.2 M' + n(ox - side * 3) + ' ' + n(y - ry * 0.8) + ' l' + n(side * 3) + ' -3.6', '#2A140A', 1.6);
    }
    return s;
  }

  function groomFig() {
    var s = '';
    // Legs in ivory churidar with gathers at the ankle, and gold juttis with curled toes.
    function leg(cls, c, base, far) {
      var t = '';
      t += P('M' + (c - 16) + ' -300 L' + (c + 16) + ' -300 C' + (c + 15) + ' -220 ' + (c + 12) + ' -110 ' + (c + 10) + ' -24 L' + (c - 10) + ' -24 C' + (c - 12) + ' -110 ' + (c - 15) + ' -220 ' + (c - 16) + ' -300Z', far ? '#DCCBAD' : 'url(#p-ivory2)');
      for (var k = 0; k < 5; k++) t += S('M' + (c - 10) + ' ' + (-34 - k * 9) + ' q10 -4 20 0', '#C2AA82', 1.2, { opacity: 0.85 });
      t += P('M' + (c - 11) + ' -26 L' + (c + 11) + ' -26 C' + (c + 14) + ' -14 ' + (c + 13) + ' -4 ' + (c + 9) + ' 2 L' + (c - 26) + ' 2 C' + (c - 36) + ' 2 ' + (c - 40) + ' -6 ' + (c - 34) + ' -10 C' + (c - 40) + ' -14 ' + (c - 38) + ' -18 ' + (c - 31) + ' -15 C' + (c - 24) + ' -12 ' + (c - 16) + ' -18 ' + (c - 11) + ' -26Z', far ? '#A8823E' : 'url(#p-goldmetal)');
      t += S('M' + (c - 30) + ' -6 C' + (c - 18) + ' -10 ' + (c - 6) + ' -10 ' + (c + 6) + ' -7', '#7A5418', 1.3);
      return g({ class: 'leg ' + cls, 'data-pivot': c + ' -300', 'data-base': base, transform: 'rotate(' + base + ' ' + c + ' -300)' }, t);
    }
    s += leg('leg--b', -50, -8, true);
    s += leg('leg--f', -90, 7, false);
    // The arm reaching back to hold her hand.
    var back = limb([[-38, -466], [-16, -412], [4, -358]], [13, 11, 9]);
    s += P(back, 'url(#p-ivory2)') + P(back, 'url(#p-motif)', { opacity: 0.5 });
    s += P(limb([[0, -366], [4, -356]], [10, 10]), 'url(#p-zari)');
    s += P('M-4 -356 C2 -360 12 -358 17 -352 C21 -346 19 -338 13 -336 C7 -335 2 -339 -2 -345Z', 'url(#p-skin2)');
    // Sherwani: ivory-champagne with gold work, a blush inner panel and gold borders.
    var coat = 'M-110 -482 C-124 -470 -130 -440 -128 -410 C-126 -380 -124 -350 -124 -330 C-126 -290 -132 -240 -140 -172 C-100 -164 -50 -164 -14 -172 C-18 -240 -22 -290 -24 -330 C-22 -360 -20 -400 -20 -430 C-20 -458 -26 -476 -40 -484 C-60 -492 -92 -490 -110 -482Z';
    s += P(coat, 'url(#p-champ)') + P(coat, 'url(#p-motif)', { opacity: 0.75 });
    s += S('M-60 -330 C-58 -280 -56 -220 -52 -172 M-36 -330 C-34 -280 -30 -220 -26 -174', '#B39466', 1.2, { opacity: 0.5 });
    var panel = 'M-92 -484 L-80 -484 C-82 -420 -84 -320 -86 -170 L-128 -172 C-122 -260 -112 -360 -104 -420 C-100 -450 -96 -470 -92 -484Z';
    s += P(panel, 'url(#p-blush)') + P(panel, 'url(#p-zari-pat)', { opacity: 0.55 });
    s += S('M-80 -484 C-82 -420 -84 -320 -86 -170', 'url(#p-zari)', 8);
    s += S('M-140 -172 C-100 -164 -50 -164 -14 -172', 'url(#p-zari)', 11);
    s += S('M-138 -184 C-100 -176 -50 -176 -16 -184', '#C9A04B', 1.2, { 'stroke-dasharray': '2 4' });
    [-468, -446, -424, -402, -380, -358].forEach(function (y, i) { s += C(-91 - i * 0.6, y, 2.6, 'url(#p-goldmetal)'); });
    // Gold embroidery on the chest and at the hem.
    s += S('M-50 -440 C-40 -452 -30 -446 -32 -436 C-34 -428 -44 -428 -46 -436 M-62 -230 C-50 -246 -36 -240 -38 -226 C-40 -216 -52 -216 -54 -226', '#B48A3C', 1.4);
    // Stole: dusty rose with a gold border, hanging from the shoulder.
    s += P('M-60 -492 C-46 -470 -42 -420 -44 -340 L-66 -336 C-64 -420 -66 -468 -76 -490Z', 'url(#p-rose)');
    s += S('M-62 -490 C-48 -468 -44 -420 -46 -342 M-74 -490 C-64 -468 -62 -420 -64 -338', 'url(#p-zari)', 2.2);
    for (var fr = 0; fr < 6; fr++) s += S('M' + n(-64 + fr * 3.6) + ' -337 l0 12', '#D9B460', 1.1);
    s += P('M-94 -496 C-84 -490 -64 -490 -54 -496 L-54 -484 C-64 -478 -84 -478 -94 -484Z', 'url(#p-zari)');
    // The arm swinging forward.
    var front = limb([[-112, -470], [-128, -412], [-134, -358]], [14, 12, 10]);
    s += P(front, 'url(#p-ivory2)') + P(front, 'url(#p-motif)', { opacity: 0.5 });
    s += P(limb([[-133, -368], [-134, -356]], [11, 11]), 'url(#p-zari)');
    s += P('M-144 -356 C-138 -360 -128 -360 -124 -354 C-120 -346 -124 -336 -132 -333 C-140 -332 -146 -340 -146 -348Z', 'url(#p-skin2)');
    // Head.
    s += P('M-84 -508 L-84 -480 L-58 -480 L-58 -508Z', 'url(#p-skin2)') + P('M-84 -508 L-58 -508 L-58 -494 C-66 -490 -76 -490 -84 -494Z', '#9A6044', { opacity: 0.3 });
    s += el('ellipse', { cx: -22, cy: -560, rx: 8, ry: 14, fill: '#E3AE8A' }) + S('M-21 -568 C-17 -564 -17 -556 -21 -552', '#B97E5C', 1.4);
    s += P('M-120 -590 C-122 -560 -116 -534 -102 -517 C-92 -506 -80 -501 -70 -501 C-58 -501 -45 -507 -36 -519 C-26 -534 -22 -560 -24 -590 C-26 -612 -44 -626 -72 -626 C-100 -626 -118 -612 -120 -590Z', 'url(#p-face)');
    s += P('M-122 -580 C-128 -614 -108 -650 -74 -656 C-40 -660 -16 -640 -18 -604 C-18 -594 -20 -584 -24 -576 C-28 -594 -40 -606 -54 -610 C-66 -604 -88 -604 -100 -610 C-110 -604 -118 -594 -122 -580Z', 'url(#p-hair-b)');
    s += P('M-112 -612 C-102 -644 -66 -652 -40 -638 C-62 -634 -84 -626 -98 -610Z', '#7A5234', { opacity: 0.85 });
    s += S('M-100 -630 C-84 -642 -64 -644 -48 -636 M-92 -620 C-80 -630 -64 -632 -52 -626', '#9A6E48', 1.2, { opacity: 0.7 });
    s += el('ellipse', { cx: -110, cy: -534, rx: 8, ry: 6, fill: '#E58A78', opacity: 0.2 }) + el('ellipse', { cx: -48, cy: -534, rx: 9, ry: 6, fill: '#E58A78', opacity: 0.2 });
    s += eyeBig(-98, -560, 8, 10.2, -2, false) + eyeBig(-63, -560, 9, 10.5, -2, false);
    s += S('M-108 -579 Q-99 -584 -89 -580', '#4A2E1B', 3) + S('M-73 -580 Q-62 -585 -52 -579', '#4A2E1B', 3);
    s += S('M-83 -547 C-87 -540 -90 -535 -85 -532 C-82 -531 -79 -532 -78 -534', '#C08262', 1.6);
    s += P('M-95 -521 Q-81 -508 -67 -521 Q-81 -514 -95 -521Z', '#FFFFFF') + S('M-96 -521.5 Q-81 -507 -66 -521.5', '#8A4434', 2) + S('M-98 -523 l-2 -2 M-64 -523 l2 -2', '#B97E5C', 1.2);
    return s;
  }

  function brideFig() {
    var s = '';
    // The far arm, at her side behind the lehenga.
    s += P(limb([[130, -454], [146, -404], [152, -356]], [10, 8.5, 7.5]), 'url(#p-skin2)');
    s += P('M144 -356 C150 -360 158 -358 161 -352 C163 -346 160 -338 154 -337 C148 -337 144 -342 143 -348Z', 'url(#p-skin2)');
    // The dupatta falling behind her.
    s += P('M138 -598 C162 -580 170 -520 176 -440 C186 -320 198 -200 206 -64 L172 -60 C166 -200 156 -320 150 -430 C146 -490 146 -550 132 -590Z', 'url(#p-dup2)');
    s += S('M138 -598 C162 -580 170 -520 176 -440 C186 -320 198 -200 206 -64', 'url(#p-zari)', 4);
    // Lehenga: blush pink fading to ivory, rose-gold motifs, an embroidered ivory band and a gold border.
    var SK = 'M62 -388 C44 -320 22 -200 6 -20 C6 -8 12 0 24 2 C80 10 160 10 200 -2 C212 -6 216 -14 214 -24 C196 -180 160 -320 130 -388Z';
    var det = '';
    for (var i = 0; i < 10; i++) {
      var w0 = 62 + 68 * i / 10, w1 = 62 + 68 * (i + 1) / 10, h0 = 4 + 214 * i / 10, h1 = 4 + 214 * (i + 1) / 10;
      det += P('M' + n(w0) + ' -388 Q' + n(w0 + (h0 - w0) * 0.4) + ' -200 ' + n(h0) + ' 20 L' + n(h1) + ' 20 Q' + n(w1 + (h1 - w1) * 0.4) + ' -200 ' + n(w1) + ' -388Z', i % 2 ? '#FFFFFF' : '#8E3A55', { opacity: i % 2 ? 0.14 : 0.08 });
    }
    det += el('rect', { x: 0, y: -392, width: 230, height: 270, fill: 'url(#p-motif)' });
    det += P('M-10 -126 C80 -116 160 -116 230 -128 L230 -120 C160 -108 80 -108 -10 -118Z', 'url(#p-zari)');
    for (var ax = -4; ax < 230; ax += 34) {
      det += P('M' + ax + ' -36 L' + ax + ' -84 Q' + (ax + 15) + ' -110 ' + (ax + 30) + ' -84 L' + (ax + 30) + ' -36Z', '#E792A8', { stroke: '#C9A04B', 'stroke-width': 1.4, opacity: 0.9 });
      det += P('M' + (ax + 15) + ' -80 C' + (ax + 20) + ' -72 ' + (ax + 20) + ' -62 ' + (ax + 15) + ' -54 C' + (ax + 10) + ' -62 ' + (ax + 10) + ' -72 ' + (ax + 15) + ' -80Z', '#E2BE6A');
    }
    det += P('M-10 -26 C80 -14 160 -14 230 -30 L230 30 L-10 30Z', 'url(#p-zari)') + P('M-10 -20 C80 -8 160 -8 230 -24 L230 30 L-10 30Z', 'url(#p-zari-pat)', { opacity: 0.8 });
    det += el('rect', { x: 0, y: -392, width: 230, height: 420, fill: 'url(#p-leh-shade)' });
    s += '<g class="skirt" data-waist="-388">' + P(SK, 'url(#p-leh2)') + '<clipPath id="pc-sk3"><path d="' + SK + '"/></clipPath>' + g({ 'clip-path': 'url(#pc-sk3)' }, det) +
      S('M6 -20 C6 -8 12 0 24 2 C80 10 160 10 200 -2', '#8C6620', 2, { opacity: 0.45 }) + '</g>';
    s += P('M62 -394 L130 -394 L130 -384 L62 -384Z', 'url(#p-zari)');
    // Midriff and choli.
    s += P('M63 -404 L129 -404 L129 -392 L63 -392Z', 'url(#p-skin2)');
    var choli = 'M66 -466 C56 -458 52 -440 56 -420 C58 -412 60 -406 62 -402 L130 -402 C134 -418 136 -440 132 -458 C126 -468 110 -472 96 -472 C84 -472 74 -470 66 -466Z';
    s += P(choli, 'url(#p-rosecholi)') + P(choli, 'url(#p-motif)', { opacity: 0.7 });
    s += P('M60 -410 L132 -410 L131 -402 L61 -402Z', 'url(#p-zari)');
    // The arm reaching forward to hold his hand: a short sleeve, bangles, henna.
    s += P(limb([[68, -458], [56, -430]], [12, 11]), 'url(#p-rosecholi)') + P(limb([[57, -434], [55, -428]], [11, 11]), 'url(#p-zari)');
    s += P(limb([[56, -432], [42, -398], [16, -356]], [10, 9, 7.5]), 'url(#p-skin2)');
    for (var b = 0; b < 6; b++) {
      var t = 0.55 + b * 0.07, bx = 42 + (16 - 42) * t, by = -398 + (-356 + 398) * t;
      s += S('M' + n(bx - 7) + ' ' + n(by - 5) + ' L' + n(bx + 7) + ' ' + n(by + 5), b % 3 === 1 ? '#F3E1C4' : (b % 3 === 0 ? '#D9B460' : '#D9708C'), 3.2);
    }
    s += P('M18 -362 C12 -362 4 -358 2 -352 C0 -346 4 -340 10 -340 C16 -340 20 -346 22 -352Z', 'url(#p-skin2)') + S('M6 -350 c3 -2 7 -2 9 1', '#A85A35', 0.9);
    // Neck and jewellery.
    s += P('M86 -492 L86 -468 L108 -468 L108 -492Z', 'url(#p-skin2)') + P('M86 -492 L108 -492 L108 -482 C100 -479 92 -479 86 -482Z', '#9A6044', { opacity: 0.28 });
    s += P('M84 -474 C92 -466 102 -466 110 -474 L110 -466 C102 -458 92 -458 84 -466Z', 'url(#p-goldmetal)');
    s += S('M82 -466 C84 -446 94 -436 97 -436 C100 -436 110 -446 112 -466', 'url(#p-goldmetal)', 2.4);
    s += C(97, -434, 3.4, '#2E8C6A') + C(90, -462, 1.6, '#D9708C') + C(97, -460, 1.6, '#2E8C6A') + C(104, -462, 1.6, '#D9708C');
    // Head: hair, face, a maang tikka and jhumkas.
    s += P('M100 -600 C130 -604 156 -584 158 -548 C160 -520 156 -496 150 -480 L124 -500 C130 -530 128 -560 118 -578Z', '#3E2616');
    s += P('M136 -566 C147 -548 153 -514 149 -478 C147 -469 140 -467 138 -473 C142 -500 140 -530 133 -556Z M58 -566 C47 -548 41 -514 45 -478 C47 -469 54 -467 56 -473 C52 -500 54 -530 61 -556Z', 'url(#p-hair-b)');
    s += P('M46 -560 C42 -598 64 -626 98 -626 C132 -626 152 -598 148 -560 C142 -584 126 -596 98 -596 C70 -596 54 -584 46 -560Z', 'url(#p-hair-b)');
    s += P('M52 -568 C50 -540 56 -516 70 -500 C79 -490 89 -486 98 -486 C109 -486 120 -492 128 -503 C138 -518 142 -542 140 -568 C138 -592 122 -606 96 -606 C70 -606 54 -592 52 -568Z', 'url(#p-face)');
    s += P('M58 -566 C62 -590 80 -600 98 -598 C116 -600 132 -590 136 -566 C130 -584 116 -592 98 -590 C80 -592 64 -584 58 -566Z', 'url(#p-hair-b)');
    s += S('M98 -624 L98 -598', '#2E1C10', 1.2);
    s += el('ellipse', { cx: 61, cy: -520, rx: 8, ry: 6, fill: '#E8808E', opacity: 0.24 }) + el('ellipse', { cx: 121, cy: -520, rx: 9, ry: 6, fill: '#E8808E', opacity: 0.24 });
    s += eyeBig(73, -546, 8.6, 11.2, -2, true, -1) + eyeBig(108, -546, 9.5, 11.5, -2, true, 1);
    s += S('M63 -564 Q73 -569 82 -565', '#3A2416', 2) + S('M98 -565 Q108 -569 118 -564', '#3A2416', 2);
    s += S('M89 -530 C87 -524 85 -520 88 -518 C90 -517 93 -518 94 -519', '#C08262', 1.4);
    s += C(85.5, -519.5, 2.2, 'none', { stroke: 'url(#p-goldmetal)', 'stroke-width': 1.1 });
    s += P('M79 -505 Q90 -494 101 -505 Q90 -500 79 -505Z', '#D65A72') + S('M79 -505.5 Q90 -500 101 -505.5', '#A83A52', 1.2);
    s += S('M98 -598 L97 -590', 'url(#p-goldmetal)', 1.4) + P('M97 -592 C101 -588 101 -582 97 -578 C93 -582 93 -588 97 -592Z', 'url(#p-goldmetal)') + C(97, -585, 1.8, '#2E8C6A');
    [[49, -528], [145, -528]].forEach(function (j) {
      var x = j[0], y = j[1];
      s += C(x, y, 3, 'url(#p-goldmetal)') + P('M' + (x - 8) + ' ' + (y + 18) + ' C' + (x - 8) + ' ' + (y + 5) + ' ' + (x + 8) + ' ' + (y + 5) + ' ' + (x + 8) + ' ' + (y + 18) + 'Z', 'url(#p-goldmetal)');
      for (var jp = 0; jp < 5; jp++) s += C(x - 7 + jp * 3.5, y + 20, 1.3, jp % 2 ? '#D9708C' : 'url(#p-pearl)');
    });
    // The dupatta over her head, with a gold border at its edge.
    s += P('M56 -586 C66 -630 130 -642 152 -602 C160 -586 162 -566 160 -546 L148 -550 C148 -570 144 -588 134 -600 C114 -620 76 -616 66 -588Z', 'url(#p-dup2)');
    s += S('M66 -588 C76 -616 114 -620 134 -600 C144 -588 148 -570 148 -550', 'url(#p-zari)', 4);
    return s;
  }

  // The couple as one group, with its ground shadow, that the opening walk can move.
  function coupleGroup(x, y, sc) {
    var body = el('ellipse', { cx: 10, cy: 6, rx: 200, ry: 14, fill: '#3A1E10', opacity: 0.26, filter: 'url(#p-blur10)' }) +
      g({ class: 'groom' }, groomFig()) + g({ class: 'bride' }, brideFig());
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

  // A small eight-petalled rosette in gold.
  function rosette(cx, cy, r) {
    var s = '';
    for (var p = 0; p < 8; p++) {
      var an = p * Math.PI / 4, px = cx + Math.cos(an) * r, py = cy + Math.sin(an) * r;
      s += el('ellipse', { cx: n(px), cy: n(py), rx: n(r * 0.66), ry: n(r * 0.33), fill: '#B48A3C', opacity: 0.8, transform: 'rotate(' + n(an * 180 / Math.PI) + ' ' + n(px) + ' ' + n(py) + ')' });
    }
    return s + C(cx, cy, n(r * 0.45), '#CFA453');
  }

  // A lotus mandala painted across both doors, centred on MC. The couple's names sit in its plain
  // middle; when the doors open it parts down the middle. The outer ring of petals turns very slowly.
  var MC = [500, 790];
  function mandala() {
    var cx = MC[0], cy = MC[1], s = '', k;
    function around(count, step, fn) { var t = ''; for (var i = 0; i < count; i++) t += g({ transform: 'rotate(' + n(i * step) + ' ' + cx + ' ' + cy + ')' }, fn()); return t; }
    function at(dx, dy) { return n(cx + dx) + ' ' + n(cy + dy); }
    s += C(cx, cy, 256, 'url(#cd-disc)');
    // The broad inner lotus.
    s += around(16, 22.5, function () {
      return P('M' + at(-44, -236) + ' C' + at(-44, -266) + ' ' + at(-16, -284) + ' ' + at(0, -298) + ' C' + at(16, -284) + ' ' + at(44, -266) + ' ' + at(44, -236) + 'Z', 'rgba(255, 246, 232, 0.6)', { stroke: '#B48A3C', 'stroke-width': 1.6 }) +
        S('M' + at(-26, -238) + ' C' + at(-24, -258) + ' ' + at(-10, -272) + ' ' + at(0, -282) + ' C' + at(10, -272) + ' ' + at(24, -258) + ' ' + at(26, -238), '#C9A04B', 1, { opacity: 0.75 }) +
        C(cx, cy - 254, 3.2, '#C9A04B');
    });
    s += around(16, 22.5, function () { return C(cx, cy - 292, 2.6, '#B48A3C', { transform: 'rotate(11.25 ' + cx + ' ' + cy + ')' }); });
    s += C(cx, cy, 236, 'none', { stroke: 'url(#cd-gold)', 'stroke-width': 2.4 }) + C(cx, cy, 227, 'none', { stroke: '#C9A04B', 'stroke-width': 0.8, opacity: 0.8 });
    s += C(cx, cy, 304, 'none', { stroke: '#B48A3C', 'stroke-width': 1.1, opacity: 0.85 });
    var dots = '';
    for (k = 0; k < 64; k++) { var an = k * Math.PI / 32; dots += C(cx + Math.cos(an) * 311, cy + Math.sin(an) * 311, 2.4, '#B48A3C', { opacity: 0.85 }); }
    // The slim outer petals, turning.
    var outer = around(32, 11.25, function () {
      return P('M' + at(-27, -318) + ' C' + at(-27, -336) + ' ' + at(-9, -344) + ' ' + at(0, -358) + ' C' + at(9, -344) + ' ' + at(27, -336) + ' ' + at(27, -318) + 'Z', 'rgba(255, 246, 232, 0.35)', { stroke: '#B48A3C', 'stroke-width': 1.3 }) +
        S('M' + at(0, -322) + ' L' + at(0, -346), '#C9A04B', 0.9, { opacity: 0.7 }) +
        C(cx, cy - 346, 2, '#B48A3C', { transform: 'rotate(5.625 ' + cx + ' ' + cy + ')' });
    });
    return s + g({ class: 'md-turn' }, dots + C(cx, cy, 317, 'none', { stroke: '#B48A3C', 'stroke-width': 0.8, opacity: 0.7 }) + outer);
  }

  // A carved stone ledge across the doors, which the peacocks and the kalash stand on, and the
  // door panels below it with brass studs.
  var LEDGE = 1640;
  function ledge() {
    var y = LEDGE, s = '', x;
    s += el('rect', { x: 86, y: y + 52, width: 828, height: 46, fill: 'url(#cd-shade)' });
    s += P('M78 ' + y + ' L922 ' + y + ' L910 ' + (y + 12) + ' L90 ' + (y + 12) + 'Z', '#FCF0E0', { stroke: '#B48A3C', 'stroke-width': 1.4 });
    s += el('rect', { x: 90, y: y + 12, width: 820, height: 40, fill: '#EDC3A2', stroke: '#B48A3C', 'stroke-width': 1.4 });
    for (x = 104; x + 24 <= 898; x += 31) {
      s += P('M' + x + ' ' + (y + 46) + ' L' + x + ' ' + (y + 28) + ' Q' + x + ' ' + (y + 18) + ' ' + (x + 12) + ' ' + (y + 17) + ' Q' + (x + 24) + ' ' + (y + 18) + ' ' + (x + 24) + ' ' + (y + 28) + ' L' + (x + 24) + ' ' + (y + 46) + 'Z',
        'rgba(170, 110, 72, 0.2)', { stroke: '#B48A3C', 'stroke-width': 0.9 });
    }
    s += S('M90 ' + (y + 52) + ' L910 ' + (y + 52), 'url(#cd-gold)', 2.4);
    [170, 330, 670, 830].forEach(function (cx) {
      s += P('M' + (cx - 16) + ' ' + (y + 53) + ' L' + (cx + 16) + ' ' + (y + 53) + ' C' + (cx + 14) + ' ' + (y + 70) + ' ' + (cx + 6) + ' ' + (y + 82) + ' ' + cx + ' ' + (y + 90) + ' C' + (cx - 6) + ' ' + (y + 82) + ' ' + (cx - 14) + ' ' + (y + 70) + ' ' + (cx - 16) + ' ' + (y + 53) + 'Z', 'url(#cd-gold)');
    });
    [[150, 462], [538, 850]].forEach(function (p) {
      var mid = (p[0] + p[1]) / 2, w = p[1] - p[0];
      s += el('rect', { x: p[0], y: 1746, width: w, height: 90, rx: 4, fill: 'rgba(255, 246, 234, 0.4)', stroke: '#B48A3C', 'stroke-width': 1.6 });
      s += el('rect', { x: p[0] + 10, y: 1756, width: w - 20, height: 70, rx: 2, fill: 'none', stroke: '#B48A3C', 'stroke-width': 0.8, opacity: 0.7 });
      s += rosette(mid, 1791, 15);
      [52, 90, 128].forEach(function (d) { s += C(mid - d, 1791, 5, 'url(#cd-stud)') + C(mid + d, 1791, 5, 'url(#cd-stud)'); });
    });
    return s;
  }

  // The doors: sandstone with a faint jaali, a cusped arch, paisleys, the lotus mandala across the
  // middle, and the carved ledge and studded panels at the foot.
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
    [[58, 58], [942, 58], [58, 1842], [942, 1842]].forEach(function (c) { s += rosette(c[0], c[1], 9); });
    // The seam where the two doors meet, broken where the mandala's plain centre carries the names.
    var gapA = MC[1] - 238, gapB = MC[1] + 238;
    s += el('rect', { x: 498, y: 40, width: 4, height: gapA - 40, fill: '#B98564', opacity: 0.55 }) + el('rect', { x: 498, y: gapB, width: 4, height: 1860 - gapB, fill: '#B98564', opacity: 0.55 });
    s += S('M494 40 L494 ' + gapA + ' M506 40 L506 ' + gapA + ' M494 ' + gapB + ' L494 1860 M506 ' + gapB + ' L506 1860', '#B48A3C', 1, { opacity: 0.45 });
    s += mandala() + ledge();
    return s + '</svg>';
  }

  // A marigold, as strung in the toran and heaped at the kalash.
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

  // A toran of mango leaves and marigolds across the top of the doors.
  function toran() {
    var s = '<svg viewBox="0 0 1000 190" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">';
    function rope(t) { return [-20 + 1040 * t, 24 + 30 * t * (1 - t)]; }
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

  // Ganesha in a lotus medallion under the toran, set on the point of the arch.
  function crest(ganeshaSvg) {
    var cx = 500, cy = 80, k;
    var s = '<svg viewBox="0 0 1000 170" aria-hidden="true" focusable="false" overflow="visible">';
    for (k = 0; k < 16; k++) {
      s += P('M' + (cx - 11) + ' ' + (cy - 54) + ' C' + (cx - 11) + ' ' + (cy - 62) + ' ' + (cx - 5) + ' ' + (cy - 68) + ' ' + cx + ' ' + (cy - 73) + ' C' + (cx + 5) + ' ' + (cy - 68) + ' ' + (cx + 11) + ' ' + (cy - 62) + ' ' + (cx + 11) + ' ' + (cy - 54) + 'Z',
        'url(#cd-ivory)', { stroke: '#B48A3C', 'stroke-width': 1.2, transform: 'rotate(' + (k * 22.5) + ' ' + cx + ' ' + cy + ')' });
    }
    s += C(cx, cy, 56, 'url(#cd-ivory)', { stroke: 'url(#cd-gold)', 'stroke-width': 3 });
    s += C(cx, cy, 48, 'none', { stroke: '#C9A04B', 'stroke-width': 1 });
    s += ganeshaSvg.replace('<svg ', '<svg x="' + (cx - 36) + '" y="' + (cy - 38) + '" width="72" height="72" color="#7A5518"').replace('stroke-width="2.4"', 'stroke-width="3.6"');
    return s + '</svg>';
  }

  // A brass kalash on the ledge: mango leaves, a coconut, a sacred thread and a kumkum band,
  // with marigolds at its foot. Drawn standing on (0, 0).
  function kalash() {
    var s = '', k;
    s += el('ellipse', { cx: 0, cy: -2, rx: 74, ry: 7, fill: '#3A1E10', opacity: 0.22, filter: 'url(#p-blur4)' });
    [-58, -44, 44, 58].forEach(function (x, i) { s += marigold(x, -9, 10, i % 2); });
    s += marigold(-50, -24, 9, 0) + marigold(50, -24, 9, 1);
    s += P('M-26 0 L26 0 L20 -11 L-20 -11Z', 'url(#p-goldmetal)');
    var pot = 'M-22 -11 C-64 -16 -66 -80 -30 -94 L30 -94 C66 -80 64 -16 22 -11Z';
    s += P(pot, 'url(#cd-brass)');
    s += P('M-38 -30 C-50 -46 -46 -72 -28 -86 C-38 -70 -42 -52 -38 -30Z', '#FFF4D0', { opacity: 0.45 });
    s += S('M-57 -54 Q0 -42 57 -54', '#B8323A', 6) + S('M-58 -61 Q0 -49 58 -61 M-56 -47 Q0 -35 56 -47', '#E8C36A', 1.4);
    for (k = -4; k <= 4; k++) s += C(k * 12, -48 + Math.abs(k) * 0.4 - (k * k) * 0.1, 1.6, '#FFF1C9');
    s += P('M-24 -94 L24 -94 L19 -110 L-19 -110Z', 'url(#cd-brass)');
    s += S('M-22 -99 L22 -99', '#C8283A', 2.6) + S('M-21 -103.5 L21 -103.5', '#E8A10E', 2);
    // Mango leaves fanning out of the mouth.
    [-66, -42, -18, 18, 42, 66].forEach(function (a, i) {
      s += g({ transform: 'translate(0 -112) rotate(' + a + ')' },
        P('M0 0 C11 -14 11 -40 0 -58 C-11 -40 -11 -14 0 0Z', 'url(#cd-leaf)') + S('M0 -4 L0 -52', '#A9C98A', 1, { opacity: 0.65 }));
    });
    s += el('ellipse', { cx: 0, cy: -112, rx: 36, ry: 7, fill: 'url(#p-goldmetal)' });
    s += el('ellipse', { cx: 0, cy: -138, rx: 24, ry: 28, fill: 'url(#cd-coconut)' });
    s += S('M-6 -163 C-2 -174 -4 -182 -9 -188 M2 -165 C4 -176 8 -182 12 -186 M-1 -164 C0 -176 0 -182 -1 -190', '#5C381F', 1.8);
    s += S('M-22 -128 Q0 -120 22 -128', '#C8283A', 2.2) + S('M-21 -124 Q0 -116 21 -124', '#E8A10E', 1.6);
    return s;
  }

  // A clay diya, its spout to the right, standing on (0, 0).
  function diya(i) {
    var s = '';
    s += C(28, -32, 44, 'url(#cd-halo)', { class: 'flicker', style: 'animation-delay:' + (-0.5 * i) + 's' });
    s += P('M-26 -14 C-24 0 -10 3 2 3 C16 3 26 -2 34 -15 C20 -9 -12 -9 -26 -14Z', '#B4572E');
    s += S('M-24 -14 C-10 -10 18 -10 32 -15', '#E0A15C', 2);
    s += P('M28 -50 C37 -36 35 -21 28 -17 C21 -21 19 -36 28 -50Z', 'url(#cd-flame)', { class: 'flame', style: 'animation-delay:' + (-0.3 * i) + 's' });
    return s;
  }

  // On the ledge at the foot of the doors: two peacocks facing the kalash, with a diya either side.
  // The drawing starts at y 1300 of the doors, so the ledge top (1640) is at 340.
  function base() {
    var y = LEDGE - 1300;
    var s = '<svg viewBox="0 0 1000 600" aria-hidden="true" focusable="false" overflow="visible">';
    s += peacock(232, y, 0.78, true) + peacock(768, y, 0.78, false);
    s += g({ transform: 'translate(388 ' + y + ')' }, diya(0)) + g({ transform: 'translate(612 ' + y + ') scale(-1 1)' }, diya(1));
    s += g({ transform: 'translate(500 ' + y + ')' }, kalash());
    return s + '</svg>';
  }

  return { defs: defs, peacock: peacock, couple: coupleGroup, doors: doors, toran: toran, crest: crest, base: base, flora: flora };
})();
