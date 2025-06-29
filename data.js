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
    }
};
