// Sample-data illustration only: no external spreadsheet or network connection.
(function () {
  'use strict';
  var root = document.querySelector('.sheet-flow');
  if (!root) return;
  var status = root.querySelector('[data-flow-status]');
  var replay = root.querySelector('[data-flow-replay]');
  var pause = root.querySelector('[data-flow-pause]');
  var script = root.querySelector('[data-flow-script]');
  var reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = reducedQuery.matches;
  var records = [
    { id: 'review', title: 'Design review', date: '12 Nov', rawTitle: 'design review', rawDate: '11/12/26', owner: 'Riley', ready: false },
    { id: 'onboarding', title: 'Team onboarding', date: '14 Nov', rawTitle: 'TEAM ONBOARDING', rawDate: '2026-11-14', owner: 'Sam', ready: true },
    { id: 'workshop', title: 'Customer workshop', date: '16 Nov', rawTitle: 'Customer workshop', rawDate: '16/11/26', owner: 'Alex', ready: false }
  ];
  var messages = [
    'Event details arrive through emails, forms, and planning notes.',
    'The incoming entries are collected in a shared Google Sheet.',
    'Apps Script standardizes dates, merges a duplicate, and maps the statuses.',
    'The web app presents the same records in a clearer, usable interface.',
    'An event is confirmed in the app, and the change is written back to the sheet.',
    'Try it: change a status in the sheet or confirm an event in the app.'
  ];
  var delays = [1600, 2200, 2500, 2400, 2500];
  var step = 5;
  var started = false;
  var inView = !('IntersectionObserver' in window);
  var userPaused = false;
  var timer = null;
  var remaining = 0;
  var deadline = 0;
  var flashTimer = null;
  var flashedId = null;
  var duplicate = root.querySelector('[data-flow-duplicate]');
  function message(text) { status.textContent = text; }
  function clearFlash() {
    root.querySelectorAll('.is-updated').forEach(function (element) { element.classList.remove('is-updated'); });
    flashedId = null;
  }
  function flash(id) {
    if (flashTimer) window.clearTimeout(flashTimer);
    clearFlash();
    flashedId = id;
    root.querySelector('[data-flow-view="' + (root.dataset.lastEdit === 'app' ? 'sheet' : 'app') + '"]').classList.add('is-updated');
    root.querySelector('[data-flow-row="' + id + '"]').classList.add('is-updated');
    root.querySelector('[data-flow-card="' + id + '"]').classList.add('is-updated');
    flashTimer = window.setTimeout(clearFlash, 2000);
  }
  function setView(view) {
    root.dataset.mobilePanel = view;
    root.querySelectorAll('[data-flow-view]').forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-flow-view') === view ? 'true' : 'false');
    });
  }
  function render() {
    var raw = step < 2;
    records.forEach(function (record) {
      var row = root.querySelector('[data-flow-row="' + record.id + '"]');
      var cells = row.children;
      cells[0].textContent = raw ? record.rawTitle : record.title;
      cells[1].textContent = raw ? record.rawDate : record.date;
      var cellButton = row.querySelector('[data-sheet-edit]');
      var state = record.ready ? 'Ready' : 'Needs confirmation';
      cellButton.textContent = raw ? (record.ready ? 'ready' : 'TBC') : state;
      cellButton.disabled = step !== 5;
      cellButton.setAttribute('aria-label', 'Change ' + record.title + ' status in the spreadsheet, currently ' + state);
      root.querySelector('[data-app-status="' + record.id + '"]').textContent = '· ' + state;
      var appButton = root.querySelector('[data-app-edit="' + record.id + '"]');
      appButton.textContent = record.ready ? 'Reopen' : 'Confirm';
      appButton.disabled = step !== 5;
      appButton.setAttribute('aria-label', (record.ready ? 'Reopen ' : 'Confirm ') + record.title + ' in the web app');
    });
    root.querySelector('[data-flow-count]').textContent = '3 events · ' + records.filter(function (record) { return !record.ready; }).length + ' to confirm';
    if (duplicate) duplicate.hidden = step !== 1;
  }
  function syncPlayback() {
    var canRun = started && step < 5 && !userPaused && inView && !document.hidden && !reduced;
    root.dataset.paused = canRun ? 'false' : 'true';
    pause.hidden = !started || step === 5 || reduced;
    pause.textContent = userPaused ? 'Resume' : 'Pause';
    pause.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
    if (!canRun && timer !== null) {
      window.clearTimeout(timer);
      timer = null;
      remaining = Math.max(0, deadline - performance.now());
    }
    if (canRun && timer === null) {
      deadline = performance.now() + remaining;
      timer = window.setTimeout(function () {
        timer = null;
        enter(step + 1);
      }, remaining);
    }
  }
  function enter(nextStep) {
    step = nextStep;
    root.dataset.step = String(step);
    setView(step === 0 ? 'source' : (step < 3 || step === 4 ? 'sheet' : 'app'));
    if (step === 4) records[0].ready = true;
    render();
    message(messages[step]);
    script.textContent = step === 2 ? 'Standardizing dates, merging duplicates, mapping statuses…' : (step < 2 ? 'Waiting for incoming records' : 'Dates standardized · duplicates merged · status mapped');
    if (step === 4) {
      root.dataset.lastEdit = 'app';
      flash('review');
    }
    if (step === 5) {
      clearFlash();
      replay.textContent = reduced ? 'Reset example' : 'Replay';
    }
    remaining = delays[step] || 0;
    syncPlayback();
  }
  function play() {
    if (timer !== null) window.clearTimeout(timer);
    timer = null;
    if (flashTimer) window.clearTimeout(flashTimer);
    clearFlash();
    records[0].ready = false;
    records[1].ready = true;
    records[2].ready = false;
    started = true;
    userPaused = false;
    if (reduced) {
      enter(5);
      message('Motion is reduced. You can still change a status in either view.');
    } else {
      replay.textContent = 'Restart';
      enter(0);
    }
  }
  root.addEventListener('click', function (event) {
    var viewButton = event.target.closest('[data-flow-view]');
    if (viewButton && root.contains(viewButton)) {
      if (step < 5) {
        if (timer !== null) window.clearTimeout(timer);
        timer = null;
        enter(5);
      }
      setView(viewButton.getAttribute('data-flow-view'));
      return;
    }
    var button = event.target.closest('[data-sheet-edit], [data-app-edit]');
    if (!button || !root.contains(button) || step !== 5 || button.disabled) return;
    var fromSheet = button.hasAttribute('data-sheet-edit');
    var id = fromSheet ? button.getAttribute('data-sheet-edit') : button.getAttribute('data-app-edit');
    var record = records.filter(function (entry) { return entry.id === id; })[0];
    if (!record) return;
    record.ready = !record.ready;
    root.dataset.lastEdit = fromSheet ? 'sheet' : 'app';
    render();
    flash(id);
    message(record.title + (record.ready ? ' is now ready.' : ' needs confirmation again.') + (fromSheet ? ' Updated in the sheet and reflected in the app.' : ' Updated in the app and written back to the sheet.'));
  });
  replay.addEventListener('click', play);
  pause.addEventListener('click', function () {
    userPaused = !userPaused;
    syncPlayback();
  });
  root.querySelector('[data-flow-controls]').hidden = false;
  root.querySelector('[data-flow-views]').hidden = false;
  document.addEventListener('visibilitychange', syncPlayback);
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView && !started && !reduced) play();
      else syncPlayback();
    }, { threshold: 0.12 });
    observer.observe(root);
  }
  function motionChanged(event) {
    reduced = event.matches;
    if (reduced) {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
      enter(5);
      message('Motion is reduced. You can still change a status in either view.');
      replay.textContent = 'Reset example';
    }
  }
  if (reducedQuery.addEventListener) reducedQuery.addEventListener('change', motionChanged);
  if (reduced) {
    enter(5);
    replay.textContent = 'Reset example';
    message('Motion is reduced. Try editing a status in either view.');
  } else if (inView) play();
  else {
    step = 0;
    root.dataset.step = '0';
    setView('source');
    render();
    message(messages[0]);
    script.textContent = 'Waiting for incoming records';
  }
})();
