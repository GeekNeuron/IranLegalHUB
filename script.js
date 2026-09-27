// ===== شروع کد نهایی script.js (بدون ابزارها + با انیمیشن نرم) =====

// 0. آیکون‌های SVG داخلی (جایگزین Font Awesome، بدون وابستگی به CDN)
const ICONS = {
    book: '<span class="icon-inline"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></span>',
    chevron: '<span class="icon-inline icon-chevron"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg></span>',
    spinner: '<span class="icon-inline icon-spin"><svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg></span>',
    copy: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
    share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"></line><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"></line></svg>'
};

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

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const searchInput = document.getElementById('search-input');

    // ----- متغیرهای مدیریت داده‌ها و جستجو -----
    let allLawsData = {}; 
    let isDataLoaded = false; 

    // ----- 0. ساخت پویای فهرست قوانین در سایدبار -----
    function renderSidebarLawsList() {
        const listEl = document.getElementById('sidebar-laws-list');
        if (!listEl || typeof lawManifest === 'undefined') return;
        let html = '';
        for (const key in lawManifest) {
            html += `<button type="button" class="sidebar-item sidebar-sublink tab-link" data-tab="${key}">
                        <span class="sidebar-item-label">${lawManifest[key].title}</span>
                     </button>`;
        }
        listEl.innerHTML = html;
        // اولین قانون به‌صورت پیش‌فرض فعال باشد
        const firstLink = listEl.querySelector('.tab-link');
        if (firstLink) firstLink.classList.add('active');
        const firstTabId = firstLink ? firstLink.dataset.tab : null;
        if (firstTabId) {
            const firstTabContent = document.getElementById(firstTabId);
            if (firstTabContent) firstTabContent.classList.add('active');
        }
        // چون این گروه به‌صورت پیش‌فرض باز است، ارتفاعش را برابر با محتوایش می‌کنیم (بدون انیمیشن)
        const lawsGroup = document.getElementById('sidebar-group-laws');
        if (lawsGroup && lawsGroup.classList.contains('expanded')) {
            listEl.style.height = 'auto';
        }
    }
    renderSidebarLawsList();

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
    const savedTheme = localStorage.getItem('ilh-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeSwitch) themeSwitch.checked = true;
    }
    if (themeSwitch) {
        themeSwitch.addEventListener('change', () => {
            document.body.classList.toggle('dark-theme', themeSwitch.checked);
            localStorage.setItem('ilh-theme', themeSwitch.checked ? 'dark' : 'light');
        });
    }

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

        tab.classList.add('active');
        const targetId = tab.dataset.tab;
        const targetTab = document.getElementById(targetId);
        if (targetTab) targetTab.classList.add('active');

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
                            <button type="button" class="art-action-btn art-copy-btn" data-scope="file" title="کپی کل متن این فایل">${ICONS.copy}</button>
                            <button type="button" class="art-action-btn art-share-btn" data-scope="file" title="اشتراک‌گذاری این قانون">${ICONS.share}</button>
                        </span>
                    </span>
                    <div class="content-container"></div>
                `;
                mainUl.appendChild(fileLi);
            });
        }
        container.appendChild(mainUl);
    }

    // ----- 4.5 ساخت متن کامل یک فایل قانون برای کپی/اشتراک‌گذاری -----
    function buildFullFileText(lawKey, path) {
        const lawInfo = lawManifest[lawKey];
        const cached = (allLawsData[lawKey] || []).find(f => f.fileInfo.path === path);
        if (!cached || !cached.data || !cached.data.divisions) return null;
        const lines = [];
        lines.push(lawInfo.title);
        lines.push('');
        function walk(divisions) {
            divisions.forEach(div => {
                if (div.title) { lines.push(div.title); lines.push(''); }
                if (div.articles) {
                    div.articles.forEach(art => {
                        const label = art.article_number ? `${lawInfo.article_word} ${art.article_number}` : '';
                        lines.push(label ? `${label}: ${art.text || art.description || ''}` : (art.text || art.description || ''));
                        lines.push('');
                    });
                }
                if (div.subdivisions) walk(div.subdivisions);
            });
        }
        walk(cached.data.divisions);
        lines.push('— برگرفته از کانون حقوقی ایران');
        return lines.join('\n');
    }

    // ----- 5. هندل کردن کلیک‌ها -----
    mainContent.addEventListener('click', async (e) => {
        // ----- کلیک روی دکمه‌های کپی / اشتراک‌گذاری (ماده یا کل فایل) -----
        const actionBtn = e.target.closest('.art-action-btn');
        if (actionBtn) {
            e.preventDefault();
            e.stopPropagation();

            const scope = actionBtn.dataset.scope; // 'file' برای کل قانون، وگرنه یک ماده است
            const isCopy = actionBtn.classList.contains('art-copy-btn');

            if (scope === 'file') {
                const fileLi = actionBtn.closest('.file-group');
                const lawKey = fileLi.dataset.lawKey;
                const path = fileLi.dataset.path;
                const lawInfo = lawManifest[lawKey];
                let fullText = buildFullFileText(lawKey, path);
                if (!fullText) {
                    // اگر هنوز ایندکس نشده، مستقیماً از سرور بگیر
                    try {
                        const res = await fetch(path);
                        const data = await res.json();
                        allLawsData[lawKey] = allLawsData[lawKey] || [];
                        allLawsData[lawKey].push({ lawKey, fileInfo: { path }, data: data.divisions ? data : { divisions: [] } });
                        fullText = buildFullFileText(lawKey, path);
                    } catch (err) { /* بی‌اهمیت */ }
                }
                if (!fullText) { showToast('هنوز متن آماده نیست، کمی صبر کنید'); return; }
                if (isCopy) copyPlainText(fullText);
                else sharePlainText(lawInfo.title, fullText);
            } else {
                const articleEl = actionBtn.closest('.article, .search-result-item');
                if (!articleEl) return;
                const lawTitle = articleEl.dataset.lawTitle || '';
                const label = articleEl.dataset.articleLabel || '';
                const rawText = articleEl.dataset.rawText || '';
                const fullText = `${lawTitle}${label ? ' - ' + label : ''}\n\n${rawText}\n\n— کانون حقوقی ایران`;
                if (isCopy) copyPlainText(fullText);
                else sharePlainText(`${lawTitle} - ${label}`, fullText);
            }
            return;
        }

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
            renderDivisionsRecursive(divisionsList, ul, lawInfo);
            container.appendChild(ul);
        } else {
            container.innerHTML = '<div class="tool-padding">ساختار فایل نامعتبر است یا خالی است.</div>';
        }
    }

    function renderDivisionsRecursive(divisions, containerUl, lawInfo) {
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
                renderDivisionsRecursive(div.subdivisions, subUl, lawInfo);
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
                    articleDiv.innerHTML = `
                        <div class="article-head">
                            ${headerText}
                            <span class="article-actions">
                                <button type="button" class="art-action-btn art-copy-btn" title="کپی متن این ماده">${ICONS.copy}</button>
                                <button type="button" class="art-action-btn art-share-btn" title="اشتراک‌گذاری این ماده">${ICONS.share}</button>
                            </span>
                        </div>
                        <div class="article-body">${toPersianNumerals(formatText(rawText))}</div>
                    `;
                    // ذخیره متن خام (بدون HTML) برای کپی/اشتراک‌گذاری دقیق
                    articleDiv.dataset.lawTitle = lawInfo.title || '';
                    articleDiv.dataset.articleLabel = plainLabel;
                    articleDiv.dataset.rawText = rawText;
                    childContainer.appendChild(articleDiv);
                });
            }

            li.appendChild(childContainer);
            containerUl.appendChild(li);
        });
    }

    // ----- 7. انیمیشن آکاردئون (نسخه اصلاح شده و نرم) -----
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
            element.addEventListener('transitionend', function handler() {
                element.style.height = 'auto';
                element.removeEventListener('transitionend', handler);
            }, { once: true });
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
                                const artNum = String(article.article_number || '').toLowerCase();
                                const artText = (article.text || article.description || '').toLowerCase();
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
                 resultCount.style.padding = '10px';
                 resultCount.style.backgroundColor = '#e8f5e9';
                 resultsContainer.appendChild(resultCount);
            } else {
                if(term.length > 1) resultsContainer.innerHTML = '<p style="padding:10px;">موردی یافت نشد.</p>';
            }

            const regex = new RegExp(term, 'gi');

            relevantResults.forEach(res => {
                const resDiv = document.createElement('div');
                resDiv.className = 'search-result-item'; 
                resDiv.style.background = '#fff';
                resDiv.style.border = '1px solid #ddd';
                resDiv.style.padding = '15px';
                resDiv.style.marginBottom = '10px';
                resDiv.style.borderRadius = '5px';
                resDiv.style.lineHeight = '1.8';

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
                        <div class="result-path" style="font-size:0.8em; color:#666;">${toPersianNumerals(res.path.join(' > '))}</div>
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
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        document.querySelectorAll('.tab-content').forEach(tc => {
             const resultsContainer = tc.querySelector('.search-results-container');
             const articlesContainer = tc.querySelector('.articles-container');
             if (!resultsContainer || !articlesContainer) return; // تب‌هایی مثل فلش‌کارت جستجو ندارند
             if (searchTerm.length > 1) {
                 articlesContainer.style.display = 'none';
                 resultsContainer.style.display = 'block';
                 if (!isDataLoaded) {
                    resultsContainer.innerHTML = '<p>در حال آماده‌سازی دیتابیس جستجو...</p>';
                 } else {
                    performSearch(searchTerm);
                 }
             } else {
                 hideSearchResults();
             }
        });
    });

    // ----- 9. دیالوگ «درباره» -----
    function setupAboutDialog() {
        const aboutBtn = document.getElementById('sidebar-about-btn');
        const aboutDialog = document.getElementById('about-dialog');
        const aboutCloseBtn = document.getElementById('about-close-btn');
        const countEl = document.getElementById('about-law-count');
        const listEl = document.getElementById('about-law-list');
        if (!aboutBtn || !aboutDialog) return;

        const lawTitles = Object.values(lawManifest).map(l => l.title);
        countEl.innerHTML = `در حال حاضر <strong>${toPersianNumerals(lawTitles.length)}</strong> قانون در این مجموعه گنجانده شده:`;
        listEl.innerHTML = lawTitles.map(t => `<span>${t}</span>`).join('');

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

    createInitialSkeletons();
    loadAllDataForSearch();
    setupAboutDialog();
    setupFlashcards();
});
// ===== پایان کد کامل و نهایی script.js =====
