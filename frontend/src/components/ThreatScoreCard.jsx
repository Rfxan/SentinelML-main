import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Zap, Lock, Info, Activity } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const ThreatScoreCard = () => {
  const [scoreData, setScoreData] = useState({ score: 0, band: 'LOW' });
  const [loading, setLoading] = useState(true);

  const fetchScore = async () => {
    try {
      const res = await axios.get(`${API_BASE}/threat-score`);
      setScoreData(res.data);
    } catch (err) {
      console.error("Failed to fetch threat score:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScore();
    const interval = setInterval(fetchScore, 3000);
    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score) => {
    if (score < 25) return 'text-emerald-500';
    if (score < 50) return 'text-amber-500';
    if (score < 75) return 'text-orange-500';
    return 'text-rose-500';
  };

  const getSeverityBandStyles = (band) => {
    switch (band) {
      case 'LOW': return 'bg-emerald-500 text-white';
      case 'MEDIUM': return 'bg-amber-500 text-black';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'CRITICAL': return 'bg-rose-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const isCritical = scoreData.score >= 75;

  return (
    <div className={`bg-zinc-900/60 border border-white/[0.05] rounded-3xl p-6 relative overflow-hidden transition-all duration-700 ${isCritical ? 'ring-2 ring-rose-500/30' : ''}`}>
      {isCritical && (
        <div className="absolute inset-0 bg-rose-500/5 animate-pulse pointer-events-none" />
      )}
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="flex flex-col items-center gap-2">
           <div className={`text-6xl font-black tabular-nums transition-colors duration-500 ${getScoreColor(scoreData.score)}`}>
             {scoreData.score}
           </div>
           <div className={`px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] shadow-xl ${getSeverityBandStyles(scoreData.band)}`}>
             {scoreData.band} SEVERITY
           </div>
        </div>

        <div className="h-0.5 w-full md:h-20 md:w-0.5 bg-white/5" />

        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase flex items-center gap-2">
                <Lock size={12} /> IP Blocks
              </span>
              <span className="text-sm font-bold text-slate-200">System Strike</span>
           </div>
           <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase flex items-center gap-2">
                <Zap size={12} /> Evasion
              </span>
              <span className="text-sm font-bold text-slate-200">Dynamic Risk</span>
           </div>
           <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase flex items-center gap-2">
                <ShieldAlert size={12} /> Poisoning
              </span>
              <span className="text-sm font-bold text-slate-200">Training Integrity</span>
           </div>
           <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase flex items-center gap-2">
                <Activity size={12} /> Accuracy
              </span>
              <span className="text-sm font-bold text-slate-200">XGBoost Drift</span>
           </div>
        </div>

        <div className="hidden lg:flex flex-col items-end gap-2 shrink-0">
           <div className="flex items-center gap-2 text-xs font-bold text-slate-400 p-3 bg-zinc-950/40 rounded-2xl border border-white/5">
             <Info size={14} className="text-blue-400" /> COMPOSITE THREAT SCORE
           </div>
           <p className="text-[10px] text-slate-600 font-mono tracking-tighter">V4.2 AUDIT ENGINE: SECURE</p>
        </div>
      </div>
    </div>
  );
};

export default ThreatScoreCard;
