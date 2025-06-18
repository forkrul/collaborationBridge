#!/usr/bin/env python3
"""Database migration utility script."""

import asyncio
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from src.project_name.core.database import create_tables, drop_tables
from src.project_name.core.config import settings


async def create_all_tables():
    """Create all database tables."""
    print("Creating all database tables...")
    await create_tables()
    print("Tables created successfully!")


async def drop_all_tables():
    """Drop all database tables."""
    print("Dropping all database tables...")
    await drop_tables()
    print("Tables dropped successfully!")


async def reset_database():
    """Reset database by dropping and recreating all tables."""
    print("Resetting database...")
    await drop_tables()
    await create_tables()
    print("Database reset successfully!")


def main():
    """Main function."""
    if len(sys.argv) != 2:
        print("Usage: python migrate_database.py [create|drop|reset]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "create":
        asyncio.run(create_all_tables())
    elif command == "drop":
        asyncio.run(drop_all_tables())
    elif command == "reset":
        asyncio.run(reset_database())
    else:
        print("Invalid command. Use: create, drop, or reset")
        sys.exit(1)


if __name__ == "__main__":
    main()
