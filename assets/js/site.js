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
    'South Oʻahu': 65,
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

  // Notarial fee added to standard and real-estate / loan estimates.
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
    'Same-day / less than 24 hours': 50,
    'Peak traffic, Mon–Fri 4–7 PM': 25,
    'Late-hour appointment, 9 PM–7 AM': 50,
    'State or federal holiday': 50
  },

  special: {
    'None': 0,
    'Correctional facility': 80,
    'Hotel': 25
  },

  extraTime: 10,
  printing: .25,
  scanBack: 10
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
    if(a.textContent.trim()==='808-774-6248') a.innerHTML=phoneMemoryMarkup();
  });
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
  const timing=document.querySelector('#timing');
  const special=document.querySelector('#special');
  const extra=document.querySelector('#extraTime');
  const print=document.querySelector('#printPages');
  const scan=document.querySelector('#scanBack');
  const name=document.querySelector('#customerName');
  const locationField=document.querySelector('#appointmentLocation');
  const documentField=document.querySelector('#documentType');

  Object.entries(ONS.travel).forEach(([k,v])=>area.add(new Option(`${k} — ${money(v)} travel / meeting fee`,k)));
  Object.entries(ONS.loanPackages).forEach(([k,v])=>loanPackage.add(new Option(`${k} — +${money(v)}`,k)));
  Object.keys(ONS.timing).forEach(k=>timing.add(new Option(`${k}${ONS.timing[k]?` — +${money(ONS.timing[k])}`:''}`,k)));
  Object.keys(ONS.special).forEach(k=>special.add(new Option(`${k}${ONS.special[k]?` — +${money(ONS.special[k])}`:''}`,k)));

  function syncFields(){
    const isLoan=type.value==='Real Estate / Loan Signing';
    loanWrap.hidden=!isLoan;
    loanPackage.required=isLoan;
  }

  function calc(){
    syncFields();
    const selectedType=type.value;
    let base=0;
    let notarial=0;
    let packageFee=0;
    let baseLabel='Travel / meeting fee';

    if(selectedType==='Estate Planning Signing'){
      base=ONS.estate[area.value]||0;
      baseLabel='Estate planning signing';
    } else if(selectedType==='Real Estate / Loan Signing'){
      base=ONS.travel[area.value]||0;
      notarial=ONS.notarialFee;
      packageFee=ONS.loanPackages[loanPackage.value]||0;
    } else {
      base=ONS.travel[area.value]||0;
      notarial=ONS.notarialFee;
    }

    const timingFee=ONS.timing[timing.value]||0;
    const specialFee=ONS.special[special.value]||0;
    const extraUnits=Math.max(0,Number(extra.value||0));
    const extraFee=extraUnits*ONS.extraTime;
    const printPages=Math.max(0,Number(print.value||0));
    const printFee=printPages*ONS.printing;
    const scanFee=scan.checked?ONS.scanBack:0;
    const total=base+notarial+packageFee+timingFee+specialFee+extraFee+printFee+scanFee;

    out.textContent=money(total);
    const rows=[
      [baseLabel,base],
      ['Notarial fee',notarial],
      ['Signing package service',packageFee],
      ['Timing',timingFee],
      ['Special location',specialFee],
      ['Additional time',extraFee],
      ['Printing',printFee],
      ['Scan-back',scanFee]
    ].filter(r=>r[1]>0);
    lines.innerHTML=rows.map(([label,val])=>`<div class="quote-line"><span>${label}</span><strong>${money(val)}</strong></div>`).join('');
    return {total,base,notarial,packageFee,timingFee,specialFee,extraFee,printFee,scanFee};
  }

  form.addEventListener('input',calc);
  form.addEventListener('change',calc);
  calc();

  document.querySelector('#sendEstimate')?.addEventListener('click',()=>{
    const q=calc();
    const packageLine=type.value==='Real Estate / Loan Signing' ? `Signing package: ${loanPackage.value}` : '';
    const body=[
      'Oahu Notary Services appointment estimate request',
      '',
      `Name: ${name.value||''}`,
      `Service: ${type.value}`,
      packageLine,
      `Document: ${documentField.value||''}`,
      `Location: ${locationField.value||area.value}`,
      `Area: ${area.value}`,
      `Timing: ${timing.value}`,
      `Special location: ${special.value}`,
      `Estimated pre-GET total: ${money(q.total)}`,
      '',
      'I understand this is an estimate only and final pricing and availability must be confirmed.'
    ].filter(Boolean).join('\n');
    location.href=`mailto:${ONS.email}?subject=${encodeURIComponent('Estimate Request - Oahu Notary Services')}&body=${encodeURIComponent(body)}`;
  });

  document.querySelector('#textEstimate')?.addEventListener('click',e=>{
    e.preventDefault();
    const q=calc();
    const pkg=type.value==='Real Estate / Loan Signing' ? `, ${loanPackage.value}` : '';
    const msg=`Hi Oahu Notary Services! I would like an appointment quote for ${type.value}${pkg}, ${area.value}. The website estimate before applicable GET is ${money(q.total)}. Please confirm final price and availability.`;
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
  registerServiceWorker();
});
