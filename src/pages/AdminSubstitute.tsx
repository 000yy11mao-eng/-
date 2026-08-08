import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AlertTriangle } from 'lucide-react';

const PERIODS = [1, 2, 3, 4, 5, 6, 7];

export default function AdminSubstitute() {
  const { t, language } = useAppContext();
  const [selectedPeriod, setSelectedPeriod] = useState<number | ''>('');
  
  const handleAlert = () => {
    alert("Alert Sent!");
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 min-h-[500px]">
      <div className="max-w-3xl">
        <h2 className="text-lg font-bold mb-4">{t('substitute_dispatch')}</h2>
        
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-amber-800 dark:text-amber-500 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> 1. {t('mark_absent')}</h3>
          <div className="flex gap-4">
            <select className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
              <option value="">Select Teacher...</option>
              <option value="1">Ahmed - Math</option>
              <option value="2">Mona - Science</option>
            </select>
            <button className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors">Mark Absent Today</button>
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <h3 className="font-bold mb-4 text-emerald-600 dark:text-emerald-400">2. {t('assign_substitute')} (Smart Filter)</h3>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">Target Period</label>
              <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg" value={selectedPeriod} onChange={e => setSelectedPeriod(Number(e.target.value))}>
                <option value="">Select Period to cover...</option>
                {PERIODS.map(p => <option key={p} value={p}>Period {p}</option>)}
              </select>
            </div>
          </div>

          {selectedPeriod !== '' && (
            <div className="space-y-3">
              <p className="text-sm text-slate-500 font-medium">Available Teachers (100% Free Period {selectedPeriod}):</p>
              {/* Mocked Available Teachers */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-lg">
                <div>
                  <p className="font-bold">Ibrahim - Arabic</p>
                  <p className="text-xs text-slate-500">Currently: Free</p>
                </div>
                <button onClick={handleAlert} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> {t('send_alert')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
