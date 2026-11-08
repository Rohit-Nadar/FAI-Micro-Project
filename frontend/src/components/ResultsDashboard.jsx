import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  GitFork, 
  Layers, 
  ListOrdered, 
  Award,
  ArrowRight
} from 'lucide-react';

export default function ResultsDashboard({ simulationData }) {
  if (!simulationData) return null;

  const {
    success,
    message,
    solution_length = 0,
    expanded_states = 0,
    generated_states = 0,
    execution_time_ms = 0,
    initial_state = [0, 0],
    goal_state = [0, 0],
    algorithm = 'Greedy Best-First Search',
    solution_path = []
  } = simulationData;

  const chartData = [
    { name: 'Generated States', value: generated_states, color: '#38bdf8' },
    { name: 'Expanded States', value: expanded_states, color: '#818cf8' },
    { name: 'Solution Length (Ops)', value: solution_length, color: '#34d399' },
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            {success ? (
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-400" />
            )}
            <h3 className="text-xl font-bold text-white">
              Simulation Performance Analysis
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
            Algorithm: <span className="text-cyan-400 font-semibold">{algorithm}</span> &bull; {message}
          </p>
        </div>

        {/* State Transition Badge */}
        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">INITIAL</span>
            <span className="text-white font-bold">({initial_state[0]}, {initial_state[1]})</span>
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">GOAL</span>
            <span className="text-emerald-400 font-bold">
              {goal_state ? `(${goal_state[0]}, ${goal_state[1]})` : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Solution Length */}
        <div className="glass-card">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-2">
            <ListOrdered className="w-4 h-4 text-emerald-400" />
            <span>Operations (Steps)</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
            {solution_length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Legal state transitions</span>
        </div>

        {/* Expanded States */}
        <div className="glass-card">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Expanded States</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-indigo-400">
            {expanded_states}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Popped from min-heap</span>
        </div>

        {/* Generated States */}
        <div className="glass-card">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-2">
            <GitFork className="w-4 h-4 text-sky-400" />
            <span>Generated States</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-sky-400">
            {generated_states}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Total successor nodes</span>
        </div>

        {/* Execution Time */}
        <div className="glass-card">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Execution Time</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">
            {execution_time_ms} <span className="text-sm font-normal text-slate-400">ms</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">CPU benchmark time</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono mb-4">
          Search Complexity Metrics Visualization
        </h4>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <XAxis type="number" stroke="#64748b" fontSize={11} fontFamily="monospace" />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={130} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '0.75rem', 
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }} 
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
