// Free resources: local-only recommendations and an automation evaluation.
(function () {
  var problem = document.getElementById('resource-problem');
  var recommendations = {
    chasing: ['Use the workflow audit to locate the bottleneck.', 'Follow three actual cases and capture where time was lost, who was waiting, and what required another message.', 1, 'Go to the workflow audit'],
    copying: ['Compare recurring tasks with the automation opportunity tracker.', 'Count how often employees transfer the same information and whether you could eliminate the step before automating it.', 2, 'Go to the automation tracker'],
    experiment: ['Test one change with the process experiment brief.', 'Document the baseline, change one thing, and decide what to keep using the results of a short test.', 3, 'Go to the experiment brief'],
    handoff: ['Clarify the handoff with the client brief.', 'Agree on what complete means for the receiving team, then test that definition against a delayed case.', 4, 'Go to the handoff brief'],
    owner: ['Map who can make decisions and when to escalate.', 'Name the person who can decide, what authority they have, and the specific conditions requiring escalation.', 5, 'Go to the ownership map'],
    sop: ['Make the recurring task easier to follow with a one-page SOP.', 'Document the ordinary case and its exceptions with the person doing the work, then ask someone else to follow it.', 6, 'Go to the SOP'],
    ai: ['Evaluate AI output against accepted answers.', 'Compare the model output with accepted answers on representative cases, including errors and escalations.', 7, 'Go to the AI evaluation sheet'],
    tool: ['Compare the options with the internal tool decision brief.', 'Watch a real task and compare improving existing software, connecting systems, and building a new tool.', 8, 'Go to the tool decision brief']
  };
  function selectResource() {
    var match = recommendations[problem.value] || recommendations.chasing;
    document.getElementById('resource-finder-title').textContent = match[0];
    document.getElementById('resource-finder-copy').textContent = match[1];
    var link = document.getElementById('resource-finder-link');
    link.setAttribute('href', '#resource-' + match[2]);
    link.textContent = match[3] + ' ↓';
  }
  if (problem) { problem.addEventListener('change', selectResource); selectResource(); }

  var form = document.getElementById('roi-calculator');
  if (!form) return;
  var currency = new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:0});
  var hoursFormat = new Intl.NumberFormat('en-US', {maximumFractionDigits:1});
  function read(id) {
    var control = document.getElementById(id);
    var n = control ? Number(control.value) : 0;
    return Number.isFinite(n) && n > 0 ? n : 0;
  }
  function out(id, value) { var el = document.getElementById(id); if (el) el.textContent = value; }
  function update() {
    var volume = read('roi-volume');
    var current = read('roi-current'), proposed = read('roi-proposed');
    var maintenance = read('roi-maintenance');
    var hourly = read('roi-labor'), tools = read('roi-running'), implementation = read('roi-build');
    var grossHours = volume * (current - proposed) / 60;
    var netHours = grossHours - maintenance;
    var laborValue = netHours * hourly;
    var monthlyNet = laborValue - tools;
    var cautiousNet = ((grossHours * 0.5) - maintenance) * hourly - tools;
    out('roi-hours', hoursFormat.format(netHours) + ' hours');
    out('roi-value', currency.format(laborValue));
    out('roi-net', currency.format(monthlyNet) + '/month');
    out('roi-payback', monthlyNet > 0 ? (implementation / monthlyNet).toFixed(1) + ' months' : 'No payback at these inputs');
    out('roi-conservative', currency.format(cautiousNet) + '/month');
    var note = 'These figures are illustrative, so replace them with observations from your own workflow.';
    if (current <= proposed) note = 'The proposed process takes at least as long per case as it does today. Account for quality or other benefits separately rather than assuming labor savings.';
    else if (monthlyNet <= 0) note = 'With these assumptions, recurring costs outweigh the estimated value of the time saved, so it is worth simplifying the process or revising the proposed approach.';
    else if (cautiousNet <= 0) note = 'The cautious scenario does not produce a positive financial result, so use a pilot to check how much of the estimated time reduction is realistic.';
    out('roi-message', note);
  }
  form.addEventListener('input', update);
  form.addEventListener('submit', function (e) { e.preventDefault(); update(); });
  update();
})();