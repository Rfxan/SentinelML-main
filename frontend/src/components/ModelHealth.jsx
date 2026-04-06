import React, { useState } from 'react';
import axios from 'axios';
import { RefreshCw, Activity, Target, Shield, AlertOctagon } from 'lucide-react';

const ModelHealth = ({ stats }) => {
  const [isRetraining, setIsRetraining] = useState(false);
  const safeStats = stats || {
    accuracy: 0,
    total_predictions: 0,
    attacks_caught: 0,
    evasion_caught: 0,
    poisoning_caught: 0,
    uptime_seconds: 0
  };
  const accuracy = safeStats.accuracy * 100;

  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      await axios.post('/api/retrain');
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => {
      setIsRetraining(false);
    }, 1500);
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;

  return (
    <div className="card flex flex-col h-full rounded-2xl bg-white dark:bg-[#1A1F2B] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none transition-colors duration-300">
      <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center transition-colors duration-300">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
          <Activity className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          Model Health
        </h2>
        <button
          onClick={handleRetrain}
          disabled={isRetraining}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isRetraining ? 'bg-indigo-900/50 text-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/20'}`}
        >
          <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
          {isRetraining ? 'Retraining...' : 'Retrain Model'}
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-center items-center gap-8">
        <div className="relative flex items-center justify-center">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle cx="64" cy="64" r="40" className="stroke-slate-200 dark:stroke-slate-700 transition-colors duration-300" strokeWidth="8" fill="none" />
            <circle
              cx="64" cy="64" r="40"
              className="stroke-indigo-500 transition-all duration-1000 ease-out"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-slate-800 dark:text-white tracking-tighter">
              {accuracy.toFixed(1)}<span className="text-xl text-slate-500 dark:text-slate-400">%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mt-4">
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 flex flex-col items-center transition-colors duration-300">
            <Target className="w-4 h-4 text-emerald-500 dark:text-emerald-400 mb-1" />
            <div className="text-xl font-mono font-bold text-slate-800 dark:text-white">{safeStats.total_predictions}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Total Served</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 flex flex-col items-center transition-colors duration-300">
            <Shield className="w-4 h-4 text-rose-500 dark:text-rose-400 mb-1" />
            <div className="text-xl font-mono font-bold text-slate-800 dark:text-white">{safeStats.attacks_caught}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Attacks Caught</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 flex flex-col items-center transition-colors duration-300">
            <AlertOctagon className="w-4 h-4 text-amber-500 dark:text-amber-400 mb-1" />
            <div className="text-xl font-mono font-bold text-slate-800 dark:text-white">{safeStats.evasion_caught}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Evasion Blocked</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 flex flex-col items-center transition-colors duration-300">
            <Activity className="w-4 h-4 text-purple-500 dark:text-purple-400 mb-1" />
            <div className="text-xl font-mono font-bold text-slate-800 dark:text-white">{safeStats.poisoning_caught}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">PoisonPrevented</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelHealth;
