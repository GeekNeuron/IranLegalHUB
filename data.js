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
        info: 'قانون مجازات اسلامی در سال ۱۳۹۲ تصویب شد و شامل ۷۲۸ ماده در چهار کتاب کلیات، حدود، قصاص و دیات است.',
        article_word: 'ماده',
        files: [
            { title: 'کتاب اول: کلیات', path: 'laws/islamic_penal_code/islamic_penal_code_book_1.json' },
            { title: 'کتاب دوم: حدود', path: 'laws/islamic_penal_code/islamic_penal_code_book_2.json' },
            { title: 'کتاب سوم: قصاص', path: 'laws/islamic_penal_code/islamic_penal_code_book_3.json' },
            { title: 'کتاب چهارم: دیات', path: 'laws/islamic_penal_code/islamic_penal_code_book_4.json' }
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
    'tab-tazirat': {
        title: 'قانون مجازات اسلامی - کتاب پنجم (تعزیرات)',
        info: 'کتاب پنجم قانون مجازات اسلامی (تعزیرات) مصوب ۱۳۷۵. این فایل هنوز خالی است و باید تکمیل شود.',
        article_word: 'ماده',
        files: [
            { title: 'تمام مواد', path: 'laws/islamic_penal_code/islamic_penal_code_book_5_tazirat.json' }
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
        info: 'قانون مالیات‌های مستقیم مصوب ۱۳۶۶/۱۲/۳ با اصلاحات تا ۱۴۰۳ (بزرگ‌ترین قانون مجموعه، ۲۲۱ از ۲۸۲ ماده پیاده شده؛ چند ماده پراکنده کم‌اهمیت‌تر که عمدتاً منسوخ شده‌اند هنوز باقی مانده).',
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
    }
};
