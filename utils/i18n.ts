
const translations = {
  en: {
    'app_title': 'Marketing AI',
    'home': 'Home',
    'creations_hub': 'Creations Hub',
    'brand': 'Brand',
    'more': 'More',
    'create': 'Create',
    // Add more translations here
    'dashboard.welcome': 'Welcome to your AI Marketing Suite',
    'dashboard.description': 'All-in-one platform to supercharge your marketing with AI. Create videos, images, content, and strategies in minutes.',
    'dashboard.audience.smb': 'Small Business Owners',
    'dashboard.audience.creators': 'Solo Creators & Influencers',
    'dashboard.audience.marketers': 'Marketing Professionals',
    'dashboard.shortcuts': 'Quick Shortcuts',
    'dashboard.brand_setup': 'Start Brand Setup',
    'dashboard.ugc_creator': 'Open UGC Video Creator',
    'dashboard.content_generator': 'Open Content Generator',
    'dashboard.view_creations': 'View Creations Hub',

    'signin.title': 'Sign In',
    'signin.email': 'Email',
    'signin.password': 'Password',
    'signin.button': 'Sign In',
    'signin.no_account': "Don't have an account?",
    'signin.signup_link': 'Sign Up',

    'settings.account': 'Account',
    'settings.email': 'Email',
    'settings.logout': 'Log Out',
    'settings.language': 'Language',
    'settings.tools_links': 'Tools',

    'brand.title': 'Brand Identity',
    'brand.reanalyze': 'Re-analyze Brand Identity',
    'brand.setup.welcome': "Let's set up your brand",
    'brand.setup.prompt': 'Enter your website URL or describe your business.',
    'brand.setup.url': 'Website URL (Optional)',
    'brand.setup.description': 'Business Description',
    'brand.setup.analyze': 'Analyze',
    'brand.setup.preview': 'Brand Profile Preview',
    'brand.setup.save': 'Save Brand Profile',

    'image_generator.prompt': 'Enter your image prompt',
    'image_generator.aspect_ratio': 'Aspect Ratio',
    'image_generator.generate': 'Generate Image',
    'image_generator.download': 'Download',
    'image_generator.save_to_creations': 'Save to Creations',
    
  },
  ar: {
    'app_title': 'Marketing AI',
    'home': 'الرئيسية',
    'creations_hub': 'مركز الإبداعات',
    'brand': 'العلامة التجارية',
    'more': 'المزيد',
    'create': 'إنشاء',
    // Add more translations here
    'dashboard.welcome': 'أهلاً بك في مجموعة التسويق بالذكاء الاصطناعي',
    'dashboard.description': 'منصة متكاملة لتعزيز تسويقك بالذكاء الاصطناعي. أنشئ مقاطع فيديو وصور ومحتوى واستراتيجيات في دقائق.',
    'dashboard.audience.smb': 'أصحاب الأعمال الصغيرة',
    'dashboard.audience.creators': 'المبدعون وصناع المحتوى',
    'dashboard.audience.marketers': 'محترفو التسويق',
    'dashboard.shortcuts': 'اختصارات سريعة',
    'dashboard.brand_setup': 'ابدأ إعداد العلامة التجارية',
    'dashboard.ugc_creator': 'افتح منشئ فيديو UGC',
    'dashboard.content_generator': 'افتح منشئ المحتوى',
    'dashboard.view_creations': 'عرض مركز الإبداعات',

    'signin.title': 'تسجيل الدخول',
    'signin.email': 'البريد الإلكتروني',
    'signin.password': 'كلمة المرور',
    'signin.button': 'تسجيل الدخول',
    'signin.no_account': 'ليس لديك حساب؟',
    'signin.signup_link': 'أنشئ حساباً',
    
    'settings.account': 'الحساب',
    'settings.email': 'البريد الإلكتروني',
    'settings.logout': 'تسجيل الخروج',
    'settings.language': 'اللغة',
    'settings.tools_links': 'الأدوات',

    'brand.title': 'هوية العلامة التجارية',
    'brand.reanalyze': 'إعادة تحليل هوية العلامة التجارية',
    'brand.setup.welcome': 'لنقم بإعداد علامتك التجارية',
    'brand.setup.prompt': 'أدخل رابط موقعك الإلكتروني أو صف عملك.',
    'brand.setup.url': 'رابط الموقع (اختياري)',
    'brand.setup.description': 'وصف العمل',
    'brand.setup.analyze': 'تحليل',
    'brand.setup.preview': 'معاينة ملف العلامة التجارية',
    'brand.setup.save': 'حفظ ملف العلامة التجارية',

    'image_generator.prompt': 'أدخل وصف الصورة',
    'image_generator.aspect_ratio': 'نسبة العرض إلى الارتفاع',
    'image_generator.generate': 'إنشاء صورة',
    'image_generator.download': 'تحميل',
    'image_generator.save_to_creations': 'حفظ في الإبداعات',
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations['en'];

export const getTranslation = (lang: Language, key: TranslationKey): string => {
  return translations[lang][key] || translations['en'][key];
};