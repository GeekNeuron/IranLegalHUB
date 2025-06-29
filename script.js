// ===== شروع کد کامل و نهایی script.js =====

// این تابع هر رشته‌ای را می‌گیرد و اعداد انگلیسی آن را به فارسی تبدیل می‌کند
function toPersianNumerals(str) {
    if (typeof str !== 'string' && typeof str !== 'number') return str;
    const persian = {
        0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴',
        5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹'
    };
    return String(str).replace(/[0-9]/g, (w) => {
        return persian[w];
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const tabs = document.querySelectorAll('.tab-link');
    const searchInput = document.getElementById('search-input');
    const headerRight = document.querySelector('.header-right');

    // ----- 1. تعویض تم -----
    if (headerRight) {
        headerRight.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
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
        });
    });
    
    // ----- 3. ایجاد اسکلت اولیه محتوا -----
    function createInitialSkeletons() {
        for (const key in lawManifest) {
            const law = lawManifest[key];
            const contentDiv = document.createElement('div');
            contentDiv.id = key;
            contentDiv.className = 'tab-content';
            
            contentDiv.innerHTML = `<p class="law-info">${law.info}</p>`;
            const articlesContainer = document.createElement('div');
            articlesContainer.className = 'articles-container accordion';
            contentDiv.appendChild(articlesContainer);
            mainContent.appendChild(contentDiv);
            renderAccordionSkeleton(articlesContainer, law.files, key);
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
    
    // ----- 5. بارگذاری داده‌ها -----
    mainContent.addEventListener('click', async (e) => {
        const targetSpan = e.target.closest('span');
        const fileGroup = e.target.closest('.file-group');
        
        if (fileGroup && targetSpan && fileGroup.contains(targetSpan)) {
            const divisionsContainer = fileGroup.querySelector('.divisions-container');
            const isLoaded = fileGroup.dataset.loaded === 'true';

            if (!isLoaded) {
                try {
                    divisionsContainer.innerHTML = '<p>در حال بارگذاری...</p>';
                    const response = await fetch(fileGroup.dataset.path);
                    if (!response.ok) throw new Error(`فایل یافت نشد!`);
                    const data = await response.json();
                    
                    const lawKey = fileGroup.dataset.lawKey;
                    const articleWord = lawManifest[lawKey].article_word;
                    
                    renderDivisions(divisionsContainer, data.divisions, articleWord);
                    fileGroup.dataset.loaded = 'true';
                } catch (error) {
                    divisionsContainer.innerHTML = `<p style="color: red;">خطا: ${error.message}</p>`;
                }
            }
            fileGroup.classList.toggle('expanded');
            divisionsContainer.classList.toggle('hidden');
        }
    });
    
    // ----- 6. تابع رندر کردن ساختار تو در تو (با تمام اصلاحات) -----
    function renderDivisions(container, divisions, articleWord) {
        container.innerHTML = '';
        const ul = document.createElement('ul');
        ul.className = 'top-level-division';

        divisions.forEach(division => {
            const li = document.createElement('li');
            li.className = `division-item type-${division.type.replace(/\s+/g, '-').toLowerCase()}`;
            
            const hasChildren = division.subdivisions && division.subdivisions.length > 0;
            if (hasChildren) {
                li.classList.add('has-children');
            }

            let articlesHTML = '';
            if (division.articles) {
                articlesHTML = '<ul class="article-list hidden">';
                division.articles.forEach(article => {
                    let articleContent = '';
                    
                    // --- >> شروع بخش اصلاح شده اصلی << ---
                    // ابتدا نوع آیتم را چک می‌کنیم
                    if (article.entry_type === 'numbering_gap_notice') {
                        // اگر آیتم از نوع "اعلان جای خالی" بود
                        articleContent = `<li class="article gap-notice">
                            <strong>توجه:</strong> ${toPersianNumerals(article.description)} (مواد ${toPersianNumerals(article.article_range)})
                        </li>`;
                    } else {
                        // اگر یک ماده یا اصل عادی بود
                        const formattedText = article.text ? article.text.replace(/(\r\n|\n|\r|\/n|\\n)/g, "<br>") : '';
                        
                        let titlePrefix = '';
                        if (article.article_number) {
                            if (!isNaN(parseInt(article.article_number, 10))) {
                                titlePrefix = `<strong>${articleWord} ${article.article_number}:</strong>`;
                            } else {
                                titlePrefix = `<strong>${article.article_number}:</strong>`;
                            }
                        }
                        
                        const persianTitle = toPersianNumerals(titlePrefix);
                        const persianText = toPersianNumerals(formattedText);
                        
                        articleContent = `<li class="article" data-number="${article.article_number}">${persianTitle} ${persianText}</li>`;
                    }
                    articlesHTML += articleContent;
                    // --- >> پایان بخش اصلاح شده اصلی << ---
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
            
            li.innerHTML = `
                <span class="division-title">${toPersianNumerals(division.title)}</span>
                ${articlesHTML}
                ${subdivisionsHTML}
            `;
            ul.appendChild(li);
        });

        container.appendChild(ul);
        
        container.querySelectorAll('.division-title').forEach(title => {
            title.addEventListener('click', (e) => {
                e.stopPropagation();
                const parentItem = e.target.parentElement;
                parentItem.classList.toggle('expanded');
                const childContainer = parentItem.querySelector('.article-list, .subdivisions-container');
                if (childContainer) {
                    childContainer.classList.toggle('hidden');
                }
            });
        });
    }

    // ----- 7. منطق جستجو -----
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        const activeTabContent = document.querySelector('.tab-content.active');
        if (!activeTabContent) return;

        const allArticles = activeTabContent.querySelectorAll('.article');
        
        allArticles.forEach(article => {
            const originalHTML = article.dataset.originalHTML || article.innerHTML;
            if (!article.dataset.originalHTML) {
                article.dataset.originalHTML = originalHTML;
            }
            const cleanText = article.textContent.toLowerCase();

            if (!searchTerm) {
                article.style.display = 'list-item';
                article.innerHTML = originalHTML;
            } else {
                if (cleanText.includes(searchTerm)) {
                    article.style.display = 'list-item';
                    const regex = new RegExp(searchTerm, 'gi');
                    article.innerHTML = originalHTML.replace(regex, (match) => `<mark>${match}</mark>`);
                } else {
                    article.style.display = 'none';
                }
            }
        });
    });

    // ----- اجرای تابع اولیه -----
    createInitialSkeletons();
});
