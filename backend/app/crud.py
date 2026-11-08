"""
CRUD operations for Neon PostgreSQL simulation history.
"""

import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from .models import Simulation, SimulationStep

logger = logging.getLogger("waterjug.crud")

def save_simulation(
    db: Session,
    jug_a_capacity: int,
    jug_b_capacity: int,
    target: int,
    initial_a: int,
    initial_b: int,
    algorithm: str,
    success: bool,
    expanded_states: int,
    generated_states: int,
    solution_length: int,
    execution_time: float,
    solution_path: List[dict]
) -> Optional[Simulation]:
    """Save a simulation and its individual steps into the database."""
    if not db:
        return None

    try:
        simulation = Simulation(
            jug_a_capacity=jug_a_capacity,
            jug_b_capacity=jug_b_capacity,
            target=target,
            initial_a=initial_a,
            initial_b=initial_b,
            algorithm=algorithm,
            success=success,
            expanded_states=expanded_states,
            generated_states=generated_states,
            solution_length=solution_length,
            execution_time=execution_time,
        )
        db.add(simulation)
        db.flush()  # Populates simulation.id

        for step in solution_path:
            sim_step = SimulationStep(
                simulation_id=simulation.id,
                step_number=step.get("step_number", 0),
                jug_a_quantity=step.get("jug_a", 0),
                jug_b_quantity=step.get("jug_b", 0),
                operation=step.get("action", ""),
                heuristic_value=step.get("heuristic", 0)
            )
            db.add(sim_step)

        db.commit()
        db.refresh(simulation)
        logger.info(f"Saved simulation #{simulation.id} with {len(solution_path)} steps.")
        return simulation
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to save simulation to database: {e}")
        return None

def get_simulations(db: Session, skip: int = 0, limit: int = 50) -> List[Simulation]:
    """Retrieve history of simulations ordered by creation time descending."""
    if not db:
        return []
    try:
        return db.query(Simulation).order_by(Simulation.created_at.desc()).offset(skip).limit(limit).all()
    except Exception as e:
        logger.error(f"Error fetching simulations: {e}")
        return []

def get_simulation_by_id(db: Session, simulation_id: int) -> Optional[Simulation]:
    """Retrieve a single simulation with its steps."""
    if not db:
        return None
    try:
        return db.query(Simulation).filter(Simulation.id == simulation_id).first()
    except Exception as e:
        logger.error(f"Error fetching simulation #{simulation_id}: {e}")
        return None

def delete_simulation(db: Session, simulation_id: int) -> bool:
    """Delete a simulation and its associated steps."""
    if not db:
        return False
    try:
        sim = db.query(Simulation).filter(Simulation.id == simulation_id).first()
        if sim:
            db.delete(sim)
            db.commit()
            logger.info(f"Deleted simulation #{simulation_id}")
            return True
        return False
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting simulation #{simulation_id}: {e}")
        return False

