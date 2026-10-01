// ===== شروع کد نهایی script.js (بدون ابزارها + با انیمیشن نرم) =====

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
    localStorage.setItem('ilh-bookmarks', JSON.stringify(list));
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
    localStorage.setItem('ilh-notes', JSON.stringify(map));
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
    localStorage.setItem('ilh-recent-laws', JSON.stringify(list));
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
        // چون این گروه به‌صورت پیش‌فرض باز است، ارتفاعش را برابر با محتوایش می‌کنیم (بدون انیمیشن)
        const lawsGroup = document.getElementById('sidebar-group-laws');
        const lawsSubmenu = document.getElementById('sidebar-laws-list');
        if (lawsGroup && lawsGroup.classList.contains('expanded') && lawsSubmenu) {
            lawsSubmenu.style.height = 'auto';
        }
    }
    renderSidebarLawsList();
    updateBookmarksBadge();
    updateNotesBadge();

    // گروه «ابزارهای مطالعه» هم به‌صورت پیش‌فرض باز است
    const studyGroup = document.getElementById('sidebar-group-study');
    if (studyGroup && studyGroup.classList.contains('expanded')) {
        const studySubmenu = studyGroup.querySelector('.sidebar-submenu');
        if (studySubmenu) studySubmenu.style.height = 'auto';
    }

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
    let fontScale = parseFloat(localStorage.getItem('ilh-font-scale')) || 1;
    function applyFontScale(scale) {
        scale = Math.min(1.3, Math.max(0.85, Math.round(scale * 100) / 100));
        fontScale = scale;
        mainContent.style.fontSize = scale + 'em';
        localStorage.setItem('ilh-font-scale', scale);
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
        if (targetId === 'tab-quiz') initQuizTab();
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
                            <div class="article-body">${toPersianNumerals(formatText(rawText))}</div>
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

        if (isExpanded) {
            // انیمیشن بستن
            element.style.height = element.scrollHeight + 'px';
            
            // استفاده از requestAnimationFrame برای اطمینان از اعمال استایل قبل از تغییر به صفر
            requestAnimationFrame(() => {
                element.style.height = '0px';
            });
            
            parentLi.classList.remove('expanded');
        } else {
            // انیمیشن باز کردن
            parentLi.classList.add('expanded');
            element.style.height = element.scrollHeight + 'px';
            
            // وقتی انیمیشن تمام شد، ارتفاع را auto کن تا اگر محتوا تغییر کرد اسکرول نخورد
            element.addEventListener('transitionend', function handler(ev) {
                if (ev.target !== element || ev.propertyName !== 'height') return;
                element.style.height = 'auto';
                element.removeEventListener('transitionend', handler);
            });
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

            const regex = new RegExp(escapeRegex(term), 'gi');

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
        const regex = new RegExp(escapedTerm, 'gi');
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
        const scope = searchScopeSelect ? searchScopeSelect.value : 'all';

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
    if (searchScopeSelect) {
        searchScopeSelect.addEventListener('change', () => {
            if (searchInput.value.trim().length > 1) runSearch();
        });
    }

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
    function setupFlashcards() {
        const lawSelect = document.getElementById('flashcard-law-select');
        const card = document.getElementById('flashcard');
        const frontText = document.getElementById('flashcard-front-text');
        const backText = document.getElementById('flashcard-back-text');
        const nextBtn = document.getElementById('flashcard-next-btn');
        const knowBtn = document.getElementById('flashcard-know-btn');
        const boxBtn = document.getElementById('flashcard-box-btn');
        const boxCountEl = document.getElementById('flashcard-box-count');
        const boxView = document.getElementById('flashcard-box-view');
        const boxList = document.getElementById('flashcard-box-list');
        const boxCloseBtn = document.getElementById('flashcard-box-close');
        const stage = document.getElementById('flashcard-stage');
        const actions = document.querySelector('.flashcard-actions');
        if (!lawSelect || !card) return;

        const STORAGE_KEY = 'ilh_flashcard_known_box_v1';
        let allCards = [];       // { id, lawTitle, articleWord, articleNumber, text }
        let pool = [];           // کارت‌های فعلی بر اساس فیلتر قانون انتخابی
        let currentCard = null;

        function loadKnownBox() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                return raw ? JSON.parse(raw) : {};
            } catch (e) { return {}; }
        }
        function saveKnownBox(box) {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(box)); } catch (e) { /* بی‌اهمیت */ }
        }
        let knownBox = loadKnownBox();

        function updateBoxCount() {
            boxCountEl.textContent = toPersianNumerals(Object.keys(knownBox).length);
        }

        // پرکردن منوی انتخاب قانون
        Object.keys(lawManifest).forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = lawManifest[key].title;
            lawSelect.appendChild(opt);
        });

        function buildCardsFromLoadedData() {
            allCards = [];
            for (const lawKey in allLawsData) {
                const lawInfo = lawManifest[lawKey];
                if (!lawInfo) continue;
                allLawsData[lawKey].forEach(fileData => {
                    function walk(divisions) {
                        divisions.forEach(div => {
                            if (div.articles) {
                                div.articles.forEach(art => {
                                    if (!art.article_number || !(art.text || art.description)) return;
                                    allCards.push({
                                        id: `${lawKey}::${fileData.fileInfo.path}::${art.article_number}`,
                                        lawKey,
                                        lawTitle: lawInfo.title,
                                        articleWord: lawInfo.article_word || 'ماده',
                                        articleNumber: art.article_number,
                                        text: art.text || art.description || ''
                                    });
                                });
                            }
                            if (div.subdivisions) walk(div.subdivisions);
                        });
                    }
                    if (fileData.data && fileData.data.divisions) walk(fileData.data.divisions);
                });
            }
        }

        function refreshPool() {
            const selected = lawSelect.value;
            pool = allCards.filter(c => (selected === 'all' || c.lawKey === selected) && !knownBox[c.id]);
        }

        function showEmptyState(message) {
            frontText.textContent = message;
            backText.textContent = '';
            card.classList.remove('flipped');
            currentCard = null;
        }

        function fitFace(face, max, min) {
            if (!face || !face.clientHeight) return;
            let fs = max;
            face.style.fontSize = fs + 'px';
            while (fs > min && face.scrollHeight > face.clientHeight + 1) { fs -= 1; face.style.fontSize = fs + 'px'; }
        }
        function fitFlashcards() {
            fitFace(card.querySelector('.flashcard-front'), 30, 15);
            fitFace(card.querySelector('.flashcard-back'), 21, 12);
        }
        fitFlashcardsFn = fitFlashcards;
        window.addEventListener('resize', () => requestAnimationFrame(fitFlashcards));

        function drawNextCard() {
            refreshPool();
            card.classList.remove('flipped');
            if (pool.length === 0) {
                showEmptyState('کارتی برای این قانون باقی نمانده — همه را بلدید یا هنوز داده‌ها بارگذاری نشده!');
                return;
            }
            const idx = Math.floor(Math.random() * pool.length);
            currentCard = pool[idx];
            const isNum = !isNaN(parseInt(currentCard.articleNumber));
            const label = isNum ? toPersianNumerals(currentCard.articleNumber) : toPersianNumerals(currentCard.articleNumber);
            frontText.innerHTML = `${currentCard.articleWord} ${label}<br><span style="font-size:0.6em; opacity:0.85;">${currentCard.lawTitle}</span>`;
            backText.innerHTML = toPersianNumerals(formatText(currentCard.text));
            requestAnimationFrame(fitFlashcards);
        }

        card.addEventListener('click', () => {
            if (!currentCard) return;
            card.classList.toggle('flipped');
        });

        nextBtn.addEventListener('click', drawNextCard);

        knowBtn.addEventListener('click', () => {
            if (!currentCard) return;
            knownBox[currentCard.id] = {
                lawTitle: currentCard.lawTitle,
                articleWord: currentCard.articleWord,
                articleNumber: currentCard.articleNumber,
                text: currentCard.text
            };
            saveKnownBox(knownBox);
            updateBoxCount();
            drawNextCard();
        });

        lawSelect.addEventListener('change', () => {
            if (allCards.length === 0 && isDataLoaded) buildCardsFromLoadedData();
            drawNextCard();
        });

        function renderBox() {
            const entries = Object.entries(knownBox);
            if (entries.length === 0) {
                boxList.innerHTML = '<div class="flashcard-box-empty">جعبه هنوز خالیه — کارتی که بلد بودید را با دکمه «بلدم» به اینجا بفرستید.</div>';
                return;
            }
            boxList.innerHTML = entries.map(([id, c]) => {
                const isNum = !isNaN(parseInt(c.articleNumber));
                const label = toPersianNumerals(c.articleNumber);
                return `
                <div class="flashcard-box-item" data-id="${id}">
                    <div class="flashcard-box-item-head">
                        <span>${c.articleWord} ${label} — ${c.lawTitle}</span>
                        <button class="flashcard-box-remove" type="button" data-remove="${id}">حذف از جعبه</button>
                    </div>
                    <div class="flashcard-box-item-body">${toPersianNumerals(formatText(c.text))}</div>
                </div>`;
            }).join('');
        }

        boxBtn.addEventListener('click', () => {
            const showing = boxView.style.display !== 'none';
            if (showing) {
                boxView.style.display = 'none';
                stage.style.display = 'flex';
                actions.style.display = 'flex';
            } else {
                renderBox();
                boxView.style.display = 'block';
                stage.style.display = 'none';
                actions.style.display = 'none';
            }
        });
        boxCloseBtn.addEventListener('click', () => {
            boxView.style.display = 'none';
            stage.style.display = 'flex';
            actions.style.display = 'flex';
        });

        boxList.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('[data-remove]');
            if (removeBtn) {
                delete knownBox[removeBtn.dataset.remove];
                saveKnownBox(knownBox);
                updateBoxCount();
                renderBox();
                return;
            }
            const head = e.target.closest('.flashcard-box-item-head');
            if (head) {
                head.parentElement.classList.toggle('open');
            }
        });

        updateBoxCount();
        showEmptyState('در حال آماده‌سازی کارت‌ها...');

        // وقتی دیتابیس جستجو (که همه‌ی قوانین را می‌خواند) آماده شد، کارت‌ها را بساز
        const waitForData = setInterval(() => {
            if (isDataLoaded) {
                clearInterval(waitForData);
                buildCardsFromLoadedData();
                drawNextCard();
            }
        }, 400);
    }

    // ----- ۱۰. بخش آزمون -----
    function setupQuiz() {
        const lawSelect = document.getElementById('quiz-law-select');
        const scoreEl = document.getElementById('quiz-score');
        const emptyMsg = document.getElementById('quiz-empty-msg');
        const questionBox = document.getElementById('quiz-question-box');
        const questionText = document.getElementById('quiz-question-text');
        const optionsList = document.getElementById('quiz-options-list');
        const checkBtn = document.getElementById('quiz-check-btn');
        const nextBtn = document.getElementById('quiz-next-btn');
        const resultBox = document.getElementById('quiz-result-box');
        const resultText = document.getElementById('quiz-result-text');
        const restartBtn = document.getElementById('quiz-restart-btn');
        if (!lawSelect) return;

        let currentLawKey = null;
        let questions = [];
        let qIndex = 0;
        let correctCount = 0;
        let answered = false;
        let selectedIndex = null;

        function populateLawSelect() {
            const keysWithQuiz = Object.keys(lawManifest).filter(k => lawManifest[k].quiz && lawManifest[k].quiz.length > 0);
            lawSelect.innerHTML = '';
            if (keysWithQuiz.length === 0) {
                lawSelect.innerHTML = '<option value="">فعلاً سؤالی آماده نشده</option>';
                currentLawKey = null;
                return;
            }
            keysWithQuiz.forEach(k => {
                const opt = document.createElement('option');
                opt.value = k;
                opt.textContent = lawManifest[k].title;
                lawSelect.appendChild(opt);
            });
            currentLawKey = keysWithQuiz[0];
        }

        function updateScoreLabel() {
            scoreEl.textContent = `امتیاز: ${toPersianNumerals(correctCount)} از ${toPersianNumerals(qIndex + (answered ? 1 : 0))}`;
        }

        function showQuestion() {
            answered = false;
            selectedIndex = null;
            const q = questions[qIndex];
            questionText.textContent = `${toPersianNumerals(qIndex + 1)}. ${q.question}`;
            const opts = q.options || [];
            optionsList.innerHTML = '';
            opts.forEach((optText, i) => {
                const optEl = document.createElement('label');
                optEl.className = 'quiz-option';
                optEl.innerHTML = `<input type="radio" name="quiz-opt"> ${optText}`;
                optEl.addEventListener('click', () => {
                    if (answered) return;
                    optionsList.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
                    optEl.classList.add('selected');
                    optEl.querySelector('input').checked = true;
                    selectedIndex = i;
                });
                optionsList.appendChild(optEl);
            });
            checkBtn.style.display = 'inline-block';
            nextBtn.style.display = 'none';
            updateScoreLabel();
        }

        function startQuiz(lawKey) {
            currentLawKey = lawKey;
            questions = (lawKey && lawManifest[lawKey] && lawManifest[lawKey].quiz) ? lawManifest[lawKey].quiz : [];
            qIndex = 0;
            correctCount = 0;
            resultBox.style.display = 'none';
            if (questions.length === 0) {
                questionBox.style.display = 'none';
                emptyMsg.style.display = 'block';
                scoreEl.textContent = 'امتیاز: ۰ از ۰';
                return;
            }
            emptyMsg.style.display = 'none';
            questionBox.style.display = 'block';
            showQuestion();
        }

        checkBtn.addEventListener('click', () => {
            if (selectedIndex === null) { showToast('اول یک گزینه را انتخاب کنید'); return; }
            if (answered) return;
            answered = true;
            const q = questions[qIndex];
            const opts = q.options || [];
            const correctIdx = opts.findIndex(o => o === q.correctAnswer);
            optionsList.querySelectorAll('.quiz-option').forEach((el, i) => {
                if (i === correctIdx) el.classList.add('correct');
                else if (i === selectedIndex) el.classList.add('incorrect');
            });
            if (selectedIndex === correctIdx) correctCount++;
            updateScoreLabel();
            checkBtn.style.display = 'none';
            nextBtn.style.display = 'inline-block';
        });

        nextBtn.addEventListener('click', () => {
            qIndex++;
            if (qIndex >= questions.length) {
                questionBox.style.display = 'none';
                resultBox.style.display = 'block';
                resultText.textContent = `از ${toPersianNumerals(questions.length)} سؤال، ${toPersianNumerals(correctCount)} مورد را درست پاسخ دادید.`;
            } else {
                showQuestion();
            }
        });

        restartBtn.addEventListener('click', () => startQuiz(currentLawKey));
        lawSelect.addEventListener('change', () => startQuiz(lawSelect.value));

        populateLawSelect();
        if (currentLawKey) startQuiz(currentLawKey);
        else { questionBox.style.display = 'none'; emptyMsg.style.display = 'block'; }
    }
    function initQuizTab() { /* المان‌های آزمون در بارگذاری اولیه ساخته شده‌اند */ }

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
    enhanceSelect(document.getElementById('search-scope-select'));
    enhanceSelect(document.getElementById('quiz-law-select'));

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
    setupQuiz();

    // ----- ۱۱. ثبت Service Worker برای پشتیبانی آفلاین (PWA) -----
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(err => console.warn('ثبت Service Worker ناموفق بود:', err));
        });
    }
});
// ===== پایان کد کامل و نهایی script.js =====
