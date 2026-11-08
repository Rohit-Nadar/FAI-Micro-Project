"""
Pydantic schemas for request validation and response serialization.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class SearchRequest(BaseModel):
    jug_a_capacity: int = Field(..., gt=0, description="Capacity of Jug A in litres")
    jug_b_capacity: int = Field(..., gt=0, description="Capacity of Jug B in litres")
    target: int = Field(..., ge=0, description="Target water quantity in litres")
    initial_a: int = Field(0, ge=0, description="Initial water in Jug A")
    initial_b: int = Field(0, ge=0, description="Initial water in Jug B")
    algorithm: str = Field("gbfs", description="Search algorithm: 'gbfs', 'bfs', or 'compare'")
    save_to_db: bool = Field(True, description="Whether to persist simulation to Neon database")

class StepResponse(BaseModel):
    step_number: int
    jug_a: int
    jug_b: int
    action: str
    heuristic: int

class NodeData(BaseModel):
    id: str
    label: str
    jug_a: int
    jug_b: int
    heuristic: int
    status: str

class EdgeData(BaseModel):
    id: str
    source: str
    target: str
    label: str
    is_solution: bool

class GraphData(BaseModel):
    nodes: List[NodeData]
    edges: List[EdgeData]

class SimulationResponse(BaseModel):
    success: bool
    message: str
    solution_path: List[StepResponse] = Field(default_factory=list)
    solution_length: int = 0
    expanded_states: int = 0
    generated_states: int = 0
    execution_time_ms: float = 0.0
    pq_snapshots: List[Dict[str, Any]] = Field(default_factory=list)
    graph_data: GraphData = Field(default_factory=lambda: GraphData(nodes=[], edges=[]))
    initial_state: List[int] = Field(default_factory=lambda: [0, 0])
    goal_state: Optional[List[int]] = None
    algorithm: str = "Search Algorithm"
    simulation_id: Optional[int] = None
    database_saved: bool = False

class MisleadingComparisonResponse(BaseModel):
    success: bool
    message: str
    gbfs: SimulationResponse
    bfs: SimulationResponse
    is_misled: bool
    misled_explanation: str
    path_length_difference: int
    expansions_difference: int

class HistoryStepItem(BaseModel):
    id: int
    step_number: int
    jug_a: int
    jug_b: int
    action: str
    heuristic: int

class HistoryDetailResponse(BaseModel):
    id: int
    jug_a_capacity: int
    jug_b_capacity: int
    target: int
    initial_a: int
    initial_b: int
    algorithm: str
    success: bool
    expanded_states: int
    generated_states: int
    solution_length: int
    execution_time: float
    created_at: Optional[str]
    steps: List[HistoryStepItem]

class HistorySummaryItem(BaseModel):
    id: int
    jug_a_capacity: int
    jug_b_capacity: int
    target: int
    initial_a: int
    initial_b: int
    algorithm: str
    success: bool
    expanded_states: int
    generated_states: int
    solution_length: int
    execution_time: float
    created_at: Optional[str]

class HealthResponse(BaseModel):
    status: str
    database: Dict[str, Any]
    version: str

