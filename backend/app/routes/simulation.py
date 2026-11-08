"""
Simulation and Search endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..algorithms import solve_water_jug_gbfs, solve_water_jug_bfs
from ..crud import save_simulation
from ..database import get_db
from ..schemas import SearchRequest, SimulationResponse, MisleadingComparisonResponse

router = APIRouter(prefix="", tags=["Simulation"])

@router.post("/search", response_model=SimulationResponse)
def run_search(request: SearchRequest, db: Session = Depends(get_db)):
    """
    Execute Water Jug problem search using the selected algorithm (default: Greedy Best-First Search).
    Validates inputs, executes algorithm, and optionally persists results to Neon PostgreSQL.
    """
    algo = request.algorithm.lower().strip()

    if algo == "bfs":
        result = solve_water_jug_bfs(
            a_cap=request.jug_a_capacity,
            b_cap=request.jug_b_capacity,
            target=request.target,
            initial_a=request.initial_a,
            initial_b=request.initial_b
        )
    else:
        result = solve_water_jug_gbfs(
            a_cap=request.jug_a_capacity,
            b_cap=request.jug_b_capacity,
            target=request.target,
            initial_a=request.initial_a,
            initial_b=request.initial_b
        )

    sim_id = None
    saved = False

    # Persist to Neon database if requested and solution succeeded
    if request.save_to_db and result["success"]:
        saved_record = save_simulation(
            db=db,
            jug_a_capacity=request.jug_a_capacity,
            jug_b_capacity=request.jug_b_capacity,
            target=request.target,
            initial_a=request.initial_a,
            initial_b=request.initial_b,
            algorithm=result["algorithm"],
            success=result["success"],
            expanded_states=result["expanded_states"],
            generated_states=result["generated_states"],
            solution_length=result["solution_length"],
            execution_time=result["execution_time_ms"],
            solution_path=result["solution_path"]
        )
        if saved_record:
            sim_id = saved_record.id
            saved = True

    result["simulation_id"] = sim_id
    result["database_saved"] = saved
    return result

@router.post("/simulate", response_model=SimulationResponse)
def run_simulate(request: SearchRequest, db: Session = Depends(get_db)):
    """
    Interactive simulation endpoint. Provides full priority queue snapshots,
    node-by-node search progression, and step transitions.
    """
    return run_search(request=request, db=db)

@router.post("/compare", response_model=MisleadingComparisonResponse)
def compare_algorithms(request: SearchRequest):
    """
    Compares Greedy Best-First Search against Breadth-First Search.
    Directly evaluates whether the heuristic misleads GBFS into exploring
    suboptimal branches or longer solution paths.
    """
    gbfs_res = solve_water_jug_gbfs(
        a_cap=request.jug_a_capacity,
        b_cap=request.jug_b_capacity,
        target=request.target,
        initial_a=request.initial_a,
        initial_b=request.initial_b
    )

    bfs_res = solve_water_jug_bfs(
        a_cap=request.jug_a_capacity,
        b_cap=request.jug_b_capacity,
        target=request.target,
        initial_a=request.initial_a,
        initial_b=request.initial_b
    )

    if not gbfs_res["success"] or not bfs_res["success"]:
        return {
            "success": False,
            "message": gbfs_res.get("message") or bfs_res.get("message", "Search failed."),
            "gbfs": gbfs_res,
            "bfs": bfs_res,
            "is_misled": False,
            "misled_explanation": "Problem has no solution with the given capacities and target.",
            "path_length_difference": 0,
            "expansions_difference": 0
        }

    path_diff = gbfs_res["solution_length"] - bfs_res["solution_length"]
    exp_diff = gbfs_res["expanded_states"] - bfs_res["expanded_states"]

    is_misled = path_diff > 0

    if is_misled:
        explanation = (
            f"Heuristic Misguidance Confirmed: Greedy Best-First Search yielded a path of "
            f"{gbfs_res['solution_length']} operations, whereas BFS found the optimal path in "
            f"{bfs_res['solution_length']} operations ({path_diff} fewer operations). "
            f"Because GBFS relies strictly on h(n) = min(|target-x|, |target-y|) without considering "
            f"accumulated path cost g(n), it was greedily seduced by local water volumes that seemed "
            f"closer to {request.target}L, leading it into a suboptimal detour."
        )
    elif exp_diff > 0:
        explanation = (
            f"Heuristic Suboptimality in Search Effort: Both algorithms arrived at a path length of "
            f"{gbfs_res['solution_length']} operations, but GBFS expanded {gbfs_res['expanded_states']} states "
            f"compared to BFS's {bfs_res['expanded_states']} states ({exp_diff} extra states). "
            f"The heuristic locally misled the frontier prioritization."
        )
    else:
        explanation = (
            f"Heuristic Performed Well: For capacities ({request.jug_a_capacity}L, {request.jug_b_capacity}L) "
            f"and target {request.target}L, GBFS matched the optimal path length of {bfs_res['solution_length']} "
            f"operations found by BFS."
        )

    return {
        "success": True,
        "message": "Algorithm comparison complete.",
        "gbfs": gbfs_res,
        "bfs": bfs_res,
        "is_misled": is_misled,
        "misled_explanation": explanation,
        "path_length_difference": path_diff,
        "expansions_difference": exp_diff
    }
