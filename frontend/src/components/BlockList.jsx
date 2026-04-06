import React from 'react';
import axios from 'axios';
import { ShieldBan, Unlock } from 'lucide-react';

const BlockList = ({ ips }) => {
  const ipList = Object.values(ips || {}).sort((a, b) => b.blocked_at - a.blocked_at);

  const handleUnblock = async (ip) => {
    try {
      await axios.delete(`/api/block-ip/${ip}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnblockAll = async () => {
    try {
      if(window.confirm('Are you sure you want to unblock all IPs?')) {
        await axios.delete('/api/block-ip');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="card flex flex-col h-full bg-rose-950/20 border-rose-900/30">
      <div className="p-4 border-b border-rose-900/50 flex justify-between items-center bg-rose-950/40 sticky top-0 z-10">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-rose-300">
          <ShieldBan className="w-5 h-5 text-rose-500" />
          Active IP Blocks
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-1 bg-rose-900/60 rounded-md text-rose-200 border border-rose-800">
            {ipList.length} blocked
          </span>
          {ipList.length > 0 && (
            <button 
              onClick={handleUnblockAll}
              className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded text-xs font-semibold transition-colors border border-emerald-500/20 shadow-sm"
              title="Unblock All IPs"
            >
              Unblock All
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {ipList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-rose-400/50 opacity-70">
            <ShieldBan className="w-12 h-12 mb-2 stroke-[1.5]" />
            <p className="text-sm">No IPs currently blocked</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {ipList.map((entry, idx) => {
              const isNewest = idx === 0;
              return (
                <div 
                  key={entry.ip} 
                  className={`bg-slate-800/80 border ${isNewest ? 'border-rose-500 pulse-border-red relative overflow-hidden' : 'border-slate-700/50'} rounded-lg p-3 group transition-all hover:bg-slate-800 flex justify-between items-center`}
                >
                  {isNewest && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 rounded-l-lg"></div>}
                  <div className="pl-2">
                    <div className="font-mono font-medium text-slate-200">{entry.ip}</div>
                    <div className="text-xs text-rose-400 mt-0.5">{entry.reason}</div>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                        {entry.strike_count} strikes
                      </span>
                      <span className="text-[10px] uppercase font-medium text-slate-500 flex items-center">
                        {new Date(entry.blocked_at * 1000).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleUnblock(entry.ip)}
                    className="p-2 rounded-full hover:bg-emerald-500/20 text-emerald-500/70 hover:text-emerald-400 transition-colors cursor-pointer"
                    title="Unblock IP"
                  >
                    <Unlock className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockList;
