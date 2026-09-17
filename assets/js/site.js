const ONS = {
  phoneDisplay: '808-774-6248',
  phone: '+18087746248',
  email: 'OahuNotaryServices@gmail.com',
  uploadUrl: 'https://link.oahunotaryservices.com/ClientUpload',
  website: 'https://www.oahunotaryservices.com',
  googleReviews: 'https://www.google.com/search?q=Oahu+Notary+Services+Honolulu+reviews',
  yelpReviews: 'https://www.yelp.com/search?find_desc=Oahu+Notary+Services&find_loc=Honolulu%2C+HI',

  // Standard mobile pricing: travel / meeting / appointment time.
  travel: {
    'South Oʻahu': 50,
    'East Oʻahu': 75,
    'Central Oʻahu': 85,
    'West Oʻahu': 90,
    'North Oʻahu': 125
  },

  // Estate-planning signing starting prices by service area.
  estate: {
    'South Oʻahu': 95,
    'East Oʻahu': 100,
    'Central Oʻahu': 115,
    'West Oʻahu': 120,
    'North Oʻahu': 150
  },

  // Hawaiʻi statutory notarial fee used by the estimator.
  notarialFee: 5,

  loanPackages: {
    'Single deed / small real-estate signing': 35,
    'Seller package': 60,
    'Loan modification': 60,
    'Buyer / cash purchase package': 75,
    'Refinance / HELOC package': 90,
    'Large / specialty loan package': 110
  },

  timing: {
    'Standard appointment': 0,
    'Short notice, 4–24 hours': 25,
    'Rush / immediate, less than 4 hours': 50,
    'Late-night appointment, 10 PM–7 AM': 50,
    'State or federal holiday': 50
  },

  special: {
    'Regular location / home / office': 0,
    'Hospital / care facility': 0,
    'Correctional facility': 80,
    'Hotel': 25
  },

  extraTime: 10,
  printing: .25,
  scanBack: 10,
  witnessFee: 25
};

const money = n => Number(n || 0).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2});

function setupMenu(){
  const btn=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.nav-links');
  if(!btn||!nav)return;
  btn.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
  }));
}

function setYear(){
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
}

function phoneMemoryMarkup(){
  return `<span class="phone-memory" aria-label="808-774-6248, OAHU"><span class="phone-prefix">808-774-</span><span class="phone-last4">6248<span class="phone-oahu">(OAHU)</span></span></span>`;
}

function hydrateLinks(){
  document.querySelectorAll('[data-phone-link]').forEach(a=>{
    a.href=`tel:${ONS.phone}`;
    if(a.classList.contains('btn')){
      a.innerHTML=`Call ${phoneMemoryMarkup()}`;
    } else if(a.textContent.trim()==='808-774-6248'){
      a.innerHTML=phoneMemoryMarkup();
    }
  });
  document.querySelectorAll('[data-text-link]').forEach(a=>{
    a.href=`sms:${ONS.phone}`;
    if(a.classList.contains('btn')){
      a.innerHTML=`Text ${phoneMemoryMarkup()}`;
    }
  });
  document.querySelectorAll('[data-email-link]').forEach(a=>{
    a.href=`mailto:${ONS.email}`;
    if(a.classList.contains('btn')){
      a.textContent='Email Us';
    }
  });
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
      `Witness requested: ${fd.get('witnessRequested')==='Yes' ? 'Please confirm availability for one witness (+$25)' : 'No / client providing own witness(es)'}`,
      `Message: ${fd.get('message')||''}`,
      `Policies acknowledged: ${fd.get('policyAck')||'No'}`
    ];
    const subject=encodeURIComponent('Appointment Request - Oahu Notary Services');
    const body=encodeURIComponent(lines.join('\n'));
    location.href=`mailto:${ONS.email}?subject=${subject}&body=${body}`;
  });
}

function renderLoanTable(){
  const target=document.querySelector('#loanPriceTable');
  if(!target)return;
  const areas=Object.keys(ONS.travel);
  const rows=Object.entries(ONS.loanPackages).map(([packageName,packageFee])=>{
    const cells=areas.map(area=>`<td>${money(ONS.travel[area]+packageFee+ONS.notarialFee)}</td>`).join('');
    return `<tr><td>${packageName}</td>${cells}</tr>`;
  }).join('');
  target.innerHTML=`
    <thead><tr><th>Signing type</th>${areas.map(a=>`<th>${a.replace(' Oʻahu','')}</th>`).join('')}</tr></thead>
    <tbody>${rows}</tbody>`;
}

function setupEstimator(){
  const form=document.querySelector('#estimateForm');
  if(!form)return;

  const out=document.querySelector('#estimateTotal');
  const lines=document.querySelector('#estimateLines');
  const type=document.querySelector('#serviceType');
  const area=document.querySelector('#serviceArea');
  const loanWrap=document.querySelector('#loanPackageWrap');
  const loanPackage=document.querySelector('#loanPackage');
  const notarialCount=document.querySelector('#notarialCount');
  const witnessChoice=document.querySelector('#witnessChoice');
  const timing=document.querySelector('#timing');
  const special=document.querySelector('#special');
  const print=document.querySelector('#printPages');
  const scan=document.querySelector('#scanBack');
  const locationField=document.querySelector('#appointmentLocation');
  const estateNote=document.querySelector('#estateEstimateNote');

  Object.entries(ONS.travel).forEach(([k,v])=>{
    const label=k==='South Oʻahu'
      ? `Town / South Oʻahu — from ${money(v)}`
      : `${k} — ${money(v)}`;
    area.add(new Option(label,k));
  });

  Object.entries(ONS.loanPackages).forEach(([k,v])=>{
    loanPackage.add(new Option(`${k} — +${money(v)}`,k));
  });

  Object.keys(ONS.timing).forEach(k=>{
    timing.add(new Option(`${k}${ONS.timing[k]?` — +${money(ONS.timing[k])}`:''}`,k));
  });

  Object.keys(ONS.special).forEach(k=>{
    special.add(new Option(`${k}${ONS.special[k]?` — +${money(ONS.special[k])}`:''}`,k));
  });

  function syncFields(){
    const isLoan=type.value==='Real Estate / Loan Signing';
    const isEstate=type.value==='Estate Planning Signing';
    loanWrap.hidden=!isLoan;
    loanPackage.required=isLoan;
    if(estateNote) estateNote.hidden=!isEstate;
  }

  function calc(){
    syncFields();

    const selectedType=type.value;
    let base=0;
    let baseLabel='Travel / meeting fee';
    let packageFee=0;

    if(selectedType==='Estate Planning Signing'){
      base=ONS.estate[area.value]||0;
      baseLabel='Estate-planning signing';
    }else{
      base=ONS.travel[area.value]||0;
    }

    if(selectedType==='Real Estate / Loan Signing'){
      packageFee=ONS.loanPackages[loanPackage.value]||0;
    }

    const notarialUnits=Math.max(0,Number(notarialCount?.value||0));
    const notarial=notarialUnits*ONS.notarialFee;

    const witnessFee=witnessChoice?.value==='25' ? ONS.witnessFee : 0;
    const timingFee=ONS.timing[timing.value]||0;
    const specialFee=ONS.special[special.value]||0;
    const printPages=Math.max(0,Number(print?.value||0));
    const printFee=printPages*ONS.printing;
    const scanFee=scan?.checked?ONS.scanBack:0;

    const total=base+notarial+packageFee+witnessFee+timingFee+specialFee+printFee+scanFee;
    out.textContent=money(total);

    const rows=[
      [baseLabel,base],
      [`Notarized signature${notarialUnits===1?'':'s'} (${notarialUnits} × $5)`,notarial],
      ['Loan / real-estate package',packageFee],
      ['One witness',witnessFee],
      ['Timing',timingFee],
      ['Special location',specialFee],
      ['Printing',printFee],
      ['Scan-back',scanFee]
    ].filter(r=>r[1]>0);

    lines.innerHTML=rows.map(([label,val])=>
      `<div class="quote-line"><span>${label}</span><strong>${money(val)}</strong></div>`
    ).join('');

    return {
      total,base,baseLabel,notarial,notarialUnits,packageFee,witnessFee,
      timingFee,specialFee,printFee,scanFee
    };
  }

  form.addEventListener('input',calc);
  form.addEventListener('change',calc);
  calc();

  document.querySelector('#sendEstimate')?.addEventListener('click',()=>{
    const q=calc();
    const packageLine=type.value==='Real Estate / Loan Signing'
      ? `Loan / real-estate package: ${loanPackage.value||'Not selected'}`
      : '';

    const witnessLine=witnessChoice?.value==='25'
      ? 'Witnesses: Please confirm availability for one witness (+$25)'
      : witnessChoice?.value==='client'
        ? 'Witnesses: Client will provide required witness(es)'
        : 'Witnesses: No witness needed / not sure';

    const body=[
      'Oahu Notary Services quick estimate request',
      '',
      `Service: ${type.value}`,
      packageLine,
      `Appointment area: ${area.value}`,
      `Appointment location: ${locationField.value||'Not provided'}`,
      `Notarized signatures: ${q.notarialUnits}`,
      witnessLine,
      `Timing: ${timing.value}`,
      `Location type: ${special.value}`,
      `Estimated pre-GET total: ${money(q.total)}`,
      '',
      'I understand this is a starting estimate only and the final fee will be confirmed before booking.'
    ].filter(Boolean).join('\n');

    location.href=`mailto:${ONS.email}?subject=${encodeURIComponent('Quick Estimate Request - Oahu Notary Services')}&body=${encodeURIComponent(body)}`;
  });

  document.querySelector('#textEstimate')?.addEventListener('click',e=>{
    e.preventDefault();
    const q=calc();
    const witnessText=witnessChoice?.value==='25'
      ? ', and I need to ask about one witness'
      : '';

    const msg=`Hi Oahu Notary Services! I used the quick estimator for ${type.value} in ${area.value}${witnessText}. It shows a starting estimate of ${money(q.total)} before GET. Please confirm the final price and availability.`;

    location.href=`sms:${ONS.phone}?&body=${encodeURIComponent(msg)}`;
  });
}




function fillAreaSelect(select, source, useTownLabel=true){
  if(!select)return;
  select.innerHTML='';
  Object.entries(source).forEach(([name,value])=>{
    const label=(useTownLabel && name==='South Oʻahu') ? `Town / South Oʻahu — ${money(value)}` : `${name} — ${money(value)}`;
    select.add(new Option(label,name));
  });
}

function fillTimingSelect(select){
  if(!select)return;
  select.innerHTML='';
  Object.keys(ONS.timing).forEach(name=>{
    const fee=ONS.timing[name];
    select.add(new Option(`${name}${fee?` — +${money(fee)}`:''}`,name));
  });
}

function fillSpecialSelect(select){
  if(!select)return;
  select.innerHTML='';
  Object.keys(ONS.special).forEach(name=>{
    const fee=ONS.special[name];
    select.add(new Option(`${name}${fee?` — +${money(fee)}`:''}`,name));
  });
}

function renderServiceEstimate(linesEl,totalEl,rows,total){
  if(totalEl) totalEl.textContent=money(total);
  if(linesEl){
    linesEl.innerHTML=rows.filter(r=>r[1]>0).map(([label,value])=>
      `<div class="quote-line"><span>${label}</span><strong>${money(value)}</strong></div>`
    ).join('');
  }
}

function setupEstateEstimator(){
  const form=document.querySelector('#estateEstimatorForm');
  if(!form)return;

  const area=document.querySelector('#estateArea');
  const count=document.querySelector('#estateNotarialCount');
  const witness=document.querySelector('#estateWitness');
  const timing=document.querySelector('#estateTiming');
  const locationType=document.querySelector('#estateLocationType');
  const totalEl=document.querySelector('#estateEstimateTotal');
  const linesEl=document.querySelector('#estateEstimateLines');

  fillAreaSelect(area,ONS.estate);
  fillTimingSelect(timing);
  fillSpecialSelect(locationType);

  function calc(){
    const base=ONS.estate[area.value]||0;
    const units=Math.max(0,Number(count.value||0));
    const notarial=units*ONS.notarialFee;
    const witnessFee=witness.value==='25'?ONS.witnessFee:0;
    const timingFee=ONS.timing[timing.value]||0;
    const specialFee=ONS.special[locationType.value]||0;
    const total=base+notarial+witnessFee+timingFee+specialFee;

    renderServiceEstimate(linesEl,totalEl,[
      ['Estate-planning signing',base],
      [`Notarized signature${units===1?'':'s'} (${units} × $5)`,notarial],
      ['One witness',witnessFee],
      ['Timing',timingFee],
      ['Location type',specialFee]
    ],total);

    return {total,units};
  }

  form.addEventListener('input',calc);
  form.addEventListener('change',calc);
  calc();

  document.querySelector('#estateEstimateEmail')?.addEventListener('click',e=>{
    e.preventDefault();
    const q=calc();
    const witnessText=witness.value==='25'?'Please confirm availability for one witness (+$25)':witness.value==='client'?'Client will provide witness(es)':'No witness needed / not sure';
    const body=[
      'Estate-planning signing estimate request',
      '',
      `Area: ${area.value}`,
      `Notarized signatures: ${q.units}`,
      `Witnesses: ${witnessText}`,
      `Timing: ${timing.value}`,
      `Location type: ${locationType.value}`,
      `Website starting estimate before GET: ${money(q.total)}`,
      '',
      'Please confirm the final fee after reviewing the package.'
    ].join('\n');
    location.href=`mailto:${ONS.email}?subject=${encodeURIComponent('Estate Planning Signing Estimate')}&body=${encodeURIComponent(body)}`;
  });

  document.querySelector('#estateEstimateText')?.addEventListener('click',e=>{
    e.preventDefault();
    const q=calc();
    const msg=`Hi Oahu Notary Services! I used the Estate Planning estimator for ${area.value}. It shows ${money(q.total)} before GET. Please confirm the final fee after reviewing the package.`;
    location.href=`sms:${ONS.phone}?&body=${encodeURIComponent(msg)}`;
  });
}

function setupLoanEstimator(){
  const form=document.querySelector('#loanEstimatorForm');
  if(!form)return;

  const area=document.querySelector('#loanAreaQuick');
  const packageType=document.querySelector('#loanPackageQuick');
  const count=document.querySelector('#loanNotarialCountQuick');
  const timing=document.querySelector('#loanTimingQuick');
  const printPages=document.querySelector('#loanPrintPagesQuick');
  const scan=document.querySelector('#loanScanBackQuick');
  const totalEl=document.querySelector('#loanEstimateTotal');
  const linesEl=document.querySelector('#loanEstimateLines');

  fillAreaSelect(area,ONS.travel);
  fillTimingSelect(timing);

  packageType.innerHTML='';
  Object.entries(ONS.loanPackages).forEach(([name,value])=>{
    packageType.add(new Option(`${name} — +${money(value)}`,name));
  });

  function calc(){
    const travel=ONS.travel[area.value]||0;
    const packageFee=ONS.loanPackages[packageType.value]||0;
    const units=Math.max(0,Number(count.value||0));
    const notarial=units*ONS.notarialFee;
    const timingFee=ONS.timing[timing.value]||0;
    const pages=Math.max(0,Number(printPages.value||0));
    const printing=pages*ONS.printing;
    const scanFee=scan.checked?ONS.scanBack:0;
    const total=travel+packageFee+notarial+timingFee+printing+scanFee;

    renderServiceEstimate(linesEl,totalEl,[
      ['Travel / meeting',travel],
      ['Signing package',packageFee],
      [`Notarized signature${units===1?'':'s'} (${units} × $5)`,notarial],
      ['Timing',timingFee],
      ['Printing',printing],
      ['Scan-back',scanFee]
    ],total);

    return {total,units,pages};
  }

  form.addEventListener('input',calc);
  form.addEventListener('change',calc);
  calc();

  document.querySelector('#loanEstimateEmail')?.addEventListener('click',e=>{
    e.preventDefault();
    const q=calc();
    const body=[
      'Loan / real-estate signing estimate request',
      '',
      `Area: ${area.value}`,
      `Package: ${packageType.value}`,
      `Notarized signatures: ${q.units}`,
      `Timing: ${timing.value}`,
      `Printing pages: ${q.pages}`,
      `Scan-back: ${scan.checked?'Yes':'No'}`,
      `Website starting estimate before GET: ${money(q.total)}`,
      '',
      'Please confirm the final fee and assignment requirements.'
    ].join('\n');
    location.href=`mailto:${ONS.email}?subject=${encodeURIComponent('Loan Signing Estimate')}&body=${encodeURIComponent(body)}`;
  });

  document.querySelector('#loanEstimateText')?.addEventListener('click',e=>{
    e.preventDefault();
    const q=calc();
    const msg=`Hi Oahu Notary Services! I used the Loan Signing estimator for ${packageType.value} in ${area.value}. It shows ${money(q.total)} before GET. Please confirm the final fee and availability.`;
    location.href=`sms:${ONS.phone}?&body=${encodeURIComponent(msg)}`;
  });
}

function setupApostilleQuoteBuilder(){
  const form=document.querySelector('#apostilleQuoteForm');
  if(!form)return;

  const docType=document.querySelector('#apostilleDocType');
  const count=document.querySelector('#apostilleDocCount');
  const country=document.querySelector('#apostilleCountry');
  const currentForm=document.querySelector('#apostilleForm');
  const level=document.querySelector('#apostilleLevel');
  const returnMethod=document.querySelector('#apostilleReturn');
  const deadline=document.querySelector('#apostilleDeadline');
  const status=document.querySelector('#apostilleQuoteStatus');
  const summary=document.querySelector('#apostilleQuoteSummary');

  function update(){
    const rows=[
      ['Document',docType.value],
      ['Number of documents',String(Math.max(1,Number(count.value||1)))],
      ['Destination country',country.value.trim()||'Not entered yet'],
      ['Current document',currentForm.value],
      ['Assistance requested',level.value],
      ['Return / delivery',returnMethod.value],
      ['Deadline',deadline.value.trim()||'Not entered yet']
    ];

    summary.innerHTML=rows.map(([label,value])=>
      `<div class="apostille-summary-line"><span>${label}</span><strong>${value}</strong></div>`
    ).join('');

    status.textContent=(country.value.trim() && docType.value)
      ? 'Ready to send for a quote'
      : 'Add the destination country to complete the request';

    return rows;
  }

  form.addEventListener('input',update);
  form.addEventListener('change',update);
  update();

  document.querySelector('#apostilleQuoteEmail')?.addEventListener('click',e=>{
    e.preventDefault();
    const rows=update();
    const body=[
      'Apostille / authentication assistance quote request',
      '',
      ...rows.map(([label,value])=>`${label}: ${value}`),
      '',
      'Please let me know what current government processing steps may apply and provide a service quote.'
    ].join('\n');
    location.href=`mailto:${ONS.email}?subject=${encodeURIComponent('Apostille Assistance Quote Request')}&body=${encodeURIComponent(body)}`;
  });

  document.querySelector('#apostilleQuoteText')?.addEventListener('click',e=>{
    e.preventDefault();
    update();
    const msg=`Hi Oahu Notary Services! I need apostille/authentication assistance for ${count.value||1} ${docType.value} document(s) for use in ${country.value.trim()||'another country'}. I am looking for: ${level.value}. Please let me know the next processing steps and quote.`;
    location.href=`sms:${ONS.phone}?&body=${encodeURIComponent(msg)}`;
  });
}


let onsDeferredInstallPrompt=null;

window.addEventListener('beforeinstallprompt',event=>{
  event.preventDefault();
  onsDeferredInstallPrompt=event;
  document.dispatchEvent(new CustomEvent('ons-install-ready'));
});

window.addEventListener('appinstalled',()=>{
  onsDeferredInstallPrompt=null;
  document.dispatchEvent(new CustomEvent('ons-app-installed'));
});

function setupAppInstall(){
  const buttons=[...document.querySelectorAll('[data-install-app]')];
  if(!buttons.length) return;

  const status=document.querySelector('[data-install-status]');
  const help=document.querySelector('[data-install-help]');
  const setButton=(label,disabled=false)=>{
    buttons.forEach(btn=>{
      btn.textContent=label;
      btn.disabled=disabled;
      btn.setAttribute('aria-disabled',disabled?'true':'false');
    });
  };
  const setStatus=message=>{ if(status) status.textContent=message||''; };
  const showHelp=html=>{
    if(!help) return;
    help.innerHTML=html;
    help.hidden=false;
  };
  const hideHelp=()=>{ if(help){ help.hidden=true; help.innerHTML=''; } };

  if(isStandaloneApp()){
    setButton('App Installed',true);
    setStatus('Oahu Notary Services is already installed on this device.');
    return;
  }

  const ua=navigator.userAgent||'';
  const isIOS=/iPhone|iPad|iPod/i.test(ua);
  const isAndroid=/Android/i.test(ua);

  const markReady=()=>{
    if(onsDeferredInstallPrompt){
      setButton('Install Oahu Notary Services');
      setStatus('Ready to install on this device.');
      hideHelp();
    }
  };

  document.addEventListener('ons-install-ready',markReady);
  document.addEventListener('ons-app-installed',()=>{
    setButton('App Installed',true);
    setStatus('Oahu Notary Services was installed successfully.');
    hideHelp();
  });

  buttons.forEach(btn=>btn.addEventListener('click',async()=>{
    if(isStandaloneApp()){
      setButton('App Installed',true);
      setStatus('Oahu Notary Services is already installed on this device.');
      return;
    }

    if(onsDeferredInstallPrompt){
      hideHelp();
      onsDeferredInstallPrompt.prompt();
      const choice=await onsDeferredInstallPrompt.userChoice;
      onsDeferredInstallPrompt=null;
      if(choice?.outcome==='accepted'){
        setStatus('Installation started.');
      } else {
        setStatus('Installation was not completed. You can use this button again later.');
      }
      return;
    }

    if(isIOS){
      showHelp('<strong>iPhone / iPad:</strong> Open this site in Safari, tap the <strong>Share</strong> button, choose <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.');
    } else if(isAndroid){
      showHelp('<strong>Android:</strong> Open your browser menu (usually ⋮ or ☰) and choose <strong>Install app</strong>, <strong>Add to Home screen</strong>, or <strong>Add page to</strong>. The wording depends on your browser.');
    } else {
      showHelp('<strong>Computer:</strong> Look for an install icon in the address bar, or open your browser menu and choose <strong>Install Oahu Notary Services</strong> or <strong>Install app</strong>.');
    }
    setStatus('Your browser did not open an automatic install window, so use the instructions shown below.');
  }));

  if(onsDeferredInstallPrompt) markReady();
}


function isStandaloneApp(){
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function setupBrandedAppSplash(){
  if(!isStandaloneApp()) return;
  try{
    if(sessionStorage.getItem('onsBrandedSplashShown')==='1') return;
    sessionStorage.setItem('onsBrandedSplashShown','1');
  }catch(e){}

  const splash=document.createElement('div');
  splash.className='ons-app-splash';
  splash.setAttribute('aria-hidden','true');
  splash.innerHTML=`
    <div class="ons-app-splash-inner">
      <img src="assets/img/ons-brand-icon-192.png?v=20260823f" alt="">
      <div class="ons-app-splash-name">Oahu Notary Services</div>
      <div class="ons-app-splash-tagline">Mobile Notary • Oʻahu, Hawaiʻi</div>
    </div>`;
  document.body.appendChild(splash);

  const removeSplash=()=>{
    splash.classList.add('hide');
    setTimeout(()=>splash.remove(),380);
  };
  setTimeout(removeSplash,900);
}

function registerServiceWorker(){
  if(!('serviceWorker' in navigator)) return;
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/service-worker.js?v=20260823f').catch(()=>{});
  });
}


document.addEventListener('DOMContentLoaded',()=>{
  setupBrandedAppSplash();
  setupAppInstall();
  setupMenu();
  setYear();
  hydrateLinks();
  setupContactForm();
  renderLoanTable();
  setupEstimator();
  setupEstateEstimator();
  setupLoanEstimator();
  setupApostilleQuoteBuilder();
  registerServiceWorker();
});
