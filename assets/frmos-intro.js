/*!
 * frmos-intro.js — animación de entrada de frmos.io (farmaOs)
 *
 * píldora → farmaOs → frmos.io → landing, en ~1.8 s.
 * Sin dependencias. Va como <script> bloqueante al inicio del <body>,
 * antes del contenido, para que no haya parpadeo.
 *
 * Reglas (brand-guidelines §9):
 *  - solo la primera visita (localStorage "frmos:intro:v1")
 *  - no se muestra con prefers-reduced-motion
 *  - clic, tecla, scroll o toque la saltan (también el botón "Saltar ×")
 *  - ?intro en la URL la fuerza (para revisarla)
 *
 * API: window.FrmosIntro.play({ force, speed, background, onDone })
 */
(function () {
  'use strict';

  var KEY = 'frmos:intro:v1';
  var BLUE = '#0E6AF2';
  var INK = '#111111';
  var NS = 'http://www.w3.org/2000/svg';

  // Glifos del wordmark (logo.blu.farmaos.svg, viewBox 2174×776). La "O" se
  // dibuja aparte como anillo para poder convertir la píldora en letra.
  var GLYPHS = {
    f: 'M329.781 232.449C341.696 231.287 355.058 231.517 366.993 231.761C366.804 249.962 366.813 268.164 367.02 286.364C333.844 286.953 316.054 293.554 315.887 329.894C326.144 330.508 336.62 329.818 347.405 330.575C347.517 349.392 347.85 368.208 348.407 387.017C337.804 387.257 327.199 387.418 316.593 387.498C316.286 430.321 315.629 480.947 317.442 523.148C307.485 523.348 297.235 523.286 287.25 523.349L245.959 523.274C246.496 480.424 246.434 430.771 245.565 388.033C236.432 387.418 223.799 387.628 214.455 387.538C214.952 368.2 215.126 348.855 214.978 329.511C225.318 329.313 235.661 329.254 246.002 329.332C245.983 304.573 247.341 287.228 263.647 266.694C280.993 244.851 302.828 235.692 329.781 232.449Z',
    a1: 'M474.268 318.383C505.057 316.654 521.687 323.133 547.409 337.755C547.468 333.93 547.319 331.527 548.579 327.852C552.834 324.874 609.525 326.357 619.496 326.551C620.131 345.77 619.131 369.423 619.122 389.129L619.575 523.36C595.235 523.424 570.894 523.342 546.554 523.116L547.196 508.743C540.209 513.883 536.42 516.4 528.879 520.77C518.177 526.655 500.691 530.425 488.61 531.335C457.908 533.531 427.61 523.304 404.52 502.949C382.995 484.332 372.427 459.29 370.454 431.208C365.935 366.882 411.709 322.828 474.268 318.383ZM501.548 473.779C529.565 469.146 548.553 442.719 544.005 414.688C539.457 386.657 513.089 367.589 485.044 372.051C456.878 376.532 437.708 403.04 442.276 431.193C446.843 459.345 473.41 478.433 501.548 473.779Z',
    r: 'M773.357 324.521C780.351 324.433 787.347 324.457 794.341 324.59C795.698 342.273 793.749 362.748 795.087 381.804C765.658 378.376 735.012 380.191 727.922 414.896C725.486 426.822 726.683 443.187 726.692 455.623C726.565 478.153 726.725 500.683 727.172 523.209C706.98 523.912 683.224 523.328 662.749 523.351L658.993 522.753C658.653 522.27 657.978 521.553 657.777 521.028C655.661 515.491 656.5 342.446 657.458 326.67C678.081 325.468 704.714 326 725.564 326.409L725.253 342.8C741.225 330.922 753.462 325.264 773.357 324.521Z',
    m: 'M964.034 319.446C979.473 318.711 1012.33 325.327 1023.78 334.807C1055.62 361.165 1040.79 349.028 1072.23 331.556C1087.46 323.244 1104.55 318.925 1121.9 319.001C1147.6 319.018 1172.52 327.186 1191.07 345.42C1217.15 371.066 1213.18 409.631 1213.18 443.171L1212.83 523.769C1191.44 524.527 1167.11 523.997 1145.5 524.011C1145.64 521.468 1145.72 518.922 1145.74 516.375C1146.16 492.295 1146.41 468.211 1146.51 444.127C1146.54 430.164 1147.08 416.438 1144.92 402.442C1140.47 372.978 1097.86 364.095 1078.53 383.891C1070.09 392.534 1064.2 405.88 1064.01 417.908C1063.65 440.597 1063.78 463.692 1063.8 486.369L1063.83 523.855C1042.38 524.305 1016.85 523.863 995.395 523.486L995.775 452.876C995.909 436.131 997.406 415.97 993.151 399.823C985.072 369.657 940.477 364.49 920.158 384.16C901.074 402.635 905.444 434.794 905.568 459.445C905.712 480.784 905.636 502.124 905.342 523.462C883.424 524.344 856.827 523.636 834.736 523.582L834.514 326.113C851.809 325.701 884.657 325.924 901.41 327.076C901.722 332.18 901.638 338.591 901.715 343.804C919.858 326.351 939.348 320.881 964.034 319.446Z',
    a2: 'M1330.27 320.412C1353 317.746 1377.64 320.815 1397.87 331.754C1401.31 333.612 1406.2 336.606 1410.06 336.738C1412.46 334.934 1411.25 332.964 1412.18 328.285C1416.67 324.953 1473.84 326.477 1483.19 326.671C1484.45 344.814 1483.81 372.407 1483.9 391.588C1484.16 435.641 1484.03 479.695 1483.51 523.746C1464.85 524.768 1432.5 523.772 1413.08 523.029C1410.59 522.933 1412.93 515.904 1411.36 512.792C1408.5 512.501 1404.09 515.912 1401.41 517.606C1336.51 553.439 1255.74 519.452 1240.15 445.61C1230.03 397.666 1255.06 346.949 1300.5 328.473C1310.55 324.387 1319.54 322.258 1330.27 320.412ZM1367.54 475.377C1395.87 470.418 1414.86 443.501 1410.03 415.155C1405.2 386.808 1378.37 367.694 1350.01 372.39C1321.45 377.116 1302.18 404.161 1307.04 432.693C1311.9 461.226 1339.03 480.368 1367.54 475.377Z',
    s: 'M1930.83 310.439C1961.19 309.345 1988.51 315.336 2015.46 329.48C2011.14 341.424 2003.89 355.624 1997.43 366.489C1983.86 361.316 1933.49 338.573 1930.77 369.034C1930.47 384.218 1952.42 390.007 1963.09 393.779C1981.22 400.426 2005.71 408.426 2017.91 423.951C2047.81 461.999 2028.52 516.526 1981.21 528.075C1958.44 533.631 1950.46 535.177 1927.62 533.276C1898.74 530.538 1873.69 518.848 1850.02 502.548C1858.96 488.322 1865.26 476.115 1873.05 461.205C1892.13 474.424 1913.53 485.986 1937.62 484.509C1943.27 484.266 1951.38 481.698 1954.73 476.835C1975.43 446.365 1926.53 440.589 1908.52 432.123C1906.39 431.352 1904.24 430.324 1902.15 429.508C1880.05 420.875 1860.88 405.586 1858.57 380.447C1857.24 365.916 1862.02 346.702 1871.35 335.197C1885.8 317.4 1909.48 312.639 1930.83 310.439Z'
  };

  // Línea de tiempo en ms (a velocidad 1). Total ≈ 1780 ms.
  var T = {
    drop: [0, 320],          // la píldora cae
    morph: [260, 620],       // píldora → "O"
    toInk: [420, 700],       // azul → negro: aparece farmaOs
    lettersIn: 380,          // primer glifo entra
    stagger: 40,
    letterDur: 260,
    shift: [900, 1240],      // farmaOs → frmos (se caen las "a")
    aDrop: [880, 1140],
    pops: [1100, 1150, 1200],// ".", "i", "o" de .io
    popDur: 190,
    fade: [1500, 1780]       // se descubre la landing
  };
  var TOTAL = T.fade[1];

  // Destino de cada letra en "frmos.io" (desplazamiento horizontal, unidades del viewBox)
  var DX = { f: 68, r: -191, m: -200, s: -563 };
  // Anillo "O": centro, radio de la línea media y grosor
  var RING_A = { cx: 1669.5, cy: 395, r: 122, sw: 62 };
  var RING_B = { cx: 1150, cy: 429, r: 85.4, sw: 43.4 };

  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function prog(t, a, b) { return clamp((t - a) / (b - a)); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function outCubic(k) { return 1 - Math.pow(1 - k, 3); }
  function inCubic(k) { return k * k * k; }
  function inOutCubic(k) { return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }
  function outBack(k) { var c = 1.4; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); }
  function mix(c1, c2, k) {
    var a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
    var r = Math.round(lerp(a >> 16, b >> 16, k)), g = Math.round(lerp((a >> 8) & 255, (b >> 8) & 255, k)), bl = Math.round(lerp(a & 255, b & 255, k));
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function seen() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function markSeen() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }
  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function play(opts) {
    opts = opts || {};
    var speed = opts.speed || 1;
    var onDone = opts.onDone || function () {};
    if (!opts.force && (seen() || reducedMotion())) { onDone(); return null; }
    markSeen();

    var root = document.createElement('div');
    root.setAttribute('aria-hidden', 'true');
    root.setAttribute('data-frmos-intro', '');
    root.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;' +
      'background:' + (opts.background || '#FFFFFF') + ';cursor:pointer;-webkit-tap-highlight-color:transparent;';

    // Botón visible para cerrar (cualquier clic, tecla, scroll o toque también la salta).
    var close = document.createElement('button');
    close.type = 'button';
    close.tabIndex = -1;
    close.textContent = 'Saltar ×';
    close.style.cssText = 'position:absolute;top:16px;right:16px;padding:6px 14px;border:1px solid #E5E5EA;border-radius:999px;' +
      'background:#FFFFFF;color:#6E6E73;font:500 12px Inter,-apple-system,BlinkMacSystemFont,sans-serif;cursor:pointer;';
    root.appendChild(close);

    var svg = el('svg', { viewBox: '0 0 2174 776', width: '100%', role: 'presentation' });
    svg.style.cssText = 'width:min(78vw,560px);height:auto;overflow:visible;display:block;';
    root.appendChild(svg);

    var g = {};
    ['f', 'a1', 'r', 'm', 'a2', 's'].forEach(function (id) { g[id] = el('path', { d: GLYPHS[id], fill: INK }, svg); });
    // La "O": un rect redondeado con trazo. Alto 0 = cápsula; cuadrado con rx = r = anillo.
    var ring = el('rect', { fill: 'none', 'stroke-linejoin': 'round' }, svg);
    // ".io"
    var dot = el('circle', { cx: 1525, cy: 497, r: 35 }, svg);
    var iStem = el('rect', { x: 1578, y: 318, width: 70, height: 205 }, svg);
    var iDot = el('circle', { cx: 1613, cy: 263, r: 36 }, svg);
    var o2 = el('circle', { cx: 1785, cy: RING_B.cy, r: RING_B.r, fill: 'none', 'stroke-width': RING_B.sw }, svg);
    var io = [dot, el('g', {}, svg), o2];
    io[1].appendChild(iStem); io[1].appendChild(iDot);
    var ioCenters = [[1525, 497], [1613, 420], [1785, RING_B.cy]];

    function set(n, k, v) { n.setAttribute(k, v); }

    function draw(t) {
      // Color global: azul (píldora) → negro (farmaOs) → azul (frmos.io)
      var inkK = outCubic(prog(t, T.toInk[0], T.toInk[1]));
      var blueK = inOutCubic(prog(t, T.shift[0], T.shift[1]));
      var letterColor = mix(INK, BLUE, blueK);
      var ringColor = blueK > 0 ? letterColor : mix(BLUE, INK, inkK);

      // Píldora → O → o
      var kd = prog(t, T.drop[0], T.drop[1]);
      var km = inOutCubic(prog(t, T.morph[0], T.morph[1]));
      var ks = inOutCubic(prog(t, T.shift[0], T.shift[1]));
      var cx = lerp(RING_A.cx, RING_B.cx, ks), cy = lerp(RING_A.cy, RING_B.cy, ks);
      var r = lerp(RING_A.r, RING_B.r, ks), sw = lerp(RING_A.sw, RING_B.sw, ks);
      // cápsula 300×116 (como la píldora del isotipo) → anillo
      var w = lerp(184, 2 * r, km), h = lerp(0, 2 * r, km);
      sw = lerp(116, sw, km);
      var rot = lerp(-45, 0, km);
      var ty = lerp(-260, 0, outBack(kd));
      set(ring, 'x', cx - w / 2); set(ring, 'y', cy - h / 2);
      set(ring, 'width', w); set(ring, 'height', h);
      set(ring, 'rx', Math.min(h / 2, w / 2)); set(ring, 'ry', Math.min(h / 2, w / 2));
      set(ring, 'stroke-width', sw); set(ring, 'stroke', ringColor);
      set(ring, 'transform', 'translate(0 ' + ty + ') rotate(' + rot + ' ' + cx + ' ' + cy + ')');
      set(ring, 'opacity', clamp(t / 120));

      // Letras de farmaOs entran desde la O hacia afuera
      var order = [['a2', 0], ['s', 0], ['m', 1], ['r', 2], ['a1', 3], ['f', 4]];
      order.forEach(function (o) {
        var id = o[0], start = T.lettersIn + o[1] * T.stagger;
        var k = outCubic(prog(t, start, start + T.letterDur));
        var dy = lerp(36, 0, k), op = k, dx = 0, rotA = 0;
        if (id === 'a1' || id === 'a2') {
          var ka = inCubic(prog(t, T.aDrop[0], T.aDrop[1]));
          dy += lerp(0, 150, ka); op *= 1 - ka; rotA = (id === 'a1' ? -18 : 14) * ka;
        } else {
          dx = lerp(0, DX[id], ks);
        }
        var n = g[id];
        set(n, 'fill', letterColor);
        set(n, 'opacity', op);
        var c = id === 'a1' ? '495 425' : '1362 425';
        set(n, 'transform', 'translate(' + dx + ' ' + dy + ')' + (rotA ? ' rotate(' + rotA + ' ' + c + ')' : ''));
      });

      // ".io"
      io.forEach(function (n, i) {
        var k = prog(t, T.pops[i], T.pops[i] + T.popDur);
        var s = k === 0 ? 0.001 : outBack(k);
        var c = ioCenters[i];
        set(n, 'opacity', k > 0 ? 1 : 0);
        set(n, 'transform', 'translate(' + c[0] + ' ' + c[1] + ') scale(' + s + ') translate(' + (-c[0]) + ' ' + (-c[1]) + ')');
        if (n === o2) set(n, 'stroke', BLUE); else set(n, 'fill', BLUE);
      });
      set(iStem, 'fill', BLUE); set(iDot, 'fill', BLUE);

      // Salida
      root.style.opacity = 1 - outCubic(prog(t, T.fade[0], T.fade[1]));
    }

    var start = null, raf = 0, skipAt = null, done = false;
    function finish() {
      if (done) return; done = true;
      cancelAnimationFrame(raf);
      ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (e) { window.removeEventListener(e, skip, true); });
      if (root.parentNode) root.parentNode.removeChild(root);
      onDone();
    }
    function skip() { if (skipAt === null) skipAt = performance.now(); }
    function frame(now) {
      if (start === null) start = now;
      var t = (now - start) * speed;
      if (skipAt !== null) {
        var k = (now - skipAt) / 200;
        root.style.opacity = Math.min(+root.style.opacity || 1, 1 - k);
        if (k >= 1) return finish();
      } else {
        draw(t);
        if (t >= TOTAL) return finish();
      }
      raf = requestAnimationFrame(frame);
    }
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (e) { window.addEventListener(e, skip, { capture: true, passive: true }); });

    draw(0);
    (opts.mount || document.body || document.documentElement).appendChild(root);
    if (!opts.paused) raf = requestAnimationFrame(frame);
    return { skip: skip, root: root, draw: draw, finish: finish };
  }

  window.FrmosIntro = { play: play, duration: TOTAL, storageKey: KEY };

  if (!window.FRMOS_INTRO_MANUAL) {
    var force = /[?&]intro\b/.test(location.search);
    play({ force: force });
  }
})();
