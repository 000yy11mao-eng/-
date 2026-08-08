import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { BellRing, Plus, Minus } from 'lucide-react';
import { cn } from '../lib/utils';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function TeacherDashboard() {
  const { t, language } = useAppContext();
  const { user } = useAuth();
  const [alert, setAlert] = useState<any>(null);

  useEffect(() => {
    // Listen for alerts directed to this teacher
  }, []);

  const playAudioChime = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const triggerMockAlert = () => {
    setAlert({ message: '⚠️ تنبيه حصة احتياطي عاجلة! تم تكليفك ببديل حصة الآن في فصل [6/A]. يرجى التوجه للفصل فوراً.', class: '6/A' });
    playAudioChime();
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {alert && (
        <div className="bg-red-600 text-white p-6 rounded-2xl shadow-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-white/20 p-3 rounded-full shrink-0">
            <BellRing className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1" dir="rtl">{alert.message}</h2>
            <button onClick={() => setAlert(null)} className="mt-4 px-4 py-2 bg-white text-red-600 font-bold rounded-lg text-sm hover:bg-red-50 transition-colors">
              علم / Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end items-center">
        <button onClick={triggerMockAlert} className="text-xs px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-md text-slate-500">Test Alert</button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-2 sm:p-6 min-h-[500px]">
        <Gradebook />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Gradebook (القرار 136)
// -------------------------------------------------------------
function Gradebook() {
  const [students, setStudents] = useState([
    { id: 1, name: 'أحمد محمود', tasks: 8, hw: 4, activity: 4, weekly: 4, monthly: 8, behavior: 5 },
    { id: 2, name: 'فاطمة علي', tasks: 10, hw: 5, activity: 5, weekly: 5, monthly: 10, behavior: 5 },
  ]);

  const updateStudent = (id: number, field: string, val: number) => {
    setStudents(s => s.map(st => st.id === id ? { ...st, [field]: Math.max(0, val) } : st));
  };

  const calculateTotal = (s: any) => s.tasks + s.hw + s.activity + s.weekly + s.monthly + s.behavior;
  const getColor = (total: number) => {
    if (total >= 35) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    if (total >= 25) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (total >= 15) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  return (
    <div className="w-full">
      {/* Print Header */}
      <div className="hidden print:flex flex-col items-center mb-8 border-b-2 border-black pb-4 text-center">
        <div className="flex justify-between w-full mb-4 font-bold text-lg" dir="rtl">
          <div>
            <p>محافظة القليوبية</p>
            <p>مديرية التربية والتعليم</p>
            <p>إدارة بنها التعليمية</p>
            <p>مدرسة مصطفى كامل الرسمية المتميزة للغات</p>
          </div>
          <div className="w-24 h-24 flex items-center justify-center">
            <img src="/school_logo.png" alt="School Logo" className="w-24 h-24 object-cover rounded-full" />
          </div>
        </div>
        <h1 className="text-2xl font-bold underline mb-2">سجل درجات الطلاب أعمال السنة (القرار الوزاري 136)</h1>
        <div className="flex justify-between w-full text-sm font-bold" dir="rtl">
          <p>المادة: ...................</p>
          <p>الفصل: ...................</p>
          <p>إجمالي الطلاب: {students.length}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold print:hidden">التقييم الرسمي لأعمال السنة (القرار الوزاري 136)</h2>
        <button onClick={() => window.print()} className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-medium print:hidden">
          طباعة الكشف
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl printable-table">
        <table className="w-full text-sm text-center border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 border-r dark:border-slate-700 sticky rtl:right-0 ltr:left-0 bg-slate-50 dark:bg-slate-900 z-10 w-48">اسم الطالب</th>
              <th className="px-2 py-3 border-r dark:border-slate-700 min-w-[80px]">المهام (10)</th>
              <th className="px-2 py-3 border-r dark:border-slate-700 min-w-[80px]">الواجب (5)</th>
              <th className="px-2 py-3 border-r dark:border-slate-700 min-w-[80px]">النشاط (5)</th>
              <th className="px-2 py-3 border-r dark:border-slate-700 min-w-[80px]">أسبوعي (5)</th>
              <th className="px-2 py-3 border-r dark:border-slate-700 min-w-[80px]">شهري (10)</th>
              <th className="px-2 py-3 border-r dark:border-slate-700 min-w-[120px]">المواظبة والسلوك (5)</th>
              <th className="px-4 py-3 font-bold bg-slate-100 dark:bg-slate-800/50">المجموع (40)</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => {
              const total = calculateTotal(s);
              return (
                <tr key={s.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 border-r dark:border-slate-700 font-bold sticky rtl:right-0 ltr:left-0 bg-white dark:bg-slate-800 z-10">{s.name}</td>
                  
                  <GradeInput val={s.tasks} max={10} onChange={v => updateStudent(s.id, 'tasks', v)} />
                  <GradeInput val={s.hw} max={5} onChange={v => updateStudent(s.id, 'hw', v)} />
                  <GradeInput val={s.activity} max={5} onChange={v => updateStudent(s.id, 'activity', v)} />
                  <GradeInput val={s.weekly} max={5} onChange={v => updateStudent(s.id, 'weekly', v)} />
                  <GradeInput val={s.monthly} max={10} onChange={v => updateStudent(s.id, 'monthly', v)} />
                  
                  {/* Behavior + and - */}
                  <td className="px-2 py-2 border-r dark:border-slate-700">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => updateStudent(s.id, 'behavior', s.behavior - 1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 print:hidden"><Minus className="w-3 h-3" /></button>
                      <span className="font-bold w-4">{s.behavior}</span>
                      <button onClick={() => updateStudent(s.id, 'behavior', Math.min(5, s.behavior + 1))} className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 print:hidden"><Plus className="w-3 h-3" /></button>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 font-bold bg-slate-50 dark:bg-slate-900/50">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-bold print:border print:border-black print:bg-white print:text-black", getColor(total))}>
                      {total}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Print Footer */}
      <div className="hidden print:flex mt-12 justify-between items-center text-sm font-bold w-full" dir="rtl">
        <div>كتبه: ......................</div>
        <div>إملاء: ......................</div>
        <div>راجعة: ......................</div>
        <div>رئيس الكنترول: ......................</div>
        <div>مدير المدرسة: ......................</div>
      </div>
    </div>
  );
}

function GradeInput({ val, max, onChange }: { val: number, max: number, onChange: (v: number) => void }) {
  return (
    <td className="px-2 py-2 border-r dark:border-slate-700">
      <input 
        type="number" 
        value={val} 
        onChange={e => onChange(Number(e.target.value))}
        max={max}
        min={0}
        className="w-12 text-center bg-transparent border-b border-slate-300 dark:border-slate-600 focus:border-emerald-500 focus:outline-none print:border-none print:text-center appearance-none"
      />
    </td>
  );
}
