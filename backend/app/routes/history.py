"""
History endpoints for managing simulation records in Neon PostgreSQL.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..crud import delete_simulation, get_simulation_by_id, get_simulations
from ..database import get_db
from ..schemas import HistoryDetailResponse, HistorySummaryItem

router = APIRouter(prefix="/history", tags=["History"])

@router.get("", response_model=List[HistorySummaryItem])
def list_history(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Retrieve history of saved simulations."""
    sims = get_simulations(db, skip=skip, limit=limit)
    return [
        {
            "id": s.id,
            "jug_a_capacity": s.jug_a_capacity,
            "jug_b_capacity": s.jug_b_capacity,
            "target": s.target,
            "initial_a": s.initial_a,
            "initial_b": s.initial_b,
            "algorithm": s.algorithm,
            "success": s.success,
            "expanded_states": s.expanded_states,
            "generated_states": s.generated_states,
            "solution_length": s.solution_length,
            "execution_time": s.execution_time,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in sims
    ]

@router.get("/{simulation_id}", response_model=HistoryDetailResponse)
def get_history_detail(simulation_id: int, db: Session = Depends(get_db)):
    """Retrieve detailed steps and parameters for a specific simulation."""
    sim = get_simulation_by_id(db, simulation_id=simulation_id)
    if not sim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Simulation with ID #{simulation_id} not found."
        )

    return {
        "id": sim.id,
        "jug_a_capacity": sim.jug_a_capacity,
        "jug_b_capacity": sim.jug_b_capacity,
        "target": sim.target,
        "initial_a": sim.initial_a,
        "initial_b": sim.initial_b,
        "algorithm": sim.algorithm,
        "success": sim.success,
        "expanded_states": sim.expanded_states,
        "generated_states": sim.generated_states,
        "solution_length": sim.solution_length,
        "execution_time": sim.execution_time,
        "created_at": sim.created_at.isoformat() if sim.created_at else None,
        "steps": [step.to_dict() for step in sim.steps]
    }

@router.delete("/{simulation_id}")
def remove_history_entry(simulation_id: int, db: Session = Depends(get_db)):
    """Delete a simulation history entry and its associated steps."""
    success = delete_simulation(db, simulation_id=simulation_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Simulation with ID #{simulation_id} not found or could not be deleted."
        )
    return {"message": f"Simulation #{simulation_id} deleted successfully.", "deleted_id": simulation_id}

