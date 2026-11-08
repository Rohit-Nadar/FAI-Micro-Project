import React from 'react';
import { Droplet, Heart, Code2, Database, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
              <Droplet className="w-4 h-4 fill-white/20" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">Water Jug Problem Solver</span>
              <p className="text-[10px] text-slate-400">Fundamentals of Artificial Intelligence &bull; Micro-Project</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-cyan-400">
              React + Vite
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-sky-400">
              Tailwind CSS
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-blue-400">
              FastAPI Python
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400">
              Neon PostgreSQL
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-slate-400 text-[11px]">
          <p>
            Designed for college AI lab demonstration. Evaluation function: <code className="text-cyan-400">h(x, y) = min(|target-x|, |target-y|)</code>.
          </p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Academic Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}

