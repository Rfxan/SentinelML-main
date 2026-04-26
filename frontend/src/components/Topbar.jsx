import React, { useState } from 'react';
import { ChevronRight, ShieldCheck, ShieldAlert, Activity, Sun, Moon, Play, RefreshCw, Check } from 'lucide-react';
import NotificationBell from './NotificationBell';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const Topbar = ({ isLive, theme, setTheme, activeItem }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [demoState, setDemoState] = useState('idle'); // 'idle' | 'running' | 'complete'

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate scan
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleRunDemo = async () => {
    setDemoState('running');
    try {
      // Step 1: Blitz (25 events)
      await axios.post(`${API_BASE}/simulate`, { mode: 'blitz', count: 25 });
      
      // Wait 3 seconds
      await new Promise(r => setTimeout(r, 3000));
      
      // Step 2: Evasion (10 events)
      await axios.post(`${API_BASE}/simulate`, { mode: 'evasion', count: 10 });
      
      setDemoState('complete');
      setTimeout(() => setDemoState('idle'), 5000);
    } catch (err) {
      console.error("Demo failed:", err);
      setDemoState('idle');
    }
  };

  return (
    <header className="h-20 glass border-b border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between px-8 sticky top-0 z-30 transition-colors duration-300">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
        <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors">Global</span>
        <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
        <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors">Admin</span>
        <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
        <span className="text-slate-900 dark:text-white font-semibold">
          {activeItem === 'Dashboards' ? 'Security Dashboard' : activeItem}
        </span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-5">
        <NotificationBell />

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-white/50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 shadow-sm border border-slate-200 dark:border-zinc-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 backdrop-blur-sm transition-colors">
          {isLive ? (
            <>
              <ShieldCheck size={16} className="text-emerald-600 dark:text-white" />
              <span className="text-xs font-bold text-emerald-800 dark:text-white tracking-wide uppercase">Full Protection</span>
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-white"></span>
              </span>
            </>
          ) : (
            <>
              <ShieldAlert size={16} className="text-slate-400 dark:text-zinc-500" />
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-500 tracking-wide uppercase">Offline</span>
              <span className="relative flex h-2 w-2 ml-1">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400 dark:bg-zinc-600"></span>
              </span>
            </>
          )}
        </div>

        {/* Demo Mode Button */}
        <button 
          onClick={handleRunDemo}
          disabled={demoState !== 'idle'}
          className={`relative overflow-hidden rounded-lg px-4 py-2 font-black text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center gap-2 border shadow-xl
            ${demoState === 'idle' ? 'bg-indigo-600 text-white border-indigo-400 hover:bg-indigo-500' : 
              demoState === 'running' ? 'bg-slate-800 text-slate-400 border-white/10 cursor-not-allowed' : 
              'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'}
          `}
        >
          {demoState === 'idle' ? (
            <><Play size={14} className="fill-current" /> RUN DEMO ATTACK SEQUENCE</>
          ) : demoState === 'running' ? (
            <><RefreshCw size={14} className="animate-spin" /> RUNNING SEQUENCE...</>
          ) : (
            <><Check size={14} /> DEMO COMPLETE ✓</>
          )}
        </button>

        {/* Analyze CTA */}
        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="relative overflow-hidden rounded-lg px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-semibold text-sm hover:bg-slate-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Activity size={16} className={isAnalyzing ? 'animate-pulse text-slate-400 dark:text-zinc-600' : 'text-slate-300 dark:text-black'} />
          <span>
            {isAnalyzing ? 'Analyzing...' : 'Analyze Logs'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
