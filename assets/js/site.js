const ONS = {
  phoneDisplay: '808-774-6248',
  phone: '+18087746248',
  email: 'OahuNotaryServices@gmail.com',
  uploadUrl: 'https://link.oahunotaryservices.com/ClientUpload',
  website: 'https://www.oahunotaryservices.com',
  googleReviews: 'https://www.google.com/search?q=Oahu+Notary+Services+Honolulu+reviews',
  yelpReviews: 'https://www.yelp.com/search?find_desc=Oahu+Notary+Services&find_loc=Honolulu%2C+HI',
  travel: { 'South Oʻahu':75, 'East Oʻahu':85, 'Central Oʻahu':95, 'West Oʻahu':95, 'North Oʻahu':130 },
  estate: { 'South Oʻahu':95, 'East Oʻahu':100, 'Central Oʻahu':115, 'West Oʻahu':120, 'North Oʻahu':150 },
  notarialAct: 5,
  timing: { 'Standard appointment':0, 'Same-day / less than 24 hours':50, 'Peak traffic, Mon–Fri 4–7 PM':25, 'Late-hour appointment, 8 PM–9 AM':50, 'State or federal holiday':50 },
  special: { 'None':0, 'Hospital / care facility':25, 'Correctional facility':50, 'Hotel':25 },
  extraTime: 10,
  printing: .25,
  scanBack: 10
};

const money = n => Number(n || 0).toLocaleString('en-US',{style:'currency',currency:'USD'});

function setupMenu(){
  const btn=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav-links');
  if(!btn||!nav)return;
  btn.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}));
}

function setYear(){document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear())}

function hydrateLinks(){
  document.querySelectorAll('[data-phone-link]').forEach(a=>a.href=`tel:${ONS.phone}`);
  document.querySelectorAll('[data-text-link]').forEach(a=>a.href=`sms:${ONS.phone}`);
  document.querySelectorAll('[data-email-link]').forEach(a=>a.href=`mailto:${ONS.email}`);
  document.querySelectorAll('[data-upload-link]').forEach(a=>a.href=ONS.uploadUrl);
  document.querySelectorAll('[data-google-reviews]').forEach(a=>a.href=ONS.googleReviews);
  document.querySelectorAll('[data-yelp-reviews]').forEach(a=>a.href=ONS.yelpReviews);
}

function setupContactForm(){
  const form=document.querySelector('#contactForm');
  if(!form)return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const fd=new FormData(form);
    const lines=[
      `Name: ${fd.get('name')||''}`,
      `Phone: ${fd.get('phone')||''}`,
      `Email: ${fd.get('email')||''}`,
      `Preferred date/time: ${fd.get('when')||''}`,
      `Location: ${fd.get('location')||''}`,
      `Document: ${fd.get('document')||''}`,
      `Number of signers: ${fd.get('signers')||''}`,
      `Message: ${fd.get('message')||''}`
    ];
    const subject=encodeURIComponent('Appointment Request - Oahu Notary Services');
    const body=encodeURIComponent(lines.join('\n'));
    location.href=`mailto:${ONS.email}?subject=${subject}&body=${body}`;
  });
}

function setupEstimator(){
  const form=document.querySelector('#estimateForm');
  if(!form)return;
  const out=document.querySelector('#estimateTotal');
  const lines=document.querySelector('#estimateLines');
  const type=document.querySelector('#serviceType');
  const area=document.querySelector('#serviceArea');
  const sig=document.querySelector('#notarialActs');
  const timing=document.querySelector('#timing');
  const special=document.querySelector('#special');
  const extra=document.querySelector('#extraTime');
  const print=document.querySelector('#printPages');
  const scan=document.querySelector('#scanBack');
  const name=document.querySelector('#customerName');
  const locationField=document.querySelector('#appointmentLocation');
  const documentField=document.querySelector('#documentType');

  Object.keys(ONS.travel).forEach(k=>area.add(new Option(`${k} — ${money(ONS.travel[k])} standard travel`,k)));
  Object.keys(ONS.timing).forEach(k=>timing.add(new Option(`${k}${ONS.timing[k]?` — +${money(ONS.timing[k])}`:''}`,k)));
  Object.keys(ONS.special).forEach(k=>special.add(new Option(`${k}${ONS.special[k]?` — +${money(ONS.special[k])}`:''}`,k)));

  function calc(){
    const isEstate=type.value==='Estate Planning Signing';
    const base=(isEstate?ONS.estate:ONS.travel)[area.value]||0;
    const acts=Math.max(1,Number(sig.value||1));
    const actFee=acts*ONS.notarialAct;
    const timingFee=ONS.timing[timing.value]||0;
    const specialFee=ONS.special[special.value]||0;
    const extraUnits=Math.max(0,Number(extra.value||0));
    const extraFee=extraUnits*ONS.extraTime;
    const printPages=Math.max(0,Number(print.value||0));
    const printFee=printPages*ONS.printing;
    const scanFee=scan.checked?ONS.scanBack:0;
    const total=base+actFee+timingFee+specialFee+extraFee+printFee+scanFee;
    out.textContent=money(total);
    const rows=[
      ['Base / travel',base],['Notarial acts',actFee],['Timing',timingFee],['Special location',specialFee],['Additional time',extraFee],['Printing',printFee],['Scan-back',scanFee]
    ].filter(r=>r[1]>0);
    lines.innerHTML=rows.map(([label,val])=>`<div class="quote-line"><span>${label}</span><strong>${money(val)}</strong></div>`).join('');
    return {total,base,acts,actFee,timingFee,specialFee,extraFee,printFee,scanFee};
  }

  form.addEventListener('input',calc);
  form.addEventListener('change',calc);
  calc();

  document.querySelector('#sendEstimate')?.addEventListener('click',()=>{
    const q=calc();
    const body=[
      'Oahu Notary Services appointment estimate request',
      '',
      `Name: ${name.value||''}`,
      `Service: ${type.value}`,
      `Document: ${documentField.value||''}`,
      `Location: ${locationField.value||area.value}`,
      `Area: ${area.value}`,
      `Notarial acts: ${q.acts}`,
      `Timing: ${timing.value}`,
      `Special location: ${special.value}`,
      `Estimated pre-GET total: ${money(q.total)}`,
      '',
      'I understand this is an estimate only and final pricing/availability must be confirmed.'
    ].join('\n');
    location.href=`mailto:${ONS.email}?subject=${encodeURIComponent('Estimate Request - Oahu Notary Services')}&body=${encodeURIComponent(body)}`;
  });

  document.querySelector('#textEstimate')?.addEventListener('click',e=>{
    e.preventDefault();
    const q=calc();
    const msg=`Hi Oahu Notary Services! I would like to request an appointment. ${type.value}, ${area.value}, ${q.acts} notarial act(s). Website estimate before applicable GET: ${money(q.total)}. Please confirm final price and availability.`;
    location.href=`sms:${ONS.phone}?&body=${encodeURIComponent(msg)}`;
  });
}

document.addEventListener('DOMContentLoaded',()=>{setupMenu();setYear();hydrateLinks();setupContactForm();setupEstimator();});
