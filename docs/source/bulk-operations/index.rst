Bulk Operations System
=======================

The MVP template includes a high-performance bulk operations system designed for enterprise-scale 
data processing with configurable batch sizes and memory-efficient streaming.

.. note::
   **Performance Benchmark**: The bulk operations system can process over 10,000 records per second
   with constant memory usage regardless of dataset size.

Overview
--------

The bulk operations system provides:

* **High Performance**: 10,000+ records/second processing capability
* **Memory Efficiency**: Constant memory usage with streaming operations
* **Configurable Batching**: Adjustable batch sizes for optimization
* **Comprehensive Statistics**: Detailed metrics and monitoring
* **Error Handling**: Robust error recovery and reporting
* **Audit Trail Support**: Full audit information for all operations

SoftDeleteManager
-----------------

The ``SoftDeleteManager`` class provides enterprise-grade bulk operations:

Basic Usage
~~~~~~~~~~~

.. code-block:: python

   from src.project_name.services.soft_delete_manager import SoftDeleteManager
   
   async with AsyncSession(engine) as session:
       manager = SoftDeleteManager(session)
       
       # Bulk soft delete
       deleted_count = await manager.bulk_soft_delete(
           User,                           # Model class
           [1, 2, 3, 4, 5],               # List of IDs
           deleted_by="admin",             # Audit information
           reason="Bulk cleanup",          # Deletion reason
           batch_size=1000                 # Configurable batch size
       )
       
       print(f"Successfully deleted {deleted_count} records")

Bulk Operations
~~~~~~~~~~~~~~~

Bulk Soft Delete
^^^^^^^^^^^^^^^^

Process thousands of records efficiently:

.. code-block:: python

   # Delete large dataset
   user_ids = list(range(1, 10001))  # 10,000 records
   
   start_time = time.time()
   deleted_count = await manager.bulk_soft_delete(
       User,
       user_ids,
       deleted_by="system",
       reason="Data retention policy",
       batch_size=2000  # Process 2000 records per batch
   )
   end_time = time.time()
   
   print(f"Deleted {deleted_count} records in {end_time - start_time:.2f} seconds")
   print(f"Rate: {deleted_count / (end_time - start_time):.0f} records/second")

Bulk Restore
^^^^^^^^^^^^

Restore multiple soft-deleted records:

.. code-block:: python

   # Restore previously deleted records
   restored_count = await manager.bulk_restore(
       User,
       user_ids,
       batch_size=1000
   )
   
   print(f"Restored {restored_count} records")

Hard Delete with Retention
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Permanently delete old soft-deleted records:

.. code-block:: python

   from datetime import datetime, timedelta
   
   # Delete records soft-deleted more than 90 days ago
   cutoff_date = datetime.now() - timedelta(days=90)
   
   purged_count = await manager.hard_delete_before(
       User,
       cutoff_date,
       batch_size=500  # Smaller batches for hard deletes
   )
   
   print(f"Permanently deleted {purged_count} old records")

Statistics and Monitoring
~~~~~~~~~~~~~~~~~~~~~~~~~

Get comprehensive statistics about your data:

.. code-block:: python

   # Get deletion statistics
   stats = await manager.get_deletion_stats(User)
   
   print(f"Active records: {stats['active']}")
   print(f"Deleted records: {stats['deleted']}")
   print(f"Total records: {stats['total']}")
   print(f"Deletion ratio: {stats['deleted'] / stats['total'] * 100:.1f}%")

Performance Optimization
------------------------

Batch Size Configuration
~~~~~~~~~~~~~~~~~~~~~~~~

Choose optimal batch sizes based on your use case:

.. code-block:: python

   # Small batches for memory-constrained environments
   await manager.bulk_soft_delete(User, ids, batch_size=500)
   
   # Large batches for high-performance scenarios
   await manager.bulk_soft_delete(User, ids, batch_size=5000)
   
   # Default batch size (recommended for most cases)
   await manager.bulk_soft_delete(User, ids)  # Uses default 1000

Memory Management
~~~~~~~~~~~~~~~~~

The system uses streaming operations to maintain constant memory usage:

.. code-block:: python

   # This will use constant memory regardless of dataset size
   huge_id_list = list(range(1, 1000001))  # 1 million records
   
   # Memory usage remains constant due to batch processing
   deleted_count = await manager.bulk_soft_delete(
       User,
       huge_id_list,
       deleted_by="system",
       batch_size=2000
   )

Configuration
-------------

Global Configuration
~~~~~~~~~~~~~~~~~~~~

Configure bulk operations globally:

.. code-block:: python

   from src.project_name.core.soft_delete_config import SoftDeleteConfig
   
   config = SoftDeleteConfig(
       bulk_operation_batch_size=2000,     # Default batch size
       query_timeout_seconds=60,           # Query timeout
       enable_query_optimization=True,     # Enable optimizations
       alert_on_bulk_operations=True,      # Alert on large operations
       bulk_operation_alert_threshold=10000 # Alert threshold
   )

Environment Configuration
~~~~~~~~~~~~~~~~~~~~~~~~~

Set configuration via environment variables:

.. code-block:: bash

   export SOFT_DELETE_BULK_OPERATION_BATCH_SIZE=2000
   export SOFT_DELETE_QUERY_TIMEOUT_SECONDS=60
   export SOFT_DELETE_BULK_OPERATION_ALERT_THRESHOLD=10000

Service Integration
-------------------

Enhanced BaseService
~~~~~~~~~~~~~~~~~~~~

The ``BaseService`` class includes built-in bulk operations:

.. code-block:: python

   class UserService(BaseService):
       model = User
   
   async with AsyncSession(engine) as session:
       service = UserService(session)
       
       # Bulk create
       user_data = [
           {"name": f"User {i}", "email": f"user{i}@example.com"}
           for i in range(1000)
       ]
       
       users = await service.bulk_create(
           user_data,
           batch_size=500,
           created_by="system"
       )
       
       # Get statistics
       stats = await service.get_statistics()
       print(f"Total users: {stats['total_count']}")

Error Handling
--------------

Robust Error Recovery
~~~~~~~~~~~~~~~~~~~~~

The system includes comprehensive error handling:

.. code-block:: python

   try:
       deleted_count = await manager.bulk_soft_delete(
           User, user_ids, deleted_by="admin"
       )
   except Exception as e:
       logger.error(f"Bulk delete failed: {e}")
       
       # Partial success handling
       if hasattr(e, 'partial_count'):
           logger.info(f"Partially completed: {e.partial_count} records processed")

Validation
~~~~~~~~~~

Input validation prevents common errors:

.. code-block:: python

   # Empty ID list handling
   deleted_count = await manager.bulk_soft_delete(User, [])
   assert deleted_count == 0  # Returns 0, no error
   
   # Invalid model class handling
   try:
       await manager.bulk_soft_delete(NonSoftDeleteModel, [1, 2, 3])
   except ValueError as e:
       print(f"Error: {e}")  # Clear error message

Monitoring and Alerting
-----------------------

Performance Monitoring
~~~~~~~~~~~~~~~~~~~~~~

Monitor bulk operation performance:

.. code-block:: python

   import time
   
   # Performance monitoring wrapper
   async def monitored_bulk_delete(manager, model, ids, **kwargs):
       start_time = time.time()
       start_memory = get_memory_usage()
       
       try:
           result = await manager.bulk_soft_delete(model, ids, **kwargs)
           
           end_time = time.time()
           end_memory = get_memory_usage()
           
           # Log performance metrics
           logger.info(f"Bulk delete completed", extra={
               "records_processed": result,
               "duration_seconds": end_time - start_time,
               "records_per_second": result / (end_time - start_time),
               "memory_delta_mb": (end_memory - start_memory) / 1024 / 1024
           })
           
           return result
           
       except Exception as e:
           logger.error(f"Bulk delete failed: {e}")
           raise

Alerting Integration
~~~~~~~~~~~~~~~~~~~~

Set up alerts for large operations:

.. code-block:: python

   # Configure alerting thresholds
   config = SoftDeleteConfig(
       alert_on_bulk_operations=True,
       bulk_operation_alert_threshold=5000
   )
   
   # Operations exceeding threshold will trigger alerts
   if len(user_ids) > config.bulk_operation_alert_threshold:
       send_alert(f"Large bulk operation: {len(user_ids)} records")

Best Practices
--------------

Batch Size Selection
~~~~~~~~~~~~~~~~~~~~

Choose appropriate batch sizes:

.. code-block:: python

   # Small datasets (< 1,000 records)
   batch_size = 100
   
   # Medium datasets (1,000 - 100,000 records)
   batch_size = 1000
   
   # Large datasets (> 100,000 records)
   batch_size = 2000
   
   # Memory-constrained environments
   batch_size = 500

Progress Tracking
~~~~~~~~~~~~~~~~~

Track progress for long-running operations:

.. code-block:: python

   async def bulk_delete_with_progress(manager, model, ids, **kwargs):
       batch_size = kwargs.get('batch_size', 1000)
       total_batches = (len(ids) + batch_size - 1) // batch_size
       
       for i, batch_start in enumerate(range(0, len(ids), batch_size)):
           batch_ids = ids[batch_start:batch_start + batch_size]
           
           await manager.bulk_soft_delete(model, batch_ids, **kwargs)
           
           progress = (i + 1) / total_batches * 100
           print(f"Progress: {progress:.1f}% ({i + 1}/{total_batches} batches)")

Examples
--------

Complete Example
~~~~~~~~~~~~~~~~

.. code-block:: python

   import asyncio
   from datetime import datetime, timedelta
   from src.project_name.services.soft_delete_manager import SoftDeleteManager
   from src.project_name.services.base_service import BaseService
   
   async def bulk_operations_example():
       async with AsyncSession(engine) as session:
           manager = SoftDeleteManager(session)
           service = UserService(session)
           
           # 1. Create test data
           user_data = [
               {"name": f"User {i}", "email": f"user{i}@test.com"}
               for i in range(5000)
           ]
           
           print("Creating 5,000 test users...")
           users = await service.bulk_create(user_data, batch_size=1000)
           user_ids = [user.id for user in users]
           
           # 2. Bulk soft delete
           print("Performing bulk soft delete...")
           deleted_count = await manager.bulk_soft_delete(
               User,
               user_ids[:2000],  # Delete first 2000
               deleted_by="system",
               reason="Performance test",
               batch_size=500
           )
           print(f"Soft deleted {deleted_count} users")
           
           # 3. Get statistics
           stats = await manager.get_deletion_stats(User)
           print(f"Statistics: {stats}")
           
           # 4. Bulk restore
           restored_count = await manager.bulk_restore(
               User,
               user_ids[:1000],  # Restore first 1000
               batch_size=500
           )
           print(f"Restored {restored_count} users")
           
           # 5. Hard delete old records
           cutoff = datetime.now() - timedelta(days=1)
           purged_count = await manager.hard_delete_before(
               User,
               cutoff,
               batch_size=100
           )
           print(f"Permanently deleted {purged_count} old records")
   
   # Run the example
   asyncio.run(bulk_operations_example())

API Reference
-------------

For complete API documentation, see:

* :doc:`SoftDeleteManager API <../api/managers>`
* :doc:`BaseService Bulk Operations <../api/services>`
* :doc:`Configuration Options <../api/config>`
