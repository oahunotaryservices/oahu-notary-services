(()=>{
  const form=document.querySelector('#estateEstimatorForm');
  if(!form)return;
  const $=s=>document.querySelector(s);
  const fmt=n=>Number(n||0).toLocaleString('en-US',{style:'currency',currency:'USD'});
  const area=$('#estateArea'), count=$('#estateNotarialCount'), witness=$('#estateWitness'),
        timing=$('#estateTiming'), loc=$('#estateLocationType'),
        total=$('#estateEstimateTotal'), lines=$('#estateEstimateLines');

  function calc(){
    const base=Number(area.value||0), units=Math.max(0,Number(count.value||0)),
          notarial=units*5, witnessFee=witness.value==='25'?25:0,
          timingFee=Number(timing.value||0), locFee=Number(loc.value||0),
          sum=base+notarial+witnessFee+timingFee+locFee;
    total.textContent=fmt(sum);
    const rows=[
      ['Estate-planning signing',base],
      [`Notarized signature${units===1?'':'s'} (${units} × $5)`,notarial],
      ['One witness',witnessFee],['Timing',timingFee],['Location type',locFee]
    ].filter(r=>r[1]>0);
    lines.innerHTML=rows.map(([l,v])=>`<div class="estimate-line"><span>${l}</span><strong>${fmt(v)}</strong></div>`).join('');
    return sum;
  }
  form.addEventListener('input',calc);
  form.addEventListener('change',calc);
  calc();
})();