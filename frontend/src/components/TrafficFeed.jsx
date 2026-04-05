import React from 'react';
import { Activity, ShieldAlert, Cpu, AlertTriangle } from 'lucide-react';

const TrafficFeed = ({ feed }) => {
  const getRowColor = (type) => {
    switch (type.toLowerCase()) {
      case 'normal': return 'bg-emerald-900/20 shadow-[inset_4px_0_0_0_rgba(16,185,129,1)] hover:bg-emerald-900/30';
      case 'attack': return 'bg-rose-900/20 shadow-[inset_4px_0_0_0_rgba(244,63,94,1)] hover:bg-rose-900/30';
      case 'evasion': return 'bg-amber-900/20 shadow-[inset_4px_0_0_0_rgba(245,158,11,1)] hover:bg-amber-900/30';
      case 'poisoning': return 'bg-purple-900/20 shadow-[inset_4px_0_0_0_rgba(168,85,247,1)] hover:bg-purple-900/30';
      case 'training': return 'bg-blue-900/20 shadow-[inset_4px_0_0_0_rgba(59,130,246,1)] hover:bg-blue-900/30';
      default: return 'bg-slate-800';
    }
  };

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'normal': return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'attack': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'evasion': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'poisoning': return <Cpu className="w-4 h-4 text-purple-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const visibleFeed = [...feed].reverse().slice(0, 20);

  return (
    <div className="card flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center z-10 sticky top-0">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Live Traffic Feed
        </h2>
        <span className="text-xs font-mono text-slate-400 px-2 py-1 bg-slate-900 rounded-md">
          {feed.length} requests
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-2">
          {visibleFeed.length === 0 ? (
            <div className="text-center p-8 text-slate-500 italic">No traffic recorded yet...</div>
          ) : (
            visibleFeed.map((event, idx) => (
              <div 
                key={event.time + '-' + idx} 
                className={`p-3 rounded-lg flex items-center justify-between transition-colors ${getRowColor(event.type)} animate-slide-in-top`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-slate-900/50">
                    {getIcon(event.type)}
                  </div>
                  <div>
                    <div className="font-mono text-sm font-medium text-slate-200">{event.ip}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">{event.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold px-2 py-1 rounded bg-slate-900/50 text-slate-300">
                    {(event.confidence * 100).toFixed(1)}% conf
                  </div>
                  <div className="text-xs text-slate-500 mt-1 capitalize">{event.status}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TrafficFeed;
