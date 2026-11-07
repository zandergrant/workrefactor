// howworkruns — small progressive enhancements. The site works without JavaScript.

// Keep the footer year current.
document.querySelectorAll('[data-current-year]').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Close the mobile menu after choosing a link, tapping outside it, or changing section.
(function () {
  var menus = document.querySelectorAll('.mobile-menu');
  function closeAll() { menus.forEach(function (m) { m.open = false; m.removeAttribute('open'); }); }
  menus.forEach(function (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeAll(); }
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.mobile-menu')) { closeAll(); }
  });
  window.addEventListener('hashchange', closeAll);
  window.addEventListener('pageshow', closeAll);
})();


// Homepage and contact page: transparent header over hero, dark header on scroll.
(function () {
  var header = document.querySelector('.home-page .site-header, .contact-page .site-header');
  if (!header) return;
  document.body.classList.add('scroll-header-enabled');
  function syncHeader() {
    var menuIsOpen = !!header.querySelector('.mobile-menu[open]');
    header.classList.toggle('is-scrolled', window.scrollY > 24 || menuIsOpen);
  }
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
  window.addEventListener('pageshow', syncHeader);
  var menu = header.querySelector('.mobile-menu');
  if (menu) menu.addEventListener('toggle', syncHeader);
})();

// Hero machine: a deliberately slow queue becomes a smooth, organized flow.
(function () {
  var scene = document.querySelector('.hero-system');
  if (!scene) return;
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var inputs = scene.querySelectorAll('[data-hm-input]');
  var outputs = scene.querySelectorAll('[data-hm-output]');
  var slowOutput = scene.querySelector('.hm-slow-output');
  var replay = scene.querySelector('.hero-system-replay');
  var pause = scene.querySelector('.hero-system-pause');
  var controls = scene.querySelector('.hero-system-controls');
  var duration = 16500, elapsed = 0, last = null, frameId = null;
  var started = false, userPaused = false, inView = !('IntersectionObserver' in window);
  function clamp(n) { return Math.max(0, Math.min(1, n)); }
  function position(node, x, y, opacity) {
    node.setAttribute('transform', 'translate(' + x.toFixed(2) + ' ' + y.toFixed(2) + ')');
    node.setAttribute('opacity', String(opacity));
  }
  function render(time) {
    var phase = time < 5000 ? 'jam' : time < 8000 ? 'inspect' : time < 9500 ? 'repair' : 'flow';
    if (scene.dataset.phase !== phase) scene.dataset.phase = phase;
    inputs.forEach(function (input, i) {
      var queueX = i === 0 ? 378 : 295 - (i - 1) * 27;
      var jamTime = Math.min(time, 5000);
      var progress = i === 0
        ? (jamTime < 1100 ? jamTime / 1100 * .6 : jamTime < 2000 ? .6 : jamTime < 3000 ? .6 + (jamTime - 2000) / 1000 * .3 : .9 + clamp((jamTime - 3000) / 800) * .1)
        : clamp((jamTime - i * 140) / 2100);
      var x = 35 + (queueX - 35) * progress;
      var y = (56 + (i % 3) * 48) + (104 - (56 + (i % 3) * 48)) * progress;
      var output = outputs[i], endX = 578 + i % 4 * 34, endY = i < 4 ? 90 : 122;
      if (time >= 9500) {
        var flow = clamp((time - 9500 - i * 360) / 3400);
        x = queueX + (endX - queueX) * flow;
        y = 104 + (endY - 104) * clamp((x - 464) / (endX - 464));
        var converted = clamp((x - 391) / 16);
        position(input, x, y, 1 - converted);
        position(output, x, y, converted);
      } else {
        position(input, x, y, clamp((time - i * 90) / 250));
        position(output, endX, endY, 0);
      }
    });
    var slowX = time < 3500 ? 475 : time < 3850 ? 475 + (time - 3500) / 350 * 40 : time < 4350 ? 515 : 515 + clamp((time - 4350) / 650) * 210;
    position(slowOutput, slowX, 104, time > 3200 && time < 5000 ? clamp((time - 3200) / 200) * clamp((5000 - time) / 200) : 0);
  }
  function running() {
    return started && elapsed < duration && !userPaused && inView && !document.hidden && !motion.matches;
  }
  function sync() {
    var active = running();
    scene.dataset.paused = active ? 'false' : 'true';
    pause.hidden = !started || elapsed >= duration || motion.matches;
    pause.textContent = userPaused ? 'Resume animation' : 'Pause animation';
    pause.setAttribute('aria-pressed', String(userPaused));
    if (!active && frameId !== null) { window.cancelAnimationFrame(frameId); frameId = null; last = null; }
    if (active && frameId === null) frameId = window.requestAnimationFrame(tick);
  }
  function tick(now) {
    frameId = null;
    if (!running()) { last = null; sync(); return; }
    if (last !== null) elapsed = Math.min(duration, elapsed + now - last);
    last = now;
    render(elapsed);
    sync();
  }
  function play() {
    if (motion.matches) return;
    if (frameId !== null) window.cancelAnimationFrame(frameId);
    frameId = null; elapsed = 0; last = null; started = true; userPaused = false;
    render(0); sync();
  }
  controls.hidden = motion.matches;
  replay.addEventListener('click', play);
  pause.addEventListener('click', function () { userPaused = !userPaused; sync(); });
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView && !started && !motion.matches) play();
      else sync();
    }, { threshold: .2 }).observe(scene);
  }
  if (motion.addEventListener) motion.addEventListener('change', function (event) {
    controls.hidden = event.matches;
    if (event.matches) { elapsed = duration; render(duration); sync(); }
  });
  if (motion.matches) { elapsed = duration; render(duration); }
  else if (inView) play();
  else render(0);
})();
