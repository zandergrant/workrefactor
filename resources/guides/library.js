/* howworkruns resource tools — all interactions stay in the visitor's browser. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const num = (x, fallback = 0) => Number.isFinite(Number(x)) ? Number(x) : fallback;
  const fmt = (n, d = 0) => Number(n).toLocaleString('en-US', { maximumFractionDigits: d });
  function csvValue(value) { return '"' + String(value ?? '').replaceAll('"', '""') + '"'; }
  function download(filename, contents, type = 'text/csv;charset=utf-8') {
    const href = URL.createObjectURL(new Blob([contents], { type }));
    const link = document.createElement('a'); link.href = href; link.download = filename;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(href), 250);
  }
  function setText(selector, text, root = document) { const el = $(selector, root); if (el) el.textContent = text; }

  /* Interactive busywork audit: estimates scale, not financial savings. */
  const audit = $('#rl-audit');
  if (audit) {
    const form = $('form', audit), result = $('.rl-result', audit);
    let last = null;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const values = Object.fromEntries(new FormData(form).entries());
      const frequency = Math.max(0, num(values.frequency));
      const activeMinutes = Math.max(0, num(values.activeMinutes));
      const annualHours = frequency * activeMinutes * 48 / 60;
      const handoffs = num(values.handoffs);
      const repeated = num(values.reentry);
      const unknownOwner = values.owner === 'unclear';
      const status = values.visibility === 'poor';
      const recommendations = [];
      if (repeated > 0) recommendations.push('Check whether one record or a small integration could eliminate repeat entry.');
      if (unknownOwner) recommendations.push('Assign one accountable owner at intake and agree when to escalate.');
      if (handoffs > 2) recommendations.push('Map why each handoff exists and remove any that do not change the outcome.');
      if (status) recommendations.push('Give the team a visible status and next-action field in a shared record.');
      if (values.exceptions === 'frequent') recommendations.push('Document the exception rules and human decision owner before adding automation.');
      if (!recommendations.length) recommendations.push('The process may be reasonably lean already. Check actual error and waiting data before changing it.');
      const avoidAutomation = values.exceptions === 'frequent' || unknownOwner;
      const first = recommendations[0];
      last = { name: values.process, frequency, activeMinutes, annualHours, recommendations, first, avoidAutomation, owners:values.owner, handoffs, reentry:repeated, visibility:values.visibility, exceptions:values.exceptions };
      setText('#rl-audit-hours', fmt(annualHours, 1));
      setText('#rl-audit-weekly', fmt(frequency * activeMinutes / 60, 1));
      setText('#rl-audit-recommendation', first);
      setText('#rl-audit-next', avoidAutomation ? 'First pilot: clarify ownership or exception handling, then re-measure the work before automating.' : 'First pilot: make one small change, run it for two weeks, and compare three real cases before and after.');
      setText('#rl-audit-detail', recommendations.slice(1).join(' '));
      result.hidden = false;
      result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
    });
    $('#rl-audit-export', audit).addEventListener('click', () => {
      if (!last) return;
      const rows = [
        ['Process','Times/week','Minutes/occurrence','Estimated active hours/week','Estimated active hours/year (48 weeks)','Handoffs','Re-entry events','Owner clarity','Visibility','Exceptions','Recommended experiment'],
        [last.name,last.frequency,last.activeMinutes,(last.frequency*last.activeMinutes/60).toFixed(2),last.annualHours.toFixed(2),last.handoffs,last.reentry,last.owners,last.visibility,last.exceptions,last.first]
      ];
      download('howworkruns-busywork-audit.csv', rows.map(row => row.map(csvValue).join(',')).join('\r\n'));
    });
  }

  /* Fictional browser-only sheet/app view: both controls mutate the same in-memory records. */
  const demo = $('#rl-demo');
  if (demo) {
    const records = [
      {id:'REQ-104',title:'Site visit follow-up',category:'Facilities',owner:'Alex',status:'Assigned'},
      {id:'REQ-108',title:'New client setup',category:'Delivery',owner:'Maya',status:'In Progress'},
      {id:'REQ-112',title:'Survey response review',category:'Customer',owner:'Sam',status:'New'},
      {id:'REQ-119',title:'Vendor payment detail',category:'Finance',owner:'Alex',status:'Blocked'},
    ];
    const owners = ['Unassigned','Alex','Maya','Sam','Jordan'];
    const statuses = ['New','Assigned','In Progress','Blocked','Complete'];
    let counter = 120;
    function el(tag, klass, value) { const out = document.createElement(tag); if (klass) out.className = klass; if (value !== undefined) out.textContent = value; return out; }
    function makeSelect(values, current, label, change) {
      const field = el('select'); field.setAttribute('aria-label', label);
      values.forEach(value => { const option = el('option','',value); option.value = value; field.appendChild(option); });
      field.value = current; field.addEventListener('change', () => change(field.value)); return field;
    }
    function update(id,field,value) { const item = records.find(row => row.id === id); if (item) item[field] = value; render(); }
    function render() {
      const sheetBody = $('#rl-demo-sheet-body',demo); const cards = $('#rl-demo-cards',demo);
      sheetBody.replaceChildren(); cards.replaceChildren();
      records.forEach(record => {
        const row = el('tr');
        row.append(el('td','',record.id),el('td','',record.title));
        const ownerCell = el('td'), statusCell = el('td');
        ownerCell.appendChild(makeSelect(owners,record.owner,'Owner in spreadsheet '+record.id, v => update(record.id,'owner',v)));
        statusCell.appendChild(makeSelect(statuses,record.status,'Status in spreadsheet '+record.id,v => update(record.id,'status',v)));
        row.append(ownerCell,statusCell);sheetBody.appendChild(row);
        const card = el('article','rl-demo-ticket');
        card.append(el('span','',record.id+' · '+record.category),el('strong','',record.title));
        const cOwner = makeSelect(owners,record.owner,'Owner in web app '+record.id,v => update(record.id,'owner',v));
        const cStatus = makeSelect(statuses,record.status,'Status in web app '+record.id,v => update(record.id,'status',v));
        card.append(cOwner,cStatus);cards.appendChild(card);
      });
      setText('#rl-demo-count',String(records.length),demo);
      setText('#rl-demo-open',String(records.filter(r => r.status !== 'Complete').length),demo);
    }
    $('#rl-demo-add',demo).addEventListener('submit',e=>{
      e.preventDefault();const input = $('#rl-demo-new',demo); const title = input.value.trim();
      if (!title) return;
      records.unshift({id:'REQ-'+counter++,title:title.slice(0,80),category:'General',owner:'Unassigned',status:'New'});
      input.value='';render();
    });
    $('#rl-demo-reset',demo).addEventListener('click',()=>{
      records.splice(0,records.length,
        {id:'REQ-104',title:'Site visit follow-up',category:'Facilities',owner:'Alex',status:'Assigned'},
        {id:'REQ-108',title:'New client setup',category:'Delivery',owner:'Maya',status:'In Progress'},
        {id:'REQ-112',title:'Survey response review',category:'Customer',owner:'Sam',status:'New'},
        {id:'REQ-119',title:'Vendor payment detail',category:'Finance',owner:'Alex',status:'Blocked'});
      counter=120;render();
    });
    render();
  }

  /* Filter recipe library by operational problem. */
  const recipeWidget = $('#rl-recipes');
  if (recipeWidget) {
    $$('.rl-filter',recipeWidget).forEach(button=>button.addEventListener('click',()=>{
      const filter=button.dataset.filter;
      $$('.rl-filter',recipeWidget).forEach(b=>{b.classList.toggle('active', b===button);b.setAttribute('aria-pressed',String(b===button));});
      let count=0;
      $$('.rl-recipe',recipeWidget).forEach(card=>{
        const visible=filter==='all'||(card.dataset.tags||'').split(' ').includes(filter);
        card.hidden=!visible; if(visible)count++;
      });
      setText('#rl-recipe-count',String(count),recipeWidget);
    }));
  }

  /* Qualitative system choice: not a substitute for requirements or security review. */
  const chooser = $('#rl-chooser');
  if (chooser) {
    $('form',chooser).addEventListener('submit',e=>{
      e.preventDefault();const values=Object.fromEntries(new FormData(e.target).entries());
      let label, body;
      if (values.permissions==='strict' || values.risk==='high') {
        label='Start with an established system or security-reviewed architecture';
        body='Record-level permissions, sensitive data, or costly failures make access control, audit trails and recovery central requirements. A shared sheet plus a lightweight front end may not be sufficient. Compare your existing approved software before commissioning custom development.';
      } else if (values.logic==='complex' || values.concurrent==='many') {
        label='Evaluate a focused app or configured platform';
        body='Multiple roles, complex workflow rules or frequent concurrent edits can justify a dedicated application. Prototype the shortest viable workflow, then test reliability, permissions, ownership and maintenance.';
      } else if (values.pain==='interface' || values.pain==='entry') {
        label='Keep the data; improve the intake and interface';
        body='Try a consistent form, clearer status definitions and a small script or task-focused view before moving the records to a new platform. Confirm that the real bottleneck is the interaction, not ownership or policy.';
      } else {
        label='Improve the existing spreadsheet first';
        body='A shared sheet may already meet your needs. Standardize field values, clarify owners, remove unnecessary steps and measure what remains frustrating before building additional software.';
      }
      const result=$('.rl-result',chooser);result.hidden=false;
      setText('#rl-chooser-title',label,chooser);setText('#rl-chooser-copy',body,chooser);
    });
  }
})();
