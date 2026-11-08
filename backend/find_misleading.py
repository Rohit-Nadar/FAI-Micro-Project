import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from app.algorithms import solve_water_jug_gbfs, solve_water_jug_bfs

print("Searching for Heuristic Misleading Cases...")
misled_cases = []

for a in range(2, 16):
    for b in range(2, 16):
        if a == b:
            continue
        for t in range(1, max(a, b)):
            import math
            if t % math.gcd(a, b) != 0:
                continue
            gbfs = solve_water_jug_gbfs(a, b, t)
            bfs = solve_water_jug_bfs(a, b, t)
            if gbfs["success"] and bfs["success"]:
                # Check if GBFS path is strictly longer than BFS optimal path
                if gbfs["solution_length"] > bfs["solution_length"]:
                    misled_cases.append({
                        "a": a, "b": b, "target": t,
                        "gbfs_len": gbfs["solution_length"],
                        "bfs_len": bfs["solution_length"],
                        "gbfs_expanded": gbfs["expanded_states"],
                        "bfs_expanded": bfs["expanded_states"],
                        "diff": gbfs["solution_length"] - bfs["solution_length"]
                    })

print("--- Smallest misleading cases ---")
small_cases = [c for c in misled_cases if c['a'] <= 8 and c['b'] <= 8]
for c in small_cases[:8]:
    print(f"Jugs: ({c['a']}, {c['b']}) Target: {c['target']} | GBFS Path: {c['gbfs_len']} ops vs BFS Optimal: {c['bfs_len']} ops | Expanded GBFS: {c['gbfs_expanded']} vs BFS: {c['bfs_expanded']}")

print(f"Found {len(misled_cases)} misleading cases!")
for c in misled_cases[:10]:
    print(f"Jugs: ({c['a']}, {c['b']}) Target: {c['target']} | GBFS Path: {c['gbfs_len']} ops vs BFS Optimal: {c['bfs_len']} ops | Expanded GBFS: {c['gbfs_expanded']} vs BFS: {c['bfs_expanded']}")
