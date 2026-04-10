import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const ATTACKS = [
  {
    id: 'fgsm',
    name: 'FGSM',
    full: 'Fast Gradient Sign Method',
    desc: 'Single-step gradient perturbation. Crafts adversarial noise by moving features in the direction of the loss gradient.',
    badge: 'SINGLE-STEP',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.35)',
    steps: ['Computing gradient ∇J(θ,x,y)', 'Applying sign function', 'Perturbing feature vector by ε', 'Clipping to valid bounds'],
  },
  {
    id: 'pgd',
    name: 'PGD',
    full: 'Projected Gradient Descent',
    desc: 'Multi-step iterative attack. Projects perturbations back onto the ε-ball after each gradient step for stronger evasion.',
    badge: 'ITERATIVE',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.35)',
    steps: ['Initialising perturbation δ=0', 'Computing numerical gradient', 'Gradient step + sign projection', 'Clipping to ε-ball & bounds', 'Repeating for N iterations'],
  },
];

const LOG_PREFIXES = ['[SYS]', '[ADV]', '[ML]', '[NET]', '[DEF]'];

function randomLog(attack, step) {
  const msgs = [
    `Injecting ${attack.name} perturbation — ε=0.10`,
    `Feature vector dimension: 41`,
    `${step}`,
    `Querying /simulate endpoint`,
    `Defender Z-score threshold: 3.5`,
    `RandomForest predict_proba()`,
    `Evasion risk computed`,
    `Blocker strike recorded`,
    `Traffic feed updated`,
    `Response latency: ${(Math.random() * 80 + 20).toFixed(0)}ms`,
  ];
  const prefix = LOG_PREFIXES[Math.floor(Math.random() * LOG_PREFIXES.length)];
  return `${prefix} ${msgs[Math.floor(Math.random() * msgs.length)]}`;
}

export default function AdversarialSimulator() {
  const [selected, setSelected] = useState(ATTACKS[0]);
  const [count, setCount] = useState(10);
  const [phase, setPhase] = useState('idle'); // idle | running | done | error
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const logRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const addLog = (msg, type = 'info') => {
    const ts = new Date().toISOString().slice(11, 23);
    setLogs(prev => [...prev.slice(-60), { ts, msg, type, id: Math.random() }]);
  };

  const runSimulation = async () => {
    setPhase('running');
    setLogs([]);
    setResult(null);
    setProgress(0);
    setCurrentStep(0);

    const steps = selected.steps;
    let stepIdx = 0;
    let prog = 0;
    addLog(`Launching ${selected.name} adversarial simulation — ${count} samples`, 'system');
    addLog(`Target: ${API_BASE}/simulate`, 'system');

    intervalRef.current = setInterval(() => {
      prog = Math.min(prog + Math.random() * 8, 88);
      setProgress(prog);
      if (stepIdx < steps.length) {
        setCurrentStep(stepIdx);
        addLog(randomLog(selected, steps[stepIdx]), stepIdx % 2 === 0 ? 'info' : 'dim');
        stepIdx++;
      } else {
        addLog(randomLog(selected, ''), 'dim');
      }
    }, 280);

    try {
      const res = await fetch(`${API_BASE}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: selected.id, count: parseInt(count) }),
      });

      clearInterval(intervalRef.current);

      if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
      const data = await res.json();

      setProgress(100);
      setCurrentStep(steps.length - 1);
      addLog(`Simulation complete — ${data.count} samples processed`, 'success');
      addLog(`IPs targeted: ${(data.ips || []).slice(0, 3).join(', ')}${(data.ips || []).length > 3 ? ` +${data.ips.length - 3} more` : ''}`, 'success');
      setResult(data);
      setPhase('done');
    } catch (err) {
      clearInterval(intervalRef.current);
      setProgress(100);
      addLog(`ERROR — ${err.message}`, 'error');
      setPhase('error');
    }
  };

  const reset = () => {
    setPhase('idle');
    setLogs([]);
    setResult(null);
    setProgress(0);
    setCurrentStep(0);
  };

  const isRunning = phase === 'running';

  return (
    <div
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}
      className="min-h-screen w-full bg-[#050810] text-white p-6 md:p-10"
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }}
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-start justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-red-500"
              />
              <span className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase">SentinelML // Adversarial Engine v2</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Attack <span style={{ color: selected.color }}>Simulator</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Inject adversarial perturbations to stress-test model robustness</p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-[10px] text-zinc-600 tracking-widest">ENDPOINT</div>
            <div className="text-xs text-zinc-400">{API_BASE}/simulate</div>
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            <div className="text-[10px] tracking-[0.25em] text-zinc-600 uppercase mb-1">// Attack Algorithm</div>

            {ATTACKS.map(atk => (
              <motion.button
                key={atk.id}
                onClick={() => { if (!isRunning) { setSelected(atk); reset(); } }}
                whileHover={!isRunning ? { scale: 1.01 } : {}}
                whileTap={!isRunning ? { scale: 0.99 } : {}}
                className="relative w-full text-left p-4 rounded-lg border transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: selected.id === atk.id ? atk.color : 'rgba(255,255,255,0.07)',
                  background: selected.id === atk.id
                    ? `rgba(${atk.id === 'fgsm' ? '249,115,22' : '168,85,247'},0.06)`
                    : 'rgba(255,255,255,0.02)',
                  boxShadow: selected.id === atk.id ? `0 0 20px ${atk.glow}` : 'none',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                }}
              >
                {selected.id === atk.id && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0.05, 0.12, 0.05] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ background: `radial-gradient(circle at 20% 50%, ${atk.glow}, transparent 70%)` }}
                  />
                )}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-5 rounded-full" style={{ background: atk.color }} />
                    <span className="text-base font-bold" style={{ color: selected.id === atk.id ? atk.color : '#a1a1aa' }}>
                      {atk.name}
                    </span>
                  </div>
                  <span
                    className="text-[9px] tracking-widest px-2 py-0.5 rounded-sm border"
                    style={{ color: atk.color, borderColor: `${atk.color}40`, background: `${atk.color}12` }}
                  >
                    {atk.badge}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 leading-relaxed">{atk.full}</div>
                <div className="text-[11px] text-zinc-600 mt-2 leading-relaxed">{atk.desc}</div>
              </motion.button>
            ))}

            {/* Count slider */}
            <div className="p-4 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] tracking-[0.25em] text-zinc-600 uppercase">// Sample Count</span>
                <motion.span
                  key={count}
                  initial={{ scale: 1.3, color: selected.color }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-bold tabular-nums"
                >
                  {count}
                </motion.span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={count}
                disabled={isRunning}
                onChange={e => setCount(parseInt(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer disabled:opacity-40"
                style={{
                  accentColor: selected.color,
                  background: `linear-gradient(to right, ${selected.color} ${(count / 50) * 100}%, rgba(255,255,255,0.1) 0%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-zinc-700 mt-1">
                <span>1</span><span>25</span><span>50</span>
              </div>
            </div>

            {/* Launch / Reset */}
            {phase === 'idle' || phase === 'running' ? (
              <motion.button
                onClick={runSimulation}
                disabled={isRunning}
                whileHover={!isRunning ? { scale: 1.02 } : {}}
                whileTap={!isRunning ? { scale: 0.98 } : {}}
                className="relative w-full py-4 rounded-lg font-bold text-sm tracking-widest uppercase overflow-hidden transition-all duration-300"
                style={{
                  background: isRunning
                    ? 'rgba(255,255,255,0.04)'
                    : `linear-gradient(135deg, ${selected.color}cc, ${selected.color}88)`,
                  border: `1px solid ${isRunning ? 'rgba(255,255,255,0.1)' : selected.color}`,
                  color: isRunning ? selected.color : '#000',
                  boxShadow: isRunning ? 'none' : `0 0 30px ${selected.glow}`,
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                }}
              >
                {isRunning && (
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(90deg, transparent, ${selected.color}30, transparent)` }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  />
                )}
                <span className="relative z-10">
                  {isRunning ? `▶ Running ${selected.name}...` : `▶ Launch ${selected.name}`}
                </span>
              </motion.button>
            ) : (
              <motion.button
                onClick={reset}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-lg font-bold text-sm tracking-widest uppercase border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
              >
                ↺ Reset
              </motion.button>
            )}
          </div>

          {/* Right panel */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            {/* Steps tracker */}
            <div className="p-4 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="text-[10px] tracking-[0.25em] text-zinc-600 uppercase mb-3">// Execution Steps</div>
              <div className="flex flex-col gap-2">
                {selected.steps.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{
                        background:
                          phase === 'done' || (phase === 'running' && i <= currentStep)
                            ? selected.color
                            : 'rgba(255,255,255,0.05)',
                        color:
                          phase === 'done' || (phase === 'running' && i <= currentStep)
                            ? '#000'
                            : '#52525b',
                        transition: 'all 0.3s',
                      }}
                    >
                      {phase === 'done' || (phase === 'running' && i < currentStep) ? '✓' : i + 1}
                    </div>
                    <span
                      className="text-xs transition-colors duration-300"
                      style={{
                        color:
                          phase === 'running' && i === currentStep ? selected.color :
                          phase === 'done' ? '#a1a1aa' :
                          phase === 'running' && i < currentStep ? '#52525b' :
                          '#3f3f46',
                      }}
                    >
                      {step}
                    </span>
                    {phase === 'running' && i === currentStep && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="text-xs"
                        style={{ color: selected.color }}
                      >
                        █
                      </motion.span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${selected.color}, ${selected.color}88)` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>

            {/* Terminal */}
            <div
              className="flex-1 rounded-lg border border-white/5 bg-black/60 overflow-hidden"
              style={{ minHeight: '280px', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)' }}
            >
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-[10px] text-zinc-600 tracking-widest">SENTINEL // ATTACK LOG</span>
              </div>
              <div ref={logRef} className="h-[260px] overflow-y-auto p-4 flex flex-col gap-0.5 scrollbar-thin">
                <AnimatePresence initial={false}>
                  {logs.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-700 text-xs">
                      Awaiting launch command...
                      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>▌</motion.span>
                    </motion.div>
                  )}
                  {logs.map(log => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex gap-3 text-[11px] leading-5"
                    >
                      <span className="text-zinc-700 flex-shrink-0 tabular-nums">{log.ts}</span>
                      <span style={{
                        color:
                          log.type === 'success' ? '#4ade80' :
                          log.type === 'error' ? '#f87171' :
                          log.type === 'system' ? selected.color :
                          log.type === 'dim' ? '#3f3f46' :
                          '#71717a',
                      }}>
                        {log.msg}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Result / error */}
            <AnimatePresence>
              {phase === 'done' && result && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-lg border"
                  style={{ borderColor: `${selected.color}40`, background: `${selected.color}08` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.4 }}
                        className="text-sm font-bold"
                        style={{ color: selected.color }}
                      >
                        ✓
                      </motion.div>
                      <span className="text-sm font-bold text-white">Simulation Complete</span>
                    </div>
                    <div className="flex gap-4 text-[11px]">
                      <div className="text-center">
                        <div className="font-bold text-white tabular-nums">{result.count}</div>
                        <div className="text-zinc-600">samples</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white tabular-nums">{(result.ips || []).length}</div>
                        <div className="text-zinc-600">IPs used</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold" style={{ color: selected.color }}>{selected.name}</div>
                        <div className="text-zinc-600">method</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-lg border border-red-500/30 bg-red-500/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-bold">⚠</span>
                    <span className="text-sm text-red-400 font-bold">Simulation failed — check backend connectivity</span>
                  </div>
                  <div className="text-[11px] text-zinc-600 mt-1">
                    Verify VITE_API_BASE points to the Railway backend and CORS is configured.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
