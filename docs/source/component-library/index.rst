Reusable Component Library
===========================

The MVP template includes a comprehensive library of reusable components designed for cross-project 
efficiency and consistent implementation patterns across multiple MVP projects.

.. note::
   **Modular Design**: All components are designed with clear interfaces and minimal dependencies, 
   making them easy to extract and reuse in other projects.

Overview
--------

The component library provides:

* **Database Components**: Enhanced models, mixins, and utilities
* **Service Layer Components**: Base services and managers
* **Configuration Components**: Flexible configuration management
* **Utility Components**: Health monitoring, diagnostics, and helpers
* **Clear Interfaces**: Well-defined APIs for easy integration
* **Comprehensive Documentation**: Usage examples and best practices

Component Categories
--------------------

Database Components
~~~~~~~~~~~~~~~~~~~

**BaseModel**
  Enhanced base model with automatic timestamps and soft delete capability

**SoftDeleteMixin**
  Production-ready soft delete functionality with audit trails

**TimestampMixin**
  Automatic timestamp tracking for created_at and updated_at fields

Service Layer Components
~~~~~~~~~~~~~~~~~~~~~~~~

**BaseService**
  Enhanced service base class with advanced CRUD operations

**SoftDeleteManager**
  High-performance bulk operations manager

Utility Components
~~~~~~~~~~~~~~~~~~

**DatabaseHealthChecker**
  Comprehensive database health monitoring and diagnostics

**CascadingSoftDeleteManager**
  Relationship-aware cascading soft delete operations

Configuration Components
~~~~~~~~~~~~~~~~~~~~~~~~

**SoftDeleteConfig**
  Comprehensive configuration management with environment support

Component Registry
-------------------

The library includes a component registry for discovery and documentation:

.. code-block:: python

   from src.project_name.components import get_component_info, list_components
   
   # Get information about a specific component
   info = get_component_info("BaseModel")
   print(info["description"])
   print(info["features"])
   print(info["usage"])
   
   # List all available components
   all_components = list_components()
   
   # List components by category
   db_components = list_components("database")

Quick Start Guide
-----------------

Basic Setup
~~~~~~~~~~~

.. code-block:: python

   # Import core components
   from src.project_name.components import (
       BaseModel,
       BaseService,
       SoftDeleteManager,
       DatabaseHealthChecker,
       SoftDeleteConfig
   )

Model Setup
~~~~~~~~~~~

Create models using the enhanced base classes:

.. code-block:: python

   from sqlalchemy import Column, String, Integer, ForeignKey
   from sqlalchemy.orm import relationship
   from src.project_name.components import BaseModel
   
   class User(BaseModel):
       __tablename__ = 'users'
       
       name = Column(String(100), nullable=False)
       email = Column(String(255), nullable=False, unique=True)
       
       # Automatic features from BaseModel:
       # - id (primary key)
       # - created_at, updated_at (timestamps)
       # - deleted_at, deleted_by, deletion_reason, is_deleted (soft delete)
   
   class Post(BaseModel):
       __tablename__ = 'posts'
       
       title = Column(String(200), nullable=False)
       content = Column(String(5000))
       user_id = Column(Integer, ForeignKey('users.id'))
       
       user = relationship("User", back_populates="posts")

Service Setup
~~~~~~~~~~~~~

Create services using the enhanced base service:

.. code-block:: python

   from src.project_name.components import BaseService
   
   class UserService(BaseService):
       model = User
   
   class PostService(BaseService):
       model = Post
   
   # Usage
   async with AsyncSession(engine) as session:
       user_service = UserService(session)
       
       # Enhanced CRUD operations
       user = await user_service.create({
           "name": "John Doe",
           "email": "john@example.com"
       }, created_by="admin")
       
       # Paginated queries
       users = await user_service.get_active_paginated(page=1, size=10)
       
       # Soft delete with audit trail
       await user_service.soft_delete(
           user.id,
           deleted_by="admin",
           reason="User requested deletion"
       )

Bulk Operations
~~~~~~~~~~~~~~~

Use the bulk operations manager for high-performance operations:

.. code-block:: python

   from src.project_name.components import SoftDeleteManager
   
   async with AsyncSession(engine) as session:
       manager = SoftDeleteManager(session)
       
       # Bulk soft delete
       deleted_count = await manager.bulk_soft_delete(
           User,
           [1, 2, 3, 4, 5],
           deleted_by="system",
           reason="Bulk cleanup"
       )
       
       # Get statistics
       stats = await manager.get_deletion_stats(User)

Health Monitoring
~~~~~~~~~~~~~~~~~

Monitor database health and performance:

.. code-block:: python

   from src.project_name.components import DatabaseHealthChecker
   
   async with AsyncSession(engine) as session:
       health_checker = DatabaseHealthChecker(session)
       
       # Quick health check
       connection_status = await health_checker.check_connection()
       
       # Comprehensive health report
       report = await health_checker.get_health_report([User, Post])

Configuration
~~~~~~~~~~~~~

Configure component behavior:

.. code-block:: python

   from src.project_name.components import SoftDeleteConfig, update_soft_delete_config
   
   # Create configuration
   config = SoftDeleteConfig(
       auto_filter=True,
       require_deletion_reason=True,
       hard_delete_after_days=90
   )
   
   # Update global configuration
   update_soft_delete_config(
       cascade_soft_delete=True,
       enable_audit_log=True
   )

Component Features
------------------

BaseModel Features
~~~~~~~~~~~~~~~~~~

The enhanced BaseModel provides:

* **Automatic ID**: UUID or integer primary key
* **Timestamps**: created_at and updated_at with server defaults
* **Soft Delete**: Complete soft delete functionality with audit trails
* **Type Safety**: Full type annotations for better IDE support
* **Validation**: Built-in validation and error handling

.. code-block:: python

   class Product(BaseModel):
       __tablename__ = 'products'
       
       name = Column(String(200))
       price = Column(Numeric(10, 2))
   
   # Automatic features available:
   product = Product(name="Widget", price=19.99)
   
   # Timestamps (automatic)
   print(product.created_at)  # Set automatically
   print(product.updated_at)  # Updated automatically
   
   # Soft delete with audit trail
   product.soft_delete(deleted_by="admin", reason="Discontinued")
   print(product.is_soft_deleted)  # True
   print(product.deleted_by)       # "admin"
   print(product.deletion_reason)  # "Discontinued"

BaseService Features
~~~~~~~~~~~~~~~~~~~~

The enhanced BaseService provides:

* **Advanced CRUD**: Create, read, update, delete with audit support
* **Bulk Operations**: High-performance bulk create and update
* **Pagination**: Built-in pagination with filtering and sorting
* **Soft Delete Integration**: Seamless soft delete operations
* **Statistics**: Comprehensive statistics and monitoring

.. code-block:: python

   class ProductService(BaseService):
       model = Product
   
   async with AsyncSession(engine) as session:
       service = ProductService(session)
       
       # Bulk create
       products = await service.bulk_create([
           {"name": "Widget A", "price": 19.99},
           {"name": "Widget B", "price": 29.99}
       ], created_by="admin")
       
       # Paginated query with filters
       result = await service.get_active_paginated(
           page=1,
           size=10,
           filters={"price": 19.99},
           order_by="name"
       )
       
       # Statistics
       stats = await service.get_statistics()

Cross-Project Usage
-------------------

Extracting Components
~~~~~~~~~~~~~~~~~~~~~

Components are designed for easy extraction to other projects:

.. code-block:: python

   # Copy the component files to your new project
   cp -r src/project_name/components/ new_project/src/components/
   cp -r src/project_name/models/base.py new_project/src/models/
   cp -r src/project_name/services/base_service.py new_project/src/services/
   
   # Update imports in your new project
   from new_project.components import BaseModel, BaseService

Customization
~~~~~~~~~~~~~

Components can be easily customized for specific project needs:

.. code-block:: python

   # Extend BaseModel for project-specific features
   class ProjectBaseModel(BaseModel):
       __abstract__ = True
       
       # Add project-specific fields
       tenant_id = Column(String(50), nullable=True)
       
       def get_tenant_context(self):
           return {"tenant_id": self.tenant_id}
   
   # Extend BaseService for project-specific behavior
   class ProjectBaseService(BaseService):
       def __init__(self, session, tenant_id=None):
           super().__init__(session)
           self.tenant_id = tenant_id
       
       async def create(self, data, **kwargs):
           # Add tenant context
           if self.tenant_id:
               data["tenant_id"] = self.tenant_id
           return await super().create(data, **kwargs)

Best Practices
--------------

Component Design
~~~~~~~~~~~~~~~~

When creating new components:

* **Single Responsibility**: Each component should have a clear, single purpose
* **Clear Interfaces**: Define clear APIs with type hints and documentation
* **Minimal Dependencies**: Reduce coupling between components
* **Configuration**: Make components configurable for different use cases
* **Testing**: Include comprehensive tests with each component

Usage Patterns
~~~~~~~~~~~~~~

Recommended usage patterns:

.. code-block:: python

   # Good: Use dependency injection
   class OrderService(BaseService):
       model = Order
       
       def __init__(self, session, user_service=None):
           super().__init__(session)
           self.user_service = user_service or UserService(session)
   
   # Good: Use composition over inheritance
   class ComplexService:
       def __init__(self, session):
           self.user_service = UserService(session)
           self.order_service = OrderService(session)
           self.health_checker = DatabaseHealthChecker(session)
   
   # Good: Configure components appropriately
   config = SoftDeleteConfig(
       auto_filter=True,
       require_deletion_reason=True
   )

Documentation
~~~~~~~~~~~~~

Each component includes comprehensive documentation:

.. code-block:: python

   # Get usage examples
   from src.project_name.components import get_usage_examples
   
   examples = get_usage_examples()
   print(examples["BaseModel"])
   print(examples["BaseService"])

Validation
~~~~~~~~~~

Validate component setup:

.. code-block:: python

   from src.project_name.components import validate_component_setup
   
   # Check that all components are properly configured
   validation_results = validate_component_setup()
   
   if validation_results["valid"]:
       print("✅ All components configured correctly")
   else:
       print("❌ Component issues found:")
       for issue in validation_results["issues"]:
           print(f"  - {issue}")

Examples
--------

Complete Project Setup
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: python

   # Complete example of setting up a new project with components
   
   from sqlalchemy import Column, String, Integer, ForeignKey, Numeric
   from sqlalchemy.orm import relationship
   from src.project_name.components import (
       BaseModel, BaseService, SoftDeleteManager, 
       DatabaseHealthChecker, SoftDeleteConfig
   )
   
   # 1. Define models using BaseModel
   class Customer(BaseModel):
       __tablename__ = 'customers'
       
       name = Column(String(100), nullable=False)
       email = Column(String(255), nullable=False, unique=True)
       phone = Column(String(20))
   
   class Order(BaseModel):
       __tablename__ = 'orders'
       
       order_number = Column(String(50), nullable=False, unique=True)
       total_amount = Column(Numeric(10, 2), nullable=False)
       customer_id = Column(Integer, ForeignKey('customers.id'))
       
       customer = relationship("Customer", back_populates="orders")
   
   # 2. Create services using BaseService
   class CustomerService(BaseService):
       model = Customer
   
   class OrderService(BaseService):
       model = Order
   
   # 3. Configure the system
   config = SoftDeleteConfig(
       auto_filter=True,
       require_deletion_reason=True,
       enable_audit_log=True
   )
   
   # 4. Use the components
   async def main():
       async with AsyncSession(engine) as session:
           customer_service = CustomerService(session)
           order_service = OrderService(session)
           health_checker = DatabaseHealthChecker(session)
           
           # Create customer
           customer = await customer_service.create({
               "name": "John Doe",
               "email": "john@example.com",
               "phone": "555-1234"
           }, created_by="system")
           
           # Create order
           order = await order_service.create({
               "order_number": "ORD-001",
               "total_amount": 99.99,
               "customer_id": customer.id
           }, created_by="system")
           
           # Monitor health
           health_report = await health_checker.get_health_report([Customer, Order])
           print(f"System health: {health_report['overall_health']}")

API Reference
-------------

For complete API documentation, see:

* :doc:`Component Registry API <../api/components>`
* :doc:`BaseModel API <../api/models>`
* :doc:`BaseService API <../api/services>`
* :doc:`Utility Components API <../api/utils>`
