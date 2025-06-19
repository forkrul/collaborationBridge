"""Main API v1 router configuration.

This module sets up the main API router and includes all endpoint routers.
"""

from fastapi import APIRouter

from src.project_name.core.config import settings
from src.project_name.utils.service_url_manager import get_url_manager

# Create main API router
api_router = APIRouter(prefix=settings.API_PREFIX)

# Health check endpoint
@api_router.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint."""
    try:
        url_manager = get_url_manager()
        service_urls = url_manager.get_all_service_urls()
    except Exception:
        service_urls = {}

    return {
        "status": "healthy",
        "version": settings.API_VERSION,
        "environment": settings.ENVIRONMENT,
        "services": service_urls
    }

# Service discovery endpoint
@api_router.get("/services", tags=["services"])
async def get_services():
    """Get all service URLs for current environment."""
    try:
        url_manager = get_url_manager()
        return {
            "environment": url_manager.environment,
            "services": url_manager.get_all_service_urls(),
            "health_checks": url_manager.health_check_urls(),
            "available_environments": url_manager.list_environments()
        }
    except Exception as e:
        return {"error": str(e), "services": {}}

# Include i18n router
from src.project_name.api.v1.endpoints import i18n
api_router.include_router(i18n.router, prefix="/i18n", tags=["i18n"])

# Include other routers here as they are created
# Example:
# from src.project_name.api.v1.endpoints import users
# api_router.include_router(users.router, prefix="/users", tags=["users"])
