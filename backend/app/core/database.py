import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL
engine = None
SessionLocal = None

# Proactive connection testing for fallback behavior
try:
    if DATABASE_URL.startswith("postgresql"):
        # Test PostgreSQL connection with a short timeout
        engine = create_engine(
            DATABASE_URL, 
            connect_args={"connect_timeout": 3},
            pool_pre_ping=True
        )
        # Try to connect
        conn = engine.connect()
        conn.close()
        print("Connected to PostgreSQL successfully.")
    else:
        raise ValueError("SQLite configuration detected.")
except Exception as e:
    print(f"PostgreSQL connection failed or not configured: {e}")
    print("Falling back to local SQLite database for development.")
    
    # Define local SQLite fallback file
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    sqlite_path = os.path.join(BASE_DIR, "truthlens.db")
    DATABASE_URL = f"sqlite:///{sqlite_path}"
    
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
