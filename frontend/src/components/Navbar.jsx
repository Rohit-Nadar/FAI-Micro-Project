import React, { useState, useEffect } from 'react';
import { Droplet, Sparkles, Database, History, BookOpen, Activity, GitCompare } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({ onOpenHistory }) {
  const [dbStatus, setDbStatus] = useState({ connected: false, message: 'Checking...' });

  useEffect(() => {
    api.checkHealth()
      .then(res => setDbStatus(res.database))
      .catch(() => setDbStatus({ connected: false, message: 'Offline' }));
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Droplet className="w-6 h-6 text-white fill-white/20 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">AquaSearch</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                AI Solver
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Greedy Best-First & BFS</p>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <a href="#theory" className="px-3 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Theory
          </a>
          <a href="#simulation" className="px-3 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            Simulation
          </a>
          <a href="#state-space" className="px-3 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            State Space
          </a>
          <a href="#misleading-heuristic" className="px-3 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors flex items-center gap-1.5">
            <GitCompare className="w-4 h-4 text-amber-400" />
            Misleading Heuristic
          </a>
        </nav>

        {/* Actions & DB Status */}
        <div className="flex items-center gap-3">
          {/* Neon Database Status Badge */}
          <div 
            title={dbStatus.message}
            className={`hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              dbStatus.connected 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="font-mono">
              {dbStatus.connected 
                ? (dbStatus.neon_configured ? 'Neon DB' : 'SQLite DB') 
                : 'DB Offline'}
            </span>
            <span className={`w-2 h-2 rounded-full ${dbStatus.connected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 text-slate-200 transition-all shadow-sm hover:shadow"
          >
            <History className="w-4 h-4 text-cyan-400" />
            <span>History</span>
          </button>
        </div>
      </div>
    </header>
  );
}
