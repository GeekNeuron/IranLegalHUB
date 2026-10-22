# کانون حقوقی ایران (IranLegalHUB)

وب‌اپ ایستا (HTML/CSS/JS خالص) برای مطالعه‌ی متن قوانین ایران، با جستجو، نشان‌کردن و یادداشت، فلش‌کارت لایتنر، آمار پیشرفت، مرور شبانه و PWA آفلاین. مخصوص GitHub Pages.

## انتشار روی GitHub Pages
کل پوشه (نه فقط چند فایل) را در ریشه‌ی مخزن آپلود کنید: `index.html`، `style.css`، `script.js`، `data.js`، `sw.js`، `manifest.json`، `precache-laws.json` و پوشه‌های `laws/` و `assets/`. سپس در Settings ← Pages شاخه‌ی اصلی را انتخاب کنید.

## فونت
وزیرمتن به‌صورت محلی در `assets/fonts/` است (مجوز OFL در `OFL.txt`) و هیچ درخواستی به سرویس‌های خارجی نمی‌رود.

## نکته برای توسعه
پس از افزودن یا تغییر هر قانون: `python3 tools/format_articles.py <فایل‌ها>`، `python3 tools/build_precache.py` و بالا بردن عدد `CACHE_NAME` در `sw.js`. راهنمای کامل در `docs/HANDOFF.md`.
