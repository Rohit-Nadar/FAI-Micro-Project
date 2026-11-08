import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  ListOrdered, 
  Clock, 
  Zap, 
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { api, ACADEMIC_BENCHMARKS } from '../services/api';

export default function HeuristicComparison({ onLoadPreset }) {
  const [inputs, setInputs] = useState({
    jugA: 4,
    jugB: 7,
    target: 5
  });

  const [comparison, setComparison] = useState(ACADEMIC_BENCHMARKS['4-7-5']);
  const [dataSource, setDataSource] = useState('benchmark'); // 'live' | 'benchmark'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const presets = [
    { label: 'Proven Misleading 1 (4L, 7L → 5L)', a: 4, b: 7, target: 5, desc: 'GBFS takes 12 ops vs BFS 8 ops (+4 ops detour)' },
    { label: 'Proven Misleading 2 (4L, 9L → 6L)', a: 4, b: 9, target: 6, desc: 'GBFS takes 16 ops vs BFS 8 ops (Double the operations!)' },
    { label: 'Proven Misleading 3 (3L, 7L → 5L)', a: 3, b: 7, target: 5, desc: 'GBFS takes 10 ops vs BFS 8 ops' },
    { label: 'Standard Case (4L, 3L → 2L)', a: 4, b: 3, target: 2, desc: 'Both GBFS and BFS find 4 ops' },
  ];

  const handleRunComparison = async (presetVals = null) => {
    const active = presetVals || inputs;
    const a = Number(active.jugA || active.a);
    const b = Number(active.jugB || active.b);
    const t = Number(active.target);
    const benchmarkKey = `${a}-${b}-${t}`;

    // If pre-verified benchmark exists, load immediately for instant UX
    if (ACADEMIC_BENCHMARKS[benchmarkKey]) {
      setComparison(ACADEMIC_BENCHMARKS[benchmarkKey]);
      setDataSource('benchmark');
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.compare({
        jug_a_capacity: a,
        jug_b_capacity: b,
        target: t,
        initial_a: 0,
        initial_b: 0
      });

      if (res && res.success) {
        setComparison(res);
        setDataSource('live');
        setError(null);
      }
    } catch (err) {
      // If backend is sleeping/starting on Render, retain the verified benchmark
      if (ACADEMIC_BENCHMARKS[benchmarkKey]) {
        setComparison(ACADEMIC_BENCHMARKS[benchmarkKey]);
        setDataSource('benchmark');
      } else {
        setError(err.message || 'Unable to connect to backend.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRunComparison();
  }, []);

  const chartData = comparison?.success ? [
    {
      metric: 'Path Length (Operations)',
      GBFS: comparison.gbfs.solution_length,
      BFS_Optimal: comparison.bfs.solution_length,
    },
    {
      metric: 'Expanded States',
      GBFS: comparison.gbfs.expanded_states,
      BFS_Optimal: comparison.bfs.expanded_states,
    },
    {
      metric: 'Generated States',
      GBFS: comparison.gbfs.generated_states,
      BFS_Optimal: comparison.bfs.generated_states,
    }
  ] : [];

  return (
    <section id="misleading-heuristic" className="py-16 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono mb-3 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Compulsory Academic Requirement &bull; Search Inefficiency Analysis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Heuristic Misleading Demonstration
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Proving that Greedy Best-First Search is <strong className="text-amber-400">suboptimal</strong> because it optimizes solely for 
            immediate heuristic proximity <code className="text-cyan-300 font-mono">h(n)</code> without considering path history <code className="text-slate-300 font-mono">g(n)</code>.
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div className="glass-panel p-5">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
            Select an Academic Benchmark or Custom Values:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputs({ jugA: preset.a, jugB: preset.b, target: preset.target });
                  handleRunComparison(preset);
                  if (onLoadPreset) onLoadPreset(preset);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  inputs.jugA === preset.a && inputs.jugB === preset.b && inputs.target === preset.target
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-950/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs text-white flex items-center justify-between">
                  <span>{preset.label}</span>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">{preset.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Display */}
        {loading && !comparison ? (
          <div className="glass-panel p-12 text-center text-slate-400 text-sm">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="font-mono">Executing dual search (GBFS vs BFS)...</p>
          </div>
        ) : error && !comparison ? (
          <div className="glass-panel p-6 text-center text-rose-400 text-sm border-rose-500/30 bg-rose-950/20 space-y-3">
            <p>{error}</p>
            <button
              onClick={() => handleRunComparison()}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-mono"
            >
              Retry Connection
            </button>
          </div>
        ) : comparison && comparison.success ? (
          <div className="space-y-6">
            {/* Live / Benchmark indicator badge */}
            {dataSource === 'benchmark' ? (
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Displaying verified academic benchmark metrics (Render live server warming up).
                </span>
                <button
                  onClick={() => handleRunComparison()}
                  disabled={loading}
                  className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-[11px] transition-colors"
                >
                  {loading ? 'Connecting...' : 'Sync Live'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Live calculation from Render FastAPI backend
              </div>
            )}

            {/* Status Alert Banner */}
            <div className={`p-5 rounded-2xl border ${
              comparison.is_misled
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                : 'bg-blue-950/30 border-blue-500/40 text-blue-200'
            }`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${comparison.is_misled ? 'text-amber-400' : 'text-blue-400'}`} />
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    {comparison.is_misled 
                      ? 'Heuristic Misguidance Verified: Greedy Search Took Suboptimal Detour!' 
                      : 'Heuristic Maintained Optimality for this Input'}
                  </h4>
                  <p className="text-xs sm:text-sm mt-1.5 leading-relaxed text-slate-300 font-sans">
                    {comparison.misled_explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Side-by-Side Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GBFS Card */}
              <div className="glass-panel p-6 border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-base">Greedy Best-First Search</h4>
                    <span className="text-xs text-cyan-400 font-mono">f(n) = h(n) &bull; Informed Search</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
                    comparison.is_misled 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {comparison.is_misled ? 'Suboptimal Path' : 'Optimal Path'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">OPERATIONS</span>
                    <span className="text-2xl font-bold text-cyan-400">{comparison.gbfs.solution_length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">EXPANDED</span>
                    <span className="text-2xl font-bold text-white">{comparison.gbfs.expanded_states}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-mono space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <p className="text-slate-300 font-semibold mb-1">Generated States: {comparison.gbfs.generated_states}</p>
                  <p className="text-slate-400">Execution Time: {comparison.gbfs.execution_time_ms} ms</p>
                  <p className="text-slate-400 truncate">
                    Path: {comparison.gbfs.solution_path.map(s => `(${s.jug_a},${s.jug_b})`).join(' → ')}
                  </p>
                </div>
              </div>

              {/* BFS Optimal Card */}
              <div className="glass-panel p-6 border-blue-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-base">Breadth-First Search (BFS)</h4>
                    <span className="text-xs text-blue-400 font-mono">f(n) = depth(n) &bull; Uninformed Search</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Guaranteed Optimal
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">OPERATIONS</span>
                    <span className="text-2xl font-bold text-emerald-400">{comparison.bfs.solution_length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">EXPANDED</span>
                    <span className="text-2xl font-bold text-white">{comparison.bfs.expanded_states}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-mono space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <p className="text-slate-300 font-semibold mb-1">Generated States: {comparison.bfs.generated_states}</p>
                  <p className="text-slate-400">Execution Time: {comparison.bfs.execution_time_ms} ms</p>
                  <p className="text-slate-400 truncate">
                    Path: {comparison.bfs.solution_path.map(s => `(${s.jug_a},${s.jug_b})`).join(' → ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Comparative Bar Chart */}
            <div className="glass-panel p-6 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                Comparative Performance Metrics (GBFS vs BFS)
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <XAxis dataKey="metric" stroke="#94a3b8" fontSize={12} fontFamily="monospace" />
                    <YAxis stroke="#94a3b8" fontSize={11} fontFamily="monospace" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: '#334155', 
                        borderRadius: '0.75rem', 
                        fontSize: '12px',
                        fontFamily: 'monospace'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="GBFS" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="BFS_Optimal" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

