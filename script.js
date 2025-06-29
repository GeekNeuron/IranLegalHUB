/* General Body Styles */
body {
    font-family: 'Vazirmatn', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
    color: #333;
    transition: background-color 0.3s, color 0.3s;
}

/* Dark Theme */
body.dark-theme {
    background-color: #121212;
    color: #e0e0e0;
}

body.dark-theme #main-header,
body.dark-theme .tabs,
body.dark-theme .tab-link {
    background-color: #1e1e1e;
    color: #e0e0e0;
}

body.dark-theme .tab-link.active {
    background-color: #333;
    border-bottom-color: #bb86fc;
}

body.dark-theme .division-item .division-title {
    background-color: #2a2a2a;
}

body.dark-theme .division-item.expanded > .division-title {
    background-color: #333;
}

body.dark-theme .article,
body.dark-theme .gap-notice {
    background-color: #222;
    border-color: #444;
}

/* Header */
#main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 10px 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-right {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.header-icon {
    width: 40px;
    height: 40px;
    margin-left: 15px;
}

.dark-theme-icon { display: none; }
.dark-theme .light-theme-icon { display: none; }
.dark-theme .dark-theme-icon { display: block; }

#header-title {
    font-size: 1.5em;
    font-weight: 700;
}

/* Search Container */
.search-container {
    flex-grow: 1;
    margin: 0 40px;
}

#search-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #f9f9f9;
}

body.dark-theme #search-input {
    background: #333;
    border-color: #555;
    color: #e0e0e0;
}

/* Tabs Navigation -->> کد اصلاح شده برای ریلی شدن <<-- */
.tabs {
    display: flex;
    overflow-x: auto; /* این خط اصلی‌ترین تغییر است */
    -webkit-overflow-scrolling: touch; /* برای اسکرول نرم در iOS */
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    white-space: nowrap; /* جلوگیری از شکستن دکمه‌ها به خط بعد */
    scrollbar-width: thin; /* برای فایرفاکس */
    scrollbar-color: #bb86fc #333;
}
/* استایل اسکرول‌بار برای کروم و سافاری */
.tabs::-webkit-scrollbar {
    height: 5px;
}
.tabs::-webkit-scrollbar-track {
    background: #f1f1f1;
}
.dark-theme .tabs::-webkit-scrollbar-track {
    background: #333;
}
.tabs::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
}
.tabs::-webkit-scrollbar-thumb:hover {
    background: #555;
}
.dark-theme .tabs::-webkit-scrollbar-thumb {
    background: #bb86fc;
}


.tab-link {
    padding: 12px 18px;
    cursor: pointer;
    border: none;
    background-color: transparent;
    font-size: 1em;
    font-family: 'Vazirmatn', sans-serif;
    border-bottom: 3px solid transparent;
    transition: all 0.3s;
    flex-shrink: 0; /* جلوگیری از کوچک شدن دکمه‌ها */
}

.tab-link:hover {
    background-color: #f0f0f0;
}

.tab-link.active {
    border-bottom-color: #007bff;
    font-weight: 700;
}

body.dark-theme .tab-link:hover {
    background-color: #333;
}

/* Main Content */
#main-content {
    padding: 20px;
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

.law-info {
    font-size: 1.1em;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #e9ecef;
    border-radius: 5px;
    line-height: 1.7;
}

body.dark-theme .law-info {
    background-color: #2a2a2a;
}

/* Accordion Styles */
.accordion ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.accordion li {
    margin-bottom: 5px;
}

.file-group > span, .division-item > .division-title {
    display: block;
    width: 100%;
    padding: 12px;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    cursor: pointer;
    font-weight: 700;
    font-size: 1.1em;
    transition: background-color 0.3s;
    position: relative;
    padding-right: 35px; /* فضا برای آیکون */
}

.file-group > span::before, .division-item.has-children > .division-title::before {
    content: '◀';
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.3s;
    font-size: 0.8em;
}

.file-group.expanded > span::before, .division-item.expanded > .division-title::before {
    transform: translateY(-50%) rotate(-90deg);
}


.file-group > span:hover, .division-item > .division-title:hover {
    background-color: #e9ecef;
}

.divisions-container, .subdivisions-container, .article-list {
    padding-right: 20px;
    border-right: 2px solid #007bff;
}

body.dark-theme .divisions-container,
body.dark-theme .subdivisions-container,
body.dark-theme .article-list {
    border-right-color: #bb86fc;
}

.hidden {
    display: none;
}

.article, .gap-notice {
    background: #fff;
    padding: 15px;
    margin-top: 5px;
    border: 1px solid #eee;
    border-radius: 4px;
    line-height: 2; /* افزایش فاصله خطوط برای خوانایی */
    text-align: justify; /* >> کد اصلی برای تراز کردن متن << */
}

.article strong {
    color: #0056b3;
    margin-left: 8px;
}

body.dark-theme .article strong {
    color: #bb86fc;
}

.gap-notice {
    background-color: #fff3cd;
    color: #856404;
}

body.dark-theme .gap-notice {
    background-color: #3b3109;
    color: #ffeaa7;
}
