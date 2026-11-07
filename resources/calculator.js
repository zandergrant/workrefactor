// Free resources ROI calculator — all calculations happen locally.
(function(){
  var form=document.getElementById('roi-calculator');if(!form)return;
  var fmt=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
  var hoursFmt=new Intl.NumberFormat('en-US',{maximumFractionDigits:1});
  function read(id){var el=document.getElementById(id);var n=el?Number(el.value):0;return Number.isFinite(n)&&n>0?n:0;}
  function write(id,s){var el=document.getElementById(id);if(el)el.textContent=s;}
  function update(){
    var hours=read('roi-volume')*read('roi-minutes')/60;
    var gross=hours*read('roi-labor'),net=gross-read('roi-running'),build=read('roi-build');
    write('roi-hours',hoursFmt.format(hours)+' hours');
    write('roi-value',fmt.format(gross));
    write('roi-net',fmt.format(net)+'/month');
    write('roi-payback',net>0?(build/net).toFixed(1)+' months':'No payback at these inputs');
  }
  form.addEventListener('input',update);
  form.addEventListener('submit',function(e){e.preventDefault();update();});
  update();
})();