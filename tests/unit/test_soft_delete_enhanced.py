"""Comprehensive tests for enhanced soft delete functionality.

This module tests the production-ready soft delete implementation including:
- Enhanced SoftDeleteMixin functionality
- Audit trail features
- Error handling and edge cases
- Performance and reliability

Tests follow the MVP template's testing standards with proper fixtures,
async support, and comprehensive coverage.
"""

from datetime import datetime

import pytest
from sqlalchemy import Column, String
from sqlalchemy.ext.asyncio import AsyncSession

from src.project_name.models.base import BaseModel
from src.project_name.services.soft_delete_manager import SoftDeleteManager


# Test model for soft delete testing
class TestUser(BaseModel):
    """Test user model for soft delete testing."""

    __tablename__ = "test_users"

    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)


class TestSoftDeleteMixin:
    """Test cases for enhanced SoftDeleteMixin functionality."""

    def test_soft_delete_mixin_attributes(self):
        """Test that SoftDeleteMixin adds all required attributes."""
        user = TestUser(name="John Doe", email="john@example.com")

        # Check that all soft delete attributes exist
        assert hasattr(user, "deleted_at")
        assert hasattr(user, "deleted_by")
        assert hasattr(user, "deletion_reason")
        assert hasattr(user, "is_deleted")

        # Check initial values
        assert user.deleted_at is None
        assert user.deleted_by is None
        assert user.deletion_reason is None
        assert user.is_deleted is False
        assert user.is_soft_deleted is False

    def test_soft_delete_basic(self):
        """Test basic soft delete functionality."""
        user = TestUser(name="John Doe", email="john@example.com")

        # Perform soft delete
        user.soft_delete(deleted_by="admin", reason="Test deletion")

        # Verify soft delete state
        assert user.is_deleted is True
        assert user.is_soft_deleted is True
        assert user.deleted_by == "admin"
        assert user.deletion_reason == "Test deletion"
        assert isinstance(user.deleted_at, datetime)

    def test_soft_delete_without_audit_info(self):
        """Test soft delete without audit information."""
        user = TestUser(name="John Doe", email="john@example.com")

        # Perform soft delete without audit info
        user.soft_delete()

        # Verify soft delete state
        assert user.is_deleted is True
        assert user.is_soft_deleted is True
        assert user.deleted_by is None
        assert user.deletion_reason is None
        assert isinstance(user.deleted_at, datetime)

    def test_soft_delete_already_deleted_raises_error(self):
        """Test that soft deleting an already deleted record raises error."""
        user = TestUser(name="John Doe", email="john@example.com")
        user.id = 1  # Set ID for error message

        # First soft delete
        user.soft_delete(deleted_by="admin")

        # Second soft delete should raise error
        with pytest.raises(ValueError, match="is already deleted"):
            user.soft_delete(deleted_by="admin")

    def test_restore_basic(self):
        """Test basic restore functionality."""
        user = TestUser(name="John Doe", email="john@example.com")

        # Soft delete first
        user.soft_delete(deleted_by="admin", reason="Test deletion")
        assert user.is_soft_deleted is True

        # Restore
        user.restore()

        # Verify restoration
        assert user.is_deleted is False
        assert user.is_soft_deleted is False
        assert user.deleted_at is None
        assert user.deleted_by is None
        assert user.deletion_reason is None

    def test_restore_not_deleted_raises_error(self):
        """Test that restoring a non-deleted record raises error."""
        user = TestUser(name="John Doe", email="john@example.com")
        user.id = 1  # Set ID for error message

        # Try to restore non-deleted record
        with pytest.raises(ValueError, match="is not deleted"):
            user.restore()

    def test_is_soft_deleted_property(self):
        """Test the is_soft_deleted property logic."""
        user = TestUser(name="John Doe", email="john@example.com")

        # Initially not deleted
        assert user.is_soft_deleted is False

        # After soft delete
        user.soft_delete()
        assert user.is_soft_deleted is True

        # After restore
        user.restore()
        assert user.is_soft_deleted is False

        # Edge case: is_deleted=True but no deleted_at
        user.is_deleted = True
        user.deleted_at = None
        assert user.is_soft_deleted is False


@pytest.mark.asyncio
class TestSoftDeleteManager:
    """Test cases for SoftDeleteManager bulk operations."""

    async def test_bulk_soft_delete_success(self, db_session: AsyncSession):
        """Test successful bulk soft delete operation."""
        # Create test users
        users = [
            TestUser(name=f"User {i}", email=f"user{i}@example.com") for i in range(5)
        ]

        for user in users:
            db_session.add(user)
        await db_session.commit()

        # Get user IDs
        user_ids = [user.id for user in users]

        # Bulk soft delete
        manager = SoftDeleteManager(db_session)
        deleted_count = await manager.bulk_soft_delete(
            TestUser, user_ids, deleted_by="admin", reason="Bulk test"
        )

        # Verify results
        assert deleted_count == 5

        # Verify all users are soft deleted
        await db_session.refresh(users[0])
        for user in users:
            await db_session.refresh(user)
            assert user.is_soft_deleted is True
            assert user.deleted_by == "admin"
            assert user.deletion_reason == "Bulk test"

    async def test_bulk_soft_delete_empty_list(self, db_session: AsyncSession):
        """Test bulk soft delete with empty ID list."""
        manager = SoftDeleteManager(db_session)
        deleted_count = await manager.bulk_soft_delete(TestUser, [])

        assert deleted_count == 0

    async def test_bulk_soft_delete_invalid_model(self, db_session: AsyncSession):
        """Test bulk soft delete with model that doesn't support soft delete."""

        # Create a model without soft delete support
        class NonSoftDeleteModel(BaseModel):
            __tablename__ = "non_soft_delete"
            name = Column(String(100))

        manager = SoftDeleteManager(db_session)

        with pytest.raises(ValueError, match="does not support soft delete"):
            await manager.bulk_soft_delete(NonSoftDeleteModel, [1, 2, 3])

    async def test_bulk_restore_success(self, db_session: AsyncSession):
        """Test successful bulk restore operation."""
        # Create and soft delete test users
        users = [
            TestUser(name=f"User {i}", email=f"user{i}@example.com") for i in range(3)
        ]

        for user in users:
            db_session.add(user)
        await db_session.commit()

        # Soft delete all users
        for user in users:
            user.soft_delete(deleted_by="admin")
        await db_session.commit()

        # Get user IDs
        user_ids = [user.id for user in users]

        # Bulk restore
        manager = SoftDeleteManager(db_session)
        restored_count = await manager.bulk_restore(TestUser, user_ids)

        # Verify results
        assert restored_count == 3

        # Verify all users are restored
        for user in users:
            await db_session.refresh(user)
            assert user.is_soft_deleted is False
            assert user.deleted_at is None
            assert user.deleted_by is None
            assert user.deletion_reason is None

    async def test_get_deletion_stats(self, db_session: AsyncSession):
        """Test deletion statistics functionality."""
        # Create test users - some active, some deleted
        active_users = [
            TestUser(name=f"Active {i}", email=f"active{i}@example.com")
            for i in range(3)
        ]
        deleted_users = [
            TestUser(name=f"Deleted {i}", email=f"deleted{i}@example.com")
            for i in range(2)
        ]

        # Add all users
        for user in active_users + deleted_users:
            db_session.add(user)
        await db_session.commit()

        # Soft delete some users
        for user in deleted_users:
            user.soft_delete(deleted_by="admin")
        await db_session.commit()

        # Get stats
        manager = SoftDeleteManager(db_session)
        stats = await manager.get_deletion_stats(TestUser)

        # Verify stats
        assert stats["active"] == 3
        assert stats["deleted"] == 2
        assert stats["total"] == 5


class TestQueryFiltering:
    """Test cases for soft delete query filtering."""

    def test_filter_active(self):
        """Test filtering for active records only."""
        # This would typically be tested with actual database queries
        # For now, we test that the method exists and returns a query
        from unittest.mock import Mock

        from sqlalchemy.orm import Query

        mock_query = Mock(spec=Query)
        result = TestUser.filter_active(mock_query)

        # Verify filter was called
        mock_query.filter.assert_called_once()
        assert result == mock_query.filter.return_value

    def test_filter_deleted(self):
        """Test filtering for deleted records only."""
        from unittest.mock import Mock

        from sqlalchemy.orm import Query

        mock_query = Mock(spec=Query)
        result = TestUser.filter_deleted(mock_query)

        # Verify filter was called
        mock_query.filter.assert_called_once()
        assert result == mock_query.filter.return_value

    def test_filter_with_deleted(self):
        """Test returning query without filtering."""
        from unittest.mock import Mock

        from sqlalchemy.orm import Query

        mock_query = Mock(spec=Query)
        result = TestUser.filter_with_deleted(mock_query)

        # Should return original query without modification
        assert result == mock_query
        mock_query.filter.assert_not_called()
