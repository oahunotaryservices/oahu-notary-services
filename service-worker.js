const CACHE_NAME='ons-pwa-20260823h';
const CORE=[
  '/',
  '/index.html',
  '/assets/css/styles.css?v=20260823h',
  '/assets/js/site.js?v=20260823h',
  '/assets/img/ons-brand-icon-192.png?v=20260823h',
  '/assets/img/ons-brand-icon-512.png?v=20260823h'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;

  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req).then(resp=>{
        const copy=resp.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(req,copy));
        return resp;
      }).catch(()=>caches.match(req).then(r=>r||caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    fetch(req).then(resp=>{
      if(resp && resp.ok){
        const copy=resp.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(req,copy));
      }
      return resp;
    }).catch(()=>caches.match(req))
  );
});
