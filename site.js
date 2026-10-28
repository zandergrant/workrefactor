// howworkruns — small progressive enhancements. The site works without JavaScript.

// Keep the footer year current.
document.querySelectorAll('[data-current-year]').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Close the mobile menu after choosing a link (same-page anchors otherwise leave it open).
document.querySelectorAll('.mobile-menu').forEach(function (menu) {
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { menu.removeAttribute('open'); });
  });
});
