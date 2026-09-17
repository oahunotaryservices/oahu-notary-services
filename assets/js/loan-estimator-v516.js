(()=>{
  const form=document.querySelector('#loanEstimatorForm');
  if(!form)return;
  const $=s=>document.querySelector(s);
  const fmt=n=>Number(n||0).toLocaleString('en-US',{style:'currency',currency:'USD'});
  const area=$('#loanAreaQuick'), pkg=$('#loanPackageQuick'), count=$('#loanNotarialCountQuick'),
        timing=$('#loanTimingQuick'), pages=$('#loanPrintPagesQuick'), scan=$('#loanScanBackQuick'),
        total=$('#loanEstimateTotal'), lines=$('#loanEstimateLines');

  function calc(){
    const travel=Number(area.value||0), packageFee=Number(pkg.value||0),
          units=Math.max(0,Number(count.value||0)), notarial=units*5,
          timingFee=Number(timing.value||0), printPages=Math.max(0,Number(pages.value||0)),
          printFee=printPages*.25, scanFee=scan.checked?10:0,
          sum=travel+packageFee+notarial+timingFee+printFee+scanFee;
    total.textContent=fmt(sum);
    const rows=[
      ['Travel / meeting',travel],['Signing package',packageFee],
      [`Notarized signature${units===1?'':'s'} (${units} × $5)`,notarial],
      ['Timing',timingFee],['Printing',printFee],['Scan-back',scanFee]
    ].filter(r=>r[1]>0);
    lines.innerHTML=rows.map(([l,v])=>`<div class="estimate-line"><span>${l}</span><strong>${fmt(v)}</strong></div>`).join('');
    return sum;
  }
  form.addEventListener('input',calc);
  form.addEventListener('change',calc);
  calc();
})();