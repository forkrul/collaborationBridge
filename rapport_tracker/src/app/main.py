from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from sqlalchemy import select

from src.app.core.config import settings
from src.app.core.database import AsyncSessionLocal
from src.app.core.seed_data import SEED_TACTICS
from src.app.models.rapport import RapportTactic

# Import the routers
from src.app.api.v1.contacts import router as contacts_v1_router
from src.app.api.v1.interactions import router as interactions_v1_router
from src.app.api.v1.rapport import router as rapport_v1_router

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
    title="Rapport Tracker API",
    description="API for tracking interactions and analyzing rapport-building techniques.",
    version="0.1.0",
    lifespan=lifespan  # Hook the lifespan manager to the app
)

# Setup the main API router structure
api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(contacts_v1_router, prefix="/contacts", tags=["Contacts"])
api_v1_router.include_router(interactions_v1_router, prefix="/interactions", tags=["Interactions"])
api_v1_router.include_router(rapport_v1_router, prefix="/rapport", tags=["Rapport"])

app.include_router(api_v1_router)

@app.get("/")
async def root():
    """Root endpoint for the API."""
    return {"message": f"Welcome to the Rapport Tracker API - Env: {settings.ENVIRONMENT}"}