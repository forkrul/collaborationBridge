"""Advanced database utilities for production-ready operations.

This module provides utilities for database operations including:
- Cascading soft delete operations
- Performance monitoring and optimization
- Database health checks
- Connection pool management
- Query optimization helpers

The implementation follows enterprise standards for reliability,
performance, and maintainability.
"""

import asyncio
import time
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Any, AsyncGenerator, Dict, List, Optional, Set, Type, TypeVar

from sqlalchemy import and_, func, select, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy.orm.relationships import RelationshipProperty

from src.project_name.models.base import BaseModel, SoftDeleteMixin

# Type variables for generic operations
ModelType = TypeVar('ModelType', bound=BaseModel)
SoftDeleteModelType = TypeVar('SoftDeleteModelType', bound=SoftDeleteMixin)


class DatabaseHealthChecker:
    """Database health monitoring and diagnostics utility.
    
    Provides comprehensive health checks for database connections,
    performance monitoring, and optimization recommendations.
    
    Example:
        async with AsyncSession(engine) as session:
            health_checker = DatabaseHealthChecker(session)
            health_report = await health_checker.get_health_report()
            
            if not health_report['healthy']:
                print(f"Database issues: {health_report['issues']}")
    """
    
    def __init__(self, session: AsyncSession) -> None:
        """Initialize the health checker.
        
        Args:
            session: Async SQLAlchemy session for database operations.
        """
        self.session = session
    
    async def check_connection(self) -> Dict[str, Any]:
        """Check basic database connectivity.
        
        Returns:
            Dict containing connection status and response time.
        """
        start_time = time.time()
        try:
            await self.session.execute(text("SELECT 1"))
            response_time = (time.time() - start_time) * 1000  # Convert to ms
            
            return {
                "connected": True,
                "response_time_ms": round(response_time, 2),
                "status": "healthy" if response_time < 100 else "slow"
            }
        except Exception as e:
            return {
                "connected": False,
                "error": str(e),
                "status": "unhealthy"
            }
    
    async def check_soft_delete_indexes(
        self, model_class: Type[SoftDeleteModelType]
    ) -> Dict[str, Any]:
        """Check if soft delete indexes are properly configured.
        
        Args:
            model_class: Model class to check indexes for.
            
        Returns:
            Dict containing index status and recommendations.
        """
        table_name = model_class.__tablename__
        
        # Check for recommended indexes
        index_checks = [
            ("is_deleted", "Performance index for active record filtering"),
            ("deleted_at", "Index for cleanup operations"),
            ("deleted_by", "Index for audit queries")
        ]
        
        results = {
            "table": table_name,
            "indexes_found": [],
            "missing_indexes": [],
            "recommendations": []
        }
        
        try:
            # Query database for existing indexes
            index_query = text("""
                SELECT indexname, indexdef 
                FROM pg_indexes 
                WHERE tablename = :table_name
            """)
            
            result = await self.session.execute(
                index_query, {"table_name": table_name}
            )
            existing_indexes = result.fetchall()
            
            for column, description in index_checks:
                found = any(column in idx[1] for idx in existing_indexes)
                if found:
                    results["indexes_found"].append(column)
                else:
                    results["missing_indexes"].append(column)
                    results["recommendations"].append(
                        f"Add index on {column}: {description}"
                    )
            
        except Exception as e:
            results["error"] = f"Could not check indexes: {str(e)}"
        
        return results
    
    async def get_table_statistics(
        self, model_class: Type[SoftDeleteModelType]
    ) -> Dict[str, Any]:
        """Get comprehensive table statistics.
        
        Args:
            model_class: Model class to analyze.
            
        Returns:
            Dict containing table statistics and health metrics.
        """
        try:
            # Count active records
            active_count = await self.session.scalar(
                select(func.count(model_class.id)).where(
                    model_class.is_deleted == False  # noqa: E712
                )
            )
            
            # Count deleted records
            deleted_count = await self.session.scalar(
                select(func.count(model_class.id)).where(
                    model_class.is_deleted == True  # noqa: E712
                )
            )
            
            # Count old deleted records (>90 days)
            cutoff_date = datetime.now() - timedelta(days=90)
            old_deleted_count = await self.session.scalar(
                select(func.count(model_class.id)).where(
                    and_(
                        model_class.is_deleted == True,  # noqa: E712
                        model_class.deleted_at < cutoff_date
                    )
                )
            )
            
            total_count = active_count + deleted_count
            deletion_ratio = (deleted_count / total_count * 100) if total_count > 0 else 0
            
            return {
                "table": model_class.__tablename__,
                "active_records": active_count,
                "deleted_records": deleted_count,
                "old_deleted_records": old_deleted_count,
                "total_records": total_count,
                "deletion_ratio_percent": round(deletion_ratio, 2),
                "cleanup_recommended": old_deleted_count > 1000,
                "health_status": self._assess_table_health(
                    deletion_ratio, old_deleted_count
                )
            }
            
        except Exception as e:
            return {
                "table": model_class.__tablename__,
                "error": f"Could not get statistics: {str(e)}",
                "health_status": "unknown"
            }
    
    def _assess_table_health(
        self, deletion_ratio: float, old_deleted_count: int
    ) -> str:
        """Assess table health based on deletion metrics.
        
        Args:
            deletion_ratio: Percentage of deleted records.
            old_deleted_count: Number of old deleted records.
            
        Returns:
            Health status string.
        """
        if deletion_ratio > 50:
            return "poor - high deletion ratio"
        elif old_deleted_count > 10000:
            return "poor - too many old deleted records"
        elif deletion_ratio > 25 or old_deleted_count > 1000:
            return "fair - cleanup recommended"
        else:
            return "good"
    
    async def get_health_report(
        self, model_classes: Optional[List[Type[SoftDeleteModelType]]] = None
    ) -> Dict[str, Any]:
        """Generate comprehensive database health report.
        
        Args:
            model_classes: List of model classes to check. If None, checks common models.
            
        Returns:
            Comprehensive health report with recommendations.
        """
        report = {
            "timestamp": datetime.now().isoformat(),
            "overall_health": "unknown",
            "connection": {},
            "tables": [],
            "recommendations": [],
            "healthy": True
        }
        
        # Check connection
        connection_status = await self.check_connection()
        report["connection"] = connection_status
        
        if not connection_status["connected"]:
            report["healthy"] = False
            report["overall_health"] = "unhealthy - no connection"
            return report
        
        # Check tables if provided
        if model_classes:
            for model_class in model_classes:
                if not issubclass(model_class, SoftDeleteMixin):
                    continue
                
                # Get table statistics
                table_stats = await self.get_table_statistics(model_class)
                
                # Check indexes
                index_status = await self.check_soft_delete_indexes(model_class)
                
                table_report = {
                    **table_stats,
                    "indexes": index_status
                }
                
                report["tables"].append(table_report)
                
                # Add recommendations
                if table_stats.get("cleanup_recommended"):
                    report["recommendations"].append(
                        f"Consider cleaning up old deleted records in {model_class.__tablename__}"
                    )
                
                if index_status.get("missing_indexes"):
                    report["recommendations"].extend(index_status["recommendations"])
                
                # Update overall health
                if table_stats.get("health_status", "").startswith("poor"):
                    report["healthy"] = False
        
        # Determine overall health
        if report["healthy"]:
            if connection_status["status"] == "slow":
                report["overall_health"] = "fair - slow connection"
            else:
                report["overall_health"] = "good"
        else:
            report["overall_health"] = "poor - issues detected"
        
        return report


class CascadingSoftDeleteManager:
    """Manager for cascading soft delete operations.
    
    Handles complex deletion scenarios where related records
    should also be soft deleted to maintain data integrity.
    
    Example:
        async with AsyncSession(engine) as session:
            cascade_manager = CascadingSoftDeleteManager(session)
            
            # Soft delete user and all related records
            await cascade_manager.cascade_soft_delete(
                user, deleted_by="admin", reason="Account closure"
            )
    """
    
    def __init__(self, session: AsyncSession) -> None:
        """Initialize the cascading delete manager.
        
        Args:
            session: Async SQLAlchemy session for database operations.
        """
        self.session = session
    
    async def cascade_soft_delete(
        self,
        instance: SoftDeleteModelType,
        deleted_by: Optional[str] = None,
        reason: Optional[str] = None,
        max_depth: int = 5
    ) -> Dict[str, int]:
        """Perform cascading soft delete on related records.
        
        Args:
            instance: The primary record to delete.
            deleted_by: Identifier of user/system performing deletion.
            reason: Reason for deletion.
            max_depth: Maximum depth for cascading (prevents infinite loops).
            
        Returns:
            Dict containing count of deleted records by model type.
            
        Raises:
            ValueError: If max_depth is exceeded or circular references detected.
        """
        if max_depth <= 0:
            raise ValueError("Maximum cascade depth exceeded")
        
        deleted_counts: Dict[str, int] = {}
        processed_instances: Set[tuple] = set()
        
        await self._cascade_delete_recursive(
            instance, deleted_by, reason, max_depth, deleted_counts, processed_instances
        )
        
        await self.session.commit()
        return deleted_counts
    
    async def _cascade_delete_recursive(
        self,
        instance: SoftDeleteModelType,
        deleted_by: Optional[str],
        reason: Optional[str],
        remaining_depth: int,
        deleted_counts: Dict[str, int],
        processed_instances: Set[tuple]
    ) -> None:
        """Recursively delete related records.
        
        Args:
            instance: Current instance to process.
            deleted_by: User performing deletion.
            reason: Deletion reason.
            remaining_depth: Remaining recursion depth.
            deleted_counts: Running count of deletions.
            processed_instances: Set of already processed instances.
        """
        # Check if already processed (prevent infinite loops)
        instance_key = (type(instance).__name__, instance.id)
        if instance_key in processed_instances:
            return
        
        processed_instances.add(instance_key)
        
        # Soft delete the current instance
        if not instance.is_soft_deleted:
            instance.soft_delete(deleted_by=deleted_by, reason=reason)
            
            model_name = type(instance).__name__
            deleted_counts[model_name] = deleted_counts.get(model_name, 0) + 1
        
        # Find and process related records
        if remaining_depth > 0:
            await self._process_relationships(
                instance, deleted_by, reason, remaining_depth - 1,
                deleted_counts, processed_instances
            )
    
    async def _process_relationships(
        self,
        instance: SoftDeleteModelType,
        deleted_by: Optional[str],
        reason: Optional[str],
        remaining_depth: int,
        deleted_counts: Dict[str, int],
        processed_instances: Set[tuple]
    ) -> None:
        """Process relationships for cascading deletion.
        
        Args:
            instance: Instance whose relationships to process.
            deleted_by: User performing deletion.
            reason: Deletion reason.
            remaining_depth: Remaining recursion depth.
            deleted_counts: Running count of deletions.
            processed_instances: Set of already processed instances.
        """
        # Get all relationships from the model
        mapper = instance.__class__.__mapper__
        
        for relationship_prop in mapper.relationships:
            if not isinstance(relationship_prop, RelationshipProperty):
                continue
            
            # Get related instances
            related_instances = getattr(instance, relationship_prop.key, None)
            
            if related_instances is None:
                continue
            
            # Handle both single instances and collections
            if not isinstance(related_instances, list):
                related_instances = [related_instances]
            
            # Process each related instance
            for related_instance in related_instances:
                if (hasattr(related_instance, 'soft_delete') and 
                    not related_instance.is_soft_deleted):
                    
                    await self._cascade_delete_recursive(
                        related_instance, deleted_by, reason, remaining_depth,
                        deleted_counts, processed_instances
                    )
