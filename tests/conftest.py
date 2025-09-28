import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker
import os

@pytest.fixture(scope="session")
def engine():
    """Create engine based on TEST_DB env var"""
    db_url = os.getenv("TEST_DB", "sqlite:///test.db")

    if "postgresql" in db_url:
        return create_engine(
            db_url,
            isolation_level="REPEATABLE_READ",
            pool_pre_ping=True,
            echo=False
        )
    else:
        # SQLite with foreign keys enabled
        eng = create_engine(
            db_url,
            connect_args={"check_same_thread": False},
            echo=False
        )
        event.listen(
            eng, "connect",
            lambda conn, _: conn.execute("PRAGMA foreign_keys=ON")
        )
        return eng

@pytest.fixture(scope="function")
def db_session(engine):
    """Isolated database session with automatic rollback"""
    connection = engine.connect()
    transaction = connection.begin()

    # Use savepoint for nested transactions
    session = Session(bind=connection, join_transaction_mode="create_savepoint")

    yield session

    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(autouse=True)
def reset_factory_sequences():
    """Reset factory counters between tests"""
    from tests.factories import reset_all_sequences
    reset_all_sequences()