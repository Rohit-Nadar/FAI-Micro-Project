import React from 'react';
import { Play, BookOpen, GitCompare, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Hero({ onStartDemo }) {
  return (
    <section id="hero" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Academic Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fundamentals of Artificial Intelligence &bull; Micro-Project</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Water Jug Problem <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            AI Heuristic Solver
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Interactive educational workbench analyzing <strong className="text-cyan-300">Greedy Best-First Search</strong> and 
          <strong className="text-blue-300"> Breadth-First Search</strong>. Visualize live priority queues, state-space exploration graphs,
          animated jug physics, and mathematical proof of heuristic misguidance.
        </p>

        {/* Quick Heuristic Badge */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-mono">
          <span className="text-slate-400">Student Heuristic:</span>
          <span className="text-cyan-400 font-bold">h(x, y) = min(|target - x|, |target - y|)</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#simulation"
            onClick={onStartDemo}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center gap-2 group"
          >
            <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            <span>Launch Simulation</span>
            <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#theory"
            className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 font-medium text-sm transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Educational Theory</span>
          </a>

          <a
            href="#misleading-heuristic"
            className="px-6 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium text-sm transition-all flex items-center gap-2"
          >
            <GitCompare className="w-4 h-4 text-amber-400" />
            <span>Misleading Heuristic Demo</span>
          </a>
        </div>

        {/* Highlights Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="glass-card">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              Dynamic Inputs
            </div>
            <p className="text-xs text-slate-400">Custom capacities, initial levels, and targets evaluated dynamically.</p>
          </div>

          <div className="glass-card">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              State-Space Graph
            </div>
            <p className="text-xs text-slate-400">Explore visited nodes, active frontier, and optimal solution paths.</p>
          </div>

          <div className="glass-card">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              Priority Queue
            </div>
            <p className="text-xs text-slate-400">Step-by-step heap inspection with deterministic tie-breaking.</p>
          </div>

          <div className="glass-card">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              Neon PostgreSQL
            </div>
            <p className="text-xs text-slate-400">Automatic database persistence with offline fallback support.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

