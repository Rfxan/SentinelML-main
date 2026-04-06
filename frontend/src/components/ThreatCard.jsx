import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Clock, Unlock, Shield } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const ThreatCard = ({ ipData, isNew, onUnblock }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleUnblock = async () => {
    setIsRemoving(true);
    try {
      await axios.delete(`${API_BASE}/block-ip/${ipData.ip}`);
      onUnblock(ipData.ip);
    } catch (e) {
      console.error("Failed to unblock", e);
      setIsRemoving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: isRemoving ? 0 : 1, scale: isRemoving ? 0.9 : 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsConfirming(false); }}
      className={`relative bg-[#1A1F2B] border rounded-2xl p-5 overflow-hidden transition-all duration-300 ${
        isHovered ? 'shadow-[0_0_20px_rgba(239,68,68,0.15)] border-red-500/50' : 'border-white/10'
      }`}
    >
      {/* Neon glow animation for new threats */}
      {isNew && (
        <motion.div
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-red-500 pointer-events-none mix-blend-screen"
        />
      )}

      {isNew && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-red-500 text-white text-[10px] font-bold tracking-widest rounded-bl-lg">
          NEW THREAT
        </div>
      )}

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-slate-400" />
            <h3 className="font-mono text-lg font-bold text-white">{ipData.ip}</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/50 rounded-lg p-2 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Type</span>
            <span className="text-red-400 font-medium text-sm flex items-center gap-1">
              <Shield size={12} /> {ipData.reason || 'Attack Pattern'}
            </span>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-2 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Attempts</span>
            <span className="text-slate-200 font-medium text-sm">{ipData.strikes}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
            <Clock size={12} /> Blocked {new Date().toLocaleTimeString()}
          </div>
          
          <div className="relative">
            <AnimatePresence mode="wait">
              {!isConfirming ? (
                <motion.button
                  key="unblock-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setIsConfirming(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  <Unlock size={14} /> Unblock
                </motion.button>
              ) : (
                <motion.button
                  key="confirm-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={handleUnblock}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 text-xs font-semibold transition-colors"
                >
                  Confirm?
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreatCard;
