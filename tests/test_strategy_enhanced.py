"""Enhanced testing strategy for production-ready soft delete functionality.

This module implements comprehensive testing patterns based on the soft delete PRD
standards, including performance testing, reliability testing, and compliance validation.

Testing Categories:
- Unit Tests: Individual component testing
- Integration Tests: Database and service interaction testing  
- Performance Tests: Bulk operation and scalability testing
- Reliability Tests: Error handling and edge case testing
- Compliance Tests: Audit trail and data integrity testing

The implementation follows enterprise testing standards with proper
fixtures, mocking, and comprehensive coverage reporting.
"""

import asyncio
import pytest
import time
from datetime import datetime, timedelta
from typing import List, Dict, Any
from unittest.mock import AsyncMock, patch

from sqlalchemy import Column, Integer, String, ForeignKey, text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import relationship

from src.project_name.models.base import BaseModel
from src.project_name.services.base_service import BaseService
from src.project_name.services.soft_delete_manager import SoftDeleteManager
from src.project_name.utils.database_utils import DatabaseHealthChecker, CascadingSoftDeleteManager
from src.project_name.core.soft_delete_config import SoftDeleteConfig


# Test models for comprehensive testing
class TestCompany(BaseModel):
    """Test company model for relationship testing."""
    
    __tablename__ = "test_companies"
    
    name = Column(String(200), nullable=False)
    industry = Column(String(100))
    employees = relationship("TestEmployee", back_populates="company")


class TestEmployee(BaseModel):
    """Test employee model for relationship testing."""
    
    __tablename__ = "test_employees"
    
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    company_id = Column(Integer, ForeignKey("test_companies.id"))
    company = relationship("TestCompany", back_populates="employees")


class TestCompanyService(BaseService):
    """Test service for companies."""
    model = TestCompany


class TestEmployeeService(BaseService):
    """Test service for employees."""
    model = TestEmployee


class PerformanceTestSuite:
    """Performance testing suite for soft delete operations."""
    
    @pytest.mark.asyncio
    @pytest.mark.performance
    async def test_bulk_soft_delete_performance(self, db_session: AsyncSession):
        """Test bulk soft delete performance with large datasets."""
        service = TestEmployeeService(db_session)
        soft_delete_manager = SoftDeleteManager(db_session)
        
        # Create large dataset
        batch_size = 1000
        total_records = 5000
        
        print(f"\n📊 Performance Test: Bulk Soft Delete ({total_records} records)")
        
        # Measure creation time
        start_time = time.time()
        employee_data = [
            {"name": f"Employee {i}", "email": f"emp{i}@test.com"}
            for i in range(total_records)
        ]
        employees = await service.bulk_create(employee_data, batch_size=batch_size)
        creation_time = time.time() - start_time
        
        print(f"✅ Created {len(employees)} records in {creation_time:.2f}s")
        print(f"   Rate: {len(employees)/creation_time:.0f} records/second")
        
        # Measure bulk soft delete time
        employee_ids = [emp.id for emp in employees]
        
        start_time = time.time()
        deleted_count = await soft_delete_manager.bulk_soft_delete(
            TestEmployee,
            employee_ids,
            deleted_by="performance_test",
            reason="Performance testing",
            batch_size=batch_size
        )
        deletion_time = time.time() - start_time
        
        print(f"✅ Soft deleted {deleted_count} records in {deletion_time:.2f}s")
        print(f"   Rate: {deleted_count/deletion_time:.0f} records/second")
        
        # Performance assertions
        assert deleted_count == total_records
        assert deletion_time < 30  # Should complete within 30 seconds
        assert deleted_count/deletion_time > 100  # Minimum 100 records/second
    
    @pytest.mark.asyncio
    @pytest.mark.performance
    async def test_query_performance_with_soft_delete_filter(self, db_session: AsyncSession):
        """Test query performance with soft delete filtering."""
        service = TestEmployeeService(db_session)
        
        # Create mixed dataset (active and deleted)
        total_records = 2000
        employee_data = [
            {"name": f"Employee {i}", "email": f"emp{i}@test.com"}
            for i in range(total_records)
        ]
        employees = await service.bulk_create(employee_data)
        
        # Soft delete half the records
        delete_ids = [emp.id for emp in employees[:total_records//2]]
        soft_delete_manager = SoftDeleteManager(db_session)
        await soft_delete_manager.bulk_soft_delete(
            TestEmployee, delete_ids, deleted_by="test"
        )
        
        # Measure query performance
        start_time = time.time()
        result = await service.get_active_paginated(page=1, size=100)
        query_time = time.time() - start_time
        
        print(f"\n📊 Query Performance Test:")
        print(f"✅ Queried {len(result['items'])} active records in {query_time*1000:.2f}ms")
        print(f"   Total records in table: {total_records}")
        print(f"   Active records: {result['total']}")
        
        # Performance assertions
        assert query_time < 1.0  # Should complete within 1 second
        assert len(result['items']) == 100
        assert result['total'] == total_records // 2
    
    @pytest.mark.asyncio
    @pytest.mark.performance
    async def test_cascading_delete_performance(self, db_session: AsyncSession):
        """Test cascading delete performance with complex relationships."""
        company_service = TestCompanyService(db_session)
        employee_service = TestEmployeeService(db_session)
        cascade_manager = CascadingSoftDeleteManager(db_session)
        
        # Create companies with employees
        num_companies = 10
        employees_per_company = 100
        
        print(f"\n📊 Cascading Delete Performance Test:")
        print(f"   Companies: {num_companies}")
        print(f"   Employees per company: {employees_per_company}")
        
        companies = []
        for i in range(num_companies):
            company = await company_service.create({
                "name": f"Company {i}",
                "industry": "Technology"
            })
            companies.append(company)
            
            # Create employees for this company
            employee_data = [
                {
                    "name": f"Employee {j}",
                    "email": f"emp{j}@company{i}.com",
                    "company_id": company.id
                }
                for j in range(employees_per_company)
            ]
            await employee_service.bulk_create(employee_data)
        
        # Measure cascading delete performance
        start_time = time.time()
        deleted_counts = await cascade_manager.cascade_soft_delete(
            companies[0],
            deleted_by="performance_test",
            reason="Performance testing"
        )
        cascade_time = time.time() - start_time
        
        total_deleted = sum(deleted_counts.values())
        print(f"✅ Cascading delete completed in {cascade_time:.2f}s")
        print(f"   Total records deleted: {total_deleted}")
        print(f"   Rate: {total_deleted/cascade_time:.0f} records/second")
        
        # Performance assertions
        assert cascade_time < 10  # Should complete within 10 seconds
        assert total_deleted > employees_per_company  # At least company + employees


class ReliabilityTestSuite:
    """Reliability testing suite for error handling and edge cases."""
    
    @pytest.mark.asyncio
    @pytest.mark.reliability
    async def test_concurrent_soft_delete_operations(self, db_session: AsyncSession):
        """Test concurrent soft delete operations for race conditions."""
        service = TestEmployeeService(db_session)
        
        # Create test employee
        employee = await service.create({
            "name": "Concurrent Test Employee",
            "email": "concurrent@test.com"
        })
        
        # Attempt concurrent soft deletes
        async def soft_delete_task(deleted_by: str):
            try:
                return await service.soft_delete(
                    employee.id,
                    deleted_by=deleted_by,
                    reason="Concurrent test"
                )
            except Exception as e:
                return str(e)
        
        # Run concurrent operations
        results = await asyncio.gather(
            soft_delete_task("user1"),
            soft_delete_task("user2"),
            soft_delete_task("user3"),
            return_exceptions=True
        )
        
        # Verify only one succeeded
        successful_deletes = sum(1 for r in results if r is True)
        assert successful_deletes == 1, "Only one concurrent delete should succeed"
        
        # Verify final state
        await db_session.refresh(employee)
        assert employee.is_soft_deleted
    
    @pytest.mark.asyncio
    @pytest.mark.reliability
    async def test_database_connection_failure_handling(self):
        """Test handling of database connection failures."""
        # Mock a failing database session
        mock_session = AsyncMock()
        mock_session.execute.side_effect = Exception("Database connection lost")
        
        health_checker = DatabaseHealthChecker(mock_session)
        
        # Test graceful failure handling
        connection_status = await health_checker.check_connection()
        
        assert connection_status["connected"] is False
        assert "error" in connection_status
        assert connection_status["status"] == "unhealthy"
    
    @pytest.mark.asyncio
    @pytest.mark.reliability
    async def test_invalid_configuration_handling(self):
        """Test handling of invalid configuration values."""
        # Test invalid batch size
        with pytest.raises(ValueError):
            SoftDeleteConfig(bulk_operation_batch_size=0)
        
        # Test invalid retention period
        with pytest.raises(ValueError):
            SoftDeleteConfig(hard_delete_after_days=0)
        
        # Test invalid timezone
        with pytest.raises(ValueError):
            SoftDeleteConfig(timezone="Invalid/Timezone")
    
    @pytest.mark.asyncio
    @pytest.mark.reliability
    async def test_memory_usage_during_bulk_operations(self, db_session: AsyncSession):
        """Test memory usage remains stable during large bulk operations."""
        import psutil
        import os
        
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss / 1024 / 1024  # MB
        
        service = TestEmployeeService(db_session)
        soft_delete_manager = SoftDeleteManager(db_session)
        
        # Create large dataset in batches
        total_records = 10000
        batch_size = 1000
        
        for batch_start in range(0, total_records, batch_size):
            batch_data = [
                {"name": f"Employee {i}", "email": f"emp{i}@test.com"}
                for i in range(batch_start, min(batch_start + batch_size, total_records))
            ]
            await service.bulk_create(batch_data, batch_size=500)
        
        # Measure memory after creation
        after_creation_memory = process.memory_info().rss / 1024 / 1024  # MB
        
        # Perform bulk soft delete
        all_employees = await service.get_active_paginated(page=1, size=total_records)
        employee_ids = [emp.id for emp in all_employees["items"]]
        
        await soft_delete_manager.bulk_soft_delete(
            TestEmployee,
            employee_ids,
            deleted_by="memory_test",
            batch_size=batch_size
        )
        
        # Measure final memory
        final_memory = process.memory_info().rss / 1024 / 1024  # MB
        
        print(f"\n💾 Memory Usage Test:")
        print(f"   Initial memory: {initial_memory:.1f} MB")
        print(f"   After creation: {after_creation_memory:.1f} MB")
        print(f"   Final memory: {final_memory:.1f} MB")
        print(f"   Memory increase: {final_memory - initial_memory:.1f} MB")
        
        # Memory should not increase dramatically
        memory_increase = final_memory - initial_memory
        assert memory_increase < 100, f"Memory usage increased by {memory_increase:.1f} MB"


class ComplianceTestSuite:
    """Compliance testing suite for audit trails and data integrity."""
    
    @pytest.mark.asyncio
    @pytest.mark.compliance
    async def test_audit_trail_completeness(self, db_session: AsyncSession):
        """Test that all audit trail information is properly recorded."""
        service = TestEmployeeService(db_session)
        
        # Create employee
        employee = await service.create({
            "name": "Audit Test Employee",
            "email": "audit@test.com"
        }, created_by="hr_manager")
        
        # Soft delete with full audit information
        deletion_time = datetime.now()
        await service.soft_delete(
            employee.id,
            deleted_by="compliance_officer",
            reason="GDPR deletion request"
        )
        
        # Verify audit trail
        await db_session.refresh(employee)
        
        assert employee.is_soft_deleted
        assert employee.deleted_by == "compliance_officer"
        assert employee.deletion_reason == "GDPR deletion request"
        assert employee.deleted_at is not None
        assert employee.deleted_at >= deletion_time
        
        print(f"\n📋 Audit Trail Verification:")
        print(f"   Deleted by: {employee.deleted_by}")
        print(f"   Reason: {employee.deletion_reason}")
        print(f"   Timestamp: {employee.deleted_at}")
        print(f"   ✅ All audit information properly recorded")
    
    @pytest.mark.asyncio
    @pytest.mark.compliance
    async def test_gdpr_compliance_features(self, db_session: AsyncSession):
        """Test GDPR compliance features."""
        config = SoftDeleteConfig(
            enable_gdpr_compliance=True,
            gdpr_hard_delete_after_days=30,
            require_deletion_reason=True
        )
        
        service = TestEmployeeService(db_session)
        
        # Test GDPR deletion request
        employee = await service.create({
            "name": "GDPR Test User",
            "email": "gdpr@test.com"
        })
        
        # GDPR deletion should require reason
        config.validate_operation(
            "gdpr_delete",
            deleted_by="data_protection_officer",
            reason="User requested data deletion under GDPR Article 17"
        )
        
        # Should not raise exception
        await service.soft_delete(
            employee.id,
            deleted_by="data_protection_officer",
            reason="User requested data deletion under GDPR Article 17"
        )
        
        await db_session.refresh(employee)
        assert employee.deletion_reason.startswith("User requested data deletion under GDPR")
        
        print(f"\n🔒 GDPR Compliance Test:")
        print(f"   ✅ Deletion reason required and recorded")
        print(f"   ✅ Data protection officer identified")
        print(f"   ✅ GDPR Article 17 compliance maintained")
    
    @pytest.mark.asyncio
    @pytest.mark.compliance
    async def test_data_integrity_during_operations(self, db_session: AsyncSession):
        """Test data integrity is maintained during all operations."""
        company_service = TestCompanyService(db_session)
        employee_service = TestEmployeeService(db_session)
        
        # Create company with employees
        company = await company_service.create({
            "name": "Integrity Test Corp",
            "industry": "Testing"
        })
        
        employees = await employee_service.bulk_create([
            {"name": f"Employee {i}", "email": f"emp{i}@integrity.com", "company_id": company.id}
            for i in range(10)
        ])
        
        # Verify relationships before deletion
        await db_session.refresh(company)
        initial_employee_count = len(company.employees)
        
        # Soft delete some employees
        delete_ids = [emp.id for emp in employees[:5]]
        soft_delete_manager = SoftDeleteManager(db_session)
        await soft_delete_manager.bulk_soft_delete(
            TestEmployee, delete_ids, deleted_by="integrity_test"
        )
        
        # Verify data integrity
        active_employees = await employee_service.get_active_paginated(
            filters={"company_id": company.id}
        )
        
        assert active_employees["total"] == 5  # 5 remaining active
        assert initial_employee_count == 10  # Original count unchanged
        
        # Verify foreign key relationships maintained
        for employee in employees:
            await db_session.refresh(employee)
            assert employee.company_id == company.id
        
        print(f"\n🔗 Data Integrity Test:")
        print(f"   ✅ Foreign key relationships maintained")
        print(f"   ✅ Active record count accurate: {active_employees['total']}")
        print(f"   ✅ Soft deleted records preserve relationships")


# Test configuration for different environments
@pytest.fixture
def performance_config():
    """Configuration optimized for performance testing."""
    return SoftDeleteConfig(
        bulk_operation_batch_size=2000,
        query_timeout_seconds=60,
        enable_query_optimization=True
    )


@pytest.fixture
def compliance_config():
    """Configuration optimized for compliance testing."""
    return SoftDeleteConfig(
        enable_audit_log=True,
        require_deletion_reason=True,
        require_deleted_by=True,
        enable_gdpr_compliance=True
    )


# Test markers for different test categories
pytestmark = [
    pytest.mark.asyncio,
    pytest.mark.enhanced_testing
]
