"""
Greedy Best-First Search (GBFS) implementation for the Water Jug Problem.

Evaluation function:
    f(n) = h(n) = min(|target - x|, |target - y|)

Priority is determined solely by the heuristic value h(n).
Ties in heuristic value are resolved deterministically using an incrementing counter.
"""

import heapq
import math
import time
from typing import Dict, List, Optional, Set, Tuple, Any
from .heuristic import heuristic
from .operators import get_successors

def solve_water_jug_gbfs(
    a_cap: int,
    b_cap: int,
    target: int,
    initial_a: int = 0,
    initial_b: int = 0,
    max_expansions: int = 2000
) -> Dict[str, Any]:
    """
    Solve the Water Jug Problem using Greedy Best-First Search.

    Goal Condition:
        Either Jug A or Jug B contains exactly the target quantity (x == target or y == target).

    Returns a comprehensive dictionary containing:
        - success: bool
        - message: str
        - solution_path: List[Dict] (step-by-step from initial to goal)
        - solution_length: int (number of operations)
        - expanded_states: int
        - generated_states: int
        - execution_time_ms: float
        - pq_snapshots: List[Dict] (for interactive priority queue visualization)
        - graph_data: Dict with nodes and edges for React Flow
        - initial_state: Tuple[int, int]
        - goal_state: Optional[Tuple[int, int]]
        - algorithm: "Greedy Best-First Search"
    """
    start_time = time.perf_counter()

    # --- 1. Validation Checks ---
    if a_cap <= 0 or b_cap <= 0:
        return {
            "success": False,
            "message": "Jug capacities must be strictly positive integers (> 0).",
            "solution_path": [],
            "solution_length": 0,
            "expanded_states": 0,
            "generated_states": 0,
            "execution_time_ms": 0.0,
            "pq_snapshots": [],
            "graph_data": {"nodes": [], "edges": []},
            "initial_state": [initial_a, initial_b],
            "goal_state": None,
            "algorithm": "Greedy Best-First Search"
        }

    if target < 0:
        return {
            "success": False,
            "message": "Target quantity must be a non-negative integer (>= 0).",
            "solution_path": [],
            "solution_length": 0,
            "expanded_states": 0,
            "generated_states": 0,
            "execution_time_ms": 0.0,
            "pq_snapshots": [],
            "graph_data": {"nodes": [], "edges": []},
            "initial_state": [initial_a, initial_b],
            "goal_state": None,
            "algorithm": "Greedy Best-First Search"
        }

    if initial_a < 0 or initial_a > a_cap or initial_b < 0 or initial_b > b_cap:
        return {
            "success": False,
            "message": f"Initial quantities ({initial_a}, {initial_b}) must be within jug capacities (0 to {a_cap}, 0 to {b_cap}).",
            "solution_path": [],
            "solution_length": 0,
            "expanded_states": 0,
            "generated_states": 0,
            "execution_time_ms": 0.0,
            "pq_snapshots": [],
            "graph_data": {"nodes": [], "edges": []},
            "initial_state": [initial_a, initial_b],
            "goal_state": None,
            "algorithm": "Greedy Best-First Search"
        }

    # Target greater than both jugs is mathematically impossible
    if target > max(a_cap, b_cap):
        return {
            "success": False,
            "message": f"Target quantity ({target}L) exceeds both Jug A ({a_cap}L) and Jug B ({b_cap}L) capacities.",
            "solution_path": [],
            "solution_length": 0,
            "expanded_states": 0,
            "generated_states": 0,
            "execution_time_ms": round((time.perf_counter() - start_time) * 1000, 3),
            "pq_snapshots": [],
            "graph_data": {"nodes": [], "edges": []},
            "initial_state": [initial_a, initial_b],
            "goal_state": None,
            "algorithm": "Greedy Best-First Search"
        }

    # Mathematical feasibility check using Greatest Common Divisor (GCD)
    # Target 0 is always achievable (e.g., empty both jugs).
    # For target > 0, target must be a multiple of gcd(a_cap, b_cap).
    gcd_val = math.gcd(a_cap, b_cap)
    if target > 0 and (target % gcd_val != 0):
        return {
            "success": False,
            "message": (
                f"Target {target}L cannot be measured with jugs of capacities {a_cap}L and {b_cap}L. "
                f"By Bézout's identity, the target must be a multiple of GCD({a_cap}, {b_cap}) = {gcd_val}."
            ),
            "solution_path": [],
            "solution_length": 0,
            "expanded_states": 0,
            "generated_states": 0,
            "execution_time_ms": round((time.perf_counter() - start_time) * 1000, 3),
            "pq_snapshots": [],
            "graph_data": {"nodes": [], "edges": []},
            "initial_state": [initial_a, initial_b],
            "goal_state": None,
            "algorithm": "Greedy Best-First Search"
        }

    initial_state = (initial_a, initial_b)
    initial_h = heuristic(initial_a, initial_b, target)

    # Check if initial state is already a goal state
    if initial_a == target or initial_b == target:
        elapsed = round((time.perf_counter() - start_time) * 1000, 3)
        node_id = f"{initial_a},{initial_b}"
        return {
            "success": True,
            "message": "Initial state already satisfies the goal condition!",
            "solution_path": [
                {
                    "step_number": 0,
                    "jug_a": initial_a,
                    "jug_b": initial_b,
                    "action": "Initial State (Goal Reached)",
                    "heuristic": initial_h
                }
            ],
            "solution_length": 0,
            "expanded_states": 0,
            "generated_states": 1,
            "execution_time_ms": elapsed,
            "pq_snapshots": [
                {
                    "step": 0,
                    "popped_state": [initial_a, initial_b],
                    "heuristic": initial_h,
                    "reason": "Initial state already matches target quantity.",
                    "queue_size": 0,
                    "queue_contents": [],
                    "action_taken": "Initial State",
                    "successors": []
                }
            ],
            "graph_data": {
                "nodes": [
                    {
                        "id": node_id,
                        "label": f"({initial_a}, {initial_b})",
                        "jug_a": initial_a,
                        "jug_b": initial_b,
                        "heuristic": initial_h,
                        "status": "goal"
                    }
                ],
                "edges": []
            },
            "initial_state": [initial_a, initial_b],
            "goal_state": [initial_a, initial_b],
            "algorithm": "Greedy Best-First Search"
        }

    # --- 2. GBFS Search Structures ---
    # Priority queue entries: (heuristic, counter, state)
    # `counter` guarantees tie-breaking without evaluating tuples or states
    counter = 0
    pq: List[Tuple[int, int, Tuple[int, int]]] = []
    heapq.heappush(pq, (initial_h, counter, initial_state))

    # Parent dictionary: maps state -> (parent_state, action_taken)
    parents: Dict[Tuple[int, int], Tuple[Optional[Tuple[int, int]], str]] = {
        initial_state: (None, "Initial State")
    }

    # Visited set: states popped from PQ and expanded
    visited: Set[Tuple[int, int]] = set()

    # Track discovered states for graph nodes
    all_discovered_states: Dict[Tuple[int, int], int] = {initial_state: initial_h}
    all_edges: List[Dict[str, Any]] = []

    pq_snapshots: List[Dict[str, Any]] = []
    expanded_count = 0
    generated_count = 1  # initial state is 1 generated state
    goal_state: Optional[Tuple[int, int]] = None

    step_counter = 0

    while pq and expanded_count < max_expansions:
        current_h, _, current_state = heapq.heappop(pq)

        # Skip if already expanded
        if current_state in visited:
            continue

        visited.add(current_state)
        expanded_count += 1
        curr_x, curr_y = current_state

        # Check goal condition: either jug has target
        if curr_x == target or curr_y == target:
            goal_state = current_state
            # Record goal selection snapshot
            pq_snapshots.append({
                "step": step_counter,
                "popped_state": [curr_x, curr_y],
                "heuristic": current_h,
                "reason": f"Goal state reached! Jug has {target}L (h=0).",
                "queue_size": len(pq),
                "queue_contents": [
                    {"state": [s[0], s[1]], "h": h_val, "priority": idx + 1}
                    for idx, (h_val, _, s) in enumerate(sorted(pq)[:5])
                ],
                "action_taken": parents[current_state][1],
                "successors": []
            })
            break

        # Generate legal successor states
        successors = get_successors(current_state, a_cap, b_cap)
        step_successors_log = []

        for next_state, action in successors:
            generated_count += 1
            next_x, next_y = next_state
            next_h = heuristic(next_x, next_y, target)

            # Record graph edge
            edge_id = f"e_{curr_x}_{curr_y}_to_{next_x}_{next_y}"
            all_edges.append({
                "id": edge_id,
                "source": f"{curr_x},{curr_y}",
                "target": f"{next_x},{next_y}",
                "label": action,
                "is_solution": False
            })

            if next_state not in all_discovered_states:
                all_discovered_states[next_state] = next_h

            if next_state in visited:
                step_successors_log.append({
                    "state": [next_x, next_y],
                    "action": action,
                    "h": next_h,
                    "status": "already_visited"
                })
                continue

            # In GBFS, record parent if not discovered or discovered with new path
            if next_state not in parents:
                parents[next_state] = (current_state, action)
                counter += 1
                heapq.heappush(pq, (next_h, counter, next_state))
                step_successors_log.append({
                    "state": [next_x, next_y],
                    "action": action,
                    "h": next_h,
                    "status": "enqueued"
                })
            else:
                step_successors_log.append({
                    "state": [next_x, next_y],
                    "action": action,
                    "h": next_h,
                    "status": "already_in_frontier"
                })

        # Save snapshot of priority queue state and explanation
        reason_text = (
            f"Selected state ({curr_x}, {curr_y}) with lowest heuristic h={current_h} "
            f"out of {len(pq) + 1} candidates."
        )
        sorted_preview = sorted(pq, key=lambda item: (item[0], item[1]))[:6]
        pq_snapshots.append({
            "step": step_counter,
            "popped_state": [curr_x, curr_y],
            "heuristic": current_h,
            "reason": reason_text,
            "queue_size": len(pq),
            "queue_contents": [
                {"state": [item[2][0], item[2][1]], "h": item[0], "priority": idx + 1}
                for idx, item in enumerate(sorted_preview)
            ],
            "action_taken": parents[current_state][1],
            "successors": step_successors_log
        })
        step_counter += 1

    # --- 3. Reconstruct Solution Path ---
    elapsed_time = round((time.perf_counter() - start_time) * 1000, 3)

    if not goal_state:
        # Build search graph for failed search as well
        nodes = []
        for st, h_val in all_discovered_states.items():
            status = "expanded" if st in visited else "frontier"
            if st == initial_state:
                status = "initial"
            nodes.append({
                "id": f"{st[0]},{st[1]}",
                "label": f"({st[0]}, {st[1]})",
                "jug_a": st[0],
                "jug_b": st[1],
                "heuristic": h_val,
                "status": status
            })

        return {
            "success": False,
            "message": "No solution found within expansion limit.",
            "solution_path": [],
            "solution_length": 0,
            "expanded_states": expanded_count,
            "generated_states": generated_count,
            "execution_time_ms": elapsed_time,
            "pq_snapshots": pq_snapshots,
            "graph_data": {"nodes": nodes, "edges": all_edges},
            "initial_state": [initial_a, initial_b],
            "goal_state": None,
            "algorithm": "Greedy Best-First Search"
        }

    # Reconstruct path by following parents from goal back to initial
    path_states: List[Tuple[Tuple[int, int], str]] = []
    curr = goal_state
    while curr is not None:
        p_state, action = parents[curr]
        path_states.append((curr, action))
        curr = p_state
    path_states.reverse()

    solution_path = []
    solution_states_set = set()
    for idx, (st, act) in enumerate(path_states):
        solution_states_set.add(st)
        solution_path.append({
            "step_number": idx,
            "jug_a": st[0],
            "jug_b": st[1],
            "action": act,
            "heuristic": heuristic(st[0], st[1], target)
        })

    # Number of operations is transitions between states = len(solution_path) - 1
    solution_length = max(0, len(solution_path) - 1)

    # Build Graph Data with solution highlighting
    solution_edges_set = set()
    for i in range(len(path_states) - 1):
        s1 = path_states[i][0]
        s2 = path_states[i + 1][0]
        solution_edges_set.add((f"{s1[0]},{s1[1]}", f"{s2[0]},{s2[1]}"))

    nodes = []
    for st, h_val in all_discovered_states.items():
        if st == goal_state:
            status = "goal"
        elif st == initial_state:
            status = "initial"
        elif st in solution_states_set:
            status = "solution"
        elif st in visited:
            status = "expanded"
        else:
            status = "frontier"

        nodes.append({
            "id": f"{st[0]},{st[1]}",
            "label": f"({st[0]}, {st[1]})",
            "jug_a": st[0],
            "jug_b": st[1],
            "heuristic": h_val,
            "status": status
        })

    # Filter and format edges (deduplicating)
    seen_edge_keys = set()
    formatted_edges = []
    for edge in all_edges:
        key = (edge["source"], edge["target"])
        if key not in seen_edge_keys:
            seen_edge_keys.add(key)
            is_sol = key in solution_edges_set
            formatted_edges.append({
                "id": edge["id"],
                "source": edge["source"],
                "target": edge["target"],
                "label": edge["label"],
                "is_solution": is_sol
            })

    return {
        "success": True,
        "message": f"Solution found in {solution_length} operations!",
        "solution_path": solution_path,
        "solution_length": solution_length,
        "expanded_states": expanded_count,
        "generated_states": generated_count,
        "execution_time_ms": elapsed_time,
        "pq_snapshots": pq_snapshots,
        "graph_data": {
            "nodes": nodes,
            "edges": formatted_edges
        },
        "initial_state": [initial_a, initial_b],
        "goal_state": [goal_state[0], goal_state[1]],
        "algorithm": "Greedy Best-First Search"
    }
