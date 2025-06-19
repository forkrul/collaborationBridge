Welcome to Python MVP Template Documentation!
==============================================

This is a comprehensive Python MVP template built with FastAPI, SQLAlchemy, and modern development best practices for rapid, production-ready development.

🚀 **Template Overview**
------------------------

The Python MVP Template provides a complete foundation for building modern web applications with:

* **🔥 FastAPI**: Modern, fast web framework with automatic OpenAPI docs
* **🗄️ SQLAlchemy 2.0**: Powerful async ORM with soft delete functionality
* **✅ Pydantic v2**: Advanced data validation and serialization
* **🔄 Alembic**: Database migration management
* **🧪 Comprehensive Testing**: Unit, integration, and E2E test frameworks
* **🐳 Docker**: Complete containerization for all environments
* **📦 Nix**: Reproducible development environments
* **🌐 Service URL Manager**: Centralized URL management across environments
* **🔧 Pre-commit**: Automated code quality enforcement
* **📊 Structured Logging**: JSON logging with structlog
* **🔐 Security**: JWT authentication, password hashing, CORS
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
