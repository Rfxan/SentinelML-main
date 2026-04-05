import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Cpu, Activity, Clock } from 'lucide-react';

const AlertCard = ({ alert, index }) => {
  const getCardConfig = (type) => {
    switch (type?.toLowerCase()) {
      case 'evasion':
        return {
          bg: 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-transparent',
          border: 'border-amber-200/50 dark:border-amber-500/30',
          iconBg: 'bg-amber-100 dark:bg-amber-500/20',
          iconColor: 'text-amber-600 dark:text-amber-400',
          Icon: AlertTriangle,
          label: 'FLAGGED',
          labelBg: 'bg-amber-500',
          title: 'Evasion Activity Detected',
        };
      case 'attack':
        return {
          bg: 'bg-gradient-to-r from-rose-500/10 to-rose-500/5 dark:from-rose-500/20 dark:to-transparent',
          border: 'border-rose-200/50 dark:border-rose-500/30',
          iconBg: 'bg-rose-100 dark:bg-rose-500/20',
          iconColor: 'text-rose-600 dark:text-rose-400',
          Icon: ShieldAlert,
          label: 'BLOCKED',
          labelBg: 'bg-rose-600',
          title: 'Attack Activity Detected',
        };
      case 'poisoning':
        return {
          bg: 'bg-gradient-to-r from-purple-500/10 to-purple-500/5 dark:from-purple-500/20 dark:to-transparent',
          border: 'border-purple-200/50 dark:border-purple-500/30',
          iconBg: 'bg-purple-100 dark:bg-purple-500/20',
          iconColor: 'text-purple-600 dark:text-purple-400',
          Icon: Cpu,
          label: 'REJECTED',
          labelBg: 'bg-purple-500',
          title: 'Data Poisoning Attempt',
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-zinc-900/50',
          border: 'border-slate-200 dark:border-zinc-800',
          iconBg: 'bg-slate-200 dark:bg-zinc-800',
          iconColor: 'text-slate-600 dark:text-zinc-500',
          Icon: Activity,
          label: 'LOGGED',
          labelBg: 'bg-slate-500',
          title: 'Anomalous Activity',
        };
    }
  };

  const config = getCardConfig(alert.type);
  const { Icon } = config;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -2, scale: 1.005 }}
      className={`flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-xl border backdrop-blur-sm ${config.bg} ${config.border} hover:shadow-lg transition-all duration-300`}
    >
      <div className={`p-4 rounded-full ${config.iconBg} shadow-sm shrink-0 flex items-center justify-center`}>
        <Icon className={`w-7 h-7 ${config.iconColor}`} />
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h4 className="font-bold text-lg text-slate-900 dark:text-white capitalize">
            {config.title}
          </h4>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm text-white uppercase tracking-wider shadow-sm ${config.labelBg}`}>
            {config.label}
          </span>
        </div>

        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-3 font-mono">
          <span>Source: <span className="font-semibold text-slate-800 dark:text-slate-100">{alert.ip || alert.source_ip}</span></span>
          <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
          <span>Confidence: <span className="font-semibold text-slate-800 dark:text-slate-100">{(alert.confidence * 100).toFixed(1)}%</span></span>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <Clock size={14} className="text-slate-400" />
        {new Date(alert.timestamp || alert.time * 1000).toLocaleString()}
      </div>
    </motion.div>
  );
};

export default AlertCard;
