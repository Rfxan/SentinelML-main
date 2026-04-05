import React, { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

const StatCounter = ({ title, value, icon: Icon, colorClass }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 1,
      ease: "easeOut",
      onUpdate(v) {
        setDisplayValue(Math.round(v));
      }
    });
    return () => controls.stop();
  }, [value]);

  return (
    <div className={`p-4 rounded-xl border border-white/10 bg-slate-800/50 dark:bg-black/40 backdrop-blur-md flex items-center justify-between shadow-lg ${colorClass || ''}`}>
      <div>
        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-bold font-mono tracking-tight text-white">{displayValue}</p>
      </div>
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 opacity-80" />
        </div>
      )}
    </div>
  );
};

export default StatCounter;
