import React from 'react';
import { Droplet, Award, ArrowRight } from 'lucide-react';

export default function WaterJug({
  name = 'Jug A',
  capacity = 4,
  currentAmount = 0,
  target = 2,
  actionType = null, // 'fill' | 'empty' | 'pour-out' | 'pour-in' | null
  isPouringToOther = false,
  isReceivingPour = false
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((currentAmount / capacity) * 100)));
  const isTargetAchieved = currentAmount === target;

  return (
    <div className="flex flex-col items-center">
      {/* Container Card */}
      <div className={`relative w-44 sm:w-52 p-4 rounded-3xl transition-all duration-500 ${
        isTargetAchieved 
          ? 'bg-gradient-to-b from-amber-500/10 via-slate-900/80 to-slate-950 border-2 border-amber-400 shadow-2xl shadow-amber-500/20'
          : 'bg-slate-900/60 border border-slate-800 shadow-xl'
      }`}>
        {/* Header: Name and Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Droplet className={`w-4 h-4 ${isTargetAchieved ? 'text-amber-400 fill-amber-400/30' : 'text-cyan-400'}`} />
            <span className="font-bold text-sm text-white tracking-wide">{name}</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
            Cap: {capacity}L
          </span>
        </div>

        {/* Goal Indicator Badge */}
        {isTargetAchieved && (
          <div className="mb-3 py-1 px-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 animate-bounce">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Target ({target}L) Met!</span>
          </div>
        )}

        {/* Physical Transparent Jug Container */}
        <div className="relative w-full h-64 sm:h-72 rounded-b-3xl rounded-t-lg bg-slate-950/80 border-x-4 border-b-4 border-t-2 border-cyan-500/30 overflow-hidden shadow-inner flex flex-col justify-end">
          {/* Tick Marks on the Jug */}
          <div className="absolute inset-y-0 right-2 flex flex-col justify-between py-4 text-[10px] font-mono text-slate-400 pointer-events-none select-none z-20">
            {Array.from({ length: capacity + 1 }).map((_, idx) => {
              const val = capacity - idx;
              return (
                <div key={idx} className="flex items-center gap-1.5 justify-end">
                  <span className={`${val === currentAmount ? 'text-cyan-300 font-bold' : ''}`}>{val}L</span>
                  <div className={`h-[1px] ${val === currentAmount ? 'w-3 bg-cyan-400' : 'w-1.5 bg-slate-700'}`} />
                </div>
              );
            })}
          </div>

          {/* Target Line Mark */}
          {target > 0 && target <= capacity && (
            <div 
              className="absolute left-0 right-0 border-b border-dashed border-amber-400/80 z-20 pointer-events-none flex items-center justify-start px-2"
              style={{ bottom: `${(target / capacity) * 100}%` }}
            >
              <span className="text-[9px] font-mono font-bold bg-amber-950/90 text-amber-300 px-1 rounded border border-amber-500/40 -translate-y-1/2">
                Target: {target}L
              </span>
            </div>
          )}

          {/* Animated Water Liquid Body */}
          <div
            className="water-fill relative transition-all duration-700 ease-out"
            style={{ height: `${percentage}%` }}
          >
            {/* Water Wave Effect on Surface */}
            {percentage > 0 && (
              <div className="water-surface-wave" />
            )}

            {/* Light reflection gloss on the liquid */}
            <div className="absolute inset-y-0 left-2 w-3 bg-white/10 rounded-full blur-[1px]" />
          </div>

          {/* Bubbles animation if filling or pouring */}
          {percentage > 5 && (
            <div className="absolute bottom-2 left-6 w-2 h-2 rounded-full bg-white/40 animate-ping pointer-events-none" />
          )}
        </div>

        {/* Bottom Current Level Display */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">Current</span>
            <span className="text-xl font-bold font-mono text-white">
              {currentAmount} <span className="text-xs font-normal text-slate-400 font-sans">Litres</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">Fill</span>
            <span className="text-sm font-bold font-mono text-cyan-400">
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

