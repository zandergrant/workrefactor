// Passive sample-data walkthrough. No editing controls or external connections.
(function () {
  'use strict';
  var root = document.querySelector('.request-walkthrough');
  if (!root) return;
  var replay = root.querySelector('[data-rw-replay]');
  var pause = root.querySelector('[data-rw-pause]');
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = motion.matches;
  var messages = [
    'Hundreds of requests arrive through forms, emails and surveys.',
    'Every request is sent to one shared spreadsheet.',
    'An automatic script cleans up fields and organizes the sheet.',
    'A simple web app makes the data easy to visualize and work with.',
    'Someone changes the status in the web app.',
    'That change appears in the shared spreadsheet.',
    'Someone updates the owner in the spreadsheet.',
    'The web app shows the new owner as well.',
    'Your team can work in either view, using the same underlying data.'
  ];
  var delays = [3000, 3400, 4200, 4000, 2600, 3000, 2600, 3000];
  var step = 8, started = false, userPaused = false;
  var inView = !('IntersectionObserver' in window);
  var timer = null, remaining = 0, deadline = 0;

  // Reserve every text variant up front so playback never changes the layout.
  function reserve(selector, values) {
    var element = root.querySelector(selector);
    var live = document.createElement('span');
    live.className = 'rw-live-text';
    live.textContent = element.textContent;
    element.textContent = '';
    var slot = document.createElement('span');
    slot.className = 'rw-text-slot';
    element.appendChild(slot);
    slot.appendChild(live);
    values.forEach(function (value) {
      var measure = document.createElement('span');
      measure.className = 'rw-text-measure';
      measure.setAttribute('aria-hidden', 'true');
      measure.textContent = value;
      slot.appendChild(measure);
    });
  }
  reserve('[data-rw-narration]', messages);
  reserve('[data-rw-script]', [
    'The script standardizes fields, categorizes requests and flags missing details.',
    'The script organizes new requests as they arrive.'
  ]);
  reserve('[data-rw-sync]', [
    'App edit → shared spreadsheet',
    'Spreadsheet edit → web app',
    'Both views use the same shared records, so an update made in either place appears in the other.'
  ]);
  reserve('[data-rw-app-status]', ['Assigned', 'Complete']);
  reserve('[data-rw-sheet-status]', ['in progress', 'Assigned', 'Complete']);
  reserve('[data-rw-sheet-owner]', ['—', 'Unassigned', 'Maya']);
  reserve('[data-rw-app-owner]', ['Unassigned', 'Maya']);
  reserve('[data-rw-title="104"]', ['site visit', 'Site visit']);
  reserve('[data-rw-title="108"]', ['new client', 'New client setup']);
  reserve('[data-rw-title="112"]', ['survey resp', 'Survey follow-up']);
  reserve('[data-rw-done]', ['done', 'Complete']);

  function put(selector, text) {
    var element = root.querySelector(selector);
    (element.querySelector('.rw-live-text') || element).textContent = text;
  }
  function render() {
    root.dataset.step = String(step);
    var view = step === 0 ? 'source' : ([1,2,5,6].indexOf(step) !== -1 ? 'sheet' : 'app');
    root.dataset.mobile = reduced ? 'all' : view;
    root.dataset.caption = step % 2 ? 'odd' : 'even';
    put('[data-rw-chapter]', step < 1 ? '01 / Requests arrive' : (step < 3 ? '02 / Collect and organize' : (step < 4 ? '03 / A clearer way to work' : '04 / Connected in both directions')));
    put('[data-rw-narration]', messages[step]);
    var raw = step < 2;
    put('[data-rw-title="104"]', raw ? 'site visit' : 'Site visit');
    put('[data-rw-title="108"]', raw ? 'new client' : 'New client setup');
    put('[data-rw-title="112"]', raw ? 'survey resp' : 'Survey follow-up');
    put('[data-rw-sam]', raw ? 'sam' : 'Sam');
    put('[data-rw-done]', raw ? 'done' : 'Complete');
    put('[data-rw-sheet-status]', raw ? 'in progress' : (step >= 5 ? 'Complete' : 'Assigned'));
    put('[data-rw-app-status]', step >= 4 ? 'Complete' : 'Assigned');
    root.querySelector('[data-rw-card="104"] .rw-app-state').dataset.rwState = step >= 4 ? 'complete' : 'assigned';
    put('[data-rw-sheet-owner]', raw ? '—' : (step >= 6 ? 'Maya' : 'Unassigned'));
    put('[data-rw-app-owner]', step >= 7 ? 'Maya' : 'Unassigned');
    put('[data-rw-assigned]', step >= 4 ? '81' : '82');
    put('[data-rw-complete]', step >= 4 ? '23' : '22');
    put('[data-rw-script]', step === 2 ? 'The script standardizes fields, categorizes requests and flags missing details.' : 'The script organizes new requests as they arrive.');
    put('[data-rw-sync]', step === 4 || step === 5 ? 'App edit → shared spreadsheet' : (step === 6 || step === 7 ? 'Spreadsheet edit → web app' : 'Both views use the same shared records, so an update made in either place appears in the other.'));
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
