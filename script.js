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

    // ----- 1. قابلیت: تغییر تم -----
    if (headerRight) {
        headerRight.addEventListener('click', (e) => {
            // جلوگیری از تغییر تم با کلیک روی بخش‌های دیگر هدر
            if (e.target.closest('.header-right')) {
                document.body.classList.toggle('dark-theme');
            }
        });
    }
    // جلوگیری از تغییر تم هنگام کلیک روی کادر جستجو
    if(searchInput) {
        searchInput.addEventListener('click', (e) => {
            e.stopPropagation();
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
            
            // اضافه کردن بخش انتخاب نما (ماده‌ها / آزمون)
            contentDiv.innerHTML = `
            <p class="law-info">${law.info}</p>
            <div class="articles-container accordion"></div>
            `;
            mainContent.appendChild(contentDiv);

            renderAccordionSkeleton(contentDiv.querySelector('.articles-container'), law.files, key);
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
    
    // ----- 5. بارگذاری داده‌ها از JSON -----
    mainContent.addEventListener('click', async (e) => {
        const fileGroup = e.target.closest('.file-group > span');
        if (fileGroup) {
            const parentLi = fileGroup.parentElement;
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
    
    // ===== این تابع را در script.js خود به طور کامل جایگزین کنید =====

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
                // اطمینان از وجود متن برای جلوگیری از خطا
                const rawText = article.text || ''; 
                const formattedText = rawText.replace(/(\r\n|\n|\r|\/n|\\n)/g, "<br>");
                
                let titlePrefix = '';
                if (article.article_number) {
                    if (!isNaN(parseInt(article.article_number, 10))) {
                        titlePrefix = `<strong>${articleWord} ${article.article_number}:</strong>`;
                    } else {
                        titlePrefix = `<strong>${article.article_number}:</strong>`;
                    }
                }
                
                // <<-- شروع اصلاح کلیدی: فراخوانی تابع تبدیل اعداد -->>
                const persianTitle = toPersianNumerals(titlePrefix);
                const persianText = toPersianNumerals(formattedText);
                // <<-- پایان اصلاح کلیدی -->>
                
                articlesHTML += `<li class="article" data-number="${article.article_number}">${persianTitle} ${persianText}</li>`;
            });
            articlesHTML += '</ul>';
        }
        
        let subdivisionsHTML = '';
        if (hasChildren) {
            const subContainer = document.createElement('div');
            subContainer.className = 'subdivisions-container hidden';
            // فراخوانی بازگشتی با ارسال articleWord
            renderDivisions(subContainer, division.subdivisions, articleWord);
            subdivisionsHTML = subContainer.outerHTML;
        }
        
        // تبدیل اعداد عنوان بخش به فارسی
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

    // ----- 7. قابلیت: جستجو -----
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
                    article.innerHTML = originalHTML.replace(/<mark>|<\/mark>/g, '').replace(regex, (match) => `<mark>${match}</mark>`);
                } else {
                    article.style.display = 'none';
                }
            }
        });
    });

    // ----- 8. قابلیت: نمایش محتوای ماده‌ها یا آزمون -----
    mainContent.addEventListener('click', e => {
        if (e.target.classList.contains('view-toggle-btn')) {
            const parentContent = e.target.closest('.tab-content');
            parentContent.querySelectorAll('.view-toggle-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const articlesView = parentContent.querySelector('.articles-container');
            const quizView = parentContent.querySelector('.quiz-container');

            if (e.target.dataset.view === 'quiz') {
                articlesView.style.display = 'none';
                quizView.style.display = 'block';
            } else {
                articlesView.style.display = 'block';
                quizView.style.display = 'none';
            }
        }
    });

    // ----- 9. قابلیت: منطق آزمون -----
    function setupQuiz(container, lawKey) {
        const quizContainer = container.querySelector('.quiz-container');
        const law = lawManifest[lawKey];
        const allQuestions = [];
        
        // جمع‌آوری سوالات از فایل‌های مختلف در صورت وجود
        if (law.quiz && law.quiz.length > 0) {
            allQuestions.push(...law.quiz);
        }

        if (allQuestions.length === 0) {
            quizContainer.innerHTML = '<p>آزمونی برای این بخش تعریف نشده است.</p>';
            return;
        }

        const startBtn = document.createElement('button');
        startBtn.textContent = 'شروع آزمون';
        startBtn.className = 'start-quiz-btn';
        quizContainer.innerHTML = ''; // پاک کردن محتوای قبلی
        quizContainer.appendChild(startBtn);

        startBtn.addEventListener('click', () => {
            runQuiz(quizContainer, allQuestions);
        });
    }

    function runQuiz(container, questions) {
        const randomQuestions = [...questions].sort(() => 0.5 - Math.random()).slice(0, 20);
        let userAnswers = {};

        let questionsHTML = '';
        randomQuestions.forEach((q, index) => {
            const shuffledOptions = [...q.options].sort(() => 0.5 - Math.random());
            let optionsHTML = '';
            shuffledOptions.forEach(opt => {
                optionsHTML += `<label><input type="radio" name="question-${index}" value="${opt}"> ${opt}</label>`;
            });
            questionsHTML += `<div class="quiz-question-block"><p class="quiz-question">${toPersianNumerals(index + 1)}. ${q.question}</p><div class="quiz-options">${optionsHTML}</div></div><hr>`;
        });
        
        container.innerHTML = `
            <div class="quiz-header"><h3>زمان سپری شده: ۰ دقیقه و ۰ ثانیه</h3></div>
            <div id="quiz-area">${questionsHTML}</div>
            <button id="finish-quiz-btn">پایان آزمون</button>
            <div class="quiz-results"></div>
        `;
        const quizStartTime = new Date();
        const quizTimerInterval = setInterval(() => {
            const now = new Date();
            const timeDiff = Math.round((now - quizStartTime) / 1000);
            const minutes = Math.floor(timeDiff / 60);
            const seconds = timeDiff % 60;
            const timerDisplay = container.querySelector('.quiz-header h3');
            if (timerDisplay) {
                timerDisplay.textContent = `زمان سپری شده: ${toPersianNumerals(minutes)} دقیقه و ${toPersianNumerals(seconds)} ثانیه`;
            }
        }, 1000);

        container.querySelector('#finish-quiz-btn').addEventListener('click', () => {
            clearInterval(quizTimerInterval);
            randomQuestions.forEach((q, index) => {
                const selected = container.querySelector(`input[name="question-${index}"]:checked`);
                userAnswers[index] = selected ? selected.value : null;
            });
            showResults(container, randomQuestions, userAnswers, quizStartTime);
        });
    }

    function showResults(container, questions, answers, startTime) {
        let correctCount = 0;
        let resultsHTML = `<table><tr><th>سوال</th><th>پاسخ شما</th><th>پاسخ صحیح</th><th>نتیجه</th></tr>`;
        questions.forEach((q, index) => {
            const isCorrect = answers[index] === q.correctAnswer;
            if (isCorrect) correctCount++;
            resultsHTML += `<tr>
                <td>${q.question}</td>
                <td>${answers[index] || 'بدون پاسخ'}</td>
                <td>${q.correctAnswer}</td>
                <td class="${isCorrect ? 'correct' : 'incorrect'}">${isCorrect ? '✔' : '✖'}</td>
            </tr>`;
        });
        resultsHTML += '</table>';
        
        const timeDiff = Math.round((new Date() - startTime) / 1000);
        const score = (correctCount / questions.length) * 100;
        const summaryHTML = `<h2>امتیاز شما: ${toPersianNumerals(score.toFixed(1))}% (${toPersianNumerals(correctCount)} از ${toPersianNumerals(questions.length)})</h2>
                             <p>زمان پاسخگویی: ${toPersianNumerals(Math.floor(timeDiff/60))} دقیقه و ${toPersianNumerals(timeDiff%60)} ثانیه</p>`;

        container.querySelector('.quiz-results').innerHTML = summaryHTML + resultsHTML;
        container.querySelector('#quiz-area').style.display = 'none';
        container.querySelector('#finish-quiz-btn').style.display = 'none';
    }

    // ----- اجرای تابع اولیه -----
    createInitialSkeletons();
});

// ===== پایان کد کامل و نهایی script.js =====
