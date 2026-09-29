// Service Worker کانون حقوقی ایران — پشتیبانی آفلاین ساده
const CACHE_NAME = 'ilh-cache-v2';
const APP_SHELL = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './data.js',
    './manifest.json',
    './assets/icons/ilh_light.png',
    './assets/icons/ilh_dark.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .catch(() => { /* اگر بعضی فایل‌ها موجود نبودند، نصب را متوقف نکن */ })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return; // فقط منابع همین سایت کش می‌شوند

    // فایل‌های JSON متن قوانین: اول از کش (سریع و آفلاین)، اگر نبود از شبکه بگیر و کش کن
    if (url.pathname.includes('/laws/') && url.pathname.endsWith('.json')) {
        event.respondWith(
            caches.match(req).then((cached) => {
                if (cached) return cached;
                return fetch(req)
                    .then((res) => {
                        const resClone = res.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
                        return res;
                    })
                    .catch(() => cached);
            })
        );
        return;
    }

    // بقیه‌ی فایل‌های اصلی برنامه: اول شبکه (برای دریافت آخرین نسخه)، اگر نبود از کش
    event.respondWith(
        fetch(req)
            .then((res) => {
                const resClone = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
                return res;
            })
            .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
});
