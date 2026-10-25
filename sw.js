/* Resibo service worker: keeps the app and its libraries available offline. */
var V='resibo-v14';
var SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
var LIBS=/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|www\.gstatic\.com\/firebasejs|fonts\.googleapis\.com|fonts\.gstatic\.com/;
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(function(res){if(res&&res.ok){var c=res.clone();caches.open(V).then(function(ch){ch.put(r,c)})}return res}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('./index.html')})}));
    return;
  }
  if(LIBS.test(u.href)){
    e.respondWith(caches.match(r).then(function(m){
      var f=fetch(r).then(function(res){if(res&&(res.ok||res.type==='opaque')){var c=res.clone();caches.open(V).then(function(ch){ch.put(r,c)})}return res}).catch(function(){return m});
      return m||f;
    }));
  }
});
