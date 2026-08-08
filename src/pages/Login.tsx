import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import { School, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginAdmin, loginTeacher, loginGuest } = useAuth();
  const { language, t } = useAppContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isAdmin) {
        const success = loginAdmin(username, password);
        if (!success) setError(language === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials');
      } else {
        const success = await loginTeacher(code);
        if (!success) setError(language === 'ar' ? 'الكود السري غير صحيح' : 'Invalid secret code');
      }
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ أثناء تسجيل الدخول' : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-slate-900 text-slate-100", language === 'ar' ? 'font-arabic' : 'font-sans')}>
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {language === 'ar' ? 'المنظومة الإلكترونية الشاملة' : 'Smart School Operations'}
          </h1>
          <p className="text-slate-400 text-sm">
            {language === 'ar' ? 'إدارة المدارس والجداول والشهادات الرسمية' : 'Automated Scheduling & Grade Assessment'}
          </p>
        </div>

        <div className="flex gap-2 mb-6 p-1 bg-slate-900 rounded-lg">
          <button
            type="button"
            className={cn("flex-1 py-2 rounded-md text-sm font-medium transition-colors", !isAdmin ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white")}
            onClick={() => setIsAdmin(false)}
          >
            {t('teacher_login')}
          </button>
          <button
            type="button"
            className={cn("flex-1 py-2 rounded-md text-sm font-medium transition-colors", isAdmin ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white")}
            onClick={() => setIsAdmin(true)}
          >
            {t('admin_login')}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {isAdmin ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('username')}</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('password')}</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all"
                  dir="ltr"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('secret_code')}</label>
              <input
                type="password"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="TCH-XXXX"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all tracking-widest text-center text-lg"
                dir="ltr"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? '...' : t('login')}
          </button>
          
          <button
            type="button"
            onClick={() => loginGuest()}
            className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg shadow transition-all mt-4"
          >
            دخول كـ ضيف (تجربة الواجهة)
          </button>
        </form>
      </div>
    </div>
  );
}
