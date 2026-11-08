import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TheorySection from './components/TheorySection';
import CodeExplanation from './components/CodeExplanation';
import SimulationDashboard from './components/SimulationDashboard';
import PriorityQueue from './components/PriorityQueue';
import StateSpaceGraph from './components/StateSpaceGraph';
import ExecutionLog from './components/ExecutionLog';
import ResultsDashboard from './components/ResultsDashboard';
import HeuristicComparison from './components/HeuristicComparison';
import HistoryModal from './components/HistoryModal';
import Footer from './components/Footer';
import { useSimulation } from './hooks/useSimulation';

export default function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const simulationHook = useSimulation();

  // Run the default example on initial load
  useEffect(() => {
    simulationHook.runSimulation({
      jugA: 4,
      jugB: 3,
      target: 2,
      initialA: 0,
      initialB: 0,
      algorithm: 'gbfs'
    });
  }, []);

  const handleStartDemo = () => {
    simulationHook.runSimulation({
      jugA: 4,
      jugB: 3,
      target: 2,
      initialA: 0,
      initialB: 0,
      algorithm: 'gbfs'
    });
  };

  const handleLoadSimulation = (params) => {
    simulationHook.setInputs(params);
    simulationHook.runSimulation(params);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar onOpenHistory={() => setIsHistoryOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-1 space-y-12 sm:space-y-16">
        <Hero onStartDemo={handleStartDemo} />
        <TheorySection />
        
        {/* Python Code & Algorithm Mechanics */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CodeExplanation />
        </div>
        
        {/* Interactive Simulation Dashboard */}
        <SimulationDashboard
          simulationHook={simulationHook}
          onRunSimulation={() => simulationHook.runSimulation()}
        />

        {/* Priority Queue & State Space Visualization Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PriorityQueue
              snapshot={simulationHook.currentSnapshot}
              currentStepIndex={simulationHook.currentStepIndex}
            />
            <StateSpaceGraph
              graphData={simulationHook.simulationData?.graph_data}
              currentStep={simulationHook.currentStep}
              solutionPath={simulationHook.simulationData?.solution_path}
            />
          </div>
        </div>

        {/* Real-Time Execution Log */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ExecutionLog
            solutionPath={simulationHook.simulationData?.solution_path}
            currentStepIndex={simulationHook.currentStepIndex}
            onSelectStep={(idx) => simulationHook.goToStep(idx)}
          />
        </div>

        {/* Performance Results & Metrics */}
        {simulationHook.simulationData && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ResultsDashboard simulationData={simulationHook.simulationData} />
          </div>
        )}

        {/* Heuristic Misleading Demonstration */}
        <HeuristicComparison onLoadPreset={handleLoadSimulation} />
      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadSimulation={handleLoadSimulation}
      />

      {/* Academic Footer */}
      <Footer />
    </div>
  );
}

