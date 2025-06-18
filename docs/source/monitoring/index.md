# Monitoring & Observability Guide

The Python MVP Template includes comprehensive monitoring capabilities with structured logging, health checks, metrics, and observability features.

## Monitoring Stack

- **Structured Logging**: JSON logging with structlog
- **Health Checks**: Built-in health check endpoints
- **Service Discovery**: Service URL monitoring
- **Error Tracking**: Sentry integration (optional)
- **Metrics**: Application and system metrics
- **Performance Monitoring**: Request timing and profiling

## Structured Logging

### Logging Configuration

The template uses structlog for structured JSON logging:

```python
# src/your_package/core/logging.py
import structlog
import logging.config

def configure_logging():
    """Configure structured logging."""
    
    # Configure standard library logging
    logging.config.dictConfig({
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "json": {
                "()": structlog.stdlib.ProcessorFormatter,
                "processor": structlog.dev.ConsoleRenderer(colors=False),
            },
        },
        "handlers": {
            "default": {
                "level": "INFO",
                "class": "logging.StreamHandler",
                "formatter": "json",
            },
        },
        "loggers": {
            "": {
                "handlers": ["default"],
                "level": "INFO",
                "propagate": True,
            },
        }
    })
    
    # Configure structlog
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )
```

### Application Logging

```python
# Using structured logging in your application
import structlog

logger = structlog.get_logger(__name__)

# Basic logging
logger.info("User created", user_id=user.id, email=user.email)
logger.warning("Invalid login attempt", email=email, ip_address=request.client.host)
logger.error("Database connection failed", error=str(e), retry_count=3)

# Request logging
logger.info(
    "api_request",
    method=request.method,
    path=request.url.path,
    user_id=current_user.id if current_user else None,
    response_time_ms=response_time * 1000,
    status_code=response.status_code
)

# Business logic logging
logger.info(
    "order_created",
    order_id=order.id,
    user_id=order.user_id,
    total_amount=order.total,
    items_count=len(order.items)
)
```

### Request Logging Middleware

```python
# src/your_package/api/middleware/logging.py
import time
import structlog
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = structlog.get_logger("api")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log all API requests and responses."""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request
        logger.info(
            "request_started",
            method=request.method,
            path=request.url.path,
            query_params=str(request.query_params),
            client_ip=request.client.host,
            user_agent=request.headers.get("user-agent", ""),
        )
        
        # Process request
        response = await call_next(request)
        
        # Calculate response time
        process_time = time.time() - start_time
        
        # Log response
        logger.info(
            "request_completed",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            response_time_ms=round(process_time * 1000, 2),
            response_size=response.headers.get("content-length", 0)
        )
        
        return response

# Add to main app
app.add_middleware(RequestLoggingMiddleware)
```

## Health Checks

### Basic Health Check

```python
# src/your_package/api/v1/endpoints/health.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.get("/health")
async def health_check():
    """Basic health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.API_VERSION,
        "environment": settings.ENVIRONMENT
    }

@router.get("/health/detailed")
async def detailed_health_check(db: AsyncSession = Depends(get_db)):
    """Detailed health check with dependency status."""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.API_VERSION,
        "environment": settings.ENVIRONMENT,
        "checks": {}
    }
    
    # Database health check
    try:
        await db.execute(text("SELECT 1"))
        health_status["checks"]["database"] = {
            "status": "healthy",
            "response_time_ms": 0  # You can measure this
        }
    except Exception as e:
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        health_status["status"] = "unhealthy"
    
    # Redis health check (if using Redis)
    try:
        # Add Redis ping check here
        health_status["checks"]["redis"] = {"status": "healthy"}
    except Exception as e:
        health_status["checks"]["redis"] = {
            "status": "unhealthy",
            "error": str(e)
        }
    
    # External service checks
    health_status["checks"]["external_services"] = await check_external_services()
    
    return health_status

async def check_external_services():
    """Check external service dependencies."""
    services = {}
    
    # Example: Check external API
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("https://api.external-service.com/health", timeout=5.0)
            services["external_api"] = {
                "status": "healthy" if response.status_code == 200 else "unhealthy",
                "response_time_ms": response.elapsed.total_seconds() * 1000
            }
    except Exception as e:
        services["external_api"] = {
            "status": "unhealthy",
            "error": str(e)
        }
    
    return services
```

### Service URL Health Monitoring

```python
# Using the Service URL Manager for health monitoring
from src.your_package.utils.service_url_manager import get_url_manager

@router.get("/health/services")
async def service_health_check():
    """Check health of all configured services."""
    url_manager = get_url_manager()
    health_urls = url_manager.health_check_urls()
    
    service_health = {}
    
    async with httpx.AsyncClient(timeout=5.0) as client:
        for service_name, health_url in health_urls.items():
            try:
                start_time = time.time()
                response = await client.get(health_url)
                response_time = (time.time() - start_time) * 1000
                
                service_health[service_name] = {
                    "status": "healthy" if response.status_code == 200 else "unhealthy",
                    "url": health_url,
                    "response_time_ms": round(response_time, 2),
                    "status_code": response.status_code
                }
            except Exception as e:
                service_health[service_name] = {
                    "status": "unhealthy",
                    "url": health_url,
                    "error": str(e)
                }
    
    return {
        "environment": url_manager.environment,
        "services": service_health,
        "overall_status": "healthy" if all(
            s["status"] == "healthy" for s in service_health.values()
        ) else "unhealthy"
    }
```

## Error Tracking

### Sentry Integration

```python
# src/your_package/core/config.py
class Settings(BaseSettings):
    # Sentry configuration
    SENTRY_DSN: Optional[str] = None
    SENTRY_ENVIRONMENT: str = "development"

# src/your_package/main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.SENTRY_ENVIRONMENT,
        integrations=[
            FastApiIntegration(auto_enabling_integrations=False),
            SqlalchemyIntegration(),
        ],
        traces_sample_rate=0.1,  # Adjust based on traffic
        profiles_sample_rate=0.1,
    )
```

### Custom Error Handling

```python
# src/your_package/api/middleware/error_handler.py
import structlog
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logger = structlog.get_logger("errors")

class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Handle and log application errors."""
    
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except HTTPException as e:
            # Log HTTP exceptions
            logger.warning(
                "http_exception",
                status_code=e.status_code,
                detail=e.detail,
                path=request.url.path,
                method=request.method
            )
            raise
        except Exception as e:
            # Log unexpected errors
            logger.error(
                "unexpected_error",
                error=str(e),
                error_type=type(e).__name__,
                path=request.url.path,
                method=request.method,
                exc_info=True
            )
            
            # Return generic error response
            return JSONResponse(
                status_code=500,
                content={
                    "detail": "Internal server error",
                    "error_id": str(uuid.uuid4())  # For tracking
                }
            )

app.add_middleware(ErrorHandlingMiddleware)
```

## Metrics Collection

### Application Metrics

```python
# src/your_package/core/metrics.py
import time
from collections import defaultdict, Counter
from typing import Dict, Any

class MetricsCollector:
    """Simple in-memory metrics collector."""
    
    def __init__(self):
        self.counters = Counter()
        self.gauges = {}
        self.histograms = defaultdict(list)
        self.timers = {}
    
    def increment(self, name: str, value: int = 1, tags: Dict[str, str] = None):
        """Increment a counter."""
        key = self._make_key(name, tags)
        self.counters[key] += value
    
    def gauge(self, name: str, value: float, tags: Dict[str, str] = None):
        """Set a gauge value."""
        key = self._make_key(name, tags)
        self.gauges[key] = value
    
    def histogram(self, name: str, value: float, tags: Dict[str, str] = None):
        """Add value to histogram."""
        key = self._make_key(name, tags)
        self.histograms[key].append(value)
    
    def timer_start(self, name: str, tags: Dict[str, str] = None):
        """Start a timer."""
        key = self._make_key(name, tags)
        self.timers[key] = time.time()
    
    def timer_end(self, name: str, tags: Dict[str, str] = None):
        """End a timer and record duration."""
        key = self._make_key(name, tags)
        if key in self.timers:
            duration = time.time() - self.timers[key]
            self.histogram(f"{name}_duration", duration, tags)
            del self.timers[key]
    
    def _make_key(self, name: str, tags: Dict[str, str] = None) -> str:
        """Create metric key with tags."""
        if not tags:
            return name
        tag_str = ",".join(f"{k}={v}" for k, v in sorted(tags.items()))
        return f"{name}[{tag_str}]"
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get all metrics."""
        return {
            "counters": dict(self.counters),
            "gauges": self.gauges.copy(),
            "histograms": {
                k: {
                    "count": len(v),
                    "sum": sum(v),
                    "avg": sum(v) / len(v) if v else 0,
                    "min": min(v) if v else 0,
                    "max": max(v) if v else 0
                }
                for k, v in self.histograms.items()
            }
        }

# Global metrics instance
metrics = MetricsCollector()
```

### Metrics Middleware

```python
# src/your_package/api/middleware/metrics.py
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class MetricsMiddleware(BaseHTTPMiddleware):
    """Collect request metrics."""
    
    async def dispatch(self, request: Request, call_next):
        # Start timer
        metrics.timer_start("request_duration", {
            "method": request.method,
            "path": request.url.path
        })
        
        # Increment request counter
        metrics.increment("requests_total", tags={
            "method": request.method,
            "path": request.url.path
        })
        
        # Process request
        response = await call_next(request)
        
        # End timer
        metrics.timer_end("request_duration", {
            "method": request.method,
            "path": request.url.path
        })
        
        # Record response status
        metrics.increment("responses_total", tags={
            "method": request.method,
            "path": request.url.path,
            "status_code": str(response.status_code)
        })
        
        return response

app.add_middleware(MetricsMiddleware)
```

### Metrics Endpoint

```python
@router.get("/metrics")
async def get_metrics():
    """Get application metrics."""
    return metrics.get_metrics()

@router.get("/metrics/prometheus")
async def get_prometheus_metrics():
    """Get metrics in Prometheus format."""
    # Convert metrics to Prometheus format
    prometheus_metrics = []
    
    for name, value in metrics.counters.items():
        prometheus_metrics.append(f"# TYPE {name} counter")
        prometheus_metrics.append(f"{name} {value}")
    
    for name, value in metrics.gauges.items():
        prometheus_metrics.append(f"# TYPE {name} gauge")
        prometheus_metrics.append(f"{name} {value}")
    
    return Response(
        content="\n".join(prometheus_metrics),
        media_type="text/plain"
    )
```

## Performance Monitoring

### Database Query Monitoring

```python
# src/your_package/core/database.py
import time
from sqlalchemy import event

@event.listens_for(engine.sync_engine, "before_cursor_execute")
def receive_before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    """Log slow database queries."""
    context._query_start_time = time.time()

@event.listens_for(engine.sync_engine, "after_cursor_execute")
def receive_after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    """Log query completion."""
    total = time.time() - context._query_start_time
    
    # Log slow queries
    if total > 0.1:  # 100ms threshold
        logger.warning(
            "slow_query",
            duration_ms=round(total * 1000, 2),
            query=statement[:200],  # Truncate long queries
        )
    
    # Record metrics
    metrics.histogram("db_query_duration", total)
    metrics.increment("db_queries_total")
```

### Memory and CPU Monitoring

```python
# src/your_package/core/system_metrics.py
import psutil
import asyncio

async def collect_system_metrics():
    """Collect system metrics periodically."""
    while True:
        # CPU usage
        cpu_percent = psutil.cpu_percent(interval=1)
        metrics.gauge("system_cpu_percent", cpu_percent)
        
        # Memory usage
        memory = psutil.virtual_memory()
        metrics.gauge("system_memory_percent", memory.percent)
        metrics.gauge("system_memory_available_bytes", memory.available)
        
        # Disk usage
        disk = psutil.disk_usage('/')
        metrics.gauge("system_disk_percent", disk.percent)
        
        await asyncio.sleep(60)  # Collect every minute

# Start system metrics collection
asyncio.create_task(collect_system_metrics())
```

## Alerting

### Health Check Alerts

```python
# src/your_package/core/alerts.py
import structlog
from typing import Dict, Any

logger = structlog.get_logger("alerts")

class AlertManager:
    """Simple alert manager."""
    
    def __init__(self):
        self.alert_thresholds = {
            "response_time_ms": 1000,
            "error_rate_percent": 5.0,
            "cpu_percent": 80.0,
            "memory_percent": 85.0,
            "disk_percent": 90.0
        }
    
    def check_alerts(self, metrics_data: Dict[str, Any]):
        """Check metrics against thresholds and send alerts."""
        
        # Check response time
        if "request_duration" in metrics_data.get("histograms", {}):
            avg_response_time = metrics_data["histograms"]["request_duration"]["avg"] * 1000
            if avg_response_time > self.alert_thresholds["response_time_ms"]:
                self.send_alert(
                    "high_response_time",
                    f"Average response time: {avg_response_time:.2f}ms",
                    "warning"
                )
        
        # Check error rate
        total_requests = sum(v for k, v in metrics_data.get("counters", {}).items() 
                           if k.startswith("requests_total"))
        error_requests = sum(v for k, v in metrics_data.get("counters", {}).items() 
                           if k.startswith("responses_total") and ("5" in k or "4" in k))
        
        if total_requests > 0:
            error_rate = (error_requests / total_requests) * 100
            if error_rate > self.alert_thresholds["error_rate_percent"]:
                self.send_alert(
                    "high_error_rate",
                    f"Error rate: {error_rate:.2f}%",
                    "critical"
                )
    
    def send_alert(self, alert_type: str, message: str, severity: str):
        """Send alert notification."""
        logger.error(
            "alert_triggered",
            alert_type=alert_type,
            message=message,
            severity=severity
        )
        
        # Here you could integrate with:
        # - Slack webhooks
        # - Email notifications
        # - PagerDuty
        # - Discord webhooks
        # etc.

alert_manager = AlertManager()
```

## Monitoring Dashboard

### Simple Metrics Dashboard

```python
# src/your_package/api/v1/endpoints/dashboard.py
@router.get("/dashboard/metrics")
async def dashboard_metrics():
    """Get metrics for dashboard display."""
    current_metrics = metrics.get_metrics()
    
    # Calculate derived metrics
    dashboard_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "summary": {
            "total_requests": sum(v for k, v in current_metrics["counters"].items() 
                                if k.startswith("requests_total")),
            "avg_response_time_ms": 0,
            "error_rate_percent": 0,
            "active_connections": current_metrics["gauges"].get("active_connections", 0)
        },
        "health": await get_service_health_summary(),
        "system": {
            "cpu_percent": current_metrics["gauges"].get("system_cpu_percent", 0),
            "memory_percent": current_metrics["gauges"].get("system_memory_percent", 0),
            "disk_percent": current_metrics["gauges"].get("system_disk_percent", 0)
        }
    }
    
    # Calculate average response time
    if "request_duration" in current_metrics["histograms"]:
        dashboard_data["summary"]["avg_response_time_ms"] = (
            current_metrics["histograms"]["request_duration"]["avg"] * 1000
        )
    
    return dashboard_data

async def get_service_health_summary():
    """Get summary of service health."""
    try:
        url_manager = get_url_manager()
        health_urls = url_manager.health_check_urls()
        
        healthy_count = 0
        total_count = len(health_urls)
        
        async with httpx.AsyncClient(timeout=2.0) as client:
            for service_name, health_url in health_urls.items():
                try:
                    response = await client.get(health_url)
                    if response.status_code == 200:
                        healthy_count += 1
                except:
                    pass
        
        return {
            "healthy_services": healthy_count,
            "total_services": total_count,
            "health_percentage": (healthy_count / total_count * 100) if total_count > 0 else 100
        }
    except:
        return {"healthy_services": 0, "total_services": 0, "health_percentage": 0}
```

## CLI Monitoring Tools

The template includes CLI tools for monitoring:

```bash
# Check service health
make service-urls-health

# Test service connectivity
make service-urls-test

# View service URLs
make service-urls-list

# Check system status (Nix)
services_status
```

## Best Practices

### Logging

1. **Use structured logging** for better searchability
2. **Include context** (user_id, request_id, etc.)
3. **Log at appropriate levels** (DEBUG, INFO, WARNING, ERROR)
4. **Don't log sensitive information** (passwords, tokens)
5. **Use correlation IDs** for request tracing

### Metrics

1. **Collect key business metrics** (signups, orders, etc.)
2. **Monitor system resources** (CPU, memory, disk)
3. **Track API performance** (response times, error rates)
4. **Set up alerting thresholds** for critical metrics
5. **Use tags/labels** for metric dimensions

### Health Checks

1. **Include dependency checks** (database, external APIs)
2. **Keep health checks lightweight** and fast
3. **Return meaningful status information**
4. **Use different endpoints** for different check levels
5. **Monitor health check endpoints** themselves

Your application is now fully observable! 📊
