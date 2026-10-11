// לוח טהרה – עבודה בלי אינטרנט: שומר עותק של האתר במכשיר. הנתונים עצמם נשמרים ע"י האתר (localStorage) ומסתנכרנים כשהחיבור חוזר.
const C = 'tahara-v1';
self.addEventListener('install', (e) => { e.waitUntil(caches.open(C).then(c => c.addAll(['./', './index.html', './manifest.webmanifest', './icon-192.png'])).catch(() => {}).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== 'GET') return;
  const same = u.origin === location.origin, font = /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (!same && !font) return;                 // השרת (Worker) – תמיד ברשת
  // קודם רשת (כדי לקבל עדכונים), ואם אין חיבור – מהעותק השמור
  e.respondWith(fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(req, cp)); } return r; })
    .catch(() => caches.match(req).then(r => r || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))));
});
