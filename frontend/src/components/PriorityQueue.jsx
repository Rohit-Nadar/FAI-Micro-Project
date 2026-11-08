import React from 'react';
import { Layers, ArrowDownCircle, CheckCircle, Info, ChevronRight, Hash } from 'lucide-react';

export default function PriorityQueue({ snapshot, currentStepIndex }) {
  if (!snapshot) {
    return (
      <div className="glass-panel p-6 text-center text-slate-400 text-sm">
        <Layers className="w-8 h-8 text-cyan-500/40 mx-auto mb-2" />
        <p>Run a simulation to observe live Priority Queue state transitions.</p>
      </div>
    );
  }

  const {
    popped_state = [0, 0],
    heuristic: popped_h = 0,
    reason = '',
    queue_contents = [],
    queue_size = 0,
    action_taken = '',
    successors = []
  } = snapshot;

  return (
    <div className="glass-panel p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">Live Priority Queue (Min-Heap)</h3>
            <p className="text-[11px] text-slate-400 font-mono">Evaluation: f(n) = h(n)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
            Frontier Size: <strong className="text-white">{queue_size}</strong>
          </span>
        </div>
      </div>

      {/* Currently Selected & Popped State */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-blue-950/40 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300 font-mono">
              Selected State for Expansion (Step #{currentStepIndex})
            </span>
          </div>
          <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
            Min Heuristic: h = {popped_h}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wider">
              ({popped_state[0]}, {popped_state[1]})
            </div>
            <div className="text-xs text-slate-400">
              <span className="text-slate-300 block font-medium">{action_taken}</span>
              <span className="font-mono text-[11px] text-slate-500">Jug A: {popped_state[0]}L | Jug B: {popped_state[1]}L</span>
            </div>
          </div>
        </div>

        {/* Algorithm Selection Reason */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-cyan-300">Selection Justification:</strong> {reason}
          </p>
        </div>
      </div>

      {/* Queue Contents Table / List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Upcoming Frontier Candidates (Sorted by Priority)
          </span>
          <span className="text-[11px] text-slate-400">Deterministic Tie-breaking applied</span>
        </div>

        {queue_contents.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center text-xs text-slate-400 font-mono">
            Frontier is empty (Goal reached or exhausted).
          </div>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {queue_contents.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 text-xs transition-all font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[10px] w-5">#{item.priority}</span>
                  <span className="font-bold text-white text-sm">
                    ({item.state[0]}, {item.state[1]})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">
                    h(x,y) = <strong className="text-cyan-300">{item.h}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                    Waiting in Heap
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Successors Generated in this Step */}
      {successors.length > 0 && (
        <div className="border-t border-slate-800/80 pt-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono block mb-2">
            Successor States Generated From ({popped_state[0]}, {popped_state[1]}):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {successors.map((succ, sIdx) => (
              <div 
                key={sIdx}
                className={`p-2 rounded-lg border flex items-center justify-between ${
                  succ.status === 'enqueued'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400'
                }`}
              >
                <div>
                  <span className="font-bold">({succ.state[0]}, {succ.state[1]})</span>
                  <span className="text-[10px] text-slate-400 block font-sans truncate max-w-[140px]">{succ.action}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] block">h={succ.h}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                    succ.status === 'enqueued' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {succ.status === 'enqueued' ? 'Added to Heap' : 'Pruned / Visited'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

