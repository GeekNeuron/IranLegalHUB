// ===== شروع کد نهایی script.js (بدون ابزارها + با انیمیشن نرم) =====

// ذخیره‌سازی امن (اگر مرورگر localStorage را مسدود کند، برنامه از کار نیفتد)
function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* بی‌اهمیت */ } }

// 0. آیکون‌های SVG داخلی (جایگزین Font Awesome، بدون وابستگی به CDN)
const ICONS = {
    book: '<span class="icon-inline"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></span>',
    chevron: '<span class="icon-inline icon-chevron"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg></span>',
    spinner: '<span class="icon-inline icon-spin"><svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg></span>',
    copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
    share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"></line><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"></line></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
    note: '<svg viewBox="0 0 24 24"><path d="M4 4h16v12l-4 4H4z"></path><line x1="8" y1="9" x2="16" y2="9"></line><line x1="8" y1="13" x2="13" y2="13"></line></svg>',
    trash: '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>',
    print: '<svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>'
};

// یکسان‌سازی حروف عربی/فارسی و ارقام برای جستجو
function normalizeFa(str) {
    return String(str || '')
        .replace(/[\u064A\u0649]/g, '\u06CC')
        .replace(/\u0643/g, '\u06A9')
        .replace(/\u0640/g, '')
        .replace(/\u200c/g, ' ')
        .replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 0x0660))
        .replace(/[\u06F0-\u06F9]/g, d => String(d.charCodeAt(0) - 0x06F0));
}
function escapeRegex(str) { return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// تابع کمکی برای امن‌سازی مقدار داخل کوئری سلکتور (fallback برای مرورگرهای قدیمی)
function cssEscape(str) {
    if (window.CSS && CSS.escape) return CSS.escape(str);
    return String(str).replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '\\$&');
}

// 1. تابع کمکی تبدیل اعداد به فارسی
function toPersianNumerals(str) {
    if (str === null || str === undefined) return '';
    const persian = { '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹' };
    return String(str).replace(/[0-9]/g, (w) => persian[w]);
}

// 2. تابع فرمت‌دهی متن (تبدیل /n به <br>)
function formatText(text) {
    if (!text) return '';
    return text.replace(/(\r\n|\n|\r|\/n|\\n)/g, '<br>');
}

// 2.5 تابع نمایش پیام کوتاه (Toast)
let toastTimer = null;
function showToast(message) {
    let toastEl = document.getElementById('ilh-toast');
    if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.id = 'ilh-toast';
        toastEl.className = 'ilh-toast';
        document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

// 2.6 تابع کپی متن در کلیپ‌بورد با پشتیبانی از مرورگرهای قدیمی‌تر
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            resolve();
        } catch (e) { reject(e); }
    });
}

// 2.7 تابع مشترک کپی/اشتراک‌گذاری یک متن با عنوان مشخص
function copyPlainText(text) {
    copyToClipboard(text)
        .then(() => showToast('📋 متن کپی شد'))
        .catch(() => showToast('کپی انجام نشد'));
}
function sharePlainText(title, text) {
    if (navigator.share) {
        navigator.share({ title, text }).catch(() => { /* لغو توسط کاربر - بی‌اهمیت */ });
    } else {
        copyToClipboard(text)
            .then(() => showToast('🔗 مرورگر شما از اشتراک‌گذاری مستقیم پشتیبانی نمی‌کند — متن کپی شد'))
            .catch(() => showToast('کپی انجام نشد'));
    }
}

// 3. ذخیره‌سازی نشان‌شده‌ها (Bookmarks) در localStorage
function getBookmarks() {
    try { return JSON.parse(localStorage.getItem('ilh-bookmarks') || '[]'); } catch (e) { return []; }
}
function saveBookmarks(list) {
    lsSet('ilh-bookmarks', JSON.stringify(list));
    updateBookmarksBadge();
}
function isBookmarked(id) {
    return getBookmarks().some(b => b.id === id);
}
function toggleBookmark(articleEl) {
    const id = articleEl.dataset.articleId;
    const list = getBookmarks();
    const idx = list.findIndex(b => b.id === id);
    if (idx > -1) {
        list.splice(idx, 1);
        saveBookmarks(list);
        showToast('از نشان‌شده‌ها حذف شد');
        return false;
    }
    list.unshift({
        id,
        lawKey: articleEl.dataset.lawKey,
        lawTitle: articleEl.dataset.lawTitle,
        label: articleEl.dataset.articleLabel,
        text: articleEl.dataset.rawText
    });
    saveBookmarks(list);
    showToast('⭐ به نشان‌شده‌ها اضافه شد');
    return true;
}
function updateBookmarksBadge() {
    const badge = document.getElementById('bookmarks-count-badge');
    if (!badge) return;
    const n = getBookmarks().length;
    badge.style.display = n > 0 ? 'inline-block' : 'none';
    badge.textContent = toPersianNumerals(n);
    const d = document.getElementById('dash-stat-bookmarks'); if (d) d.textContent = toPersianNumerals(n);
}

// 4. ذخیره‌سازی یادداشت‌های شخصی در localStorage
function getNotes() {
    try { return JSON.parse(localStorage.getItem('ilh-notes') || '{}'); } catch (e) { return {}; }
}
function saveNotes(map) {
    lsSet('ilh-notes', JSON.stringify(map));
    updateNotesBadge();
}
function getNoteText(id) {
    const notes = getNotes();
    return notes[id] ? notes[id].noteText : '';
}
function setNote(id, meta, noteText) {
    const notes = getNotes();
    if (noteText && noteText.trim()) {
        notes[id] = { lawKey: meta.lawKey, lawTitle: meta.lawTitle, label: meta.label, noteText: noteText.trim() };
    } else {
        delete notes[id];
    }
    saveNotes(notes);
}
function updateNotesBadge() {
    const badge = document.getElementById('notes-count-badge');
    if (!badge) return;
    const n = Object.keys(getNotes()).length;
    badge.style.display = n > 0 ? 'inline-block' : 'none';
    badge.textContent = toPersianNumerals(n);
    const d = document.getElementById('dash-stat-notes'); if (d) d.textContent = toPersianNumerals(n);
}

// 5. باز/بسته کردن جعبه‌ی یادداشت زیر یک ماده
function toggleNoteBox(articleEl, noteBtn) {
    const existingBox = articleEl.querySelector('.article-note-box');
    if (existingBox) { existingBox.remove(); return; }

    const id = articleEl.dataset.articleId;
    const existingText = getNoteText(id);
    const box = document.createElement('div');
    box.className = 'article-note-box';
    const safeText = existingText ? existingText.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
    box.innerHTML = `
        <textarea placeholder="یادداشت شما روی این ماده...">${safeText}</textarea>
        <div class="note-save-row">
            <button type="button" class="fc-btn note-save-btn">ذخیره یادداشت</button>
            ${existingText ? '<button type="button" class="fc-btn fc-btn-outline note-delete-btn">حذف</button>' : ''}
        </div>
    `;
    const inner = articleEl.querySelector('.article-collapse-inner') || articleEl;
    inner.appendChild(box);
    articleEl.classList.add('open');
    const headEl = articleEl.querySelector('.article-head'); if (headEl) headEl.setAttribute('aria-expanded', 'true');
    box.querySelector('textarea').focus();

    box.querySelector('.note-save-btn').addEventListener('click', () => {
        const text = box.querySelector('textarea').value;
        setNote(id, {
            lawKey: articleEl.dataset.lawKey,
            lawTitle: articleEl.dataset.lawTitle,
            label: articleEl.dataset.articleLabel
        }, text);
        noteBtn.classList.toggle('has-note', !!text.trim());
        showToast(text.trim() ? '📝 یادداشت ذخیره شد' : 'یادداشت حذف شد');
        box.remove();
    });
    const delBtn = box.querySelector('.note-delete-btn');
    if (delBtn) {
        delBtn.addEventListener('click', () => {
            setNote(id, {}, '');
            noteBtn.classList.remove('has-note');
            showToast('یادداشت حذف شد');
            box.remove();
        });
    }
}

// 6. مدیریت «بازدیدهای اخیر» قوانین در سایدبار
function getRecentLaws() {
    try { return JSON.parse(localStorage.getItem('ilh-recent-laws') || '[]'); } catch (e) { return []; }
}
function recordRecentLaw(lawKey) {
    if (typeof lawManifest === 'undefined' || !lawManifest[lawKey]) return;
    let list = getRecentLaws().filter(k => k !== lawKey);
    list.unshift(lawKey);
    list = list.slice(0, 5);
    lsSet('ilh-recent-laws', JSON.stringify(list));
    renderRecentLawsSection();
}
function renderRecentLawsSection() {
    const section = document.getElementById('sidebar-recent-section');
    if (!section || typeof lawManifest === 'undefined') return;
    const recent = getRecentLaws().filter(k => lawManifest[k]);
    if (recent.length === 0) { section.innerHTML = ''; return; }
    let html = '<div class="sidebar-recent-heading">بازدیدهای اخیر</div>';
    recent.forEach(key => {
        const isActive = document.querySelector(`.tab-link[data-tab="${cssEscape(key)}"].active`) ? ' active' : '';
        html += `<button type="button" class="sidebar-item sidebar-sublink tab-link${isActive}" data-tab="${key}">
                    <span class="sidebar-item-label">${lawManifest[key].title}</span>
                 </button>`;
    });
    html += '<hr class="sidebar-recent-divider">';
    section.innerHTML = html;
}

// 9. آماده‌سازی و اجرای چاپ یک فایل قانون
async function printLawFile(fileLi) {
    const contentContainer = fileLi.querySelector('.content-container');
    if (!contentContainer) return;

    showToast('🖨 در حال آماده‌سازی برای چاپ...');

    if (contentContainer.children.length === 0) {
        contentContainer.innerHTML = `<div class="tool-padding">${ICONS.spinner} در حال دریافت متن کامل...</div>`;
        try {
            await fetchAndRenderLawFile(fileLi.dataset.path, contentContainer, fileLi.dataset.lawKey);
        } catch (err) {
            contentContainer.innerHTML = '<div class="tool-padding error">خطا در دریافت اطلاعات. دوباره تلاش کنید.</div>';
            showToast('چاپ ناموفق بود — اتصال اینترنت را بررسی کنید');
            return;
        }
    }

    try { await Promise.all([document.fonts.load('400 16px Vazirmatn'), document.fonts.load('700 16px Vazirmatn')]); await document.fonts.ready; } catch (e) { /* بی‌اهمیت */ }

    // توجه: دیگر نیازی به باز کردن دستی آکاردئون‌ها نیست — استایل چاپ (CSS) خودش،
    // صرف‌نظر از اینکه روی صفحه چه‌چیزی باز/بسته است، همه‌ی مواد را کامل نشان می‌دهد.
    const tabContentEl = fileLi.closest('.tab-content');
    const lawKey = fileLi.dataset.lawKey;
    const lawInfo = lawManifest[lawKey];
    const fileTitleEl = fileLi.querySelector('.file-group-title');
    const fileTitle = fileTitleEl ? fileTitleEl.textContent.trim() : '';

    let titleEl = fileLi.querySelector('#print-only-title');
    if (!titleEl) {
        titleEl = document.createElement('div');
        titleEl.id = 'print-only-title';
        fileLi.insertBefore(titleEl, fileLi.firstChild);
    }
    let today = '';
    try { today = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()); } catch (e) { today = new Date().toLocaleDateString('fa-IR'); }
    titleEl.innerHTML = `<h1>${lawInfo ? lawInfo.title : ''}</h1><p>${fileTitle}</p><p class="print-meta">تاریخ چاپ: ${today} — کانون حقوقی ایران</p><hr>`;

    fileLi.classList.add('print-target');
    if (tabContentEl) tabContentEl.classList.add('printing');

    let cleaned = false;
    const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        fileLi.classList.remove('print-target');
        if (tabContentEl) tabContentEl.classList.remove('printing');
        if (titleEl) titleEl.remove();
        window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);

    requestAnimationFrame(() => requestAnimationFrame(() => {
        window.print();
        setTimeout(cleanup, 3000); // یدکی برای مرورگرهایی که afterprint را فعال نمی‌کنند
    }));
}
function renderBookmarksPage() {
    const container = document.getElementById('bookmarks-list');
    if (!container) return;
    const list = getBookmarks();
    if (list.length === 0) {
        container.innerHTML = '<div class="bm-note-empty">هنوز چیزی نشان نکرده‌اید. کنار هر ماده روی ⭐ بزنید.</div>';
        return;
    }
    container.innerHTML = list.map(b => `
        <div class="bm-note-item" data-id="${b.id}">
            <div class="bm-note-item-head">
                <span class="bm-note-item-title">${b.label || ''}</span>
                <button type="button" class="art-action-btn bm-remove-btn" title="حذف از نشان‌شده‌ها">${ICONS.trash}</button>
            </div>
            <div class="bm-note-item-sub">${b.lawTitle || ''}</div>
            <div class="bm-note-item-text">${toPersianNumerals(formatText(b.text || ''))}</div>
        </div>
    `).join('');
}

// 8. رندر صفحه‌ی «یادداشت‌های من»
function renderNotesPage() {
    const container = document.getElementById('notes-list');
    if (!container) return;
    const notes = getNotes();
    const ids = Object.keys(notes);
    if (ids.length === 0) {
        container.innerHTML = '<div class="bm-note-empty">هنوز یادداشتی ننوشته‌اید. کنار هر ماده روی 🗒 بزنید.</div>';
        return;
    }
    container.innerHTML = ids.map(id => {
        const n = notes[id];
        return `
        <div class="bm-note-item" data-id="${id}">
            <div class="bm-note-item-head">
                <span class="bm-note-item-title">${n.label || ''}</span>
                <button type="button" class="art-action-btn note-remove-btn" title="حذف یادداشت">${ICONS.trash}</button>
            </div>
            <div class="bm-note-item-sub">${n.lawTitle || ''}</div>
            <div class="bm-note-item-text">${toPersianNumerals(formatText(n.noteText || ''))}</div>
        </div>`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const searchInput = document.getElementById('search-input');

    // ----- متغیرهای مدیریت داده‌ها و جستجو -----
    let allLawsData = {}; 
    let fitFlashcardsFn = null;
    let isDataLoaded = false; 

    // ----- 0. ساخت پویای فهرست قوانین در سایدبار -----
    function renderSidebarLawsList() {
        const listEl = document.getElementById('sidebar-full-laws-list');
        if (!listEl || typeof lawManifest === 'undefined') return;
        let html = '';
        for (const key in lawManifest) {
            html += `<button type="button" class="sidebar-item sidebar-sublink tab-link" data-tab="${key}">
                        <span class="sidebar-item-label">${lawManifest[key].title}</span>
                     </button>`;
        }
        listEl.innerHTML = html;
        renderRecentLawsSection();
    }
    renderSidebarLawsList();
    updateBookmarksBadge();
    updateNotesBadge();


    // ----- 1. قابلیت‌های سایدبار: باز/بسته‌شدن روی موبایل، گروه‌های تاشو، تنظیمات -----
    const sidebar = document.getElementById('sidebar');
    const sidebarOpenBtn = document.getElementById('sidebar-open-btn');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');

    function openSidebar() { document.body.classList.add('sidebar-open'); }
    function closeSidebar() { document.body.classList.remove('sidebar-open'); }

    if (sidebarOpenBtn) sidebarOpenBtn.addEventListener('click', openSidebar);
    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

    // بازشوهای تاشو (قوانین / تنظیمات)
    document.querySelectorAll('.sidebar-group-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.sidebar-group');
            const submenu = group.querySelector('.sidebar-submenu');
            toggleAccordion(submenu, group);
            btn.setAttribute('aria-expanded', group.classList.contains('expanded') ? 'true' : 'false');
        });
    });

    // ----- تنظیمات: حالت تاریک/روشن -----
    const themeSwitch = document.getElementById('theme-switch');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    function applyTheme(dark, persist) {
        document.body.classList.toggle('dark-theme', dark);
        if (themeSwitch) themeSwitch.checked = dark;
        if (themeMeta) themeMeta.setAttribute('content', dark ? '#121212' : '#0d6efd');
        if (persist) { try { localStorage.setItem('ilh-theme', dark ? 'dark' : 'light'); } catch (e) {} }
    }
    applyTheme(document.body.classList.contains('dark-theme'), false);
    if (themeSwitch) themeSwitch.addEventListener('change', () => applyTheme(themeSwitch.checked, true));

    // ----- تنظیمات: اندازه متن -----
    let fontScale = parseFloat(lsGet('ilh-font-scale')) || 1;
    function applyFontScale(scale) {
        scale = Math.min(1.3, Math.max(0.85, Math.round(scale * 100) / 100));
        fontScale = scale;
        mainContent.style.fontSize = scale + 'em';
        lsSet('ilh-font-scale', scale);
    }
    applyFontScale(fontScale);
    const fontDecBtn = document.getElementById('font-size-dec');
    const fontResetBtn = document.getElementById('font-size-reset');
    const fontIncBtn = document.getElementById('font-size-inc');
    if (fontDecBtn) fontDecBtn.addEventListener('click', () => applyFontScale(fontScale - 0.1));
    if (fontIncBtn) fontIncBtn.addEventListener('click', () => applyFontScale(fontScale + 0.1));
    if (fontResetBtn) fontResetBtn.addEventListener('click', () => applyFontScale(1));

    // ----- 2. منطق زبانه‌ها (Tabs) - با Event Delegation تا آیتم‌های پویای سایدبار را هم پوشش دهد -----
    document.addEventListener('click', (e) => {
        const tab = e.target.closest('.tab-link');
        if (!tab) return;
        document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        const targetId = tab.dataset.tab;
        // فعال کردن همه‌ی دکمه‌هایی که به همین قانون اشاره دارند (هم تو «اخیر» هم تو فهرست کامل)
        document.querySelectorAll(`.tab-link[data-tab="${cssEscape(targetId)}"]`).forEach(t => t.classList.add('active'));
        const targetTab = document.getElementById(targetId);
        if (targetTab) targetTab.classList.add('active');

        if (typeof lawManifest !== 'undefined' && lawManifest[targetId]) {
            recordRecentLaw(targetId);
        }
        if (targetId === 'tab-bookmarks') renderBookmarksPage();
        if (targetId === 'tab-notes') renderNotesPage();
        if (targetId === 'tab-progress') renderProgressPage();
        if (targetId === 'tab-dashboard') refreshDashboard();
        if (targetId === 'tab-flashcards' && fitFlashcardsFn) requestAnimationFrame(fitFlashcardsFn);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        searchInput.value = '';
        hideSearchResults();
        closeSidebar();
    });

    // ----- 3. ایجاد اسکلت اولیه محتوا -----
    function createInitialSkeletons() {
        if (typeof lawManifest === 'undefined') {
            console.error('ارور: فایل data.js لود نشده است.');
            return;
        }

        for (const key in lawManifest) {
            const law = lawManifest[key];
            const contentDiv = document.createElement('div');
            contentDiv.id = key;
            contentDiv.className = 'tab-content';
            
            contentDiv.innerHTML = `
                <p class="law-info">${law.info}</p>
                ${law.warning ? `<p class="law-warning">⚠️ ${law.warning}</p>` : ''}
                ${(law.related || []).filter(r => lawManifest[r.key]).length ? `<div class="law-related"><span>قوانین مرتبط:</span>${law.related.filter(r => lawManifest[r.key]).map(r => `<button type="button" class="related-chip tab-link" data-tab="${r.key}">${r.label}</button>`).join('')}</div>` : ''}
                <div class="articles-container accordion main-accordion-container"></div>
                <div class="search-results-container" style="display: none;"></div>
            `;
            mainContent.appendChild(contentDiv);

            renderMainAccordion(contentDiv.querySelector('.articles-container'), law, key);
        }
        // فعال‌سازی محتوای متناظر با تبی که از قبل در نوار ناوبری active است
        const activeTabBtn = document.querySelector('.tab-link.active');
        if (activeTabBtn) {
            const activeContent = document.getElementById(activeTabBtn.dataset.tab);
            if (activeContent) activeContent.classList.add('active');
        } else if (document.querySelector('.tab-content')) {
            document.querySelector('.tab-content').classList.add('active');
        }
    }

    // ----- 4. ساخت لیست فایل‌ها (ابزارها حذف شدند) -----
    function renderMainAccordion(container, law, lawKey) {
        const mainUl = document.createElement('ul');
        
        // فقط لیست فایل‌های قانون
        if (law.files && law.files.length > 0) {
            law.files.forEach(fileInfo => {
                const fileLi = document.createElement('li');
                fileLi.className = 'file-group has-children';
                fileLi.dataset.type = 'law-file';
                fileLi.dataset.path = fileInfo.path;
                fileLi.dataset.lawKey = lawKey;
                fileLi.innerHTML = `
                    <span>
                        <span class="file-group-title">${ICONS.book} ${fileInfo.title}</span>
                        <span class="article-actions file-actions">
                            <button type="button" class="art-action-btn art-print-btn" data-scope="file" title="پرینت / دریافت PDF کامل این قانون">${ICONS.print}</button>
                        </span>
                    </span>
                    <div class="content-container"></div>
                `;
                mainUl.appendChild(fileLi);
            });
        }
        container.appendChild(mainUl);
    }

    // ----- 5. هندل کردن کلیک‌ها -----
    mainContent.addEventListener('click', async (e) => {

        // ----- حذف از لیست نشان‌شده‌ها یا یادداشت‌ها (صفحه‌ی اختصاصی) -----
        const bmRemoveBtn = e.target.closest('.bm-remove-btn');
        if (bmRemoveBtn) {
            const item = bmRemoveBtn.closest('.bm-note-item');
            const id = item.dataset.id;
            const list = getBookmarks().filter(b => b.id !== id);
            saveBookmarks(list);
            document.querySelectorAll(`.art-bookmark-btn[data-article-id="${cssEscape(id)}"]`).forEach(b => b.classList.remove('bookmarked'));
            renderBookmarksPage();
            showToast('از نشان‌شده‌ها حذف شد');
            return;
        }
        const noteRemoveBtn = e.target.closest('.note-remove-btn');
        if (noteRemoveBtn) {
            const item = noteRemoveBtn.closest('.bm-note-item');
            const id = item.dataset.id;
            setNote(id, {}, '');
            document.querySelectorAll(`.art-note-btn[data-article-id="${cssEscape(id)}"]`).forEach(b => b.classList.remove('has-note'));
            renderNotesPage();
            showToast('یادداشت حذف شد');
            return;
        }

        // ----- کلیک روی دکمه‌های کپی / اشتراک‌گذاری / چاپ / نشان / یادداشت -----
        const actionBtn = e.target.closest('.art-action-btn');
        if (actionBtn) {
            e.preventDefault();
            e.stopPropagation();

            const scope = actionBtn.dataset.scope; // 'file' برای کل قانون، وگرنه یک ماده است

            // ----- چاپ کل فایل قانون -----
            if (actionBtn.classList.contains('art-print-btn')) {
                const fileLi = actionBtn.closest('.file-group');
                await printLawFile(fileLi);
                return;
            }

            const isCopy = actionBtn.classList.contains('art-copy-btn');
            const isShare = actionBtn.classList.contains('art-share-btn');

            // ----- دکمه‌های سطح یک ماده -----
            const articleEl = actionBtn.closest('.article, .search-result-item');
            if (!articleEl) return;
            const lawTitle = articleEl.dataset.lawTitle || '';
            const label = articleEl.dataset.articleLabel || '';
            const rawText = articleEl.dataset.rawText || '';

            if (isCopy || isShare) {
                const fullText = `${lawTitle}${label ? ' - ' + label : ''}\n\n${rawText}\n\n— کانون حقوقی ایران`;
                if (isCopy) copyPlainText(fullText);
                else sharePlainText(`${lawTitle} - ${label}`, fullText);
                return;
            }

            if (actionBtn.classList.contains('art-bookmark-btn')) {
                const nowBookmarked = toggleBookmark(articleEl);
                actionBtn.classList.toggle('bookmarked', nowBookmarked);
                return;
            }

            if (actionBtn.classList.contains('art-note-btn')) {
                toggleNoteBox(articleEl, actionBtn);
                return;
            }
            return;
        }

        // ----- باز/بسته شدن یک ماده یا اصل -----
        const artHead = e.target.closest('.article-head');
        if (artHead) { toggleArticle(artHead.closest('.article')); return; }

        // کلیک روی تیتر فایل‌ها
        const header = e.target.closest('.file-group > span');
        
        if (header) {
            const parentLi = header.parentElement;
            const contentContainer = parentLi.querySelector('.content-container');
            
            // اگر باز است، انیمیشن بستن اجرا شود
            if (parentLi.classList.contains('expanded')) {
                toggleAccordion(contentContainer, parentLi);
                return;
            }

            // لود کردن محتوا اگر خالی باشد
            if (contentContainer && contentContainer.children.length === 0) {
                contentContainer.innerHTML = `<div class="tool-padding">${ICONS.spinner} در حال بارگذاری...</div>`;
                
                try {
                    if (parentLi.dataset.type === 'law-file') {
                        await fetchAndRenderLawFile(parentLi.dataset.path, contentContainer, parentLi.dataset.lawKey);
                    }
                } catch (error) {
                    console.error(error);
                    contentContainer.innerHTML = '<div class="tool-padding error">خطا در دریافت اطلاعات.</div>';
                }
            }
            toggleAccordion(contentContainer, parentLi);
        }
        
        // کلیک روی زیرمجموعه‌ها (فصل‌ها)
        const divisionHeader = e.target.closest('.division-title');
        if (divisionHeader) {
            const parentLi = divisionHeader.parentElement;
            const subContainer = parentLi.querySelector('.divisions-container, .article-list');
            if (subContainer) {
                toggleAccordion(subContainer, parentLi);
            }
        }
    });

    // ----- 6. توابع رندر کردن محتوا -----
    async function fetchAndRenderLawFile(path, container, lawKey) {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        
        container.innerHTML = ''; 
        const lawInfo = lawManifest[lawKey];

        // پشتیبانی از هر دو فرمت آرایه و آبجکت
        const divisionsList = data.divisions ? data.divisions : (Array.isArray(data) ? data : []);

        if (divisionsList.length > 0) {
            const ul = document.createElement('ul');
            ul.className = 'divisions-list';
            renderDivisionsRecursive(divisionsList, ul, lawInfo, lawKey, path);
            container.appendChild(ul);
        } else {
            container.innerHTML = '<div class="tool-padding">ساختار فایل نامعتبر است یا خالی است.</div>';
        }
    }

    function renderDivisionsRecursive(divisions, containerUl, lawInfo, lawKey, filePath) {
        divisions.forEach(div => {
            const li = document.createElement('li');
            li.className = 'division-item';
            
            if (div.title) {
                li.innerHTML = `<span class="division-title">${toPersianNumerals(div.title)} <span style="float:left; margin-top:3px;">${ICONS.chevron}</span></span>`;
            }

            const childContainer = document.createElement('div');
            
            if (div.subdivisions) {
                childContainer.className = 'divisions-container';
                const subUl = document.createElement('ul');
                renderDivisionsRecursive(div.subdivisions, subUl, lawInfo, lawKey, filePath);
                childContainer.appendChild(subUl);
            } 
            else if (div.articles) {
                childContainer.className = 'article-list';
                div.articles.forEach(art => {
                    const articleDiv = document.createElement('div');
                    articleDiv.className = 'article';
                    
                    let headerText = '';
                    let plainLabel = '';
                    if (art.article_number) {
                        const isNum = !isNaN(parseInt(art.article_number));
                        plainLabel = isNum ? `${lawInfo.article_word} ${art.article_number}` : String(art.article_number);
                        const label = isNum ? `${lawInfo.article_word} ${toPersianNumerals(art.article_number)}` : toPersianNumerals(art.article_number);
                        headerText = `<span class="article-label"><strong>${label}</strong></span>`;
                    }
                    
                    const rawText = art.text || art.description || '';
                    const articleId = `${lawKey}::${filePath}::${plainLabel}`;
                    const bmActive = isBookmarked(articleId) ? ' bookmarked' : '';
                    const noteActive = getNoteText(articleId) ? ' has-note' : '';
                    const previewSrc = rawText.replace(/\s+/g, ' ').trim();
                    const preview = previewSrc.length > 90 ? previewSrc.slice(0, 90) + '…' : previewSrc;
                    articleDiv.innerHTML = `
                        <div class="article-head" role="button" tabindex="0" aria-expanded="false">
                            <span class="article-chev">${ICONS.chevron}</span>
                            ${headerText}
                            <span class="article-actions">
                                <button type="button" class="art-action-btn art-bookmark-btn${bmActive}" data-article-id="${articleId}" title="نشان کردن این ماده">${ICONS.star}</button>
                                <button type="button" class="art-action-btn art-note-btn${noteActive}" data-article-id="${articleId}" title="یادداشت روی این ماده">${ICONS.note}</button>
                                <button type="button" class="art-action-btn art-copy-btn" title="کپی متن این ماده">${ICONS.copy}</button>
                                <button type="button" class="art-action-btn art-share-btn" title="اشتراک‌گذاری این ماده">${ICONS.share}</button>
                            </span>
                        </div>
                        <div class="article-preview">${toPersianNumerals(preview)}</div>
                        <div class="article-collapse"><div class="article-collapse-inner">
                            <div class="article-body">${rawText ? toPersianNumerals(formatText(rawText)) : '<em>متن این ماده هنوز وارد نشده است؛ به منبع رسمی مراجعه کنید.</em>'}</div>
                        </div></div>
                    `;
                    // ذخیره متن خام (بدون HTML) برای کپی/اشتراک‌گذاری/نشان/یادداشت دقیق
                    articleDiv.dataset.lawTitle = lawInfo.title || '';
                    articleDiv.dataset.articleLabel = plainLabel;
                    articleDiv.dataset.rawText = rawText;
                    articleDiv.dataset.lawKey = lawKey || '';
                    articleDiv.dataset.filePath = filePath || '';
                    articleDiv.dataset.articleId = articleId;
                    childContainer.appendChild(articleDiv);
                });
            }

            li.appendChild(childContainer);
            containerUl.appendChild(li);
        });
    }

    // ----- 7. انیمیشن آکاردئون (نسخه اصلاح شده و نرم) -----
    function toggleArticle(articleEl) {
        if (!articleEl) return;
        const open = articleEl.classList.toggle('open');
        const head = articleEl.querySelector('.article-head');
        if (head) head.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    mainContent.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('article-head')) {
            e.preventDefault();
            toggleArticle(e.target.closest('.article'));
        }
    });

    function toggleAccordion(element, parentLi) {
        if (!element) return;
        const isExpanded = parentLi.classList.contains('expanded');
        if (element._accEnd) { element.removeEventListener('transitionend', element._accEnd); element._accEnd = null; }
        if (isExpanded) {
            element.style.height = element.scrollHeight + 'px';
            void element.offsetHeight; // reflow
            element.style.height = '0px';
            parentLi.classList.remove('expanded');
        } else {
            parentLi.classList.add('expanded');
            element.style.height = element.scrollHeight + 'px';
            const done = (ev) => {
                if (ev && (ev.target !== element || ev.propertyName !== 'height')) return;
                // ارتفاع آزاد: هر مقدار محتوا (حتی فصل‌های تو در تو) کامل دیده می‌شود
                element.style.height = 'auto';
                element.removeEventListener('transitionend', done);
                element._accEnd = null;
            };
            element._accEnd = done;
            element.addEventListener('transitionend', done);
            setTimeout(() => { if (parentLi.classList.contains('expanded') && element._accEnd === done) done(); }, 700);
        }
    }

    // ----- 8. منطق جستجو -----
    async function loadAllDataForSearch() {
        if (isDataLoaded) return;
        const promises = [];
        for (const lawKey in lawManifest) {
            if (!allLawsData[lawKey]) allLawsData[lawKey] = [];
            lawManifest[lawKey].files.forEach(fileInfo => {
                promises.push(
                    fetch(fileInfo.path)
                        .then(res => res.json())
                        .then(data => { 
                            const cleanData = data.divisions ? data : { divisions: Array.isArray(data) ? data : [] };
                            allLawsData[lawKey].push({ lawKey, fileInfo, data: cleanData }); 
                        })
                        .catch(err => console.error(`خطا در ایندکس کردن فایل ${fileInfo.path}:`, err))
                );
            });
        }
        await Promise.all(promises);
        isDataLoaded = true;
        console.log("دیتابیس جستجو آماده شد.");
    }

    function performSearch(term) {
        term = normalizeFa(term);
        const results = [];
        term = term.toLowerCase();

        for (const lawKey in allLawsData) {
            const lawFiles = allLawsData[lawKey];
            lawFiles.forEach(fileData => {
                function searchInDivisions(divisions, path) {
                    divisions.forEach(division => {
                        const currentPath = path.concat(division.title || '');
                        if (division.articles) {
                            division.articles.forEach(article => {
                                const artNum = normalizeFa(String(article.article_number || '')).toLowerCase();
                                const artText = normalizeFa(article.text || article.description || '').toLowerCase();
                                if (artNum.includes(term) || artText.includes(term)) {
                                    if (!results.some(r => r.article === article)) {
                                        results.push({ lawInfo: lawManifest[lawKey], division, article, path: currentPath });
                                    }
                                }
                            });
                        }
                        if (division.subdivisions) searchInDivisions(division.subdivisions, currentPath);
                    });
                }
                
                if (fileData.data && fileData.data.divisions) {
                    searchInDivisions(fileData.data.divisions, [fileData.fileInfo.title]);
                }
            });
        }
        renderSearchResults(results, term);
    }
    
    function renderSearchResults(results, term) {
        document.querySelectorAll('.tab-content').forEach(tc => {
            const resultsContainer = tc.querySelector('.search-results-container');
            if(!resultsContainer) return;
            resultsContainer.innerHTML = '';

            const relevantResults = results.filter(r => r.lawInfo && lawManifest[tc.id] && r.lawInfo.title === lawManifest[tc.id].title);

            if (relevantResults.length > 0) {
                 const resultCount = document.createElement('p');
                 resultCount.innerHTML = `یافته‌ها: <strong>${toPersianNumerals(relevantResults.length)}</strong> مورد`;
                 resultCount.className = 'search-count-bar';
                 resultsContainer.appendChild(resultCount);
            } else {
                if(term.length > 1) resultsContainer.innerHTML = '<p class="search-empty">موردی یافت نشد.</p>';
            }

            const regex = new RegExp(escapeRegex(term).replace(/ +/g, '[ \u200c]+'), 'gi');

            relevantResults.forEach(res => {
                const resDiv = document.createElement('div');
                resDiv.className = 'search-result-item'; 

                const rawText = formatText(res.article.text || (res.article.description || ''));
                const highlightedText = rawText.replace(regex, match => `<mark>${match}</mark>`);

                let titlePrefix = '';
                let plainLabel = '';
                if (res.article.article_number) {
                     const isNum = !isNaN(parseInt(res.article.article_number));
                     plainLabel = isNum ? `${res.lawInfo.article_word} ${res.article.article_number}` : String(res.article.article_number);
                     const label = isNum ? `${res.lawInfo.article_word} ${toPersianNumerals(res.article.article_number)}` : toPersianNumerals(res.article.article_number);
                     titlePrefix = `<strong>${label}:</strong>`;
                }
                
                resDiv.innerHTML = `
                    <div class="result-path-row">
                        <div class="result-path">${toPersianNumerals(res.path.join(' > '))}</div>
                        <span class="article-actions">
                            <button type="button" class="art-action-btn art-copy-btn" title="کپی متن این ماده">${ICONS.copy}</button>
                            <button type="button" class="art-action-btn art-share-btn" title="اشتراک‌گذاری این ماده">${ICONS.share}</button>
                        </span>
                    </div>
                    <div class="article-text">${titlePrefix} ${toPersianNumerals(highlightedText)}</div>
                `;
                resDiv.dataset.lawTitle = res.lawInfo.title || '';
                resDiv.dataset.articleLabel = plainLabel;
                resDiv.dataset.rawText = res.article.text || res.article.description || '';
                resultsContainer.appendChild(resDiv);
            });
        });
    }

    function hideSearchResults() {
        document.querySelectorAll('.tab-content').forEach(tc => {
            const resultsContainer = tc.querySelector('.search-results-container');
            const articlesContainer = tc.querySelector('.articles-container');
            if (resultsContainer) resultsContainer.style.display = 'none';
            if (articlesContainer) articlesContainer.style.display = 'block';
        });
        // اگر به‌خاطر جستجو تب عوض شده بود، به تب قبل از جستجو برگرد
        if (preSearchActiveTabId) {
            document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll(`.tab-link[data-tab="${cssEscape(preSearchActiveTabId)}"]`).forEach(t => t.classList.add('active'));
            const tc = document.getElementById(preSearchActiveTabId);
            if (tc) tc.classList.add('active');
            preSearchActiveTabId = null;
        }
    }

    // ----- 8.5 جستجوی محدود به یک قانون خاص، یا جستجوی یکپارچه در همه‌ی قوانین -----
    let preSearchActiveTabId = null;
    const searchScopeSelect = document.getElementById('search-scope-select');

    function populateSearchScopeSelect() {
        if (!searchScopeSelect || typeof lawManifest === 'undefined') return;
        let html = '<option value="all">جستجو در همه قوانین</option>';
        for (const key in lawManifest) {
            html += `<option value="${key}">${lawManifest[key].title}</option>`;
        }
        searchScopeSelect.innerHTML = html;
    }
    populateSearchScopeSelect();

    function activateLawTabForSearch(lawKey) {
        if (!preSearchActiveTabId) {
            const currentActive = document.querySelector('.tab-content.active');
            if (currentActive && currentActive.id !== lawKey) preSearchActiveTabId = currentActive.id;
        }
        document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll(`.tab-link[data-tab="${cssEscape(lawKey)}"]`).forEach(t => t.classList.add('active'));
        const tc = document.getElementById(lawKey);
        if (tc) tc.classList.add('active');
    }

    function showGlobalSearchTab() {
        if (!preSearchActiveTabId) {
            const currentActive = document.querySelector('.tab-content.active');
            if (currentActive && currentActive.id !== 'tab-global-search') preSearchActiveTabId = currentActive.id;
        }
        document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        const tc = document.getElementById('tab-global-search');
        if (tc) tc.classList.add('active');
    }

    function performGlobalSearch(term) {
        term = normalizeFa(term);
        const results = [];
        const lowerTerm = term.toLowerCase();
        for (const lawKey in allLawsData) {
            (allLawsData[lawKey] || []).forEach(fileData => {
                function searchInDivisions(divisions, path) {
                    divisions.forEach(division => {
                        const currentPath = path.concat(division.title || '');
                        if (division.articles) {
                            division.articles.forEach(article => {
                                const artNum = normalizeFa(String(article.article_number || '')).toLowerCase();
                                const artText = normalizeFa(article.text || article.description || '').toLowerCase();
                                if (artNum.includes(lowerTerm) || artText.includes(lowerTerm)) {
                                    results.push({ lawInfo: lawManifest[lawKey], article, path: currentPath });
                                }
                            });
                        }
                        if (division.subdivisions) searchInDivisions(division.subdivisions, currentPath);
                    });
                }
                if (fileData.data && fileData.data.divisions) searchInDivisions(fileData.data.divisions, [fileData.fileInfo.title]);
            });
        }
        renderGlobalSearchResults(results, term);
    }

    function renderGlobalSearchResults(results, term) {
        const container = document.getElementById('global-search-results');
        if (!container) return;
        container.innerHTML = '';
        if (results.length === 0) {
            if (term.length > 1) container.innerHTML = '<p class="search-empty">موردی یافت نشد.</p>';
            return;
        }
        const escapedTerm = escapeRegex(term);
        const regex = new RegExp(escapedTerm.replace(/ +/g, '[ \u200c]+'), 'gi');
        const lawCount = new Set(results.map(r => r.lawInfo.title)).size;

        const countP = document.createElement('p');
        countP.innerHTML = `یافته‌ها: <strong>${toPersianNumerals(results.length)}</strong> مورد در <strong>${toPersianNumerals(lawCount)}</strong> قانون`;
        countP.className = 'search-count-bar';
        container.appendChild(countP);

        const grouped = {};
        results.forEach(r => { (grouped[r.lawInfo.title] = grouped[r.lawInfo.title] || []).push(r); });

        for (const lawTitle in grouped) {
            const heading = document.createElement('h3');
            heading.className = 'global-search-law-heading';
            heading.textContent = lawTitle;
            container.appendChild(heading);

            grouped[lawTitle].forEach(res => {
                const resDiv = document.createElement('div');
                resDiv.className = 'search-result-item';
                
                const rawText = formatText(res.article.text || res.article.description || '');
                const highlightedText = rawText.replace(regex, m => `<mark>${m}</mark>`);

                let titlePrefix = '';
                let plainLabel = '';
                if (res.article.article_number) {
                    const isNum = !isNaN(parseInt(res.article.article_number));
                    plainLabel = isNum ? `${res.lawInfo.article_word} ${res.article.article_number}` : String(res.article.article_number);
                    const label = isNum ? `${res.lawInfo.article_word} ${toPersianNumerals(res.article.article_number)}` : toPersianNumerals(res.article.article_number);
                    titlePrefix = `<strong>${label}:</strong>`;
                }

                resDiv.innerHTML = `
                    <div class="result-path-row">
                        <div class="result-path">${toPersianNumerals(res.path.join(' > '))}</div>
                        <span class="article-actions">
                            <button type="button" class="art-action-btn art-copy-btn" title="کپی متن این ماده">${ICONS.copy}</button>
                            <button type="button" class="art-action-btn art-share-btn" title="اشتراک‌گذاری این ماده">${ICONS.share}</button>
                        </span>
                    </div>
                    <div class="article-text">${titlePrefix} ${toPersianNumerals(highlightedText)}</div>
                `;
                resDiv.dataset.lawTitle = res.lawInfo.title || '';
                resDiv.dataset.articleLabel = plainLabel;
                resDiv.dataset.rawText = res.article.text || res.article.description || '';
                container.appendChild(resDiv);
            });
        }
    }

    function runSearch() {
        const term = searchInput.value.trim();
        const scope = 'all';

        if (term.length <= 1) { hideSearchResults(); return; }

        if (scope === 'all') {
            showGlobalSearchTab();
            const container = document.getElementById('global-search-results');
            if (!isDataLoaded) {
                if (container) container.innerHTML = '<p class="search-empty">در حال آماده‌سازی دیتابیس جستجو...</p>';
            } else {
                performGlobalSearch(term);
            }
        } else {
            activateLawTabForSearch(scope);
            document.querySelectorAll('.tab-content').forEach(tc => {
                const resultsContainer = tc.querySelector('.search-results-container');
                const articlesContainer = tc.querySelector('.articles-container');
                if (!resultsContainer || !articlesContainer) return;
                articlesContainer.style.display = 'none';
                resultsContainer.style.display = 'block';
                if (!isDataLoaded) resultsContainer.innerHTML = '<p>در حال آماده‌سازی دیتابیس جستجو...</p>';
            });
            if (isDataLoaded) performSearch(term);
        }
    }

    searchInput.addEventListener('input', runSearch);

    // ----- 9. دیالوگ «درباره» -----
    function setupAboutDialog() {
        const aboutBtn = document.getElementById('sidebar-about-btn');
        const aboutDialog = document.getElementById('about-dialog');
        const aboutCloseBtn = document.getElementById('about-close-btn');
        if (!aboutBtn || !aboutDialog) return;

        aboutBtn.addEventListener('click', () => { closeSidebar(); aboutDialog.showModal(); });
        aboutCloseBtn.addEventListener('click', () => aboutDialog.close());
        aboutDialog.addEventListener('click', (e) => {
            if (e.target === aboutDialog) aboutDialog.close();
        });
    }

    // ----- 10. بخش فلش‌کارت -----
    // =====================================================================
    // ===== فلش‌کارت: مرور فاصله‌دار با جعبه‌ی لایتنر =====
    // =====================================================================
    function setupFlashcards() {
        const $ = (id) => document.getElementById(id);
        const lawSelect = $('flashcard-law-select');
        const card = $('flashcard');
        if (!lawSelect || !card) return;
        const frontText = $('flashcard-front-text'), backText = $('flashcard-back-text');
        const starBtn = $('fc-star');
        const R = { again: $('fc-again'), hard: $('fc-hard'), good: $('fc-good') };
        const SUB = { again: $('fc-again-sub'), hard: $('fc-hard-sub'), good: $('fc-good-sub') };
        const counterEl = $('fc-counter'), statsEl = $('fc-stats'), fill = $('fc-progress-fill');
        const summaryEl = $('fc-summary'), rateRow = $('fc-rate'), footRow = document.querySelector('#tab-flashcards .fc-foot');
        const stageEl = $('flashcard-stage');
        const boxView = $('fc-box-view'), boxList = $('fc-box-list');
        const modeChips = $('fc-mode-chips'), sizeChips = $('fc-size-chips'), dirBtn = $('fc-dir-btn');

        // فهرست قوانین در منو (قانون مشکوک نمی‌آید)
        Object.keys(lawManifest).forEach(key => {
            if (lawManifest[key].suspect) return;
            const o = document.createElement('option');
            o.value = key; o.textContent = lawManifest[key].title;
            lawSelect.appendChild(o);
        });

        const DAY = 86400000;
        const INTERVALS = [0, 1, 3, 7, 16, 35];            // فاصله‌ی مرور بر حسب روز برای هر جعبه
        const SRS_KEY = 'ilh-fc-srs-v1', PREF_KEY = 'ilh-fc-prefs-v1', OLD_KEY = 'ilh_flashcard_known_box_v1';
        const P = toPersianNumerals;

        let allCards = [];
        let srs = loadSrs();
        const prefs = loadPrefs();
        let session = null, current = null, flipped = false, ready = false;

        // ---------- ذخیره‌سازی ----------
        function loadSrs() {
            let s = {};
            try { s = JSON.parse(localStorage.getItem(SRS_KEY) || '{}') || {}; } catch (e) { s = {}; }
            try {
                if (!localStorage.getItem('ilh-fc-migrated')) {
                    const old = JSON.parse(localStorage.getItem(OLD_KEY) || '{}') || {};
                    Object.keys(old).forEach(id => { if (!s[id]) s[id] = { b: 4, d: Date.now() + 16 * DAY, n: 1, l: 0 }; });
                    localStorage.setItem('ilh-fc-migrated', '1');
                    localStorage.setItem(SRS_KEY, JSON.stringify(s));
                }
            } catch (e) { /* بی‌اهمیت */ }
            return s;
        }
        function saveSrs() { try { localStorage.setItem(SRS_KEY, JSON.stringify(srs)); } catch (e) { /* */ } }
        function loadPrefs() {
            const d = { mode: 'due', size: 20, dir: 'num' };
            try { return Object.assign(d, JSON.parse(localStorage.getItem(PREF_KEY) || '{}')); } catch (e) { return d; }
        }
        function savePrefs() { try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) { /* */ } }

        // ---------- ساخت کارت‌ها از داده‌ی قوانین ----------
        function buildAllCards() {
            const cards = [], seen = new Set();
            for (const lawKey in allLawsData) {
                const lawInfo = lawManifest[lawKey];
                if (!lawInfo || lawInfo.suspect) continue;
                const word = lawInfo.article_word || 'ماده';
                (allLawsData[lawKey] || []).forEach(fileData => {
                    const filePath = fileData.fileInfo && fileData.fileInfo.path;
                    (function walk(divs, section) {
                        (divs || []).forEach(d => {
                            const sec = d.title ? d.title : section;
                            (d.articles || []).forEach(art => {
                                const text = art.text || art.description || '';
                                if (!art.article_number || !text.trim() || isRepealedText(text)) return;
                                const id = `${lawKey}::${filePath}::${art.article_number}`;
                                if (seen.has(id)) return; seen.add(id);
                                const num = art.article_number;
                                const isNum = !isNaN(parseInt(num));
                                cards.push({
                                    id, lawKey, lawTitle: lawInfo.title, word, number: num, section: sec || '',
                                    label: isNum ? `${word} ${P(num)}` : P(String(num)),
                                    plainLabel: isNum ? `${word} ${num}` : String(num),
                                    bmId: `${lawKey}::${filePath}::${isNum ? `${word} ${num}` : String(num)}`,
                                    text
                                });
                            });
                            walk(d.subdivisions, sec);
                        });
                    })(fileData.data && fileData.data.divisions, '');
                });
            }
            return cards;
        }

        // ---------- نشان‌کردن ----------
        const isStarred = (c) => isBookmarked(c.bmId);
        function toggleStar() {
            if (!current) return;
            const list = getBookmarks();
            const idx = list.findIndex(b => b.id === current.bmId);
            if (idx > -1) { list.splice(idx, 1); saveBookmarks(list); showToast('از نشان‌شده‌ها حذف شد'); }
            else {
                list.unshift({ id: current.bmId, lawKey: current.lawKey, lawTitle: current.lawTitle, label: P(current.plainLabel), text: current.text });
                saveBookmarks(list); showToast('⭐ به نشان‌شده‌ها اضافه شد');
            }
            paintStar();
        }
        function paintStar() {
            if (!starBtn) return;
            const on = current && isStarred(current);
            starBtn.textContent = on ? '★' : '☆';
            starBtn.classList.toggle('on', !!on);
        }

        // ---------- ساخت جلسه ----------
        function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
        function pool() { const k = lawSelect.value; return allCards.filter(c => k === 'all' || !k || c.lawKey === k); }
        function counts() {
            const now = Date.now(); let due = 0, fresh = 0, mastered = 0, hard = 0;
            pool().forEach(c => {
                const r = srs[c.id];
                if (!r) fresh++; else { if (r.d <= now) due++; if (r.b >= 4) mastered++; if (r.l > 0 && r.b <= 2) hard++; }
            });
            return { due, fresh, mastered, hard };
        }
        function buildQueue() {
            const now = Date.now(), size = prefs.size > 0 ? prefs.size : 1e9, p = pool();
            let q = [];
            if (prefs.mode === 'due') {
                const due = p.filter(c => srs[c.id] && srs[c.id].d <= now).sort((a, b) => srs[a.id].d - srs[b.id].d);
                q = due.slice(0, size);
                if (q.length < size) q = q.concat(shuffle(p.filter(c => !srs[c.id])).slice(0, size - q.length));
            } else if (prefs.mode === 'all') q = shuffle(p.slice()).slice(0, size);
            else if (prefs.mode === 'starred') q = shuffle(p.filter(isStarred)).slice(0, size);
            else if (prefs.mode === 'hard') q = shuffle(p.filter(c => srs[c.id] && srs[c.id].l > 0 && srs[c.id].b <= 2)).slice(0, size);
            return q;
        }
        function startSession(customQueue) {
            const q = customQueue || buildQueue();
            session = { queue: q.slice(), total: q.length, done: 0, rated: { again: 0, hard: 0, good: 0 }, missed: new Set(), reps: {} };
            summaryEl.style.display = 'none';
            if (!q.length) return showEmpty();
            stageEl.style.display = ''; rateRow.style.display = ''; footRow.style.display = '';
            nextCard();
        }
        function showEmpty() {
            current = null; flipped = false; card.classList.remove('flipped');
            const msg = {
                due: 'امروز کارت سررسیدی نداری 🎉 می‌توانی «همه‌ی کارت‌ها» را مرور کنی.',
                all: 'کارتی برای این قانون پیدا نشد.',
                starred: 'هنوز ماده‌ای را نشان نکرده‌ای؛ با ☆ روی کارت‌ها یا ⭐ در متن قوانین نشان کن.',
                hard: 'کارت سختی نداری 👌 هر کارتی که «دوباره» بزنی اینجا جمع می‌شود.'
            }[prefs.mode];
            frontText.textContent = ready ? msg : 'در حال آماده‌سازی کارت‌ها...';
            backText.textContent = ''; setRateEnabled(false); paintStar(); updateProgress();
        }

        // ---------- نمایش کارت ----------
        let fitFn = null;
        function fit() {
            [frontText, backText].forEach(el => {
                const face = el.parentElement; if (!face) return;
                el.style.fontSize = '';
                let size = parseFloat(getComputedStyle(el).fontSize) || 18;
                const max = face.clientHeight - 56;
                let guard = 0;
                while (el.scrollHeight > max && size > 12 && guard++ < 30) { size -= 1; el.style.fontSize = size + 'px'; }
            });
        }
        fitFn = fit; fitFlashcardsFn = fit;
        function nextCard() {
            if (!session || !session.queue.length) return finishSession();
            current = session.queue[0]; flipped = false; card.classList.remove('flipped');
            const c = current;
            const sec = c.section ? `<br><span class="fc-section">${P(c.section)}</span>` : '';
            if (prefs.dir === 'num') {
                frontText.innerHTML = `${c.label}<br><span class="fc-law-name">${c.lawTitle}</span>${sec}`;
                backText.innerHTML = P(formatText(c.text));
            } else {
                const t = formatText(c.text.length > 380 ? c.text.slice(0, 380).replace(/\s+\S*$/, '') + '…' : c.text);
                frontText.innerHTML = `<span class="fc-recall-text">${P(t)}</span>`;
                backText.innerHTML = `${c.label}<br><span class="fc-law-name">${c.lawTitle}</span>${sec}<br><br>${P(formatText(c.text))}`;
            }
            setRateEnabled(false); previewIntervals(); paintStar(); updateProgress();
            requestAnimationFrame(fit);
        }
        function flip() {
            if (!current) return;
            flipped = !flipped; card.classList.toggle('flipped', flipped);
            if (flipped) setRateEnabled(true);
            requestAnimationFrame(fit);
        }
        function setRateEnabled(on) { Object.values(R).forEach(b => { b.disabled = !on; }); }
        function humanDays(d) { return d <= 0 ? 'همین حالا' : d === 1 ? 'فردا' : `${P(d)} روز بعد`; }
        function nextBox(rec, action) {
            const b = rec ? rec.b : 0;
            if (action === 'again') return 0;
            if (action === 'hard') return Math.max(1, b);
            return Math.min(5, b + 1);
        }
        function previewIntervals() {
            if (!current) return;
            const rec = srs[current.id];
            SUB.again.textContent = 'همین حالا';
            SUB.hard.textContent = 'فردا';
            SUB.good.textContent = humanDays(INTERVALS[nextBox(rec, 'good')]);
        }

        // ---------- امتیازدهی ----------
        function rate(action) {
            if (!current || !flipped || !session) return;
            const c = current, now = Date.now();
            const old = srs[c.id] || { b: 0, d: now, n: 0, l: 0 };
            const rec = { b: nextBox(old, action), n: (old.n || 0) + 1, l: old.l || 0, d: now };
            if (action === 'again') { rec.l++; rec.d = now; }
            else if (action === 'hard') rec.d = now + DAY;
            else rec.d = now + INTERVALS[rec.b] * DAY;
            srs[c.id] = rec; saveSrs();
            recordFlashcardReview(action);
            session.queue.shift();
            session.rated[action]++;
            if (action === 'again') {
                session.missed.add(c.id);
                session.reps[c.id] = (session.reps[c.id] || 0) + 1;
                if (session.reps[c.id] < 3) session.queue.splice(Math.min(3, session.queue.length), 0, c);
                else session.done++;
            } else session.done++;
            nextCard();
        }
        function skip() {
            if (!session || !current) return;
            session.queue.push(session.queue.shift());
            if (session.queue.length === 1) return flip();
            nextCard();
        }

        // ---------- پایان جلسه ----------
        function finishSession() {
            current = null; flipped = false; card.classList.remove('flipped');
            stageEl.style.display = 'none'; rateRow.style.display = 'none'; footRow.style.display = 'none';
            const r = session.rated, total = r.again + r.hard + r.good;
            const missed = session.missed.size;
            summaryEl.innerHTML = `
                <div class="fc-summary-emoji">${missed === 0 ? '🎉' : '👏'}</div>
                <h3>جلسه تمام شد</h3>
                <p>${P(total)} بار مرور شد: <b class="g">${P(r.good)}</b> بلدم، <b class="o">${P(r.hard)}</b> سخت، <b class="r">${P(r.again)}</b> دوباره.</p>
                <div class="fc-summary-actions">
                    ${missed ? `<button type="button" class="fc-btn fc-btn-primary" id="fc-redo-missed">🔁 مرور دوباره‌ی ${P(missed)} کارت اشتباه</button>` : ''}
                    <button type="button" class="fc-btn" id="fc-new-session">جلسه‌ی جدید</button>
                </div>`;
            summaryEl.style.display = 'block'; setRateEnabled(false); updateProgress(true);
            const missedIds = [...session.missed];
            const redo = $('fc-redo-missed');
            if (redo) redo.addEventListener('click', () => startSession(missedIds.map(id => allCards.find(c => c.id === id)).filter(Boolean)));
            $('fc-new-session').addEventListener('click', () => startSession());
        }

        // ---------- نوار پیشرفت و آمار ----------
        function updateProgress(done) {
            const c = counts();
            statsEl.textContent = ` · سررسید: ${P(c.due)} · جدید: ${P(c.fresh)} · مسلط: ${P(c.mastered)}`;
            if (!session || !session.total) { counterEl.textContent = ready ? '' : 'در حال آماده‌سازی…'; fill.style.width = '0%'; return; }
            const n = Math.min(session.done + (done ? 0 : 1), session.total);
            counterEl.textContent = done ? `${P(session.total)} از ${P(session.total)}` : `کارت ${P(n)} از ${P(session.total)}`;
            fill.style.width = Math.round(session.done / session.total * 100) + '%';
        }

        // ---------- جعبه‌ها ----------
        function renderBoxes() {
            const rows = new Array(6).fill(0); let fresh = 0;
            const p = pool();
            p.forEach(c => { const r = srs[c.id]; if (!r) fresh++; else rows[r.b]++; });
            const names = ['جعبه ۰ — اشتباه یا تازه‌اشتباه', 'جعبه ۱ — مرور فردا', 'جعبه ۲ — مرور ۳ روزه', 'جعبه ۳ — مرور هفتگی', 'جعبه ۴ — مرور ۱۶ روزه', 'جعبه ۵ — مرور ماهانه (مسلط)'];
            const max = Math.max(1, fresh, ...rows);
            boxList.innerHTML = `
                <div class="fc-box-row"><span>دیده‌نشده</span><div class="progress-track"><div class="progress-fill" style="width:${Math.round(fresh / max * 100)}%"></div></div><b>${P(fresh)}</b></div>` +
                rows.map((n, i) => `<div class="fc-box-row"><span>${names[i]}</span><div class="progress-track"><div class="progress-fill ${i === 0 ? 'low' : ''}" style="width:${Math.round(n / max * 100)}%"></div></div><b>${P(n)}</b></div>`).join('') +
                `<div class="fc-box-actions"><button type="button" class="fc-btn fc-btn-outline" id="fc-reset">پاک‌کردن پیشرفت این فهرست</button></div>`;
            $('fc-reset').addEventListener('click', () => {
                if (!confirm('پیشرفت مرور کارت‌های همین فهرست پاک شود؟')) return;
                p.forEach(c => { delete srs[c.id]; }); saveSrs(); renderBoxes(); updateProgress(); startSession();
            });
        }

        // ---------- رویدادها ----------
        card.addEventListener('click', (e) => { if (!card._swiped) flip(); card._swiped = false; });
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); flip(); } });
        R.again.addEventListener('click', () => rate('again'));
        R.hard.addEventListener('click', () => rate('hard'));
        R.good.addEventListener('click', () => rate('good'));
        $('fc-skip').addEventListener('click', skip);
        if (starBtn) starBtn.addEventListener('click', toggleStar);
        lawSelect.addEventListener('change', () => { startSession(); });
        modeChips.addEventListener('click', (e) => {
            const b = e.target.closest('.chip'); if (!b) return;
            prefs.mode = b.dataset.mode; savePrefs(); markChips(); startSession();
        });
        sizeChips.addEventListener('click', (e) => {
            const b = e.target.closest('.chip'); if (!b) return;
            prefs.size = parseInt(b.dataset.size, 10); savePrefs(); markChips(); startSession();
        });
        dirBtn.addEventListener('click', () => { prefs.dir = prefs.dir === 'num' ? 'text' : 'num'; savePrefs(); markChips(); if (session && current) nextCard(); });
        $('fc-boxes-btn').addEventListener('click', () => { const open = boxView.style.display === 'none'; boxView.style.display = open ? 'block' : 'none'; if (open) renderBoxes(); });
        $('fc-box-close').addEventListener('click', () => { boxView.style.display = 'none'; });
        function markChips() {
            modeChips.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.mode === prefs.mode));
            sizeChips.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', parseInt(c.dataset.size, 10) === prefs.size));
            dirBtn.textContent = prefs.dir === 'num' ? '🔁 شماره ← متن' : '🔁 متن ← شماره';
        }
        markChips();

        // میان‌برهای صفحه‌کلید
        document.addEventListener('keydown', (e) => {
            const tab = document.getElementById('tab-flashcards');
            if (!tab || !tab.classList.contains('active')) return;
            if (/INPUT|TEXTAREA|SELECT/.test((e.target.tagName || ''))) return;
            const key = e.key.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
            if (key === ' ') { e.preventDefault(); flip(); }
            else if (key === '1') rate('again');
            else if (key === '2') rate('hard');
            else if (key === '3') rate('good');
            else if (key === 's' || key === 'S') toggleStar();
        });

        // کشیدن: راست = بلدم، چپ = دوباره (فقط وقتی کارت چرخیده)
        let sx = 0, sy = 0, tracking = false;
        card.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; tracking = true; card._swiped = false; });
        card.addEventListener('pointerup', (e) => {
            if (!tracking) return; tracking = false;
            const dx = e.clientX - sx, dy = e.clientY - sy;
            if (flipped && Math.abs(dx) > 90 && Math.abs(dx) > Math.abs(dy) * 1.6) { card._swiped = true; rate(dx > 0 ? 'good' : 'again'); }
        });
        card.addEventListener('pointercancel', () => { tracking = false; });
        window.addEventListener('resize', () => requestAnimationFrame(fit));

        // ---------- راه‌اندازی بعد از بارگذاری داده‌ها ----------
        window.ilhFlash = {
            open(lawKey, mode) {
                if (lawKey) lawSelect.value = lawKey;
                if (mode) { prefs.mode = mode; savePrefs(); markChips(); }
                if (ready) startSession();
            },
            setMode(mode) { prefs.mode = mode; savePrefs(); markChips(); if (ready) startSession(); }
        };
        function init() {
            allCards = buildAllCards(); ready = true;
            startSession();
        }
        showEmpty();
        const waiter = setInterval(() => { if (isDataLoaded) { clearInterval(waiter); init(); } }, 300);
    }

    // ----- ۱۰. (حذف‌شده) -----

    // =====================================================================
    // ===== آمار پیشرفت، مرور شبانه و PWA =====
    // =====================================================================
    function isRepealedText(t) { return /^\s*[\(\[]\s*(منسوخ|منقضی)/.test(t || ''); }
    const STATS_KEY = 'ilh-stats-v1';
    function loadStats() {
        try {
            const s = JSON.parse(localStorage.getItem(STATS_KEY) || 'null');
            if (s && s.daily) return s;
        } catch (e) { /* خراب بود: از نو */ }
        return { daily: {}, nights: 0, nightCards: 0 };
    }
    function saveStats(s) { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) { /* بی‌اهمیت */ } }
    function dayKey(d) { d = d || new Date(); const p = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }
    function recordFlashcardReview(action) {
        const s = loadStats();
        const day = s.daily[dayKey()] || { f: 0, g: 0, n: 0 };
        day.f = (day.f || 0) + 1;
        if (action === 'good') day.g = (day.g || 0) + 1;
        s.daily[dayKey()] = day;
        saveStats(s);
    }
    function recordNightReview(n) {
        if (!n) return;
        const s = loadStats();
        const day = s.daily[dayKey()] || { f: 0, g: 0, n: 0 };
        day.n = (day.n || 0) + n;
        s.daily[dayKey()] = day;
        s.nights = (s.nights || 0) + 1;
        s.nightCards = (s.nightCards || 0) + n;
        saveStats(s);
    }
    function goTab(id) { const el = document.querySelector('.tab-link[data-tab="' + id + '"]'); if (el) el.click(); }

    // ----- صفحه‌ی آمار پیشرفت -----
    const WD = ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'];
    function computeStreak(daily) {
        const active = k => daily[k] && ((daily[k].f || 0) > 0 || (daily[k].n || 0) > 0);
        const d = new Date();
        if (!active(dayKey(d))) d.setDate(d.getDate() - 1);
        let n = 0;
        while (active(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
        return n;
    }
    function renderProgressPage() {
        const root = document.getElementById('progress-root');
        if (!root) return;
        const s = loadStats();
        const P = toPersianNumerals;
        let srs = {};
        try { srs = JSON.parse(localStorage.getItem('ilh-fc-srs-v1') || '{}') || {}; } catch (e) { srs = {}; }
        const now = Date.now();
        const recs = Object.entries(srs);
        const days = Object.values(s.daily);
        const totalReviews = days.reduce((a, d) => a + (d.f || 0), 0);
        const totalGood = days.reduce((a, d) => a + (d.g || 0), 0);
        const today = s.daily[dayKey()] || { f: 0, g: 0, n: 0 };
        const dueNow = recs.filter(([, r]) => r.d <= now).length;
        const mastered = recs.filter(([, r]) => r.b >= 4).length;
        const hard = recs.filter(([, r]) => r.l > 0 && r.b <= 2).length;
        const streak = computeStreak(s.daily);
        const acc = totalReviews ? Math.round(totalGood / totalReviews * 100) : 0;

        const week = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate() - i);
            const rec = s.daily[dayKey(d)] || { f: 0, g: 0, n: 0 };
            week.push({ label: WD[d.getDay()], f: rec.f || 0, g: rec.g || 0, n: rec.n || 0, today: i === 0 });
        }
        const maxF = Math.max(5, ...week.map(w => w.f));
        const bars = week.map(w => {
            const h = Math.round(w.f / maxF * 100), hg = w.f ? Math.round(w.g / w.f * h) : 0;
            return `<div class="pg-bar${w.today ? ' today' : ''}" title="${P(w.f)} مرور، ${P(w.g)} بلدم${w.n ? '، ' + P(w.n) + ' کارت شبانه' : ''}">
                <span class="pg-bar-num">${w.f ? P(w.f) : ''}</span>
                <div class="pg-bar-col"><div class="pg-bar-wrong" style="height:${h}%"><div class="pg-bar-right" style="height:${h ? Math.round(hg / h * 100) : 0}%"></div></div></div>
                <span class="pg-bar-day">${w.label}</span>${w.n ? '<span class="pg-bar-moon">🌙</span>' : ''}</div>`;
        }).join('');

        // تسلط به تفکیک قانون
        const byLaw = {};
        recs.forEach(([id, r]) => {
            const k = id.split('::')[0]; if (!lawManifest[k]) return;
            const o = byLaw[k] || { seen: 0, mastered: 0 };
            o.seen++; if (r.b >= 3) o.mastered++; byLaw[k] = o;
        });
        const lawRows = Object.entries(byLaw).filter(([, v]) => v.seen >= 3).sort((a, b) => b[1].seen - a[1].seen).slice(0, 6);
        const lawHtml = lawRows.length ? lawRows.map(([k, v]) => {
            const pct = Math.round(v.mastered / v.seen * 100);
            return `<div class="pg-law">
                <div class="pg-law-head"><span>${lawManifest[k].title}</span><b>${P(pct)}٪ مسلط (${P(v.mastered)} از ${P(v.seen)})</b></div>
                <div class="progress-track"><div class="progress-fill ${pct < 40 ? 'low' : ''}" style="width:${pct}%"></div></div>
                <button type="button" class="pg-link" data-open-law="${k}">مرور این قانون ←</button></div>`;
        }).join('') : '<p class="pg-empty">هنوز برای هیچ قانونی حداقل ۳ کارت مرور نشده. چند جلسه فلش‌کارت بزن تا میزان تسلط نشان داده شود.</p>';

        root.innerHTML = `
            <div class="pg-grid">
                <div class="pg-card"><b>${P(totalReviews)}</b><span>مرور فلش‌کارت</span></div>
                <div class="pg-card"><b>${P(acc)}٪</b><span>پاسخ «بلدم»</span></div>
                <div class="pg-card"><b>${P(today.f || 0)}</b><span>مرور امروز</span></div>
                <div class="pg-card"><b>${P(dueNow)}</b><span>سررسید مرور</span></div>
                <div class="pg-card"><b>${P(mastered)}</b><span>کارت مسلط</span></div>
                <div class="pg-card"><b>${P(streak)}</b><span>روز پیاپی فعالیت 🔥</span></div>
            </div>
            <h3 class="pg-title">۷ روز اخیر</h3>
            <div class="pg-chart">${bars}</div>
            <div class="pg-legend"><span><i class="lg-right"></i> بلدم</span><span><i class="lg-wrong"></i> سایر</span><span>🌙 کارت شبانه: ${P(s.nightCards || 0)}</span></div>
            <h3 class="pg-title">تسلط به تفکیک قانون</h3>
            ${lawHtml}
            <div class="pg-actions">
                <button type="button" class="fc-btn fc-btn-primary" id="pg-due">🃏 مرور امروز</button>
                <button type="button" class="fc-btn" id="pg-hard">🔥 سخت‌ها (${P(hard)})</button>
                <button type="button" class="fc-btn" id="pg-night">🌙 مرور شبانه</button>
                <button type="button" class="fc-btn fc-btn-outline" id="pg-reset">پاک‌کردن آمار</button>
            </div>`;
        const openFlash = (law, mode) => { goTab('tab-flashcards'); window.ilhFlash && window.ilhFlash.open(law, mode); };
        root.querySelectorAll('[data-open-law]').forEach(b => b.addEventListener('click', () => openFlash(b.dataset.openLaw, 'all')));
        document.getElementById('pg-due').addEventListener('click', () => openFlash('all', 'due'));
        document.getElementById('pg-hard').addEventListener('click', () => openFlash('all', 'hard'));
        document.getElementById('pg-night').addEventListener('click', () => openNight());
        document.getElementById('pg-reset').addEventListener('click', () => {
            if (confirm('آمار روزانه‌ی مرور پاک شود؟ (جعبه‌های فلش‌کارت، نشان‌شده‌ها و یادداشت‌ها دست‌نخورده می‌ماند)')) {
                localStorage.removeItem(STATS_KEY); renderProgressPage(); showToast('آمار پاک شد');
            }
        });
    }

    // ----- مرور شبانه -----
    let nightEl = null;
    function openNight(preset) {
        if (!nightEl) buildNightOverlay();
        nightEl.hidden = false;
        document.body.classList.add('night-open');
        showNightStart();
        if (preset === 'bookmarks' && getBookmarks().length) startNight('bookmarks');
    }
    function buildNightOverlay() {
        nightEl = document.createElement('div');
        nightEl.id = 'night-review';
        nightEl.className = 'night-review';
        nightEl.hidden = true;
        nightEl.setAttribute('role', 'dialog');
        nightEl.setAttribute('aria-modal', 'true');
        nightEl.setAttribute('aria-label', 'مرور شبانه');
        nightEl.innerHTML = `
            <div class="nr-top">
                <button type="button" class="nr-close" aria-label="بستن">✕</button>
                <span class="nr-counter" id="nr-counter"></span>
            </div>
            <div class="nr-stage" id="nr-stage"></div>`;
        document.body.appendChild(nightEl);
        nightEl.querySelector('.nr-close').addEventListener('click', closeNight);
        document.addEventListener('keydown', (e) => {
            if (nightEl.hidden) return;
            if (e.key === 'Escape') closeNight();
            if ((e.key === ' ' || e.key === 'Enter') && nr.phase === 'card' && !nr.revealed) { e.preventDefault(); revealNight(); }
        });
    }
    const nr = { queue: [], total: 0, done: 0, reviewed: 0, revealed: false, phase: 'start', timer: null, timerMin: parseInt(lsGet('ilh-night-timer'), 10) || 0, wake: null };
    function stageEl() { return document.getElementById('nr-stage'); }
    function showNightStart() {
        nr.phase = 'start';
        document.getElementById('nr-counter').textContent = '';
        const nb = getBookmarks().length;
        stageEl().innerHTML = `
            <div class="nr-start">
                <div class="nr-moon">🌙</div>
                <h2>مرور شبانه</h2>
                <p>صفحه‌ی تیره و کم‌نور با متن درشت. روی کارت بزن تا شرح ماده را ببینی؛ «بلدم» کارت را کنار می‌گذارد و «دوباره» آخر صف برش می‌گرداند.</p>
                <button type="button" class="nr-btn primary" id="nr-src-bm" ${nb ? '' : 'disabled'}>⭐ نشان‌شده‌ها (${toPersianNumerals(nb)})</button>
                <button type="button" class="nr-btn" id="nr-src-rand">🎲 ۱۵ ماده‌ی تصادفی</button>
                <div class="nr-timer-row"><span>خاموشی خودکار:</span>
                    <div class="chip-group nr-chips" id="nr-timer-chips">
                        <button type="button" class="chip" data-min="0">ندارد</button>
                        <button type="button" class="chip" data-min="10">۱۰ دقیقه</button>
                        <button type="button" class="chip" data-min="20">۲۰ دقیقه</button>
                    </div>
                </div>
                ${nb ? '' : '<small>هنوز ماده‌ای نشان نکرده‌ای؛ با ⭐ روی هر ماده می‌توانی مجموعه‌ی خودت را بسازی.</small>'}
            </div>`;
        const chips = stageEl().querySelectorAll('#nr-timer-chips .chip');
        const mark = () => chips.forEach(c => c.classList.toggle('active', parseInt(c.dataset.min, 10) === nr.timerMin));
        chips.forEach(c => c.addEventListener('click', () => { nr.timerMin = parseInt(c.dataset.min, 10); try { localStorage.setItem('ilh-night-timer', nr.timerMin); } catch (e) { /* */ } mark(); }));
        mark();
        document.getElementById('nr-src-bm').addEventListener('click', () => startNight('bookmarks'));
        document.getElementById('nr-src-rand').addEventListener('click', () => startNight('random'));
    }
    function randomArticles(n) {
        const all = [];
        if (isDataLoaded) {
            for (const k in allLawsData) {
                if (lawManifest[k] && lawManifest[k].suspect) continue;
                const w = (lawManifest[k] && lawManifest[k].article_word) || 'ماده';
                (allLawsData[k] || []).forEach(f => {
                    (function walk(divs) {
                        (divs || []).forEach(d => {
                            (d.articles || []).forEach(a => {
                                const txt = (a.text || a.description || '').trim();
                                if (a.article_number && txt.length >= 60 && !isRepealedText(txt)) all.push({ id: k + '#' + a.article_number, label: `${w} ${toPersianNumerals(a.article_number)}`, lawTitle: lawManifest[k].title, text: txt });
                            });
                            walk(d.subdivisions);
                        });
                    })(f.data && f.data.divisions);
                });
            }
        }
        return shuffleArr(all).slice(0, n);
    }
    function shuffleArr(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
    async function startNight(source) {
        let q = [];
        if (source === 'bookmarks') q = shuffleArr(getBookmarks().map(b => ({ id: b.id, label: b.label, lawTitle: b.lawTitle, text: b.text })));
        else q = randomArticles(15);
        if (!q.length) { showToast('هنوز داده‌ای برای مرور آماده نیست؛ چند ثانیه بعد دوباره بزن'); return; }
        nr.queue = q; nr.total = q.length; nr.done = 0; nr.reviewed = 0;
        try { if ('wakeLock' in navigator) nr.wake = await navigator.wakeLock.request('screen'); } catch (e) { nr.wake = null; }
        clearTimeout(nr.timer);
        if (nr.timerMin) nr.timer = setTimeout(sleepNight, nr.timerMin * 60000);
        showNightCard();
    }
    function showNightCard() {
        if (!nr.queue.length) return finishNight();
        nr.phase = 'card'; nr.revealed = false;
        const c = nr.queue[0];
        document.getElementById('nr-counter').textContent = `${toPersianNumerals(nr.done)} از ${toPersianNumerals(nr.total)}`;
        stageEl().innerHTML = `
            <div class="nr-card" id="nr-card" tabindex="0">
                <div class="nr-label">${c.label}</div>
                <div class="nr-law">${c.lawTitle}</div>
                <div class="nr-text" id="nr-text" style="display:none;"></div>
                <div class="nr-hint" id="nr-hint">برای دیدن شرح ماده بزنید</div>
            </div>
            <div class="nr-actions" id="nr-actions" style="visibility:hidden;">
                <button type="button" class="nr-btn" id="nr-again">دوباره</button>
                <button type="button" class="nr-btn primary" id="nr-know">بلدم ✓</button>
            </div>`;
        document.getElementById('nr-card').addEventListener('click', revealNight);
        document.getElementById('nr-again').addEventListener('click', () => { nr.queue.push(nr.queue.shift()); nr.reviewed++; showNightCard(); });
        document.getElementById('nr-know').addEventListener('click', () => { nr.queue.shift(); nr.done++; nr.reviewed++; showNightCard(); });
    }
    function revealNight() {
        if (nr.phase !== 'card' || nr.revealed) return;
        nr.revealed = true;
        const c = nr.queue[0];
        const t = document.getElementById('nr-text');
        t.innerHTML = toPersianNumerals(formatText(c.text));
        t.style.display = 'block';
        document.getElementById('nr-hint').style.display = 'none';
        document.getElementById('nr-actions').style.visibility = 'visible';
    }
    function finishNight() {
        nr.phase = 'done';
        document.getElementById('nr-counter').textContent = '';
        recordNightReview(nr.reviewed);
        releaseWake();
        clearTimeout(nr.timer);
        stageEl().innerHTML = `<div class="nr-start"><div class="nr-moon">✨</div><h2>مرور تمام شد</h2>
            <p>${toPersianNumerals(nr.total)} کارت را مرور کردی. شب‌ات به‌خیر!</p>
            <button type="button" class="nr-btn primary" id="nr-again-all">مرور دوباره</button>
            <button type="button" class="nr-btn" id="nr-exit">خروج</button></div>`;
        document.getElementById('nr-again-all').addEventListener('click', showNightStart);
        document.getElementById('nr-exit').addEventListener('click', closeNight);
    }
    function sleepNight() {
        if (!nightEl || nightEl.hidden) return;
        nightEl.classList.add('sleeping');
        stageEl().innerHTML = '<div class="nr-start"><div class="nr-moon">😴</div><h2>شب‌بخیر</h2></div>';
        setTimeout(closeNight, 2200);
    }
    function releaseWake() { try { if (nr.wake) { nr.wake.release(); } } catch (e) { /* */ } nr.wake = null; }
    function closeNight() {
        if (!nightEl) return;
        if (nr.phase === 'card' && nr.reviewed) recordNightReview(nr.reviewed);
        nr.phase = 'start';
        clearTimeout(nr.timer); releaseWake();
        nightEl.classList.remove('sleeping');
        nightEl.hidden = true;
        document.body.classList.remove('night-open');
        if (document.getElementById('tab-progress').classList.contains('active')) renderProgressPage();
    }
    document.addEventListener('visibilitychange', () => { if (!document.hidden && nr.phase === 'card' && nightEl && !nightEl.hidden && !nr.wake && 'wakeLock' in navigator) navigator.wakeLock.request('screen').then(w => { nr.wake = w; }).catch(() => {}); });

    // ----- تنظیمات: تعداد سؤال -----

    // ----- PWA: نصب و دانلود آفلاین -----
    let deferredInstall = null;
    const isStandalone = () => (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
    const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
    function updateInstallUI() {
        const btn = document.getElementById('pwa-install-btn'), hint = document.getElementById('pwa-install-hint');
        if (!btn || !hint) return;
        if (isStandalone()) { btn.style.display = 'none'; hint.textContent = 'برنامه روی دستگاه شما نصب است ✓'; return; }
        btn.style.display = '';
        if (deferredInstall) { btn.textContent = 'نصب روی دستگاه'; hint.textContent = 'مثل یک برنامه‌ی مستقل، بدون نوار مرورگر باز می‌شود.'; }
        else if (isIOS()) { btn.textContent = 'راهنمای نصب'; hint.textContent = 'در Safari: دکمه‌ی اشتراک‌گذاری ← «افزودن به صفحه‌ی اصلی».'; }
        else { btn.textContent = 'راهنمای نصب'; hint.textContent = 'از منوی مرورگر گزینه‌ی «نصب برنامه / Add to Home screen» را بزنید.'; }
    }
    function setupPWA() {
        window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; updateInstallUI(); });
        window.addEventListener('appinstalled', () => { deferredInstall = null; updateInstallUI(); showToast('برنامه نصب شد ✅'); });
        const btn = document.getElementById('pwa-install-btn');
        if (btn) btn.addEventListener('click', async () => {
            if (deferredInstall) { deferredInstall.prompt(); try { await deferredInstall.userChoice; } catch (e) { /* */ } deferredInstall = null; updateInstallUI(); }
            else showToast(document.getElementById('pwa-install-hint').textContent);
        });
        updateInstallUI();

        const dl = document.getElementById('offline-download-btn'), status = document.getElementById('offline-status');
        const prog = document.getElementById('offline-progress'), fill = document.getElementById('offline-progress-fill');
        if (!('serviceWorker' in navigator) || !dl) { if (dl) { dl.disabled = true; status.textContent = 'مرورگر شما از حالت آفلاین پشتیبانی نمی‌کند.'; } return; }
        navigator.serviceWorker.addEventListener('message', (e) => {
            const m = e.data || {};
            if (m.type === 'CACHE_PROGRESS') { prog.style.display = 'block'; fill.style.width = (m.total ? Math.round(m.done / m.total * 100) : 0) + '%'; status.textContent = `در حال دانلود… ${toPersianNumerals(m.done)} از ${toPersianNumerals(m.total)}`; dl.disabled = true; }
            if (m.type === 'CACHE_DONE') { prog.style.display = 'none'; dl.disabled = false; status.textContent = `همه‌ی ${toPersianNumerals(m.total)} فایل قانون آفلاین ذخیره شد ✓`; showToast('آماده‌ی استفاده‌ی آفلاین ✅'); }
            if (m.type === 'CACHE_ERROR') { prog.style.display = 'none'; dl.disabled = false; status.textContent = 'دانلود کامل نشد؛ اتصال را بررسی و دوباره امتحان کن.'; }
            if (m.type === 'CACHE_STATUS') { status.textContent = m.total ? (m.have === m.total ? `همه‌ی قوانین آفلاین ذخیره شده است ✓` : `${toPersianNumerals(m.have)} از ${toPersianNumerals(m.total)} فایل آفلاین است`) : ''; }
        });
        dl.addEventListener('click', () => {
            const sw = navigator.serviceWorker.controller;
            if (!sw) { showToast('سرویس آفلاین هنوز فعال نشده؛ یک‌بار صفحه را تازه کن'); return; }
            sw.postMessage({ type: 'CACHE_ALL' });
        });
        navigator.serviceWorker.ready.then(reg => { if (reg.active) reg.active.postMessage({ type: 'CACHE_STATUS' }); }).catch(() => {});
        // اعلان نسخه‌ی جدید
        const hadController = !!navigator.serviceWorker.controller;
        navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController) showToast('نسخه‌ی جدید برنامه آماده شد؛ صفحه را یک‌بار ببند و باز کن'); });
    }

    // ----- میان‌برها و پارامترهای آدرس -----
    function setupFeatureButtons() {
        const nb = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
        nb('sidebar-night-btn', () => { closeSidebar(); openNight(); });
        nb('dash-night-btn', () => openNight());
        nb('bookmarks-night-btn', () => openNight('bookmarks'));
    }
    function applyUrlParams() {
        const p = new URLSearchParams(location.search);
        const tab = p.get('tab');
        if (tab && document.getElementById('tab-' + tab)) {
            goTab('tab-' + tab);
        }
        if (tab === 'flashcards' && window.ilhFlash && ['due', 'all', 'starred', 'hard'].includes(p.get('mode'))) window.ilhFlash.setMode(p.get('mode'));
        if (p.get('night') === '1') openNight();
    }

    // ----- ۱۲. جایگزینی ظاهر <select> با یک منوی کشویی هم‌رنگ با رابط کاربری پروژه -----
    // نسخه‌ی native (برای مقدار/رویداد change) پنهان می‌ماند؛ کل منطق موجود دست‌نخورده کار می‌کند.
    function enhanceSelect(selectEl) {
        if (!selectEl || selectEl.dataset.enhanced) return;
        selectEl.dataset.enhanced = '1';

        const wrapper = document.createElement('div');
        wrapper.className = 'ilh-select';
        selectEl.parentNode.insertBefore(wrapper, selectEl);
        wrapper.appendChild(selectEl);
        selectEl.classList.add('ilh-select-native');
        selectEl.setAttribute('tabindex', '-1');
        selectEl.setAttribute('aria-hidden', 'true');

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'ilh-select-trigger';
        trigger.innerHTML = `<span class="ilh-select-trigger-label"></span><span class="ilh-select-trigger-chev">${ICONS.chevron}</span>`;
        wrapper.appendChild(trigger);

        const panel = document.createElement('div');
        panel.className = 'ilh-select-panel';
        panel.setAttribute('role', 'listbox');
        wrapper.appendChild(panel);

        function renderOptions() {
            panel.innerHTML = '';
            [...selectEl.options].forEach(opt => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'ilh-select-option' + (opt.value === selectEl.value ? ' selected' : '');
                item.textContent = opt.textContent;
                item.addEventListener('click', () => {
                    if (selectEl.value !== opt.value) {
                        selectEl.value = opt.value;
                        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    closePanel();
                });
                panel.appendChild(item);
            });
            const current = selectEl.options[selectEl.selectedIndex];
            trigger.querySelector('.ilh-select-trigger-label').textContent = current ? current.textContent : '';
        }

        function openPanel() { wrapper.classList.add('open'); renderOptions(); }
        function closePanel() { wrapper.classList.remove('open'); }

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            wrapper.classList.contains('open') ? closePanel() : openPanel();
        });
        document.addEventListener('click', (e) => { if (!wrapper.contains(e.target)) closePanel(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });

        renderOptions();
        // اگر گزینه‌های select بعداً به‌صورت پویا جایگزین شوند (مثلاً پر شدن لیست قوانین)،
        // این دیدبان خودکار دکمه و پنل را به‌روز می‌کند — نیازی به تغییر کد دیگر نیست.
        new MutationObserver(renderOptions).observe(selectEl, { childList: true });
    }
    enhanceSelect(document.getElementById('flashcard-law-select'));

    // ----- داشبورد (صفحه‌ی اصلی) -----
    function refreshDashboard() {
        const lawKeys = Object.keys(lawManifest);
        const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        set('dash-stat-laws', toPersianNumerals(lawKeys.length));
        set('dash-stat-bookmarks', toPersianNumerals(getBookmarks().length));
        set('dash-stat-notes', toPersianNumerals(Object.keys(getNotes()).length));
        if (isDataLoaded) {
            let total = 0;
            for (const k in allLawsData) (allLawsData[k] || []).forEach(f => {
                (function count(divs) { (divs || []).forEach(d => { total += (d.articles || []).length; count(d.subdivisions); }); })(f.data && f.data.divisions);
            });
            set('dash-stat-articles', toPersianNumerals(total));
        }
    }
    function setupDashboard() {
        const countEl = document.getElementById('dash-law-count');
        const listEl = document.getElementById('dash-law-list');
        if (!countEl || !listEl) return;
        const keys = Object.keys(lawManifest);
        countEl.innerHTML = `در حال حاضر <strong>${toPersianNumerals(keys.length)}</strong> قانون در این مجموعه گنجانده شده است. برای ورود به هر قانون روی آن بزنید:`;
        listEl.innerHTML = keys.map(k => `<button type="button" class="dash-law-card tab-link" data-tab="${k}"><span>${lawManifest[k].title}</span></button>`).join('');
        refreshDashboard();
        const t = setInterval(() => { if (isDataLoaded) { clearInterval(t); refreshDashboard(); } }, 500);
    }

    // ----- افکت لمس/کلیک (Ripple) -----
    document.addEventListener('pointerdown', (e) => {
        const target = e.target.closest('.division-title, .file-group > span, .article-head, .sidebar-item, .dash-law-card, .dash-quick-btn, .dash-stat-btn');
        if (!target || e.target.closest('.art-action-btn')) return;
        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.6;
        const r = document.createElement('span');
        r.className = 'ripple';
        r.style.width = r.style.height = size + 'px';
        r.style.left = (e.clientX - rect.left - size / 2) + 'px';
        r.style.top = (e.clientY - rect.top - size / 2) + 'px';
        target.classList.add('has-ripple');
        target.appendChild(r);
        setTimeout(() => r.remove(), 650);
    }, { passive: true });

    createInitialSkeletons();
    setupDashboard();
    loadAllDataForSearch();
    setupAboutDialog();
    setupFlashcards();
    setupPWA();
    setupFeatureButtons();
    applyUrlParams();

    // ----- ۱۱. ثبت Service Worker برای پشتیبانی آفلاین (PWA) -----
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(err => console.warn('ثبت Service Worker ناموفق بود:', err));
        });
    }
});
// ===== پایان کد کامل و نهایی script.js =====
