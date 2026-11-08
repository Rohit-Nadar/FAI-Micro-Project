import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  ExternalLink, 
  X, 
  Database, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function HistoryModal({ isOpen, onClose, onLoadSimulation }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHistory();
      setHistoryList(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
      setSelectedDetail(null);
    }
  }, [isOpen]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete simulation #${id} from database?`)) return;
    try {
      await api.deleteHistory(id);
      setHistoryList(prev => prev.filter(item => item.id !== id));
      if (selectedDetail?.id === id) {
        setSelectedDetail(null);
      }
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const detail = await api.getHistoryDetail(id);
      setSelectedDetail(detail);
    } catch (err) {
      alert(`Failed to load details: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Neon PostgreSQL Simulation History</h3>
              <p className="text-xs text-slate-400 font-mono">
                Persisted simulations and recorded state transitions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm font-mono">
              <div className="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading history from database...
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
              <p className="font-semibold mb-1">Database Notice:</p>
              <p className="text-xs font-mono">{error}</p>
            </div>
          ) : historyList.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm font-mono">
              <History className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              No saved simulations yet. Run a simulation to save history records.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historyList.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleViewDetail(item.id)}
                  className={`p-4 rounded-2xl border text-xs font-mono transition-all cursor-pointer ${
                    selectedDetail?.id === item.id
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">
                      Simulation #{item.id}
                    </span>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      title="Delete Entry"
                      className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-slate-300">
                    <p>
                      <span className="text-slate-400">Jugs:</span> ({item.jug_a_capacity}L, {item.jug_b_capacity}L) &bull; <span className="text-slate-400">Target:</span> {item.target}L
                    </p>
                    <p>
                      <span className="text-slate-400">Algorithm:</span> <strong className="text-cyan-400">{item.algorithm}</strong>
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <span>Operations: <strong className="text-white">{item.solution_length}</strong></span>
                      <span>Time: {item.execution_time}ms</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoadSimulation({
                          jugA: item.jug_a_capacity,
                          jugB: item.jug_b_capacity,
                          target: item.target,
                          initialA: item.initial_a,
                          initialB: item.initial_b,
                          algorithm: item.algorithm.includes('Breadth') ? 'bfs' : 'gbfs'
                        });
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 font-semibold transition-all flex items-center gap-1 text-[11px]"
                    >
                      <span>Load into Workbench</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] text-slate-400">Click for steps</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Detailed Steps Panel if an item is clicked */}
          {selectedDetail && (
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-300">
                  Recorded Steps for Simulation #{selectedDetail.id} ({selectedDetail.steps.length} steps)
                </span>
                <span className="text-slate-400 text-[11px]">{selectedDetail.algorithm}</span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {selectedDetail.steps.map(step => (
                  <div 
                    key={step.id} 
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-cyan-400 font-bold mr-2">Step {step.step_number}:</span>
                      <span className="text-white">({step.jug_a}, {step.jug_b})</span>
                      <span className="text-slate-400 ml-2 font-sans">{step.action}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">h={step.heuristic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            {historyList.length} recorded simulation runs in database
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
