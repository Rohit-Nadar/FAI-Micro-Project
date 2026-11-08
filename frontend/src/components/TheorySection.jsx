import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Cpu, 
  Layers, 
  ArrowRightLeft, 
  Compass, 
  Code, 
  AlertTriangle, 
  CheckCircle,
  Binary,
  Lightbulb
} from 'lucide-react';

export default function TheorySection() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '1. Problem & AI', icon: BookOpen },
    { id: 'operators', label: '2. Legal Operators', icon: ArrowRightLeft },
    { id: 'gbfs', label: '3. Greedy Best-First Search', icon: Compass },
    { id: 'heuristic', label: '4. Heuristic & GCD', icon: Binary },
    { id: 'analysis', label: '5. Advantages & Limits', icon: AlertTriangle },
  ];

  return (
    <section id="theory" className="py-16 md:py-24 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-3">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Academic Curriculum &bull; Unit II: Search Strategies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Educational Theory & Foundations
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Detailed walkthrough of the state space, production rules, informed heuristic formulation, and search tree mechanics.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-semibold'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="glass-panel p-6 sm:p-8">
          {/* TAB 1: Problem & AI Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  Problem Statement & Artificial Intelligence Formulation
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Classical state-space search benchmark where uncalibrated containers must measure an exact target volume.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <h4 className="font-semibold text-cyan-300 text-base">The Classic Water Jug Riddle</h4>
                  <p className="text-slate-300 leading-relaxed">
                    You are given two jugs of capacity <strong className="text-white">C<sub>A</sub></strong> and <strong className="text-white">C<sub>B</sub></strong> litres 
                    with infinite water supply and no measuring marks. The goal is to obtain exactly <strong className="text-cyan-400 font-mono">T litres</strong> in 
                    either jug using the minimal number of operations.
                  </p>
                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                    <p className="text-cyan-400 font-semibold">// Default Micro-Project Setup:</p>
                    <p>&bull; Jug A Capacity (C<sub>A</sub>) = 4 Litres</p>
                    <p>&bull; Jug B Capacity (C<sub>B</sub>) = 3 Litres</p>
                    <p>&bull; Target Quantity (T) = 2 Litres</p>
                    <p>&bull; Initial State = (0, 0) [Both jugs completely empty]</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-cyan-300 text-base">State-Space Representation in AI</h4>
                  <p className="text-slate-300 leading-relaxed">
                    In Artificial Intelligence, a problem is formulated as a tuple: <span className="text-cyan-300 font-mono">&#123;S, S<sub>0</sub>, O, G&#125;</span>:
                  </p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">&bull;</span>
                      <span><strong>State Space (S):</strong> Set of ordered pairs <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">(x, y)</code> where 0 &le; x &le; C<sub>A</sub> and 0 &le; y &le; C<sub>B</sub>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">&bull;</span>
                      <span><strong>Initial State (S<sub>0</sub>):</strong> <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono">(0, 0)</code>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">&bull;</span>
                      <span><strong>Goal Condition (G):</strong> A state is a goal if <strong className="text-emerald-400 font-mono">x == T OR y == T</strong>. (Both jugs do not need to contain T).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">&bull;</span>
                      <span><strong>Operators (O):</strong> 6 legal production rules that transition state (x, y) to (x&apos;, y&apos;).</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Legal Operators */}
          {activeTab === 'operators' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
                  The Six Legal Production Rules (Operators)
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Every legal move corresponds to an edge in the state-space search graph.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="bg-slate-950/80 text-cyan-400 font-mono border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Operator #</th>
                      <th className="py-3 px-4">Action Name</th>
                      <th className="py-3 px-4">Precondition</th>
                      <th className="py-3 px-4">Resulting State (x&apos;, y&apos;)</th>
                      <th className="py-3 px-4">Physical Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-cyan-400 font-bold">1</td>
                      <td className="py-3 px-4 text-white font-sans font-semibold">Fill Jug A</td>
                      <td className="py-3 px-4 text-amber-300">x &lt; C<sub>A</sub></td>
                      <td className="py-3 px-4 text-emerald-400">(C<sub>A</sub>, y)</td>
                      <td className="py-3 px-4 font-sans text-slate-300">Fill Jug A completely from the infinite water source.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-cyan-400 font-bold">2</td>
                      <td className="py-3 px-4 text-white font-sans font-semibold">Fill Jug B</td>
                      <td className="py-3 px-4 text-amber-300">y &lt; C<sub>B</sub></td>
                      <td className="py-3 px-4 text-emerald-400">(x, C<sub>B</sub>)</td>
                      <td className="py-3 px-4 font-sans text-slate-300">Fill Jug B completely from the infinite water source.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-cyan-400 font-bold">3</td>
                      <td className="py-3 px-4 text-white font-sans font-semibold">Empty Jug A</td>
                      <td className="py-3 px-4 text-amber-300">x &gt; 0</td>
                      <td className="py-3 px-4 text-emerald-400">(0, y)</td>
                      <td className="py-3 px-4 font-sans text-slate-300">Discard all water from Jug A onto the ground.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-cyan-400 font-bold">4</td>
                      <td className="py-3 px-4 text-white font-sans font-semibold">Empty Jug B</td>
                      <td className="py-3 px-4 text-amber-300">y &gt; 0</td>
                      <td className="py-3 px-4 text-emerald-400">(x, 0)</td>
                      <td className="py-3 px-4 font-sans text-slate-300">Discard all water from Jug B onto the ground.</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-cyan-400 font-bold">5</td>
                      <td className="py-3 px-4 text-white font-sans font-semibold">Pour A into B</td>
                      <td className="py-3 px-4 text-amber-300">x &gt; 0 and y &lt; C<sub>B</sub></td>
                      <td className="py-3 px-4 text-emerald-400">(x - d, y + d)</td>
                      <td className="py-3 px-4 font-sans text-slate-300">Pour water until Jug B is full or Jug A is empty. d = min(x, C<sub>B</sub> - y).</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-cyan-400 font-bold">6</td>
                      <td className="py-3 px-4 text-white font-sans font-semibold">Pour B into A</td>
                      <td className="py-3 px-4 text-amber-300">y &gt; 0 and x &lt; C<sub>A</sub></td>
                      <td className="py-3 px-4 text-emerald-400">(x + d, y - d)</td>
                      <td className="py-3 px-4 font-sans text-slate-300">Pour water until Jug A is full or Jug B is empty. d = min(y, C<sub>A</sub> - x).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Greedy Best-First Search */}
          {activeTab === 'gbfs' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  Greedy Best-First Search (GBFS) Mechanics
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Evaluation function: <code className="text-cyan-300 font-mono font-bold">f(n) = h(n)</code>. Priority is determined strictly by the heuristic estimate.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <h4 className="font-semibold text-cyan-300 text-base">Algorithm Steps</h4>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
                    <li><strong className="text-white">Initialize Frontier:</strong> Insert initial state <code className="text-cyan-300 font-mono">(0, 0)</code> into a min-priority queue with priority <code className="text-cyan-300 font-mono">h(0, 0)</code>.</li>
                    <li><strong className="text-white">Priority Queue Pop:</strong> Select the state <code className="text-cyan-300 font-mono">n</code> with the minimum <code className="text-cyan-300 font-mono">h(n)</code>.</li>
                    <li><strong className="text-white">Goal Verification:</strong> If either <code className="text-cyan-300 font-mono">x == T</code> or <code className="text-cyan-300 font-mono">y == T</code>, terminate search and reconstruct path!</li>
                    <li><strong className="text-white">State Expansion:</strong> Mark <code className="text-cyan-300 font-mono">n</code> as visited. Apply all 6 legal operators to produce child states.</li>
                    <li><strong className="text-white">Deterministic Tie-Breaking:</strong> When multiple states have identical heuristic values, tie-breaking is handled using a monotonic incrementing counter <code className="text-cyan-300 font-mono">(h, counter, state)</code>, avoiding tuple comparison errors.</li>
                    <li><strong className="text-white">Loop:</strong> Repeat until a goal is found or frontier is exhausted.</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-cyan-300 text-base">Key Distinction: GBFS vs A* vs BFS</h4>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30">
                      <span className="text-cyan-400 font-bold">Greedy Best-First Search:</span>
                      <p className="text-slate-300 mt-1 font-sans">
                        <code className="text-cyan-300 font-mono font-bold">f(n) = h(n)</code>. Ignores past cost <code className="text-slate-400">g(n)</code> entirely. Explores the branch that &ldquo;looks&rdquo; closest right now. Fast, but not guaranteed to find the shortest path.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-blue-500/30">
                      <span className="text-blue-400 font-bold">Breadth-First Search (BFS):</span>
                      <p className="text-slate-300 mt-1 font-sans">
                        <code className="text-blue-300 font-mono font-bold">f(n) = depth(n)</code>. Explores layer by layer. Guarantees finding the <strong className="text-white">optimal (shortest)</strong> sequence of operations.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-purple-500/30">
                      <span className="text-purple-400 font-bold">A* Search:</span>
                      <p className="text-slate-300 mt-1 font-sans">
                        <code className="text-purple-300 font-mono font-bold">f(n) = g(n) + h(n)</code>. Combines past path cost with future estimate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Heuristic & GCD */}
          {activeTab === 'heuristic' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Binary className="w-5 h-5 text-cyan-400" />
                  Student-Designed Heuristic & Mathematical Solvability (GCD)
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Mathematical proof of feasibility via Bézout&apos;s Identity and Manhattan distance to target.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <h4 className="font-semibold text-cyan-300 text-base">The Student-Designed Heuristic</h4>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/40 text-center">
                    <p className="text-xs text-slate-400 mb-1">Heuristic Formula:</p>
                    <code className="text-lg sm:text-xl font-bold text-cyan-300 font-mono">
                      h(x, y) = min(|target - x|, |target - y|)
                    </code>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    This function measures the shortest distance between either jug&apos;s current volume and the required target volume.
                  </p>
                  <ul className="space-y-1 text-slate-300 text-xs">
                    <li>&bull; If <code className="text-cyan-300">x == target</code> or <code className="text-cyan-300">y == target</code>, <strong className="text-emerald-400">h(x, y) = 0</strong> (Goal reached).</li>
                    <li>&bull; For initial state <code className="text-cyan-300">(0, 0)</code> with target 2L: <code className="text-cyan-300">h(0, 0) = min(|2-0|, |2-0|) = 2</code>.</li>
                    <li>&bull; When Jug B is filled to 3L: <code className="text-cyan-300">h(0, 3) = min(|2-0|, |2-3|) = min(2, 1) = 1</code>.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-cyan-300 text-base">Mathematical Feasibility: Bézout&apos;s Identity</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Any quantity of water measured by two jugs of capacity <strong className="text-white">C<sub>A</sub></strong> and <strong className="text-white">C<sub>B</sub></strong> is an integer linear combination:
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-cyan-300 font-bold">
                    m &times; C<sub>A</sub> + n &times; C<sub>B</sub> = Target
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    By number theory (Bézout&apos;s Lemma), this equation has integer solutions if and only if:
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs text-amber-300 font-mono space-y-1">
                    <p>1. Target &le; max(C<sub>A</sub>, C<sub>B</sub>)</p>
                    <p>2. Target % GCD(C<sub>A</sub>, C<sub>B</sub>) == 0</p>
                    <p className="text-slate-400 font-sans mt-1">If either condition is violated, the target is mathematically impossible!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Advantages & Limitations */}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Advantages & Academic Limitations of GBFS
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Why Greedy Best-First Search is prone to suboptimality and how heuristics can mislead it.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                  <h4 className="text-emerald-400 font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Advantages of Greedy Best-First Search
                  </h4>
                  <ul className="space-y-2 text-slate-300 text-xs sm:text-sm">
                    <li>&bull; <strong>High Search Efficiency:</strong> Drastically reduces search time by prioritizing nodes that seem closest to the target.</li>
                    <li>&bull; <strong>Minimal Memory Consumption:</strong> Expands significantly fewer nodes than uninformed brute-force search when the heuristic is well-aligned.</li>
                    <li>&bull; <strong>Rapid Convergence:</strong> Quickly finds a solution path in vast or infinite state spaces.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                  <h4 className="text-amber-400 font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Limitations & Heuristic Misguidance
                  </h4>
                  <ul className="space-y-2 text-slate-300 text-xs sm:text-sm">
                    <li>&bull; <strong>Not Optimal:</strong> GBFS does not evaluate path cost <code className="text-amber-300 font-mono">g(n)</code>. It frequently returns longer, circuitous solution paths.</li>
                    <li>&bull; <strong>Susceptible to Dead Ends & Detours:</strong> A node with low <code className="text-amber-300 font-mono">h(n)</code> might be a trap that requires backtracking or circular pouring.</li>
                    <li>&bull; <strong>Proven Academic Misleading Case:</strong> For jugs of 4L & 7L with target 5L, GBFS is deceived into a 12-operation path, whereas BFS discovers the 8-operation optimal route!</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
