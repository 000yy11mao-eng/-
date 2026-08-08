import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { collection, addDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserPlus, UserCheck } from 'lucide-react';

export default function AdminDashboard() {
  const { t, language } = useAppContext();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [app_teachers, setTeachers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'register' | 'attendance'>('attendance');

  const fetchTeachers = async () => {
    const snapshot = await getDocs(collection(db, 'app_teachers'));
    setTeachers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!name || !phone) return;

    setLoading(true);
    try {
      const generatedCode = `TCH-${Math.floor(1000 + Math.random() * 9000)}`;
      
      await addDoc(collection(db, 'app_teachers'), {
        name,
        phone,
        code: generatedCode,
        createdAt: new Date().toISOString()
      });

      setSuccess((language === 'ar' ? 'تم تسجيل المعلم بنجاح. الكود السري: ' : 'Teacher registered successfully. Secret Code: ') + generatedCode);
      setName(''); setPhone('');
      fetchTeachers();
    } catch (err) {
      setError('Error registering teacher');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 min-h-[500px]">
      
      <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`font-bold pb-2 ${activeTab === 'attendance' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}
        >
          حضور الحصص
        </button>
        <button 
          onClick={() => setActiveTab('register')}
          className={`font-bold pb-2 ${activeTab === 'register' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}
        >
          تسجيل المعلمين
        </button>
      </div>

      {activeTab === 'register' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 border-r rtl:border-l rtl:border-r-0 border-slate-200 dark:border-slate-700 pr-0 lg:pr-8 rtl:pr-0 rtl:lg:pl-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><UserPlus className="w-5 h-5 text-emerald-500" /> {t('register_teacher')}</h2>
            
            {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800/50">{error}</div>}
            {success && <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-base font-bold border border-emerald-200 dark:border-emerald-800/50" dir="ltr">{success}</div>}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('full_name')}</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('phone')}</label>
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-left" dir="ltr" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors">
                {loading ? '...' : t('register')}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold mb-6">{t('app_teachers')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="px-4 py-3">{t('full_name')}</th>
                    <th className="px-4 py-3">{t('phone')}</th>
                    <th className="px-4 py-3 text-red-500 font-bold">{t('secret_code')} (Masked)</th>
                  </tr>
                </thead>
                <tbody>
                  {app_teachers.map(teacher => (
                    <tr key={teacher.id} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="px-4 py-3 font-medium">{teacher.name}</td>
                      <td className="px-4 py-3" dir="ltr">{teacher.phone}</td>
                      <td className="px-4 py-3 text-slate-400 tracking-widest" dir="ltr">TCH-****</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2"><UserCheck className="w-5 h-5 text-emerald-500" /> إدارة حضور الحصص</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <select className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg min-w-[150px]">
              <option value="">الصف...</option>
              <option value="kg1">KG1</option>
              <option value="g1">الصف الأول</option>
              <option value="prep1">الصف الأول الإعدادي</option>
            </select>
            <select className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg min-w-[150px]">
              <option value="">الفصل...</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
            <select className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg min-w-[150px]">
              <option value="">الحصة...</option>
              {[1,2,3,4,5,6,7].map(p => <option key={p} value={p}>الحصة {p}</option>)}
            </select>
            <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors">
              عرض السجل
            </button>
          </div>
          
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg mb-1">الصف الأول الإعدادي - فصل A</h3>
                <p className="text-sm text-slate-500">الحصة الأولى - لغة عربية</p>
              </div>
              <div className="text-left rtl:text-right">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">المعلم المسؤول: أ. أحمد محمود</p>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded text-xs font-bold mt-1">
                  حاضر
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">اسم الطالب</th>
                    <th className="px-4 py-3">حالة الحضور</th>
                    <th className="px-4 py-3">ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 font-medium">يوسف محمد</td>
                    <td className="px-4 py-3">
                      <select className="bg-transparent border border-slate-200 dark:border-slate-700 rounded p-1">
                        <option value="present">حاضر</option>
                        <option value="absent">غائب</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input type="text" placeholder="-" className="w-full bg-transparent border-b border-transparent focus:border-emerald-500 outline-none" />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 font-medium">عمر مصطفى</td>
                    <td className="px-4 py-3">
                      <select className="bg-transparent border border-slate-200 dark:border-slate-700 rounded p-1">
                        <option value="present">حاضر</option>
                        <option value="absent">غائب</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input type="text" placeholder="-" className="w-full bg-transparent border-b border-transparent focus:border-emerald-500 outline-none" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors">
                حفظ وإرسال إشعار للمعلم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
