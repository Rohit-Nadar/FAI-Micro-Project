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

def get_candidate_engine():
    """Detect installed PostgreSQL driver and create engine with strict timeout."""
    if not DATABASE_URL:
        return None, "No DATABASE_URL configured"

    # Fast driver detection without network calls
    has_psycopg2 = False
    has_psycopg = False
    has_pg8000 = False

    try:
        import psycopg2
        has_psycopg2 = True
    except ImportError:
        pass

    try:
        import psycopg
        has_psycopg = True
    except ImportError:
        pass

    try:
        import pg8000
        has_pg8000 = True
    except ImportError:
        pass

    candidates = []
    if has_psycopg2 or (not has_psycopg and not has_pg8000):
        url = DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        candidates.append((url, {"sslmode": "require", "connect_timeout": 4}))

    if has_psycopg:
        url = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1).replace("postgresql://", "postgresql+psycopg://", 1)
        candidates.append((url, {"connect_timeout": 4}))

    if has_pg8000:
        url = DATABASE_URL.replace("postgres://", "postgresql+pg8000://", 1).replace("postgresql://", "postgresql+pg8000://", 1)
        candidates.append((url, {"timeout": 4}))

    for url_candidate, c_args in candidates:
        try:
            logger.info(f"Attempting PostgreSQL connection with driver: {url_candidate.split('://')[0]}")
            test_engine = create_engine(
                url_candidate,
                connect_args=c_args,
                pool_pre_ping=True,
                pool_recycle=300,
                pool_timeout=4
            )
            with test_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return test_engine, "Successfully connected to Neon PostgreSQL database."
        except Exception as e:
            logger.warning(f"Connection attempt failed ({type(e).__name__}): {e}")

    return None, "PostgreSQL connection failed. Using local fallback database."

def setup_engine():
    global engine, is_connected, db_type, db_message

    if DATABASE_URL:
        pg_engine, msg = get_candidate_engine()
        if pg_engine:
            engine = pg_engine
            is_connected = True
            db_type = "Neon PostgreSQL"
            db_message = msg
            logger.info(db_message)
            return
        else:
            db_message = msg

    # Fallback to local SQLite database so history and simulations always work
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
        db_type = "SQLite (Fallback)"
        if not RAW_DATABASE_URL:
            db_message = "Running with local SQLite database (Set DATABASE_URL to connect to Neon)."
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

