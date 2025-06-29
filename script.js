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
    
    // ----- 3. ایجاد اسکلت اولیه محتوا -----
    function createInitialSkeletons() {
        for (const key in lawManifest) {
            const law = lawManifest[key];
            const contentDiv = document.createElement('div');
            contentDiv.id = key;
            contentDiv.className = 'tab-content';
            
            contentDiv.innerHTML = `
                <p class="law-info">${law.info}</p>
                <div class="content-selector">
                    <button class="view-toggle-btn active" data-view="articles">ماده‌ها / اصول</button>
                    <button class="view-toggle-btn" data-view="quiz">آزمون</button>
                </div>
                <div class="articles-container accordion"></div>
                <div class="search-results-container" style="display: none;"></div>
                <div class="quiz-container" style="display: none;"></div>
            `;
            mainContent.appendChild(contentDiv);

            renderAccordionSkeleton(contentDiv.querySelector('.articles-container'), law.files, key);
            setupQuiz(contentDiv, key);
        }
        if (document.querySelector('.tab-content')) {
            document.querySelector('.tab-content').classList.add('active');
        }
    }

    // ----- 4. ساخت اسکلت آکاردئون -----
    function renderAccordionSkeleton(container, files, lawKey) {
        if (!files || files.length === 0) {
            container.innerHTML = '<p>فایل‌های این قانون هنوز تعریف نشده‌اند.</p>';
            return;
        }
        const mainUl = document.createElement('ul');
        files.forEach(fileInfo => {
            const fileLi = document.createElement('li');
            fileLi.className = 'file-group has-children';
            fileLi.dataset.path = fileInfo.path;
            fileLi.dataset.lawKey = lawKey;
            fileLi.innerHTML = `<span>${fileInfo.title}</span><div class="divisions-container hidden"></div>`;
            mainUl.appendChild(fileLi);
        });
        container.appendChild(mainUl);
    }
    
    // ----- 5. بارگذاری داده‌ها برای نمایش آکاردئون -----
    mainContent.addEventListener('click', async (e) => {
        const fileGroupSpan = e.target.closest('.file-group > span');
        if (fileGroupSpan) {
            const parentLi = fileGroupSpan.parentElement;
            const divisionsContainer = parentLi.querySelector('.divisions-container');
            const isLoaded = parentLi.dataset.loaded === 'true';

            if (!isLoaded) {
                try {
                    divisionsContainer.innerHTML = '<p>در حال بارگذاری...</p>';
                    const response = await fetch(parentLi.dataset.path);
                    if (!response.ok) throw new Error(`فایل یافت نشد!`);
                    const data = await response.json();
                    
                    const lawKey = parentLi.dataset.lawKey;
                    const articleWord = lawManifest[lawKey].article_word;
                    
                    renderDivisions(divisionsContainer, data.divisions, articleWord);
                    parentLi.dataset.loaded = 'true';
                } catch (error) {
                    divisionsContainer.innerHTML = `<p style="color: red;">خطا: ${error.message}</p>`;
                }
            }
            parentLi.classList.toggle('expanded');
            divisionsContainer.classList.toggle('hidden');
        }
    });
    
    // ----- 6. تابع رندر کردن ساختار تو در توی قانون -----
    function renderDivisions(container, divisions, articleWord) {
        container.innerHTML = '';
        const ul = document.createElement('ul');
        ul.className = 'top-level-division';

        divisions.forEach(division => {
            const li = document.createElement('li');
            li.className = `division-item`;
            
            const hasChildren = division.subdivisions && division.subdivisions.length > 0;
            if (hasChildren) li.classList.add('has-children');

            let articlesHTML = '';
            if (division.articles) {
                articlesHTML = '<ul class="article-list hidden">';
                division.articles.forEach(article => {
                    const rawText = article.text || (article.description || ''); 
                    const formattedText = rawText.replace(/(\r\n|\n|\r|\/n|\\n)/g, "<br>");
                    
                    let titlePrefix = '';
                    if (article.article_number) {
                        if (!isNaN(parseInt(article.article_number, 10))) {
                            titlePrefix = `<strong>${articleWord} ${article.article_number}:</strong>`;
                        } else {
                            titlePrefix = `<strong>${article.article_number}:</strong>`;
                        }
                    }
                    articlesHTML += `<li class="article" data-number="${article.article_number}">${toPersianNumerals(titlePrefix)} ${toPersianNumerals(formattedText)}</li>`;
                });
                articlesHTML += '</ul>';
            }
            
            let subdivisionsHTML = '';
            if (hasChildren) {
                const subContainer = document.createElement('div');
                subContainer.className = 'subdivisions-container hidden';
                renderDivisions(subContainer, division.subdivisions, articleWord);
                subdivisionsHTML = subContainer.outerHTML;
            }
            
            li.innerHTML = `<span class="division-title">${toPersianNumerals(division.title)}</span>${articlesHTML}${subdivisionsHTML}`;
            ul.appendChild(li);
        });

        container.appendChild(ul);
        
        container.querySelectorAll('.division-title').forEach(title => {
            title.addEventListener('click', (e) => {
                e.stopPropagation();
                const parentItem = e.target.parentElement;
                parentItem.classList.toggle('expanded');
                const childContainer = parentItem.querySelector('.article-list, .subdivisions-container');
                if (childContainer) childContainer.classList.toggle('hidden');
            });
        });
    }

    // ----- 7. منطق جدید و کامل برای جستجو -----
    async function loadAllDataForSearch() {
        if (isDataLoaded) return;
        const promises = [];
        for (const lawKey in lawManifest) {
            if (!allLawsData[lawKey]) {
                allLawsData[lawKey] = [];
            }
            lawManifest[lawKey].files.forEach(fileInfo => {
                promises.push(
                    fetch(fileInfo.path)
                        .then(res => {
                            if (!res.ok) throw new Error(`Network response was not ok for ${fileInfo.path}`);
                            return res.json();
                        })
                        .then(data => {
                            allLawsData[lawKey].push({ lawKey, fileInfo, data });
                        })
                );
            });
        }
        await Promise.all(promises);
        isDataLoaded = true;
    }

    function performSearch(term) {
        const results = [];
        term = term.toLowerCase();

        for (const lawKey in allLawsData) {
            const lawFiles = allLawsData[lawKey];
            lawFiles.forEach(fileData => {
                function searchInDivisions(divisions) {
                    divisions.forEach(division => {
                        if (division.title && division.title.toLowerCase().includes(term)) {
                            if (division.articles) {
                                division.articles.forEach(article => {
                                    if (!results.some(r => r.article === article)) results.push({ lawInfo: lawManifest[lawKey], division, article });
                                });
                            }
                        }
                        if (division.articles) {
                            division.articles.forEach(article => {
                                const articleNum = String(article.article_number).toLowerCase();
                                const articleText = (article.text || article.description || '').toLowerCase();
                                if (articleNum.includes(term) || articleText.includes(term)) {
                                    if (!results.some(r => r.article === article)) results.push({ lawInfo: lawManifest[lawKey], division, article });
                                }
                            });
                        }
                        if (division.subdivisions) searchInDivisions(division.subdivisions);
                    });
                }
                searchInDivisions(fileData.data.divisions);
            });
        }
        renderSearchResults(results, term);
    }
    
    function renderSearchResults(results, term) {
        document.querySelectorAll('.tab-content').forEach(tc => {
            const resultsContainer = tc.querySelector('.search-results-container');
            const articlesContainer = tc.querySelector('.articles-container');
            articlesContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
            resultsContainer.innerHTML = '';

            if (results.length === 0) {
                resultsContainer.innerHTML = '<p>هیچ نتیجه‌ای یافت نشد.</p>';
                return;
            }
            
            const resultCount = document.createElement('p');
            resultCount.innerHTML = `تعداد نتایج یافت شده: <strong>${toPersianNumerals(results.length)}</strong>`;
            resultsContainer.appendChild(resultCount);
            
            const regex = new RegExp(term, 'gi');

            results.forEach(res => {
                const resDiv = document.createElement('div');
                resDiv.className = 'search-result-item';
                const rawText = res.article.text || (res.article.description || '');
                const formattedText = rawText.replace(/(\r\n|\n|\r|\/n|\\n)/g, "<br>");
                const highlightedText = term ? formattedText.replace(regex, match => `<mark>${match}</mark>`) : formattedText;

                let titlePrefix = '';
                if (res.article.article_number) {
                    if (!isNaN(parseInt(res.article.article_number, 10))) {
                        titlePrefix = `<strong>${res.lawInfo.article_word} ${res.article.article_number}:</strong>`;
                    } else {
                        titlePrefix = `<strong>${res.article.article_number}:</strong>`;
                    }
                }
                
                resDiv.innerHTML = `<div class="result-path">${res.lawInfo.title} > ${toPersianNumerals(res.division.title)}</div><div class="article">${toPersianNumerals(titlePrefix)} ${toPersianNumerals(highlightedText)}</div>`;
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

    searchInput.addEventListener('input', async (e) => {
        const searchTerm = e.target.value.trim();
        if (searchTerm.length < 2) {
            hideSearchResults();
            return;
        }
        if (!isDataLoaded) {
            const activeTab = document.querySelector('.tab-content.active');
            if(activeTab) {
                const resultsContainer = activeTab.querySelector('.search-results-container');
                resultsContainer.style.display = 'block';
                resultsContainer.innerHTML = '<p>برای اولین جستجو، در حال آماده‌سازی داده‌ها... لطفاً صبر کنید.</p>';
            }
            await loadAllDataForSearch();
        }
        performSearch(searchTerm);
    });

    // ----- قابلیت: نمایش محتوای ماده‌ها یا آزمون -----
    mainContent.addEventListener('click', e => {
        if (e.target.classList.contains('view-toggle-btn')) {
            const parentContent = e.target.closest('.tab-content');
            parentContent.querySelectorAll('.view-toggle-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const articlesView = parentContent.querySelector('.articles-container');
            const searchView = parentContent.querySelector('.search-results-container');
            const quizView = parentContent.querySelector('.quiz-container');

            articlesView.style.display = 'none';
            searchView.style.display = 'none';
            quizView.style.display = 'none';

            if (e.target.dataset.view === 'quiz') {
                quizView.style.display = 'block';
            } else {
                articlesView.style.display = 'block';
            }
        }
    });

    // ----- قابلیت: منطق آزمون -----
    function setupQuiz(container, lawKey) {
        // This function can be filled out later if needed
    }

    // ----- اجرای تابع اولیه -----
    createInitialSkeletons();
});
