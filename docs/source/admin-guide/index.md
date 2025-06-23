# Administrator Guide

Welcome to the Administrator Guide! This comprehensive guide covers deployment, configuration, monitoring, and maintenance of the Python MVP Template in production environments.

## Overview

As an administrator, you'll be responsible for:

- **Deployment**: Setting up and deploying the application
- **Configuration**: Managing environment settings and service configurations
- **Monitoring**: Tracking application health and performance
- **Maintenance**: Database management, backups, and updates
- **Security**: User management, access control, and security policies
- **Troubleshooting**: Diagnosing and resolving issues

## Quick Reference

### Essential Commands

```bash
# Service Management
services_start              # Start all services
services_stop               # Stop all services
services_status             # Check service status

# Database Operations
make db-upgrade             # Apply migrations
make db-backup              # Create database backup
make db-restore             # Restore from backup

# Health Monitoring
make service-urls-health    # Check all service health
curl /api/v1/health         # Application health check

# Log Management
make logs                   # View application logs
make logs-follow            # Follow logs in real-time
```

### Critical Endpoints

- **Health Check**: `/api/v1/health` - Application status
- **Metrics**: `/api/v1/metrics` - Performance metrics
- **Admin Panel**: `/admin` - Administrative interface
- **API Documentation**: `/docs` - Interactive API docs

## Deployment

### Production Deployment

#### Prerequisites

- **Server Requirements**:
  - Linux server (Ubuntu 20.04+ recommended)
  - 4GB+ RAM, 2+ CPU cores
  - 20GB+ storage space
  - Docker and Docker Compose

- **External Services**:
  - PostgreSQL 16+ database
  - Redis instance
  - SSL certificate (Let's Encrypt recommended)

#### Docker Deployment

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/your-project.git
cd your-project

# 2. Configure environment
cp .env.example .env.production
# Edit .env.production with production settings

# 3. Build and deploy
docker-compose -f docker/docker-compose.yml up -d

# 4. Run migrations
docker-compose exec app make db-upgrade

# 5. Verify deployment
curl https://yourdomain.com/api/v1/health
```

#### Environment Configuration

**Critical Environment Variables:**

```bash
# Application
PROJECT_NAME=your-project
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-secure-secret-key-here

# Database
DATABASE_URL=postgresql+asyncpg://user:password@db-host:5432/dbname
REDIS_URL=redis://redis-host:6379/0

# Security
JWT_SECRET_KEY=your-jwt-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Performance
WORKERS=4
MAX_CONNECTIONS=100
POOL_SIZE=20
```

### Staging Environment

```bash
# Deploy to staging
docker-compose -f docker/docker-compose.staging.yml up -d

# Run tests against staging
make test-staging
```

## Configuration Management

### Application Settings

The application uses a hierarchical configuration system:

1. **Default Settings** (in code)
2. **Environment Variables** (`.env` file)
3. **Runtime Configuration** (database settings)

#### Core Configuration Categories

**Database Configuration:**
```bash
DATABASE_URL=postgresql+asyncpg://user:pass@host:port/db
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=30
DATABASE_POOL_TIMEOUT=30
```

**Security Configuration:**
```bash
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

**Performance Configuration:**
```bash
WORKERS=4
WORKER_CONNECTIONS=1000
MAX_REQUESTS=1000
MAX_REQUESTS_JITTER=100
```

### Service URL Management

Configure service URLs in `config/service-urls.json`:

```json
{
  "environments": {
    "production": {
      "domain": "yourdomain.com",
      "protocol": "https",
      "services": {
        "api": {
          "port": 443,
          "health_endpoint": "/api/v1/health"
        },
        "database": {
          "host": "db.yourdomain.com",
          "port": 5432
        },
        "redis": {
          "host": "redis.yourdomain.com",
          "port": 6379
        }
      }
    }
  }
}
```

### Soft Delete Configuration

Configure soft delete behavior:

```bash
# Soft Delete Settings
SOFT_DELETE_AUTO_FILTER=true
SOFT_DELETE_CASCADE=true
SOFT_DELETE_HARD_DELETE_AFTER_DAYS=90
SOFT_DELETE_ENABLE_AUDIT_LOG=true
SOFT_DELETE_BATCH_SIZE=1000
```

## User Management

### User Administration

#### Creating Admin Users

```bash
# Create superuser via CLI
python -m src.project_name.cli create-superuser \
  --email admin@yourdomain.com \
  --username admin \
  --password SecurePassword123

# Or via API
curl -X POST "https://yourdomain.com/api/v1/admin/users" \
  -H "Authorization: Bearer admin-token" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "newuser",
    "password": "SecurePassword123",
    "is_superuser": false,
    "is_active": true
  }'
```

#### User Management Operations

```bash
# List all users
curl -X GET "https://yourdomain.com/api/v1/admin/users" \
  -H "Authorization: Bearer admin-token"

# Deactivate user
curl -X PATCH "https://yourdomain.com/api/v1/admin/users/123" \
  -H "Authorization: Bearer admin-token" \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}'

# Reset user password
curl -X POST "https://yourdomain.com/api/v1/admin/users/123/reset-password" \
  -H "Authorization: Bearer admin-token"
```

### Role and Permission Management

#### Default Roles

- **Superuser**: Full system access
- **Admin**: Administrative functions
- **User**: Standard user access
- **Readonly**: Read-only access

#### Permission Management

```python
# Example: Custom permission assignment
from src.project_name.models.user import User
from src.project_name.services.auth import AuthService

# Grant specific permissions
auth_service = AuthService()
await auth_service.grant_permission(user_id, "users.create")
await auth_service.grant_permission(user_id, "reports.view")
```

## Monitoring and Health Checks

### Application Health Monitoring

#### Health Check Endpoints

```bash
# Basic health check
curl https://yourdomain.com/api/v1/health

# Detailed health check
curl https://yourdomain.com/api/v1/health/detailed

# Database health
curl https://yourdomain.com/api/v1/health/database

# Service dependencies
curl https://yourdomain.com/api/v1/health/dependencies
```

#### Health Check Response Format

```json
{
  "status": "healthy",
  "timestamp": "2024-06-23T10:30:00Z",
  "version": "2.0.0",
  "environment": "production",
  "checks": {
    "database": {
      "status": "healthy",
      "response_time_ms": 15,
      "connection_pool": {
        "active": 5,
        "idle": 15,
        "total": 20
      }
    },
    "redis": {
      "status": "healthy",
      "response_time_ms": 2
    },
    "disk_space": {
      "status": "healthy",
      "free_gb": 45.2,
      "used_percent": 65
    }
  }
}
```

### Performance Monitoring

#### Key Metrics to Monitor

1. **Response Times**
   - API endpoint response times
   - Database query performance
   - Cache hit rates

2. **Resource Usage**
   - CPU utilization
   - Memory consumption
   - Disk I/O
   - Network traffic

3. **Application Metrics**
   - Request rates
   - Error rates
   - Active connections
   - Queue lengths

#### Monitoring Setup

```bash
# Enable metrics collection
ENABLE_METRICS=true
METRICS_ENDPOINT=/api/v1/metrics

# Configure monitoring intervals
HEALTH_CHECK_INTERVAL=30
METRICS_COLLECTION_INTERVAL=60
```

### Logging

#### Log Configuration

```bash
# Logging settings
LOG_LEVEL=INFO
LOG_FORMAT=json
LOG_FILE=/var/log/app/application.log
LOG_ROTATION=daily
LOG_RETENTION_DAYS=30
```

#### Log Analysis

```bash
# View recent logs
tail -f /var/log/app/application.log

# Search for errors
grep "ERROR" /var/log/app/application.log

# Analyze performance
grep "response_time" /var/log/app/application.log | \
  jq '.response_time' | \
  awk '{sum+=$1; count++} END {print "Average:", sum/count}'
```

## Database Administration

### Database Management

#### Backup and Restore

```bash
# Create backup
pg_dump -h localhost -U username -d dbname > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/var/backups/database"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_DIR/backup_$TIMESTAMP.sql
gzip $BACKUP_DIR/backup_$TIMESTAMP.sql

# Restore from backup
gunzip -c backup_20240623_103000.sql.gz | psql -h localhost -U username -d dbname
```

#### Migration Management

```bash
# Check migration status
make db-status

# Apply pending migrations
make db-upgrade

# Rollback last migration
make db-downgrade

# Create new migration
make db-migrate -m "Add new feature"
```

#### Database Maintenance

```bash
# Analyze database performance
ANALYZE;

# Vacuum database
VACUUM ANALYZE;

# Reindex tables
REINDEX DATABASE dbname;

# Check database size
SELECT pg_size_pretty(pg_database_size('dbname'));
```

### Soft Delete Management

#### Monitoring Soft Deleted Records

```sql
-- Check soft delete statistics
SELECT 
  schemaname,
  tablename,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as soft_deleted,
  COUNT(*) FILTER (WHERE deleted_at IS NULL) as active
FROM information_schema.tables t
JOIN pg_stat_user_tables s ON t.table_name = s.relname
WHERE t.table_schema = 'public'
GROUP BY schemaname, tablename;
```

#### Cleanup Operations

```bash
# Hard delete old soft-deleted records
python -m src.project_name.cli cleanup-soft-deleted \
  --model User \
  --older-than-days 90 \
  --dry-run

# Bulk restore accidentally deleted records
python -m src.project_name.cli restore-soft-deleted \
  --model User \
  --ids 1,2,3,4,5
```

## Security

### Security Best Practices

#### SSL/TLS Configuration

```nginx
# Nginx SSL configuration
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Security Headers

```python
# Security middleware configuration
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'"
}
```

### Access Control

#### API Rate Limiting

```bash
# Rate limiting configuration
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_BURST=10
```

#### Authentication Security

```bash
# JWT Security settings
JWT_SECRET_KEY=your-very-secure-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Password policy
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBERS=true
PASSWORD_REQUIRE_SPECIAL_CHARS=true
```

## Troubleshooting

### Common Issues

#### Application Won't Start

**Symptoms**: Application fails to start or crashes immediately

**Diagnosis**:
```bash
# Check logs
docker logs container-name

# Check configuration
python -c "from src.project_name.core.config import settings; print(settings.dict())"

# Test database connection
python -c "from src.project_name.core.database import engine; print('DB OK')"
```

**Solutions**:
1. Verify environment variables
2. Check database connectivity
3. Ensure all dependencies are installed
4. Verify file permissions

#### Database Connection Issues

**Symptoms**: Database connection errors, timeouts

**Diagnosis**:
```bash
# Test database connectivity
pg_isready -h db-host -p 5432

# Check connection pool
curl https://yourdomain.com/api/v1/health/database
```

**Solutions**:
1. Verify database credentials
2. Check network connectivity
3. Adjust connection pool settings
4. Monitor database performance

#### High Memory Usage

**Symptoms**: Application consuming excessive memory

**Diagnosis**:
```bash
# Monitor memory usage
docker stats container-name

# Check for memory leaks
python -m memory_profiler your_script.py
```

**Solutions**:
1. Adjust worker processes
2. Optimize database queries
3. Implement caching
4. Review code for memory leaks

### Performance Optimization

#### Database Optimization

```sql
-- Identify slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;
```

#### Application Optimization

```bash
# Profile application performance
python -m cProfile -o profile.stats your_script.py

# Analyze profile results
python -c "import pstats; p = pstats.Stats('profile.stats'); p.sort_stats('cumulative').print_stats(10)"
```

## Maintenance

### Regular Maintenance Tasks

#### Daily Tasks
- Monitor application health
- Check error logs
- Verify backup completion
- Review security alerts

#### Weekly Tasks
- Analyze performance metrics
- Update dependencies
- Review user activity
- Clean up temporary files

#### Monthly Tasks
- Database maintenance (VACUUM, ANALYZE)
- Security audit
- Capacity planning review
- Documentation updates

### Backup and Recovery

#### Automated Backup Script

```bash
#!/bin/bash
# backup.sh - Automated backup script

BACKUP_DIR="/var/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_BACKUP="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
APP_BACKUP="$BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz"

# Database backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $DB_BACKUP
gzip $DB_BACKUP

# Application backup
tar -czf $APP_BACKUP /path/to/application

# Upload to cloud storage
aws s3 cp $DB_BACKUP.gz s3://your-backup-bucket/
aws s3 cp $APP_BACKUP s3://your-backup-bucket/

# Clean up old backups (keep 30 days)
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

### Updates and Upgrades

#### Application Updates

```bash
# 1. Backup current version
./backup.sh

# 2. Pull latest changes
git pull origin main

# 3. Update dependencies
make install

# 4. Run migrations
make db-upgrade

# 5. Restart application
docker-compose restart app

# 6. Verify deployment
curl https://yourdomain.com/api/v1/health
```

#### Security Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Python dependencies
poetry update

# Scan for vulnerabilities
safety check
bandit -r src/
```

## Support and Resources

### Getting Help

- **Documentation**: Complete documentation at `/docs`
- **API Reference**: Interactive API docs at `/docs`
- **Health Dashboard**: System status at `/api/v1/health`
- **Logs**: Application logs in `/var/log/app/`

### Emergency Contacts

- **Development Team**: dev-team@yourdomain.com
- **Infrastructure Team**: infra@yourdomain.com
- **Security Team**: security@yourdomain.com

### Useful Resources

- **Monitoring Dashboard**: https://monitoring.yourdomain.com
- **Log Analysis**: https://logs.yourdomain.com
- **Status Page**: https://status.yourdomain.com
- **Documentation**: https://docs.yourdomain.com

Ready to administer your application like a pro? This guide provides everything you need for successful deployment and operations! 🚀
