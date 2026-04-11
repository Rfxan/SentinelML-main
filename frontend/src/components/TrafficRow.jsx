import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

const TrafficRow = ({ row, onClick }) => {
  const getRowStyle = (type) => {
    switch (type?.toLowerCase()) {
      case 'attack':
        return 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-800 dark:text-rose-200';
      case 'evasion':
        return 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-800 dark:text-amber-200';
      case 'poisoning':
        return 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 text-purple-800 dark:text-purple-200';
      default:
        return 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/10 text-emerald-800 dark:text-emerald-200';
    }
  };

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'attack': return <ShieldAlert size={16} className="text-rose-500" />;
      case 'evasion': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'poisoning': return <Cpu size={16} className="text-purple-500" />;
      default: return <ShieldCheck size={16} className="text-emerald-500" />;
    }
  };

  const type = row.type || 'Normal';
  const rowStyle = getRowStyle(type);

  return (
    <motion.tr
      initial={{ opacity: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      layout
      onClick={() => onClick(row)}
      className={`border-b border-black/5 dark:border-white/5 cursor-pointer transition-colors ${rowStyle}`}
    >
      <td className="p-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-white dark:bg-black/40 shadow-sm">
            {getIcon(type)}
          </div>
          <span className="opacity-80">
            {new Date(row.time ? row.time * 1000 : row.timestamp).toLocaleTimeString([], { hour12: false })}
          </span>
        </div>
      </td>
      <td className="p-4 whitespace-nowrap text-sm font-mono font-semibold">
        {row.ip || row.source_ip}
      </td>
      <td className="p-4 whitespace-nowrap text-sm font-bold uppercase tracking-wider">
        {type}
      </td>
      <td className="p-4 whitespace-nowrap text-xs font-bold text-slate-500 dark:text-slate-400">
        {row.mitre_id && row.mitre_id !== 'N/A' ? (
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {row.mitre_id}
          </span>
        ) : (
          <span className="opacity-50">-</span>
        )}
      </td>
      <td className="p-4 whitespace-nowrap text-sm font-mono">
        {row.reputation_score !== undefined ? (
          <div className="flex flex-col gap-1 w-24">
            <div className="w-full bg-slate-200 dark:bg-white/10 h-1 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-1000 ${
                   row.reputation_score > 80 ? 'bg-rose-500' : row.reputation_score > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                 }`} 
                 style={{ width: `${row.reputation_score}%` }} 
               />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${
              row.reputation_score > 80 ? 'text-rose-500' : row.reputation_score > 40 ? 'text-amber-500' : 'text-emerald-500'
            }`}>
              {row.reputation_label || 'CHECKING'}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-500 italic opacity-50">PRE-SOC</span>
        )}
      </td>
      <td className="p-4 whitespace-nowrap text-sm font-mono">
        {(row.confidence * 100).toFixed(1)}%
      </td>
      <td className="p-4 whitespace-nowrap">
        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded border shadow-sm ${
          row.status === 'blocked' || row.status === 'rejected'
          ? 'bg-rose-500 text-white border-rose-600'
          : row.status === 'flagged'
          ? 'bg-amber-500 text-white border-amber-600'
          : 'bg-emerald-500 text-white border-emerald-600'
        }`}>
          {row.status}
        </span>
      </td>
    </motion.tr>
  );
};

export default TrafficRow;
