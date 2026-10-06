// SISWA TIDAK PERLU MENGEDIT FILE INI.
// Nama cache terpisah untuk tiap lokasi project.
const CACHE_PREFIX = 'smk-portfolio-mobile-' + self.registration.scope;
const CACHE_NAME = CACHE_PREFIX + '-v1';
const FILES = [
  './', './index.html', './portfolio.html', './about.html', './contact.html',
  './css/style.css', './css/home.css', './css/portfolio.css',
  './css/about.css', './css/contact.css', './js/app.js', './manifest.json',
  './images/profile.png', './images/karya-01.jpg', './images/karya-02.jpg',
  './images/karya-03.jpg', './images/karya-04.jpg', './images/karya-05.jpg',
  './images/karya-06.jpg', './images/icon-192.png', './images/icon-512.png'
];

// Simpan semua halaman dan gambar sejak kunjungan pertama selesai.
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

// Online: ambil versi terbaru. Offline: tampilkan salinan yang disimpan.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch {
      const saved = await cache.match(event.request, { ignoreSearch: true });
      return saved || new Response('Halaman ini belum tersimpan. Buka kembali saat online.', {
        status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});
