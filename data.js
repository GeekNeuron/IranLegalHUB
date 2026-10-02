const lawManifest = {
    'tab-constitution': {
        title: 'قانون اساسی',
        info: 'قانون اساسی جمهوری اسلامی ایران در سال ۱۳۵۸ تصویب و در سال ۱۳۶۸ بازنگری شد. این قانون دارای ۱۷۷ اصل و یک مقدمه است.',
        article_word: 'اصل', 
        files: [
            { title: 'تمام اصول', path: 'laws/constitution/constitution.json' }
        ],
        quiz: [] // آزمون این بخش هنوز آماده نیست
    },
    'tab-civil-code': {
        title: 'قانون مدنی',
        info: 'قانون مدنی ایران در سه جلد تصویب شده و دارای ۱۳۳۵ ماده است. این قانون شالوده اصلی حقوق خصوصی ایران را تشکیل می‌دهد.',
        article_word: 'ماده',
        files: [
            { title: 'جلد اول (اموال، عقود، وصیت و ارث)', path: 'laws/civil_code/civil_code_vol_1.json' },
            { title: 'جلد دوم (اشخاص)', path: 'laws/civil_code/civil_code_vol_2.json' },
            { title: 'جلد سوم (ادله اثبات دعوی)', path: 'laws/civil_code/civil_code_vol_3.json' }
        ],
        quiz: [] 
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
        ],
        quiz: [
            { question: 'کتاب اول قانون مجازات اسلامی چه نام دارد؟', options: ['کلیات', 'حدود', 'قصاص', 'دیات'], correctAnswer: 'کلیات' },
            { question: 'ماده ۱ قانون مجازات اسلامی شامل کدام موارد است؟', options: ['حدود، قصاص، دیات و تعزیرات', 'فقط حدود و قصاص', 'فقط دیات', 'جرایم رایانه‌ای'], correctAnswer: 'حدود، قصاص، دیات و تعزیرات' }
        ]
    },
    'tab-commercial-code': {
        title: 'قانون تجارت',
        info: 'قانون تجارت ایران در سال ۱۳۱۱ تصویب شد. بخش شرکت‌های سهامی آن در سال ۱۳۴۷ با لایحه‌ای کامل جایگزین گردید.',
        article_word: 'ماده',
        files: [
            { title: 'بخش اول: شرکت‌های سهامی (لایحه ۱۳۴۷)', path: 'laws/commercial_code/part_1_joint_stock_companies.json' },
            { title: 'بخش دوم: بدنه اصلی قانون (مصوب ۱۳۱۱)', path: 'laws/commercial_code/part_2_main_body.json' }
        ],
        quiz: []
    },
    'tab-civil-procedure-code': {
        title: 'قانون آیین دادرسی مدنی',
        info: 'قانون آیین دادرسی دادگاه‌های عمومی و انقلاب در امور مدنی در سال ۱۳۷۹ تصویب شد و دارای ۵۲۹ ماده است.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/civil_procedure_code/civil_procedure_code.json' }
        ],
        quiz: []
    },
    'tab-criminal-procedure-code': {
        title: 'قانون آیین دادرسی کیفری',
        info: 'قانون آیین دادرسی کیفری در سال ۱۳۹۲ به تصویب رسید و دارای ۶۹۹ ماده است.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/criminal_procedure_code/criminal_procedure_code.json' }
        ],
        quiz: []
    },
    'tab-labor-code': {
        title: 'قانون کار',
        info: 'قانون کار جمهوری اسلامی ایران مصوب ۱۳۶۹/۸/۲۹ با اصلاحات ۱۳۹۰، ۲۰۳ ماده. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/labor_code/labor_code.json' }
        ],
        quiz: []
    },
    'tab-family-protection-law': {
        title: 'قانون حمایت خانواده',
        info: 'قانون حمایت خانواده مصوب ۱۳۹۱/۱۲/۰۱ با اصلاح ماده ۵۳ در ۱۳۹۹. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/family_protection_law/family_protection_law.json' }
        ],
        quiz: []
    },
    'tab-check-issuance-law': {
        title: 'قانون صدور چک',
        info: 'قانون صدور چک مصوب ۱۳۵۵/۴/۱۶ با اصلاحات و الحاقات تا ۱۴۰۰/۱/۲۹ (و اصلاح مبالغ جزای نقدی ۱۴۰۳-۱۴۰۴). تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/check_issuance_law/check_issuance_law.json' }
        ],
        quiz: []
    },
    'tab-registration-law': {
        title: 'قانون ثبت اسناد و املاک',
        info: 'قانون ثبت اسناد و املاک مصوب ۱۳۱۰/۱۲/۲۶ با اصلاحات تا ۱۴۰۲، ۱۵۷ ماده. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/registration_law/registration_law.json' }
        ],
        quiz: []
    },
    'tab-landlord-tenant-law': {
        title: 'قانون روابط موجر و مستأجر',
        info: 'قانون روابط موجر و مستأجر مصوب ۱۳۷۶/۰۵/۲۶ با اصلاح ماده ۲ در ۱۴۰۳. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/landlord_tenant_law/landlord_tenant_law.json' }
        ],
        quiz: []
    },
    'tab-electronic-commerce-law': {
        title: 'قانون تجارت الکترونیکی',
        info: 'قانون تجارت الکترونیکی مصوب ۱۳۸۲/۱۰/۱۷، ۸۱ ماده. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/electronic_commerce_law/electronic_commerce_law.json' }
        ],
        quiz: []
    },
    'tab-direct-taxes-law': {
        title: 'قانون مالیات‌های مستقیم',
        info: 'قانون مالیات‌های مستقیم مصوب ۱۳۶۶/۱۲/۳ با اصلاحات تا ۱۴۰۳ (بزرگ‌ترین قانون مجموعه). تکمیل شد — ۲۲۵ ماده/بند موجود در متن فعلی؛ بقیه شماره‌ها طی اصلاحات تاریخی نسخ شده و در قانون فعلی وجود ندارند.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/direct_taxes_law/direct_taxes_law.json' }
        ],
        quiz: []
    },
    'tab-social-security-law': {
        title: 'قانون تأمین اجتماعی',
        info: 'قانون تأمین اجتماعی مصوب ۱۳۵۴/۰۴/۰۳ با اصلاحات تا ۱۴۰۴، ۱۱۸ ماده. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/social_security_law/social_security_law.json' }
        ],
        quiz: []
    },
    'tab-administrative-justice-court-law': {
        title: 'قانون دیوان عدالت اداری',
        info: 'قانون دیوان عدالت اداری مصوب ۱۳۹۲/۳/۲۵ با اصلاحات عمده ۱۴۰۲/۲/۱۰، ۱۲۴ ماده. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/administrative_justice_court_law/administrative_justice_court_law.json' }
        ],
        quiz: []
    },
    'tab-computer-crimes-law': {
        title: 'قانون جرائم رایانه‌ای',
        info: 'قانون جرائم رایانه‌ای مصوب ۱۳۸۸/۰۳/۰۵ (اکنون مواد ۷۲۹ تا ۷۸۲ کتاب پنجم قانون مجازات اسلامی). تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/computer_crimes_law/computer_crimes_law.json' }
        ],
        quiz: []
    },
    'tab-general-courts-law': {
        title: 'قانون تشکیل دادگاه‌های عمومی و انقلاب',
        info: 'قانون تشکیل دادگاه‌های عمومی و انقلاب مصوب ۱۳۷۳/۰۴/۱۵ با اصلاحات ۱۳۸۱، ۱۳۸۵ و ۱۳۹۲ (بسیاری از مواد منسوخ‌اند و برای مرجعیت تاریخی حفظ شده‌اند). تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/general_courts_law/general_courts_law.json' }
        ],
        quiz: []
    },
    'tab-consumer-rights-law': {
        title: 'قانون حمایت از حقوق مصرف‌کنندگان',
        info: 'قانون حمایت از حقوق مصرف‌کنندگان مصوب ۱۳۸۸/۰۷/۱۵ مجلس شورای اسلامی. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/five_statutes/consumer_rights_law.json' }
        ],
        quiz: []
    },
    'tab-insurance-law': {
        title: 'قانون بیمه',
        info: 'قانون بیمه مصوب ۱۳۱۶/۰۲/۰۷ مجلس شورای ملی، شامل مقررات معاملات بیمه، فسخ و بطلان و مسئولیت بیمه‌گر. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/five_statutes/insurance_law.json' }
        ],
        quiz: []
    },
    'tab-vat-law': {
        title: 'قانون مالیات بر ارزش افزوده',
        info: 'قانون مالیات بر ارزش افزوده مصوب ۱۴۰۰/۰۳/۰۲ مجلس شورای اسلامی. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/five_statutes/vat_law.json' }
        ],
        quiz: []
    },
    'tab-administrative-violations-law': {
        title: 'قانون رسیدگی به تخلفات اداری',
        info: 'قانون رسیدگی به تخلفات اداری مصوب ۱۳۷۲/۰۹/۰۷ مجلس شورای اسلامی. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/five_statutes/administrative_violations_law.json' }
        ],
        quiz: []
    },
    'tab-trade-unions-law': {
        title: 'قانون نظام صنفی کشور',
        info: 'قانون نظام صنفی کشور مصوب ۱۳۸۲/۱۲/۲۴ با الحاقات و اصلاحات تا ۱۴۰۳/۰۵/۰۲. تکمیل شد.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/five_statutes/trade_unions_law.json' }
        ],
        quiz: []
    },
    'tab-civil-judgment-enforcement-law': {
        title: 'قانون اجرای احکام مدنی',
        info: 'قانون اجرای احکام مدنی مصوب ۱۳۵۶ مجلس شورای ملی با اصلاحات بعدی، شامل ترتیب اجرای احکام، توقیف و فروش اموال و تأدیه طلب.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/civil_judgment_enforcement_law.json' }
        ],
        quiz: []
    },
    'tab-financial-judgment-enforcement-law': {
        title: 'قانون نحوه اجرای محکومیت‌های مالی',
        info: 'قانون نحوه اجرای محکومیت‌های مالی مصوب ۱۳۹۴ مجمع تشخیص مصلحت نظام.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/financial_judgment_enforcement_law.json' }
        ],
        quiz: []
    },
    'tab-dispute-resolution-councils-law': {
        title: 'قانون شوراهای حل اختلاف',
        info: 'قانون شوراهای حل اختلاف مصوب ۱۴۰۲ مجلس شورای اسلامی.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/dispute_resolution_councils_law.json' }
        ],
        quiz: []
    },
    'tab-traffic-violations-law': {
        title: 'قانون رسیدگی به تخلفات رانندگی',
        info: 'قانون رسیدگی به تخلفات رانندگی مصوب ۱۳۸۹ مجلس شورای اسلامی با اصلاحات و الحاقات بعدی.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/traffic_violations_law.json' }
        ],
        quiz: []
    },
    'tab-apartment-ownership-law': {
        title: 'قانون تملک آپارتمان‌ها',
        info: 'قانون تملک آپارتمان‌ها مصوب ۱۳۴۳ با آخرین اصلاحات.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/apartment_ownership_law.json' }
        ],
        quiz: []
    },
    'tab-anti-narcotics-law': {
        title: 'قانون مبارزه با مواد مخدر',
        info: 'قانون اصلاح قانون مبارزه با مواد مخدر و الحاق موادی به آن، مصوب ۱۳۷۶ با آخرین اصلاحات تا ۱۳۹۶.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/anti_narcotics_law.json' }
        ],
        quiz: []
    },
    'tab-anti-money-laundering-law': {
        title: 'قانون مبارزه با پولشویی',
        info: 'قانون مبارزه با پولشویی مصوب ۱۳۸۶ با آخرین اصلاحات تا ۱۳۹۷.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/anti_money_laundering_law.json' }
        ],
        quiz: []
    },
    'tab-family-youth-population-law': {
        title: 'قانون حمایت از خانواده و جوانی جمعیت',
        info: 'قانون حمایت از خانواده و جوانی جمعیت مصوب ۱۴۰۰ مجلس شورای اسلامی.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/family_youth_population_law.json' }
        ],
        quiz: []
    },
    'tab-bar-association-independence-law': {
        title: 'لایحه قانونی استقلال کانون وکلای دادگستری',
        info: 'لایحه قانونی استقلال کانون وکلای دادگستری مصوب ۱۳۳۳ کمیسیون مشترک مجلسین با اصلاحات بعدی.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch2/bar_association_independence_law.json' }
        ],
        quiz: []
    },
    'tab-civil-liability-law': {
        title: 'قانون مسئولیت مدنی',
        info: 'قانون مسئولیت مدنی مصوب ۱۳۳۹، مبنای جبران خسارت (تقصیر، تخفیف خسارت، مسئولیت کارفرما و دولت).',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/civil_liability_law.json' }
        ],
        quiz: []
    },
    'tab-third-party-insurance-law': {
        title: 'قانون بیمه اجباری خسارات واردشده به شخص ثالث',
        info: 'قانون بیمه اجباری خسارات واردشده به شخص ثالث در اثر حوادث ناشی از وسایل نقلیه مصوب ۱۳۹۵؛ جایگزین قانون ۱۳۸۷ شده است.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/third_party_insurance_law.json' }
        ],
        quiz: []
    },
    'tab-authors-rights-law': {
        title: 'قانون حمایت از حقوق مؤلفان، مصنفان و هنرمندان',
        info: 'قانون حمایت از حقوق مؤلفان، مصنفان و هنرمندان مصوب ۱۳۴۸ (حق مؤلف و حقوق آثار ادبی و هنری).',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/authors_rights_law.json' }
        ],
        quiz: []
    },
    'tab-judges-conduct-law': {
        title: 'قانون نظارت بر رفتار قضات',
        info: 'قانون نظارت بر رفتار قضات مصوب ۱۳۹۰: تخلفات انتظامی قضات، دادسرا و دادگاه عالی انتظامی و رسیدگی به صلاحیت قضات.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/judges_conduct_supervision_law.json' }
        ],
        quiz: []
    },
    'tab-software-rights-law': {
        title: 'قانون حمایت از حقوق پدیدآورندگان نرم‌افزارهای رایانه‌ای',
        info: 'قانون حمایت از حقوق پدیدآورندگان نرم‌افزارهای رایانه‌ای مصوب ۱۳۷۹ (حقوق مادی و معنوی نرم‌افزار).',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/software_rights_law.json' }
        ],
        quiz: []
    },
    'tab-government-revenue-law': {
        title: 'قانون وصول برخی از درآمدهای دولت و مصرف آن در موارد معین',
        info: 'قانون وصول برخی از درآمدهای دولت و مصرف آن در موارد معین مصوب ۱۳۷۳؛ شامل هزینه‌های دادرسی و ثبتی و درآمد دستگاه‌ها.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/government_revenue_law.json' }
        ],
        quiz: []
    },
    'tab-criminal-courts-law': {
        title: 'قانون تشکیل دادگاه‌های کیفری ۱ و ۲ (منسوخ)',
        info: 'این قانون مصوب ۱۳۶۸ منسوخ شده و فقط برای مطالعه‌ی تاریخی نگه داشته شده است؛ برای رسیدگی کنونی به قانون آیین دادرسی کیفری مراجعه کنید.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/batch3/criminal_courts_1_2_law.json' }
        ],
        quiz: []
    }
};
