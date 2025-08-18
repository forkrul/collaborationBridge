"""Reusable components library for MVP projects.

This module provides a collection of production-ready, reusable components
that can be shared across multiple MVP projects. The components are designed
following the patterns and standards identified in the soft delete PRD analysis.

Components included:
- Enhanced database mixins and base classes
- Service layer patterns and utilities
- Configuration management systems
- Health monitoring and diagnostics
- Audit trail and compliance utilities

The implementation follows enterprise standards for reusability,
maintainability, and performance across different MVP projects.
"""

# Core database components
# Configuration management
from src.project_name.core.soft_delete_config import (
    SoftDeleteConfig,
    get_soft_delete_config,
    update_soft_delete_config,
)
from src.project_name.models.base import (
    Base,
    BaseModel,
    SoftDeleteMixin,
    TimestampMixin,
)

# Service layer components
from src.project_name.services.base_service import BaseService
from src.project_name.services.soft_delete_manager import SoftDeleteManager

# Database utilities
from src.project_name.utils.database_utils import (
    CascadingSoftDeleteManager,
    DatabaseHealthChecker,
)

__all__ = [
    # Database models and mixins
    "Base",
    "BaseModel",
    "TimestampMixin",
    "SoftDeleteMixin",
    # Service layer
    "BaseService",
    "SoftDeleteManager",
    # Database utilities
    "DatabaseHealthChecker",
    "CascadingSoftDeleteManager",
    # Configuration
    "SoftDeleteConfig",
    "get_soft_delete_config",
    "update_soft_delete_config",
]

# Version information
__version__ = "1.0.0"
__author__ = "MVP Template Team"
__description__ = "Production-ready reusable components for MVP projects"

# Component metadata for documentation and discovery
COMPONENT_REGISTRY = {
    "database": {
        "models": {
            "BaseModel": {
                "description": "Enhanced base model with timestamps and soft delete",
                "features": ["auto_timestamps", "soft_delete", "audit_trail"],
                "usage": "Inherit from BaseModel for all database entities",
            },
            "SoftDeleteMixin": {
                "description": "Production-ready soft delete functionality",
                "features": ["audit_trail", "timezone_aware", "error_handling"],
                "usage": "Add to models requiring soft delete capability",
            },
            "TimestampMixin": {
                "description": "Automatic timestamp tracking",
                "features": ["created_at", "updated_at", "server_defaults"],
                "usage": "Add to models requiring timestamp tracking",
            },
        },
        "services": {
            "BaseService": {
                "description": "Enhanced service base class with advanced CRUD",
                "features": ["bulk_operations", "pagination", "soft_delete_support"],
                "usage": "Inherit for all service classes",
            },
            "SoftDeleteManager": {
                "description": "Bulk soft delete operations manager",
                "features": ["batch_processing", "performance_optimized", "statistics"],
                "usage": "Use for bulk soft delete operations",
            },
        },
        "utilities": {
            "DatabaseHealthChecker": {
                "description": "Database health monitoring and diagnostics",
                "features": ["connection_check", "table_stats", "health_reports"],
                "usage": "Monitor database health and performance",
            },
            "CascadingSoftDeleteManager": {
                "description": "Cascading soft delete with relationship handling",
                "features": [
                    "relationship_aware",
                    "circular_protection",
                    "depth_limiting",
                ],
                "usage": "Handle complex deletion scenarios",
            },
        },
    },
    "configuration": {
        "SoftDeleteConfig": {
            "description": "Comprehensive configuration management",
            "features": ["environment_based", "validation", "runtime_updates"],
            "usage": "Configure soft delete behavior across environments",
        }
    },
}


def get_component_info(component_name: str) -> dict:
    """Get information about a specific component.

    Args:
        component_name: Name of the component to get info for.

    Returns:
        Dictionary containing component information.

    Example:
        info = get_component_info("BaseModel")
        print(info["description"])
    """
    for category, components in COMPONENT_REGISTRY.items():
        for subcategory, items in components.items():
            if component_name in items:
                return items[component_name]

    return {"error": f"Component '{component_name}' not found"}


def list_components(category: str = None) -> dict:
    """List all available components, optionally filtered by category.

    Args:
        category: Optional category to filter by.

    Returns:
        Dictionary of components organized by category.

    Example:
        # List all components
        all_components = list_components()

        # List only database components
        db_components = list_components("database")
    """
    if category:
        return COMPONENT_REGISTRY.get(category, {})
    return COMPONENT_REGISTRY


def get_usage_examples() -> dict:
    """Get usage examples for all components.

    Returns:
        Dictionary containing usage examples for each component.
    """
    return {
        "BaseModel": """
# Basic usage
class User(BaseModel):
    __tablename__ = 'users'
    name = Column(String(100))
    email = Column(String(255))

# Automatic features:
# - id, created_at, updated_at fields
# - soft delete capability
# - audit trail support
        """,
        "BaseService": """
# Service implementation
class UserService(BaseService):
    model = User

# Usage
async with AsyncSession(engine) as session:
    service = UserService(session)
    
    # Enhanced CRUD operations
    user = await service.create({"name": "John", "email": "john@example.com"})
    users = await service.get_active_paginated(page=1, size=10)
    await service.soft_delete(user.id, deleted_by="admin")
        """,
        "SoftDeleteManager": """
# Bulk operations
async with AsyncSession(engine) as session:
    manager = SoftDeleteManager(session)
    
    # Bulk soft delete
    deleted_count = await manager.bulk_soft_delete(
        User, [1, 2, 3], deleted_by="admin", reason="Cleanup"
    )
    
    # Get statistics
    stats = await manager.get_deletion_stats(User)
        """,
        "DatabaseHealthChecker": """
# Health monitoring
async with AsyncSession(engine) as session:
    checker = DatabaseHealthChecker(session)
    
    # Check connection
    status = await checker.check_connection()
    
    # Get comprehensive report
    report = await checker.get_health_report([User, Post])
        """,
        "SoftDeleteConfig": """
# Configuration management
config = SoftDeleteConfig(
    auto_filter=True,
    hard_delete_after_days=90,
    require_deletion_reason=True
)

# Environment-based config
# Set SOFT_DELETE_AUTO_FILTER=false in environment
config = SoftDeleteConfig()  # Reads from environment

# Runtime updates
update_soft_delete_config(cascade_soft_delete=True)
        """,
    }


# Quick start guide
QUICK_START_GUIDE = """
# MVP Template Enhanced Components Quick Start

## 1. Basic Model Setup
```python
from src.project_name.components import BaseModel

class User(BaseModel):
    __tablename__ = 'users'
    name = Column(String(100))
    email = Column(String(255))
```

## 2. Service Layer
```python
from src.project_name.components import BaseService

class UserService(BaseService):
    model = User

# Usage
service = UserService(session)
user = await service.create({"name": "John", "email": "john@example.com"})
```

## 3. Bulk Operations
```python
from src.project_name.components import SoftDeleteManager

manager = SoftDeleteManager(session)
await manager.bulk_soft_delete(User, [1, 2, 3], deleted_by="admin")
```

## 4. Health Monitoring
```python
from src.project_name.components import DatabaseHealthChecker

checker = DatabaseHealthChecker(session)
report = await checker.get_health_report([User])
```

## 5. Configuration
```python
from src.project_name.components import SoftDeleteConfig

config = SoftDeleteConfig(
    auto_filter=True,
    require_deletion_reason=True
)
```
"""


def print_quick_start():
    """Print the quick start guide."""
    print(QUICK_START_GUIDE)


# Component validation utilities
def validate_component_setup() -> dict:
    """Validate that all components are properly configured.

    Returns:
        Dictionary containing validation results.
    """
    results = {"valid": True, "issues": [], "recommendations": []}

    try:
        # Test imports
        from src.project_name.models.base import BaseModel
        from src.project_name.services.base_service import BaseService
        from src.project_name.services.soft_delete_manager import SoftDeleteManager

        results["recommendations"].append("All core components imported successfully")

    except ImportError as e:
        results["valid"] = False
        results["issues"].append(f"Import error: {e}")

    return results
