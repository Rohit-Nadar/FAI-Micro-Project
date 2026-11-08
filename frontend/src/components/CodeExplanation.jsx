import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, Terminal } from 'lucide-react';

export default function CodeExplanation() {
  const [activeSnippet, setActiveSnippet] = useState('gbfs');
  const [copied, setCopied] = useState(false);

  const snippets = {
    gbfs: {
      title: 'Greedy Best-First Search Engine',
      file: 'backend/app/algorithms/greedy_best_first.py',
      description: 'Core GBFS loop using Python heapq with monotonic counter for deterministic tie-breaking without comparing tuples.',
      code: `import heapq
from .heuristic import heuristic
from .operators import get_successors

def solve_water_jug_gbfs(a_cap, b_cap, target, initial_a=0, initial_b=0):
    initial_state = (initial_a, initial_b)
    initial_h = heuristic(initial_a, initial_b, target)

    # Min-Heap stores: (heuristic_value, tie_breaker_counter, state)
    counter = 0
    pq = []
    heapq.heappush(pq, (initial_h, counter, initial_state))

    # Tracks parent state and the action that discovered it
    parents = {initial_state: (None, "Initial State")}
    visited = set()

    while pq:
        # 1. Pop state with the lowest heuristic value h(n)
        curr_h, _, current_state = heapq.heappop(pq)

        if current_state in visited:
            continue
        visited.add(current_state)

        curr_x, curr_y = current_state

        # 2. Goal check: either jug contains the target quantity
        if curr_x == target or curr_y == target:
            return reconstruct_path(current_state, parents)

        # 3. Generate successor states from legal operators
        for next_state, action in get_successors(current_state, a_cap, b_cap):
            if next_state not in visited and next_state not in parents:
                parents[next_state] = (current_state, action)
                next_h = heuristic(next_state[0], next_state[1], target)
                counter += 1
                heapq.heappush(pq, (next_h, counter, next_state))`
    },
    heuristic: {
      title: 'Heuristic Function Formula',
      file: 'backend/app/algorithms/heuristic.py',
      description: 'Calculates the minimal Manhattan distance from either jug volume to the target volume.',
      code: `def heuristic(x: int, y: int, target: int) -> int:
    """
    Student-Designed Heuristic:
    h(x, y) = min(|target - x|, |target - y|)
    
    Returns 0 if and only if x == target or y == target (Goal).
    Estimates the minimal water volume that needs to change.
    """
    return min(abs(target - x), abs(target - y))`
    },
    operators: {
      title: 'The 6 Legal Production Rules',
      file: 'backend/app/algorithms/operators.py',
      description: 'Generates all valid state transitions adhering to container boundaries and physics.',
      code: `def get_successors(state, a_cap, b_cap):
    x, y = state
    successors = []

    # 1. Fill Jug A completely
    if x < a_cap:
        successors.append(((a_cap, y), f"Fill Jug A ({a_cap}L)"))

    # 2. Fill Jug B completely
    if y < b_cap:
        successors.append(((x, b_cap), f"Fill Jug B ({b_cap}L)"))

    # 3. Empty Jug A
    if x > 0:
        successors.append(((0, y), "Empty Jug A"))

    # 4. Empty Jug B
    if y > 0:
        successors.append(((x, 0), "Empty Jug B"))

    # 5. Pour Jug A into Jug B
    if x > 0 and y < b_cap:
        amount = min(x, b_cap - y)
        successors.append(((x - amount, y + amount), f"Pour {amount}L from A to B"))

    # 6. Pour Jug B into Jug A
    if y > 0 and x < a_cap:
        amount = min(y, a_cap - x)
        successors.append(((x + amount, y - amount), f"Pour {amount}L from B to A"))

    return successors`
    },
    gcd: {
      title: 'Mathematical Feasibility Check (Bézout)',
      file: 'backend/app/algorithms/greedy_best_first.py',
      description: 'Validates solvability using the Greatest Common Divisor before starting search.',
      code: `import math

def check_feasibility(a_cap: int, b_cap: int, target: int):
    # Target 0 is always achievable (empty containers)
    if target == 0:
        return True, "Solvable: Target is 0L."

    # Cannot measure more water than the largest jug
    if target > max(a_cap, b_cap):
        return False, f"Impossible: Target {target}L exceeds both jugs."

    # Bézout's identity: target must be a multiple of GCD(A, B)
    gcd_val = math.gcd(a_cap, b_cap)
    if target % gcd_val != 0:
        return False, (
            f"Impossible: Target {target}L is not a multiple of "
            f"GCD({a_cap}, {b_cap}) = {gcd_val}."
        )

    return True, "Feasible by Bézout's identity."`
    }
  };

  const current = snippets[activeSnippet];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Python Algorithm Implementation</h3>
            <p className="text-xs text-slate-400 font-mono">
              Production source code powering the FastAPI backend
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Snippet Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(snippets).map(([key, item]) => (
          <button
            key={key}
            onClick={() => setActiveSnippet(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeSnippet === key
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Description & File Path */}
      <div className="flex items-center justify-between text-xs font-mono bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
        <span className="text-slate-400 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">{current.file}</span>
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          {current.description}
        </span>
      </div>

      {/* Code Block */}
      <div className="relative rounded-2xl bg-[#030712] border border-slate-800/90 overflow-hidden shadow-2xl">
        <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="text-[11px] font-mono text-slate-400 ml-2">python3 &bull; production code</span>
        </div>
        <pre className="p-5 text-xs font-mono text-cyan-100 overflow-x-auto leading-relaxed">
          <code>{current.code}</code>
        </pre>
      </div>
    </div>
  );
}
