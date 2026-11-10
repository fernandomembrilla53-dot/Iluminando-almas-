/* Offline support with fresh content preferred; v6 official approved cover. */
const CACHE='iluminando-almas-portada-exacta-20261110-v6';
const CORE=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./privacy.html','./terms.html','./assets/home-official.webp','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('iluminando-almas-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,copy)));}
    return response;
  }).catch(()=>caches.match(event.request,{ignoreSearch:true}).then(r=>r||Response.error())));
});
