# Service URL Manager

The Service URL Manager is a centralized URL management system designed to handle service discovery, URL generation, and environment-specific configuration across different deployment scenarios.

## Overview

Modern applications often deploy across multiple environments (development, staging, production, local) with different domain configurations, protocols, and service topologies. The Service URL Manager solves this by providing:

- **Environment-aware URL generation** with automatic protocol and domain handling
- **Dynamic service discovery** with subdomain and port management  
- **API endpoint templating** with parameter substitution
- **Health check URL generation** for monitoring integration
- **Configuration-driven service mapping** via JSON configuration files

## Quick Start

### Basic Usage

```python
from project_name.utils.service_url_manager import ServiceURLManager

# Initialize for specific environment
manager = ServiceURLManager('production')

# Get service URLs
api_url = manager.get_service_url('api')
frontend_url = manager.get_service_url('frontend')

# Get API endpoints
upload_endpoint = manager.get_api_endpoint('files', 'upload')
user_profile = manager.get_api_endpoint('users', 'profile', user_id=123)

# Health check URLs
health_urls = manager.health_check_urls()
```

### Convenience Functions

```python
from project_name.utils.service_url_manager import get_service_url, get_api_endpoint

# Quick access without manager instance
api_url = get_service_url('api', environment='production')
endpoint = get_api_endpoint('users', 'detail', environment='staging', user_id=456)
```

## Configuration

### Configuration File Structure

The Service URL Manager uses a JSON configuration file located at `config/service-urls.json`:

```json
{
  "environments": {
    "development": {
      "domain": "localhost",
      "protocol": "http",
      "services": {
        "api": {
          "subdomain": null,
          "port": 8000,
          "path": "",
          "health_endpoint": "/api/v1/health"
        },
        "frontend": {
          "subdomain": null,
          "port": 3000,
          "path": "",
          "health_endpoint": "/health"
        }
      }
    },
    "production": {
      "domain": "example.com",
      "protocol": "https",
      "services": {
        "api": {
          "subdomain": "api",
          "port": null,
          "path": "",
          "health_endpoint": "/api/v1/health"
        },
        "frontend": {
          "subdomain": "app",
          "port": null,
          "path": "",
          "health_endpoint": "/health"
        }
      }
    }
  },
  "api_endpoints": {
    "users": {
      "list": "/api/v1/users",
      "detail": "/api/v1/users/{user_id}",
      "create": "/api/v1/users"
    },
    "files": {
      "upload": "/api/v1/files/upload",
      "download": "/api/v1/files/{file_id}/download"
    }
  }
}
```

### Service Configuration Fields

- **subdomain**: Service subdomain (null for port-based routing)
- **port**: Service port (null for subdomain-based routing)  
- **path**: Base path for the service
- **health_endpoint**: Health check endpoint path

### Environment Detection

The manager automatically detects the environment using:

1. `{PROJECT_NAME}_ENV` environment variable
2. `ENVIRONMENT` setting from application config
3. Fallback to 'development'

## API Reference

### ServiceURLManager Class

#### Constructor

```python
ServiceURLManager(environment: str = None, config_path: str = None)
```

- **environment**: Target environment name (auto-detected if None)
- **config_path**: Path to configuration JSON file (defaults to `config/service-urls.json`)

#### Service URL Methods

```python
# Get single service URL
get_service_url(service_name: str, include_health: bool = False) -> str

# Get all service URLs
get_all_service_urls(include_health: bool = False) -> Dict[str, str]

# Get health check URLs
health_check_urls() -> Dict[str, str]
```

#### API Endpoint Methods

```python
# Get API endpoint with parameter substitution
get_api_endpoint(category: str, endpoint: str, **kwargs) -> str
```

#### Environment Management

```python
# Switch environment
switch_environment(new_environment: str) -> None

# List available environments
list_environments() -> List[str]

# List services in current environment
list_services() -> List[str]

# Get environment configuration
get_environment_info() -> Dict[str, Any]
```

## CLI Tool

The Service URL Manager includes a comprehensive CLI tool for testing and management:

### Basic Commands

```bash
# List environments
python scripts/service-urls.py list-environments

# List services in current environment
python scripts/service-urls.py list-services --env production

# Get service URL
python scripts/service-urls.py get-url api --env staging

# Get API endpoint
python scripts/service-urls.py get-endpoint users detail --params '{"user_id": 123}'
```

### Health Checking

```bash
# Check health of all services
python scripts/service-urls.py health-check --env production

# Test connectivity to all endpoints
python scripts/service-urls.py test-endpoints --env staging --timeout 10
```

### Environment Information

```bash
# Show environment configuration
python scripts/service-urls.py env-info --env production
```

### Make Commands

```bash
# List service URLs
make service-urls-list

# Check service health
make service-urls-health

# Test service connectivity
make service-urls-test
```

## Integration Examples

### FastAPI Integration

```python
from fastapi import FastAPI
from project_name.utils.service_url_manager import get_url_manager

app = FastAPI()

@app.get("/services")
async def get_services():
    """Get all service URLs for current environment."""
    manager = get_url_manager()
    return {
        "environment": manager.environment,
        "services": manager.get_all_service_urls(),
        "health_checks": manager.health_check_urls()
    }
```

### Docker Compose Integration

```yaml
version: '3.8'
services:
  api:
    environment:
      - PROJECT_NAME_ENV=development
    # Service will auto-detect environment and configure URLs
```

### Kubernetes Integration

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: service-urls-config
data:
  PROJECT_NAME_ENV: "production"
```

## URL Construction Logic

The Service URL Manager constructs URLs using this logic:

1. **Determine protocol** from environment configuration
2. **Build host** from domain and subdomain (or use port if no subdomain)
3. **Construct base URL**: `{protocol}://{host}:{port}`
4. **Join with service path** using `urllib.parse.urljoin`
5. **Append health endpoint** if requested

### Examples

**Port-based (Development)**:
- Config: `{"domain": "localhost", "port": 8000, "subdomain": null}`
- Result: `http://localhost:8000`

**Subdomain-based (Production)**:
- Config: `{"domain": "example.com", "subdomain": "api", "port": null}`
- Result: `https://api.example.com`

**With Path**:
- Config: `{"domain": "localhost", "port": 3000, "path": "/app"}`
- Result: `http://localhost:3000/app`

## Error Handling

The Service URL Manager provides clear error messages for common issues:

```python
# Missing environment
ServiceURLManager('invalid')
# ValueError: Environment 'invalid' not found. Available environments: ['development', 'production']

# Missing service
manager.get_service_url('nonexistent')
# ValueError: Service 'nonexistent' not found in environment 'development'. Available services: ['api', 'frontend']

# Missing API endpoint
manager.get_api_endpoint('users', 'invalid')
# ValueError: Endpoint 'invalid' not found in category 'users'. Available endpoints: ['list', 'detail', 'create']

# Missing template parameter
manager.get_api_endpoint('users', 'detail')
# ValueError: Missing parameter for endpoint template: 'user_id'
```

## Best Practices

### Configuration Management

1. **Environment-specific configs**: Keep separate configurations for each environment
2. **Version control**: Include configuration files in version control
3. **Validation**: Use the CLI tool to validate configurations
4. **Documentation**: Document custom endpoints and services

### Development Workflow

1. **Local development**: Use port-based routing for simplicity
2. **Staging/Production**: Use subdomain-based routing for scalability
3. **Health checks**: Always configure health endpoints for monitoring
4. **Testing**: Use the CLI tool to test connectivity before deployment

### Security Considerations

1. **No secrets**: Never include secrets in configuration files
2. **Environment variables**: Use environment variables for sensitive data
3. **Access control**: Restrict access to production configurations
4. **Validation**: Validate all URLs before use in production

## Troubleshooting

### Common Issues

**Configuration file not found**:
```bash
# Check file exists
ls -la config/service-urls.json

# Use custom path
python scripts/service-urls.py --config /path/to/config.json list-services
```

**Invalid JSON configuration**:
```bash
# Validate JSON syntax
python -m json.tool config/service-urls.json
```

**Service connectivity issues**:
```bash
# Test specific service
python scripts/service-urls.py get-url api --env production

# Test all services
python scripts/service-urls.py test-endpoints --env production
```

**Environment detection issues**:
```bash
# Check environment variables
echo $PROJECT_NAME_ENV

# Force specific environment
python scripts/service-urls.py --env production list-services
```
