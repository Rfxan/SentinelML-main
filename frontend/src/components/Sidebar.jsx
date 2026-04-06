import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Bell, 
  ShieldAlert, 
  Target, 
  Ban, 
  HeartPulse,
  Eye,
  History,
  Terminal
} from 'lucide-react';


const navItems = [
  { name: 'Dashboards', icon: LayoutDashboard },
  { name: 'Traffic', icon: Activity },
  { name: 'Alerts', icon: Bell },
  { name: 'Threat', icon: ShieldAlert },
  { name: 'Attack', icon: Target },
  { name: 'Block List', icon: Ban },
  { name: 'Health', icon: HeartPulse },
  { name: 'Extraction', icon: Eye },
  { name: 'Versions', icon: History },
  { name: 'SIEM Log', icon: Terminal },
];


const Sidebar = ({ activeItem, setActiveItem }) => {

  return (
    <aside className="w-64 glass h-screen fixed left-0 top-0 border-r border-black/[0.05] dark:border-white/[0.05] flex flex-col z-40 transition-colors duration-300">
      <div className="p-6 flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900 dark:text-white drop-shadow-md">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <span className="font-bold text-xl tracking-wide text-slate-900 dark:text-white drop-shadow-sm">
          Sentinel ML
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group
                ${isActive 
                  ? 'bg-slate-200 text-slate-900 shadow-md border-l-4 border-slate-900 dark:bg-zinc-800 dark:text-white dark:border-white' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-zinc-200'
                }
              `}
            >
              <Icon 
                size={18} 
                className={`transition-colors duration-300 ${isActive ? 'text-slate-900 dark:text-white' : 'group-hover:text-slate-700 dark:group-hover:text-zinc-300'}`} 
              />
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
