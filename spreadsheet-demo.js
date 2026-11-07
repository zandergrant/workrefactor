// Passive sample-data walkthrough. No editing controls or external connections.
(function () {
  'use strict';
  var root = document.querySelector('.request-walkthrough');
  if (!root) return;
  var narration = root.querySelector('[data-rw-narration]');
  var scriptText = root.querySelector('[data-rw-script]');
  var syncText = root.querySelector('[data-rw-sync]');
  var replay = root.querySelector('[data-rw-replay]');
  var pause = root.querySelector('[data-rw-pause]');
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = motion.matches;
  var messages = [
    'Hundreds of requests arrive through forms, emails and surveys.',
    'Every request is sent to one shared spreadsheet.',
    'An automatic script cleans up fields and organizes the sheet.',
    'A simple web app makes the data easy to visualize and work with.',
    'A status is changed in the web app…',
    '…and that change is saved back to the spreadsheet.',
    'An owner is changed in the spreadsheet…',
    '…and the app reflects the update too.',
    'Your team can work in either view, using the same underlying data.'
  ];
  var delays = [2600, 2800, 3600, 3300, 1600, 2400, 1600, 2400];
  var step = 8, started = false, userPaused = false;
  var inView = !('IntersectionObserver' in window);
  var timer = null, remaining = 0, deadline = 0;
  function put(selector, text) { root.querySelector(selector).textContent = text; }
  function render() {
    root.dataset.step = String(step);
    var view = step === 0 ? 'source' : ([1,2,5,6].indexOf(step) !== -1 ? 'sheet' : 'app');
    root.dataset.mobile = reduced ? 'all' : view;
    root.querySelectorAll('[data-rw-stage]').forEach(function (element) {
      if (element.getAttribute('data-rw-stage') === view) element.setAttribute('aria-current', 'step');
      else element.removeAttribute('aria-current');
    });
    narration.textContent = messages[step];
    var raw = step < 2;
    put('[data-rw-title="104"]', raw ? 'site visit' : 'Site visit');
    put('[data-rw-title="108"]', raw ? 'new client' : 'New client setup');
    put('[data-rw-title="112"]', raw ? 'survey resp' : 'Survey follow-up');
    put('[data-rw-sam]', raw ? 'sam' : 'Sam');
    put('[data-rw-done]', raw ? 'done' : 'Complete');
    put('[data-rw-sheet-status]', raw ? 'in progress' : (step >= 5 ? 'Complete' : 'Assigned'));
    put('[data-rw-app-status]', step >= 4 ? 'Complete' : 'Assigned');
    put('[data-rw-sheet-owner]', raw ? '—' : (step >= 6 ? 'Maya' : 'Unassigned'));
    put('[data-rw-app-owner]', step >= 7 ? 'Maya' : 'Unassigned');
    put('[data-rw-assigned]', step >= 4 ? '81' : '82');
    put('[data-rw-complete]', step >= 4 ? '23' : '22');
    scriptText.textContent = step === 2 ? 'Standardizing fields, categorizing requests and flagging missing details…' : 'Cleans and organizes the sheet as requests arrive.';
    syncText.textContent = step === 4 || step === 5 ? 'App edit → shared spreadsheet' : (step === 6 || step === 7 ? 'Spreadsheet edit → web app' : 'Changes in the app update the sheet. Changes in the sheet update the app.');
  }
  function syncPlayback() {
    var running = started && step < 8 && !userPaused && inView && !document.hidden && !reduced;
    root.dataset.paused = running ? 'false' : 'true';
    pause.hidden = !started || step === 8 || reduced;
    pause.textContent = userPaused ? 'Resume' : 'Pause';
    pause.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
    if (!running && timer !== null) {
      window.clearTimeout(timer);
      timer = null;
      remaining = Math.max(0, deadline - performance.now());
    }
    if (running && timer === null) {
      deadline = performance.now() + remaining;
      timer = window.setTimeout(function () { timer = null; enter(step + 1); }, remaining);
    }
  }
  function enter(next) {
    step = next;
    render();
    remaining = delays[step] || 0;
    replay.textContent = reduced ? 'Replay' : (step === 8 ? 'Replay' : 'Restart');
    syncPlayback();
  }
  function play() {
    if (timer !== null) window.clearTimeout(timer);
    timer = null;
    started = true;
    userPaused = false;
    enter(reduced ? 8 : 0);
  }
  replay.addEventListener('click', play);
  pause.addEventListener('click', function () { userPaused = !userPaused; syncPlayback(); });
  root.querySelector('[data-rw-controls]').hidden = false;
  document.addEventListener('visibilitychange', syncPlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView && !started && !reduced) play();
      else syncPlayback();
    }, { threshold: .12 }).observe(root);
  }
  if (motion.addEventListener) motion.addEventListener('change', function (event) {
    reduced = event.matches;
    if (reduced) {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
      enter(8);
    }
  });
  if (reduced) enter(8);
  else if (inView) play();
  else { step = 0; render(); }
})();
