import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useAttackTrends } from '../hooks/useAttackTrends';
import CustomTooltip from './CustomTooltip';

const AttackChart = () => {
  const [windowSize, setWindowSize] = useState(15);
  const data = useAttackTrends(windowSize);
  const [hiddenSeries, setHiddenSeries] = useState({
    normal: false,
    attacks: false,
    adversarial: false
  });

  const toggleSeries = (dataKey) => {
    setHiddenSeries(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const handleLegendClick = (e) => {
    toggleSeries(e.dataKey);
  };

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col h-[400px] w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 shadow-xl overflow-hidden relative transition-colors duration-300">
      <div className="flex justify-between items-center mb-4 z-10">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Live Attack Trends</h3>
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <select 
            className="bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 outline-none transition-colors"
            value={windowSize}
            onChange={(e) => setWindowSize(Number(e.target.value))}
          >
            <option value={15}>15s window</option>
            <option value={30}>30s window</option>
            <option value={60}>1m window</option>
          </select>
        </div>
      </div>
      <div className="flex-1 min-h-[300px] w-full z-10 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAdversarial" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--chart-text)" 
              tick={{fill: 'var(--chart-text)', fontSize: 12}} 
              tickLine={false}
              axisLine={false}
              minTickGap={20}
            />
            <YAxis 
              stroke="var(--chart-text)" 
              tick={{fill: 'var(--chart-text)', fontSize: 12}}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              onClick={handleLegendClick}
              wrapperStyle={{ cursor: 'pointer', fontSize: 13, color: 'var(--chart-legend)', paddingBottom: '10px' }}
            />
            
            {!hiddenSeries.normal && (
              <Area 
                type="monotone" 
                dataKey="normal" 
                name="Normal Traffic"
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorNormal)" 
                stackId="1" 
                isAnimationActive={false}
              />
            )}
            {!hiddenSeries.attacks && (
              <Area 
                type="monotone" 
                dataKey="attacks" 
                name="Attacks"
                stroke="#ef4444" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAttacks)" 
                stackId="1" 
                isAnimationActive={false}
              />
            )}
            {!hiddenSeries.adversarial && (
              <Area 
                type="monotone" 
                dataKey="adversarial" 
                name="Adversarial"
                stroke="#a855f7" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAdversarial)" 
                stackId="1" 
                isAnimationActive={false}
              />
            )}
            
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttackChart;
