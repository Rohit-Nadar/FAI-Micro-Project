import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';
import { solveWaterJugGBFS } from '../services/solver';
import confetti from 'canvas-confetti';

export function useSimulation(defaultInputs = {
  jugA: 4,
  jugB: 3,
  target: 2,
  initialA: 0,
  initialB: 0,
  algorithm: 'gbfs'
}) {
  const [inputs, setInputs] = useState(defaultInputs);
  const [simulationData, setSimulationData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per step
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Comparison State (for Heuristic Misleading Demonstration)
  const [comparisonData, setComparisonData] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  const timerRef = useRef(null);

  // Run the simulation using backend API
  const runSimulation = useCallback(async (overrideInputs = null) => {
    const activeInputs = overrideInputs || inputs;
    setIsLoading(true);
    setError(null);
    setIsPlaying(false);

    try {
      const aCap = Number(activeInputs.jugA);
      const bCap = Number(activeInputs.jugB);
      const target = Number(activeInputs.target);
      const initialA = Number(activeInputs.initialA || 0);
      const initialB = Number(activeInputs.initialB || 0);

      const payload = {
        jug_a_capacity: aCap,
        jug_b_capacity: bCap,
        target,
        initial_a: initialA,
        initial_b: initialB,
        algorithm: activeInputs.algorithm || 'gbfs',
        save_to_db: true
      };

      let result = null;
      try {
        result = await api.simulate({ ...payload, timeout: 5000 });
      } catch (backendErr) {
        console.warn('Backend waking up or unreachable. Falling back to local AI solver:', backendErr);
        result = solveWaterJugGBFS(aCap, bCap, target, initialA, initialB);
      }

      setSimulationData(result);
      setCurrentStepIndex(0);

      if (!result.success) {
        setError(result.message);
      } else {
        // Trigger celebration confetti if goal state reached
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch {
          // ignore
        }
      }
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred during simulation.');
      setSimulationData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [inputs]);

  // Run comparative analysis (GBFS vs BFS)
  const runComparison = useCallback(async (overrideInputs = null) => {
    const activeInputs = overrideInputs || inputs;
    setIsComparing(true);
    try {
      const payload = {
        jug_a_capacity: Number(activeInputs.jugA),
        jug_b_capacity: Number(activeInputs.jugB),
        target: Number(activeInputs.target),
        initial_a: Number(activeInputs.initialA || 0),
        initial_b: Number(activeInputs.initialB || 0)
      };
      const result = await api.compare(payload);
      setComparisonData(result);
      return result;
    } catch (err) {
      console.error('Failed to run comparison:', err);
      return null;
    } finally {
      setIsComparing(false);
    }
  }, [inputs]);

  // Playback controls
  const play = () => {
    if (simulationData?.solution_path?.length) {
      if (currentStepIndex >= simulationData.solution_path.length - 1) {
        setCurrentStepIndex(0);
      }
      setIsPlaying(true);
    }
  };

  const pause = () => setIsPlaying(false);

  const nextStep = () => {
    if (simulationData?.solution_path && currentStepIndex < simulationData.solution_path.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const goToStep = (index) => {
    if (simulationData?.solution_path && index >= 0 && index < simulationData.solution_path.length) {
      setCurrentStepIndex(index);
    }
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Timer loop for automatic playback
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (simulationData?.solution_path && prev < simulationData.solution_path.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, simulationData]);

  // Derived current step data
  const currentStep = simulationData?.solution_path?.[currentStepIndex] || null;
  const currentSnapshot = simulationData?.pq_snapshots?.[currentStepIndex] || null;
  const totalSteps = simulationData?.solution_path?.length || 0;
  const isGoalReached = currentStep ? (currentStep.jug_a === Number(inputs.target) || currentStep.jug_b === Number(inputs.target)) : false;

  return {
    inputs,
    setInputs,
    simulationData,
    currentStepIndex,
    currentStep,
    currentSnapshot,
    totalSteps,
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    isLoading,
    error,
    isGoalReached,
    comparisonData,
    isComparing,
    runSimulation,
    runComparison,
    play,
    pause,
    nextStep,
    prevStep,
    goToStep,
    reset
  };
}

