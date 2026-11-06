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


// Homepage: transparent header over hero, original dark header when scrolled.
(function () {
  var header = document.querySelector('.home-page .site-header');
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
