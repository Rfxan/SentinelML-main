import React from 'react';
import EmptyState from './EmptyState';
import { Shield, ShieldBan, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const ThreatTable = ({ threats }) => {
  const hasThreats = threats && threats.length > 0;

  const handleUnblock = async (ip) => {
    try {
      await axios.delete(`${API_BASE}/block-ip/${ip}`);
    } catch (e) {
      console.error("Failed to unblock IP:", e);
    }
  };

  const getSeverityBadge = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'high':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-800 text-white border border-zinc-600">High</span>;
      case 'medium':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-600">Medium</span>;
      case 'low':
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-900 text-zinc-400 border border-zinc-700">Low</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-800 text-white border border-zinc-600">High</span>;
    }
  };

  return (
    <div className="glass-card flex flex-col h-[400px] lg:h-[500px] overflow-hidden">
      <div className="px-5 py-4 border-b border-black/[0.05] dark:border-white/[0.05] bg-slate-100/50 dark:bg-[#0a0a0a] flex items-center justify-between transition-colors duration-300">
        <h3 className="font-semibold tracking-wide text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldBan size={18} className="text-slate-500 dark:text-zinc-400" />
          Detected Threats
        </h3>
        {hasThreats && (
          <span className="bg-slate-900 dark:bg-white text-white dark:text-black px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
            {threats.length} Active
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto scrollbar-thin relative bg-white/50 dark:bg-black transition-colors duration-300">
        {!hasThreats ? (
          <EmptyState />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-100 dark:bg-[#0a0a0a] z-10 border-b border-black/[0.05] dark:border-white/[0.05] transition-colors duration-300">
              <tr>
                <th className="py-3 px-5 text-xs font-semibold tracking-wider text-slate-500 dark:text-zinc-400 uppercase">Status</th>
                <th className="py-3 px-5 text-xs font-semibold tracking-wider text-slate-500 dark:text-zinc-400 uppercase">Threat Type</th>
                <th className="py-3 px-5 text-xs font-semibold tracking-wider text-slate-500 dark:text-zinc-400 uppercase">Source</th>
                <th className="py-3 px-5 text-xs font-semibold tracking-wider text-slate-500 dark:text-zinc-400 uppercase">Severity</th>
                <th className="py-3 px-5 text-xs font-semibold tracking-wider text-slate-500 dark:text-zinc-400 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
              {threats.map((threat, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors group animate-fade-in">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-800 dark:bg-white shadow-sm dark:shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse"></div>
                      <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">Blocked</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-sm text-slate-700 dark:text-zinc-300 font-medium">{threat.type || 'Intrusion Attempt'}</td>
                  <td className="py-4 px-5 font-mono text-sm text-slate-500 dark:text-zinc-400">{threat.ip || threat.source_ip}</td>
                  <td className="py-4 px-5">{getSeverityBadge(threat.severity || 'high')}</td>
                  <td className="py-4 px-5 text-right">
                    <button 
                      onClick={() => handleUnblock(threat.ip || threat.source_ip)}
                      className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white text-slate-500 dark:text-zinc-500 hover:text-red-500 dark:hover:text-black transition-colors"
                      title="Unblock IP"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ThreatTable;
