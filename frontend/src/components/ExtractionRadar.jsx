import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Shield, Activity, Zap, AlertTriangle, Info } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const ThreatRow = ({ threat }) => {
  const getRiskColor = (risk) => {
    if (risk < 30) return 'bg-emerald-500';
    if (risk < 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getRiskTextColor = (risk) => {
    if (risk < 30) return 'text-emerald-400';
    if (risk < 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-zinc-900/40 border border-white/[0.05] rounded-xl hover:bg-zinc-900/60 transition-all">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-200 font-bold">{threat.ip}</span>
          {threat.is_honeypot && (
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded text-[10px] font-black tracking-widest uppercase">
              Honeypot Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Queries: <span className="text-slate-200 font-medium">{threat.query_count}</span></span>
          <span>Risk Score: <span className={`font-bold ${getRiskTextColor(threat.risk)}`}>{threat.risk}%</span></span>
        </div>
      </div>
      <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getRiskColor(threat.risk)} transition-all duration-500`} 
          style={{ width: `${threat.risk}%` }}
        />
      </div>
    </div>
  );
};

const ExtractionRadar = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/extraction-status`);
      setStatus(res.data);
    } catch (err) {
      console.error("Failed to fetch extraction status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const runSimulation = async (mode, count) => {
    try {
      await axios.post(`${API_BASE}/simulate`, { mode, count });
    } catch (err) {
      console.error(`Failed to run ${mode} simulation:`, err);
    }
  };

  if (!status && loading) return <div className="p-10 text-center text-slate-500 animate-pulse">Initializing Radar...</div>;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
            <Eye size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Extraction Radar</h1>
            <p className="text-slate-400 text-sm">Real-time model theft monitoring & honeypot defense.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => runSimulation('extraction_blitz', 30)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all shadow-lg active:scale-95"
          >
            <Zap size={14} /> EXTRACTION BLITZ
          </button>
          <button 
            onClick={() => runSimulation('extraction', 15)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-slate-300 text-xs font-black rounded-xl transition-all border border-white/5 active:scale-95"
          >
            <Activity size={14} /> COVERAGE ATTACK
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Radar View */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-zinc-900/60 border border-white/[0.05] rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 mb-2">
              <h3 className="text-sm font-black text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" /> Active Threats
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">AUTOSCAN: ENABLED</span>
            </div>
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {status?.active_threats.length > 0 ? (
                status.active_threats.map(threat => (
                  <ThreatRow key={threat.ip} threat={threat} />
                ))
              ) : (
                <div className="py-20 text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center text-slate-700">
                    <Shield size={24} />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">No active extraction probes detected.</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/60 border border-white/[0.05] rounded-3xl p-6">
              <p className="text-slate-500 text-xs font-black tracking-widest uppercase mb-1">Attempts Blocked</p>
              <h2 className="text-3xl font-black text-white">{status?.total_extraction_attempts || 0}</h2>
            </div>
            <div className="bg-zinc-900/60 border border-white/[0.05] rounded-3xl p-6 border-l-4 border-l-rose-500/50">
              <p className="text-slate-500 text-xs font-black tracking-widest uppercase mb-1">Honeypot Activations</p>
              <h2 className="text-3xl font-black text-rose-500">{status?.honeypot_activations || 0}</h2>
            </div>
          </div>
        </div>

        {/* Sidebar: Log & How it Works */}
        <div className="flex flex-col gap-6">
          <div className="bg-zinc-900/60 border border-white/[0.05] rounded-3xl p-6 flex-1 flex flex-col gap-4">
             <h3 className="text-sm font-black text-slate-400 tracking-widest uppercase">Radar Events</h3>
             <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
               {status?.recent_events.map((event, i) => (
                 <div key={i} className="flex gap-4 items-start text-xs border-b border-white/[0.03] pb-3 last:border-0">
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${event.type === 'honeypot_activated' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`} />
                    <div className="flex flex-col gap-1">
                      <p className="text-slate-300 font-bold">
                        {event.type === 'honeypot_activated' ? 'Honeypot Triggered' : 'Extraction Probe'}
                      </p>
                      <p className="text-slate-500 font-mono">{event.ip} • {event.ts}</p>
                    </div>
                 </div>
               ))}
               {status?.recent_events.length === 0 && <p className="text-slate-600 text-xs italic">Awaiting events...</p>}
             </div>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6 flex flex-col gap-4 shadow-[inset_0_0_30px_rgba(99,102,241,0.05)]">
            <h3 className="text-sm font-black text-indigo-400 flex items-center gap-2">
              <Info size={16} /> How it Works
            </h3>
            <p className="text-xs text-indigo-200/60 leading-relaxed">
              When an IP's risk score exceeds <span className="text-indigo-300 font-bold">60</span>, the system stops blocking. Instead, it secretly flips all predictions and serves fake confidence scores.
            </p>
            <p className="text-xs text-indigo-200/60 leading-relaxed">
              The attacker's surrogate model trains on poisoned data — learning everything backwards while believing the attack is working.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractionRadar;
