import React, { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import { LogOut, User, Moon, Sun, Languages, Menu, X, Users, Calendar, AlertTriangle, BookOpen, FileText, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
  const { user, logout } = useAuth();
  const { language, theme, toggleLanguage, toggleTheme, t } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { path: '/admin', label: t('teachers'), icon: <Users className="w-5 h-5" /> },
    { path: '/admin/schedule', label: t('schedule'), icon: <Calendar className="w-5 h-5" /> },
    { path: '/admin/substitute', label: t('substitute_dispatch'), icon: <AlertTriangle className="w-5 h-5" /> },
    { path: '/admin/messages', label: t('messages') || (language === 'ar' ? 'الرسائل' : 'Messages'), icon: <MessageSquare className="w-5 h-5" /> },
  ];

  const teacherLinks = [
    { path: '/teacher', label: t('evaluations') || (language === 'ar' ? 'التقييمات' : 'Evaluations'), icon: <BookOpen className="w-5 h-5" /> },
    { path: '/teacher/schedule', label: t('schedule'), icon: <FileText className="w-5 h-5" /> },
    { path: '/teacher/messages', label: t('messages') || (language === 'ar' ? 'الرسائل' : 'Messages'), icon: <MessageSquare className="w-5 h-5" /> },
  ];

  const links = user?.role === 'admin' ? adminLinks : teacherLinks;

  return (
    <div className={cn("min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100", language === 'ar' ? 'font-arabic' : 'font-sans')}>
      {/* Drawer Overlay */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity print:hidden" 
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={cn(
        "fixed top-0 bottom-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-2xl transition-transform duration-300 ease-in-out print:hidden flex flex-col",
        language === 'ar' ? "right-0" : "left-0",
        drawerOpen 
          ? "translate-x-0" 
          : (language === 'ar' ? "translate-x-full" : "-translate-x-full")
      )}>
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
          <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
            {t('dashboard')}
          </span>
          <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  location.pathname === link.path 
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
            <User className="w-5 h-5 shrink-0" />
            <span className="truncate">{user?.name}</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md print:hidden sticky top-0 z-30">
        <div className="px-4 h-16 flex items-center justify-between">
          
          {/* RIGHT SIDE (in RTL, this is technically the start, but we use flex layout) */}
          <div className="flex items-center gap-4 rtl:flex-row-reverse ltr:flex-row">
            {/* LEFT SIDE: Qalyubia Logo (independently on the far left) */}
            <div className="hidden sm:block">
              <img src="/qalyubia_logo.png" alt="Qalyubia Governorate Logo" className="w-10 h-10 object-contain rounded-full bg-white p-0.5" />
            </div>
            
            <div className="flex items-center gap-2 border-l border-slate-700 pl-4 rtl:border-r rtl:border-l-0 rtl:pr-4">
              <button onClick={toggleTheme} className="p-2 hover:bg-slate-800 rounded-full transition-colors hidden sm:block">
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={toggleLanguage} className="p-2 hover:bg-slate-800 rounded-full transition-colors hidden sm:block">
                <Languages className="w-5 h-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors text-sm font-bold ml-2 rtl:mr-2 rtl:ml-0"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('logout')}</span>
              </button>
            </div>
          </div>
          
          {/* RIGHT SIDE: Hamburger + School Logo (in RTL this is the right side) */}
          <div className="flex items-center gap-4 rtl:flex-row ltr:flex-row-reverse">
             <div className="flex items-center gap-3">
               <img src="/school_logo.png" alt="School Logo" className="w-10 h-10 object-contain rounded-full bg-white p-0.5" />
               <button 
                  onClick={() => setDrawerOpen(true)} 
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Toggle Menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 font-medium print:hidden border-t border-slate-200 dark:border-slate-800 mt-auto">
        طلابنا اليوم.. معلّمونا غداً 🌟 | كل التقدير لمعلّمي مدرسة مصطفى كامل الرسمية المتميزة للغات
      </footer>
    </div>
  );
}
