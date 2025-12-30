// ===== شروع کد نهایی script.js (بدون ابزارها + با انیمیشن نرم) =====

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

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const tabs = document.querySelectorAll('.tab-link');
    const searchInput = document.getElementById('search-input');
    const headerRight = document.querySelector('.header-right');

    // ----- متغیرهای مدیریت داده‌ها و جستجو -----
    let allLawsData = {}; 
    let isDataLoaded = false; 

    // ----- 1. قابلیت: تغییر تم -----
    if (headerRight) {
        headerRight.addEventListener('click', (e) => {
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
            const targetId = tab.dataset.tab;
            const targetTab = document.getElementById(targetId);
            if(targetTab) targetTab.classList.add('active');
            
            searchInput.value = '';
            hideSearchResults();
        });
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
        if (document.querySelector('.tab-content')) {
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
                    <span><i class="fas fa-book"></i> ${fileInfo.title}</span>
                    <div class="content-container"></div>
                `;
                mainUl.appendChild(fileLi);
            });
        }
        container.appendChild(mainUl);
    }

    // ----- 5. هندل کردن کلیک‌ها -----
    mainContent.addEventListener('click', async (e) => {
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
                contentContainer.innerHTML = '<div class="tool-padding"><i class="fas fa-spinner fa-spin"></i> در حال بارگذاری...</div>';
                
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
                li.innerHTML = `<span class="division-title">${toPersianNumerals(div.title)} <i class="fas fa-chevron-down" style="float:left; font-size:0.8em; margin-top:5px;"></i></span>`;
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
                    if (art.article_number) {
                        const isNum = !isNaN(parseInt(art.article_number));
                        const label = isNum ? `${lawInfo.article_word} ${toPersianNumerals(art.article_number)}` : toPersianNumerals(art.article_number);
                        headerText = `<strong>${label}:</strong> `;
                    }
                    
                    const rawText = art.text || art.description || '';
                    articleDiv.innerHTML = `${headerText}${toPersianNumerals(formatText(rawText))}`;
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
                if (res.article.article_number) {
                     const isNum = !isNaN(parseInt(res.article.article_number));
                     const label = isNum ? `${res.lawInfo.article_word} ${toPersianNumerals(res.article.article_number)}` : toPersianNumerals(res.article.article_number);
                     titlePrefix = `<strong>${label}:</strong>`;
                }
                
                resDiv.innerHTML = `
                    <div class="result-path" style="font-size:0.8em; color:#666; margin-bottom:5px;">${toPersianNumerals(res.path.join(' > '))}</div>
                    <div class="article-text">${titlePrefix} ${toPersianNumerals(highlightedText)}</div>
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

    createInitialSkeletons();
    loadAllDataForSearch();
});
// ===== پایان کد کامل و نهایی script.js =====
