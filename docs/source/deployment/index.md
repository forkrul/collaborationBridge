# Deployment Guide

## GitHub Pages Setup

This project includes local documentation building and deployment to GitHub Pages.

### Local Documentation Build and Deploy

The repository is configured for local documentation building with deployment scripts:

1. **Build documentation locally**: `make docs`
2. **Deploy to GitHub Pages**: `make docs-deploy` or `./scripts/deploy-docs.sh`
3. **Documentation available at**: `https://forkrul.github.io/project-template-mvp/`

### Quick Setup

```bash
# 1. Setup GitHub Pages (one-time)
make setup-github-pages

# 2. Build and deploy documentation
make docs
make docs-deploy
```

### Manual GitHub Pages Setup via API

You can also enable GitHub Pages programmatically using the GitHub API:

#### Enable GitHub Pages with GitHub Actions

```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/OWNER/REPO/pages \
  -d '{
    "source": {
      "branch": "master",
      "path": "/"
    },
    "build_type": "workflow"
  }'
```

#### Enable GitHub Pages with gh-pages branch (Recommended)

```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/OWNER/REPO/pages \
  -d '{
    "source": {
      "branch": "gh-pages",
      "path": "/"
    }
  }'
```

This is the recommended approach as it allows for local documentation building and deployment.

#### Check GitHub Pages Status

```bash
curl -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/OWNER/REPO/pages
```

#### Update GitHub Pages Configuration

```bash
curl -X PUT \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/OWNER/REPO/pages \
  -d '{
    "source": {
      "branch": "main",
      "path": "/docs"
    },
    "build_type": "legacy"
  }'
```

#### Disable GitHub Pages

```bash
curl -X DELETE \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/OWNER/REPO/pages
```

### GitHub API Authentication

To use the GitHub API, you need a personal access token with appropriate permissions:

1. **Create a Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a new token with `repo` and `pages:write` permissions

2. **Using GitHub CLI** (alternative):
   ```bash
   # Enable Pages
   gh api repos/OWNER/REPO/pages -X POST -f source.branch=master -f build_type=workflow
   
   # Check status
   gh api repos/OWNER/REPO/pages
   ```

### Environment Variables for API Calls

For automation scripts, you can use environment variables:

```bash
export GITHUB_TOKEN="your_token_here"
export GITHUB_OWNER="forkrul"
export GITHUB_REPO="project-template-mvp"

# Enable Pages with gh-pages branch
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/pages \
  -d '{"source": {"branch": "gh-pages", "path": "/"}}'
```

### Local Documentation Workflow

The local documentation workflow provides several advantages:

- **Full Control**: Build documentation with your exact environment
- **Faster Iteration**: No waiting for CI/CD pipelines
- **Custom Processing**: Add custom build steps or preprocessing
- **Offline Capability**: Build documentation without internet connection

#### Documentation Build Process

1. **Install Dependencies**:
   ```bash
   poetry install --with docs
   ```

2. **Build Documentation**:
   ```bash
   make docs
   # or manually:
   cd docs && poetry run make html
   ```

3. **Preview Locally**:
   ```bash
   make docs-serve
   # Opens server at http://localhost:8080
   ```

4. **Deploy to GitHub Pages**:
   ```bash
   make docs-deploy
   # or manually:
   ./scripts/deploy-docs.sh
   ```

#### Automated Deployment Script

The `deploy-docs.sh` script handles:

- ✅ Building documentation locally
- ✅ Creating/switching to gh-pages branch
- ✅ Copying built files to gh-pages
- ✅ Adding `.nojekyll` file (prevents Jekyll processing)
- ✅ Committing and pushing changes
- ✅ Switching back to original branch
- ✅ Cleanup of temporary files

#### Continuous Integration

The GitHub Actions workflow (`.github/workflows/docs.yml`) now only:

- ✅ Checks that documentation builds successfully
- ✅ Validates links (optional)
- ❌ Does NOT auto-deploy (manual control)

## Docker Deployment

### Development Environment

```bash
# Start all services
make docker-up

# View logs
make docker-logs

# Stop services
make docker-down
```

### Production Deployment

```bash
# Build production image
docker build -f docker/Dockerfile -t project-name:latest .

# Run with environment variables
docker run -d \
  --name project-api \
  -p 8000:8000 \
  -e DATABASE_URL="postgresql+asyncpg://user:pass@host:5432/db" \
  -e REDIS_URL="redis://redis:6379/0" \
  -e SECRET_KEY="your-secret-key" \
  project-name:latest
```

### Docker Compose Production

```yaml
version: '3.8'
services:
  app:
    image: project-name:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/project
      - REDIS_URL=redis://redis:6379/0
      - ENVIRONMENT=production
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=project
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
```

## Cloud Deployment

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Heroku

```bash
# Create Heroku app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Add Redis addon
heroku addons:create heroku-redis:mini

# Set environment variables
heroku config:set SECRET_KEY="your-secret-key"
heroku config:set ENVIRONMENT="production"

# Deploy
git push heroku master
```

### DigitalOcean App Platform

Create `app.yaml`:

```yaml
name: project-template-mvp
services:
- name: api
  source_dir: /
  github:
    repo: forkrul/project-template-mvp
    branch: master
  run_command: poetry run uvicorn src.project_name.main:app --host 0.0.0.0 --port 8080
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: ENVIRONMENT
    value: production
  - key: SECRET_KEY
    value: your-secret-key
databases:
- name: db
  engine: PG
  version: "16"
```

## Environment Configuration

### Production Environment Variables

```bash
# Required
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db
SECRET_KEY=your-super-secret-key
JWT_SECRET_KEY=your-jwt-secret-key

# Optional
REDIS_URL=redis://host:6379/0
SENTRY_DSN=https://your-sentry-dsn
ENVIRONMENT=production
DEBUG=false
```

### Health Checks

The application includes health check endpoints:

- **Basic Health**: `GET /api/v1/health`
- **Database Health**: `GET /api/v1/health/db` (if implemented)
- **Redis Health**: `GET /api/v1/health/redis` (if implemented)

Use these for load balancer health checks and monitoring.
