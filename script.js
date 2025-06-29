document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const tabs = document.querySelectorAll('.tab-link');

    // -----  تعویض تم -----
    const headerRight = document.querySelector('.header-right'); 
    headerRight.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    });
    
    // ----- منطق زبانه‌ها (Tabs) -----
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // ----- ایجاد اسکلت اولیه محتوا -----
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
        document.querySelector('.tab-content').classList.add('active');
    }

    // ----- ساخت اسکلت آکاردئون -----
    function renderAccordionSkeleton(container, files, lawKey) {
        if (!files || files.length === 0) {
            container.innerHTML = '<p>فایل‌های این قانون هنوز تعریف نشده‌اند.</p>';
            return;
        }
        const mainUl = document.createElement('ul');
        files.forEach(fileInfo => {
            const fileLi = document.createElement('li');
            fileLi.className = 'file-group';
            fileLi.dataset.path = fileInfo.path;
            fileLi.dataset.lawKey = lawKey; // کلید قانون را برای دسترسی بعدی ذخیره می‌کنیم
            fileLi.innerHTML = `<span>${fileInfo.title}</span><div class="divisions-container hidden"></div>`;
            mainUl.appendChild(fileLi);
        });
        container.appendChild(mainUl);
    }

    // ----- بارگذاری داده‌ها از JSON هنگام کلیک -----
    mainContent.addEventListener('click', async (e) => {
        const fileGroup = e.target.closest('.file-group');
        if (fileGroup && e.target.tagName === 'SPAN') {
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
    
// ----- این تابع را در script.js خود به طور کامل جایگزین کنید -----

function renderDivisions(container, divisions, articleWord) {
    container.innerHTML = ''; 
    const ul = document.createElement('ul');
    ul.className = 'top-level-division';

    divisions.forEach(division => {
        const li = document.createElement('li');
        li.className = `division-item type-${division.type}`;
        
        const hasChildren = division.subdivisions && division.subdivisions.length > 0;
        if (hasChildren) {
            li.classList.add('has-children');
        }

        let articlesHTML = '';
        if (division.articles) {
            articlesHTML = '<ul class="article-list hidden">';
            division.articles.forEach(article => {
                // --- >> شروع بخش اصلاح شده << ---

                // 1. تمام حالت‌های ممکن خط جدید را با <br> جایگزین می‌کنیم
                // این کد هم /n و هم \n واقعی را پوشش می‌دهد
                const formattedText = article.text.replace(/(\r\n|\n|\r|\\n|\/n)/g, "<br>");

                // 2. پیشوند "اصل" یا "ماده" را به درستی مدیریت می‌کنیم
                let titlePrefix = '';
                if (article.article_number) {
                    if (!isNaN(parseInt(article.article_number, 10))) {
                        // اگر شماره ماده یک عدد بود
                        titlePrefix = `<strong>${articleWord} ${article.article_number}:</strong>`;
                    } else {
                        // اگر یک عنوان بود (مثل مقدمه)
                        titlePrefix = `<strong>${article.article_number}:</strong>`;
                    }
                }
                
                articlesHTML += `<li class="article">${titlePrefix} ${formattedText}</li>`;
                // --- >> پایان بخش اصلاح شده << ---
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
            <span class="division-title">${division.title}</span>
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

    // ----- اجرای تابع اولیه -----
    createInitialSkeletons();
});
