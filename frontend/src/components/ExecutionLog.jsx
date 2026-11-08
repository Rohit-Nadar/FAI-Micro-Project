import React, { useState } from 'react';
import { Terminal, CheckCircle2, ChevronRight, Search, Hash } from 'lucide-react';

export default function ExecutionLog({ solutionPath, currentStepIndex, onSelectStep }) {
  const [filterText, setFilterText] = useState('');

  if (!solutionPath || solutionPath.length === 0) {
    return (
      <div className="glass-panel p-6 text-center text-slate-400 text-sm">
        <Terminal className="w-8 h-8 text-cyan-500/40 mx-auto mb-2" />
        <p>Execution log will record real-time state steps once a search is executed.</p>
      </div>
    );
  }

  const filteredSteps = solutionPath.filter(step => {
    if (!filterText) return true;
    const search = filterText.toLowerCase();
    return (
      step.action.toLowerCase().includes(search) ||
      `(${step.jug_a}, ${step.jug_b})`.includes(search) ||
      `step ${step.step_number}`.includes(search)
    );
  });

  return (
    <div className="glass-panel p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">Real-Time Execution Log</h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Step-by-step state sequence &bull; {solutionPath.length} total operations
            </p>
          </div>
        </div>

        {/* Search filter */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter operations..."
            className="pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Log Entries List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {filteredSteps.map((step) => {
          const isCurrent = step.step_number === currentStepIndex;
          const isGoal = step.step_number === solutionPath.length - 1;

          return (
            <div
              key={step.step_number}
              onClick={() => onSelectStep(step.step_number)}
              className={`p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                isCurrent
                  ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md shadow-cyan-950/30 text-white'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-lg font-mono font-bold flex items-center justify-center text-[10px] ${
                  isCurrent ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {step.step_number}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-cyan-300 text-sm">
                      ({step.jug_a}, {step.jug_b})
                    </span>
                    <span className="text-slate-300 font-sans font-medium">
                      {step.action}
                    </span>
                    {isGoal && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono font-semibold">
                        GOAL REACHED
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Jug A: {step.jug_a}L &bull; Jug B: {step.jug_b}L &bull; Heuristic h(x,y) = {step.heuristic}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isCurrent && (
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded">
                    ACTIVE STEP
                  </span>
                )}
                <ChevronRight className={`w-4 h-4 ${isCurrent ? 'text-cyan-400' : 'text-slate-600'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
