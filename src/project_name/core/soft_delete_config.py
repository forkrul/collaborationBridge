"""Configuration system for soft delete operations.

This module provides comprehensive configuration management for soft delete
functionality, following the patterns established in the soft delete PRD.

Features:
- Environment-based configuration
- Runtime configuration updates
- Validation and type safety
- Performance tuning parameters
- Audit and compliance settings

The implementation follows enterprise standards for configurability,
security, and maintainability.
"""

from datetime import timedelta
from typing import Any

from pydantic import BaseSettings, Field, validator


class SoftDeleteConfig(BaseSettings):
    """Comprehensive configuration for soft delete operations.

    This configuration class provides all settings needed for production-ready
    soft delete functionality, including performance tuning, audit settings,
    and compliance options.

    Example:
        # Environment-based configuration
        config = SoftDeleteConfig()

        # Override specific settings
        config = SoftDeleteConfig(
            auto_filter=True,
            hard_delete_after_days=90,
            enable_audit_log=True
        )

        # Use in services
        if config.cascade_soft_delete:
            await cascade_manager.cascade_soft_delete(instance)
    """

    # Core Soft Delete Settings
    auto_filter: bool = Field(
        default=True,
        description="Automatically exclude soft-deleted records from queries",
    )

    cascade_soft_delete: bool = Field(
        default=False, description="Enable cascading soft delete to related records"
    )

    max_cascade_depth: int = Field(
        default=5,
        ge=1,
        le=10,
        description="Maximum depth for cascading soft delete operations",
    )

    # Retention and Cleanup Settings
    hard_delete_after_days: int = Field(
        default=90,
        ge=1,
        description="Number of days to retain soft-deleted records before hard delete",
    )

    enable_auto_cleanup: bool = Field(
        default=False,
        description="Enable automatic cleanup of old soft-deleted records",
    )

    cleanup_batch_size: int = Field(
        default=1000,
        ge=100,
        le=10000,
        description="Number of records to process per cleanup batch",
    )

    cleanup_schedule_hours: list[int] = Field(
        default=[2],  # 2 AM
        description="Hours of day when cleanup should run (0-23)",
    )

    # Performance Settings
    bulk_operation_batch_size: int = Field(
        default=1000,
        ge=100,
        le=10000,
        description="Default batch size for bulk operations",
    )

    query_timeout_seconds: int = Field(
        default=30, ge=1, le=300, description="Timeout for database queries in seconds"
    )

    enable_query_optimization: bool = Field(
        default=True, description="Enable automatic query optimization features"
    )

    # Audit and Compliance Settings
    enable_audit_log: bool = Field(
        default=True, description="Enable comprehensive audit logging"
    )

    require_deletion_reason: bool = Field(
        default=False, description="Require a reason for all soft delete operations"
    )

    require_deleted_by: bool = Field(
        default=True, description="Require identification of who performed the deletion"
    )

    audit_log_retention_days: int = Field(
        default=2555,  # 7 years
        ge=365,
        description="Number of days to retain audit logs",
    )

    # Security Settings
    enable_gdpr_compliance: bool = Field(
        default=False, description="Enable GDPR-compliant deletion options"
    )

    gdpr_hard_delete_after_days: int = Field(
        default=30,
        ge=1,
        description="Days after which GDPR deletion requests are hard deleted",
    )

    enable_encryption: bool = Field(
        default=False,
        description="Enable encryption for audit logs and deletion reasons",
    )

    # Monitoring and Alerting Settings
    enable_monitoring: bool = Field(
        default=True, description="Enable monitoring and metrics collection"
    )

    alert_on_high_deletion_ratio: bool = Field(
        default=True, description="Alert when deletion ratio exceeds threshold"
    )

    deletion_ratio_alert_threshold: float = Field(
        default=0.25,  # 25%
        ge=0.1,
        le=0.9,
        description="Deletion ratio threshold for alerts (0.0-1.0)",
    )

    alert_on_bulk_operations: bool = Field(
        default=True, description="Alert on large bulk operations"
    )

    bulk_operation_alert_threshold: int = Field(
        default=10000,
        ge=1000,
        description="Number of records that triggers bulk operation alert",
    )

    # Database-Specific Settings
    timezone: str = Field(default="UTC", description="Timezone for deletion timestamps")

    enable_partial_indexes: bool = Field(
        default=True, description="Use partial indexes for better performance"
    )

    index_deleted_records: bool = Field(
        default=True, description="Create indexes on deleted record queries"
    )

    # Error Handling Settings
    retry_failed_operations: bool = Field(
        default=True, description="Retry failed soft delete operations"
    )

    max_retry_attempts: int = Field(
        default=3, ge=1, le=10, description="Maximum number of retry attempts"
    )

    retry_delay_seconds: int = Field(
        default=5, ge=1, le=60, description="Delay between retry attempts in seconds"
    )

    # Development and Testing Settings
    debug_mode: bool = Field(
        default=False, description="Enable debug mode with verbose logging"
    )

    skip_validation: bool = Field(
        default=False, description="Skip validation checks (for testing only)"
    )

    mock_external_services: bool = Field(
        default=False, description="Mock external services for testing"
    )

    class Config:
        """Pydantic configuration."""

        env_prefix = "SOFT_DELETE_"
        case_sensitive = False

    @validator("cleanup_schedule_hours")
    def validate_cleanup_hours(cls, v):
        """Validate cleanup schedule hours."""
        if not all(0 <= hour <= 23 for hour in v):
            raise ValueError("Cleanup hours must be between 0 and 23")
        return v

    @validator("timezone")
    def validate_timezone(cls, v):
        """Validate timezone string."""
        try:
            import pytz

            pytz.timezone(v)
        except Exception:
            raise ValueError(f"Invalid timezone: {v}")
        return v

    @property
    def hard_delete_timedelta(self) -> timedelta:
        """Get hard delete retention period as timedelta."""
        return timedelta(days=self.hard_delete_after_days)

    @property
    def gdpr_hard_delete_timedelta(self) -> timedelta:
        """Get GDPR hard delete period as timedelta."""
        return timedelta(days=self.gdpr_hard_delete_after_days)

    @property
    def audit_retention_timedelta(self) -> timedelta:
        """Get audit log retention period as timedelta."""
        return timedelta(days=self.audit_log_retention_days)

    def get_cleanup_settings(self) -> dict[str, Any]:
        """Get all cleanup-related settings."""
        return {
            "enabled": self.enable_auto_cleanup,
            "retention_days": self.hard_delete_after_days,
            "batch_size": self.cleanup_batch_size,
            "schedule_hours": self.cleanup_schedule_hours,
            "gdpr_retention_days": self.gdpr_hard_delete_after_days
            if self.enable_gdpr_compliance
            else None,
        }

    def get_performance_settings(self) -> dict[str, Any]:
        """Get all performance-related settings."""
        return {
            "bulk_batch_size": self.bulk_operation_batch_size,
            "query_timeout": self.query_timeout_seconds,
            "enable_optimization": self.enable_query_optimization,
            "enable_partial_indexes": self.enable_partial_indexes,
            "index_deleted_records": self.index_deleted_records,
        }

    def get_audit_settings(self) -> dict[str, Any]:
        """Get all audit-related settings."""
        return {
            "enabled": self.enable_audit_log,
            "require_reason": self.require_deletion_reason,
            "require_deleted_by": self.require_deleted_by,
            "retention_days": self.audit_log_retention_days,
            "enable_encryption": self.enable_encryption,
        }

    def get_monitoring_settings(self) -> dict[str, Any]:
        """Get all monitoring-related settings."""
        return {
            "enabled": self.enable_monitoring,
            "alert_on_high_deletion_ratio": self.alert_on_high_deletion_ratio,
            "deletion_ratio_threshold": self.deletion_ratio_alert_threshold,
            "alert_on_bulk_operations": self.alert_on_bulk_operations,
            "bulk_operation_threshold": self.bulk_operation_alert_threshold,
        }

    def validate_operation(
        self,
        operation_type: str,
        deleted_by: str | None = None,
        reason: str | None = None,
    ) -> None:
        """Validate a soft delete operation against configuration.

        Args:
            operation_type: Type of operation (e.g., 'soft_delete', 'bulk_delete').
            deleted_by: User performing the operation.
            reason: Reason for the operation.

        Raises:
            ValueError: If operation violates configuration requirements.
        """
        if self.skip_validation:
            return

        if self.require_deleted_by and not deleted_by:
            raise ValueError(f"{operation_type} requires 'deleted_by' to be specified")

        if self.require_deletion_reason and not reason:
            raise ValueError(f"{operation_type} requires 'reason' to be specified")


# Global configuration instance
soft_delete_config = SoftDeleteConfig()


def get_soft_delete_config() -> SoftDeleteConfig:
    """Get the global soft delete configuration.

    Returns:
        The global SoftDeleteConfig instance.
    """
    return soft_delete_config


def update_soft_delete_config(**kwargs) -> None:
    """Update the global soft delete configuration.

    Args:
        **kwargs: Configuration parameters to update.

    Example:
        update_soft_delete_config(
            auto_filter=False,
            hard_delete_after_days=30
        )
    """
    global soft_delete_config

    # Create new config with updated values
    current_values = soft_delete_config.dict()
    current_values.update(kwargs)

    soft_delete_config = SoftDeleteConfig(**current_values)
