import React from 'react';
import { useBlockedIPs } from '../hooks/useBlockedIPs';
import ThreatCard from './ThreatCard';
import BlockMap from './BlockMap';
import { ShieldX, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BlockList = () => {
  const { blockedIPs, geoDataMap, newlyBlocked, removeIPGlobally } = useBlockedIPs();

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <ShieldX size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Blocked Threats</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">IPs actively contained and verified by neural network.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Decorative stats */}
          <div className="px-4 py-2 bg-white dark:bg-[#1A1F2B] border border-slate-200 dark:border-white/10 rounded-xl shadow-lg dark:shadow-none flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">{blockedIPs.length} Active Blocks</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[600px]">
        {/* Left Column: Cards */}
        <div className="flex flex-col bg-white dark:bg-[#1A1F2B] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-none overflow-hidden transition-colors">
          <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-transparent transition-colors">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Mitigated Sources</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search IP..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-red-500/50 transition-colors w-48"
              />
            </div>
          </div>

          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {blockedIPs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center p-10 text-center"
                >
                  <ShieldX className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No IPs currently blocked.</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Network is operating cleanly.</p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-4">
                  {blockedIPs.map(b => (
                    <ThreatCard
                      key={b.ip}
                      ipData={b}
                      isNew={newlyBlocked.has(b.ip)}
                      onUnblock={removeIPGlobally}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: World Map */}
        <div className="flex flex-col">
          <BlockMap
            blockedIPs={blockedIPs}
            geoDataMap={geoDataMap}
            newlyBlocked={newlyBlocked}
          />
        </div>
      </div>
    </div>
  );
};

export default BlockList;
