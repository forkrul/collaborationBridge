# Product Requirements Document
## Python Soft Delete PostgreSQL Library

**Version:** 1.0  
**Date:** June 2025  
**Status:** Draft

---

## Executive Summary

This PRD outlines the requirements for a reusable Python library that provides soft delete functionality for PostgreSQL databases. The library will strictly adhere to PEP 8, PEP 257, and PEP 484 standards, ensuring code quality, documentation completeness, and type safety. This library is designed to be a foundational component that can be integrated across multiple MVP projects, reducing development time and ensuring consistent data handling practices.

## Problem Statement

### Current Challenges
1. **Data Recovery Complexity**: Hard deletes in PostgreSQL permanently remove data, making recovery impossible without backups
2. **Audit Trail Requirements**: Many applications need to maintain historical records for compliance and auditing
3. **Code Duplication**: Each MVP currently implements its own soft delete logic, leading to inconsistency and maintenance overhead
4. **Type Safety**: Existing implementations lack proper type hints, making them error-prone and difficult to integrate
5. **Documentation Gaps**: Current solutions lack comprehensive documentation, hindering adoption and proper usage

### Impact
- Development teams spend 15-20% of database-related time implementing soft delete functionality
- Inconsistent implementations across projects lead to bugs and data integrity issues
- Lack of standardization makes it difficult to move developers between projects
- Missing audit trails create compliance risks

## Goals and Objectives

### Primary Goals
1. **Create a Production-Ready Library**: Develop a robust, well-tested soft delete solution for PostgreSQL
2. **Ensure Code Quality**: Strict adherence to PEP 8, PEP 257, and PEP 484 standards
3. **Maximize Reusability**: Design for easy integration across diverse MVP projects
4. **Minimize Integration Time**: Target < 30 minutes from installation to first successful soft delete

### Success Criteria
- 100% type coverage with mypy strict mode
- 95%+ test coverage
- Zero PEP 8 violations (verified by flake8/black)
- Complete docstring coverage (verified by pydocstyle)
- Integration time < 30 minutes for new projects
- Support for SQLAlchemy 2.0+ and asyncpg

## User Personas

### 1. **MVP Developer (Primary)**
- **Background**: Full-stack developer building rapid prototypes
- **Needs**: Quick integration, minimal configuration, reliable functionality
- **Pain Points**: Time pressure, varying database schemas, documentation gaps
- **Goals**: Ship features quickly without sacrificing data integrity

### 2. **Backend Engineer (Secondary)**
- **Background**: Experienced Python developer focused on API development
- **Needs**: Type safety, async support, customization options
- **Pain Points**: Performance concerns, complex query requirements
- **Goals**: Build scalable, maintainable applications

### 3. **Data Engineer (Tertiary)**
- **Background**: Manages data pipelines and analytics
- **Needs**: Audit trails, bulk operations, data recovery tools
- **Pain Points**: Inconsistent deletion patterns, missing metadata
- **Goals**: Maintain data quality and compliance

## Functional Requirements

### Core Features

#### 1. Soft Delete Operations
- **FR1.1**: Mark records as deleted without physical removal
- **FR1.2**: Support for cascading soft deletes
- **FR1.3**: Bulk soft delete operations
- **FR1.4**: Conditional soft deletes with WHERE clauses

#### 2. Recovery Operations
- **FR2.1**: Restore individual soft-deleted records
- **FR2.2**: Bulk restore functionality
- **FR2.3**: Point-in-time recovery for specific dates
- **FR2.4**: Restore with relationship preservation

#### 3. Query Filtering
- **FR3.1**: Automatic exclusion of soft-deleted records in queries
- **FR3.2**: Include soft-deleted records on demand
- **FR3.3**: Query only soft-deleted records
- **FR3.4**: Mixed queries with custom filtering logic

#### 4. Audit Trail
- **FR4.1**: Track deletion timestamp
- **FR4.2**: Record user/system that performed deletion
- **FR4.3**: Store deletion reason (optional)
- **FR4.4**: Maintain restoration history

#### 5. Hard Delete
- **FR5.1**: Permanently remove soft-deleted records
- **FR5.2**: Configurable retention period before hard delete
- **FR5.3**: Batch hard delete for old records
- **FR5.4**: Safety mechanisms to prevent accidental hard deletes

### Integration Features

#### 6. ORM Support
- **FR6.1**: SQLAlchemy 2.0+ integration with mixins
- **FR6.2**: Custom query classes for automatic filtering
- **FR6.3**: Support for async SQLAlchemy
- **FR6.4**: Django ORM adapter (future)

#### 7. Migration Tools
- **FR7.1**: Alembic migration templates
- **FR7.2**: Schema inspection and update tools
- **FR7.3**: Batch conversion of existing tables
- **FR7.4**: Rollback capabilities

## Technical Requirements

### Architecture

```python
# Core module structure
softdelete_postgresql/
├── __init__.py
├── mixins/
│   ├── __init__.py
│   ├── base.py          # Abstract base mixins
│   ├── sqlalchemy.py    # SQLAlchemy-specific mixins
│   └── async_mixins.py  # Async support
├── queries/
│   ├── __init__.py
│   ├── filters.py       # Query filtering logic
│   └── builders.py      # Query builder utilities
├── managers/
│   ├── __init__.py
│   ├── deletion.py      # Deletion manager
│   └── recovery.py      # Recovery manager
├── migrations/
│   ├── __init__.py
│   └── templates/       # Alembic templates
├── utils/
│   ├── __init__.py
│   ├── validators.py    # Input validation
│   └── decorators.py    # Utility decorators
└── types/
    ├── __init__.py
    └── custom_types.py  # Type definitions
```

### Database Schema

```sql
-- Additional columns for soft delete
ALTER TABLE your_table ADD COLUMN IF NOT EXISTS 
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE your_table ADD COLUMN IF NOT EXISTS 
    deleted_by VARCHAR(255) DEFAULT NULL;
ALTER TABLE your_table ADD COLUMN IF NOT EXISTS 
    deletion_reason TEXT DEFAULT NULL;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_your_table_deleted_at 
    ON your_table(deleted_at) 
    WHERE deleted_at IS NOT NULL;

-- Partial index for active records
CREATE INDEX IF NOT EXISTS idx_your_table_active 
    ON your_table(id) 
    WHERE deleted_at IS NULL;
```

### API Design

```python
from typing import Optional, List, Dict, Any, TypeVar, Generic
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, DateTime, String, Text

T = TypeVar('T')

class SoftDeleteMixin:
    """
    Mixin class that adds soft delete functionality to SQLAlchemy models.
    
    This mixin adds the following columns:
    - deleted_at: Timestamp of deletion
    - deleted_by: User/system that performed the deletion
    - deletion_reason: Optional reason for deletion
    
    Example:
        class User(Base, SoftDeleteMixin):
            __tablename__ = 'users'
            id = Column(Integer, primary_key=True)
            name = Column(String(100))
    """
    
    deleted_at: Optional[datetime] = Column(
        DateTime(timezone=True), 
        nullable=True, 
        default=None,
        index=True
    )
    deleted_by: Optional[str] = Column(
        String(255), 
        nullable=True, 
        default=None
    )
    deletion_reason: Optional[str] = Column(
        Text, 
        nullable=True, 
        default=None
    )
    
    def soft_delete(
        self, 
        deleted_by: Optional[str] = None, 
        reason: Optional[str] = None
    ) -> None:
        """
        Soft delete this record.
        
        Args:
            deleted_by: Identifier of user/system performing deletion
            reason: Optional reason for deletion
            
        Raises:
            AlreadyDeletedException: If record is already soft deleted
        """
        ...
    
    def restore(self) -> None:
        """
        Restore this soft-deleted record.
        
        Raises:
            NotDeletedException: If record is not soft deleted
        """
        ...
    
    @property
    def is_deleted(self) -> bool:
        """Check if this record is soft deleted."""
        return self.deleted_at is not None


class SoftDeleteQuery(Generic[T]):
    """
    Custom query class that automatically filters out soft-deleted records.
    
    Example:
        # Get only active users
        users = session.query(User).all()
        
        # Include deleted users
        all_users = session.query(User).with_deleted().all()
        
        # Get only deleted users
        deleted_users = session.query(User).only_deleted().all()
    """
    
    def with_deleted(self) -> 'SoftDeleteQuery[T]':
        """Include soft-deleted records in query results."""
        ...
    
    def only_deleted(self) -> 'SoftDeleteQuery[T]':
        """Return only soft-deleted records."""
        ...
    
    def deleted_after(self, timestamp: datetime) -> 'SoftDeleteQuery[T]':
        """Filter records deleted after the specified timestamp."""
        ...
    
    def deleted_before(self, timestamp: datetime) -> 'SoftDeleteQuery[T]':
        """Filter records deleted before the specified timestamp."""
        ...


class SoftDeleteManager:
    """
    Manager class for bulk soft delete operations.
    
    Example:
        manager = SoftDeleteManager(session)
        
        # Bulk soft delete
        manager.bulk_delete(User, user_ids, deleted_by="system")
        
        # Bulk restore
        manager.bulk_restore(User, user_ids)
    """
    
    def bulk_delete(
        self,
        model_class: type,
        ids: List[Any],
        deleted_by: Optional[str] = None,
        reason: Optional[str] = None
    ) -> int:
        """
        Perform bulk soft delete operation.
        
        Args:
            model_class: SQLAlchemy model class
            ids: List of primary key values
            deleted_by: Identifier of user/system performing deletion
            reason: Optional reason for deletion
            
        Returns:
            Number of records soft deleted
        """
        ...
    
    def bulk_restore(
        self,
        model_class: type,
        ids: List[Any]
    ) -> int:
        """
        Perform bulk restore operation.
        
        Args:
            model_class: SQLAlchemy model class
            ids: List of primary key values
            
        Returns:
            Number of records restored
        """
        ...
    
    def hard_delete_before(
        self,
        model_class: type,
        timestamp: datetime,
        batch_size: int = 1000
    ) -> int:
        """
        Permanently delete soft-deleted records older than timestamp.
        
        Args:
            model_class: SQLAlchemy model class
            timestamp: Delete records soft-deleted before this time
            batch_size: Number of records to delete per batch
            
        Returns:
            Total number of records permanently deleted
        """
        ...
```

### Code Standards

#### PEP 8 Compliance
```python
# flake8 configuration (.flake8)
[flake8]
max-line-length = 88
extend-ignore = E203, W503
exclude = .git,__pycache__,build,dist

# black configuration (pyproject.toml)
[tool.black]
line-length = 88
target-version = ['py38', 'py39', 'py310', 'py311']
```

#### PEP 257 Compliance
```python
# All modules, classes, and functions must have docstrings
# Example of compliant docstring:

def calculate_retention_period(
    deleted_at: datetime, 
    retention_days: int = 30
) -> bool:
    """
    Calculate if a soft-deleted record has exceeded retention period.
    
    This function determines whether a soft-deleted record should be
    permanently removed based on the configured retention period.
    
    Args:
        deleted_at: Timestamp when the record was soft deleted
        retention_days: Number of days to retain soft-deleted records
        
    Returns:
        True if the record should be hard deleted, False otherwise
        
    Example:
        >>> from datetime import datetime, timedelta
        >>> old_date = datetime.now() - timedelta(days=35)
        >>> calculate_retention_period(old_date, retention_days=30)
        True
    """
    ...
```

#### PEP 484 Compliance
```python
# mypy configuration (pyproject.toml)
[tool.mypy]
python_version = "3.8"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true
disallow_untyped_decorators = true
no_implicit_optional = true
warn_redundant_casts = true
warn_unused_ignores = true
warn_no_return = true
warn_unreachable = true
strict_equality = true
```

## Non-Functional Requirements

### Performance
- **NFR1**: Soft delete operations must complete within 50ms for single records
- **NFR2**: Bulk operations must process 10,000 records/second minimum
- **NFR3**: Query filtering overhead must not exceed 5% compared to non-filtered queries
- **NFR4**: Memory usage must remain constant regardless of deleted record count

### Reliability
- **NFR5**: 99.99% operation success rate
- **NFR6**: Automatic retry mechanism for transient failures
- **NFR7**: ACID compliance for all operations
- **NFR8**: Zero data loss guarantee

### Security
- **NFR9**: SQL injection prevention for all user inputs
- **NFR10**: Support for row-level security policies
- **NFR11**: Audit log encryption capabilities
- **NFR12**: GDPR-compliant deletion options

### Usability
- **NFR13**: Installation via pip in < 30 seconds
- **NFR14**: Zero-configuration default behavior
- **NFR15**: Comprehensive error messages with resolution hints
- **NFR16**: IDE autocomplete support via type hints

### Compatibility
- **NFR17**: Python 3.8+ support
- **NFR18**: PostgreSQL 11+ compatibility
- **NFR19**: SQLAlchemy 1.4+ and 2.0+ support
- **NFR20**: Async/await support for all operations

## Success Metrics

Based on the metrics framework from the provided document, we'll track:

### North Star Metric
**Weekly Active Projects Using Soft Delete Operations**

### Level 1 Metrics (Strategic Inputs)
1. **Developer Adoption & Growth**
   - New project integrations per week
   - Time to First Soft Delete (TTFSD)
   - Documentation page views

2. **Library Engagement & Value**
   - Operations per active project
   - Feature adoption breadth
   - Error rate per operation

3. **Technical Performance**
   - P99 operation latency
   - Test coverage percentage
   - Type coverage percentage

4. **Community Health**
   - GitHub stars growth rate
   - Issue resolution time
   - Pull request acceptance rate

### Guardrail Metrics
| Success Metric | Counter-Metric | Warning Threshold |
|---|---|---|
| Increase adoption rate | Integration failure rate | > 5% |
| Reduce operation latency | Memory usage per operation | > 10MB |
| Increase feature usage | Error rate | > 0.1% |
| Expand async usage | Sync performance degradation | > 10% |

## Implementation Timeline

### Phase 1: Foundation (Weeks 1-4)
- Core mixin implementation
- Basic soft delete/restore operations
- SQLAlchemy integration
- Type definitions and protocols

### Phase 2: Advanced Features (Weeks 5-8)
- Bulk operations
- Query filtering system
- Async support
- Migration tools

### Phase 3: Polish & Documentation (Weeks 9-10)
- Comprehensive documentation
- Example applications
- Performance optimization
- Security audit

### Phase 4: Community Release (Weeks 11-12)
- PyPI package publication
- GitHub repository setup
- CI/CD pipeline
- Community outreach

## Risks and Mitigation

### Technical Risks
1. **Performance Degradation**
   - **Risk**: Soft delete filtering slows queries
   - **Mitigation**: Implement partial indexes, query optimization

2. **ORM Compatibility**
   - **Risk**: Breaking changes in SQLAlchemy
   - **Mitigation**: Version pinning, compatibility layer

### Adoption Risks
3. **Learning Curve**
   - **Risk**: Developers find library complex
   - **Mitigation**: Extensive examples, video tutorials

4. **Migration Complexity**
   - **Risk**: Existing projects difficult to convert
   - **Mitigation**: Automated migration tools, gradual adoption path

## Appendix

### A. Example Integration

```python
# Quick start example
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from softdelete_postgresql import SoftDeleteMixin, SoftDeleteQuery

Base = declarative_base()

class User(Base, SoftDeleteMixin):
    __tablename__ = 'users'
    query_class = SoftDeleteQuery
    
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True)
    name = Column(String(255))

# Usage
engine = create_engine('postgresql://localhost/myapp')
Base.metadata.create_all(engine)

# Soft delete
user = session.query(User).filter_by(email='test@example.com').first()
user.soft_delete(deleted_by='admin', reason='Account inactive')
session.commit()

# Query active users only (automatic filtering)
active_users = session.query(User).all()

# Include deleted users
all_users = session.query(User).with_deleted().all()

# Restore
deleted_user = session.query(User).with_deleted().filter_by(email='test@example.com').first()
deleted_user.restore()
session.commit()
```

### B. Configuration Options

```python
# Configuration via environment or settings
SOFT_DELETE_CONFIG = {
    'auto_filter': True,  # Automatically exclude soft-deleted records
    'hard_delete_after_days': 90,  # Retention period
    'cascade_soft_delete': True,  # Cascade to related records
    'audit_deletions': True,  # Create audit log entries
    'timezone': 'UTC',  # Timezone for deletion timestamps
}
```

### C. Testing Strategy

```python
# Example test case
import pytest
from datetime import datetime, timedelta
from freezegun import freeze_time

class TestSoftDelete:
    def test_soft_delete_basic(self, session, user):
        """Test basic soft delete functionality."""
        # Given
        assert not user.is_deleted
        
        # When
        user.soft_delete(deleted_by='test')
        session.commit()
        
        # Then
        assert user.is_deleted
        assert user.deleted_by == 'test'
        assert isinstance(user.deleted_at, datetime)
    
    def test_query_filtering(self, session, deleted_user, active_user):
        """Test automatic filtering of soft-deleted records."""
        # Default query excludes deleted records
        users = session.query(User).all()
        assert len(users) == 1
        assert users[0].id == active_user.id
        
        # With deleted includes all
        all_users = session.query(User).with_deleted().all()
        assert len(all_users) == 2
```

---

This PRD provides a comprehensive blueprint for building a production-ready soft delete library that can be consistently used across all your MVP projects while maintaining the highest code quality standards.