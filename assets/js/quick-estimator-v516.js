(()=>{
  const form=document.querySelector('#estimateForm');
  if(!form)return;

  const $=s=>document.querySelector(s);
  const fmt=n=>Number(n||0).toLocaleString('en-US',{style:'currency',currency:'USD'});
  const type=$('#serviceType'), area=$('#serviceArea'), loanWrap=$('#loanPackageWrap'),
        loan=$('#loanPackage'), count=$('#notarialCount'), witness=$('#witnessChoice'),
        timing=$('#timing'), special=$('#special'), pages=$('#printPages'),
        scan=$('#scanBack'), estateNote=$('#estateEstimateNote'),
        total=$('#estimateTotal'), lines=$('#estimateLines');

  const estateBase={'South Oʻahu':95,'East Oʻahu':100,'Central Oʻahu':115,'West Oʻahu':120,'North Oʻahu':150};
  const nameOf=sel=>sel?.selectedOptions?.[0]?.dataset?.name||'';

  function calc(){
    const areaName=nameOf(area);
    const isEstate=type.value==='Estate Planning Signing';
    const isLoan=type.value==='Real Estate / Loan Signing';
    loanWrap.hidden=!isLoan;
    estateNote.hidden=!isEstate;

    const base=isEstate?(estateBase[areaName]||0):Number(area.value||0);
    const units=Math.max(0,Number(count.value||0));
    const notarial=units*5;
    const pkg=isLoan?Number(loan.value||0):0;
    const witnessFee=witness.value==='25'?25:0;
    const timingFee=Number(timing.value||0);
    const specialFee=Number(special.value||0);
    const printFee=Math.max(0,Number(pages.value||0))*.25;
    const scanFee=scan.checked?10:0;
    const sum=base+notarial+pkg+witnessFee+timingFee+specialFee+printFee+scanFee;

    total.textContent=fmt(sum);
    const rows=[
      [isEstate?'Estate-planning signing':'Travel / meeting',base],
      [`Notarized signature${units===1?'':'s'} (${units} × $5)`,notarial],
      ['Loan / real-estate package',pkg],
      ['One witness',witnessFee],
      ['Timing',timingFee],
      ['Special location',specialFee],
      ['Printing',printFee],
      ['Scan-back',scanFee]
    ].filter(r=>r[1]>0);
    lines.innerHTML=rows.map(([l,v])=>`<div class="estimate-line"><span>${l}</span><strong>${fmt(v)}</strong></div>`).join('');
    return {sum,areaName,units};
  }

  form.addEventListener('input',calc);
  form.addEventListener('change',calc);
  calc();
})();