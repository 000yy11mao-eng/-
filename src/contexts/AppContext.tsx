import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppContextType {
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
  toggleLanguage: () => void;
  toggleTheme: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<'en' | 'ar', string>> = {
  login: { en: 'Login', ar: 'تسجيل الدخول' },
  admin_login: { en: 'Admin Login', ar: 'دخول الإدارة' },
  teacher_login: { en: 'Teacher Login', ar: 'دخول المعلم' },
  username: { en: 'Username', ar: 'اسم المستخدم' },
  password: { en: 'Password', ar: 'كلمة المرور' },
  secret_code: { en: 'Secret Code', ar: 'الكود السري' },
  dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  teachers: { en: 'Teachers', ar: 'المعلمون' },
  schedule: { en: 'Schedule', ar: 'الجدول المدرسي' },
  evaluations: { en: 'Evaluations', ar: 'التقييمات' },
  logout: { en: 'Logout', ar: 'تسجيل الخروج' },
  register_teacher: { en: 'Register Teacher', ar: 'تسجيل معلم جديد' },
  full_name: { en: 'Full Name', ar: 'الاسم الرباعي' },
  phone: { en: 'Phone Number', ar: 'رقم الهاتف' },
  national_id: { en: 'National ID (14 digits)', ar: 'الرقم القومي (14 رقم)' },
  register: { en: 'Register', ar: 'تسجيل' },
  save: { en: 'Save', ar: 'حفظ' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  substitute_dispatch: { en: 'Substitute Dispatch', ar: 'إدارة الاحتياطي' },
  mark_absent: { en: 'Mark Absent', ar: 'تسجيل غياب' },
  assign_substitute: { en: 'Assign Substitute', ar: 'تكليف بديل' },
  send_alert: { en: 'Send Substitute Alert', ar: 'إرسال إشعار احتياطي' },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleLanguage = () => setLanguage(l => (l === 'ar' ? 'en' : 'ar'));
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <AppContext.Provider value={{ language, theme, toggleLanguage, toggleTheme, t }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
