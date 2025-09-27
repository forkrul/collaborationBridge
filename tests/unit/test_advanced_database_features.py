"""Comprehensive tests for advanced database features.

This module tests the production-ready database utilities including:
- Database health checking and monitoring
- Cascading soft delete operations
- Enhanced base service functionality
- Configuration management
- Performance optimization features

Tests follow enterprise standards with proper fixtures,
async support, and comprehensive coverage.
"""

from datetime import timedelta
from unittest.mock import AsyncMock

import pytest
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import relationship

from src.collaboration_bridge.core.soft_delete_config import (
    SoftDeleteConfig,
    get_soft_delete_config,
)
from src.collaboration_bridge.models.base import BaseModel
from src.collaboration_bridge.services.base_service import BaseService
from src.collaboration_bridge.utils.database_utils import (
    CascadingSoftDeleteManager,
    DatabaseHealthChecker,
)


# Test models for advanced feature testing
class TestAuthor(BaseModel):
    """Test author model with relationships."""

    __tablename__ = "test_authors"

    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)

    # Relationship to books
    books = relationship("TestBook", back_populates="author")


class TestBook(BaseModel):
    """Test book model with foreign key relationship."""

    __tablename__ = "test_books"

    title = Column(String(200), nullable=False)
    isbn = Column(String(20), nullable=False)
    author_id = Column(Integer, ForeignKey("test_authors.id"))

    # Relationship to author
    author = relationship("TestAuthor", back_populates="books")


class TestAuthorService(BaseService):
    """Test service for authors."""

    model = TestAuthor


class TestBookService(BaseService):
    """Test service for books."""

    model = TestBook


class TestDatabaseHealthChecker:
    """Test cases for DatabaseHealthChecker functionality."""

    @pytest.mark.asyncio
    async def test_check_connection_success(self, db_session: AsyncSession):
        """Test successful database connection check."""
        health_checker = DatabaseHealthChecker(db_session)

        result = await health_checker.check_connection()

        assert result["connected"] is True
        assert "response_time_ms" in result
        assert result["response_time_ms"] >= 0
        assert result["status"] in ["healthy", "slow"]

    @pytest.mark.asyncio
    async def test_check_connection_failure(self):
        """Test database connection failure handling."""
        # Mock a failing session
        mock_session = AsyncMock()
        mock_session.execute.side_effect = Exception("Connection failed")

        health_checker = DatabaseHealthChecker(mock_session)
        result = await health_checker.check_connection()

        assert result["connected"] is False
        assert "error" in result
        assert result["status"] == "unhealthy"

    @pytest.mark.asyncio
    async def test_get_table_statistics(self, db_session: AsyncSession):
        """Test table statistics collection."""
        # Create test data
        author_service = TestAuthorService(db_session)

        # Create some active records
        await author_service.create(
            {"name": "Active Author 1", "email": "active1@test.com"}
        )
        await author_service.create(
            {"name": "Active Author 2", "email": "active2@test.com"}
        )

        # Create and soft delete some records
        deleted_author = await author_service.create(
            {"name": "Deleted Author", "email": "deleted@test.com"}
        )
        await author_service.soft_delete(deleted_author.id, deleted_by="test")

        health_checker = DatabaseHealthChecker(db_session)
        stats = await health_checker.get_table_statistics(TestAuthor)

        assert stats["table"] == "test_authors"
        assert stats["active_records"] == 2
        assert stats["deleted_records"] == 1
        assert stats["total_records"] == 3
        assert stats["deletion_ratio_percent"] == 33.33
        assert "health_status" in stats

    @pytest.mark.asyncio
    async def test_get_health_report(self, db_session: AsyncSession):
        """Test comprehensive health report generation."""
        health_checker = DatabaseHealthChecker(db_session)

        report = await health_checker.get_health_report([TestAuthor, TestBook])

        assert "timestamp" in report
        assert "overall_health" in report
        assert "connection" in report
        assert "tables" in report
        assert "recommendations" in report
        assert "healthy" in report

        # Connection should be healthy
        assert report["connection"]["connected"] is True


class TestCascadingSoftDeleteManager:
    """Test cases for CascadingSoftDeleteManager functionality."""

    @pytest.mark.asyncio
    async def test_cascade_soft_delete_basic(self, db_session: AsyncSession):
        """Test basic cascading soft delete operation."""
        # Create test data with relationships
        author_service = TestAuthorService(db_session)
        book_service = TestBookService(db_session)

        author = await author_service.create(
            {"name": "Test Author", "email": "author@test.com"}
        )

        book1 = await book_service.create(
            {"title": "Book 1", "isbn": "123456789", "author_id": author.id}
        )

        book2 = await book_service.create(
            {"title": "Book 2", "isbn": "987654321", "author_id": author.id}
        )

        # Perform cascading soft delete
        cascade_manager = CascadingSoftDeleteManager(db_session)
        deleted_counts = await cascade_manager.cascade_soft_delete(
            author, deleted_by="test", reason="Test cascade"
        )

        # Verify results
        assert "TestAuthor" in deleted_counts
        assert deleted_counts["TestAuthor"] == 1

        # Refresh instances and check deletion status
        await db_session.refresh(author)
        await db_session.refresh(book1)
        await db_session.refresh(book2)

        assert author.is_soft_deleted
        assert author.deleted_by == "test"
        assert author.deletion_reason == "Test cascade"

    @pytest.mark.asyncio
    async def test_cascade_max_depth_protection(self, db_session: AsyncSession):
        """Test that cascading respects maximum depth limits."""
        author_service = TestAuthorService(db_session)
        author = await author_service.create(
            {"name": "Test Author", "email": "author@test.com"}
        )

        cascade_manager = CascadingSoftDeleteManager(db_session)

        # Test with max_depth = 0 should raise error
        with pytest.raises(ValueError, match="Maximum cascade depth exceeded"):
            await cascade_manager.cascade_soft_delete(author, max_depth=0)

    @pytest.mark.asyncio
    async def test_cascade_circular_reference_protection(
        self, db_session: AsyncSession
    ):
        """Test protection against circular reference loops."""
        author_service = TestAuthorService(db_session)
        author = await author_service.create(
            {"name": "Test Author", "email": "author@test.com"}
        )

        cascade_manager = CascadingSoftDeleteManager(db_session)

        # This should not cause infinite loops
        deleted_counts = await cascade_manager.cascade_soft_delete(author)

        # Should only delete the author once
        assert deleted_counts.get("TestAuthor", 0) == 1


class TestBaseService:
    """Test cases for enhanced BaseService functionality."""

    @pytest.mark.asyncio
    async def test_create_with_audit(self, db_session: AsyncSession):
        """Test record creation with audit information."""
        service = TestAuthorService(db_session)

        author = await service.create(
            {"name": "John Doe", "email": "john@example.com"}, created_by="admin"
        )

        assert author.name == "John Doe"
        assert author.email == "john@example.com"
        assert author.id is not None

    @pytest.mark.asyncio
    async def test_bulk_create(self, db_session: AsyncSession):
        """Test bulk creation of records."""
        service = TestAuthorService(db_session)

        data_list = [
            {"name": "Author 1", "email": "author1@test.com"},
            {"name": "Author 2", "email": "author2@test.com"},
            {"name": "Author 3", "email": "author3@test.com"},
        ]

        authors = await service.bulk_create(data_list, created_by="admin")

        assert len(authors) == 3
        assert all(author.id is not None for author in authors)
        assert authors[0].name == "Author 1"
        assert authors[1].name == "Author 2"
        assert authors[2].name == "Author 3"

    @pytest.mark.asyncio
    async def test_get_active_paginated(self, db_session: AsyncSession):
        """Test paginated retrieval of active records."""
        service = TestAuthorService(db_session)

        # Create test data
        for i in range(15):
            await service.create(
                {"name": f"Author {i}", "email": f"author{i}@test.com"}
            )

        # Test pagination
        result = await service.get_active_paginated(page=1, size=10)

        assert len(result["items"]) == 10
        assert result["total"] == 15
        assert result["page"] == 1
        assert result["size"] == 10
        assert result["pages"] == 2
        assert result["has_next"] is True
        assert result["has_prev"] is False

        # Test second page
        result2 = await service.get_active_paginated(page=2, size=10)

        assert len(result2["items"]) == 5
        assert result2["has_next"] is False
        assert result2["has_prev"] is True

    @pytest.mark.asyncio
    async def test_soft_delete_with_cascade(self, db_session: AsyncSession):
        """Test soft delete with cascading option."""
        author_service = TestAuthorService(db_session)
        book_service = TestBookService(db_session)

        # Create author and books
        author = await author_service.create(
            {"name": "Test Author", "email": "author@test.com"}
        )

        book = await book_service.create(
            {"title": "Test Book", "isbn": "123456789", "author_id": author.id}
        )

        # Soft delete with cascade
        success = await author_service.soft_delete(
            author.id, deleted_by="admin", reason="Test deletion", cascade=True
        )

        assert success is True

        # Verify deletion
        await db_session.refresh(author)
        assert author.is_soft_deleted
        assert author.deleted_by == "admin"
        assert author.deletion_reason == "Test deletion"

    @pytest.mark.asyncio
    async def test_restore_functionality(self, db_session: AsyncSession):
        """Test record restoration functionality."""
        service = TestAuthorService(db_session)

        # Create and soft delete
        author = await service.create(
            {"name": "Test Author", "email": "author@test.com"}
        )

        await service.soft_delete(author.id, deleted_by="admin")

        # Verify deletion
        await db_session.refresh(author)
        assert author.is_soft_deleted

        # Restore
        success = await service.restore(author.id)
        assert success is True

        # Verify restoration
        await db_session.refresh(author)
        assert not author.is_soft_deleted
        assert author.deleted_at is None
        assert author.deleted_by is None
        assert author.deletion_reason is None

    @pytest.mark.asyncio
    async def test_get_statistics(self, db_session: AsyncSession):
        """Test statistics collection functionality."""
        service = TestAuthorService(db_session)

        # Create test data
        await service.create({"name": "Active 1", "email": "active1@test.com"})
        await service.create({"name": "Active 2", "email": "active2@test.com"})

        deleted_author = await service.create(
            {"name": "Deleted", "email": "deleted@test.com"}
        )
        await service.soft_delete(deleted_author.id)

        stats = await service.get_statistics()

        assert stats["total_count"] == 3
        assert stats["active_count"] == 2
        assert stats["deleted_count"] == 1
        assert stats["deletion_ratio"] == 33.33333333333333


class TestSoftDeleteConfig:
    """Test cases for SoftDeleteConfig functionality."""

    def test_default_configuration(self):
        """Test default configuration values."""
        config = SoftDeleteConfig()

        assert config.auto_filter is True
        assert config.cascade_soft_delete is False
        assert config.hard_delete_after_days == 90
        assert config.enable_audit_log is True
        assert config.bulk_operation_batch_size == 1000

    def test_configuration_validation(self):
        """Test configuration validation."""
        # Test invalid cleanup hours
        with pytest.raises(ValueError, match="Cleanup hours must be between 0 and 23"):
            SoftDeleteConfig(cleanup_schedule_hours=[25])

        # Test invalid timezone
        with pytest.raises(ValueError, match="Invalid timezone"):
            SoftDeleteConfig(timezone="Invalid/Timezone")

    def test_configuration_properties(self):
        """Test configuration property methods."""
        config = SoftDeleteConfig(hard_delete_after_days=30)

        assert config.hard_delete_timedelta == timedelta(days=30)

        cleanup_settings = config.get_cleanup_settings()
        assert cleanup_settings["retention_days"] == 30
        assert "enabled" in cleanup_settings

        performance_settings = config.get_performance_settings()
        assert "bulk_batch_size" in performance_settings
        assert "query_timeout" in performance_settings

    def test_operation_validation(self):
        """Test operation validation against configuration."""
        config = SoftDeleteConfig(require_deleted_by=True, require_deletion_reason=True)

        # Should pass with all required fields
        config.validate_operation(
            "soft_delete", deleted_by="admin", reason="Test deletion"
        )

        # Should fail without required fields
        with pytest.raises(ValueError, match="requires 'deleted_by'"):
            config.validate_operation("soft_delete")

        with pytest.raises(ValueError, match="requires 'reason'"):
            config.validate_operation("soft_delete", deleted_by="admin")

    def test_global_config_access(self):
        """Test global configuration access and updates."""
        config = get_soft_delete_config()
        assert isinstance(config, SoftDeleteConfig)

        # Test that we get the same instance
        config2 = get_soft_delete_config()
        assert config is config2
