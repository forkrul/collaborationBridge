Enhanced Soft Delete System
============================

The MVP template now includes a production-ready soft delete system with comprehensive audit trails, 
performance optimization, and enterprise-grade features.

.. note::
   **New in Version 2.0**: Complete rewrite of the soft delete system based on enterprise 
   requirements analysis. See the :doc:`migration guide <migration>` for upgrading from v1.x.

Overview
--------

The enhanced soft delete system provides:

* **Complete Audit Trail**: Track who deleted records, when, and why
* **Timezone Awareness**: Global application support with proper timezone handling
* **Performance Optimization**: Strategic database indexes for fast queries
* **Error Handling**: Comprehensive validation and meaningful error messages
* **Type Safety**: Full type annotations for better IDE support
* **GDPR Compliance**: Built-in support for data protection regulations

Key Features
------------

Audit Trail Fields
~~~~~~~~~~~~~~~~~~

Every soft-deleted record now includes comprehensive audit information:

.. code-block:: python

   class SoftDeleteMixin:
       deleted_at = Column(DateTime(timezone=True), nullable=True, index=True)
       deleted_by = Column(String(255), nullable=True)
       deletion_reason = Column(Text, nullable=True)
       is_deleted = Column(Boolean, default=False, index=True)

Enhanced API
~~~~~~~~~~~~

The soft delete API now supports audit parameters:

.. code-block:: python

   # Basic soft delete with audit trail
   user.soft_delete(
       deleted_by="admin",
       reason="User requested account deletion"
   )
   
   # Check deletion status
   if user.is_soft_deleted:
       print(f"Deleted by: {user.deleted_by}")
       print(f"Reason: {user.deletion_reason}")
       print(f"Deleted at: {user.deleted_at}")

Query Filtering
~~~~~~~~~~~~~~~

Enhanced query filtering methods for different use cases:

.. code-block:: python

   # Get only active records (default behavior)
   active_users = User.filter_active(session.query(User)).all()
   
   # Get only deleted records
   deleted_users = User.filter_deleted(session.query(User)).all()
   
   # Get all records (bypass soft delete filter)
   all_users = User.filter_with_deleted(session.query(User)).all()

Service Integration
~~~~~~~~~~~~~~~~~~~

The enhanced BaseService class provides seamless soft delete integration:

.. code-block:: python

   class UserService(BaseService):
       model = User
   
   # Service usage with audit trail
   await service.soft_delete(
       user_id=123,
       deleted_by="admin",
       reason="Policy violation",
       cascade=True  # Also delete related records
   )
   
   # Restore deleted records
   await service.restore(user_id=123)

Performance Features
--------------------

Database Indexes
~~~~~~~~~~~~~~~~

Strategic indexes are automatically created for optimal performance:

* **Active Records Index**: Fast filtering of non-deleted records
* **Deletion Timestamp Index**: Efficient cleanup operations
* **Deleted By Index**: Quick audit queries
* **Composite Index**: Optimized soft delete filtering

Query Optimization
~~~~~~~~~~~~~~~~~~

The system includes several performance optimizations:

* **Partial Indexes**: PostgreSQL partial indexes for better performance
* **Batch Processing**: Efficient bulk operations
* **Memory Management**: Constant memory usage regardless of dataset size

Configuration
-------------

The soft delete system is highly configurable:

.. code-block:: python

   from src.project_name.core.soft_delete_config import SoftDeleteConfig
   
   config = SoftDeleteConfig(
       auto_filter=True,                    # Automatically exclude deleted records
       cascade_soft_delete=False,           # Enable cascading deletes
       require_deletion_reason=True,        # Require reason for all deletions
       hard_delete_after_days=90,          # Retention period
       enable_audit_log=True               # Enable comprehensive logging
   )

Environment Configuration
~~~~~~~~~~~~~~~~~~~~~~~~~

Configuration can be set via environment variables:

.. code-block:: bash

   # Environment variables
   export SOFT_DELETE_AUTO_FILTER=true
   export SOFT_DELETE_REQUIRE_DELETION_REASON=true
   export SOFT_DELETE_HARD_DELETE_AFTER_DAYS=90

Migration Guide
---------------

Upgrading from v1.x
~~~~~~~~~~~~~~~~~~~~

1. **Run Database Migration**:

   .. code-block:: bash

      alembic upgrade head

2. **Update Code** (Optional - backward compatible):

   .. code-block:: python

      # Old way (still works)
      user.soft_delete()
      
      # New way (recommended)
      user.soft_delete(deleted_by="admin", reason="User request")

3. **Update Configuration**:

   Review and update your configuration settings to take advantage of new features.

Best Practices
--------------

Audit Trail Usage
~~~~~~~~~~~~~~~~~

Always provide audit information for compliance and debugging:

.. code-block:: python

   # Good: Comprehensive audit trail
   user.soft_delete(
       deleted_by="admin_user_123",
       reason="GDPR deletion request - ticket #456"
   )
   
   # Avoid: No audit information
   user.soft_delete()

Error Handling
~~~~~~~~~~~~~~

Handle soft delete errors appropriately:

.. code-block:: python

   try:
       user.soft_delete(deleted_by="admin", reason="Policy violation")
   except ValueError as e:
       if "already deleted" in str(e):
           logger.warning(f"User {user.id} already deleted")
       else:
           raise

Performance Considerations
~~~~~~~~~~~~~~~~~~~~~~~~~~

For large datasets, use bulk operations:

.. code-block:: python

   # For large deletions, use SoftDeleteManager
   from src.project_name.services.soft_delete_manager import SoftDeleteManager
   
   manager = SoftDeleteManager(session)
   deleted_count = await manager.bulk_soft_delete(
       User, user_ids, deleted_by="system", reason="Bulk cleanup"
   )

Examples
--------

Complete Example
~~~~~~~~~~~~~~~~

.. code-block:: python

   from sqlalchemy import Column, String
   from src.project_name.models.base import BaseModel
   from src.project_name.services.base_service import BaseService
   
   # Model with soft delete capability
   class User(BaseModel):
       __tablename__ = 'users'
       name = Column(String(100))
       email = Column(String(255))
   
   # Service with enhanced soft delete
   class UserService(BaseService):
       model = User
   
   # Usage
   async with AsyncSession(engine) as session:
       service = UserService(session)
       
       # Create user
       user = await service.create({
           "name": "John Doe",
           "email": "john@example.com"
       }, created_by="admin")
       
       # Soft delete with audit trail
       await service.soft_delete(
           user.id,
           deleted_by="admin",
           reason="User requested deletion",
           cascade=False
       )
       
       # Check deletion status
       deleted_user = await service.get_by_id(user.id, include_deleted=True)
       if deleted_user.is_soft_deleted:
           print(f"User deleted by: {deleted_user.deleted_by}")
           print(f"Reason: {deleted_user.deletion_reason}")
       
       # Restore if needed
       await service.restore(user.id)

API Reference
-------------

For complete API documentation, see:

* :doc:`SoftDeleteMixin API <../api/models>`
* :doc:`BaseService API <../api/services>`
* :doc:`SoftDeleteManager API <../api/managers>`
* :doc:`Configuration API <../api/config>`

.. toctree::
   :maxdepth: 2
   :hidden:

   migration
   performance
   troubleshooting
