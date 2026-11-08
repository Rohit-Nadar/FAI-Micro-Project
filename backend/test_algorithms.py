import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.algorithms import solve_water_jug_gbfs, solve_water_jug_bfs

def run_tests():
    tests = [
        {"name": "Test 1 (Standard 4, 3 -> 2)", "a": 4, "b": 3, "target": 2, "ia": 0, "ib": 0},
        {"name": "Test 2 (5, 3 -> 4)", "a": 5, "b": 3, "target": 4, "ia": 0, "ib": 0},
        {"name": "Test 3 (3, 5 -> 4)", "a": 3, "b": 5, "target": 4, "ia": 0, "ib": 0},
        {"name": "Test 4 (Impossible GCD: 2, 4 -> 3)", "a": 2, "b": 4, "target": 3, "ia": 0, "ib": 0},
        {"name": "Test 5 (Target 0: 4, 3 -> 0)", "a": 4, "b": 3, "target": 0, "ia": 0, "ib": 0},
        {"name": "Edge 1: Negative capacity (-4, 3 -> 2)", "a": -4, "b": 3, "target": 2, "ia": 0, "ib": 0},
        {"name": "Edge 2: Initial water exceeds capacity (4, 3 with initial A=5)", "a": 4, "b": 3, "target": 2, "ia": 5, "ib": 0},
        {"name": "Edge 3: Target larger than both jugs (3, 5 -> 8)", "a": 3, "b": 5, "target": 8, "ia": 0, "ib": 0},
    ]

    print("=" * 60)
    print("RUNNING ALGORITHM VERIFICATION TESTS")
    print("=" * 60)

    for t in tests:
        print(f"\n--- {t['name']} ---")
        gbfs_res = solve_water_jug_gbfs(t["a"], t["b"], t["target"], t["ia"], t["ib"])
        bfs_res = solve_water_jug_bfs(t["a"], t["b"], t["target"], t["ia"], t["ib"])

        print(f"GBFS Success: {gbfs_res['success']} | Path length (operations): {gbfs_res['solution_length']} | Expanded: {gbfs_res['expanded_states']} | Time: {gbfs_res['execution_time_ms']}ms")
        if gbfs_res['success']:
            steps = " -> ".join([f"({s['jug_a']},{s['jug_b']})" for s in gbfs_res['solution_path']])
            print(f"  Path: {steps}")
        else:
            print(f"  Message: {gbfs_res['message']}")

        print(f"BFS  Success: {bfs_res['success']} | Path length (operations): {bfs_res['solution_length']} | Expanded: {bfs_res['expanded_states']} | Time: {bfs_res['execution_time_ms']}ms")
        if bfs_res['success']:
            steps = " -> ".join([f"({s['jug_a']},{s['jug_b']})" for s in bfs_res['solution_path']])
            print(f"  Path: {steps}")

if __name__ == "__main__":
    run_tests()
