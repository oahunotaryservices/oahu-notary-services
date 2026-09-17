(()=>{
  const form=document.querySelector('#apostilleQuoteForm');
  if(!form)return;
  const $=s=>document.querySelector(s);
  const doc=$('#apostilleDocType'), count=$('#apostilleDocCount'), country=$('#apostilleCountry'),
        formType=$('#apostilleForm'), level=$('#apostilleLevel'), ret=$('#apostilleReturn'),
        deadline=$('#apostilleDeadline'), status=$('#apostilleQuoteStatus'), summary=$('#apostilleQuoteSummary');

  function update(){
    const rows=[
      ['Document',doc.value],['Number of documents',String(Math.max(1,Number(count.value||1)))],
      ['Destination country',country.value.trim()||'Not entered yet'],['Current document',formType.value],
      ['Assistance requested',level.value],['Return / delivery',ret.value],
      ['Deadline',deadline.value.trim()||'Not entered yet']
    ];
    summary.innerHTML=rows.map(([l,v])=>`<div class="apostille-summary-line"><span>${l}</span><strong>${v}</strong></div>`).join('');
    status.textContent=country.value.trim()?'Ready to email for a final quote':'Add the destination country to complete the quote request';
  }
  form.addEventListener('input',update);
  form.addEventListener('change',update);
  update();
})();