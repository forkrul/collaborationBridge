Welcome to Python MVP Template Documentation!
==============================================

This is a comprehensive Python MVP template built with FastAPI, SQLAlchemy, and modern development best practices for rapid, production-ready development.

.. note::
   **🎉 Version 2.0 Released!**

   Major update with production-ready soft delete system, enterprise-scale bulk operations,
   comprehensive testing framework, and reusable component library. See the :doc:`changelog <../CHANGELOG>` for details.

.. tip::
   **New to the template?** Start with our :doc:`quickstart/index` guide to get up and running in minutes!

.. important::
   **Looking for specific information?**

   - **Users**: See the :doc:`user-guide/index` for API usage and integration examples
   - **Developers**: Check the :doc:`developer-guide/index` for development workflows
   - **Administrators**: Visit the :doc:`admin-guide/index` for deployment and operations

🚀 **Template Overview**
------------------------

The Python MVP Template provides a complete foundation for building modern web applications with:

**Core Framework**

* **🔥 FastAPI**: Modern, fast web framework with automatic OpenAPI docs
* **🗄️ SQLAlchemy 2.0**: Powerful async ORM with enhanced soft delete functionality
* **✅ Pydantic v2**: Advanced data validation and serialization
* **🔄 Alembic**: Database migration management with audit field support

**Production-Ready Features** *(New in v2.0)*

* **🔧 Enhanced Soft Delete**: Production-ready soft delete with comprehensive audit trails
* **⚡ Bulk Operations**: High-performance bulk operations (10,000+ records/second)
* **🏥 Health Monitoring**: Database health checks and performance monitoring
* **🔗 Cascading Deletes**: Relationship-aware cascading soft delete operations
* **⚙️ Configuration Management**: Comprehensive configuration system with 30+ settings
* **📦 Component Library**: Reusable components for cross-project efficiency

**Development & Quality**

* **🧪 Comprehensive Testing**: Enhanced testing framework with performance and compliance testing
* **⚡ Modern Tooling**: uv for fast dependency management, Ruff for linting and formatting
* **🐳 Docker**: Complete containerization for all environments
* **📦 Nix**: Reproducible development environments
* **🌐 Service URL Manager**: Centralized URL management across environments
* **🔧 Pre-commit**: Automated code quality enforcement
* **📊 Structured Logging**: JSON logging with structlog
* **🔐 Security**: JWT authentication, password hashing, CORS, GDPR compliance
* **📚 Documentation**: Auto-generated API docs and comprehensive guides

🎯 **Quick Start**
------------------

**Option 1: Nix (Recommended)**

.. code-block:: bash

   # Clone and enter project
   git clone <your-repo-url>
   cd <your-project>

   # Enter Nix environment (installs everything)
   nix develop  # or nix-shell

   # Install Python dependencies
   make install

   # Start services and run
   services_start
   make dev

**Option 2: Manual Setup**

.. code-block:: bash

   # Install dependencies
   make install

   # Configure environment
   cp .env.example .env
   # Edit .env with your settings

   # Run migrations and start
   make db-upgrade
   make dev

**Visit Your Application**

* **API Documentation**: http://localhost:8000/docs
* **Alternative Docs**: http://localhost:8000/redoc
* **Health Check**: http://localhost:8000/api/v1/health

.. toctree::
   :maxdepth: 2
   :caption: Getting Started:

   quickstart/index
   user-guide/index
   developer-guide/index
   admin-guide/index

.. toctree::
   :maxdepth: 2
   :caption: Enhanced Features (v2.0):

   soft-delete/index
   bulk-operations/index
   health-monitoring/index
   component-library/index
   configuration/index

.. toctree::
   :maxdepth: 2
   :caption: Development:

   development/index
   testing/index

.. toctree::
   :maxdepth: 2
   :caption: Tools & Utilities:

   nix/index
   service-url-manager/index
   database/index
   security/index
   i18n/index

.. toctree::
   :maxdepth: 2
   :caption: Architecture & API:

   architecture/index
   api/index

.. toctree::
   :maxdepth: 2
   :caption: Frontend Development:

   ux-development-prd

.. toctree::
   :maxdepth: 2
   :caption: Deployment & Operations:

   deployment/index
   monitoring/index
   troubleshooting/index

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
