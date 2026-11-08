/**
 * Client-Side AI Solver Fallback for Water Jug Problem
 * Implements pure Greedy Best-First Search and BFS identical to FastAPI backend.
 * Ensures 100% uptime even during Render free-tier cold starts.
 */

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function heuristic(x, y, target) {
  return Math.min(Math.abs(target - x), Math.abs(target - y));
}

function getSuccessors(x, y, aCap, bCap) {
  const successors = [];

  // 1. Fill Jug A
  if (x < aCap) {
    successors.push([[aCap, y], `Fill Jug A (0 -> ${aCap}L)`]);
  }
  // 2. Fill Jug B
  if (y < bCap) {
    successors.push([[x, bCap], `Fill Jug B (0 -> ${bCap}L)`]);
  }
  // 3. Empty Jug A
  if (x > 0) {
    successors.push([[0, y], `Empty Jug A (${x}L -> 0L)`]);
  }
  // 4. Empty Jug B
  if (y > 0) {
    successors.push([[x, 0], `Empty Jug B (${y}L -> 0L)`]);
  }
  // 5. Pour A into B
  if (x > 0 && y < bCap) {
    const pour = Math.min(x, bCap - y);
    successors.push([[x - pour, y + pour], `Pour Jug A -> Jug B (${pour}L transferred)`]);
  }
  // 6. Pour B into A
  if (y > 0 && x < aCap) {
    const pour = Math.min(y, aCap - x);
    successors.push([[x + pour, y - pour], `Pour Jug B -> Jug A (${pour}L transferred)`]);
  }

  return successors;
}

export function solveWaterJugGBFS(aCap, bCap, target, initialA = 0, initialB = 0) {
  const startTime = performance.now();

  // Feasibility checks
  if (aCap <= 0 || bCap <= 0) {
    return { success: false, message: 'Jug capacities must be strictly positive (> 0).' };
  }
  if (target < 0) {
    return { success: false, message: 'Target water quantity cannot be negative.' };
  }
  if (initialA < 0 || initialA > aCap || initialB < 0 || initialB > bCap) {
    return { success: false, message: 'Initial water quantities exceed jug capacities.' };
  }
  if (target > Math.max(aCap, bCap)) {
    return { success: false, message: `Target ${target}L exceeds both jug capacities (${aCap}L, ${bCap}L).` };
  }

  const gcdVal = gcd(aCap, bCap);
  if (target > 0 && target % gcdVal !== 0) {
    return {
      success: false,
      message: `Target ${target}L is mathematically impossible (Bézout's identity). GCD(${aCap}, ${bCap}) = ${gcdVal}.`
    };
  }

  const initialState = [initialA, initialB];
  const initialStateKey = `${initialA},${initialB}`;

  // Goal check at initial state
  if (initialA === target || initialB === target) {
    return {
      success: true,
      message: 'Initial state is already the goal state!',
      solution_path: [
        { step_number: 0, jug_a: initialA, jug_b: initialB, action: 'Initial State', heuristic: 0 }
      ],
      solution_length: 0,
      expanded_states: 0,
      generated_states: 1,
      execution_time_ms: +(performance.now() - startTime).toFixed(3),
      pq_snapshots: [],
      graph_data: {
        nodes: [{ id: initialStateKey, label: `(${initialA}, ${initialB})`, jug_a: initialA, jug_b: initialB, heuristic: 0, status: 'goal' }],
        edges: []
      },
      initial_state: initialState,
      goal_state: initialState,
      algorithm: 'Greedy Best-First Search'
    };
  }

  // Priority Queue: array of { h, tieBreaker, state: [x, y], stateKey }
  let tieBreaker = 0;
  const pq = [{
    h: heuristic(initialA, initialB, target),
    tieBreaker: tieBreaker++,
    state: [initialA, initialB],
    stateKey: initialStateKey
  }];

  const visited = new Set();
  const parents = new Map(); // stateKey -> { parentKey, parentState, action }
  parents.set(initialStateKey, { parentKey: null, parentState: null, action: 'Initial State' });

  const allDiscoveredStates = new Map();
  allDiscoveredStates.set(initialStateKey, heuristic(initialA, initialB, target));

  const allEdges = [];
  const pqSnapshots = [];
  let expandedCount = 0;
  let generatedCount = 1;
  let goalState = null;

  while (pq.length > 0) {
    // Sort ascending by heuristic, then tie-breaker
    pq.sort((a, b) => a.h !== b.h ? a.h - b.h : a.tieBreaker - b.tieBreaker);

    // Snapshot priority queue state
    const currentQueueSnapshot = pq.slice(0, 8).map((item, idx) => ({
      rank: idx + 1,
      state: item.state,
      heuristic: item.h,
      formula: `h(${item.state[0]},${item.state[1]}) = ${item.h}`,
      is_current: idx === 0
    }));

    const popped = pq.shift();
    const curr = popped.state;
    const currKey = popped.stateKey;
    const currH = popped.h;

    if (visited.has(currKey)) {
      continue;
    }
    visited.add(currKey);
    expandedCount++;

    // Goal Check
    if (curr[0] === target || curr[1] === target) {
      goalState = curr;
      const act = parents.get(currKey)?.action || 'Goal Reached';
      pqSnapshots.push({
        step: expandedCount,
        popped_state: curr,
        selected_state: curr,
        heuristic: currH,
        h: currH,
        action: act,
        action_taken: act,
        reason: `Goal reached! Either Jug A or Jug B contains exactly ${target}L.`,
        selection_reason: `Goal reached! Either Jug A or Jug B contains exactly ${target}L.`,
        queue_size: pq.length,
        queue_contents: currentQueueSnapshot.map(item => ({
          priority: item.rank,
          state: item.state,
          h: item.heuristic,
          heuristic: item.heuristic
        })),
        queue_state: currentQueueSnapshot,
        successors: [],
        generated_successors: []
      });
      break;
    }

    const generatedInThisStep = [];
    const successors = getSuccessors(curr[0], curr[1], aCap, bCap);

    for (const [nextState, action] of successors) {
      const nextKey = `${nextState[0]},${nextState[1]}`;
      generatedCount++;
      const nextH = heuristic(nextState[0], nextState[1], target);

      allEdges.push({
        id: `e_${currKey}_${nextKey}`,
        source: currKey,
        target: nextKey,
        label: action
      });

      if (!allDiscoveredStates.has(nextKey)) {
        allDiscoveredStates.set(nextKey, nextH);
      }

      if (!visited.has(nextKey)) {
        if (!parents.has(nextKey)) {
          parents.set(nextKey, { parentKey: currKey, parentState: curr, action });
        }
        pq.push({
          h: nextH,
          tieBreaker: tieBreaker++,
          state: nextState,
          stateKey: nextKey
        });

        generatedInThisStep.push({
          state: nextState,
          action,
          heuristic: nextH,
          calculation: `h(${nextState[0]},${nextState[1]}) = min(|${target}-${nextState[0]}|, |${target}-${nextState[1]}|) = ${nextH}`
        });
      }
    }

    const act = parents.get(currKey)?.action || 'Initial State';
    pqSnapshots.push({
      step: expandedCount,
      popped_state: curr,
      selected_state: curr,
      heuristic: currH,
      h: currH,
      action: act,
      action_taken: act,
      reason: `Lowest heuristic value in frontier h(n)=${currH}.`,
      selection_reason: `Lowest heuristic value in frontier h(n)=${currH}.`,
      queue_size: pq.length,
      queue_contents: currentQueueSnapshot.map(item => ({
        priority: item.rank,
        state: item.state,
        h: item.heuristic,
        heuristic: item.heuristic
      })),
      queue_state: currentQueueSnapshot,
      successors: generatedInThisStep,
      generated_successors: generatedInThisStep
    });
  }

  const elapsed = +(performance.now() - startTime).toFixed(3);

  if (!goalState) {
    return {
      success: false,
      message: 'No solution found within the state space.',
      solution_path: [],
      solution_length: 0,
      expanded_states: expandedCount,
      generated_states: generatedCount,
      execution_time_ms: elapsed,
      pq_snapshots: pqSnapshots,
      graph_data: { nodes: [], edges: [] },
      initial_state: initialState,
      goal_state: null,
      algorithm: 'Greedy Best-First Search'
    };
  }

  // Reconstruct path
  const pathStates = [];
  let cKey = `${goalState[0]},${goalState[1]}`;
  while (cKey) {
    const node = parents.get(cKey);
    const coords = cKey.split(',').map(Number);
    pathStates.push({ state: coords, action: node.action });
    cKey = node.parentKey;
  }
  pathStates.reverse();

  const solutionPath = pathStates.map((item, idx) => ({
    step_number: idx,
    jug_a: item.state[0],
    jug_b: item.state[1],
    action: item.action,
    heuristic: heuristic(item.state[0], item.state[1], target)
  }));

  const solutionLength = Math.max(0, solutionPath.length - 1);
  const solutionStatesSet = new Set(pathStates.map(p => `${p.state[0]},${p.state[1]}`));
  const solutionEdgesSet = new Set();
  for (let i = 0; i < pathStates.length - 1; i++) {
    const s1 = `${pathStates[i].state[0]},${pathStates[i].state[1]}`;
    const s2 = `${pathStates[i + 1].state[0]},${pathStates[i + 1].state[1]}`;
    solutionEdgesSet.add(`${s1}->${s2}`);
  }

  // Graph data
  const nodes = [];
  for (const [sKey, hVal] of allDiscoveredStates.entries()) {
    const [sx, sy] = sKey.split(',').map(Number);
    let status = 'frontier';
    if (sx === goalState[0] && sy === goalState[1]) status = 'goal';
    else if (sx === initialA && sy === initialB) status = 'initial';
    else if (solutionStatesSet.has(sKey)) status = 'solution';
    else if (visited.has(sKey)) status = 'expanded';

    nodes.push({
      id: sKey,
      label: `(${sx}, ${sy})`,
      jug_a: sx,
      jug_b: sy,
      heuristic: hVal,
      status
    });
  }

  const seenEdges = new Set();
  const formattedEdges = [];
  for (const edge of allEdges) {
    const pair = `${edge.source}->${edge.target}`;
    if (!seenEdges.has(pair)) {
      seenEdges.add(pair);
      formattedEdges.push({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        is_solution: solutionEdgesSet.has(pair)
      });
    }
  }

  return {
    success: true,
    message: `Solution successfully discovered in ${solutionLength} operations!`,
    solution_path: solutionPath,
    solution_length: solutionLength,
    expanded_states: expandedCount,
    generated_states: generatedCount,
    execution_time_ms: elapsed,
    pq_snapshots: pqSnapshots,
    graph_data: { nodes, edges: formattedEdges },
    initial_state: initialState,
    goal_state: goalState,
    algorithm: 'Greedy Best-First Search',
    database_saved: false
  };
}

export function solveWaterJugBFS(aCap, bCap, target, initialA = 0, initialB = 0) {
  const startTime = performance.now();
  const initialState = [initialA, initialB];
  const initialStateKey = `${initialA},${initialB}`;

  if (initialA === target || initialB === target) {
    return {
      success: true,
      solution_path: [{ step_number: 0, jug_a: initialA, jug_b: initialB, action: 'Initial State', heuristic: 0 }],
      solution_length: 0,
      expanded_states: 0,
      generated_states: 1,
      execution_time_ms: +(performance.now() - startTime).toFixed(3),
      algorithm: 'Breadth-First Search (Optimal)'
    };
  }

  const queue = [[initialA, initialB]];
  const visited = new Set([initialStateKey]);
  const parents = new Map();
  parents.set(initialStateKey, { parentKey: null, action: 'Initial State' });

  let expandedCount = 0;
  let generatedCount = 1;
  let goalState = null;

  while (queue.length > 0) {
    const curr = queue.shift();
    const currKey = `${curr[0]},${curr[1]}`;
    expandedCount++;

    const successors = getSuccessors(curr[0], curr[1], aCap, bCap);
    for (const [nextState, action] of successors) {
      const nextKey = `${nextState[0]},${nextState[1]}`;
      generatedCount++;

      if (!visited.has(nextKey)) {
        visited.add(nextKey);
        parents.set(nextKey, { parentKey: currKey, action });
        queue.push(nextState);

        if (nextState[0] === target || nextState[1] === target) {
          goalState = nextState;
          break;
        }
      }
    }
    if (goalState) break;
  }

  const elapsed = +(performance.now() - startTime).toFixed(3);
  if (!goalState) {
    return {
      success: false,
      solution_length: 0,
      expanded_states: expandedCount,
      generated_states: generatedCount,
      execution_time_ms: elapsed,
      algorithm: 'Breadth-First Search (Optimal)'
    };
  }

  const path = [];
  let cKey = `${goalState[0]},${goalState[1]}`;
  while (cKey) {
    const node = parents.get(cKey);
    const coords = cKey.split(',').map(Number);
    path.push({ state: coords, action: node.action });
    cKey = node.parentKey;
  }
  path.reverse();

  return {
    success: true,
    solution_path: path.map((item, idx) => ({
      step_number: idx,
      jug_a: item.state[0],
      jug_b: item.state[1],
      action: item.action,
      heuristic: heuristic(item.state[0], item.state[1], target)
    })),
    solution_length: Math.max(0, path.length - 1),
    expanded_states: expandedCount,
    generated_states: generatedCount,
    execution_time_ms: elapsed,
    algorithm: 'Breadth-First Search (Optimal)'
  };
}

