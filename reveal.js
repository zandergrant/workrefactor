// Progressive, one-time fade-up reveals for grouped information.
// Without JavaScript, unsupported browsers, or reduced motion, content is visible.
(function () {
  'use strict';
  if (!('IntersectionObserver' in window) ||
      !window.matchMedia ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var groups = [
    '.home-page .symptom-grid > li',
    '.home-page .ba-steps > li',
    '.home-page .service-list > .service-row',
    '.home-page .work-list > .work-entry',
    '.home-page .method-overview > .method-step',
    '.home-page .guide-grid > .friction-card',
    '.resources-page .resource-hub-grid > .resource-hub-card',
    '.resources-page .resource-list > .resource-entry',
    '.resources-page .resources-prose-grid > *',
    '.consult-page .consult-problem-grid > *',
    '.consult-page .consult-steps > *',
    '.consult-page .consult-service-grid > *',
    '.consult-page .consult-proof-grid > *',
    '.consult-page .consult-reading-links > *',
    '.guide-page .service-list > .service-row',
    '.guide-page .approach-list > .approach-row',
    '.guide-page .philosophy-grid > *',
    '.guide-page .friction-card',
    '.atlas-page .atlas-cards > .atlas-card',
    '.atlas-page .atlas-path > li',
    '.atlas-page .atlas-signal-list > li',
    '.atlas-page .atlas-action-list > li',
    '.atlas-page .atlas-measures > .atlas-measure',
    '.rl-body .rl-grid > .rl-card',
    '.rl-body .rl-recipe-grid > .rl-recipe',
    '.rl-body .rl-article > .rl-callout'
  ];
  var targets = document.querySelectorAll(groups.join(','));
  if (!targets.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('hwr-reveal-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -12px 0px' });

  var offsets = new Map();
  targets.forEach(function (el) {
    var parent = el.parentElement;
    var index = offsets.get(parent) || 0;
    offsets.set(parent, index + 1);
    el.classList.add('hwr-reveal-pending', 'hwr-reveal-step-' + (index % 4));
    observer.observe(el);
  });
})();
