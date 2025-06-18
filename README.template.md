# Python MVP Template

<div align="center">

![Python](https://img.shields.io/badge/python-v3.11+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-00a393.svg)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-red.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

[![CI](https://github.com/forkrul/project-template-mvp/workflows/CI/badge.svg)](https://github.com/forkrul/project-template-mvp/actions/workflows/ci.yml)
[![Documentation](https://github.com/forkrul/project-template-mvp/workflows/Documentation%20Check/badge.svg)](https://github.com/forkrul/project-template-mvp/actions/workflows/docs.yml)

[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![Ruff](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/ruff/main/assets/badge/v2.json)](https://github.com/astral-sh/ruff)
[![Pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit&logoColor=white)](https://github.com/pre-commit/pre-commit)

[![Docker](https://img.shields.io/badge/docker-ready-blue?logo=docker)](https://www.docker.com/)
[![Nix](https://img.shields.io/badge/nix-supported-blue?logo=nixos)](https://nixos.org/)
[![Poetry](https://img.shields.io/badge/dependency-poetry-blue)](https://python-poetry.org/)

[![Security: bandit](https://img.shields.io/badge/security-bandit-yellow.svg)](https://github.com/PyCQA/bandit)
[![Checked with mypy](https://www.mypy-lang.org/static/mypy_badge.svg)](https://mypy-lang.org/)
[![Pydantic v2](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/pydantic/pydantic/main/docs/badge/v2.json)](https://pydantic.dev)

</div>

**A modern Python MVP template built with FastAPI, SQLAlchemy, and best practices for rapid development.**

🚀 **Production-ready template** with comprehensive tooling, testing, and deployment configurations.

## ✨ Features

- **🔥 FastAPI**: Modern, fast web framework for building APIs
- **🗄️ SQLAlchemy 2.0**: Powerful ORM with async support and soft delete
- **✅ Pydantic**: Data validation using Python type annotations
- **🔄 Alembic**: Database migration tool with async support
- **🧪 Comprehensive Testing**: Unit, integration, and E2E tests with pytest
- **🐳 Docker**: Complete containerization for development and production
- **📦 Nix**: Reproducible development environments
- **🔧 Pre-commit**: Code quality hooks with ruff, black, mypy
- **📊 Structured Logging**: JSON logging with structlog
- **🔐 Security**: JWT authentication, password hashing, CORS
- **📚 Documentation**: Auto-generated API docs with Sphinx and Mermaid
- **🚀 CI/CD**: GitHub Actions workflows for testing and deployment

## 🚀 Quick Start

### Using the Template

1. **Use this template**
   ```bash
   # Click "Use this template" on GitHub or:
   gh repo create my-awesome-project --template forkrul/project-template-mvp
   cd my-awesome-project
   ```

2. **Customize your project**
   - Follow the customization guide in the generated README
   - Update project name, description, and package names
   - Configure environment variables

3. **Set up development environment**
   ```bash
   # Option 1: Nix (Recommended)
   make install-nix
   nix develop
   
   # Option 2: Manual setup
   make install
   ```

4. **Start developing**
   ```bash
   services_start  # Start PostgreSQL and Redis (Nix)
   make dev        # Start development server
   ```

### Template Structure

```
project-template-mvp/
├── 📁 .github/workflows/     # CI/CD pipelines
├── 📁 src/project_name/      # Main application code
│   ├── 📁 api/              # FastAPI routes and endpoints
│   ├── 📁 core/             # Configuration and database
│   ├── 📁 models/           # SQLAlchemy models with soft delete
│   ├── 📁 schemas/          # Pydantic schemas
│   ├── 📁 services/         # Business logic layer
│   └── 📁 utils/            # Utility functions
├── 📁 tests/                # Comprehensive test suite
│   ├── 📁 unit/             # Unit tests
│   ├── 📁 integration/      # Integration tests
│   └── 📁 e2e/             # End-to-end BDD tests
├── 📁 docs/                 # Sphinx documentation
├── 📁 docker/               # Docker configurations
├── 📁 scripts/              # Utility scripts
├── 📄 shell.nix             # Nix development environment
├── 📄 flake.nix             # Modern Nix flakes support
└── 📄 pyproject.toml        # Python project configuration
```

## 🛠️ What's Included

### Core Framework
- **FastAPI** with async support and automatic OpenAPI docs
- **SQLAlchemy 2.0** with async sessions and soft delete mixins
- **Pydantic v2** for data validation and serialization
- **Alembic** for database migrations

### Development Tools
- **Poetry** for dependency management
- **Ruff** for fast linting and formatting
- **Black** for code formatting
- **MyPy** for static type checking
- **Pre-commit** hooks for code quality

### Testing
- **Pytest** with async support
- **Factory Boy** for test data generation
- **Behave** for BDD testing
- **Coverage** reporting with codecov integration

### Infrastructure
- **Docker** with development and production configurations
- **Nix** for reproducible development environments
- **GitHub Actions** for CI/CD
- **PostgreSQL** and **Redis** integration

### Documentation
- **Sphinx** with modern themes
- **Mermaid** diagrams for architecture
- **Auto-generated** API documentation
- **GitHub Pages** deployment

## 📖 Documentation

- **Live Documentation**: https://forkrul.github.io/project-template-mvp/
- **Template Guide**: Comprehensive setup and customization guide
- **API Reference**: Auto-generated from code
- **Architecture Diagrams**: Visual system overview

## 🎯 Use Cases

Perfect for:
- **🚀 MVP Development**: Rapid prototyping and validation
- **🏢 Enterprise APIs**: Scalable backend services
- **🔬 Data Applications**: ML/AI model serving
- **🌐 Web Applications**: Full-stack development
- **📱 Mobile Backends**: API-first development

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with modern Python best practices and inspired by:
- [FastAPI](https://fastapi.tiangolo.com/) - The web framework
- [SQLAlchemy](https://www.sqlalchemy.org/) - The ORM
- [Pydantic](https://pydantic.dev/) - Data validation
- [Nix](https://nixos.org/) - Reproducible environments

---

<div align="center">

**⭐ Star this repository if you find it useful!**

[Report Bug](https://github.com/forkrul/project-template-mvp/issues) · [Request Feature](https://github.com/forkrul/project-template-mvp/issues) · [Documentation](https://forkrul.github.io/project-template-mvp/)

</div>
