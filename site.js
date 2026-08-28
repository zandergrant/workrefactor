// Edit these values once and the visible brand/contact details update site-wide.
const SITE = {
  name: "Your Company",
  email: "hello@example.com"
};

document.querySelectorAll('[data-site-name]').forEach(el => el.textContent = SITE.name);
document.querySelectorAll('[data-site-email]').forEach(el => {
  el.textContent = SITE.email;
  if (el.tagName === 'A') el.href = `mailto:${SITE.email}`;
});
document.querySelectorAll('[data-current-year]').forEach(el => el.textContent = new Date().getFullYear());

const toggle = document.querySelector('.menu-toggle');
const mobile = document.querySelector('#mobile-nav');
if (toggle && mobile) {
  toggle.addEventListener('click', () => {
    const open = mobile.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  });
}
