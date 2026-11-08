import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  AlertCircle, 
  Award,
  FastForward,
  Compass,
  Sliders,
  Check
} from 'lucide-react';
import WaterJug from './WaterJug';

export default function SimulationDashboard({
  simulationHook,
  onRunSimulation
}) {
  const {
    inputs,
    setInputs,
    simulationData,
    currentStepIndex,
    currentStep,
    totalSteps,
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    isLoading,
    error,
    isGoalReached,
    play,
    pause,
    nextStep,
    prevStep,
    goToStep,
    reset
  } = simulationHook;

  const currentA = currentStep ? currentStep.jug_a : Number(inputs.initialA || 0);
  const currentB = currentStep ? currentStep.jug_b : Number(inputs.initialB || 0);
  const currentAction = currentStep ? currentStep.action : 'Ready to start search';

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (onRunSimulation) {
      onRunSimulation();
    }
  };

  return (
    <section id="simulation" className="py-12 md:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Water Jug Search Workbench
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Configure custom containers and observe real-time AI state transitions, liquid physics, and priority queue sorting.
          </p>
        </div>

        {/* Input Configuration Card */}
        <form onSubmit={handleStart} className="glass-panel p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-sm sm:text-base text-white">Problem Parameters</span>
            </div>
            <span className="text-xs font-mono text-slate-400">All inputs dynamic & validated</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Jug A Capacity */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Jug A Cap (L) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={inputs.jugA}
                onChange={(e) => handleInputChange('jugA', e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Jug B Capacity */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Jug B Cap (L) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={inputs.jugB}
                onChange={(e) => handleInputChange('jugB', e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Target Quantity */}
            <div>
              <label className="block text-xs font-mono uppercase text-amber-400 mb-1.5">
                Target (L) <span className="text-amber-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={inputs.target}
                onChange={(e) => handleInputChange('target', e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-amber-500/40 rounded-xl font-mono text-sm text-amber-300 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Initial Jug A */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Initial A (L)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={inputs.initialA}
                onChange={(e) => handleInputChange('initialA', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Initial Jug B */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Initial B (L)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={inputs.initialB}
                onChange={(e) => handleInputChange('initialB', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Algorithm Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Algorithm
              </label>
              <select
                value={inputs.algorithm}
                onChange={(e) => handleInputChange('algorithm', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="gbfs">Greedy Best-First</option>
                <option value="bfs">Breadth-First (BFS)</option>
              </select>
            </div>
          </div>

          {/* Quick Presets & Start Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Quick Presets:</span>
              <button
                type="button"
                onClick={() => setInputs({ jugA: 4, jugB: 3, target: 2, initialA: 0, initialB: 0, algorithm: 'gbfs' })}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700/60 transition-colors"
              >
                Standard (4, 3 → 2)
              </button>
              <button
                type="button"
                onClick={() => setInputs({ jugA: 5, jugB: 3, target: 4, initialA: 0, initialB: 0, algorithm: 'gbfs' })}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700/60 transition-colors"
              >
                Die Hard (5, 3 → 4)
              </button>
              <button
                type="button"
                onClick={() => setInputs({ jugA: 4, jugB: 7, target: 5, initialA: 0, initialB: 0, algorithm: 'gbfs' })}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-xs font-mono text-amber-300 border border-amber-500/30 transition-colors"
              >
                Misleading (4, 7 → 5)
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Start Search Simulation</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error / Feasibility Warning Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-white">Search Validation Notice:</span>
              <p className="font-mono text-xs mt-1 text-rose-300">{error}</p>
            </div>
          </div>
        )}

        {/* Interactive Jug Animation Stage */}
        <div className="glass-panel p-6 sm:p-8 space-y-8">
          {/* Action Status Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold">
                Step {currentStepIndex} of {Math.max(0, totalSteps - 1)}
              </span>
              <span className="text-white font-semibold text-sm">
                {currentAction}
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span>State: <strong className="text-cyan-300">({currentA}, {currentB})</strong></span>
              <span>Heuristic: <strong className="text-amber-400">h = {currentStep?.heuristic ?? '?'}</strong></span>
            </div>
          </div>

          {/* Physical Containers Display */}
          <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-20 py-4">
            <WaterJug
              name="Jug A"
              capacity={Number(inputs.jugA)}
              currentAmount={currentA}
              target={Number(inputs.target)}
            />

            <div className="hidden sm:flex flex-col items-center justify-center text-slate-500 text-xs font-mono gap-1">
              <span>&larr; Transfer &rarr;</span>
              <div className="w-16 h-[1px] bg-slate-800" />
            </div>

            <WaterJug
              name="Jug B"
              capacity={Number(inputs.jugB)}
              currentAmount={currentB}
              target={Number(inputs.target)}
            />
          </div>

          {/* Playback Controls Toolbar */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {/* Scrubber / Step pills */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full sm:max-w-md py-1">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToStep(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 ${
                    idx === currentStepIndex
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {idx}
                </button>
              ))}
            </div>

            {/* Play, Pause, Next, Prev Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={reset}
                title="Reset to Initial State"
                className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={prevStep}
                disabled={currentStepIndex <= 0}
                title="Previous Operation"
                className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {isPlaying ? (
                <button
                  type="button"
                  onClick={pause}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={play}
                  disabled={!totalSteps}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-40"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Auto Play</span>
                </button>
              )}

              <button
                type="button"
                onClick={nextStep}
                disabled={!totalSteps || currentStepIndex >= totalSteps - 1}
                title="Next Operation"
                className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <FastForward className="w-3.5 h-3.5 text-cyan-400" />
              <span>Speed:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none"
              >
                <option value={1500}>0.6x (Slow)</option>
                <option value={1000}>1.0x (Normal)</option>
                <option value={500}>2.0x (Fast)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
