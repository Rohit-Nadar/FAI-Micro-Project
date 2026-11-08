"""
FastAPI application for Water Jug Problem Solver.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import get_db_status, init_db
from .routes import history_router, simulation_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables asynchronously in a background thread
    # so uvicorn binds to $PORT in 20ms and Render health checks succeed immediately.
    import asyncio
    asyncio.create_task(asyncio.to_thread(init_db))
    yield

app = FastAPI(
    title="Water Jug Problem Solver API",
    description="Production REST API for AI Heuristic Search (Greedy Best-First Search & BFS) with Neon PostgreSQL.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
# Supports local development, Render backend, Vercel frontend, and cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(simulation_router)
app.include_router(history_router)

@app.get("/")
def root():
    return {
        "title": "Water Jug Problem Solver API",
        "version": "1.0.0",
        "docs_url": "/docs",
        "endpoints": {
            "search": "POST /search",
            "simulate": "POST /simulate",
            "compare": "POST /compare",
            "history": "GET /history",
            "history_item": "GET /history/{id}",
            "delete_history": "DELETE /history/{id}",
            "health": "GET /health"
        }
    }

@app.get("/health")
def health_check():
    db_status = get_db_status()
    return {
        "status": "healthy",
        "version": "1.0.0",
        "database": db_status
    }

