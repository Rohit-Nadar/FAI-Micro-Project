"""
Breadth-First Search (BFS) implementation for the Water Jug Problem.

BFS explores the state space level by level using a FIFO queue.
It is guaranteed to find the optimal (shortest) sequence of operations.
Used for performance benchmarking and demonstrating heuristic misguidance in GBFS.
"""

from collections import deque
import math
import time
from typing import Dict, List, Optional, Set, Tuple, Any
from .heuristic import heuristic
from .operators import get_successors

def solve_water_jug_bfs(
    a_cap: int,
    b_cap: int,
    target: int,
    initial_a: int = 0,
    initial_b: int = 0,
    max_expansions: int = 2000
) -> Dict[str, Any]:
    """
    Solve the Water Jug Problem using Breadth-First Search (uninformed optimal search).

    Returns:
        - success: bool
        - message: str
        - solution_path: List[Dict]
        - solution_length: int
        - expanded_states: int
        - generated_states: int
        - execution_time_ms: float
        - is_optimal: bool (True for BFS)
        - graph_data: Dict with nodes and edges
        - initial_state: Tuple[int, int]
        - goal_state: Optional[Tuple[int, int]]
        - algorithm: "Breadth-First Search"
    """
    start_time = time.perf_counter()

    # Validations
    if a_cap <= 0 or b_cap <= 0 or target < 0:
        return {
            "success": False,
            "message": "Invalid capacities or target.",
            "solution_path": [],
            "solution_length": 0,
            "expanded_states": 0,
            "generated_states": 0,
            "execution_time_ms": 0.0,
            "is_optimal": True,
            "graph_data": {"nodes": [], "edges": []},
            "initial_state": [initial_a, initial_b],
            "goal_state": None,
            "algorithm": "Breadth-First Search"
        }

    if initial_a < 0 or initial_a > a_cap or initial_b < 0 or initial_b > b_cap:
        return {
            "success": False,
            "message": "Initial water quantities exceed jug capacities.",
            "solution_path": [],
            "solution_length": 0,
            "expanded_states": 0,
            "generated_states": 0,
            "execution_time_ms": 0.0,
            "is_optimal": True,
            "graph_data": {"nodes": [], "edges": []},
            "initial_state": [initial_a, initial_b],
            "goal_state": None,
            "algorithm": "Breadth-First Search"
        }

    if target > max(a_cap, b_cap):
        return {
            "success": False,
            "message": f"Target {target}L exceeds both jug capacities.",
            "solution_path": [],
            "solution_length": 0,
            "expanded_states": 0,
            "generated_states": 0,
            "execution_time_ms": round((time.perf_counter() - start_time) * 1000, 3),
            "is_optimal": True,
            "graph_data": {"nodes": [], "edges": []},
            "initial_state": [initial_a, initial_b],
            "goal_state": None,
            "algorithm": "Breadth-First Search"
        }

    gcd_val = math.gcd(a_cap, b_cap)
    if target > 0 and (target % gcd_val != 0):
        return {
            "success": False,
            "message": f"Target {target}L is not a multiple of GCD({a_cap}, {b_cap}) = {gcd_val}.",
            "solution_path": [],
            "solution_length": 0,
            "expanded_states": 0,
            "generated_states": 0,
            "execution_time_ms": round((time.perf_counter() - start_time) * 1000, 3),
            "is_optimal": True,
            "graph_data": {"nodes": [], "edges": []},
            "initial_state": [initial_a, initial_b],
            "goal_state": None,
            "algorithm": "Breadth-First Search"
        }

    initial_state = (initial_a, initial_b)
    if initial_a == target or initial_b == target:
        elapsed = round((time.perf_counter() - start_time) * 1000, 3)
        return {
            "success": True,
            "message": "Initial state already satisfies the goal condition!",
            "solution_path": [
                {
                    "step_number": 0,
                    "jug_a": initial_a,
                    "jug_b": initial_b,
                    "action": "Initial State (Goal Reached)",
                    "heuristic": heuristic(initial_a, initial_b, target)
                }
            ],
            "solution_length": 0,
            "expanded_states": 0,
            "generated_states": 1,
            "execution_time_ms": elapsed,
            "is_optimal": True,
            "graph_data": {
                "nodes": [
                    {
                        "id": f"{initial_a},{initial_b}",
                        "label": f"({initial_a}, {initial_b})",
                        "jug_a": initial_a,
                        "jug_b": initial_b,
                        "heuristic": 0,
                        "status": "goal"
                    }
                ],
                "edges": []
            },
            "initial_state": [initial_a, initial_b],
            "goal_state": [initial_a, initial_b],
            "algorithm": "Breadth-First Search"
        }

    # BFS structures
    queue = deque([initial_state])
    parents: Dict[Tuple[int, int], Tuple[Optional[Tuple[int, int]], str]] = {
        initial_state: (None, "Initial State")
    }
    visited: Set[Tuple[int, int]] = {initial_state}
    all_discovered_states: Dict[Tuple[int, int], int] = {
        initial_state: heuristic(initial_a, initial_b, target)
    }
    all_edges: List[Dict[str, Any]] = []

    expanded_count = 0
    generated_count = 1
    goal_state: Optional[Tuple[int, int]] = None

    while queue and expanded_count < max_expansions:
        curr = queue.popleft()
        expanded_count += 1
        curr_x, curr_y = curr

        if curr_x == target or curr_y == target:
            goal_state = curr
            break

        successors = get_successors(curr, a_cap, b_cap)
        for next_state, action in successors:
            generated_count += 1
            next_x, next_y = next_state
            next_h = heuristic(next_x, next_y, target)

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

            if next_state not in visited:
                visited.add(next_state)
                parents[next_state] = (curr, action)
                queue.append(next_state)

                # Early goal check in BFS
                if next_x == target or next_y == target:
                    goal_state = next_state
                    break
        if goal_state:
            break

    elapsed_time = round((time.perf_counter() - start_time) * 1000, 3)

    if not goal_state:
        return {
            "success": False,
            "message": "No solution found.",
            "solution_path": [],
            "solution_length": 0,
            "expanded_states": expanded_count,
            "generated_states": generated_count,
            "execution_time_ms": elapsed_time,
            "is_optimal": True,
            "graph_data": {"nodes": [], "edges": []},
            "initial_state": [initial_a, initial_b],
            "goal_state": None,
            "algorithm": "Breadth-First Search"
        }

    # Reconstruct path
    path_states = []
    c = goal_state
    while c is not None:
        p, act = parents[c]
        path_states.append((c, act))
        c = p
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

    solution_length = max(0, len(solution_path) - 1)

    # Build Graph Data
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

    seen_edges = set()
    formatted_edges = []
    for edge in all_edges:
        key = (edge["source"], edge["target"])
        if key not in seen_edges:
            seen_edges.add(key)
            formatted_edges.append({
                "id": edge["id"],
                "source": edge["source"],
                "target": edge["target"],
                "label": edge["label"],
                "is_solution": key in solution_edges_set
            })

    return {
        "success": True,
        "message": f"Optimal solution found in {solution_length} operations!",
        "solution_path": solution_path,
        "solution_length": solution_length,
        "expanded_states": expanded_count,
        "generated_states": generated_count,
        "execution_time_ms": elapsed_time,
        "is_optimal": True,
        "graph_data": {
            "nodes": nodes,
            "edges": formatted_edges
        },
        "initial_state": [initial_a, initial_b],
        "goal_state": [goal_state[0], goal_state[1]],
        "algorithm": "Breadth-First Search"
    }
