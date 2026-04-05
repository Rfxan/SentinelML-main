import React, { useMemo } from 'react';
import StatCard from './StatCard';
import LogsPanel from './LogsPanel';
import ThreatTable from './ThreatTable';
import { Activity, ShieldAlert, Wifi } from 'lucide-react';

const Dashboard = ({ data }) => {
  const { trafficFeed, modelStats, blockedIPs } = data;

  const activeThreats = useMemo(() => {
    if (!trafficFeed || !Array.isArray(trafficFeed)) return 0;
    return trafficFeed.filter(t => t.type?.toLowerCase() === 'attack').length;
  }, [trafficFeed]);

  const blockedCount = useMemo(() => {
    if (!blockedIPs || typeof blockedIPs !== 'object') return 0;
    return Object.keys(blockedIPs).length;
  }, [blockedIPs]);

  const requestsLogged = useMemo(() => {
    if (modelStats && modelStats.total_predictions) return modelStats.total_predictions;
    if (!trafficFeed || !Array.isArray(trafficFeed)) return 0;
    return trafficFeed.length;
  }, [modelStats, trafficFeed]);

  const tableThreats = useMemo(() => {
    // Generate threats from blockedIPs or recent attack traffic
    const blocks = Object.entries(blockedIPs || {}).map(([ip, details]) => ({
      ip,
      type: details?.reason || 'Intrusion Attempt',
      severity: 'high',
      status: 'Blocked'
    }));

    if (blocks.length > 0) return blocks;

    // Fallback if no blocks: show recent attacks from feed
    return (Array.isArray(trafficFeed) ? trafficFeed : [])
      .filter(t => t.type?.toLowerCase() === 'attack')
      .slice(0, 5) // Last 5
      .map(t => ({
        ip: t.source_ip || t.ip,
        type: t.details || 'Detected Attack',
        severity: 'high',
        status: 'Blocked'
      }));
  }, [blockedIPs, trafficFeed]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* 3 STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Threats" 
          value={activeThreats} 
          icon={ShieldAlert} 
          colorClass="text-slate-800 dark:text-zinc-300" 
          gradientClass="bg-slate-300 dark:bg-zinc-600" 
        />
        <StatCard 
          title="Blocked IPs" 
          value={blockedCount} 
          icon={Wifi} 
          colorClass="text-slate-800 dark:text-zinc-300" 
          gradientClass="bg-slate-400 dark:bg-zinc-700" 
        />
        <StatCard 
          title="Requests Logged" 
          value={requestsLogged} 
          icon={Activity} 
          colorClass="text-slate-900 dark:text-white" 
          gradientClass="bg-slate-200 dark:bg-zinc-500" 
        />
      </div>

      {/* PANELS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full mt-2">
        <LogsPanel logs={trafficFeed} />
        <ThreatTable threats={tableThreats} />
      </div>
    </div>
  );
};

export default Dashboard;
