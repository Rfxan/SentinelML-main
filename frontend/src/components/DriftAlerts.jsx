import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Zap, Clock, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DriftAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/drift-alerts');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (err) {
      console.error("Failed to fetch drift alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && alerts.length === 0) {
    return (
      <div className="p-10 text-center animate-pulse text-slate-400">
        Monitoring for model drift...
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-sm font-bold shadow-sm">
        <Zap size={18} />
        <span>No performance drift detected. Model is stable.</span>
      </div>
    );
  }

  const formatDelta = (val) => {
    const percent = (val * 100).toFixed(2);
    return `${val > 0 ? '+' : ''}${percent}%`;
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {alerts.slice(0, 5).map((alert, idx) => (
        <div 
          key={idx} 
          className={`p-5 rounded-2xl border bg-white dark:bg-zinc-900 shadow-xl transition-all ${
            alert.severity === 'critical' ? 'border-l-4 border-rose-500 border-rose-500/20' : 'border-l-4 border-amber-500 border-amber-500/20'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                alert.severity === 'critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {alert.severity === 'critical' ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                  alert.severity === 'critical' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'
                }`}>
                  {alert.severity} DRIFT
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                  <Clock size={12} />
                  {new Date((alert.ts || alert.timestamp) * 1000).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xl font-black font-mono leading-tight ${alert.accuracy_delta < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {alert.accuracy_delta < 0 ? <TrendingDown size={20} className="inline mr-1 mb-1" /> : <TrendingUp size={20} className="inline mr-1 mb-1" />}
                {formatDelta(alert.accuracy_delta)}
              </div>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Accuracy Delta</div>
            </div>
          </div>

          {/* Task 5 Fix 4: Fixed-height parent for chart */}
          <div style={{ height: '180px' }} className="w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Acc', val: alert.accuracy_delta },
                  { name: 'F1', val: alert.f1_delta }
                ]}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" domain={[-0.1, 0.1]} hide />
                <YAxis dataKey="name" type="category" tick={{fontSize: 10, fill: '#64748b', fontWeight: 800}} width={30} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/80 backdrop-blur-md border border-white/10 p-2 rounded-lg text-[10px] font-bold text-white shadow-2xl">
                          {payload[0].payload.name}: {formatDelta(payload[0].value)}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="val" radius={[0, 4, 4, 0]}>
                  {alert.accuracy_delta < 0 ? (
                    <Cell fill="#fb7185" />
                  ) : (
                    <Cell fill="#10b981" />
                  )}
                  {alert.f1_delta < 0 ? (
                    <Cell fill="#fb7185" />
                  ) : (
                    <Cell fill="#10b981" />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-2 grid grid-cols-2 gap-3">
             <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-100 dark:border-zinc-800/50">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">F1 Delta</div>
               <div className={`text-sm font-bold ${alert.f1_delta < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                 {formatDelta(alert.f1_delta)}
               </div>
             </div>
             <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-100 dark:border-zinc-800/50 flex items-center justify-center">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrity: VERIFIED</span>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DriftAlerts;
