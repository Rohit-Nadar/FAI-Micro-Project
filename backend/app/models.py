"""
SQLAlchemy models for Neon PostgreSQL database.

Defines:
- Simulation: Stores overall simulation parameters and performance metrics.
- SimulationStep: Stores step-by-step state transitions for each simulation.
"""

from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    jug_a_capacity = Column(Integer, nullable=False)
    jug_b_capacity = Column(Integer, nullable=False)
    target = Column(Integer, nullable=False)
    initial_a = Column(Integer, default=0, nullable=False)
    initial_b = Column(Integer, default=0, nullable=False)
    algorithm = Column(String(50), nullable=False)
    success = Column(Boolean, default=True, nullable=False)
    expanded_states = Column(Integer, default=0, nullable=False)
    generated_states = Column(Integer, default=0, nullable=False)
    solution_length = Column(Integer, default=0, nullable=False)
    execution_time = Column(Float, default=0.0, nullable=False)  # in milliseconds
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Cascading relation to steps
    steps = relationship(
        "SimulationStep",
        back_populates="simulation",
        cascade="all, delete-orphan",
        order_by="SimulationStep.step_number"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "jug_a_capacity": self.jug_a_capacity,
            "jug_b_capacity": self.jug_b_capacity,
            "target": self.target,
            "initial_a": self.initial_a,
            "initial_b": self.initial_b,
            "algorithm": self.algorithm,
            "success": self.success,
            "expanded_states": self.expanded_states,
            "generated_states": self.generated_states,
            "solution_length": self.solution_length,
            "execution_time": self.execution_time,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

class SimulationStep(Base):
    __tablename__ = "simulation_steps"

    id = Column(Integer, primary_key=True, index=True)
    simulation_id = Column(Integer, ForeignKey("simulations.id", ondelete="CASCADE"), nullable=False)
    step_number = Column(Integer, nullable=False)
    jug_a_quantity = Column(Integer, nullable=False)
    jug_b_quantity = Column(Integer, nullable=False)
    operation = Column(String(200), nullable=False)
    heuristic_value = Column(Integer, nullable=False)

    simulation = relationship("Simulation", back_populates="steps")

    def to_dict(self):
        return {
            "id": self.id,
            "step_number": self.step_number,
            "jug_a": self.jug_a_quantity,
            "jug_b": self.jug_b_quantity,
            "action": self.operation,
            "heuristic": self.heuristic_value,
        }
