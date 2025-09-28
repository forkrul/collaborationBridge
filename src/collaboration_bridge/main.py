from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import APIRouter, FastAPI
from sqlalchemy import select

# Import the routers
from src.collaboration_bridge.api.v1.contacts import router as contacts_v1_router
from src.collaboration_bridge.api.v1.interactions import (
    router as interactions_v1_router,
)
from src.collaboration_bridge.api.v1.onboarding import router as onboarding_v1_router
from src.collaboration_bridge.api.v1.rapport import router as rapport_v1_router
from src.collaboration_bridge.api.v1.users import router as users_v1_router
from src.collaboration_bridge.core.config import settings
from src.collaboration_bridge.core.database import AsyncSessionLocal
from src.collaboration_bridge.core.seed_data import SEED_TACTICS
from src.collaboration_bridge.models.rapport import RapportTactic


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager to handle startup and shutdown events.
    Seeds the database with rapport tactics on startup if the table is empty.
    """
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(RapportTactic))
        if result.scalars().first() is None:
            for tactic_data in SEED_TACTICS:
                db.add(RapportTactic(**tactic_data))
            await db.commit()
    yield
    # Shutdown logic can be added here if needed

app = FastAPI(
    title="Collaboration Bridge API",
    description="A science-backed manager interaction tracking application for building better workplace relationships through validated rapport-building techniques.",
    version="0.1.0",
    lifespan=lifespan,  # Hook the lifespan manager to the app
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Setup the main API router structure
api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(users_v1_router, prefix="/users", tags=["Users"])
api_v1_router.include_router(
    onboarding_v1_router, prefix="/onboarding", tags=["Onboarding"]
)
api_v1_router.include_router(contacts_v1_router, prefix="/contacts", tags=["Contacts"])
api_v1_router.include_router(interactions_v1_router, prefix="/interactions", tags=["Interactions"])
api_v1_router.include_router(rapport_v1_router, prefix="/rapport", tags=["Rapport"])

app.include_router(api_v1_router)

@app.get("/")
async def root():
    """Root endpoint for the Collaboration Bridge API."""
    return {
        "message": f"Welcome to the Collaboration Bridge API - Env: {settings.ENVIRONMENT}",
        "description": "A science-backed manager interaction tracking application",
        "version": "0.1.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "environment": settings.ENVIRONMENT
    }
