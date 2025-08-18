Configuration Management
========================

The MVP template includes a comprehensive configuration management system with over 30 configurable 
settings for soft delete operations, performance tuning, audit compliance, and monitoring.

.. note::
   **Environment-Based**: All configuration can be set via environment variables, making it 
   perfect for containerized deployments and different environments.

Overview
--------

The configuration system provides:

* **30+ Configuration Options**: Comprehensive settings for all aspects of soft delete operations
* **Environment Integration**: Automatic environment variable loading with validation
* **Type Safety**: Full type validation with Pydantic
* **Runtime Updates**: Dynamic configuration updates without restart
* **Category Organization**: Settings organized by functional area
* **Validation**: Comprehensive validation with helpful error messages

SoftDeleteConfig
----------------

The main configuration class provides all settings needed for production deployment:

Basic Usage
~~~~~~~~~~~

.. code-block:: python

   from src.project_name.core.soft_delete_config import SoftDeleteConfig
   
   # Create with default settings
   config = SoftDeleteConfig()
   
   # Create with custom settings
   config = SoftDeleteConfig(
       auto_filter=True,
       cascade_soft_delete=False,
       hard_delete_after_days=90,
       require_deletion_reason=True
   )
   
   # Access settings
   print(f"Auto filter: {config.auto_filter}")
   print(f"Retention period: {config.hard_delete_after_days} days")

Configuration Categories
------------------------

Core Soft Delete Settings
~~~~~~~~~~~~~~~~~~~~~~~~~

Basic soft delete behavior configuration:

.. code-block:: python

   config = SoftDeleteConfig(
       auto_filter=True,              # Automatically exclude deleted records
       cascade_soft_delete=False,     # Enable cascading deletes
       max_cascade_depth=5,           # Maximum cascade depth
   )

Retention and Cleanup Settings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Configure data retention and cleanup policies:

.. code-block:: python

   config = SoftDeleteConfig(
       hard_delete_after_days=90,     # Retention period
       enable_auto_cleanup=False,     # Enable automatic cleanup
       cleanup_batch_size=1000,       # Cleanup batch size
       cleanup_schedule_hours=[2],    # Cleanup schedule (2 AM)
   )

Performance Settings
~~~~~~~~~~~~~~~~~~~~

Optimize performance for your environment:

.. code-block:: python

   config = SoftDeleteConfig(
       bulk_operation_batch_size=1000,    # Bulk operation batch size
       query_timeout_seconds=30,          # Query timeout
       enable_query_optimization=True,    # Enable optimizations
       enable_partial_indexes=True,       # Use partial indexes
   )

Audit and Compliance Settings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Configure audit trails and compliance features:

.. code-block:: python

   config = SoftDeleteConfig(
       enable_audit_log=True,             # Enable audit logging
       require_deletion_reason=False,     # Require deletion reason
       require_deleted_by=True,           # Require user identification
       audit_log_retention_days=2555,     # Audit retention (7 years)
   )

Security Settings
~~~~~~~~~~~~~~~~~

Configure security and data protection features:

.. code-block:: python

   config = SoftDeleteConfig(
       enable_gdpr_compliance=False,      # Enable GDPR features
       gdpr_hard_delete_after_days=30,    # GDPR deletion period
       enable_encryption=False,           # Enable audit encryption
   )

Monitoring and Alerting Settings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Configure monitoring and alerting behavior:

.. code-block:: python

   config = SoftDeleteConfig(
       enable_monitoring=True,                    # Enable monitoring
       alert_on_high_deletion_ratio=True,        # Alert on high deletions
       deletion_ratio_alert_threshold=0.25,      # 25% deletion threshold
       alert_on_bulk_operations=True,            # Alert on bulk operations
       bulk_operation_alert_threshold=10000,     # Bulk operation threshold
   )

Environment Configuration
-------------------------

All settings can be configured via environment variables using the ``SOFT_DELETE_`` prefix:

Environment Variables
~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   # Core settings
   export SOFT_DELETE_AUTO_FILTER=true
   export SOFT_DELETE_CASCADE_SOFT_DELETE=false
   export SOFT_DELETE_MAX_CASCADE_DEPTH=5
   
   # Retention settings
   export SOFT_DELETE_HARD_DELETE_AFTER_DAYS=90
   export SOFT_DELETE_ENABLE_AUTO_CLEANUP=false
   export SOFT_DELETE_CLEANUP_BATCH_SIZE=1000
   
   # Performance settings
   export SOFT_DELETE_BULK_OPERATION_BATCH_SIZE=2000
   export SOFT_DELETE_QUERY_TIMEOUT_SECONDS=60
   export SOFT_DELETE_ENABLE_QUERY_OPTIMIZATION=true
   
   # Audit settings
   export SOFT_DELETE_ENABLE_AUDIT_LOG=true
   export SOFT_DELETE_REQUIRE_DELETION_REASON=true
   export SOFT_DELETE_REQUIRE_DELETED_BY=true
   
   # Security settings
   export SOFT_DELETE_ENABLE_GDPR_COMPLIANCE=true
   export SOFT_DELETE_GDPR_HARD_DELETE_AFTER_DAYS=30
   
   # Monitoring settings
   export SOFT_DELETE_ENABLE_MONITORING=true
   export SOFT_DELETE_DELETION_RATIO_ALERT_THRESHOLD=0.25

Docker Configuration
~~~~~~~~~~~~~~~~~~~~

Configure via Docker environment:

.. code-block:: dockerfile

   # Dockerfile
   ENV SOFT_DELETE_AUTO_FILTER=true
   ENV SOFT_DELETE_HARD_DELETE_AFTER_DAYS=90
   ENV SOFT_DELETE_REQUIRE_DELETION_REASON=true

.. code-block:: yaml

   # docker-compose.yml
   services:
     app:
       environment:
         - SOFT_DELETE_AUTO_FILTER=true
         - SOFT_DELETE_HARD_DELETE_AFTER_DAYS=90
         - SOFT_DELETE_REQUIRE_DELETION_REASON=true

Configuration Validation
------------------------

The configuration system includes comprehensive validation:

Type Validation
~~~~~~~~~~~~~~~

.. code-block:: python

   # Type validation with helpful errors
   try:
       config = SoftDeleteConfig(
           bulk_operation_batch_size=0  # Invalid: must be >= 100
       )
   except ValueError as e:
       print(f"Configuration error: {e}")

Custom Validation
~~~~~~~~~~~~~~~~~

.. code-block:: python

   # Custom validation rules
   config = SoftDeleteConfig(
       cleanup_schedule_hours=[25]  # Invalid: hours must be 0-23
   )
   # Raises: ValueError: Cleanup hours must be between 0 and 23

Timezone Validation
~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   # Timezone validation
   config = SoftDeleteConfig(
       timezone="Invalid/Timezone"  # Invalid timezone
   )
   # Raises: ValueError: Invalid timezone: Invalid/Timezone

Runtime Configuration
---------------------

Global Configuration Access
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Access and update global configuration:

.. code-block:: python

   from src.project_name.core.soft_delete_config import (
       get_soft_delete_config, 
       update_soft_delete_config
   )
   
   # Get current global configuration
   config = get_soft_delete_config()
   print(f"Current batch size: {config.bulk_operation_batch_size}")
   
   # Update global configuration
   update_soft_delete_config(
       bulk_operation_batch_size=2000,
       require_deletion_reason=True
   )

Configuration Helpers
~~~~~~~~~~~~~~~~~~~~~

Use configuration helper methods:

.. code-block:: python

   config = SoftDeleteConfig()
   
   # Get configuration by category
   cleanup_settings = config.get_cleanup_settings()
   performance_settings = config.get_performance_settings()
   audit_settings = config.get_audit_settings()
   monitoring_settings = config.get_monitoring_settings()
   
   print(f"Cleanup enabled: {cleanup_settings['enabled']}")
   print(f"Retention days: {cleanup_settings['retention_days']}")

Operation Validation
~~~~~~~~~~~~~~~~~~~~

Validate operations against configuration:

.. code-block:: python

   config = SoftDeleteConfig(
       require_deleted_by=True,
       require_deletion_reason=True
   )
   
   # Validate operation before execution
   try:
       config.validate_operation(
           "soft_delete",
           deleted_by="admin",
           reason="User request"
       )
       print("✅ Operation valid")
   except ValueError as e:
       print(f"❌ Operation invalid: {e}")

Configuration Profiles
----------------------

Development Profile
~~~~~~~~~~~~~~~~~~~

Optimized for development environments:

.. code-block:: python

   development_config = SoftDeleteConfig(
       auto_filter=True,
       cascade_soft_delete=False,
       hard_delete_after_days=7,          # Short retention for testing
       enable_auto_cleanup=True,          # Auto cleanup for development
       require_deletion_reason=False,     # Not required in development
       debug_mode=True,                   # Enable debug logging
       skip_validation=False,             # Keep validation enabled
   )

Production Profile
~~~~~~~~~~~~~~~~~~

Optimized for production environments:

.. code-block:: python

   production_config = SoftDeleteConfig(
       auto_filter=True,
       cascade_soft_delete=True,
       hard_delete_after_days=2555,       # 7 years retention
       enable_auto_cleanup=True,
       require_deletion_reason=True,      # Required for compliance
       require_deleted_by=True,           # Required for audit
       enable_audit_log=True,             # Full audit logging
       enable_gdpr_compliance=True,       # GDPR compliance
       enable_monitoring=True,            # Full monitoring
       debug_mode=False,                  # Disable debug in production
   )

Testing Profile
~~~~~~~~~~~~~~~

Optimized for testing environments:

.. code-block:: python

   testing_config = SoftDeleteConfig(
       auto_filter=True,
       hard_delete_after_days=1,          # Very short retention
       enable_auto_cleanup=False,         # Manual cleanup in tests
       require_deletion_reason=False,     # Not required for tests
       debug_mode=True,                   # Enable debug for tests
       skip_validation=True,              # Skip validation for speed
       mock_external_services=True,       # Mock external services
   )

Configuration Examples
----------------------

Complete Configuration
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   # Complete production configuration example
   production_config = SoftDeleteConfig(
       # Core settings
       auto_filter=True,
       cascade_soft_delete=True,
       max_cascade_depth=5,
       
       # Retention and cleanup
       hard_delete_after_days=2555,       # 7 years
       enable_auto_cleanup=True,
       cleanup_batch_size=1000,
       cleanup_schedule_hours=[2, 14],     # 2 AM and 2 PM
       
       # Performance
       bulk_operation_batch_size=2000,
       query_timeout_seconds=60,
       enable_query_optimization=True,
       enable_partial_indexes=True,
       
       # Audit and compliance
       enable_audit_log=True,
       require_deletion_reason=True,
       require_deleted_by=True,
       audit_log_retention_days=2555,
       
       # Security
       enable_gdpr_compliance=True,
       gdpr_hard_delete_after_days=30,
       enable_encryption=True,
       
       # Monitoring
       enable_monitoring=True,
       alert_on_high_deletion_ratio=True,
       deletion_ratio_alert_threshold=0.25,
       alert_on_bulk_operations=True,
       bulk_operation_alert_threshold=10000,
       
       # Database
       timezone="UTC",
       enable_partial_indexes=True,
       index_deleted_records=True,
       
       # Error handling
       retry_failed_operations=True,
       max_retry_attempts=3,
       retry_delay_seconds=5,
   )

Environment-Specific Configuration
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   import os
   
   # Environment-specific configuration
   def get_environment_config():
       env = os.getenv("ENVIRONMENT", "development")
       
       if env == "production":
           return SoftDeleteConfig(
               hard_delete_after_days=2555,
               require_deletion_reason=True,
               enable_gdpr_compliance=True,
               enable_monitoring=True,
           )
       elif env == "staging":
           return SoftDeleteConfig(
               hard_delete_after_days=90,
               require_deletion_reason=True,
               enable_monitoring=True,
           )
       else:  # development
           return SoftDeleteConfig(
               hard_delete_after_days=7,
               require_deletion_reason=False,
               debug_mode=True,
           )

Configuration Migration
-----------------------

When upgrading configurations:

.. code-block:: python

   def migrate_configuration(old_config_dict):
       """Migrate old configuration to new format."""
       
       # Map old settings to new settings
       migration_map = {
           "auto_exclude_deleted": "auto_filter",
           "deletion_retention_days": "hard_delete_after_days",
           "enable_audit": "enable_audit_log",
       }
       
       new_config = {}
       for old_key, value in old_config_dict.items():
           new_key = migration_map.get(old_key, old_key)
           new_config[new_key] = value
       
       return SoftDeleteConfig(**new_config)

Best Practices
--------------

Configuration Management
~~~~~~~~~~~~~~~~~~~~~~~~

* **Environment Variables**: Use environment variables for deployment-specific settings
* **Validation**: Always validate configuration before deployment
* **Documentation**: Document all configuration changes
* **Testing**: Test configuration changes in staging environments
* **Monitoring**: Monitor configuration-dependent behavior

Security Considerations
~~~~~~~~~~~~~~~~~~~~~~~

* **Sensitive Settings**: Use secure methods for sensitive configuration
* **Access Control**: Limit access to configuration files
* **Audit Changes**: Log all configuration changes
* **Encryption**: Enable encryption for sensitive audit data

API Reference
-------------

For complete API documentation, see:

* :doc:`SoftDeleteConfig API <../api/config>`
* :doc:`Configuration Helpers <../api/config-helpers>`
* :doc:`Environment Integration <../api/environment>`
