import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7];

export default function TeacherSchedule() {
  const { t, language } = useAppContext();
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 min-h-[500px]">
      <h2 className="text-lg font-bold mb-4">{t('schedule')}</h2>
      
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm text-center border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-2 py-3 border-r dark:border-slate-700 w-24">Day / Period</th>
              {PERIODS.map(p => <th key={p} className="px-2 py-3 border-r dark:border-slate-700 min-w-[120px]">Period {p}</th>)}
            </tr>
          </thead>
          <tbody>
            {DAYS.map(day => (
              <tr key={day} className="border-b border-slate-200 dark:border-slate-700">
                <td className="px-2 py-4 font-bold bg-slate-50 dark:bg-slate-900 border-r dark:border-slate-700">{day}</td>
                {PERIODS.map(p => (
                  <td key={p} className="px-2 py-2 border-r dark:border-slate-700">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded">
                      Class {p}/A
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
