Database Health Monitoring
===========================

The MVP template includes comprehensive database health monitoring capabilities for production 
environments, providing real-time insights into database performance, soft delete statistics, 
and optimization recommendations.

.. note::
   **Production Ready**: The health monitoring system is designed for production use with 
   minimal performance overhead and comprehensive reporting capabilities.

Overview
--------

The health monitoring system provides:

* **Connection Health**: Real-time database connectivity monitoring
* **Performance Metrics**: Response time tracking and optimization insights
* **Table Statistics**: Comprehensive analysis of soft delete patterns
* **Index Optimization**: Recommendations for database performance improvements
* **Health Reports**: Detailed reports with actionable recommendations
* **Alerting Integration**: Configurable thresholds and notifications

DatabaseHealthChecker
---------------------

The ``DatabaseHealthChecker`` class provides comprehensive health monitoring:

Basic Usage
~~~~~~~~~~~

.. code-block:: python

   from src.project_name.utils.database_utils import DatabaseHealthChecker
   
   async with AsyncSession(engine) as session:
       health_checker = DatabaseHealthChecker(session)
       
       # Quick connection check
       connection_status = await health_checker.check_connection()
       
       if connection_status["connected"]:
           print(f"Database connected - Response time: {connection_status['response_time_ms']}ms")
       else:
           print(f"Database connection failed: {connection_status['error']}")

Connection Monitoring
~~~~~~~~~~~~~~~~~~~~~

Monitor database connectivity and performance:

.. code-block:: python

   # Detailed connection analysis
   connection_status = await health_checker.check_connection()
   
   print(f"Connected: {connection_status['connected']}")
   print(f"Response Time: {connection_status['response_time_ms']}ms")
   print(f"Status: {connection_status['status']}")  # healthy, slow, or unhealthy
   
   # Status interpretation
   if connection_status['status'] == 'healthy':
       print("✅ Database performing well")
   elif connection_status['status'] == 'slow':
       print("⚠️ Database responding slowly")
   else:
       print("❌ Database connection issues")

Table Statistics
~~~~~~~~~~~~~~~~

Analyze soft delete patterns and table health:

.. code-block:: python

   # Get comprehensive table statistics
   table_stats = await health_checker.get_table_statistics(User)
   
   print(f"Table: {table_stats['table']}")
   print(f"Active records: {table_stats['active_records']:,}")
   print(f"Deleted records: {table_stats['deleted_records']:,}")
   print(f"Total records: {table_stats['total_records']:,}")
   print(f"Deletion ratio: {table_stats['deletion_ratio_percent']:.1f}%")
   print(f"Old deleted records: {table_stats['old_deleted_records']:,}")
   print(f"Health status: {table_stats['health_status']}")
   
   # Check if cleanup is recommended
   if table_stats['cleanup_recommended']:
       print("🧹 Cleanup of old deleted records recommended")

Index Analysis
~~~~~~~~~~~~~~

Check soft delete index configuration:

.. code-block:: python

   # Analyze index configuration
   index_status = await health_checker.check_soft_delete_indexes(User)
   
   print(f"Table: {index_status['table']}")
   print(f"Indexes found: {index_status['indexes_found']}")
   print(f"Missing indexes: {index_status['missing_indexes']}")
   
   # Show recommendations
   if index_status['recommendations']:
       print("📊 Index Recommendations:")
       for rec in index_status['recommendations']:
           print(f"  - {rec}")

Comprehensive Health Reports
----------------------------

Generate detailed health reports for multiple models:

.. code-block:: python

   # Generate comprehensive health report
   models_to_check = [User, Post, Comment, Order]
   
   health_report = await health_checker.get_health_report(models_to_check)
   
   print(f"🏥 Health Report - {health_report['timestamp']}")
   print(f"Overall Health: {health_report['overall_health']}")
   print(f"System Healthy: {health_report['healthy']}")
   
   # Connection details
   conn = health_report['connection']
   print(f"\n🔌 Connection Status:")
   print(f"  Connected: {conn['connected']}")
   print(f"  Response Time: {conn['response_time_ms']}ms")
   
   # Table analysis
   print(f"\n📊 Table Analysis:")
   for table in health_report['tables']:
       print(f"  {table['table']}:")
       print(f"    Active: {table['active_records']:,}")
       print(f"    Deleted: {table['deleted_records']:,}")
       print(f"    Health: {table['health_status']}")
   
   # Recommendations
   if health_report['recommendations']:
       print(f"\n💡 Recommendations:")
       for rec in health_report['recommendations']:
           print(f"  - {rec}")

Health Assessment
-----------------

The system provides intelligent health assessment based on multiple factors:

Health Status Levels
~~~~~~~~~~~~~~~~~~~~

* **Good**: Optimal performance, low deletion ratio, proper indexes
* **Fair**: Acceptable performance, moderate issues, cleanup recommended
* **Poor**: Performance issues, high deletion ratio, missing indexes
* **Unknown**: Unable to assess due to errors

Assessment Criteria
~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   # Health assessment factors
   def assess_table_health(deletion_ratio, old_deleted_count):
       if deletion_ratio > 50:
           return "poor - high deletion ratio"
       elif old_deleted_count > 10000:
           return "poor - too many old deleted records"
       elif deletion_ratio > 25 or old_deleted_count > 1000:
           return "fair - cleanup recommended"
       else:
           return "good"

Monitoring Integration
----------------------

Service Integration
~~~~~~~~~~~~~~~~~~~

Integrate health monitoring with your services:

.. code-block:: python

   class UserService(BaseService):
       model = User
       
       async def get_health_status(self):
           """Get health status for the user service."""
           health_checker = DatabaseHealthChecker(self.session)
           
           # Get service-specific health information
           table_stats = await health_checker.get_table_statistics(self.model)
           connection_status = await health_checker.check_connection()
           
           return {
               "service": "UserService",
               "table_health": table_stats,
               "connection_health": connection_status,
               "recommendations": self._get_recommendations(table_stats)
           }
       
       def _get_recommendations(self, stats):
           recommendations = []
           
           if stats['deletion_ratio_percent'] > 25:
               recommendations.append("Consider cleanup of deleted records")
           
           if stats['old_deleted_records'] > 1000:
               recommendations.append("Archive old deleted records")
           
           return recommendations

Automated Monitoring
~~~~~~~~~~~~~~~~~~~~

Set up automated health checks:

.. code-block:: python

   import asyncio
   from datetime import datetime
   
   async def automated_health_check():
       """Automated health check that runs periodically."""
       async with AsyncSession(engine) as session:
           health_checker = DatabaseHealthChecker(session)
           
           # Check all critical models
           models = [User, Post, Order, Payment]
           report = await health_checker.get_health_report(models)
           
           # Log health status
           logger.info("Health check completed", extra={
               "overall_health": report['overall_health'],
               "healthy": report['healthy'],
               "timestamp": report['timestamp']
           })
           
           # Send alerts if unhealthy
           if not report['healthy']:
               await send_health_alert(report)
           
           return report
   
   # Schedule health checks
   async def schedule_health_checks():
       while True:
           try:
               await automated_health_check()
           except Exception as e:
               logger.error(f"Health check failed: {e}")
           
           # Wait 5 minutes before next check
           await asyncio.sleep(300)

Configuration
-------------

Health Monitoring Configuration
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Configure monitoring behavior:

.. code-block:: python

   from src.project_name.core.soft_delete_config import SoftDeleteConfig
   
   config = SoftDeleteConfig(
       enable_monitoring=True,                    # Enable monitoring
       alert_on_high_deletion_ratio=True,        # Alert on high deletion ratios
       deletion_ratio_alert_threshold=0.25,      # 25% deletion ratio threshold
       alert_on_bulk_operations=True,            # Alert on large operations
       bulk_operation_alert_threshold=10000      # Alert threshold for bulk ops
   )

Environment Configuration
~~~~~~~~~~~~~~~~~~~~~~~~~

Set monitoring configuration via environment:

.. code-block:: bash

   export SOFT_DELETE_ENABLE_MONITORING=true
   export SOFT_DELETE_ALERT_ON_HIGH_DELETION_RATIO=true
   export SOFT_DELETE_DELETION_RATIO_ALERT_THRESHOLD=0.25

Alerting and Notifications
--------------------------

Alert Configuration
~~~~~~~~~~~~~~~~~~~

Set up intelligent alerting:

.. code-block:: python

   async def send_health_alert(health_report):
       """Send health alert based on report."""
       alert_data = {
           "timestamp": health_report['timestamp'],
           "overall_health": health_report['overall_health'],
           "issues": []
       }
       
       # Collect specific issues
       for table in health_report['tables']:
           if table['health_status'].startswith('poor'):
               alert_data['issues'].append({
                   "table": table['table'],
                   "issue": table['health_status'],
                   "deletion_ratio": table.get('deletion_ratio_percent', 0)
               })
       
       # Send to monitoring system
       await monitoring_system.send_alert(alert_data)

Threshold-Based Alerts
~~~~~~~~~~~~~~~~~~~~~~

Configure automatic alerts based on thresholds:

.. code-block:: python

   # Alert conditions
   ALERT_CONDITIONS = {
       "high_deletion_ratio": 25.0,      # Alert if > 25% deleted
       "slow_response_time": 100.0,      # Alert if > 100ms response
       "old_deleted_records": 10000,     # Alert if > 10k old deleted records
       "connection_failure": True        # Alert on any connection failure
   }
   
   async def check_alert_conditions(health_report):
       alerts = []
       
       # Check connection
       if not health_report['connection']['connected']:
           alerts.append("Database connection failure")
       
       # Check response time
       response_time = health_report['connection'].get('response_time_ms', 0)
       if response_time > ALERT_CONDITIONS['slow_response_time']:
           alerts.append(f"Slow database response: {response_time}ms")
       
       # Check table conditions
       for table in health_report['tables']:
           ratio = table.get('deletion_ratio_percent', 0)
           if ratio > ALERT_CONDITIONS['high_deletion_ratio']:
               alerts.append(f"High deletion ratio in {table['table']}: {ratio}%")
       
       return alerts

Performance Optimization
------------------------

Monitoring Performance
~~~~~~~~~~~~~~~~~~~~~~

The health monitoring system is designed for minimal overhead:

.. code-block:: python

   # Lightweight health check for frequent monitoring
   async def lightweight_health_check():
       """Quick health check with minimal overhead."""
       async with AsyncSession(engine) as session:
           health_checker = DatabaseHealthChecker(session)
           
           # Only check connection (fastest check)
           connection_status = await health_checker.check_connection()
           
           return {
               "connected": connection_status['connected'],
               "response_time": connection_status['response_time_ms'],
               "timestamp": datetime.now().isoformat()
           }

Caching
~~~~~~~

Cache health check results for better performance:

.. code-block:: python

   from functools import lru_cache
   from datetime import datetime, timedelta
   
   class CachedHealthChecker:
       def __init__(self, session, cache_duration=300):  # 5 minutes
           self.health_checker = DatabaseHealthChecker(session)
           self.cache_duration = cache_duration
           self._cache = {}
       
       async def get_cached_health_report(self, models):
           cache_key = tuple(model.__name__ for model in models)
           now = datetime.now()
           
           # Check cache
           if cache_key in self._cache:
               cached_time, cached_report = self._cache[cache_key]
               if now - cached_time < timedelta(seconds=self.cache_duration):
                   return cached_report
           
           # Generate new report
           report = await self.health_checker.get_health_report(models)
           self._cache[cache_key] = (now, report)
           
           return report

Examples
--------

Complete Monitoring Setup
~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   import asyncio
   from datetime import datetime
   from src.project_name.utils.database_utils import DatabaseHealthChecker
   
   async def comprehensive_monitoring_example():
       """Complete example of database health monitoring."""
       
       async with AsyncSession(engine) as session:
           health_checker = DatabaseHealthChecker(session)
           
           print("🏥 Database Health Monitoring Example")
           print("=" * 50)
           
           # 1. Quick connection check
           print("\n1. Connection Health Check:")
           connection = await health_checker.check_connection()
           print(f"   Connected: {connection['connected']}")
           print(f"   Response Time: {connection['response_time_ms']}ms")
           print(f"   Status: {connection['status']}")
           
           # 2. Table statistics
           print("\n2. Table Statistics:")
           models = [User, Post, Comment]
           
           for model in models:
               stats = await health_checker.get_table_statistics(model)
               print(f"   {stats['table']}:")
               print(f"     Active: {stats['active_records']:,}")
               print(f"     Deleted: {stats['deleted_records']:,}")
               print(f"     Health: {stats['health_status']}")
           
           # 3. Index analysis
           print("\n3. Index Analysis:")
           for model in models:
               indexes = await health_checker.check_soft_delete_indexes(model)
               print(f"   {indexes['table']}:")
               print(f"     Found: {indexes['indexes_found']}")
               if indexes['missing_indexes']:
                   print(f"     Missing: {indexes['missing_indexes']}")
           
           # 4. Comprehensive report
           print("\n4. Comprehensive Health Report:")
           report = await health_checker.get_health_report(models)
           print(f"   Overall Health: {report['overall_health']}")
           print(f"   System Healthy: {report['healthy']}")
           
           if report['recommendations']:
               print("   Recommendations:")
               for rec in report['recommendations']:
                   print(f"     - {rec}")
   
   # Run the monitoring example
   asyncio.run(comprehensive_monitoring_example())

API Reference
-------------

For complete API documentation, see:

* :doc:`DatabaseHealthChecker API <../api/utils>`
* :doc:`Health Monitoring Configuration <../api/config>`
* :doc:`Monitoring Integration Examples <../api/examples>`
