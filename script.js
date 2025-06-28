document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const mainContent = document.getElementById('main-content');
    const tabs = document.querySelectorAll('.tab-link');
    const searchInput = document.getElementById('search-input');

    // ----- 1. تعویض تم -----
    const headerRight = document.querySelector('.header-right'); 
    headerRight.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    });

    // ----- 2. منطق زبانه‌ها (Tabs) -----
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });
    
    // ----- 3. ایجاد اسکلت اولیه محتوا از روی مانیفست -----
    function createInitialSkeletons() {
        for (const key in lawManifest) {
            const law = lawManifest[key];
            const contentDiv = document.createElement('div');
            contentDiv.id = key;
            contentDiv.className = 'tab-content';
            
            contentDiv.innerHTML = `
                <p class="law-info">${law.info}</p>
                <div class="content-selector">
                    <button class="view-toggle-btn active" data-view="articles">ماده‌ها</button>
                    <button class="view-toggle-btn" data-view="quiz">آزمون</button>
                </div>
                <div class="articles-container accordion"></div>
                <div class="quiz-container" style="display: none;"></div>
            `;
            mainContent.appendChild(contentDiv);

            renderAccordionSkeleton(contentDiv.querySelector('.articles-container'), law.files);
            // setupQuiz(contentDiv, key); // منطق آزمون در صورت نیاز در اینجا فراخوانی می‌شود
        }
        document.querySelector('.tab-content').classList.add('active');
    }

    // ----- 4. ساخت اسکلت آکاردئون (فقط تیتر فایل‌ها) -----
    function renderAccordionSkeleton(container, files) {
        if (!files || files.length === 0) {
            container.innerHTML = '<p>محتوای این بخش هنوز اضافه نشده است.</p>';
            return;
        }

        const mainUl = document.createElement('ul');
        files.forEach(fileInfo => {
            const fileLi = document.createElement('li');
            fileLi.className = 'file-group';
            fileLi.dataset.path = fileInfo.path; // مسیر فایل را در یک attribute ذخیره می‌کنیم
            fileLi.innerHTML = `<span>${fileInfo.title}</span><div class="divisions-container hidden"></div>`;
            mainUl.appendChild(fileLi);
        });
        container.appendChild(mainUl);
    }
    
    // ----- 5. منطق جدید: بارگذاری داده‌ها از فایل JSON هنگام کلیک -----
    mainContent.addEventListener('click', async (e) => {
        const fileGroup = e.target.closest('.file-group');
        if (fileGroup && e.target.tagName === 'SPAN') {
            const divisionsContainer = fileGroup.querySelector('.divisions-container');
            const isLoaded = fileGroup.dataset.loaded === 'true';

            if (!isLoaded) {
                try {
                    divisionsContainer.innerHTML = '<p>در حال بارگذاری...</p>';
                    const response = await fetch(fileGroup.dataset.path);
                    if (!response.ok) throw new Error('فایل قانون یافت نشد!');
                    const data = await response.json();
                    
                    renderDivisions(divisionsContainer, data.divisions); // رندر کردن بخش‌ها و مواد
                    fileGroup.dataset.loaded = 'true';
                } catch (error) {
                    divisionsContainer.innerHTML = `<p>خطا در بارگذاری: ${error.message}</p>`;
                }
            }
            
            fileGroup.classList.toggle('expanded');
            divisionsContainer.classList.toggle('hidden');
        }
    });

    // ----- 6. تابع جدید برای رندر کردن ساختار تو در توی قانون -----
    function renderDivisions(container, divisions) {
        container.innerHTML = ''; 
        const ul = document.createElement('ul');

        divisions.forEach(division => {
            const li = document.createElement('li');
            li.className = `division-item type-${division.type}`;
            
            let contentHTML = '';
            if (division.articles) {
division.articles.forEach(article => {
    if(article.entry_type === 'numbering_gap_notice') {
        contentHTML += `<li class="article gap-notice"><strong>توجه:</strong> ${article.description} (مواد ${article.article_range})</li>`;
    } else {
        const formattedText = article.text.replace(/\n/g, '<br>');
        contentHTML += `<li class="article"><strong>اصل/ماده ${article.article_number}:</strong> ${formattedText}</li>`;
    }
});
            }

            // بازگشتی برای زیرمجموعه‌ها
            let subdivisionsHTML = '';
            if(division.subdivisions) {
                const subContainer = document.createElement('div');
                subContainer.className = 'subdivisions-container hidden';
                renderDivisions(subContainer, division.subdivisions);
                subdivisionsHTML = subContainer.outerHTML;
            }

            li.innerHTML = `
                <span class="division-title">${division.title}</span>
                ${subdivisionsHTML || `<ul class="hidden">${contentHTML}</ul>`}
            `;
            ul.appendChild(li);
        });

        container.appendChild(ul);
        
        // افزودن event listener برای باز و بسته کردن زیرمجموعه‌های جدید
        container.querySelectorAll('.division-title').forEach(title => {
            title.addEventListener('click', (e) => {
                e.stopPropagation();
                const parentItem = e.target.parentElement;
                parentItem.classList.toggle('expanded');
                const nextContainer = parentItem.querySelector('.subdivisions-container, ul');
                if (nextContainer) {
                    nextContainer.classList.toggle('hidden');
                }
            });
        });
    }

    // منطق جستجو و آزمون فعلا به صورت ساده باقی می‌ماند و می‌تواند بعدا تکمیل شود.

    // ----- اجرای تابع اولیه -----
    createInitialSkeletons();
});
