import React, { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';

const SIEMLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/siem-log');
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        }
      } catch (error) {
        console.error("Failed to fetch SIEM logs", error);
      }
    };
    
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto h-full p-6 bg-slate-950 dark:bg-[#0c0c0c] text-green-400 font-mono rounded-xl border border-slate-800 shadow-2xl glass-card">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
        <Terminal size={24} className="text-emerald-500" />
        <h2 className="text-xl font-bold text-slate-100 uppercase tracking-widest drop-shadow-sm">SIEM Live Event Stream</h2>
      </div>
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-slate-400 uppercase sticky top-0 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-10 shadow-sm">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Source IP</th>
              <th className="py-3 px-4">Event</th>
              <th className="py-3 px-4">MITRE ID</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap text-slate-300">{log.timestamp}</td>
                <td className="py-3 px-4 text-blue-400">{log.source_ip}</td>
                <td className="py-3 px-4 text-slate-300 uppercase">{log.event_type}</td>
                <td className="py-3 px-4 text-amber-500 font-bold">{log.mitre_id}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold inline-block shadow-sm ${
                    log.severity === 'HIGH' 
                      ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' 
                      : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                  }`}>
                    {log.severity}
                  </span>
                </td>
                <td className="py-3 px-4 uppercase font-semibold text-slate-300">
                  {log.status === 'blocked' ? <span className="text-rose-500">BLOCKED</span> : 
                   log.status === 'allowed' ? <span className="text-emerald-500">ALLOWED</span> : 
                   log.status === 'rejected' ? <span className="text-purple-500">REJECTED</span> : log.status}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-500">No events recorded. Waiting for stream...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SIEMLog;
