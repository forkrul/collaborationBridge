import argparse
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
import os
import sys

# Add the project root to the Python path to allow importing from 'tests'
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from tests.factories import UserFactory

async def seed_data(deterministic=False, seed=None):
    """Seed the database with test data asynchronously."""
    db_url = os.getenv("DATABASE_URL_TEST", "sqlite+aiosqlite:///./test.db")
    engine = create_async_engine(db_url)
    AsyncSession = async_sessionmaker(bind=engine, expire_on_commit=False)

    async with AsyncSession() as session:
        if deterministic:
            if seed is None:
                raise ValueError("A seed must be provided for deterministic seeding.")
            print(f"Using deterministic seed: {seed}")

        UserFactory._meta.sqlalchemy_session = session
        UserFactory.create_batch(10)

        await session.commit()

    print("✓ Test data seeded successfully.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed the test database.")
    parser.add_argument(
        "--deterministic",
        action="store_true",
        help="Use a fixed seed for deterministic data.",
    )
    parser.add_argument("--seed", type=int, help="The seed to use.")
    args = parser.parse_args()

    asyncio.run(seed_data(deterministic=args.deterministic, seed=args.seed))