"""
Database connection and session management for Neon PostgreSQL.

Includes graceful fallback:
If Neon PostgreSQL credentials are not provided or the network connection fails,
the system gracefully falls back to a local SQLite database or marks DB as offline,
ensuring the application NEVER crashes and simulation algorithms run seamlessly.
"""

import os
import logging
from typing import Generator
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from .models import Base

load_dotenv()

logger = logging.getLogger("waterjug.database")

# Database URL from environment
RAW_DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

# Normalize Postgres URI for SQLAlchemy (e.g., postgres:// -> postgresql://)
DATABASE_URL = RAW_DATABASE_URL
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Neon PostgreSQL connection configuration
connect_args = {}
engine = None
is_connected = False
db_type = "none"
db_message = "No database configured"

def setup_engine():
    global engine, is_connected, db_type, db_message

    if DATABASE_URL:
        try:
            logger.info("Attempting connection to PostgreSQL database...")
            # If using postgresql, ensure SSL mode if connecting to Neon
            c_args = {}
            if "postgresql" in DATABASE_URL and "sslmode" not in DATABASE_URL:
                c_args = {"sslmode": "require"}

            test_engine = create_engine(
                DATABASE_URL,
                connect_args=c_args,
                pool_pre_ping=True,
                pool_recycle=300
            )
            # Test immediate connectivity with a quick query
            with test_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            
            engine = test_engine
            is_connected = True
            db_type = "Neon PostgreSQL"
            db_message = "Successfully connected to Neon PostgreSQL database."
            logger.info(db_message)
            return
        except Exception as e:
            logger.warning(
                f"Failed to connect to Neon PostgreSQL ({e}). Falling back to local SQLite database."
            )
            db_message = f"PostgreSQL connection failed ({type(e).__name__}). Using local fallback database."

    # Fallback to local SQLite database so history and simulations always work locally
    try:
        sqlite_url = "sqlite:///./waterjug.db"
        logger.info("Setting up local SQLite fallback database...")
        engine = create_engine(
            sqlite_url,
            connect_args={"check_same_thread": False}
        )
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        is_connected = True
        db_type = "SQLite (Local Fallback)"
        if not RAW_DATABASE_URL:
            db_message = "Running with local SQLite database (Set DATABASE_URL in .env to connect to Neon)."
        logger.info(f"Database active: {db_type}")
    except Exception as e:
        logger.error(f"Failed to initialize SQLite fallback: {e}")
        engine = None
        is_connected = False
        db_type = "Disconnected"
        db_message = f"Database unavailable: {str(e)}"

setup_engine()

# Session Factory
if engine:
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
else:
    SessionLocal = None

def init_db():
    """Create all database tables on application startup."""
    global engine
    if engine:
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables verified/created successfully.")
        except Exception as e:
            logger.error(f"Error creating database tables: {e}")

def get_db() -> Generator[Session, None, None]:
    """FastAPI Dependency for database session."""
    if not SessionLocal:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_db_status() -> dict:
    """Return current database connection status."""
    return {
        "connected": is_connected,
        "database_type": db_type,
        "message": db_message,
        "neon_configured": bool(RAW_DATABASE_URL and "neon" in RAW_DATABASE_URL.lower())
    }

