import React from 'react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-slate-700 backdrop-blur-md p-4 rounded-lg shadow-2xl min-w-[180px]">
        <p className="text-slate-300 text-sm mb-3 pb-2 border-b border-slate-700/50 font-medium">Time: {label}</p>
        <div className="space-y-2">
          {payload.map((entry, index) => {
            let colorClass = 'text-gray-400';
            if (entry.dataKey === 'normal') colorClass = 'text-emerald-400';
            if (entry.dataKey === 'attacks') colorClass = 'text-rose-400';
            if (entry.dataKey === 'adversarial') colorClass = 'text-purple-400';
            
            return (
              <div key={index} className="flex items-center gap-3 justify-between">
                <span className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span className="text-slate-200 font-medium text-sm capitalize">
                    {entry.name}
                  </span>
                </span>
                <span className={`font-bold ${colorClass}`}>
                  {entry.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
