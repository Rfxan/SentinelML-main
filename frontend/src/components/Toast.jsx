import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Cpu, Activity, X } from 'lucide-react';

const Toast = ({ toast, onDismiss }) => {
  const getToastConfig = (type) => {
    switch(type?.toLowerCase()) {
      case 'evasion': 
        return { icon: AlertTriangle, bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/30' };
      case 'poisoning': 
        return { icon: Cpu, bg: 'bg-purple-100 dark:bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-500/30' };
      case 'attack': 
        return { icon: ShieldAlert, bg: 'bg-rose-100 dark:bg-rose-500/20', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-500/30' };
      default: 
        return { icon: Activity, bg: 'bg-slate-100 dark:bg-zinc-800', text: 'text-slate-600 dark:text-zinc-400', border: 'border-slate-200 dark:border-zinc-700' };
    }
  };

  const conf = getToastConfig(toast.type);
  const Icon = conf.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative w-[320px] p-4 rounded-xl shadow-xl backdrop-blur-md border ${conf.bg} ${conf.border} pointer-events-auto`}
    >
      <button 
        onClick={() => onDismiss(toast.id)}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <X size={14} />
      </button>

      <div className="flex gap-3 items-start pr-4">
        <div className={`p-2 rounded-full bg-white dark:bg-black/40 shadow-sm shrink-0 mt-0.5`}>
          <Icon className={`w-5 h-5 ${conf.text}`} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white capitalize">
            {toast.type} Detected
          </h4>
          <p className="text-xs font-mono text-slate-600 dark:text-slate-300 mt-1 truncate max-w-[200px]">
            {toast.ip || toast.source_ip}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide bg-white dark:bg-black/40 ${conf.text}`}>
               {toast.status}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">
               Conf: {(toast.confidence * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Toast;
