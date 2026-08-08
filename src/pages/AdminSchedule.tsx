import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Plus, Printer, Edit2, Trash2 } from 'lucide-react';

export default function AdminSchedule() {
  const { t, language } = useAppContext();
  const [activeTab, setActiveTab] = useState<'saved' | 'generate'>('saved');
  const [workdays, setWorkdays] = useState<'sun_thu' | 'sat_thu'>('sun_thu');
  const [periods, setPeriods] = useState(7);
  const [selectedGrade, setSelectedGrade] = useState('');
  
  const DAYS = workdays === 'sun_thu' 
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'] 
    : ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const PERIOD_ARRAY = Array.from({length: periods}, (_, i) => i + 1);

  const GRADES = {
    'رياض الأطفال': ['KG1', 'KG2'],
    'المرحلة الابتدائية': ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'],
    'المرحلة الإعدادية': ['الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي'],
    'المرحلة الثانوية': ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي']
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 min-h-[600px]">
      
      <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 pb-2 print:hidden">
        <button 
          onClick={() => setActiveTab('saved')}
          className={`font-bold pb-2 ${activeTab === 'saved' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}
        >
          الجداول المسجلة
        </button>
        <button 
          onClick={() => setActiveTab('generate')}
          className={`font-bold pb-2 flex items-center gap-1 ${activeTab === 'generate' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}
        >
          <Plus className="w-4 h-4" /> إنشاء جدول جديد
        </button>
      </div>

      {activeTab === 'saved' ? (
        <div className="print:block">
          <div className="flex justify-between items-center mb-6 print:hidden">
            <select className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg min-w-[200px]">
              <option value="">تصفية حسب الصف...</option>
              {Object.entries(GRADES).map(([group, list]) => (
                <optgroup label={group} key={group}>
                  {list.map(g => <option key={g} value={g}>{g}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="space-y-8">
            {/* Example Saved Timetable */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 relative">
              <div className="absolute top-4 left-4 flex gap-2 rtl:left-auto rtl:right-4 print:hidden">
                <button onClick={() => window.print()} className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-lg"><Printer className="w-4 h-4"/></button>
                <button className="p-2 text-blue-500 hover:text-blue-700 bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4"/></button>
                <button className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
              </div>

              {/* Print Header */}
              <div className="hidden print:flex flex-col items-center mb-6 border-b-2 border-black pb-4 text-center">
                <div className="flex justify-between w-full mb-4 font-bold text-lg" dir="rtl">
                  <div>
                    <p>محافظة القليوبية</p>
                    <p>مديرية التربية والتعليم</p>
                    <p>إدارة بنها التعليمية</p>
                    <p>مدرسة مصطفى كامل الرسمية المتميزة للغات</p>
                  </div>
                  <div className="w-24 h-24 flex items-center justify-center">
                    <img src="/school_logo.png" alt="School Logo" className="w-24 h-24 object-contain rounded-full" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold underline mb-2">جدول الحصص الأسبوعي</h1>
                <div className="flex justify-between w-full text-sm font-bold" dir="rtl">
                  <p>الصف: الصف الأول الإعدادي</p>
                  <p>الفصل: 1/A</p>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-4 print:hidden">الصف الأول الإعدادي - فصل 1/A</h3>
              <div className="overflow-x-auto printable-table">
                <table className="w-full text-sm text-center border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th className="px-2 py-3 border border-slate-200 w-24">اليوم / الحصة</th>
                      {[1,2,3,4,5,6,7].map(p => <th key={p} className="px-2 py-3 border border-slate-200 min-w-[100px]">الحصة {p}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map(day => (
                      <tr key={day}>
                        <td className="px-2 py-4 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200">{day}</td>
                        {[1,2,3,4,5,6,7].map(p => (
                          <td key={p} className="px-2 py-2 border border-slate-200 text-xs">
                            <div className="font-bold">اللغة العربية</div>
                            <div className="text-slate-500">أ. إبراهيم</div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold mb-2">الصف الدراسي</label>
              <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                <option value="">اختر الصف...</option>
                {Object.entries(GRADES).map(([group, list]) => (
                  <optgroup label={group} key={group}>
                    {list.map(g => <option key={g} value={g}>{g}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">الفصل (القسم)</label>
              <input type="text" placeholder="مثال: A, B, 1" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">أيام العمل</label>
              <select 
                value={workdays} 
                onChange={e => setWorkdays(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <option value="sun_thu">الأحد إلى الخميس</option>
                <option value="sat_thu">السبت إلى الخميس</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">عدد الحصص يومياً</label>
              <select 
                value={periods} 
                onChange={e => setPeriods(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n} حصص</option>)}
              </select>
            </div>
          </div>

          <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg mb-8">
            توليد شبكة الجدول
          </button>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-center border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-2 py-3 border-r dark:border-slate-700 w-24">اليوم / الحصة</th>
                  {PERIOD_ARRAY.map(p => <th key={p} className="px-2 py-3 border-r dark:border-slate-700 min-w-[120px]">الحصة {p}</th>)}
                </tr>
              </thead>
              <tbody>
                {DAYS.map(day => (
                  <tr key={day} className="border-b border-slate-200 dark:border-slate-700">
                    <td className="px-2 py-4 font-bold bg-slate-50 dark:bg-slate-900 border-r dark:border-slate-700">{day}</td>
                    {PERIOD_ARRAY.map(p => (
                      <td key={p} className="px-2 py-2 border-r dark:border-slate-700">
                        <input 
                          placeholder="المادة - المعلم" 
                          className="w-full text-xs p-1 bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 rounded text-center"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800">
              حفظ الجدول
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
