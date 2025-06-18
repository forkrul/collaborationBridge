"""Main API v1 router configuration.

This module sets up the main API router and includes all endpoint routers.
"""

from fastapi import APIRouter

from src.project_name.core.config import settings

# Create main API router
api_router = APIRouter(prefix=settings.API_PREFIX)

# Health check endpoint
@api_router.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": settings.API_VERSION,
        "environment": settings.ENVIRONMENT
    }

# Include other routers here as they are created
# Example:
# from src.project_name.api.v1.endpoints import users
# api_router.include_router(users.router, prefix="/users", tags=["users"])
