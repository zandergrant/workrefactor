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

// A short hero illustration runs once when it enters view, then rests.
(function () {
  var scene = document.querySelector('.hero-system');
  if (!scene) return;
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var replay = scene.querySelector('.hero-system-replay');
  var started = false;
  function play() {
    if (motion.matches) return;
    started = true;
    scene.removeAttribute('data-running');
    // Restart CSS animations without changing the scene's layout.
    void scene.offsetWidth;
    scene.setAttribute('data-running', '');
  }
  replay.hidden = motion.matches;
  replay.addEventListener('click', play);
  if (!motion.matches) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !started) {
          play();
          observer.disconnect();
        }
      }, { threshold: .3 });
      observer.observe(scene);
    } else play();
  }
  if (motion.addEventListener) motion.addEventListener('change', function (event) {
    replay.hidden = event.matches;
    if (event.matches) scene.removeAttribute('data-running');
  });
})();
