import React, { useState } from 'react';
import { Target, AlertCircle, CheckCircle2, Zap, ShieldAlert, Cpu } from 'lucide-react';

const AdversarialSimulator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('fgsm');
  const [count, setCount] = useState(5);

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, count: parseInt(count) }),
      });
      if (!res.ok) throw new Error('Simulation failed');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-6 glass-card rounded-2xl shadow-xl bg-white/50 dark:bg-black/20 text-slate-900 dark:text-white">
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <Target className="text-purple-500" size={32} />
        <div>
          <h2 className="text-2xl font-black">Adversarial Attack Simulator</h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">Inject FGSM or PGD adversarial examples to stress-test model robustness.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Attack Algorithm</label>
          <div className="space-y-3">
            <button
              onClick={() => setMode('fgsm')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${mode === 'fgsm' ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10' : 'border-slate-200 dark:border-zinc-800 hover:border-purple-300'}`}
            >
              <Zap size={20} className={mode === 'fgsm' ? 'text-purple-500' : 'text-slate-400'} />
              <div className="text-left">
                <div className="font-bold">FGSM (Fast Gradient Sign Method)</div>
                <div className="text-xs text-slate-500">Single-step fast gradient injection</div>
              </div>
            </button>
            <button
              onClick={() => setMode('pgd')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${mode === 'pgd' ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10' : 'border-slate-200 dark:border-zinc-800 hover:border-purple-300'}`}
            >
              <ShieldAlert size={20} className={mode === 'pgd' ? 'text-purple-500' : 'text-slate-400'} />
              <div className="text-left">
                <div className="font-bold">PGD (Projected Gradient Descent)</div>
                <div className="text-xs text-slate-500">Multi-step highly optimized perturbation</div>
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-4">
             <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">Iterations (Count)</label>
             <input 
               type="range" 
               min="1" 
               max="50" 
               value={count} 
               onChange={(e) => setCount(e.target.value)}
               className="w-full accent-purple-500"
             />
             <div className="text-right font-black text-xl text-purple-600 dark:text-purple-400">
               {count} <span className="text-sm text-slate-500">samples</span>
             </div>
          </div>
          
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full mt-auto py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-wider disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25"
          >
            {loading ? <Cpu className="animate-spin" /> : <Target />}
            {loading ? 'Simulating...' : 'Launch Simulation'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20 flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <AlertCircle />
          <span className="font-bold">{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 flex items-center justify-between text-emerald-700 dark:text-emerald-400">
          <div className="flex items-center gap-3">
            <CheckCircle2 />
            <span className="font-bold">Simulation Complete</span>
          </div>
          <span className="font-mono text-sm font-bold bg-white/50 dark:bg-black/20 px-3 py-1 rounded">
            Requested {result.count} samples
          </span>
        </div>
      )}
    </div>
  );
};

export default AdversarialSimulator;
