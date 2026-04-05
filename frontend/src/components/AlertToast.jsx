import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Cpu, Activity } from 'lucide-react';

const AlertToast = ({ feed }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (!feed || feed.length === 0) return;
    
    const latestEvent = feed[feed.length - 1];
    const toastId = `${latestEvent.time}-${latestEvent.ip}`;
    
    // Alert on attacks with high conf and adversarial attempts
    const type = latestEvent.type.toLowerCase();
    const shouldToast = ['evasion', 'poisoning'].includes(type) || (type === 'attack' && latestEvent.confidence > 0.95);

    if (shouldToast && !toasts.find(t => t.id === toastId)) {
      const newToast = {
        id: toastId,
        ...latestEvent,
        timestamp: Date.now()
      };
      setToasts(prev => [...prev.slice(-4), newToast]);
    }
  }, [feed]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setToasts(prev => prev.filter(t => now - t.timestamp < 5000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getToastConfig = (type) => {
    switch(type.toLowerCase()) {
      case 'evasion': return { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-950/90', border: 'border-amber-500/50' };
      case 'poisoning': return { icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-950/90', border: 'border-purple-500/50' };
      case 'attack': return { icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-950/90', border: 'border-rose-500/50' };
      default: return { icon: Activity, color: 'text-blue-400', bg: 'bg-blue-950/90', border: 'border-blue-500/50' };
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 pointer-events-none">
      {toasts.map(toast => {
        const conf = getToastConfig(toast.type);
        const Icon = conf.icon;
        
        return (
          <div 
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-lg shadow-xl shadow-black/80 border backdrop-blur-md animate-slide-in-right ${conf.bg} ${conf.border} min-w-[280px] pointer-events-auto`}
          >
            <div className="p-1.5 rounded-full bg-slate-900/50 mt-0.5">
              <Icon className={`w-5 h-5 ${conf.color}`} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-200 capitalize flex justify-between">
                {toast.type} Detected
              </div>
              <div className="text-xs text-slate-300 mt-1 font-mono">{toast.ip}</div>
              <div className="text-[10px] text-slate-400 uppercase mt-2 tracking-wider font-semibold">
                Conf: {(toast.confidence * 100).toFixed(1)}% &bull; {toast.status}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertToast;
