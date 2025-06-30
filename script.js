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

    let allLawsData = {};
    let allGuidesData = {};
    let isDataLoaded = false;
    
    // 1. قابلیت: تغییر تم
    if (headerRight) {
        headerRight.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                document.body.classList.toggle('dark-theme');
            }
        });
    }

    // 2. منطق زبانه‌ها (Tabs)
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetTab = document.getElementById(tab.dataset.tab);
            if(targetTab) targetTab.classList.add('active');
            searchInput.value = '';
            hideSearchResults();
        });
    });
    
    // 3. ایجاد اسکلت اولیه محتوا (با بخش ابزارها)
    function createInitialSkeletons() {
        for (const key in lawManifest) {
            const law = lawManifest[key];
            const contentDiv = document.createElement('div');
            contentDiv.id = key;
            contentDiv.className = 'tab-content';
            
            contentDiv.innerHTML = `
                <p class="law-info">${law.info}</p>
                <div class="main-accordion-container"></div>
                <div class="search-results-container" style="display: none;"></div>
            `;
            mainContent.appendChild(contentDiv);
            
            renderMainAccordion(contentDiv.querySelector('.main-accordion-container'), law, key);
        }
        if (document.querySelector('.tab-content')) {
            document.querySelector('.tab-content').classList.add('active');
        }
    }

    // 4. ساخت اسکلت آکاردئون اصلی (قوانین + ابزارها)
    function renderMainAccordion(container, law, lawKey) {
        const mainUl = document.createElement('ul');
        
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

        const toolsHtml = `
            <li class="tool-item has-children" data-tool="favorites"><span><i class="fas fa-star"></i> علاقه‌مندی‌ها</span><div class="content-container"></div></li>
            <li class="tool-item has-children" data-tool="download"><span><i class="fas fa-download"></i> دانلود کتاب</span><div class="content-container"></div></li>
            <li class="tool-item has-children" data-tool="quiz"><span><i class="fas fa-question-circle"></i> آزمون</span><div class="content-container"></div></li>
        `;
        mainUl.insertAdjacentHTML('beforeend', toolsHtml);

        if(law.guide_path) {
             const guideLi = document.createElement('li');
             guideLi.className = 'tool-item has-children';
             guideLi.dataset.type = 'guide-file';
             guideLi.dataset.tool = 'guide';
             guideLi.dataset.path = law.guide_path;
             guideLi.dataset.lawKey = lawKey;
             guideLi.innerHTML = `<span><i class="fas fa-book-open"></i> راهنمای حقوقی</span><div class="content-container"></div>`;
             mainUl.appendChild(guideLi);
        }

        container.appendChild(mainUl);
    }
    
    // 5. مدیریت کلیک‌ها و بارگذاری آنی داده‌ها
    mainContent.addEventListener('click', async (e) => {
        const targetSpan = e.target.closest('li.has-children > span');
        if (!targetSpan) return;

        const parentLi = targetSpan.parentElement;
        const contentContainer = parentLi.querySelector('.content-container');
        const isLoaded = parentLi.dataset.loaded === 'true';
        const type = parentLi.dataset.type;
        const toolType = parentLi.dataset.tool;

        if (!isLoaded) {
            if (!isDataLoaded) {
                contentContainer.innerHTML = '<p class="tool-padding">لطفاً چند لحظه صبر کنید تا داده‌های اولیه بارگذاری شوند...</p>';
                toggleAccordion(contentContainer, parentLi); // باز کردن برای نمایش پیام
                return;
            }
            if (type === 'law-file') {
                const lawKey = parentLi.dataset.lawKey;
                const filePath = parentLi.dataset.path;
                const articleWord = lawManifest[lawKey].article_word;
                const fileData = allLawsData[lawKey]?.find(f => f.fileInfo.path === filePath);

                if (fileData) {
                    renderDivisions(contentContainer, fileData.data.divisions, articleWord);
                    parentLi.dataset.loaded = 'true';
                }
            } else if(type === 'guide-file') {
                 const lawKey = parentLi.dataset.lawKey;
                 const guideData = allGuidesData[lawKey];
                 if(guideData) {
                    renderGuideContent(contentContainer, guideData.topics);
                    parentLi.dataset.loaded = 'true';
                 }
            } else if (toolType) {
                renderToolContent(contentContainer, toolType);
                parentLi.dataset.loaded = 'true';
            }
        }
        
        toggleAccordion(contentContainer, parentLi);
    });
    
    // 6. تابع رندر کردن ساختار تو در توی قانون
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
                articlesHTML = '<ul class="article-list">';
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
                    articlesHTML += `
                        <li class="article" data-number="${article.article_number}">
                            <div class="article-content">${toPersianNumerals(titlePrefix)} ${toPersianNumerals(formattedText)}</div>
                            <div class="article-actions">
                                <button class="action-btn favorite-btn" title="افزودن به علاقه‌مندی"><i class="far fa-star"></i></button>
                                <button class="action-btn copy-btn" title="کپی کردن متن"><i class="far fa-copy"></i></button>
                                <button class="action-btn share-btn" title="اشتراک‌گذاری"><i class="fas fa-share-alt"></i></button>
                            </div>
                        </li>`;
                });
                articlesHTML += '</ul>';
            }
            
            let subdivisionsHTML = '';
            if (hasChildren) {
                const subContainer = document.createElement('div');
                subContainer.className = 'subdivisions-container';
                renderDivisions(subContainer, division.subdivisions, articleWord);
                subdivisionsHTML = subContainer.outerHTML;
            }
            
            li.innerHTML = `<span class="division-title">${toPersianNumerals(division.title)}</span><div class="accordion-content">${articlesHTML}${subdivisionsHTML}</div>`;
            ul.appendChild(li);
        });
        container.appendChild(ul);
        container.querySelectorAll('.division-title').forEach(title => {
            title.addEventListener('click', (e) => {
                e.stopPropagation();
                const content = title.nextElementSibling;
                toggleAccordion(content, title.parentElement);
            });
        });
    }

    // 7. تابع رندر کردن محتوای ابزارها
    function renderToolContent(container, toolType) {
        let content = '';
        switch(toolType) {
            case 'download':
                content = `<a href="#" class="download-link" download>دانلود نسخه PDF این قانون</a>`;
                break;
            case 'quiz':
                content = `<p>این قابلیت به زودی اضافه خواهد شد.</p>`;
                break;
            case 'favorites':
                content = `<p>ماده‌هایی که ستاره‌دار می‌کنید، در اینجا نمایش داده می‌شوند.</p>`;
                break;
        }
        container.innerHTML = `<div class="tool-padding">${content}</div>`;
    }
    
    // 8. تابع رندر کردن راهنمای حقوقی
    function renderGuideContent(container, topics) {
         let guideHTML = '';
         topics.forEach(topic => {
             let articlesList = topic.relevant_articles.map(art => `<li><a href="#" class="guide-link" data-article="${art.article_number}">${art.law_name} - ${toPersianNumerals(art.article_word || 'ماده')} ${toPersianNumerals(art.article_number)}</a>: ${art.note}</li>`).join('');
             let adviceList = topic.advice.map(adv => `<li>${adv}</li>`).join('');
             guideHTML += `
                 <div class="guide-topic">
                     <h4>${topic.topic_title}</h4>
                     <p>${topic.explanation}</p>
                     <p><strong>موارد قانونی مرتبط:</strong></p>
                     <ul class="guide-article-list">${articlesList}</ul>
                     <p><strong>توصیه‌های کلی:</strong></p>
                     <ul class="guide-advice-list">${adviceList}</ul>
                 </div>
             `;
         });
         container.innerHTML = `<div class="tool-padding">${guideHTML}</div>`;
    }

    // 9. تابع انیمیشن نرم آکاردئون
    function toggleAccordion(element, parentLi) {
        if (!element) return;
        const isExpanded = parentLi.classList.contains('expanded');
        
        element.style.display = 'block'; // برای محاسبه ارتفاع صحیح لازم است
        if (isExpanded) {
            element.style.height = element.scrollHeight + 'px';
            requestAnimationFrame(() => {
                element.style.height = '0px';
            });
            parentLi.classList.remove('expanded');
        } else {
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
    
    // 10. منطق جستجوی آنی
    async function loadAllData() {
        if (isDataLoaded) return;
        const lawPromises = Object.values(lawManifest).flatMap(law => 
            law.files.map(fileInfo =>
                fetch(fileInfo.path)
                    .then(res => res.json())
                    .then(data => ({ type: 'law', key: Object.keys(lawManifest).find(k => lawManifest[k] === law), fileInfo, data }))
            )
        );
        const guidePromises = Object.values(lawManifest)
            .filter(law => law.guide_path)
            .map(law => 
                fetch(law.guide_path)
                    .then(res => res.json())
                    .then(data => ({ type: 'guide', key: Object.keys(lawManifest).find(k => lawManifest[k] === law), data }))
            );
        const allPromises = [...lawPromises, ...guidePromises];
        try {
            const results = await Promise.all(allPromises);
            results.forEach(result => {
                if (result) {
                    if (result.type === 'law') {
                        if (!allLawsData[result.key]) allLawsData[result.key] = [];
                        allLawsData[result.key].push(result);
                    } else if (result.type === 'guide') {
                        allGuidesData[result.key] = result.data;
                    }
                }
            });
            isDataLoaded = true;
            console.log("تمام داده‌های قوانین و راهنماها در پس‌زمینه بارگذاری شد.");
        } catch (error) {
            console.error("خطای جدی در بارگذاری اولیه داده‌ها:", error);
        }
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
                 resultCount.innerHTML = `تعداد نتایج یافت شده: <strong>${toPersianNumerals(relevantResults.length)}</strong>`;
                 resultsContainer.appendChild(resultCount);
            } else if (term) {
                 resultsContainer.innerHTML = '<p>هیچ نتیجه‌ای یافت نشد.</p>';
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
                resDiv.innerHTML = `<div class="result-path">${toPersianNumerals(res.path.join(' > '))}</div><div class="article">${toPersianNumerals(titlePrefix)} ${toPersianNumerals(highlightedText)}</div>`;
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
        const activeTab = document.querySelector('.tab-content.active');
        if(!activeTab) return;

        const resultsContainer = activeTab.querySelector('.search-results-container');
        const articlesContainer = activeTab.querySelector('.articles-container');

        if (searchTerm.length > 1) {
            articlesContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
            if (!isDataLoaded) {
                resultsContainer.innerHTML = '<p>داده‌های جستجو در حال آماده‌سازی است، لطفاً چند لحظه بعد دوباره امتحان کنید...</p>';
                return;
            }
            performSearch(searchTerm);
        } else {
            hideSearchResults();
        }
    });

    // 11. منطق دکمه‌های کپی، اشتراک و علاقه‌مندی
    mainContent.addEventListener('click', function(e) {
        const target = e.target.closest('.action-btn');
        if (!target) return;

        const articleLi = target.closest('.article');
        const articleContent = articleLi.querySelector('.article-content').innerText;
        const siteUrl = "https://yourwebsite.com"; // <<-- آدرس سایت خود را اینجا قرار دهید
        const attribution = `\n\nمنبع: کانون حقوقی ایران - ${siteUrl}`;

        if (target.classList.contains('copy-btn')) {
            navigator.clipboard.writeText(articleContent + attribution).then(() => {
                alert('متن با موفقیت کپی شد!');
            }).catch(err => console.error('خطا در کپی: ', err));
        }

        if (target.classList.contains('share-btn')) {
            if (navigator.share) {
                navigator.share({
                    title: 'ماده‌ای از کانون حقوقی ایران',
                    text: articleContent + attribution,
                }).catch(err => console.error('خطا در اشتراک‌گذاری: ', err));
            } else {
                alert('مرورگر شما از قابلیت اشتراک‌گذاری پشتیبانی نمی‌کند.');
            }
        }

        if (target.classList.contains('favorite-btn')) {
            target.classList.toggle('favorited');
            const icon = target.querySelector('i');
            icon.classList.toggle('far'); // far fa-star -> ستاره توخالی
            icon.classList.toggle('fas'); // fas fa-star -> ستاره توپر
        }
    });

    // ----- اجرای توابع اولیه -----
    createInitialSkeletons();
    loadAllData(); 
});

// ===== پایان کد کامل و نهایی script.js =====
