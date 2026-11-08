"""
Student-designed heuristic function for the Water Jug Problem.

Definition:
    h(x, y) = min(|target - x|, |target - y|)

This heuristic estimates the minimum volume of water that must change
to reach the target quantity in either Jug A or Jug B.
When x == target or y == target, h(x, y) = 0 (Goal State).
"""

def heuristic(x: int, y: int, target: int) -> int:
    """Calculate Manhattan distance to the target for either jug."""
    return min(abs(target - x), abs(target - y))
