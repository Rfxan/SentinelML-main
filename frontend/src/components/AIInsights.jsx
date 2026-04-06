import React, { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

const AIInsights = ({ className }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    try {
      // In a real app, you'd use a configured base URL. Assuming it's running locally here.
      const url = `http://localhost:8000/ai-insights`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      setInsights(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("AI temporarily unavailable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    const interval = setInterval(fetchInsights, 8000); // Poll every 8s
    return () => clearInterval(interval);
  }, []);

  const getThreatAssessmentColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-400';
      case 'HIGH': return 'text-orange-400';
      case 'MEDIUM': return 'text-yellow-400';
      default: return 'text-emerald-400';
    }
  };

  const getThreatAssessmentIcon = (level) => {
    switch (level) {
      case 'CRITICAL': return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'HIGH': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'MEDIUM': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default: return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className={`p-5 rounded-2xl bg-[#1A1F2B] border border-white/10 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-indigo-400" />
          <h2 className="text-lg font-bold text-gray-100">AI Intelligence Layer</h2>
        </div>
        {!loading && !error && insights && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold">
            {getThreatAssessmentIcon(insights.threat_assessment)}
            <span className={getThreatAssessmentColor(insights.threat_assessment)}>
              {insights.threat_assessment}
            </span>
          </div>
        )}
      </div>

      {loading && !insights ? (
        <div className="flex flex-col items-center justify-center py-6">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-2" />
          <p className="text-sm text-gray-400">Analyzing threat patterns...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-6 text-gray-400">
          <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-sm text-gray-300 leading-relaxed">
            {insights?.summary}
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Key Patterns:</span>
            <span className="text-sm text-gray-200">{insights?.key_patterns}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
