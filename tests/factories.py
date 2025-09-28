from datetime import datetime, timezone
import factory
import factory.random
from factory.alchemy import SQLAlchemyModelFactory

from src.collaboration_bridge.models.user import User

# Global seed for deterministic data
factory.random.reseed_random(42)

class BaseFactory(SQLAlchemyModelFactory):
    class Meta:
        abstract = True
        sqlalchemy_session_persistence = "commit"

class UserFactory(BaseFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@test.local")
    full_name = factory.Sequence(lambda n: f"Test User {n}")
    hashed_password = "a_very_secure_password" # A dummy password for testing
    created_at = factory.Sequence(
        lambda n: datetime(2024, 1, 1, 0, 0, n, tzinfo=timezone.utc)
    )

def reset_all_sequences():
    """Reset all factory sequences for test isolation"""
    UserFactory.reset_sequence(1)
    # Add other factories here