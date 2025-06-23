"""Comprehensive example of advanced soft delete features.

This example demonstrates how to use all the enhanced soft delete
functionality implemented based on the soft delete PRD analysis.

Features demonstrated:
- Enhanced soft delete with audit trails
- Bulk operations for performance
- Cascading soft delete operations
- Database health monitoring
- Configuration management
- Advanced service patterns

Run this example to see the production-ready soft delete system in action.
"""

import asyncio
from datetime import datetime, timedelta
from typing import List

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import relationship

from src.project_name.models.base import BaseModel
from src.project_name.services.base_service import BaseService
from src.project_name.services.soft_delete_manager import SoftDeleteManager
from src.project_name.utils.database_utils import DatabaseHealthChecker, CascadingSoftDeleteManager
from src.project_name.core.soft_delete_config import SoftDeleteConfig, update_soft_delete_config


# Example models for demonstration
class Company(BaseModel):
    """Company model with employees."""
    
    __tablename__ = "companies"
    
    name = Column(String(200), nullable=False)
    industry = Column(String(100))
    
    # Relationship to employees
    employees = relationship("Employee", back_populates="company")


class Employee(BaseModel):
    """Employee model with company relationship."""
    
    __tablename__ = "employees"
    
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    position = Column(String(100))
    company_id = Column(Integer, ForeignKey("companies.id"))
    
    # Relationship to company
    company = relationship("Company", back_populates="employees")


# Enhanced services using the new base service
class CompanyService(BaseService):
    """Enhanced company service with advanced features."""
    model = Company


class EmployeeService(BaseService):
    """Enhanced employee service with advanced features."""
    model = Employee


async def demonstrate_enhanced_soft_delete():
    """Demonstrate enhanced soft delete with audit trails."""
    print("\n🔍 Demonstrating Enhanced Soft Delete with Audit Trails")
    print("=" * 60)
    
    # Create in-memory SQLite database for demo
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.create_all)
    
    async with AsyncSession(engine) as session:
        company_service = CompanyService(session)
        employee_service = EmployeeService(session)
        
        # Create test data
        company = await company_service.create({
            "name": "Tech Corp",
            "industry": "Technology"
        }, created_by="admin")
        
        employee = await employee_service.create({
            "name": "John Doe",
            "email": "john@techcorp.com",
            "position": "Developer",
            "company_id": company.id
        }, created_by="hr_manager")
        
        print(f"✅ Created company: {company.name} (ID: {company.id})")
        print(f"✅ Created employee: {employee.name} (ID: {employee.id})")
        
        # Demonstrate enhanced soft delete with audit trail
        success = await employee_service.soft_delete(
            employee.id,
            deleted_by="hr_manager",
            reason="Employee resigned"
        )
        
        if success:
            await session.refresh(employee)
            print(f"✅ Soft deleted employee: {employee.name}")
            print(f"   Deleted by: {employee.deleted_by}")
            print(f"   Reason: {employee.deletion_reason}")
            print(f"   Deleted at: {employee.deleted_at}")
            print(f"   Is deleted: {employee.is_soft_deleted}")
        
        # Demonstrate restoration
        restored = await employee_service.restore(employee.id)
        if restored:
            await session.refresh(employee)
            print(f"✅ Restored employee: {employee.name}")
            print(f"   Is deleted: {employee.is_soft_deleted}")


async def demonstrate_bulk_operations():
    """Demonstrate bulk operations for performance."""
    print("\n⚡ Demonstrating Bulk Operations for Performance")
    print("=" * 50)
    
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    
    async with engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.create_all)
    
    async with AsyncSession(engine) as session:
        employee_service = EmployeeService(session)
        soft_delete_manager = SoftDeleteManager(session)
        
        # Bulk create employees
        employee_data = [
            {"name": f"Employee {i}", "email": f"emp{i}@company.com", "position": "Developer"}
            for i in range(1, 101)  # Create 100 employees
        ]
        
        print("Creating 100 employees in bulk...")
        start_time = datetime.now()
        employees = await employee_service.bulk_create(employee_data, created_by="hr_system")
        end_time = datetime.now()
        
        print(f"✅ Created {len(employees)} employees in {(end_time - start_time).total_seconds():.2f} seconds")
        
        # Bulk soft delete
        employee_ids = [emp.id for emp in employees[:50]]  # Delete first 50
        
        print("Bulk soft deleting 50 employees...")
        start_time = datetime.now()
        deleted_count = await soft_delete_manager.bulk_soft_delete(
            Employee,
            employee_ids,
            deleted_by="hr_manager",
            reason="Department restructuring"
        )
        end_time = datetime.now()
        
        print(f"✅ Soft deleted {deleted_count} employees in {(end_time - start_time).total_seconds():.2f} seconds")
        
        # Get statistics
        stats = await employee_service.get_statistics()
        print(f"📊 Statistics:")
        print(f"   Total employees: {stats['total_count']}")
        print(f"   Active employees: {stats['active_count']}")
        print(f"   Deleted employees: {stats['deleted_count']}")
        print(f"   Deletion ratio: {stats['deletion_ratio']:.1f}%")


async def demonstrate_cascading_soft_delete():
    """Demonstrate cascading soft delete operations."""
    print("\n🔗 Demonstrating Cascading Soft Delete Operations")
    print("=" * 52)
    
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    
    async with engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.create_all)
    
    async with AsyncSession(engine) as session:
        company_service = CompanyService(session)
        employee_service = EmployeeService(session)
        cascade_manager = CascadingSoftDeleteManager(session)
        
        # Create company with employees
        company = await company_service.create({
            "name": "StartupCorp",
            "industry": "Technology"
        })
        
        employees = await employee_service.bulk_create([
            {"name": "Alice Johnson", "email": "alice@startup.com", "position": "CTO", "company_id": company.id},
            {"name": "Bob Smith", "email": "bob@startup.com", "position": "Developer", "company_id": company.id},
            {"name": "Carol Davis", "email": "carol@startup.com", "position": "Designer", "company_id": company.id}
        ])
        
        print(f"✅ Created company: {company.name} with {len(employees)} employees")
        
        # Perform cascading soft delete
        print("Performing cascading soft delete of company...")
        deleted_counts = await cascade_manager.cascade_soft_delete(
            company,
            deleted_by="ceo",
            reason="Company closure"
        )
        
        print(f"✅ Cascading deletion completed:")
        for model_name, count in deleted_counts.items():
            print(f"   {model_name}: {count} records deleted")
        
        # Verify deletions
        await session.refresh(company)
        print(f"   Company '{company.name}' is deleted: {company.is_soft_deleted}")


async def demonstrate_database_health_monitoring():
    """Demonstrate database health monitoring."""
    print("\n🏥 Demonstrating Database Health Monitoring")
    print("=" * 45)
    
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    
    async with engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.create_all)
    
    async with AsyncSession(engine) as session:
        health_checker = DatabaseHealthChecker(session)
        employee_service = EmployeeService(session)
        
        # Create some test data for health analysis
        employees = await employee_service.bulk_create([
            {"name": f"Employee {i}", "email": f"emp{i}@test.com", "position": "Worker"}
            for i in range(20)
        ])
        
        # Soft delete some records
        for i in range(0, 10, 2):  # Delete every other employee
            await employee_service.soft_delete(employees[i].id, deleted_by="manager")
        
        # Check connection health
        connection_status = await health_checker.check_connection()
        print(f"🔌 Connection Status:")
        print(f"   Connected: {connection_status['connected']}")
        print(f"   Response time: {connection_status['response_time_ms']:.2f}ms")
        print(f"   Status: {connection_status['status']}")
        
        # Get table statistics
        table_stats = await health_checker.get_table_statistics(Employee)
        print(f"📊 Employee Table Statistics:")
        print(f"   Active records: {table_stats['active_records']}")
        print(f"   Deleted records: {table_stats['deleted_records']}")
        print(f"   Total records: {table_stats['total_records']}")
        print(f"   Deletion ratio: {table_stats['deletion_ratio_percent']:.1f}%")
        print(f"   Health status: {table_stats['health_status']}")
        
        # Generate comprehensive health report
        health_report = await health_checker.get_health_report([Employee])
        print(f"🏥 Overall Health Report:")
        print(f"   Overall health: {health_report['overall_health']}")
        print(f"   Healthy: {health_report['healthy']}")
        if health_report['recommendations']:
            print(f"   Recommendations:")
            for rec in health_report['recommendations']:
                print(f"     - {rec}")


async def demonstrate_configuration_management():
    """Demonstrate configuration management."""
    print("\n⚙️  Demonstrating Configuration Management")
    print("=" * 42)
    
    # Show default configuration
    config = SoftDeleteConfig()
    print(f"📋 Default Configuration:")
    print(f"   Auto filter: {config.auto_filter}")
    print(f"   Cascade soft delete: {config.cascade_soft_delete}")
    print(f"   Hard delete after days: {config.hard_delete_after_days}")
    print(f"   Require deletion reason: {config.require_deletion_reason}")
    print(f"   Enable audit log: {config.enable_audit_log}")
    
    # Update configuration
    print(f"\n🔧 Updating Configuration:")
    update_soft_delete_config(
        cascade_soft_delete=True,
        require_deletion_reason=True,
        hard_delete_after_days=30
    )
    
    updated_config = SoftDeleteConfig()
    print(f"   Cascade soft delete: {updated_config.cascade_soft_delete}")
    print(f"   Require deletion reason: {updated_config.require_deletion_reason}")
    print(f"   Hard delete after days: {updated_config.hard_delete_after_days}")
    
    # Show configuration sections
    cleanup_settings = config.get_cleanup_settings()
    print(f"\n🧹 Cleanup Settings:")
    for key, value in cleanup_settings.items():
        print(f"   {key}: {value}")
    
    performance_settings = config.get_performance_settings()
    print(f"\n⚡ Performance Settings:")
    for key, value in performance_settings.items():
        print(f"   {key}: {value}")
    
    # Demonstrate validation
    try:
        config.validate_operation("soft_delete", deleted_by="admin", reason="Test")
        print(f"✅ Operation validation passed")
    except ValueError as e:
        print(f"❌ Operation validation failed: {e}")


async def main():
    """Run all demonstrations."""
    print("🚀 Advanced Soft Delete Features Demonstration")
    print("=" * 50)
    print("This example showcases the production-ready soft delete")
    print("functionality implemented based on the soft delete PRD analysis.")
    
    try:
        await demonstrate_enhanced_soft_delete()
        await demonstrate_bulk_operations()
        await demonstrate_cascading_soft_delete()
        await demonstrate_database_health_monitoring()
        await demonstrate_configuration_management()
        
        print("\n🎉 All demonstrations completed successfully!")
        print("\nKey improvements implemented:")
        print("✅ Enhanced soft delete with comprehensive audit trails")
        print("✅ High-performance bulk operations with batching")
        print("✅ Cascading soft delete for maintaining data integrity")
        print("✅ Database health monitoring and diagnostics")
        print("✅ Flexible configuration management system")
        print("✅ Production-ready error handling and validation")
        print("✅ Comprehensive type safety and documentation")
        
    except Exception as e:
        print(f"❌ Error during demonstration: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(main())
