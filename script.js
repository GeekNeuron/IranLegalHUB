// ===== شروع کد کامل و نهایی script.js =====

// این تابع هر رشته‌ای را می‌گیرد و اعداد انگلیسی آن را به فارسی تبدیل می‌کند
function toPersianNumerals(str) {
    if (typeof str !== 'string' && typeof str !== 'number') return str;
    const persian = { '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹' };
    return String(str).replace(/[0-9]/g, (w) => persian[w]);
}

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const tabs = document.querySelectorAll('.tab-link');
    const searchInput = document.getElementById('search-input');
    const headerRight = document.querySelector('.header-right');

    // ----- متغیرهای جدید برای مدیریت داده‌ها و جستجو -----
    let allLawsData = {}; // برای ذخیره داده‌های تمام قوانین پس از بارگذاری
    let isDataLoaded = false; // فلگ برای اینکه بدانیم آیا داده‌ها یک‌بار بارگذاری شده‌اند یا نه
    
    // ----- 1. قابلیت: تغییر تم -----
    if (headerRight) {
        headerRight.addEventListener('click', (e) => {
            // جلوگیری از تغییر تم با کلیک روی بخش‌های دیگر هدر
            if (!e.target.closest('.search-container')) {
                document.body.classList.toggle('dark-theme');
            }
        });
    }

    // ----- 2. منطق زبانه‌ها (Tabs) -----
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetTab = document.getElementById(tab.dataset.tab);
            if(targetTab) targetTab.classList.add('active');
            // با تغییر تب، نتایج جستجو را پاک کن
            searchInput.value = '';
            hideSearchResults();
        });
    });
    
    // ----- 3. ایجاد اسکلت اولیه محتوا (اصلاح شده برای حذف آزمون) -----
    function createInitialSkeletons() {
        for (const key in lawManifest) {
            const law = lawManifest[key];
            const contentDiv = document.createElement('div');
            contentDiv.id = key;
            contentDiv.className = 'tab-content';
            
            contentDiv.innerHTML = `
                <p class="law-info">${law.info}</p>
                <div class="articles-container accordion"></div>
                <div class="search-results-container" style="display: none;"></div>
            `;
            mainContent.appendChild(contentDiv);

            renderMainAccordion(contentDiv.querySelector('.articles-container'), law, key);
        }
        if (document.querySelector('.tab-content')) {
            document.querySelector('.tab-content').classList.add('active');
        }
    }

    // ----- 4. ساخت اسکلت آکاردئون -----
function renderMainAccordion(container, law, lawKey) {
    const mainUl = document.createElement('ul');
    
    // رندر کردن فایل‌های قانون (این بخش بدون تغییر است)
    if (law.files && law.files.length > 0) {
        law.files.forEach(fileInfo => {
            const fileLi = document.createElement('li');
            fileLi.className = 'file-group has-children';
            fileLi.dataset.type = 'law-file';
            fileLi.dataset.path = fileInfo.path;
            fileLi.dataset.lawKey = lawKey;
            fileLi.innerHTML = `<span>${fileInfo.title}</span><div class="content-container"></div>`;
            mainUl.appendChild(fileLi);
        });
    }

    // >> شروع اصلاح: ساخت ساختار تو در تو برای ابزارها <<
    
    // 1. ایجاد نگهدارنده اصلی برای منوی ابزارها
    const toolsAccordionLi = document.createElement('li');
    toolsAccordionLi.className = 'tools-accordion-main has-children';
    
    // 2. ساخت HTML داخلی برای نگهدارنده ابزارها
    toolsAccordionLi.innerHTML = `
        <span><i class="fas fa-tools"></i> ابزارها و امکانات</span>
        <div class="content-container">
            <ul class="tools-submenu">
                <li class="tool-item has-children" data-tool="download">
                    <span><i class="fas fa-download"></i> دانلود کتاب</span>
                    <div class="content-container"></div>
                </li>
                <li class="tool-item has-children" data-tool="quiz">
                    <span><i class="fas fa-question-circle"></i> آزمون</span>
                    <div class="content-container"></div>
                </li>
                <li class="tool-item has-children" data-tool="favorites">
                    <span><i class="fas fa-star"></i> علاقه‌مندی‌ها</span>
                    <div class="content-container"></div>
                </li>
            </ul>
        </div>
    `;
    mainUl.appendChild(toolsAccordionLi);

    // 3. افزودن راهنمای حقوقی به عنوان آخرین آیتم در زیرمنوی ابزارها
    if(law.guide_path) {
         const guideLi = document.createElement('li');
         guideLi.className = 'tool-item has-children';
         guideLi.dataset.type = 'guide-file';
         guideLi.dataset.tool = 'guide';
         guideLi.dataset.path = law.guide_path;
         guideLi.dataset.lawKey = lawKey;
         guideLi.innerHTML = `<span><i class="fas fa-book-open"></i> راهنمای حقوقی</span><div class="content-container"></div>`;
         toolsAccordionLi.querySelector('.tools-submenu').appendChild(guideLi);
    }
    // >> پایان اصلاح <<

    container.appendChild(mainUl);
}

// تابع برای رندر کردن محتوای داخلی هر ابزار
function renderToolContent(container, toolType) {
    let content = '';
    switch(toolType) {
        case 'download':
            content = `<a href="#" class="download-link" download>دانلود نسخه PDF این قانون</a>`;
            break;
        case 'quiz':
            content = `<div class="quiz-setup">
                        <label for="question-count-${container.closest('.tab-content').id}">تعداد سوالات:</label>
                        <input type="number" value="20" min="5" max="50">
                        <button class="tool-btn">شروع آزمون</button>
                    </div>`;
            break;
        case 'favorites':
            content = `<ul class="favorites-list"><li>ماده‌هایی که ستاره‌دار می‌کنید، در اینجا نمایش داده می‌شوند.</li></ul>`;
            break;
    }
    container.innerHTML = `<div class="tool-padding">${content}</div>`;
}

    // تابع برای انیمیشن نرم و هوشمند آکاردئون
function toggleAccordion(element, parentLi) {
    if (!element) return;
    const isExpanded = parentLi.classList.contains('expanded');
    
    if (isExpanded) {
        // بستن منو
        element.style.height = element.scrollHeight + 'px';
        requestAnimationFrame(() => {
            element.style.height = '0px';
        });
        parentLi.classList.remove('expanded');
    } else {
        // باز کردن منو
        const scrollHeight = element.scrollHeight;
        element.style.height = scrollHeight + 'px';
        
        element.addEventListener('transitionend', function handler() {
            element.removeEventListener('transitionend', handler);
            if (parentLi.classList.contains('expanded')) {
                element.style.height = 'auto';
            }
        }, { once: true });
        parentLi.classList.add('expanded');
    }
}
    
    // ----- 7. منطق جدید و کامل برای جستجو -----
    async function loadAllDataForSearch() {
        if (isDataLoaded) return;
        const promises = [];
        for (const lawKey in lawManifest) {
            if (!allLawsData[lawKey]) allLawsData[lawKey] = [];
            lawManifest[lawKey].files.forEach(fileInfo => {
                promises.push(
                    fetch(fileInfo.path)
                        .then(res => res.json())
                        .then(data => { allLawsData[lawKey].push({ lawKey, fileInfo, data }); })
                        .catch(err => console.error(`خطا در بارگذاری فایل ${fileInfo.path}:`, err))
                );
            });
        }
        await Promise.all(promises);
        isDataLoaded = true;
        console.log("تمام داده‌های جستجو در پس‌زمینه بارگذاری شد.");
    }

    function performSearch(term) {
        const results = [];
        term = term.toLowerCase();

        for (const lawKey in allLawsData) {
            const lawFiles = allLawsData[lawKey];
            lawFiles.forEach(fileData => {
                function searchInDivisions(divisions, path) {
                    divisions.forEach(division => {
                        const currentPath = path.concat(division.title);
                        if (division.title && division.title.toLowerCase().includes(term)) {
                            if (division.articles) {
                                division.articles.forEach(article => {
                                    if (!results.some(r => r.article === article)) results.push({ lawInfo: lawManifest[lawKey], division, article, path: currentPath });
                                });
                            }
                        }
                        if (division.articles) {
                            division.articles.forEach(article => {
                                const articleNum = String(article.article_number).toLowerCase();
                                const articleText = (article.text || article.description || '').toLowerCase();
                                if (articleNum.includes(term) || articleText.includes(term)) {
                                    if (!results.some(r => r.article === article)) results.push({ lawInfo: lawManifest[lawKey], division, article, path: currentPath });
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

            const relevantResults = results.filter(r => r.lawInfo.title === lawManifest[tc.id].title);

            if (relevantResults.length > 0) {
                 const resultCount = document.createElement('p');
                 resultCount.innerHTML = `تعداد نتایج یافت شده در این قانون: <strong>${toPersianNumerals(relevantResults.length)}</strong>`;
                 resultsContainer.appendChild(resultCount);
            }

            const regex = new RegExp(term, 'gi');

            relevantResults.forEach(res => {
                const resDiv = document.createElement('div');
                resDiv.className = 'search-result-item';
                const rawText = res.article.text || (res.article.description || '');
                const formattedText = rawText.replace(/(\r\n|\n|\r|\/n|\\n)/g, "<br>");
                const highlightedText = term ? formattedText.replace(regex, match => `<mark>${match}</mark>`) : formattedText;

                let titlePrefix = '';
                if (res.article.article_number) {
                    const articleWord = res.lawInfo.article_word;
                    if (!isNaN(parseInt(res.article.article_number, 10))) {
                        titlePrefix = `<strong>${articleWord} ${res.article.article_number}:</strong>`;
                    } else {
                        titlePrefix = `<strong>${res.article.article_number}:</strong>`;
                    }
                }
                
                resDiv.innerHTML = `
                    <div class="result-path">${toPersianNumerals(res.path.join(' > '))}</div>
                    <div class="article">${toPersianNumerals(titlePrefix)} ${toPersianNumerals(highlightedText)}</div>
                `;
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
             if (searchTerm.length > 1) {
                 articlesContainer.style.display = 'none';
                 resultsContainer.style.display = 'block';
             } else {
                 hideSearchResults();
             }
        });

        if (searchTerm.length < 2) return;
        
        if (!isDataLoaded) {
            document.querySelectorAll('.search-results-container').forEach(rc => {
                rc.innerHTML = '<p>داده‌های جستجو در حال آماده‌سازی است، لطفاً چند لحظه بعد دوباره امتحان کنید...</p>';
            });
            return;
        }
        performSearch(searchTerm);
    });

    // ----- اجرای توابع اولیه -----
    createInitialSkeletons();
    loadAllDataForSearch(); 
});

// ===== پایان کد کامل و نهایی script.js =====
