import React, { useState, useEffect } from 'react';
import { Activity, ShieldOff, Waves, Clock } from 'lucide-react';

const RateLimiterPanel = () => {
  const [rateStatus, setRateStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/train-rate-status');
      if (res.ok) {
        const data = await res.json();
        setRateStatus(data);
      }
    } catch (err) {
      console.error('Failed to fetch rate limits', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const ips = Object.keys(rateStatus);
  const totalTracked = ips.length;

  return (
    <div className="glass-card rounded-2xl p-6 border-white/[0.05] shadow-xl bg-white/50 dark:bg-black/20 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Waves size={20} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Training Rate Limits</h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Anti-Poisoning Throttle</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-slate-100 dark:bg-zinc-800 rounded-full text-xs font-bold text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
          Tracking: {totalTracked} IPs
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin max-h-[300px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400 animate-pulse">Loading rates...</div>
        ) : totalTracked === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500 py-8 gap-2">
            <ShieldOff size={24} className="opacity-50" />
            <p className="text-sm font-bold opacity-75">No Training Activity</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {ips.map(ip => {
              const data = rateStatus[ip];
              const pct = Math.min((data.count / data.max_calls) * 100, 100);
              const isDanger = pct >= 80;
              
              return (
                <div key={ip} className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{ip}</span>
                    <span className={`text-xs font-black ${isDanger ? 'text-rose-500' : 'text-slate-500 dark:text-zinc-400'}`}>
                      {data.count} / {data.max_calls} calls
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isDanger ? 'bg-rose-500' : 'bg-blue-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    <Clock size={12} />
                    <span>{data.window_seconds}s Window</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RateLimiterPanel;
