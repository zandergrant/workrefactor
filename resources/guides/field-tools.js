/* How Work Runs | Field tools. Browser-only, no tracking or external requests. */
(() => {
  'use strict';
  const $ = (q, el = document) => el.querySelector(q);
  const fmt = n => Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const value = (data, key) => String(data.get(key) ?? '').trim();
  const md = x => String(x ?? '').replace(/\r/g, '').trim();
  const on = (form, name, v) => { const el = form.elements.namedItem(name); if (el) el.value = v; };
  const save = (name, content) => {
    const url = URL.createObjectURL(new Blob([content], {type:'text/markdown;charset=utf-8'}));
    const a = document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url),1000);
  };
  const copy = async (text, button) => {
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Copied brief';
    } catch (e) {
      button.textContent = 'Could not copy; download instead';
    }
  };
  const experiment = $('#rl-experiment');
  if (experiment) {
    const form = $('form',experiment), result = $('#rl-experiment-result',experiment);
    let latest = '';
    form.addEventListener('submit',e=>{
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const baseline = Number(d.get('baseline')), target=Number(d.get('target'));
      const observedText=value(d,'observed'), observed = observedText === '' ? null : Number(observedText);
      const down=value(d,'direction')==='lower';
      const threshold = down ? 'at or below' : 'at or above';
      const met = observed === null ? null : down ? observed<=target : observed>=target;
      const sampleN=Number(d.get('baselineCases')), reviewN=Number(d.get('reviewCases'));
      const guarded=value(d,'guardrailStatus');
      const targetInDirection = down ? target<baseline : target>baseline;
      let verdict;
      if (observed===null) verdict='Your test is ready to run. Collect the review cases and enter the observed value before making a keep-or-change decision.';
      else if(guarded==='failed') verdict='Pause or revise the change. A guardrail deteriorated, even if the primary target was met.';
      else if(guarded==='unknown') verdict=met?'The numeric target was met, but the guardrail is still unassessed. Check quality and downstream work before deciding to keep the change.':'The numeric target was not met. Review the cases and check the guardrail before choosing the next iteration.';
      else verdict=met?'The numeric target was met and no guardrail deterioration was reported. Check the case mix, then decide whether a longer trial is warranted.':'The numeric target was not met. Find out what behaved differently, then revise or stop the test.';
      const casesWarn=sampleN<5||reviewN<5;
      const directionWarn=!targetInDirection;
      const outcome=observed===null?'Not yet recorded':fmt(observed)+(met?' (numeric target met)':' (numeric target not met)');
      const lines=[
        '# Process improvement experiment',
        '',
        '## The work',
        '- Workflow: '+md(value(d,'process')),
        '- Current friction: '+md(value(d,'problem')),
        '- One change to test: '+md(value(d,'change')),
        '- Experiment owner: '+md(value(d,'owner')),
        '- Start date: '+(value(d,'startDate')||'To be agreed'),
        '- Review date: '+(value(d,'reviewDate')||'To be agreed'),
        '',
        '## Measurement',
        '- Metric: '+md(value(d,'metric')),
        '- Direction: '+(down?'Lower is better':'Higher is better'),
        '- Baseline: '+fmt(baseline)+' across '+sampleN+' sampled cases',
        '- Target: '+fmt(target)+' ('+threshold+' this value)',
        '- Planned review sample: '+reviewN+' cases',
        '- Evidence source: '+md(value(d,'source')),
        '- Guardrail to monitor: '+md(value(d,'guardrail')),
        '',
        '## Review',
        '- Observed value: '+outcome,
        '- Guardrail assessment: '+(guarded==='held'?'No material deterioration observed':guarded==='failed'?'Material deterioration observed':'Not assessed'),
        '- Initial interpretation: '+verdict,
        ...(casesWarn?['- Sampling caution: At least one sample is under five cases. Use this to learn, not to claim a reliable effect.']:[]),
        ...(directionWarn?['- Target caution: The target is not stricter than the baseline in the selected direction; confirm it before the test.']:[]),
        '',
        '## Decision record',
        '- Keep / revise / extend / stop:',
        '- Why:',
        '- What we learned:',
        '- Next action and owner:',
        '',
        'Note: A target being met is an observation, not proof that the intervention caused the change.'
      ];
      latest=lines.join('\n')+'\n';
      $('#rl-experiment-summary',result).textContent=md(value(d,'process'))+' · '+md(value(d,'metric'))+': baseline '+fmt(baseline)+', target '+fmt(target)+', observed '+(observed===null?'pending':fmt(observed))+'.';
      $('#rl-experiment-verdict',result).textContent=verdict;
      $('#rl-experiment-output',result).textContent=latest;
      $('#rl-experiment-note',result).textContent=[casesWarn?'Small samples limit confidence.':'',directionWarn?'Your target does not represent an improvement over the baseline.':'','No results are sent to the site.'].filter(Boolean).join(' ');
      result.hidden=false;
      result.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
    $('[data-lab-sample="experiment"]',experiment).addEventListener('click',()=>{
      const sample={process:'Weekly delivery status report',problem:'The coordinator copies updates from several trackers, then messages team leads for missing statuses.',change:'Use one shared status field and a single owner for exceptions.',metric:'Active preparation minutes',direction:'lower',baseline:'90',target:'60',baselineCases:'3',reviewCases:'5',owner:'Operations coordinator',source:'Report preparation log',guardrail:'Incorrect or missing status items',guardrailStatus:'unknown'};
      Object.entries(sample).forEach(([k,v])=>on(form,k,v));
      on(form,'observed','');form.requestSubmit();
    });
    $('#rl-experiment-download',result).addEventListener('click',()=>latest&&save('process-improvement-experiment.md',latest));
    $('#rl-experiment-copy',result).addEventListener('click',e=>latest&&copy(latest,e.currentTarget));
  }
  const handoff=$('#rl-handoff');
  if(handoff) {
    const form=$('form',handoff),result=$('#rl-handoff-result',handoff);
    let latest='';
    const checks=[
      ['ckOwner','One accountable owner at each stage'],
      ['ckRequirements','Agreed minimum information'],
      ['ckRecord','One visible current record and status'],
      ['ckAcceptance','Explicit acceptance'],
      ['ckException','Return and escalation path'],
      ['ckMeasure','A way to track returned or delayed handoffs']
    ];
    form.addEventListener('submit',e=>{
      e.preventDefault();if(!form.reportValidity())return;
      const d=new FormData(form);
      const present=checks.filter(([key])=>d.has(key));
      const missing=checks.filter(([key])=>!d.has(key));
      const lines=[
        '# One-page handoff agreement',
        '',
        '- From: '+md(value(d,'sender')),
        '- To: '+md(value(d,'receiver')),
        '- Trigger: '+md(value(d,'trigger')),
        '- Required inputs: '+md(value(d,'requiredInfo')),
        '- Next accountable owner: '+md(value(d,'nextOwner')),
        '- Authoritative status location: '+md(value(d,'statusHome')),
        '- Acceptance signal: '+md(value(d,'acceptance')),
        '- Time to acknowledge: '+md(value(d,'ackHours'))+' hours (agree whether these are working or elapsed hours)',
        '- If information is missing: '+md(value(d,'exception')),
        '- Exception decision owner: '+md(value(d,'escalationOwner')),
        '',
        '## Readiness checks already in place',
        ...(present.length?present.map(([,label])=>'- [x] '+label):['- None confirmed']),
        '',
        '## Conditions to agree before rollout',
        ...(missing.length?missing.map(([,label])=>'- [ ] '+label):['- All six prompts were checked; verify against actual examples.']),
        '',
        '## Trial',
        'Use five real handoffs, including one unusual case. Record the date sent, date accepted, missing information, return loops and additional clarification needed. Ask both teams whether the agreement made the work easier.',
        '',
        '## Decision',
        '- Keep / revise / stop:',
        '- Receiving team agrees:',
        '- Sending team agrees:',
        '- Owner and date to update the working process:',
        '',
        'Note: These six checks are prompts for discussion, not a validated performance score.'
      ];
      latest=lines.join('\n')+'\n';
      $('#rl-handoff-score',result).textContent=present.length+'/6';
      $('#rl-handoff-gaps',result).textContent=String(missing.length);
      const guidance=missing.length?'Start by agreeing on '+missing.slice(0,2).map(([,label])=>label.toLowerCase()).join(' and ')+'. Test the rules on recent cases, then decide what documentation or automation is necessary.':'All six checks are marked. Verify them against recent failed or delayed handoffs before deciding nothing needs to change.';
      $('#rl-handoff-advice',result).textContent=guidance;
      $('#rl-handoff-output',result).textContent=latest;
      result.hidden=false;
      result.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
    $('[data-lab-sample="handoff"]',handoff).addEventListener('click',()=>{
      const sample={sender:'Sales',receiver:'Client onboarding',trigger:'Signed agreement marked ready for delivery',requiredInfo:'Agreed scope; project owner; confirmed timeline; open dependencies; link to signed scope',nextOwner:'Onboarding lead',statusHome:'Shared implementation tracker',acceptance:'Onboarding lead marks Accepted after reviewing required inputs',exception:'Return incomplete cases to Sales with the missing items listed, preserving the request ID',ackHours:'24',escalationOwner:'Delivery operations lead'};
      Object.entries(sample).forEach(([k,v])=>on(form,k,v));
      checks.forEach(([key],i)=>{const el=form.elements.namedItem(key);el.checked=i===0||i===2;});
      form.requestSubmit();
    });
    $('#rl-handoff-download',result).addEventListener('click',()=>latest&&save('team-handoff-agreement.md',latest));
    $('#rl-handoff-copy',result).addEventListener('click',e=>latest&&copy(latest,e.currentTarget));
  }
})();