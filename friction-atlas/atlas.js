// The Atlas is readable without JavaScript; search and share controls are optional.
(function(){
  'use strict';
  const search=document.querySelector('[data-atlas-search]');
  const cards=[...document.querySelectorAll('[data-atlas-card]')];
  const buttons=[...document.querySelectorAll('[data-atlas-filter]')];
  const count=document.querySelector('[data-atlas-count]');
  const empty=document.querySelector('[data-atlas-empty]');
  let category='all';
  const clean=s=>String(s||'').normalize('NFKD').toLocaleLowerCase().trim();
  function apply(){
    const term=clean(search&&search.value);
    let visible=0;
    cards.forEach(card=>{
      const categoryMatch=category==='all'||card.dataset.category===category;
      const textMatch=!term||clean(card.dataset.search).includes(term);
      card.hidden=!(categoryMatch&&textMatch);
      if(!card.hidden)visible++;
    });
    if(count)count.textContent=visible+' of '+cards.length+' breakdowns';
    if(empty)empty.hidden=visible>0;
  }
  if(search)search.addEventListener('input',apply);
  buttons.forEach(button=>button.addEventListener('click',()=>{
    category=button.dataset.atlasFilter;
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    apply();
  }));
  if(search)apply();
  document.querySelectorAll('[data-atlas-copy]').forEach(button=>{
    const original=button.textContent;
    button.addEventListener('click',async()=>{
      const url=button.dataset.atlasCopy||window.location.href;
      try{
        if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(url);
        else{
          const field=document.createElement('textarea');field.value=url;field.style.position='fixed';field.style.opacity='0';
          document.body.appendChild(field);field.select();
          const ok=document.execCommand('copy');field.remove();
          if(!ok)throw new Error('Copy unsupported');
        }
        button.textContent='Link copied';
      }catch(e){button.textContent='Copy unavailable';}
      window.setTimeout(()=>{button.textContent=original;},2600);
    });
  });
  document.querySelectorAll('[data-atlas-print]').forEach(b=>b.addEventListener('click',()=>window.print()));
})();