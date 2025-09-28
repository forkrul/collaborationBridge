"""Setup test database with proper state"""
import os
import sys
from alembic import command
from alembic.config import Config

def setup_test_db():
    db_url = os.getenv("TEST_DB", "sqlite:///test.db")

    # Configure Alembic
    alembic_cfg = Config("alembic.ini")
    alembic_cfg.set_main_option("sqlalchemy.url", db_url)

    if "sqlite" in db_url:
        # For SQLite, recreate from scratch
        if os.path.exists("test.db"):
            os.remove("test.db")
    else:
        # For PostgreSQL, drop and recreate schema
        from sqlalchemy import create_engine
        engine = create_engine(db_url)
        with engine.connect() as conn:
            conn.execute("DROP SCHEMA IF EXISTS public CASCADE")
            conn.execute("CREATE SCHEMA public")
            conn.commit()

    # Run migrations
    command.upgrade(alembic_cfg, "head")
    print(f"✓ Test database ready: {db_url}")

if __name__ == "__main__":
    setup_test_db()