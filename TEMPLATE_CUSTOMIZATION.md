# Template Customization Guide

This guide helps you customize the Python MVP Template for your specific project.

## 🔧 Quick Customization Checklist

### 1. Repository Setup
- [ ] Create new repository from this template
- [ ] Clone your new repository locally
- [ ] Update repository settings (description, topics, etc.)

### 2. Project Information
- [ ] Replace `<PROJECT_NAME>` with your project name
- [ ] Replace `<GITHUB_USERNAME>` with your GitHub username  
- [ ] Replace `<REPOSITORY_NAME>` with your repository name
- [ ] Replace `<PROJECT_DESCRIPTION>` with your project description
- [ ] Replace `<PROJECT_PACKAGE>` with your Python package name

### 3. File Updates

#### README.md
```bash
# Find and replace all template placeholders
sed -i 's/<PROJECT_NAME>/My Awesome Project/g' README.md
sed -i 's/<GITHUB_USERNAME>/yourusername/g' README.md
sed -i 's/<REPOSITORY_NAME>/my-awesome-project/g' README.md
sed -i 's/<PROJECT_DESCRIPTION>/My awesome project description/g' README.md
sed -i 's/<PROJECT_PACKAGE>/my_awesome_project/g' README.md
```

#### pyproject.toml
```toml
[tool.poetry]
name = "my-awesome-project"  # Replace with your project name
version = "0.1.0"
description = "My awesome project description"  # Replace with your description
authors = ["Your Name <your.email@example.com>"]  # Replace with your info
readme = "README.md"
packages = [{include = "my_awesome_project", from = "src"}]  # Replace package name
```

#### Package Directory
```bash
# Rename the package directory
mv src/project_name src/my_awesome_project

# Update imports in all Python files
find src/ -name "*.py" -exec sed -i 's/project_name/my_awesome_project/g' {} +
find tests/ -name "*.py" -exec sed -i 's/project_name/my_awesome_project/g' {} +
```

#### Environment Files
Update `.env.example`:
```bash
# Application Settings
PROJECT_NAME=my-awesome-project  # Replace with your project name
API_VERSION=v1
API_PREFIX=/api/v1

# Database Configuration  
POSTGRES_DB=my_awesome_project_db  # Replace with your DB name
```

#### Docker Configuration
Update `docker/docker-compose.yml`:
```yaml
services:
  app:
    container_name: my_awesome_project_app  # Replace container names
    # ... other configurations
  
  db:
    container_name: my_awesome_project_db
    environment:
      - POSTGRES_DB=my_awesome_project  # Replace DB name
```

#### Documentation
Update `docs/source/conf.py`:
```python
# Project information
project = "My Awesome Project"  # Replace with your project name
copyright = "2024, Your Name"  # Replace with your info
author = "Your Name"
```

### 4. GitHub Configuration

#### Repository Settings
1. Go to repository Settings
2. Update description and topics
3. Enable/disable features as needed
4. Set up branch protection rules

#### Secrets (if needed)
Add these secrets in GitHub repository settings:
- `CODECOV_TOKEN` - For code coverage reporting
- `DOCKER_USERNAME` - For Docker Hub publishing
- `DOCKER_PASSWORD` - For Docker Hub publishing

### 5. Optional Customizations

#### Custom Badges
Add project-specific badges to README.md:
```markdown
<!-- Deployment status -->
[![Deployment](https://img.shields.io/badge/deployment-active-green)](https://your-app.com)

<!-- API status -->
[![API Status](https://img.shields.io/badge/API-online-green)](https://your-api.com/health)

<!-- Version -->
[![Version](https://img.shields.io/github/v/release/yourusername/your-repo)](https://github.com/yourusername/your-repo/releases)
```

#### Custom Features Section
Update the features list in README.md to highlight your project's specific capabilities.

#### License
If using a different license:
1. Replace `LICENSE` file
2. Update license badge in README.md
3. Update license in `pyproject.toml`

### 6. Development Setup

After customization:
```bash
# Install dependencies
make install

# Set up environment
cp .env.example .env
# Edit .env with your specific configuration

# Start development
make dev
```

### 7. Testing Your Setup

```bash
# Run tests to ensure everything works
make test

# Check linting
make lint

# Build documentation
make docs

# Test Docker build
docker build -f docker/Dockerfile -t your-project:latest .
```

## 🔍 Automated Customization Script

Create a customization script:

```bash
#!/bin/bash
# customize.sh

PROJECT_NAME="My Awesome Project"
GITHUB_USERNAME="yourusername"
REPOSITORY_NAME="my-awesome-project"
PROJECT_DESCRIPTION="My awesome project description"
PROJECT_PACKAGE="my_awesome_project"

# Update README.md
sed -i "s/<PROJECT_NAME>/$PROJECT_NAME/g" README.md
sed -i "s/<GITHUB_USERNAME>/$GITHUB_USERNAME/g" README.md
sed -i "s/<REPOSITORY_NAME>/$REPOSITORY_NAME/g" README.md
sed -i "s/<PROJECT_DESCRIPTION>/$PROJECT_DESCRIPTION/g" README.md
sed -i "s/<PROJECT_PACKAGE>/$PROJECT_PACKAGE/g" README.md

# Rename package directory
mv src/project_name src/$PROJECT_PACKAGE

# Update Python imports
find src/ tests/ -name "*.py" -exec sed -i "s/project_name/$PROJECT_PACKAGE/g" {} +

# Update pyproject.toml
sed -i "s/project-name/$REPOSITORY_NAME/g" pyproject.toml
sed -i "s/project_name/$PROJECT_PACKAGE/g" pyproject.toml

echo "✅ Customization complete!"
echo "📝 Don't forget to:"
echo "   - Update .env.example with your configuration"
echo "   - Update docs/source/conf.py with your project info"
echo "   - Remove the template customization section from README.md"
```

## 🧹 Cleanup

After customization:
1. Remove the template customization section from README.md
2. Delete this TEMPLATE_CUSTOMIZATION.md file
3. Update CONTRIBUTING.md with project-specific guidelines
4. Commit your changes and push to your repository

## 🆘 Need Help?

- Check the [documentation](https://forkrul.github.io/project-template-mvp/)
- Open an [issue](https://github.com/forkrul/project-template-mvp/issues)
- Review the [examples](https://github.com/forkrul/project-template-mvp/tree/examples) branch
