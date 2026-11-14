/*
  Illustrations, drawn as SVG in the flat Rajasthani-miniature style of the reference video.

  Everything is drawn in "bay units": one arch bay is 1000 wide and 1900 tall. Pillars stand on
  the bay edges (x = 0 and x = 1000), so bays repeat seamlessly along the palace colonnade.
  Each layer is drawn three bays wide (-1000 to 2000) so the camera can pan one bay either way.
*/
window.ART = (function () {
  'use strict';

  var C = {
    wall: '#F1CCAE', wallHi: '#F9E2CE', wallMid: '#EABD9C', wallLo: '#DFA683', line: '#C98B68',
    floor: '#F4D9C1', plinth: '#E9BA97',
    leafDeep: '#2E5A3E', leafDark: '#44744F', leafMid: '#5F915F', leafLight: '#87B079', leafHi: '#ADCB92',
    pink: '#D3698F', pinkLight: '#EDA3BC', pinkDeep: '#A9466F',
    water: '#55A3B6', waterDeep: '#2C6D85', waterHi: '#B4E0E4',
    gold: '#B48A3C', goldLight: '#DDBB72',
    haze1: '#E6D5C3', haze2: '#D9D9C5', haze3: '#CFCDB9',
  };

  /* ---------- helpers ---------- */
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
  function leafPath(w, l) { return 'M0 0 Q' + n(w / 2) + ' ' + n(-l / 2) + ' 0 ' + n(-l) + ' Q' + n(-w / 2) + ' ' + n(-l / 2) + ' 0 0Z'; }

  /* ---------- arch geometry ---------- */
  var XL = 80, YS = 760, YA = 250;
  var HALF = 500 - XL, RISE = YS - YA;
  var R0 = (HALF * HALF + RISE * RISE) / (2 * HALF);
  var CLX = XL + R0; // centre of the left arc (it sits right of the middle: a pointed arch)

  function pt(R, ph) { return [CLX + R * Math.cos(ph), YS - R * Math.sin(ph)]; }
  function apexAngle(R) { return Math.acos((500 - CLX) / R); }

  function curve(bx, R) {
    var s = pt(R, Math.PI), a = pt(R, apexAngle(R));
    return 'M' + n(bx + s[0]) + ' ' + n(s[1]) +
      ' A' + n(R) + ' ' + n(R) + ' 0 0 1 ' + n(bx + 500) + ' ' + n(a[1]) +
      ' A' + n(R) + ' ' + n(R) + ' 0 0 1 ' + n(bx + 1000 - s[0]) + ' ' + n(s[1]);
  }

  function scallopPts(R, lobes) {
    var ph = apexAngle(R), left = [], k;
    for (k = 0; k <= lobes; k++) left.push(pt(R, Math.PI + (ph - Math.PI) * k / lobes));
    var right = [];
    for (k = lobes - 1; k >= 0; k--) right.push([1000 - left[k][0], left[k][1]]);
    return left.concat(right);
  }

  // The cusped (multifoil) edge of the arch, as a run of "A" segments from springing to springing.
  function scallopBody(bx, R, lobes, bulge) {
    var p = scallopPts(R, lobes), d = '';
    for (var i = 1; i < p.length; i++) {
      var dx = p[i][0] - p[i - 1][0], dy = p[i][1] - p[i - 1][1];
      var r = Math.sqrt(dx * dx + dy * dy) * bulge;
      d += ' A' + n(r) + ' ' + n(r) + ' 0 0 1 ' + n(bx + p[i][0]) + ' ' + n(p[i][1]);
    }
    return { start: p[0], end: p[p.length - 1], body: d };
  }

  function scallop(bx, R, lobes, bulge) {
    var s = scallopBody(bx, R, lobes, bulge);
    return 'M' + n(bx + s.start[0]) + ' ' + n(s.start[1]) + s.body;
  }

  // The hole in the wall for one bay: the open sky and garden seen through the arch.
  function opening(bx) {
    var s = scallopBody(bx, R0, 7, 0.6);
    return 'M' + n(bx + XL) + ' 1600 L' + n(bx + XL) + ' ' + YS + s.body + ' L' + n(bx + 1000 - XL) + ' 1600Z';
  }

  function openings() { return opening(-1000) + opening(0) + opening(1000); }

  /* ---------- small ornaments ---------- */
  function rosette(cx, cy, r) {
    var g = '';
    for (var k = 0; k < 8; k++) {
      g += el('ellipse', { cx: 0, cy: n(-r * 0.52), rx: n(r * 0.26), ry: n(r * 0.48), transform: 'rotate(' + k * 45 + ')', fill: C.wallMid, stroke: C.line, 'stroke-width': 1.4 });
    }
    for (k = 0; k < 8; k++) {
      g += el('ellipse', { cx: 0, cy: n(-r * 0.36), rx: n(r * 0.12), ry: n(r * 0.22), transform: 'rotate(' + (k * 45 + 22.5) + ')', fill: C.wallLo });
    }
    g += el('circle', { r: n(r * 0.24), fill: C.wallHi, stroke: C.line, 'stroke-width': 1.4 });
    g += el('circle', { r: n(r * 0.09), fill: C.line });
    return el('g', { transform: 'translate(' + n(cx) + ' ' + n(cy) + ')' }, g);
  }

  function petalBand(bx, R, step) {
    var out = '', ph = apexAngle(R), span = Math.PI - ph, count = Math.floor(span * R / step);
    for (var k = 0; k < count; k++) {
      var a = Math.PI - span * (k + 0.5) / count;
      var p = pt(R, a), rot = 90 - a * 180 / Math.PI;
      var e = { rx: 7.5, ry: 15, fill: C.wallMid, stroke: C.line, 'stroke-width': 1.2 };
      out += el('ellipse', Object.assign({ cx: n(bx + p[0]), cy: n(p[1]), transform: 'rotate(' + n(rot) + ' ' + n(bx + p[0]) + ' ' + n(p[1]) + ')' }, e));
      out += el('ellipse', Object.assign({ cx: n(bx + 1000 - p[0]), cy: n(p[1]), transform: 'rotate(' + n(-rot) + ' ' + n(bx + 1000 - p[0]) + ' ' + n(p[1]) + ')' }, e));
    }
    return out;
  }

  function archDecor(bx) {
    var s = '';
    // The soffit: the thickness of the arch, seen as a deeper band right at the edge.
    s += el('path', { d: scallop(bx, R0, 7, 0.6), fill: 'none', stroke: C.wallMid, 'stroke-width': 30, 'stroke-linejoin': 'round' });
    s += el('path', { d: scallop(bx, R0 - 15, 7, 0.6), fill: 'none', stroke: C.line, 'stroke-width': 2.4, 'stroke-linejoin': 'round' });
    s += el('path', { d: scallop(bx, R0 + 15, 7, 0.6), fill: 'none', stroke: C.wallLo, 'stroke-width': 2, 'stroke-linejoin': 'round' });
    s += el('path', { d: scallop(bx, R0 + 38, 7, 0.6), fill: 'none', stroke: C.wallLo, 'stroke-width': 1.6, 'stroke-linejoin': 'round' });
    // Carved petal band.
    s += el('path', { d: curve(bx, R0 + 56), fill: 'none', stroke: C.line, 'stroke-width': 1.8 });
    s += petalBand(bx, R0 + 76, 27);
    s += el('path', { d: curve(bx, R0 + 96), fill: 'none', stroke: C.line, 'stroke-width': 1.8 });
    s += el('path', { d: curve(bx, R0 + 104), fill: 'none', stroke: C.wallLo, 'stroke-width': 3 });
    // Apex finial: a small lotus bud where the two halves meet.
    var a = pt(R0 + 104, apexAngle(R0 + 104));
    s += el('path', { d: 'M' + (bx + 500) + ' ' + n(a[1] - 4) + ' c -10 -10 -10 -22 0 -32 c 10 10 10 22 0 32Z', fill: C.wallMid, stroke: C.line, 'stroke-width': 1.4 });
    // Spandrel rosettes.
    s += rosette(bx + 150, 226, 42) + rosette(bx + 850, 226, 42);
    return s;
  }

  function frieze() {
    var s = el('rect', { x: -1000, y: 0, width: 3000, height: 124, fill: C.wallHi });
    s += el('rect', { x: -1000, y: 0, width: 3000, height: 26, fill: C.wallMid });
    s += el('line', { x1: -1000, y1: 30, x2: 2000, y2: 30, stroke: C.line, 'stroke-width': 1.6 });
    s += el('line', { x1: -1000, y1: 98, x2: 2000, y2: 98, stroke: C.line, 'stroke-width': 1.6 });
    for (var x = -1000; x < 2000; x += 50) {
      s += el('path', { d: 'M' + (x + 25) + ' 92 C' + (x + 8) + ' 80 ' + (x + 8) + ' 52 ' + (x + 25) + ' 38 C' + (x + 42) + ' 52 ' + (x + 42) + ' 80 ' + (x + 25) + ' 92Z', fill: C.wallMid, stroke: C.line, 'stroke-width': 1.2 });
      s += el('circle', { cx: x + 50, cy: 64, r: 3.2, fill: C.wallLo });
    }
    // Cornice ledge with its shadow.
    s += el('rect', { x: -1000, y: 102, width: 3000, height: 22, fill: C.wallHi, stroke: C.line, 'stroke-width': 1.4 });
    s += el('rect', { x: -1000, y: 124, width: 3000, height: 9, fill: C.wallLo, opacity: 0.55 });
    return s;
  }

  function pillar(x) {
    var s = '';
    // Pilaster above the capital, with a recessed panel.
    s += el('rect', { x: x - 72, y: 133, width: 144, height: 560, fill: C.wallHi });
    s += el('rect', { x: x - 52, y: 172, width: 104, height: 486, rx: 6, fill: C.wall, stroke: C.line, 'stroke-width': 1.4 });
    s += el('path', { d: 'M' + x + ' 360 l 24 54 l -24 54 l -24 -54Z', fill: C.wallMid, stroke: C.line, 'stroke-width': 1.3 });
    s += el('circle', { cx: x, cy: 414, r: 7, fill: C.wallLo });
    // Capital: abacus, lotus bracket, ring.
    s += el('rect', { x: x - 106, y: 686, width: 212, height: 22, fill: C.wallHi, stroke: C.line, 'stroke-width': 1.5 });
    s += el('path', { d: 'M' + (x - 98) + ' 708 C' + (x - 98) + ' 750 ' + (x - 76) + ' 762 ' + (x - 72) + ' 794 L' + (x + 72) + ' 794 C' + (x + 76) + ' 762 ' + (x + 98) + ' 750 ' + (x + 98) + ' 708Z', fill: C.wallMid, stroke: C.line, 'stroke-width': 1.5 });
    [-52, -18, 18, 52].forEach(function (dx) {
      s += el('path', { d: 'M' + (x + dx) + ' 712 c -12 14 -12 34 0 52 c 12 -18 12 -38 0 -52Z', fill: C.wallLo, opacity: 0.85 });
    });
    s += el('rect', { x: x - 78, y: 792, width: 156, height: 15, rx: 7, fill: C.wallHi, stroke: C.line, 'stroke-width': 1.4 });
    // Shaft.
    s += el('rect', { x: x - 66, y: 806, width: 132, height: 652, fill: C.wall });
    s += el('rect', { x: x + 26, y: 806, width: 40, height: 652, fill: C.wallMid, opacity: 0.75 });
    s += el('rect', { x: x - 52, y: 806, width: 10, height: 652, fill: C.wallHi, opacity: 0.7 });
    [-30, 0, 30].forEach(function (dx) {
      s += el('line', { x1: x + dx, y1: 820, x2: x + dx, y2: 1446, stroke: C.line, 'stroke-width': 1.6, opacity: 0.32 });
    });
    s += el('rect', { x: x - 74, y: 1088, width: 148, height: 26, rx: 5, fill: C.wallHi, stroke: C.line, 'stroke-width': 1.4 });
    for (var b = -60; b <= 60; b += 15) s += el('circle', { cx: x + b, cy: 1101, r: 3.6, fill: C.wallLo });
    // Base: pot-shaped moulding on a plinth block.
    s += el('path', { d: 'M' + (x - 66) + ' 1456 C' + (x - 100) + ' 1470 ' + (x - 100) + ' 1508 ' + (x - 82) + ' 1520 L' + (x + 82) + ' 1520 C' + (x + 100) + ' 1508 ' + (x + 100) + ' 1470 ' + (x + 66) + ' 1456Z', fill: C.wallMid, stroke: C.line, 'stroke-width': 1.5 });
    s += el('rect', { x: x - 88, y: 1518, width: 176, height: 14, rx: 4, fill: C.wallHi, stroke: C.line, 'stroke-width': 1.3 });
    s += el('rect', { x: x - 104, y: 1530, width: 208, height: 34, fill: C.wall, stroke: C.line, 'stroke-width': 1.5 });
    return s;
  }

  /* ---------- foliage ---------- */
  // A rounded flowering shrub made of many small leaves, lit from the upper left.
  function bushSymbol(id, seed, w, h, flowers) {
    var r = rng(seed), blobs = [], s = '', i;
    for (i = 0; i < 7; i++) {
      var bx = (r() - 0.5) * w * 0.7, rr = h * (0.32 + r() * 0.22);
      blobs.push([bx, -rr * 0.95 - r() * h * 0.25, rr]);
    }
    blobs.push([0, -h * 0.55, h * 0.45]);
    blobs.forEach(function (b) { s += el('circle', { cx: n(b[0]), cy: n(b[1]), r: n(b[2]), fill: C.leafDark }); });
    s += el('rect', { x: n(-w * 0.42), y: n(-h * 0.25), width: n(w * 0.84), height: n(h * 0.25), fill: C.leafDark });
    var leaves = Math.round(w * h / 260);
    for (i = 0; i < leaves; i++) {
      var b2 = blobs[Math.floor(r() * blobs.length)];
      var ang = r() * Math.PI * 2, dist = Math.sqrt(r()) * b2[2] * 0.95;
      var lx = b2[0] + Math.cos(ang) * dist, ly = b2[1] + Math.sin(ang) * dist;
      if (ly > -6) continue;
      var light = (-lx / w) * 0.6 + (-ly / h) * 0.9 + (r() - 0.5) * 0.5;
      var col = light > 0.85 ? C.leafHi : light > 0.45 ? C.leafLight : light > 0.1 ? C.leafMid : C.leafDark;
      var rot = Math.atan2(ly + h * 0.4, lx) * 180 / Math.PI + 90 + (r() - 0.5) * 70;
      var sz = 0.8 + r() * 0.5;
      s += el('path', { d: leafPath(11 * sz, 20 * sz), fill: col, transform: 'translate(' + n(lx) + ' ' + n(ly) + ') rotate(' + n(rot) + ')' });
    }
    if (flowers) {
      for (i = 0; i < flowers; i++) {
        var b3 = blobs[Math.floor(r() * blobs.length)];
        var a3 = r() * Math.PI * 2, d3 = Math.sqrt(r()) * b3[2] * 0.85;
        var fx = b3[0] + Math.cos(a3) * d3, fy = b3[1] + Math.sin(a3) * d3;
        if (fy > -20) continue;
        s += el('circle', { cx: n(fx), cy: n(fy), r: n(3 + r() * 2.5), fill: r() > 0.5 ? '#FFF6EA' : C.pinkLight });
      }
    }
    return el('symbol', { id: id, overflow: 'visible' }, s);
  }

  // Bougainvillea climbing a pillar: a wandering stem with leaves and clusters of pink bracts.
  function vineSymbol(id, seed) {
    var r = rng(seed), s = '', x = 0, pts = [[0, 0]];
    for (var y = -40; y >= -620; y -= 40) { x = Math.max(-26, Math.min(26, x + (r() - 0.5) * 30)); pts.push([x, y]); }
    var d = 'M0 0';
    for (var i = 1; i < pts.length; i++) {
      var p = pts[i], q = pts[i - 1];
      d += ' Q' + n(q[0] + (r() - 0.5) * 20) + ' ' + n((p[1] + q[1]) / 2) + ' ' + n(p[0]) + ' ' + n(p[1]);
    }
    s += el('path', { d: d, fill: 'none', stroke: '#7A6A4C', 'stroke-width': 3, 'stroke-linecap': 'round' });
    pts.forEach(function (p, k) {
      if (k === 0) return;
      for (var j = 0; j < 3; j++) {
        var side = j % 2 ? 1 : -1;
        s += el('path', { d: leafPath(10, 22), fill: j === 1 ? C.leafLight : C.leafMid, transform: 'translate(' + n(p[0]) + ' ' + n(p[1] + j * 12) + ') rotate(' + n(side * (50 + r() * 40)) + ')' });
      }
      if (k % 2 === 0 || k > pts.length - 4) {
        var cx = p[0] + (r() - 0.5) * 30, cy = p[1] + (r() - 0.5) * 20, cs = '';
        for (var f = 0; f < 9; f++) {
          var a = r() * Math.PI * 2, dd = r() * 16;
          cs += el('path', { d: leafPath(9, 13), fill: f % 3 === 0 ? C.pinkDeep : f % 3 === 1 ? C.pink : C.pinkLight, transform: 'translate(' + n(cx + Math.cos(a) * dd) + ' ' + n(cy + Math.sin(a) * dd) + ') rotate(' + n(r() * 360) + ')' });
        }
        s += cs;
      }
    });
    return el('symbol', { id: id, overflow: 'visible' }, s);
  }

  /* ---------- layers ---------- */
  function svg(viewBox, inner, cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" preserveAspectRatio="none" class="' + (cls || '') + '" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }
  var VB = '-1000 0 3000 1900';

  function archLayer() {
    var defs = '<defs>' +
      bushSymbol('bush-a', 11, 250, 230, 10) + bushSymbol('bush-b', 23, 230, 205, 8) +
      vineSymbol('vine-a', 5) + vineSymbol('vine-b', 9) +
      '<linearGradient id="water-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + C.water + '"/><stop offset="1" stop-color="' + C.waterDeep + '"/></linearGradient>' +
      '<linearGradient id="train-g" x1="0" y1="0" x2="1" y2="0.4"><stop offset="0" stop-color="#1F5E57"/><stop offset="0.5" stop-color="#2E7E63"/><stop offset="1" stop-color="#4A9A6B"/></linearGradient>' +
      '</defs>';
    var s = defs;
    s += el('path', { d: 'M-1000 0H2000V1562H-1000Z' + openings(), fill: C.wall, 'fill-rule': 'evenodd' });
    s += frieze();
    [-1000, 0, 1000].forEach(function (bx) { s += archDecor(bx); });
    [-1000, 0, 1000, 2000].forEach(function (x) {
      s += el('use', { href: '#vine-a', x: x + 70, y: 1420 });
      s += el('use', { href: '#vine-b', transform: 'translate(' + (x - 70) + ' 1420) scale(-1 1)' });
      s += pillar(x);
      s += el('use', { href: '#bush-a', x: x + 150, y: 1566 });
      s += el('use', { href: '#bush-b', transform: 'translate(' + (x - 150) + ' 1566) scale(-1 1)' });
    });
    // Terrace edge (plinth) with carved panels.
    s += el('rect', { x: -1000, y: 1560, width: 3000, height: 86, fill: C.plinth });
    s += el('rect', { x: -1000, y: 1560, width: 3000, height: 8, fill: C.wallHi });
    s += el('rect', { x: -1000, y: 1640, width: 3000, height: 6, fill: C.line, opacity: 0.55 });
    for (var x = -1000; x < 2000; x += 125) {
      s += el('rect', { x: x + 14, y: 1580, width: 97, height: 46, rx: 4, fill: 'none', stroke: C.wallLo, 'stroke-width': 2 });
      s += el('circle', { cx: x + 62.5, cy: 1603, r: 5, fill: C.wallLo });
    }
    // The pool.
    s += el('rect', { x: -1000, y: 1646, width: 3000, height: 254, fill: 'url(#water-g)' });
    s += el('rect', { x: -1000, y: 1646, width: 3000, height: 22, fill: C.waterDeep, opacity: 0.45 });
    var ripples = '';
    var r = rng(77);
    for (var k = 0; k < 26; k++) {
      var rx = r() * 1000, ry = 1690 + r() * 190, rl = 20 + r() * 50;
      ripples += el('path', { d: 'M' + n(rx) + ' ' + n(ry) + ' h' + n(rl), stroke: C.waterHi, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: n(0.35 + r() * 0.35) });
    }
    s += '<g class="ripples">' + [-1000, 0, 1000].map(function (bx) { return el('g', { transform: 'translate(' + bx + ' 0)' }, ripples); }).join('') + '</g>';
    [-1000, 0, 1000].forEach(function (bx) {
      s += lilyPad(bx + 300, 1760, 1) + lilyPad(bx + 345, 1792, 0.7) + lilyPad(bx + 760, 1738, 0.85);
    });
    s += '<g class="slot" data-slot="-1" transform="translate(-1000 0)"></g><g class="slot" data-slot="0"></g><g class="slot" data-slot="1" transform="translate(1000 0)"></g>';
    return svg(VB, s, 'arch');
  }

  function lilyPad(x, y, sc) {
    var g = el('path', { d: 'M0 0 L40 -6 A42 17 0 1 1 30 12 Z', fill: '#4F8F5C' });
    g += el('path', { d: 'M0 0 L40 -6 A42 17 0 0 0 34 -10Z', fill: '#6FAE6F' });
    g += el('path', { d: 'M0 0 L-30 -8 M0 0 L-24 10 M0 0 L8 15', stroke: '#6FAE6F', 'stroke-width': 1.6, fill: 'none' });
    return el('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + sc + ')' }, g);
  }

  function balustradeLayer() {
    var s = '', period = 920, step = 46, x;
    s += el('rect', { x: -1100, y: 1440, width: 3300, height: 130, fill: C.floor });
    s += el('rect', { x: -1100, y: 1440, width: 3300, height: 6, fill: C.wallMid, opacity: 0.6 });
    s += el('rect', { x: -1100, y: 1424, width: 3300, height: 18, fill: C.wallHi, stroke: C.line, 'stroke-width': 1.3 });
    for (x = -1100 + step / 2; x < 2200; x += step) s += baluster(x);
    for (x = -1100 + 230; x < 2200; x += period / 2) {
      s += el('rect', { x: x - 22, y: 1244, width: 44, height: 184, fill: C.wall, stroke: C.line, 'stroke-width': 1.3 });
      s += el('rect', { x: x + 6, y: 1244, width: 16, height: 184, fill: C.wallMid, opacity: 0.7 });
      s += el('rect', { x: x - 28, y: 1232, width: 56, height: 14, fill: C.wallHi, stroke: C.line, 'stroke-width': 1.3 });
    }
    s += el('rect', { x: -1100, y: 1250, width: 3300, height: 14, fill: C.wallHi });
    s += el('rect', { x: -1100, y: 1262, width: 3300, height: 16, fill: C.wall, stroke: C.line, 'stroke-width': 1.3 });
    s += el('rect', { x: -1100, y: 1278, width: 3300, height: 6, fill: C.wallLo, opacity: 0.5 });
    return svg(VB, s, 'balustrade');
  }

  function baluster(cx) {
    var d = 'M' + (cx - 9) + ' 1280 L' + (cx + 9) + ' 1280 L' + (cx + 7) + ' 1292 C' + (cx + 5) + ' 1312 ' + (cx + 16) + ' 1342 ' + (cx + 16) + ' 1372 C' + (cx + 16) + ' 1394 ' + (cx + 9) + ' 1404 ' + (cx + 11) + ' 1412 L' + (cx + 14) + ' 1424 L' + (cx - 14) + ' 1424 L' + (cx - 11) + ' 1412 C' + (cx - 9) + ' 1404 ' + (cx - 16) + ' 1394 ' + (cx - 16) + ' 1372 C' + (cx - 16) + ' 1342 ' + (cx - 5) + ' 1312 ' + (cx - 7) + ' 1292Z';
    var shade = 'M' + cx + ' 1282 L' + (cx + 7) + ' 1292 C' + (cx + 5) + ' 1312 ' + (cx + 16) + ' 1342 ' + (cx + 16) + ' 1372 C' + (cx + 16) + ' 1394 ' + (cx + 9) + ' 1404 ' + (cx + 11) + ' 1412 L' + (cx + 14) + ' 1424 L' + cx + ' 1424Z';
    return el('path', { d: d, fill: C.wall, stroke: C.line, 'stroke-width': 1 }) + el('path', { d: shade, fill: C.wallMid, opacity: 0.7 });
  }

  function gardenLayer() {
    var s = '', period = 780, r = rng(41), x, k;
    var tile = '';
    // Cypress trees and round trees behind the hedge.
    [[60, 1072], [330, 1090], [600, 1066]].forEach(function (c) {
      var cx = c[0], top = c[1];
      tile += el('path', { d: 'M' + cx + ' ' + top + ' C' + (cx + 30) + ' ' + (top + 60) + ' ' + (cx + 36) + ' ' + (top + 150) + ' ' + (cx + 22) + ' 1300 L' + (cx - 22) + ' 1300 C' + (cx - 36) + ' ' + (top + 150) + ' ' + (cx - 30) + ' ' + (top + 60) + ' ' + cx + ' ' + top + 'Z', fill: C.leafDeep });
      for (k = 0; k < 14; k++) {
        var ly = top + 30 + k * 13, lw = Math.min(26, 8 + k * 2.4);
        tile += el('path', { d: 'M' + n(cx - lw * 0.6) + ' ' + ly + ' q ' + n(lw * 0.3) + ' -8 ' + n(lw * 0.6) + ' 0', stroke: C.leafDark, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' });
      }
    });
    [[190, 1128, 64], [460, 1120, 70], [700, 1134, 58]].forEach(function (c) {
      tile += el('circle', { cx: c[0], cy: c[1] + c[2] * 0.6, r: c[2], fill: C.leafDark });
      tile += el('circle', { cx: c[0] - c[2] * 0.55, cy: c[1] + c[2] * 0.95, r: c[2] * 0.7, fill: C.leafDark });
      tile += el('circle', { cx: c[0] + c[2] * 0.55, cy: c[1] + c[2] * 0.95, r: c[2] * 0.72, fill: C.leafDark });
      for (k = 0; k < 26; k++) {
        var a = r() * Math.PI * 2, d = Math.sqrt(r()) * c[2];
        var lx = c[0] + Math.cos(a) * d, ly2 = c[1] + c[2] * 0.7 + Math.sin(a) * d * 0.8;
        tile += el('path', { d: leafPath(9, 16), fill: ly2 < c[1] + c[2] * 0.5 ? C.leafLight : C.leafMid, transform: 'translate(' + n(lx) + ' ' + n(ly2) + ') rotate(' + n(r() * 360) + ')' });
      }
    });
    // Hedge rows: a dark back row and a lighter front row, with leaf texture.
    var back = 'M0 1470 L0 1200';
    for (x = 0; x < period; x += 52) back += ' A30 30 0 0 1 ' + Math.min(period, x + 52) + ' 1200';
    back += ' L' + period + ' 1470Z';
    tile += el('path', { d: back, fill: C.leafDark });
    var front = 'M0 1470 L0 1236';
    for (x = 0; x < period; x += 65) front += ' A36 34 0 0 1 ' + Math.min(period, x + 65) + ' 1236';
    front += ' L' + period + ' 1470Z';
    tile += el('path', { d: front, fill: C.leafMid });
    for (k = 0; k < 90; k++) {
      var hx = r() * period, hy = 1218 + r() * 60;
      tile += el('path', { d: leafPath(9, 15), fill: r() > 0.5 ? C.leafLight : C.leafHi, opacity: 0.85, transform: 'translate(' + n(hx) + ' ' + n(hy) + ') rotate(' + n(r() * 360) + ')' });
    }
    s += '<defs><g id="garden-tile">' + tile + '</g></defs>';
    for (x = -1600; x < 2400; x += period) s += el('use', { href: '#garden-tile', x: x, y: 0 });
    return svg(VB, s, 'garden');
  }

  function farLayer() {
    var s = '', period = 450, tile = '', x;
    // Distant pavilions (chhatris) and trees in pale, hazy tones.
    function chhatri(cx, base, w, col) {
      var g = el('rect', { x: cx - w / 2, y: base - w * 0.55, width: w, height: w * 0.55, fill: col });
      g += el('rect', { x: cx - w / 2 - 6, y: base - w * 0.62, width: w + 12, height: 9, fill: col });
      g += el('path', { d: 'M' + (cx - w / 2) + ' ' + (base - w * 0.62) + ' C' + (cx - w / 2) + ' ' + (base - w * 1.25) + ' ' + (cx + w / 2) + ' ' + (base - w * 1.25) + ' ' + (cx + w / 2) + ' ' + (base - w * 0.62) + 'Z', fill: col });
      g += el('path', { d: 'M' + cx + ' ' + (base - w * 1.1) + ' l 0 -16', stroke: col, 'stroke-width': 4 });
      return g;
    }
    tile += el('path', { d: 'M0 1300 L0 1170 Q60 1140 120 1165 T240 1158 T360 1168 T450 1170 L450 1300Z', fill: C.haze3 });
    tile += chhatri(110, 1176, 86, C.haze1);
    tile += chhatri(330, 1186, 64, C.haze1);
    tile += el('rect', { x: 40, y: 1170, width: 340, height: 130, fill: C.haze1 });
    tile += el('path', { d: 'M0 1300 L0 1200 Q40 1180 90 1198 T200 1196 T320 1202 T450 1200 L450 1300Z', fill: C.haze2 });
    s += '<defs><g id="far-tile">' + tile + '</g></defs>';
    for (x = -1400; x < 2400; x += period) s += el('use', { href: '#far-tile', x: x, y: 0 });
    return svg(VB, s, 'far');
  }

  // Static sky: the soft sun. Stars and the moon live in their own layer above the night tint.
  function skyLayer() {
    var s = '<defs><radialGradient id="sun-g"><stop offset="0" stop-color="#FFFBF1" stop-opacity="1"/><stop offset="0.35" stop-color="#FFF4DD" stop-opacity="0.75"/><stop offset="1" stop-color="#FFF1D6" stop-opacity="0"/></radialGradient></defs>';
    s += el('circle', { class: 'sun', cx: 640, cy: 520, r: 170, fill: 'url(#sun-g)' });
    return svg('0 0 1000 1900', s, 'sky-art');
  }

  function starsLayer() {
    var r = rng(303), s = '<defs><clipPath id="sky-clip"><path id="sky-clip-path" d="' + openings() + '"/></clipPath>' +
      '<radialGradient id="moon-glow"><stop offset="0" stop-color="#FFF3D6" stop-opacity=".55"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/></radialGradient></defs>';
    var stars = '';
    for (var k = 0; k < 90; k++) {
      var x = 90 + r() * 820, y = 150 + r() * 860, rad = 0.9 + r() * r() * 2.6;
      stars += el('circle', { cx: n(x), cy: n(y), r: n(rad), fill: '#FFF6E2', class: k % 5 === 0 ? 'twinkle' : null, style: k % 5 === 0 ? 'animation-delay:' + n(r() * 4) + 's' : null });
    }
    var moon = el('circle', { cx: 500, cy: 335, r: 115, fill: 'url(#moon-glow)' }) +
      el('circle', { cx: 500, cy: 335, r: 36, fill: '#F8EED8' }) +
      el('circle', { cx: 489, cy: 326, r: 7, fill: '#EADBBC', opacity: 0.7 }) +
      el('circle', { cx: 511, cy: 347, r: 5.5, fill: '#EADBBC', opacity: 0.6 }) +
      el('circle', { cx: 508, cy: 321, r: 3.6, fill: '#EADBBC', opacity: 0.6 });
    s += '<g clip-path="url(#sky-clip)"><g class="stars">' + stars + '</g><g class="moon">' + moon + '</g></g>';
    return svg('0 0 1000 1900', s, 'stars-art');
  }

  /* ---------- props (per scene, drawn into a slot) ---------- */
  // A peacock perched on the terrace edge, its long train hanging down over the stone to the water.
  function peacock(x, y, sc, flip) {
    var g = '';
    g += el('path', { d: 'M18 -104 C46 -70 58 10 66 100 C72 170 82 232 96 282 C72 300 34 302 6 288 C4 230 -2 150 -10 70 C-16 10 -20 -44 -22 -84Z', fill: 'url(#train-g)' });
    for (var k = 0; k < 6; k++) {
      var x0 = -14 + k * 6;
      g += el('path', { d: 'M' + x0 + ' -80 C' + (x0 + 8) + ' 20 ' + (x0 + 14 + k * 2) + ' 160 ' + (x0 + 20 + k * 6) + ' 284', stroke: '#8CC59A', 'stroke-width': 1.3, fill: 'none', opacity: 0.5 });
    }
    for (var e = 0; e < 14; e++) {
      var tt = e / 13, ey = -56 + tt * 320, ex = 6 + tt * 46 + (e % 2 ? 13 : -13) * (0.55 + tt * 0.9);
      var rot = 'rotate(' + n(84 - tt * 10) + ' ' + n(ex) + ' ' + n(ey) + ')', sz = 0.72 + tt * 0.55;
      g += el('ellipse', { cx: n(ex), cy: n(ey), rx: n(14 * sz), ry: n(9.5 * sz), fill: '#E2C25E', transform: rot });
      g += el('ellipse', { cx: n(ex), cy: n(ey + 1.5 * sz), rx: n(9.5 * sz), ry: n(6.6 * sz), fill: '#2A9C8E', transform: rot });
      g += el('ellipse', { cx: n(ex), cy: n(ey + 2.5 * sz), rx: n(5.2 * sz), ry: n(4 * sz), fill: '#173C7E', transform: rot });
    }
    // Feet gripping the ledge.
    g += el('path', { d: 'M-8 -2 L-4 -62 M10 -2 L8 -62 M-8 -2 l-12 1 M-8 -2 l4 4 M10 -2 l-12 1 M10 -2 l4 4', stroke: '#9B7A57', 'stroke-width': 4.5, 'stroke-linecap': 'round', fill: 'none' });
    // Body and wing.
    g += el('path', { d: 'M-42 -100 C-42 -138 -6 -152 28 -138 C48 -128 54 -104 42 -88 C22 -66 -24 -64 -40 -84Z', fill: '#1E5491' });
    g += el('path', { d: 'M-16 -122 C14 -136 44 -124 52 -100 C40 -84 12 -78 -10 -88 C-20 -98 -22 -112 -16 -122Z', fill: '#BD9661' });
    [[-6, -118, 34, -112], [-8, -106, 40, -100], [-6, -94, 40, -90]].forEach(function (l) {
      g += el('path', { d: 'M' + l[0] + ' ' + l[1] + ' Q' + ((l[0] + l[2]) / 2) + ' ' + (l[1] - 6) + ' ' + l[2] + ' ' + l[3], stroke: '#8D6A3E', 'stroke-width': 2, fill: 'none' });
    });
    // Neck and head (the head group bobs).
    g += '<g class="pk-head">' +
      el('path', { d: 'M-38 -112 C-52 -150 -46 -190 -58 -226 C-60 -238 -46 -244 -40 -234 C-30 -200 -22 -160 -12 -124Z', fill: '#1D5BAA' }) +
      el('path', { d: 'M-34 -130 C-40 -160 -38 -196 -48 -224', stroke: '#4A8FD6', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }) +
      el('circle', { cx: -50, cy: -237, r: 12.5, fill: '#1D5BAA' }) +
      el('path', { d: 'M-60 -241 L-78 -236 L-60 -231Z', fill: '#CDB88E' }) +
      el('path', { d: 'M-58 -242 q 6 -4 12 0', stroke: '#FFFFFF', 'stroke-width': 2.4, fill: 'none' }) +
      el('circle', { cx: -53, cy: -239, r: 2.2, fill: '#111' }) +
      [[-62, -282], [-54, -287], [-46, -289], [-38, -286], [-32, -280]].map(function (t) {
        return el('path', { d: 'M-48 -248 L' + t[0] + ' ' + t[1], stroke: '#1D5BAA', 'stroke-width': 1.6 }) + el('ellipse', { cx: t[0], cy: t[1], rx: 3.2, ry: 4.2, fill: '#2E79C6' });
      }).join('') +
      '</g>';
    return el('g', { class: 'peacock', transform: 'translate(' + x + ' ' + y + ') scale(' + (flip ? -sc : sc) + ' ' + sc + ')' }, g);
  }

  var PROP_DEFS = '<defs>' +
    '<radialGradient id="glow-g"><stop offset="0" stop-color="#FFD98A" stop-opacity=".85"/><stop offset=".4" stop-color="#FFB85C" stop-opacity=".35"/><stop offset="1" stop-color="#FFB85C" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="flame-g" cx=".5" cy=".7"><stop offset="0" stop-color="#FFF8D8"/><stop offset=".5" stop-color="#FFC75A"/><stop offset="1" stop-color="#F08A2A"/></radialGradient>' +
    '</defs>';

  // Strings of marigolds hanging from the arch, the way homes are dressed for a wedding.
  function marigolds() {
    var s = '', r = rng(808);
    [[100, 620, 370], [124, 554, 330], [148, 506, 290], [900, 620, 370], [876, 554, 330], [852, 506, 290]].forEach(function (str, i) {
      var x = str[0], top = str[1], len = str[2], g = '';
      g += el('line', { x1: x, y1: top, x2: x, y2: top + len, stroke: '#7A6A4C', 'stroke-width': 1.5 });
      for (var y = top + 8; y < top + len; y += 15) {
        var col = (Math.floor((y - top) / 15) + i) % 3 === 0 ? '#F2B233' : '#E98A1E';
        g += el('circle', { cx: n(x + (r() - 0.5) * 2), cy: y, r: 8.5, fill: col });
        g += el('circle', { cx: n(x - 2), cy: y - 2, r: 3.5, fill: '#F9CF63', opacity: 0.8 });
      }
      g += el('path', { d: leafPath(12, 26), fill: C.leafMid, transform: 'translate(' + x + ' ' + (top + len + 4) + ') rotate(180)' });
      s += el('g', { class: 'sway', style: 'transform-origin:' + x + 'px ' + top + 'px;animation-delay:' + (i * -0.7) + 's' }, g);
    });
    return s;
  }

  // Temple bells hanging from the arch.
  function bells() {
    var s = '';
    [[130, 540, 120], [870, 540, 120]].forEach(function (b, i) {
      var x = b[0], top = b[1], len = b[2], g = '';
      g += el('line', { x1: x, y1: top, x2: x, y2: top + len, stroke: '#8E6B33', 'stroke-width': 2.4 });
      for (var y = top + 10; y < top + len; y += 18) g += el('ellipse', { cx: x, cy: y, rx: 3.5, ry: 6, fill: 'none', stroke: '#A07A3A', 'stroke-width': 2 });
      var by = top + len;
      g += el('path', { d: 'M' + (x - 8) + ' ' + by + ' C' + (x - 10) + ' ' + (by + 20) + ' ' + (x - 30) + ' ' + (by + 46) + ' ' + (x - 32) + ' ' + (by + 62) + ' L' + (x + 32) + ' ' + (by + 62) + ' C' + (x + 30) + ' ' + (by + 46) + ' ' + (x + 10) + ' ' + (by + 20) + ' ' + (x + 8) + ' ' + by + 'Z', fill: '#C79A43', stroke: '#8E6B33', 'stroke-width': 1.6 });
      g += el('path', { d: 'M' + (x - 30) + ' ' + (by + 52) + ' L' + (x + 30) + ' ' + (by + 52), stroke: '#8E6B33', 'stroke-width': 1.6 });
      g += el('path', { d: 'M' + (x - 4) + ' ' + (by + 8) + ' C' + (x - 8) + ' ' + (by + 26) + ' ' + (x - 18) + ' ' + (by + 42) + ' ' + (x - 20) + ' ' + (by + 52), stroke: '#E7C77C', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' });
      g += el('circle', { cx: x, cy: by + 70, r: 6, fill: '#8E6B33' });
      s += el('g', { class: 'sway sway--slow', style: 'transform-origin:' + x + 'px ' + top + 'px;animation-delay:' + (i * -1.3) + 's' }, g);
    });
    return s;
  }

  // Hanging lanterns (lit). Drawn in the glow layer so they stay bright at night.
  function lanterns() {
    var s = '';
    [[122, 560, 90], [878, 560, 90]].forEach(function (l, i) {
      var x = l[0], top = l[1], len = l[2], g = '', by = top + len;
      g += el('circle', { cx: x, cy: by + 52, r: 150, fill: 'url(#glow-g)', class: 'flicker' });
      g += el('line', { x1: x, y1: top, x2: x, y2: by, stroke: '#3B2C22', 'stroke-width': 2.4 });
      g += el('path', { d: 'M' + (x - 14) + ' ' + by + ' L' + (x + 14) + ' ' + by + ' L' + (x + 22) + ' ' + (by + 14) + ' L' + (x - 22) + ' ' + (by + 14) + 'Z', fill: '#4A3526' });
      g += el('path', { d: 'M' + (x - 22) + ' ' + (by + 14) + ' C' + (x - 40) + ' ' + (by + 40) + ' ' + (x - 40) + ' ' + (by + 70) + ' ' + (x - 20) + ' ' + (by + 96) + ' L' + (x + 20) + ' ' + (by + 96) + ' C' + (x + 40) + ' ' + (by + 70) + ' ' + (x + 40) + ' ' + (by + 40) + ' ' + (x + 22) + ' ' + (by + 14) + 'Z', fill: '#FFC76A', stroke: '#4A3526', 'stroke-width': 3 });
      g += el('path', { d: 'M' + x + ' ' + (by + 14) + ' L' + x + ' ' + (by + 96) + ' M' + (x - 30) + ' ' + (by + 55) + ' L' + (x + 30) + ' ' + (by + 55), stroke: '#4A3526', 'stroke-width': 2 });
      g += el('ellipse', { cx: x, cy: by + 56, rx: 12, ry: 22, fill: '#FFF2C4', opacity: 0.8 });
      g += el('path', { d: 'M' + (x - 20) + ' ' + (by + 96) + ' L' + (x + 20) + ' ' + (by + 96) + ' L' + (x + 10) + ' ' + (by + 108) + ' L' + (x - 10) + ' ' + (by + 108) + 'Z', fill: '#4A3526' });
      g += el('line', { x1: x, y1: by + 108, x2: x, y2: by + 128, stroke: '#4A3526', 'stroke-width': 2 });
      g += el('circle', { cx: x, cy: by + 132, r: 5, fill: '#C9A04A' });
      s += el('g', { class: 'sway sway--slow', style: 'transform-origin:' + x + 'px ' + top + 'px;animation-delay:' + (i * -2.1) + 's' }, g);
    });
    return s;
  }

  // Clay diyas along the terrace edge (glow layer).
  function diyas(xs) {
    var s = '';
    (xs || [150, 260, 370, 480, 590, 700, 810]).forEach(function (x, i) {
      var y = 1562, g = '';
      g += el('circle', { cx: x, cy: y - 26, r: 70, fill: 'url(#glow-g)', class: 'flicker', style: 'animation-delay:' + (i * -0.37) + 's' });
      g += el('path', { d: 'M' + (x - 24) + ' ' + (y - 14) + ' Q' + x + ' ' + (y + 6) + ' ' + (x + 24) + ' ' + (y - 14) + ' L' + (x + 32) + ' ' + (y - 18) + ' Q' + x + ' ' + (y - 10) + ' ' + (x - 24) + ' ' + (y - 14) + 'Z', fill: '#B4572E' });
      g += el('path', { d: 'M' + (x - 22) + ' ' + (y - 14) + ' Q' + x + ' ' + (y - 8) + ' ' + (x + 30) + ' ' + (y - 17), stroke: '#E0A15C', 'stroke-width': 2, fill: 'none' });
      g += el('path', { d: 'M' + x + ' ' + (y - 48) + ' C' + (x + 9) + ' ' + (y - 34) + ' ' + (x + 7) + ' ' + (y - 20) + ' ' + x + ' ' + (y - 17) + ' C' + (x - 7) + ' ' + (y - 20) + ' ' + (x - 9) + ' ' + (y - 34) + ' ' + x + ' ' + (y - 48) + 'Z', fill: 'url(#flame-g)', class: 'flame', style: 'transform-origin:' + x + 'px ' + (y - 17) + 'px;animation-delay:' + (i * -0.23) + 's' });
      // Reflection in the pool.
      g += el('ellipse', { cx: x, cy: 1700, rx: 7, ry: 38, fill: '#FFC76A', opacity: 0.32, class: 'flicker' });
      s += g;
    });
    return s;
  }

  /* ---------- the couple ---------- */
  // Walking to the left, hand in hand: bride in an ivory lehenga, groom in a black sherwani.
  function couple() {
    var skin = '#DCA580', skinB = '#E6B492', skinShade = '#C58F6C', hair = '#191416';
    var g = '';

    // Groom.
    var groom = '';
    groom += '<g class="leg leg--b">' + leg('#16141A') + '</g>';
    // Far arm, hanging behind.
    groom += el('path', { d: 'M112 -548 C130 -532 142 -466 144 -404 L147 -342 L129 -337 L122 -402 C118 -454 108 -502 98 -532Z', fill: '#1B191F' });
    groom += el('ellipse', { cx: 139, cy: -329, rx: 10, ry: 13, fill: skinShade });
    groom += '<g class="leg leg--f">' + leg('#1C1A20') + '</g>';
    // Sherwani: knee length, with a mandarin collar and a gold stole over one shoulder.
    groom += el('path', { d: 'M24 -544 C12 -524 10 -470 16 -420 L10 -250 C46 -237 110 -237 142 -252 L130 -420 C136 -470 134 -526 122 -548 C102 -562 44 -562 24 -544Z', fill: '#25222A' });
    groom += el('path', { d: 'M36 -300 C64 -294 104 -294 134 -302 M24 -420 C34 -380 30 -320 24 -262 M124 -420 C128 -360 134 -300 138 -262', stroke: '#36323C', 'stroke-width': 2, fill: 'none' });
    groom += el('path', { d: 'M54 -550 C50 -500 44 -380 40 -250', stroke: '#47414D', 'stroke-width': 2.2, fill: 'none' });
    [-524, -497, -470, -443, -416, -389].forEach(function (y, i) { groom += el('circle', { cx: n(52 - i * 1.2), cy: y, r: 2.8, fill: '#C8A35A' }); });
    groom += el('path', { d: 'M110 -552 C118 -500 120 -410 114 -296 L98 -294 C102 -410 102 -500 96 -552Z', fill: '#D9BE82' });
    groom += el('path', { d: 'M110 -552 C118 -500 120 -410 114 -296 M96 -552 C102 -500 102 -410 98 -294', stroke: '#AD8A45', 'stroke-width': 2, fill: 'none' });
    groom += el('path', { d: 'M98 -306 L114 -308 L113 -294 L98 -293Z', fill: '#AD8A45' });
    groom += el('path', { d: 'M48 -548 L92 -548 L90 -568 L50 -568Z', fill: '#2F2B34' });
    groom += el('path', { d: 'M48 -548 L92 -548', stroke: '#C8A35A', 'stroke-width': 2 });
    // Neck and head, turned towards the bride.
    groom += el('path', { d: 'M58 -574 L78 -574 L78 -560 L58 -560Z', fill: skinShade });
    groom += el('ellipse', { cx: 66, cy: -604, rx: 25, ry: 31, fill: skin });
    groom += el('path', { d: 'M42 -610 C38 -606 39 -600 43 -598', stroke: skinShade, 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' });
    groom += el('ellipse', { cx: 90, cy: -602, rx: 5.5, ry: 8.5, fill: skinShade });
    groom += el('path', { d: 'M90 -600 C90 -582 80 -573 65 -572 C52 -573 43 -582 42 -596 C47 -588 55 -583 65 -583 C76 -583 85 -590 90 -600Z', fill: '#3A2C26', opacity: 0.92 });
    groom += el('path', { d: 'M54 -590 q 11 -5 22 0 q -11 3 -22 0Z', fill: '#3A2C26', opacity: 0.92 });
    groom += el('path', { d: 'M40 -608 C36 -640 56 -656 80 -652 C100 -648 106 -630 98 -606 C96 -614 93 -620 88 -624 C78 -626 66 -624 56 -628 C48 -622 43 -616 40 -608Z', fill: hair });
    groom += el('path', { d: 'M38 -622 C40 -648 68 -664 96 -650 C80 -652 62 -650 50 -636Z', fill: hair });
    groom += el('path', { d: 'M48 -642 C60 -654 80 -656 94 -648', stroke: '#3B3236', 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round' });
    // Near arm, reaching forward to hold her hand.
    groom += el('path', { d: 'M42 -546 C24 -526 12 -476 6 -424 L-6 -350 L12 -344 L26 -418 C34 -462 48 -504 60 -532Z', fill: '#2C2932' });
    groom += el('path', { d: 'M-4 -360 L12 -356 L11 -348 L-6 -351Z', fill: '#C8A35A' });
    groom += el('ellipse', { cx: -2, cy: -338, rx: 11, ry: 13, fill: skin });
    g += '<g class="groom">' + groom + '</g>';

    // Bride.
    var bride = '';
    // Dupatta trailing behind her.
    bride += el('path', { d: 'M-70 -494 C-36 -440 -6 -338 12 -200 C22 -120 34 -50 54 -4 L28 0 C12 -60 -6 -150 -30 -262 C-46 -340 -66 -420 -86 -480Z', fill: '#F6EEE2', opacity: 0.82 });
    bride += el('path', { d: 'M-70 -494 C-36 -440 -6 -338 12 -200 C22 -120 34 -50 54 -4', stroke: '#C9A55E', 'stroke-width': 3, fill: 'none' });
    // Hair falling down her back.
    bride += el('path', { d: 'M-112 -560 C-118 -592 -94 -606 -74 -600 C-56 -594 -52 -574 -56 -550 C-52 -520 -46 -480 -44 -440 C-44 -420 -50 -404 -58 -398 C-64 -440 -70 -496 -76 -526 C-86 -556 -100 -566 -112 -560Z', fill: hair });
    // Skirt.
    bride += '<g class="skirt" style="transform-origin:-85px -360px">';
    bride += el('path', { d: 'M-112 -362 C-130 -280 -170 -150 -214 -10 C-216 -2 -210 4 -200 4 L6 4 C16 4 20 -4 16 -12 C-10 -120 -40 -260 -58 -362Z', fill: '#EFE6D8' });
    [[-104, -180], [-94, -132], [-84, -84], [-74, -38], [-64, 2]].forEach(function (p) {
      bride += el('path', { d: 'M' + p[0] + ' -354 Q' + n((p[0] + p[1]) / 2 - 6) + ' -190 ' + p[1] + ' -40', stroke: '#E2D5C2', 'stroke-width': 3, fill: 'none' });
    });
    var dots = '', rr = rng(17);
    for (var i = 0; i < 46; i++) {
      var ty = -330 + rr() * 280, half = 26 + (ty + 360) / 360 * 100;
      var cxm = -85 - (ty + 360) / 360 * 15;
      dots += el('circle', { cx: n(cxm + (rr() - 0.5) * 2 * half * 0.9), cy: n(ty), r: n(2 + rr() * 1.6), fill: '#D5BD8E', opacity: 0.85 });
    }
    bride += dots;
    bride += el('path', { d: 'M-188 -76 C-120 -70 -40 -70 4 -76', stroke: '#CDAA62', 'stroke-width': 5, fill: 'none' });
    bride += el('path', { d: 'M-205 -36 L11 -36 L16 -12 C20 -4 16 4 6 4 L-200 4 C-210 4 -216 -2 -214 -10Z', fill: '#CBA65E' });
    bride += el('path', { d: 'M-203 -26 L12 -26 M-209 -6 L15 -6', stroke: '#A7843D', 'stroke-width': 2, fill: 'none' });
    for (var b = -196; b < 8; b += 14) bride += el('circle', { cx: b, cy: -16, r: 3, fill: '#F2DFA8' });
    bride += '</g>';
    // Bodice and the dupatta across it.
    bride += el('path', { d: 'M-112 -364 L-58 -364 C-56 -400 -60 -452 -66 -490 C-78 -502 -100 -502 -110 -488 C-116 -450 -116 -400 -112 -364Z', fill: '#F3EBDF' });
    bride += el('path', { d: 'M-112 -366 L-58 -366 L-58 -376 L-112 -376Z', fill: '#CBA65E' });
    bride += el('path', { d: 'M-110 -480 C-98 -444 -76 -404 -56 -372 L-50 -388 C-70 -414 -90 -448 -102 -486Z', fill: '#EADCC5', opacity: 0.92 });
    bride += el('path', { d: 'M-110 -480 C-98 -444 -76 -404 -56 -372', stroke: '#C9A55E', 'stroke-width': 3, fill: 'none' });
    // Arm reaching back to hold his hand.
    bride += el('path', { d: 'M-78 -490 C-62 -470 -40 -420 -22 -370 L-10 -346 L-24 -338 L-38 -366 C-54 -410 -74 -452 -90 -480Z', fill: '#EEE4D5' });
    bride += el('path', { d: 'M-22 -368 L-10 -346 L-18 -342 L-30 -362Z', fill: '#CBA65E' });
    bride += el('ellipse', { cx: -12, cy: -336, rx: 10, ry: 12, fill: skinB });
    // Arm held forward.
    bride += el('path', { d: 'M-102 -490 C-126 -470 -152 -446 -180 -428 L-194 -420 L-186 -408 L-170 -416 C-144 -432 -118 -452 -98 -470Z', fill: '#F3EBDF' });
    bride += el('path', { d: 'M-178 -430 L-192 -421 L-185 -410 L-171 -418Z', fill: '#CBA65E' });
    bride += el('ellipse', { cx: -200, cy: -416, rx: 11, ry: 9, fill: skinB, transform: 'rotate(-20 -200 -416)' });
    // Neck, necklace, face, hair.
    bride += el('path', { d: 'M-98 -528 L-80 -528 L-78 -496 L-96 -496Z', fill: skinB });
    bride += el('path', { d: 'M-100 -504 Q-88 -486 -76 -504', stroke: '#C9A55E', 'stroke-width': 5, fill: 'none' });
    bride += el('circle', { cx: -88, cy: -490, r: 4, fill: '#B7303F' });
    bride += el('ellipse', { cx: -92, cy: -554, rx: 23, ry: 30, fill: skinB });
    bride += el('path', { d: 'M-115 -556 C-120 -586 -98 -604 -78 -600 C-62 -596 -56 -580 -60 -562 C-66 -574 -76 -580 -88 -580 C-100 -580 -110 -572 -115 -556Z', fill: hair });
    bride += el('circle', { cx: -96, cy: -584, r: 3.4, fill: '#E8C878' });
    bride += el('path', { d: 'M-72 -548 l 0 12', stroke: '#C9A55E', 'stroke-width': 2 });
    bride += el('circle', { cx: -72, cy: -532, r: 5, fill: '#D6B060' });
    bride += el('path', { d: 'M-108 -548 q 5 3 10 0', stroke: '#6B3F33', 'stroke-width': 1.8, fill: 'none', 'stroke-linecap': 'round' });
    g += '<g class="bride">' + bride + '</g>';

    return g;

    function leg(col) {
      return el('path', { d: 'M58 -336 L94 -336 L90 -170 C89 -120 86 -60 84 -22 L64 -22 C64 -60 62 -120 60 -170Z', fill: col }) +
        el('path', { d: 'M62 -24 L88 -24 C90 -14 88 -4 82 0 L40 0 C32 0 30 -8 38 -11 C48 -14 56 -18 62 -24Z', fill: '#1F1C22' }) +
        el('path', { d: 'M44 -6 C56 -10 70 -12 84 -10', stroke: '#B08A45', 'stroke-width': 1.6, fill: 'none' });
    }
  }

  function coupleGroup(x, y, sc) {
    return el('g', { class: 'couple', transform: 'translate(' + x + ' ' + y + ') scale(' + sc + ')' }, el('g', { class: 'couple-body' }, couple()));
  }

  /* ---------- icons and the cover crest ---------- */
  function ganesha(cls) {
    return '<svg class="' + (cls || 'ganesha') + '" viewBox="0 0 120 120" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M44 38 L47 26 Q60 4 73 26 L76 38Z"/><path d="M60 8 L60 2"/><path d="M42 38 L78 38"/><path d="M51 30 Q60 24 69 30"/>' +
      '<path d="M44 42 C30 32 12 40 14 58 C16 74 30 82 46 74"/><path d="M76 42 C90 32 108 40 106 58 C104 74 90 82 74 74"/>' +
      '<path d="M44 40 C42 50 44 58 52 62"/><path d="M76 40 C78 50 76 58 68 62"/>' +
      '<path d="M50 52 q3 -2.5 6 0"/><path d="M64 52 q3 -2.5 6 0"/><path d="M60 41 L60 48"/>' +
      '<path d="M54 62 C52 78 54 92 63 100 C71 107 84 104 84 95 C84 88 76 86 73 92"/><path d="M66 62 C66 74 67 84 72 89"/>' +
      '<path d="M69 70 L80 76"/>' +
      '</svg>';
  }

  function rose(cx, cy, r, tone) {
    var g = '', k;
    for (k = 0; k < 6; k++) g += el('ellipse', { cx: 0, cy: n(-r * 0.42), rx: n(r * 0.5), ry: n(r * 0.46), fill: tone[0], transform: 'rotate(' + (k * 60 + 15) + ')', opacity: 0.92 });
    for (k = 0; k < 5; k++) g += el('ellipse', { cx: 0, cy: n(-r * 0.22), rx: n(r * 0.36), ry: n(r * 0.32), fill: tone[1], transform: 'rotate(' + (k * 72) + ')' });
    g += el('circle', { r: n(r * 0.3), fill: tone[2] });
    g += el('path', { d: 'M' + n(-r * 0.18) + ' 0 a' + n(r * 0.18) + ' ' + n(r * 0.16) + ' 0 1 1 ' + n(r * 0.3) + ' ' + n(r * 0.04) + ' a' + n(r * 0.1) + ' ' + n(r * 0.1) + ' 0 1 1 ' + n(-r * 0.16) + ' ' + n(-r * 0.06), stroke: tone[3], 'stroke-width': n(r * 0.05), fill: 'none', 'stroke-linecap': 'round' });
    return el('g', { transform: 'translate(' + cx + ' ' + cy + ')' }, g);
  }

  function sprig(x, y, rot, sc) {
    var g = el('path', { d: 'M0 0 C 20 -30 40 -50 70 -64', stroke: '#8BA27E', 'stroke-width': 2, fill: 'none' });
    [[16, -20, -40], [30, -36, 30], [44, -46, -50], [58, -56, 20], [70, -64, -10]].forEach(function (l, i) {
      g += el('path', { d: leafPath(11, 26), fill: i % 2 ? '#9FB792' : '#7F9C74', transform: 'translate(' + l[0] + ' ' + l[1] + ') rotate(' + l[2] + ')', opacity: 0.9 });
    });
    return el('g', { transform: 'translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + sc + ')' }, g);
  }

  function crest(bride, groom) {
    var blush = ['#F2C8C1', '#F6D9D2', '#E9A9A6', '#C77F80'], cream = ['#F6E2C4', '#FAEEDC', '#EFCDA0', '#C89A62'], peach = ['#F4CDB0', '#F9E1CF', '#EDB48F', '#C88A66'];
    var shield = 'M150 22 C122 22 104 42 64 42 C52 42 42 38 34 32 L30 184 C30 262 90 312 150 342 C210 312 270 262 270 184 L266 32 C258 38 248 42 236 42 C196 42 178 22 150 22Z';
    var inner = 'M150 36 C124 36 106 54 68 54 C58 54 50 52 44 48 L42 184 C42 254 96 300 150 328 C204 300 258 254 258 184 L256 48 C250 52 242 54 232 54 C194 54 176 36 150 36Z';
    var s = '<svg class="crest-svg" viewBox="-40 -30 380 420" aria-hidden="true" focusable="false">';
    s += el('path', { d: shield, fill: 'none', stroke: '#9DB28F', 'stroke-width': 3, pathLength: 1, class: 'draw' });
    s += el('path', { d: inner, fill: 'none', stroke: '#B9C8AC', 'stroke-width': 1.6, pathLength: 1, class: 'draw draw--late' });
    s += '<g class="crest-flowers">';
    s += sprig(196, 40, -10, 1.1) + sprig(116, 34, 190, 0.9) + sprig(60, 322, -150, 1) + sprig(236, 326, -30, 1.05);
    s += rose(232, 24, 33, cream) + rose(276, 50, 24, blush) + rose(198, 8, 18, peach) + el('circle', { cx: 258, cy: 2, r: 6, fill: '#E9A9A6' }) + el('circle', { cx: 290, cy: 26, r: 4.5, fill: '#F2C8C1' });
    s += rose(86, 332, 31, blush) + rose(124, 350, 23, cream) + rose(52, 356, 19, peach) + rose(220, 340, 26, cream) + rose(254, 322, 18, blush) + el('circle', { cx: 160, cy: 356, r: 5, fill: '#E9A9A6' });
    s += '</g>';
    s += el('text', { x: 128, y: 196, 'text-anchor': 'middle', class: 'crest-l crest-l--a' }, bride.charAt(0));
    s += el('text', { x: 176, y: 238, 'text-anchor': 'middle', class: 'crest-l crest-l--b' }, groom.charAt(0));
    s += el('path', { d: 'M96 250 C130 236 168 208 206 160', stroke: '#9DB28F', 'stroke-width': 1.6, fill: 'none', pathLength: 1, class: 'draw draw--late' });
    s += '</svg>';
    return s;
  }

  return {
    C: C,
    openings: openings,
    sky: skyLayer,
    stars: starsLayer,
    far: farLayer,
    garden: gardenLayer,
    balustrade: balustradeLayer,
    arch: archLayer,
    glowLayer: function () {
      return svg(VB, PROP_DEFS + '<g class="slot" data-slot="-1" transform="translate(-1000 0)"></g><g class="slot" data-slot="0"></g><g class="slot" data-slot="1" transform="translate(1000 0)"></g>', 'glow');
    },
    propDefs: PROP_DEFS,
    props: {
      peacock: peacock,
      marigolds: marigolds,
      bells: bells,
      lanterns: lanterns,
      diyas: diyas,
      couple: coupleGroup,
    },
    ganesha: ganesha,
    crest: crest,
  };
})();
