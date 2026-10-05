// Service Worker کانون حقوقی ایران — پشتیبانی آفلاین (PWA)
// نکته: با هر تغییر در فایل‌های برنامه/قوانین، عدد نسخه‌ی زیر را بالا ببرید.
const CACHE_NAME = 'ilh-cache-v7';
const APP_SHELL = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './data.js',
    './manifest.json',
    './precache-laws.json',
    './assets/icons/ilh_light.png',
    './assets/icons/ilh_dark.png',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './assets/icons/icon-maskable-512.png',
    './assets/icons/apple-touch-icon.png',
    './assets/fonts/Vazirmatn.woff2'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => Promise.all(APP_SHELL.map((u) => cache.add(u).catch(() => null))))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

async function broadcast(msg) {
    const all = await self.clients.matchAll({ includeUncontrolled: true });
    all.forEach((c) => c.postMessage(msg));
}

// دانلود همه‌ی قوانین برای استفاده‌ی کامل آفلاین (به درخواست کاربر)
async function cacheAllLaws() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const listRes = await fetch('./precache-laws.json', { cache: 'no-store' });
        const list = await listRes.json();
        let done = 0;
        await broadcast({ type: 'CACHE_PROGRESS', done, total: list.length });
        for (const p of list) {
            try {
                const res = await fetch(p, { cache: 'no-store' });
                if (res.ok) await cache.put(new Request(p, { method: 'GET' }), res);
            } catch (e) { /* ادامه بده */ }
            done++;
            if (done % 3 === 0 || done === list.length) await broadcast({ type: 'CACHE_PROGRESS', done, total: list.length });
        }
        await broadcast({ type: 'CACHE_DONE', total: list.length });
    } catch (e) {
        await broadcast({ type: 'CACHE_ERROR' });
    }
}

self.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data.type === 'CACHE_ALL') event.waitUntil(cacheAllLaws());
    if (data.type === 'CACHE_STATUS') {
        event.waitUntil((async () => {
            try {
                const cache = await caches.open(CACHE_NAME);
                const list = await (await fetch('./precache-laws.json')).json();
                let have = 0;
                for (const p of list) if (await cache.match(p)) have++;
                await broadcast({ type: 'CACHE_STATUS', have, total: list.length });
            } catch (e) { await broadcast({ type: 'CACHE_STATUS', have: 0, total: 0 }); }
        })());
    }
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;

    // متن قوانین: اول کش (سریع و آفلاین) و هم‌زمان به‌روزرسانی در پس‌زمینه
    if ((url.pathname.includes('/laws/') || url.pathname.includes('/guides/')) && url.pathname.endsWith('.json')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cached = await cache.match(req);
                const network = fetch(req).then((res) => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
                return cached || (await network) || new Response('[]', { status: 503, headers: { 'Content-Type': 'application/json' } });
            })
        );
        return;
    }

    // پوسته‌ی برنامه: اول شبکه (آخرین نسخه)، در نبود اینترنت از کش
    event.respondWith(
        fetch(req)
            .then((res) => {
                if (res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, copy)); }
                return res;
            })
            .catch(() => caches.match(req, { ignoreSearch: true }).then((cached) => cached || (req.mode === 'navigate' ? caches.match('./index.html') : undefined)))
    );
});
