const lawManifest = {
    'tab-constitution': {
        title: 'قانون اساسی',
        info: 'قانون اساسی جمهوری اسلامی ایران در سال ۱۳۵۸ تصویب و در سال ۱۳۶۸ بازنگری شد. این قانون دارای ۱۷۷ اصل و یک مقدمه است.',
        article_word: 'اصل', 
        files: [
            { title: 'تمام اصول', path: 'laws/constitution/constitution.json' }
        ] // آزمون این بخش هنوز آماده نیست
    },
    'tab-civil-code': {
        title: 'قانون مدنی',
        info: 'قانون مدنی ایران در سه جلد تصویب شده و دارای ۱۳۳۵ ماده است. این قانون شالوده اصلی حقوق خصوصی ایران را تشکیل می‌دهد.',
        article_word: 'ماده',
        warning: 'در جلد دوم، مواد ۹۵۸، ۹۶۱ و ۹۶۳ تا ۹۷۵ هنوز وارد نشده‌اند (این مواد در قانون وجود دارند). برای آن‌ها به منبع رسمی مراجعه کنید.',
        files: [
            { title: 'جلد اول (اموال، عقود، وصیت و ارث)', path: 'laws/civil_code/civil_code_vol_1.json' },
            { title: 'جلد دوم (اشخاص)', path: 'laws/civil_code/civil_code_vol_2.json' },
            { title: 'جلد سوم (ادله اثبات دعوی)', path: 'laws/civil_code/civil_code_vol_3.json' }
        ]
    },
    'tab-islamic-penal-code': {
        title: 'قانون مجازات اسلامی',
        info: 'قانون مجازات اسلامی مصوب ۱۳۹۲ (کتاب‌های اول تا چهارم) به‌همراه کتاب پنجم: تعزیرات و مجازات‌های بازدارنده مصوب ۱۳۷۵ با اصلاحات بعدی.',
        article_word: 'ماده',
        files: [
            { title: 'کتاب اول: کلیات', path: 'laws/islamic_penal_code/islamic_penal_code_book_1.json' },
            { title: 'کتاب دوم: حدود', path: 'laws/islamic_penal_code/islamic_penal_code_book_2.json' },
            { title: 'کتاب سوم: قصاص', path: 'laws/islamic_penal_code/islamic_penal_code_book_3.json' },
            { title: 'کتاب چهارم: دیات', path: 'laws/islamic_penal_code/islamic_penal_code_book_4.json' },
            { title: 'کتاب پنجم: تعزیرات و مجازات‌های بازدارنده', path: 'laws/batch2/islamic_penal_code_book_5_tazirat.json' }
        ]
    },
    'tab-commercial-code': {
        title: 'قانون تجارت',
        info: 'قانون تجارت ایران در سال ۱۳۱۱ تصویب شد. بخش شرکت‌های سهامی آن در سال ۱۳۴۷ با لایحه‌ای کامل جایگزین گردید.',
        article_word: 'ماده',
        files: [
            { title: 'بخش اول: شرکت‌های سهامی (لایحه ۱۳۴۷)', path: 'laws/commercial_code/part_1_joint_stock_companies.json' },
            { title: 'بخش دوم: بدنه اصلی قانون (مصوب ۱۳۱۱)', path: 'laws/commercial_code/part_2_main_body.json' }
        ]
    },
    'tab-civil-procedure-code': {
        title: 'قانون آیین دادرسی مدنی',
        info: 'قانون آیین دادرسی دادگاه‌های عمومی و انقلاب در امور مدنی در سال ۱۳۷۹ تصویب شد و دارای ۵۲۹ ماده است.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/civil_procedure_code/civil_procedure_code.json' }
        ]
    },
    'tab-criminal-procedure-code': {
        title: 'قانون آیین دادرسی کیفری',
        info: 'قانون آیین دادرسی کیفری در سال ۱۳۹۲ به تصویب رسید و دارای ۶۹۹ ماده است.',
        related: [{ key: 'tab-criminal-courts-law', label: 'قانون پیشین (منسوخ ۱۳۶۸): دادگاه‌های کیفری ۱ و ۲' }, { key: 'tab-general-courts-law', label: 'دادگاه‌های عمومی و انقلاب' }],
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/criminal_procedure_code/criminal_procedure_code.json' }
        ]
    },
    'tab-labor-code': {
        title: 'قانون کار',
        info: 'قانون کار جمهوری اسلامی ایران مصوب ۱۳۶۹/۸/۲۹ با اصلاحات ۱۳۹۰، ۲۰۳ ماده. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/labor_code/labor_code.json' }
        ]
    },
    'tab-family-protection-law': {
        title: 'قانون حمایت خانواده',
        info: 'قانون حمایت خانواده مصوب ۱۳۹۱/۱۲/۰۱ با اصلاح ماده ۵۳ در ۱۳۹۹. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/family_protection_law/family_protection_law.json' }
        ]
    },
    'tab-check-issuance-law': {
        title: 'قانون صدور چک',
        info: 'قانون صدور چک مصوب ۱۳۵۵/۴/۱۶ با اصلاحات و الحاقات تا ۱۴۰۰/۱/۲۹ (و اصلاح مبالغ جزای نقدی ۱۴۰۳-۱۴۰۴). تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/check_issuance_law/check_issuance_law.json' }
        ]
    },
    'tab-registration-law': {
        title: 'قانون ثبت اسناد و املاک',
        info: 'قانون ثبت اسناد و املاک مصوب ۱۳۱۰/۱۲/۲۶ با اصلاحات تا ۱۴۰۲، ۱۵۷ ماده. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/registration_law/registration_law.json' }
        ]
    },
    'tab-landlord-tenant-law': {
        title: 'قانون روابط موجر و مستأجر',
        info: 'قانون روابط موجر و مستأجر مصوب ۱۳۷۶/۰۵/۲۶ با اصلاح ماده ۲ در ۱۴۰۳. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/landlord_tenant_law/landlord_tenant_law.json' }
        ]
    },
    'tab-electronic-commerce-law': {
        title: 'قانون تجارت الکترونیکی',
        info: 'قانون تجارت الکترونیکی مصوب ۱۳۸۲/۱۰/۱۷، ۸۱ ماده. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/electronic_commerce_law/electronic_commerce_law.json' }
        ]
    },
    'tab-direct-taxes-law': {
        title: 'قانون مالیات‌های مستقیم',
        info: 'قانون مالیات‌های مستقیم مصوب ۱۳۶۶/۱۲/۳ با اصلاحات تا ۱۴۰۳ (بزرگ‌ترین قانون مجموعه). تکمیل شد — ۲۲۵ ماده/بند موجود در متن فعلی؛ بقیه شماره‌ها طی اصلاحات تاریخی نسخ شده و در قانون فعلی وجود ندارند.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/direct_taxes_law/direct_taxes_law.json' }
        ]
    },
    'tab-social-security-law': {
        title: 'قانون تأمین اجتماعی',
        info: 'قانون تأمین اجتماعی مصوب ۱۳۵۴/۰۴/۰۳ با اصلاحات تا ۱۴۰۴، ۱۱۸ ماده. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/social_security_law/social_security_law.json' }
        ]
    },
    'tab-administrative-justice-court-law': {
        title: 'قانون دیوان عدالت اداری',
        info: 'قانون دیوان عدالت اداری مصوب ۱۳۹۲/۳/۲۵ با اصلاحات عمده ۱۴۰۲/۲/۱۰، ۱۲۴ ماده. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/administrative_justice_court_law/administrative_justice_court_law.json' }
        ]
    },
    'tab-computer-crimes-law': {
        title: 'قانون جرائم رایانه‌ای',
        info: 'قانون جرائم رایانه‌ای مصوب ۱۳۸۸/۰۳/۰۵ (اکنون مواد ۷۲۹ تا ۷۸۲ کتاب پنجم قانون مجازات اسلامی). تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/computer_crimes_law/computer_crimes_law.json' }
        ]
    },
    'tab-general-courts-law': {
        title: 'قانون تشکیل دادگاه‌های عمومی و انقلاب',
        info: 'قانون تشکیل دادگاه‌های عمومی و انقلاب مصوب ۱۳۷۳/۰۴/۱۵ با اصلاحات ۱۳۸۱، ۱۳۸۵ و ۱۳۹۲ (بسیاری از مواد منسوخ‌اند و برای مرجعیت تاریخی حفظ شده‌اند). تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/general_courts_law/general_courts_law.json' }
        ]
    },
    'tab-consumer-rights-law': {
        title: 'قانون حمایت از حقوق مصرف‌کنندگان',
        info: 'قانون حمایت از حقوق مصرف‌کنندگان مصوب ۱۳۸۸/۰۷/۱۵ مجلس شورای اسلامی. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/five_statutes/consumer_rights_law.json' }
        ]
    },
    'tab-insurance-law': {
        title: 'قانون بیمه',
        info: 'قانون بیمه مصوب ۱۳۱۶/۰۲/۰۷ مجلس شورای ملی، شامل مقررات معاملات بیمه، فسخ و بطلان و مسئولیت بیمه‌گر. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/five_statutes/insurance_law.json' }
        ]
    },
    'tab-vat-law': {
        title: 'قانون مالیات بر ارزش افزوده',
        info: 'قانون مالیات بر ارزش افزوده مصوب ۱۴۰۰/۰۳/۰۲ مجلس شورای اسلامی. تکمیل شد.',
        article_word: 'ماده',
        warning: 'مواد ۴۹ تا ۵۴ (نسخه‌ی ۱۴۰۰) هنوز وارد نشده‌اند. برای آن‌ها به منبع رسمی مراجعه کنید.',
        files: [
            { title: 'تمام مواد', path: 'laws/five_statutes/vat_law.json' }
        ]
    },
    'tab-administrative-violations-law': {
        title: 'قانون رسیدگی به تخلفات اداری',
        info: 'قانون رسیدگی به تخلفات اداری مصوب ۱۳۷۲/۰۹/۰۷ مجلس شورای اسلامی. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/five_statutes/administrative_violations_law.json' }
        ]
    },
    'tab-trade-unions-law': {
        title: 'قانون نظام صنفی کشور',
        info: 'قانون نظام صنفی کشور مصوب ۱۳۸۲/۱۲/۲۴ با الحاقات و اصلاحات تا ۱۴۰۳/۰۵/۰۲. تکمیل شد.',
        article_word: 'ماده',
        warning: 'متن ماده ۶۵ هنوز وارد نشده است. به منبع رسمی مراجعه کنید.',
        files: [
            { title: 'تمام مواد', path: 'laws/five_statutes/trade_unions_law.json' }
        ]
    },
    'tab-civil-judgment-enforcement-law': {
        title: 'قانون اجرای احکام مدنی',
        info: 'قانون اجرای احکام مدنی مصوب ۱۳۵۶ مجلس شورای ملی با اصلاحات بعدی، شامل ترتیب اجرای احکام، توقیف و فروش اموال و تأدیه طلب.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/civil_judgment_enforcement_law.json' }
        ]
    },
    'tab-financial-judgment-enforcement-law': {
        title: 'قانون نحوه اجرای محکومیت‌های مالی',
        info: 'قانون نحوه اجرای محکومیت‌های مالی مصوب ۱۳۹۴ مجمع تشخیص مصلحت نظام.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/financial_judgment_enforcement_law.json' }
        ]
    },
    'tab-dispute-resolution-councils-law': {
        title: 'قانون شوراهای حل اختلاف',
        info: 'قانون شوراهای حل اختلاف مصوب ۱۴۰۲ مجلس شورای اسلامی.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/dispute_resolution_councils_law.json' }
        ]
    },
    'tab-traffic-violations-law': {
        title: 'قانون رسیدگی به تخلفات رانندگی',
        info: 'قانون رسیدگی به تخلفات رانندگی مصوب ۱۳۸۹ مجلس شورای اسلامی با اصلاحات و الحاقات بعدی.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/traffic_violations_law.json' }
        ]
    },
    'tab-apartment-ownership-law': {
        title: 'قانون تملک آپارتمان‌ها',
        info: 'قانون تملک آپارتمان‌ها مصوب ۱۳۴۳ با آخرین اصلاحات.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/apartment_ownership_law.json' }
        ]
    },
    'tab-anti-narcotics-law': {
        title: 'قانون مبارزه با مواد مخدر',
        info: 'قانون اصلاح قانون مبارزه با مواد مخدر و الحاق موادی به آن، مصوب ۱۳۷۶ با آخرین اصلاحات تا ۱۳۹۶.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/anti_narcotics_law.json' }
        ]
    },
    'tab-anti-money-laundering-law': {
        title: 'قانون مبارزه با پولشویی',
        info: 'قانون مبارزه با پولشویی مصوب ۱۳۸۶ با آخرین اصلاحات تا ۱۳۹۷.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/anti_money_laundering_law.json' }
        ]
    },
    'tab-family-youth-population-law': {
        title: 'قانون حمایت از خانواده و جوانی جمعیت',
        info: 'قانون حمایت از خانواده و جوانی جمعیت مصوب ۱۴۰۰ مجلس شورای اسلامی.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/family_youth_population_law.json' }
        ]
    },
    'tab-bar-association-independence-law': {
        title: 'لایحه قانونی استقلال کانون وکلای دادگستری',
        info: 'لایحه قانونی استقلال کانون وکلای دادگستری مصوب ۱۳۳۳ کمیسیون مشترک مجلسین با اصلاحات بعدی.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/bar_association_independence_law.json' }
        ]
    },
    'tab-civil-liability-law': {
        title: 'قانون مسئولیت مدنی',
        info: 'قانون مسئولیت مدنی مصوب ۱۳۳۹، مبنای جبران خسارت (تقصیر، تخفیف خسارت، مسئولیت کارفرما و دولت).',
        related: [{ key: 'tab-third-party-insurance-law', label: 'بیمه اجباری شخص ثالث' }, { key: 'tab-civil-code', label: 'قانون مدنی' }, { key: 'tab-bar-independence-bylaw-1400', label: 'آیین‌نامه اجرایی ۱۴۰۰' }],
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/civil_liability_law.json' }
        ]
    },
    'tab-third-party-insurance-law': {
        title: 'قانون بیمه اجباری خسارات واردشده به شخص ثالث',
        info: 'قانون بیمه اجباری خسارات واردشده به شخص ثالث در اثر حوادث ناشی از وسایل نقلیه مصوب ۱۳۹۵؛ جایگزین قانون ۱۳۸۷ شده است.',
        warning: 'این قانون (۱۳۹۵) جایگزین قانون بیمه اجباری شخص ثالث مصوب ۱۳۸۷ شده است و مواد قانون ۱۳۸۷ دیگر اعتبار ندارد.',
        related: [{ key: 'tab-civil-liability-law', label: 'مبنای مسئولیت: قانون مسئولیت مدنی' }, { key: 'tab-insurance-law', label: 'قانون بیمه' }],
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/third_party_insurance_law.json' }
        ]
    },
    'tab-authors-rights-law': {
        title: 'قانون حمایت از حقوق مؤلفان، مصنفان و هنرمندان',
        info: 'قانون حمایت از حقوق مؤلفان، مصنفان و هنرمندان مصوب ۱۳۴۸ (حق مؤلف و حقوق آثار ادبی و هنری).',
        related: [{ key: 'tab-software-rights-law', label: 'حقوق پدیدآورندگان نرم‌افزار' }],
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/authors_rights_law.json' }
        ]
    },
    'tab-judges-conduct-law': {
        title: 'قانون نظارت بر رفتار قضات',
        info: 'قانون نظارت بر رفتار قضات مصوب ۱۳۹۰: تخلفات انتظامی قضات، دادسرا و دادگاه عالی انتظامی و رسیدگی به صلاحیت قضات.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/judges_conduct_supervision_law.json' }
        ]
    },
    'tab-software-rights-law': {
        title: 'قانون حمایت از حقوق پدیدآورندگان نرم‌افزارهای رایانه‌ای',
        info: 'قانون حمایت از حقوق پدیدآورندگان نرم‌افزارهای رایانه‌ای مصوب ۱۳۷۹ (حقوق مادی و معنوی نرم‌افزار).',
        related: [{ key: 'tab-authors-rights-law', label: 'حقوق مؤلفان، مصنفان و هنرمندان' }],
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/software_rights_law.json' }
        ]
    },
    'tab-government-revenue-law': {
        title: 'قانون وصول برخی از درآمدهای دولت و مصرف آن در موارد معین',
        info: 'قانون وصول برخی از درآمدهای دولت و مصرف آن در موارد معین مصوب ۱۳۷۳؛ شامل هزینه‌های دادرسی و ثبتی و درآمد دستگاه‌ها.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/government_revenue_law.json' }
        ]
    },
    'tab-criminal-courts-law': {
        title: 'قانون تشکیل دادگاه‌های کیفری ۱ و ۲ (منسوخ)',
        info: 'این قانون مصوب ۱۳۶۸ منسوخ شده و فقط برای مطالعه‌ی تاریخی نگه داشته شده است؛ برای رسیدگی کنونی به قانون آیین دادرسی کیفری مراجعه کنید.',
        warning: 'این قانون منسوخ شده است؛ برای رسیدگی کیفری کنونی به قانون آیین دادرسی کیفری مراجعه کنید.',
        related: [{ key: 'tab-criminal-procedure-code', label: 'جایگزین: آیین دادرسی کیفری' }, { key: 'tab-general-courts-law', label: 'دادگاه‌های عمومی و انقلاب' }],
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/criminal_courts_1_2_law.json' }
        ]
    },
    'tab-hosbi-law': {
        title: 'قانون امور حسبی',
        info: 'قانون امور حسبی مصوب ۱۳۱۹: قیمومت، امینی، غایب مفقودالاثر، ترکه، وصیت، تقسیم و تصدیق انحصار وراثت (۳۷۸ ماده).',
        related: [{ key: 'tab-civil-code', label: 'قانون مدنی (ارجاع مواد ۱۲۱۹ به بعد)' }, { key: 'tab-civil-procedure-code', label: 'آیین دادرسی مدنی (ارجاع مواد ۵، ۷، ۱۶)' }],
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/hosbi_law.json' }
        ]
    },
    'tab-customs-law': {
        title: 'قانون امور گمرکی',
        info: 'قانون امور گمرکی مصوب ۱۳۹۰/۰۸/۲۲ با آخرین اصلاحات تا ۱۳۹۳/۰۴/۱۴ (۱۶۵ ماده): ارزش‌گذاری، رویه‌های گمرکی، تخلفات و قاچاق، کارگزار گمرکی و مراجع رسیدگی به اختلافات گمرکی.',
        article_word: 'ماده',
        warning: 'متن این صفحه تا آخرین اصلاحات ۱۳۹۳/۰۴/۱۴ است؛ برای اصلاحات بعدی به منابع رسمی مراجعه کنید.',
        related: [{ key: 'tab-islamic-penal-code', label: 'قانون مجازات اسلامی' }, { key: 'tab-direct-taxes-law', label: 'قانون مالیات‌های مستقیم' }, { key: 'tab-vat-law', label: 'مالیات بر ارزش افزوده' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/customs_law.json' }
        ]
    },
    'tab-military-service-law': {
        title: 'قانون خدمت وظیفه عمومی',
        info: 'قانون خدمت وظیفه عمومی (نظام وظیفه و سربازی) مصوب ۱۳۶۳/۰۷/۲۹ با اصلاحات تا ۱۳۹۶/۰۵/۱۷: مشمولیت، دوره ضرورت، معافیت‌ها، غیبت و جرائم و مجازات‌ها؛ به‌همراه قانون الحاق موادی به آن (۱۳۶۵).',
        article_word: 'ماده',
        warning: 'مواد ۱۷، ۱۸ و ۲۳ در صفحه‌ی منبع نبود و در این مجموعه نیامده است.',
        related: [{ key: 'tab-islamic-penal-code', label: 'قانون مجازات اسلامی' }, { key: 'tab-administrative-violations-law', label: 'قانون رسیدگی به تخلفات اداری' }],
        files: [
            { title: 'قانون خدمت وظیفه عمومی', path: 'laws/batch3/military_service_law.json' },
            { title: 'قانون الحاق موادی به قانون خدمت وظیفه (۱۳۶۵)', path: 'laws/batch3/military_service_addendum_law.json' }
        ]
    },
    'tab-prison-reduction-law': {
        title: 'قانون کاهش مجازات حبس تعزیری',
        info: 'قانون کاهش مجازات حبس تعزیری مصوب ۱۳۹۹/۰۲/۲۳: کاهش یا تبدیل حبس در کتاب پنجم (تعزیرات)، اصلاح مواد ۱۸، ۱۹، ۲۳، ۲۸، ۳۷، ۴۷، ۵۷، ۶۲، ۷۲، ۱۰۴، ۱۳۴، ۱۳۷ و ۱۳۹ قانون مجازات اسلامی.',
        article_word: 'ماده',
        related: [{ key: 'tab-islamic-penal-code', label: 'قانون مجازات اسلامی (کتاب ۱ تا ۵)' }, { key: 'tab-criminal-procedure-code', label: 'آیین دادرسی کیفری' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/prison_reduction_law.json' }
        ]
    },
    'tab-bribery-embezzlement-law': {
        title: 'قانون تشدید مجازات مرتکبین ارتشاء، اختلاس و کلاهبرداری',
        info: 'قانون تشدید مجازات مرتکبین ارتشاء و اختلاس و کلاهبرداری مصوب ۱۳۶۴/۰۶/۲۸ (با اصلاحات ۱۳۶۷/۰۹/۱۵ مجمع تشخیص مصلحت نظام): کلاهبرداری، ارتشاء، اختلاس و جرائم در حکم آن (۸ ماده).',
        article_word: 'ماده',
        related: [{ key: 'tab-islamic-penal-code', label: 'قانون مجازات اسلامی' }, { key: 'tab-prison-reduction-law', label: 'قانون کاهش مجازات حبس تعزیری' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/bribery_embezzlement_law.json' }
        ]
    },
    'tab-citizen-rights-law': {
        title: 'قانون احترام به آزادی‌های مشروع و حفظ حقوق شهروندی',
        info: 'قانون احترام به آزادی‌های مشروع و حفظ حقوق شهروندی مصوب ۱۳۸۳/۰۲/۱۵: ماده واحده با ۱۵ بند درباره‌ی تکالیف محاکم، دادسراها و ضابطان در دستگیری، بازجویی، بازداشت و تفتیش.',
        article_word: 'ماده',
        related: [{ key: 'tab-constitution', label: 'قانون اساسی (اصول ۳۲ تا ۳۹)' }, { key: 'tab-criminal-procedure-code', label: 'آیین دادرسی کیفری' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/citizen_rights_law.json' }
        ]
    },
    'tab-economic-disruptors-law': {
        title: 'قانون مجازات اخلالگران در نظام اقتصادی کشور',
        info: 'قانون مجازات اخلالگران در نظام اقتصادی کشور مصوب ۱۳۶۹/۰۹/۱۹ مجمع تشخیص مصلحت: اخلال در نظام پولی، ارزی، قاچاق عمده و جرائم اقتصادی مرتبط (۲ ماده با بندهای متعدد).',
        article_word: 'ماده',
        related: [{ key: 'tab-smuggling-law', label: 'قانون مبارزه با قاچاق کالا و ارز' }, { key: 'tab-bribery-embezzlement-law', label: 'قانون تشدید مجازات ارتشاء، اختلاس و کلاهبرداری' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/economic_disruptors_law.json' }
        ]
    },
    'tab-registration-obligation-law': {
        title: 'قانون الزام به ثبت رسمی معاملات اموال غیرمنقول',
        info: 'قانون الزام به ثبت رسمی معاملات اموال غیرمنقول مصوب ۱۴۰۱/۰۹/۰۶: الزام به ثبت رسمی انتقال مالکیت، سامانه‌ی ساماندهی اسناد غیررسمی و تنظیم قراردادهای خصوصی در دفاتر اسناد رسمی.',
        article_word: 'ماده',
        related: [{ key: 'tab-registration-law', label: 'قانون ثبت اسناد و املاک' }, { key: 'tab-notaries-law', label: 'قانون دفاتر اسناد رسمی' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/registration_obligation_law.json' }
        ]
    },
    'tab-child-protection-law': {
        title: 'قانون حمایت از اطفال و نوجوانان',
        info: 'قانون حمایت از اطفال و نوجوانان مصوب ۱۳۹۹/۰۲/۲۳ (جایگزین قانون ۱۳۸۱): حمایت از افراد زیر ۱۸ سال، وضعیت مخاطره‌آمیز و جرائم علیه آنان (۵۱ ماده).',
        article_word: 'ماده',
        related: [{ key: 'tab-family-protection-law', label: 'قانون حمایت خانواده' }, { key: 'tab-islamic-penal-code', label: 'قانون مجازات اسلامی' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/child_protection_law.json' }
        ]
    },
    'tab-smuggling-law': {
        title: 'قانون مبارزه با قاچاق کالا و ارز',
        info: 'قانون مبارزه با قاچاق کالا و ارز مصوب ۱۳۹۲/۱۰/۰۳ با اصلاحات بعدی (۸۹ ماده با مواد مکرر): تعریف قاچاق، مجازات‌ها، رسیدگی و ستاد مبارزه.',
        article_word: 'ماده',
        related: [{ key: 'tab-customs-law', label: 'قانون امور گمرکی' }, { key: 'tab-economic-disruptors-law', label: 'قانون مجازات اخلالگران در نظام اقتصادی' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/smuggling_goods_currency_law.json' }
        ]
    },
    'tab-lawyers-law': {
        title: 'قانون وکالت',
        info: 'قانون وکالت مصوب ۱۳۱۵/۱۱/۲۵ با اصلاحات بعدی (۵۸ ماده): درجات وکالت، شرایط پروانه، تکالیف و تخلفات وکلا.',
        article_word: 'ماده',
        related: [{ key: 'tab-bar-association-independence-law', label: 'لایحه استقلال کانون وکلا' }, { key: 'tab-civil-procedure-code', label: 'آیین دادرسی مدنی' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/lawyers_law.json' }
        ]
    },
    'tab-land-housing-rent-law': {
        title: 'قانون ساماندهی بازار زمین، مسکن و اجاره‌بها',
        info: 'قانون ساماندهی بازار زمین، مسکن و اجاره‌بها مصوب ۱۴۰۳/۰۲/۱۰ (۱۵ ماده): اصلاح مواد مالیاتی مربوط به اجاره و املاک خالی و سایر مقررات بازار مسکن.',
        article_word: 'ماده',
        related: [{ key: 'tab-direct-taxes-law', label: 'قانون مالیات‌های مستقیم' }, { key: 'tab-landlord-tenant-law', label: 'قانون روابط موجر و مستأجر' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/land_housing_rent_law.json' }
        ]
    },
    'tab-direct-tax-amendment-law': {
        title: 'قانون اصلاح قانون مالیات‌های مستقیم (۱۳۹۴)',
        info: 'قانون اصلاح قانون مالیات‌های مستقیم مصوب ۱۳۹۴/۰۴/۳۱ (لازم‌الاجرا از ۱۳۹۵/۰۱/۰۱): ماده واحده با ۶۰ بند؛ هر «بند» جای «ماده» آمده است.',
        article_word: 'بند',
        related: [{ key: 'tab-direct-taxes-law', label: 'قانون مالیات‌های مستقیم' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/direct_tax_amendment_law.json' }
        ]
    },
    'tab-divorce-rules-law': {
        title: 'قانون اصلاح مقررات مربوط به طلاق',
        info: 'قانون اصلاح مقررات مربوط به طلاق مصوب ۱۳۷۱/۰۸/۲۸ (ماده واحده با تبصره‌ها).',
        article_word: 'ماده',
        warning: 'این قانون جز بند «ب» تبصره ۶ به موجب بند ۸ ماده ۵۸ قانون حمایت خانواده (۱۳۹۱) نسخ شده و فقط برای مطالعه و مقایسه نگه داشته شده است.',
        related: [{ key: 'tab-family-protection-law', label: 'قانون حمایت خانواده (جایگزین)' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/divorce_rules_law.json' }
        ]
    },
    'tab-notaries-law': {
        title: 'قانون دفاتر اسناد رسمی و کانون سردفتران و دفتریاران',
        info: 'قانون دفاتر اسناد رسمی و کانون سردفتران و دفتریاران مصوب ۱۳۵۴/۰۴/۲۵: تشکیلات دفترخانه، شرایط سردفتر و دفتریار، تکالیف و تخلفات انتظامی.',
        article_word: 'ماده',
        warning: 'مواد ۵۵ و ۶۲ در فایل منبع نبودند. متن این قانون از PDF استخراج شده است؛ ممکن است فاصله یا املای برخی کلمات نیاز به ویرایش داشته باشد.',
        related: [{ key: 'tab-registration-law', label: 'قانون ثبت اسناد و املاک' }, { key: 'tab-registration-obligation-law', label: 'قانون الزام به ثبت رسمی معاملات' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/notaries_law.json' }
        ]
    },
    'tab-unregistered-property-law': {
        title: 'قانون تعیین تکلیف وضعیت ثبتی اراضی و ساختمان‌های فاقد سند رسمی',
        info: 'قانون تعیین تکلیف وضعیت ثبتی اراضی و ساختمان‌های فاقد سند رسمی مصوب ۱۳۹۰/۰۹/۲۰ (۱۸ ماده): صدور سند برای املاک بدون سابقه یا دارای سابقه‌ی ناقص ثبتی از طریق هیأت‌ها.',
        article_word: 'ماده',
        warning: 'متن این قانون از PDF استخراج شده است؛ ممکن است فاصله یا املای برخی کلمات نیاز به ویرایش داشته باشد.',
        related: [{ key: 'tab-registration-law', label: 'قانون ثبت اسناد و املاک' }, { key: 'tab-registration-obligation-law', label: 'قانون الزام به ثبت رسمی معاملات' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/unregistered_property_law.json' }
        ]
    },
    'tab-cadastre-law': {
        title: 'قانون جامع حدنگار (کاداستر) کشور',
        info: 'قانون جامع حدنگار (کاداستر) کشور مصوب ۱۳۹۳/۱۱/۱۲: تعاریف، سازمان متولی، سند مالکیت حدنگار و نظام جامع اطلاعات.',
        article_word: 'ماده',
        warning: 'متن این قانون از PDF استخراج شده است؛ ممکن است فاصله یا املای برخی کلمات نیاز به ویرایش داشته باشد.',
        related: [{ key: 'tab-registration-law', label: 'قانون ثبت اسناد و املاک' }, { key: 'tab-unregistered-property-law', label: 'تعیین تکلیف وضعیت ثبتی' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/cadastre_law.json' }
        ]
    },
    'tab-document-facilitation-law': {
        title: 'قانون تسهیل تنظیم اسناد در دفاتر اسناد رسمی',
        info: 'قانون تسهیل تنظیم اسناد در دفاتر اسناد رسمی مصوب ۱۳۸۵/۰۵/۲۴ (۸ ماده): تنظیم سند رسمی انتقال برای املاک دارای ابهام یا بازداشت.',
        article_word: 'ماده',
        warning: 'متن این قانون از PDF استخراج شده است؛ ممکن است فاصله یا املای برخی کلمات نیاز به ویرایش داشته باشد.',
        related: [{ key: 'tab-notaries-law', label: 'قانون دفاتر اسناد رسمی' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/document_facilitation_law.json' }
        ]
    },
    'tab-contracting-maturity-law': {
        title: 'قانون راجع به رشد متعاملین',
        info: 'قانون راجع به رشد متعاملین مصوب ۱۳۱۳/۰۶/۱۳ (ماده واحده): لزوم احراز رشد در معاملات برای افراد زیر ۱۸ سال شمسی.',
        article_word: 'ماده',
        warning: 'متن این قانون از PDF استخراج شده است؛ ممکن است فاصله یا املای برخی کلمات نیاز به ویرایش داشته باشد.',
        related: [{ key: 'tab-civil-code', label: 'قانون مدنی' }, { key: 'tab-notaries-law', label: 'قانون دفاتر اسناد رسمی' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/contracting_maturity_law.json' }
        ]
    },
    'tab-lawyer-license-law': {
        title: 'قانون کیفیت اخذ پروانه وکالت دادگستری',
        info: 'قانون کیفیت اخذ پروانه وکالت دادگستری مصوب ۱۳۷۶/۰۱/۱۷ (۷ ماده): پذیرش کارآموز وکالت با آزمون، شرایط پروانه، هیئت مدیره کانون‌ها و محل دفتر وکالت. ماده ۳ آن منسوخ شده است.',
        article_word: 'ماده',
        related: [{ key: 'tab-lawyers-law', label: 'قانون وکالت (۱۳۱۵)' }, { key: 'tab-bar-association-independence-law', label: 'لایحه استقلال کانون وکلا' }, { key: 'tab-lawyers-bylaw', label: 'نظامنامه قانون وکالت' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/lawyer_license_law.json' }
        ]
    },
    'tab-lawyers-bylaw': {
        title: 'نظامنامه قانون وکالت',
        info: 'نظامنامه قانون وکالت مصوب ۱۳۱۶ (۱۱۲ ماده): تشکیلات وکلا، کانون، ترفیع، تکالیف، لباس وکالت و محاکم انتظامی. موادی که با آیین‌نامه ۱۴۰۰ مغایرند ملغی هستند.',
        article_word: 'ماده',
        warning: 'موادی از این نظام‌نامه که با آیین‌نامه اجرایی لایحه قانونی استقلال کانون وکلا (۱۴۰۰) مغایرت دارد ملغی است. مواد ۹۷ و ۱۰۴ در منبع نبودند.',
        related: [{ key: 'tab-lawyers-law', label: 'قانون وکالت (۱۳۱۵)' }, { key: 'tab-bar-association-independence-law', label: 'لایحه استقلال کانون وکلا' }, { key: 'tab-lawyer-license-law', label: 'قانون کیفیت اخذ پروانه وکالت' }, { key: 'tab-bar-independence-bylaw-1400', label: 'آیین‌نامه اجرایی استقلال کانون وکلا (۱۴۰۰)' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/lawyers_bylaw.json' }
        ]
    },
    'tab-lawyer-fee-tariff-1385': {
        title: 'آیین‌نامه تعرفه حق‌الوکاله ۱۳۸۵ (ملغی)',
        info: 'آیین‌نامه تعرفه حق‌الوکاله، حق‌المشاوره و هزینه سفر وکلای دادگستری مصوب ۱۳۸۵/۰۴/۲۷ رئیس قوه قضاییه (۱۸ ماده). این آیین‌نامه با آیین‌نامه ۱۳۹۸/۱۲/۲۸ ملغی شده است.',
        article_word: 'ماده',
        warning: 'این آیین‌نامه به موجب آیین‌نامه تعرفه حق‌الوکاله، حق‌المشاوره و هزینه سفر وکلای دادگستری مصوب ۱۳۹۸/۱۲/۲۸ رئیس قوه قضاییه ملغی شده و فقط برای مطالعه و مقایسه نگه داشته شده است. مبالغ آن معتبر نیست.',
        related: [{ key: 'tab-lawyers-law', label: 'قانون وکالت (۱۳۱۵)' }, { key: 'tab-bar-association-independence-law', label: 'لایحه استقلال کانون وکلا' }, { key: 'tab-lawyer-fee-tariff-1398', label: 'آیین‌نامه تعرفه ۱۳۹۸ (جایگزین)' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/lawyer_fee_tariff_1385.json' }
        ]
    },
    'tab-building-presale-law': {
        title: 'قانون پیش‌فروش ساختمان',
        info: 'قانون پیش‌فروش ساختمان مصوب ۱۳۸۹/۱۰/۱۲ مجلس شورای اسلامی (۲۵ ماده). مواد ۲۰ و ۲۱ به موجب ماده ۱۵ قانون الزام به ثبت رسمی معاملات اموال غیرمنقول (۱۴۰۳) نسخ صریح شده‌اند.',
        article_word: 'ماده',
        related: [{ key: 'tab-registration-obligation-law', label: 'قانون الزام به ثبت رسمی معاملات اموال غیرمنقول' }, { key: 'tab-civil-code', label: 'قانون مدنی' }, { key: 'tab-registration-law', label: 'قانون ثبت اسناد و املاک' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch5/building_presale_law.json' }
        ]
    },
    'tab-securities-market-law': {
        title: 'قانون بازار اوراق بهادار جمهوری اسلامی ایران',
        info: 'قانون بازار اوراق بهادار جمهوری اسلامی ایران مصوب ۱۳۸۴/۰۹/۰۱ مجلس شورای اسلامی (۶۰ ماده): بورس، شورای عالی بورس، سازمان بورس و نهادهای مالی.',
        article_word: 'ماده',
        related: [{ key: 'tab-commercial-code', label: 'قانون تجارت' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch5/securities_market_law.json' }
        ]
    },
    'tab-bar-independence-bylaw-1400': {
        title: 'آیین‌نامه اجرایی لایحه قانونی استقلال کانون وکلا (۱۴۰۰)',
        info: 'آیین‌نامه اجرایی لایحه قانونی استقلال کانون وکلای دادگستری مصوب ۱۴۰۰/۰۴/۰۲ رئیس قوه قضاییه با اصلاحات ۱۴۰۲/۰۴/۱۱ (۱۶۴ ماده): انتخابات کانون، آزمون ورودی، پروانه وکالت و انتظامیات.',
        article_word: 'ماده',
        related: [{ key: 'tab-bar-association-independence-law', label: 'لایحه استقلال کانون وکلا' }, { key: 'tab-lawyers-law', label: 'قانون وکالت (۱۳۱۵)' }, { key: 'tab-lawyers-bylaw', label: 'نظامنامه قانون وکالت (۱۳۱۶)' }, { key: 'tab-bar-independence-bylaw-1334', label: 'آیین‌نامه ۱۳۳۴ (منسوخ)' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch5/bar_independence_bylaw_1400.json' }
        ]
    },
    'tab-lawyer-fee-tariff-1398': {
        title: 'آیین‌نامه تعرفه حق‌الوکاله ۱۳۹۸',
        info: 'آیین‌نامه تعرفه حق‌الوکاله، حق‌المشاوره و هزینه سفر وکلای دادگستری مصوب ۱۳۹۸/۱۲/۲۸ رئیس قوه قضاییه (۳۴ ماده). جایگزین آیین‌نامه ۱۳۸۵ شده است.',
        article_word: 'ماده',
        related: [{ key: 'tab-lawyer-fee-tariff-1385', label: 'آیین‌نامه تعرفه ۱۳۸۵ (ملغی)' }, { key: 'tab-lawyer-fee-organization', label: 'آیین‌نامه ساماندهی حق‌الوکاله (دستگاه‌های اجرایی)' }, { key: 'tab-lawyers-law', label: 'قانون وکالت (۱۳۱۵)' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch5/lawyer_fee_tariff_1398.json' }
        ]
    },
    'tab-lawyers-coop-fund-law': {
        title: 'قانون تشکیل صندوق تعاون وکلاء (۱۳۵۰)',
        info: 'قانون تشکیل صندوق تعاون وکلاء و تأمین هزینه‌های کانون وکلای دادگستری مصوب ۱۳۵۰/۳/۳۱ (۷ ماده).',
        article_word: 'ماده',
        related: [{ key: 'tab-lawyers-law', label: 'قانون وکالت (۱۳۱۵)' }, { key: 'tab-bar-association-independence-law', label: 'لایحه استقلال کانون وکلا' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch6/lawyers_coop_fund_law.json' }
        ]
    },
    'tab-lawyers-support-fund-law': {
        title: 'قانون تشکیل صندوق حمایت وکلا و کارگشایان (۱۳۵۵)',
        info: 'قانون تشکیل صندوق حمایت وکلا و کارگشایان دادگستری مصوب ۱۳۵۵/۱۰/۲۹ با اصلاحات تا ۱۳۷۵/۰۸/۲۳ (۱۸ ماده).',
        article_word: 'ماده',
        related: [{ key: 'tab-lawyers-law', label: 'قانون وکالت (۱۳۱۵)' }, { key: 'tab-bar-association-independence-law', label: 'لایحه استقلال کانون وکلا' }, { key: 'tab-lawyers-support-fund-bylaw-8', label: 'آیین‌نامه ماده ۸' }, { key: 'tab-lawyers-support-fund-bylaw-10', label: 'آیین‌نامه ماده ۱۰' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch6/lawyers_support_fund_law.json' }
        ]
    },
    'tab-lawyers-support-fund-bylaw-8': {
        title: 'آیین‌نامه ماده ۸ صندوق حمایت وکلا (۱۳۷۷)',
        info: 'آیین‌نامه ماده (۸) قانون تشکیل صندوق حمایت وکلا و کارگشایان دادگستری مصوب ۱۳۷۷/۱۲/۵ با اصلاحات تا ۱۴۰۰/۰۵/۱۷ (۲۲ ماده).',
        article_word: 'ماده',
        related: [{ key: 'tab-lawyers-support-fund-law', label: 'قانون صندوق حمایت وکلا' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch6/support_fund_bylaw_8.json' }
        ]
    },
    'tab-lawyers-support-fund-bylaw-10': {
        title: 'آیین‌نامه ماده ۱۰ صندوق حمایت: وکالت تسخیری و معاضدتی (۱۳۷۸)',
        info: 'آیین‌نامه اجرایی ماده ۱۰ قانون تشکیل صندوق حمایت وکلا و کارگشایان دادگستری مصوب ۱۳۷۸/۱۲/۲۱ رئیس قوه قضاییه (۱۲ ماده): حق‌الوکاله وکالت تسخیری و معاضدتی.',
        article_word: 'ماده',
        related: [{ key: 'tab-lawyers-support-fund-law', label: 'قانون صندوق حمایت وکلا' }, { key: 'tab-lawyer-fee-tariff-1398', label: 'آیین‌نامه تعرفه ۱۳۹۸' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch6/support_fund_bylaw_10.json' }
        ]
    },
    'tab-bar-independence-bylaw-1334': {
        title: 'آیین‌نامه استقلال کانون وکلا (۱۳۳۴، منسوخ)',
        info: 'آیین‌نامه لایحه قانونی استقلال کانون وکلای دادگستری مصوب ۱۳۳۴ (۸۹ ماده). به موجب ماده ۱۶۴ آیین‌نامه ۱۴۰۰ نسخ شده است.',
        article_word: 'ماده',
        warning: 'این آیین‌نامه به موجب ماده ۱۶۴ آیین‌نامه اجرایی لایحه قانونی استقلال کانون وکلا (۱۴۰۰) نسخ شده و فقط برای مطالعه‌ی تاریخی است.',
        related: [{ key: 'tab-bar-independence-bylaw-1400', label: 'آیین‌نامه اجرایی ۱۴۰۰ (جایگزین)' }, { key: 'tab-bar-association-independence-law', label: 'لایحه استقلال کانون وکلا' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch6/bar_independence_bylaw_1334.json' }
        ]
    },
    'tab-transfer-bylaw-west-azarbaijan': {
        title: 'آیین‌نامه نقل و انتقال وکلای کانون آذربایجان غربی',
        info: 'آیین‌نامه نقل و انتقالات و تغییر محل اشتغال وکلای عضو کانون وکلای دادگستری آذربایجان غربی (10 ماده).',
        article_word: 'ماده',
        related: [{ key: 'tab-bar-independence-bylaw-1400', label: 'آیین‌نامه اجرایی ۱۴۰۰' }, { key: 'tab-bar-association-independence-law', label: 'لایحه استقلال کانون وکلا' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch6/transfer_bylaw_west_azarbaijan.json' }
        ]
    },
    'tab-transfer-bylaw-kerman': {
        title: 'آیین‌نامه نقل و انتقال وکلای کانون کرمان',
        info: 'آیین‌نامه نقل و انتقالات و تغییر محل اشتغال وکلای عضو کانون وکلای دادگستری کرمان (9 ماده).',
        article_word: 'ماده',
        related: [{ key: 'tab-bar-independence-bylaw-1400', label: 'آیین‌نامه اجرایی ۱۴۰۰' }, { key: 'tab-bar-association-independence-law', label: 'لایحه استقلال کانون وکلا' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch6/transfer_bylaw_kerman.json' }
        ]
    },
    'tab-transfer-bylaw-khuzestan': {
        title: 'آیین‌نامه نقل و انتقال وکلای کانون خوزستان',
        info: 'آیین‌نامه نقل و انتقالات و تغییر محل اشتغال وکلای عضو کانون وکلای دادگستری خوزستان (15 ماده).',
        article_word: 'ماده',
        related: [{ key: 'tab-bar-independence-bylaw-1400', label: 'آیین‌نامه اجرایی ۱۴۰۰' }, { key: 'tab-bar-association-independence-law', label: 'لایحه استقلال کانون وکلا' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch6/transfer_bylaw_khuzestan.json' }
        ]
    },
    'tab-transfer-bylaw-fars': {
        title: 'آیین‌نامه نقل و انتقال وکلای کانون فارس و کهگیلویه و بویراحمد',
        info: 'آیین‌نامه نقل و انتقالات و تغییر محل اشتغال وکلای عضو کانون وکلای دادگستری فارس و کهگیلویه و بویراحمد (15 ماده).',
        article_word: 'ماده',
        related: [{ key: 'tab-bar-independence-bylaw-1400', label: 'آیین‌نامه اجرایی ۱۴۰۰' }, { key: 'tab-bar-association-independence-law', label: 'لایحه استقلال کانون وکلا' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch6/transfer_bylaw_fars.json' }
        ]
    },
    'tab-transfer-bylaw-markazi': {
        title: 'آیین‌نامه نقل و انتقال وکلای کانون مرکز',
        info: 'آیین‌نامه نقل و انتقالات و تغییر محل اشتغال وکلای عضو کانون وکلای دادگستری مرکز (12 ماده).',
        article_word: 'ماده',
        related: [{ key: 'tab-bar-independence-bylaw-1400', label: 'آیین‌نامه اجرایی ۱۴۰۰' }, { key: 'tab-bar-association-independence-law', label: 'لایحه استقلال کانون وکلا' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch6/transfer_bylaw_markazi.json' }
        ]
    },
    'tab-lawyer-selection-resolution': {
        title: 'مصوبه مجمع تشخیص: انتخاب وکیل (۱۳۷۰)',
        info: 'مصوبه مجمع تشخیص مصلحت نظام در خصوص حق اصحاب دعوی در انتخاب وکیل، مصوب ۱۳۷۰/۰۷/۱۱ (ماده واحده و سه تبصره).',
        article_word: 'ماده',
        related: [{ key: 'tab-lawyers-law', label: 'قانون وکالت (۱۳۱۵)' }, { key: 'tab-bar-association-independence-law', label: 'لایحه استقلال کانون وکلا' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch6/lawyer_selection_resolution.json' }
        ]
    },
    'tab-lawyer-fee-organization': {
        title: 'آیین‌نامه ساماندهی حق‌الوکاله و حق‌المشاوره (دستگاه‌های اجرایی)',
        info: 'آیین‌نامه ساماندهی حق‌الوکاله و حق‌المشاوره خدمات وکلای دادگستری و مشاوران حقوقی در دستگاه‌های اجرایی (تصویب‌نامه ۱۳۹۷/۰۹/۲۴ هیئت وزیران، ۶ ماده).',
        article_word: 'ماده',
        related: [{ key: 'tab-lawyers-law', label: 'قانون وکالت' }, { key: 'tab-lawyer-fee-tariff-1385', label: 'آیین‌نامه تعرفه ۱۳۸۵ (ملغی)' }, { key: 'tab-lawyer-fee-tariff-1398', label: 'آیین‌نامه تعرفه ۱۳۹۸' }],
        files: [
            { title: 'تمام مواد', path: 'laws/batch4/lawyer_fee_organization.json' }
        ]
    }
};
