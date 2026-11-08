"""
Legal operators for the Water Jug Problem.

Each state is represented as an immutable tuple (x, y) where:
- x is the current quantity in Jug A (0 <= x <= a_cap)
- y is the current quantity in Jug B (0 <= y <= b_cap)

There are 6 standard production rules (operators):
1. Fill Jug A
2. Fill Jug B
3. Empty Jug A
4. Empty Jug B
5. Pour Jug A into Jug B
6. Pour Jug B into Jug A
"""

from typing import List, Tuple

def get_successors(state: Tuple[int, int], a_cap: int, b_cap: int) -> List[Tuple[Tuple[int, int], str]]:
    """
    Generate all valid successor states reachable from the given state in one legal move.
    Returns a list of tuples: ((next_x, next_y), action_name)
    Only transitions that change the state are considered.
    """
    x, y = state
    successors: List[Tuple[Tuple[int, int], str]] = []

    # 1. Fill Jug A completely
    if x < a_cap:
        successors.append(((a_cap, y), f"Fill Jug A ({a_cap}L)"))

    # 2. Fill Jug B completely
    if y < b_cap:
        successors.append(((x, b_cap), f"Fill Jug B ({b_cap}L)"))

    # 3. Empty Jug A completely
    if x > 0:
        successors.append(((0, y), "Empty Jug A"))

    # 4. Empty Jug B completely
    if y > 0:
        successors.append(((x, 0), "Empty Jug B"))

    # 5. Pour water from Jug A into Jug B
    if x > 0 and y < b_cap:
        pour_amount = min(x, b_cap - y)
        successors.append(((x - pour_amount, y + pour_amount), f"Pour {pour_amount}L from Jug A to Jug B"))

    # 6. Pour water from Jug B into Jug A
    if y > 0 and x < a_cap:
        pour_amount = min(y, a_cap - x)
        successors.append(((x + pour_amount, y - pour_amount), f"Pour {pour_amount}L from Jug B to Jug A"))

    return successors
