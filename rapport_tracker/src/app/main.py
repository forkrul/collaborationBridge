from fastapi import FastAPI, APIRouter
from src.app.core.config import settings

# Import the routers
from src.app.api.v1.contacts import router as contacts_v1_router
# Future routers (interactions, tactics) will be imported here

app = FastAPI(
    title="Rapport Tracker API",
    description="API for tracking interactions and analyzing rapport-building techniques.",
    version="0.1.0"
)

# Setup the main API router structure
api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(contacts_v1_router, prefix="/contacts", tags=["Contacts"])
# api_v1_router.include_router(interactions_v1_router, prefix="/interactions", tags=["Interactions"])

app.include_router(api_v1_router)

@app.get("/")
async def root():
    """Root endpoint for the API."""
    return {"message": f"Welcome to the Rapport Tracker API - Env: {settings.ENVIRONMENT}"}