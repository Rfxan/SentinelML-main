import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

const LogsPanel = ({ logs }) => {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'attack':
        return 'text-rose-500';
      case 'evasion':
        return 'text-amber-400';
      case 'normal':
        return 'text-emerald-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="glass-card flex flex-col h-[400px] lg:h-[500px]">
      <div className="px-5 py-4 border-b border-black/[0.05] dark:border-white/[0.05] flex items-center gap-3 bg-slate-100/50 dark:bg-black/20 transition-colors duration-300">
        <Terminal size={18} className="text-blue-500 dark:text-blue-400" />
        <h3 className="font-semibold tracking-wide text-slate-800 dark:text-slate-200">System Logs</h3>
        <div className="ml-auto flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 bg-white/50 dark:bg-[#050505] p-5 overflow-y-auto scrollbar-thin font-mono text-sm transition-colors duration-300"
      >
        {Array.isArray(logs) && logs.length > 0 ? (
          <div className="flex flex-col gap-2">
            {logs.map((log, i) => (
              <div 
                key={i} 
                className="animate-slide-in-top flex gap-4 border-b border-black/5 dark:border-white/5 pb-2 last:border-0"
              >
                <span className="text-slate-400 dark:text-slate-500 shrink-0">
                  [{(() => {
                    const d = new Date(log.time ? log.time * 1000 : log.timestamp || Date.now());
                    return d.toLocaleTimeString('en-GB', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
                  })()}]
                </span>
                <span className={`font-semibold shrink-0 uppercase tracking-wider ${getLogColor(log.type)}`}>
                  {log.type || 'UNKNOWN'}
                </span>
                <span className="text-slate-700 dark:text-slate-300 break-all flex items-center gap-2">
                  <span>{log.source_ip || log.ip} - {log.details || 'No details provided'}</span>
                  {log.mitre_id && log.mitre_id !== 'N/A' && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded uppercase tracking-wider">
                      MITRE {log.mitre_id}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 italic">
            Waiting for log stream...
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsPanel;
