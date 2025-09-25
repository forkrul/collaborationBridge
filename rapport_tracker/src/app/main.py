from fastapi import FastAPI
from src.app.core.config import settings

app = FastAPI(
    title="Rapport Tracker API",
    description="API for tracking interactions and analyzing rapport-building techniques.",
    version="0.1.0"
)

# Future expansion: Include routers here
# from src.app.api import router
# app.include_router(router)

@app.get("/")
async def root():
    """Root endpoint for the API."""
    return {"message": f"Welcome to the Rapport Tracker API - Env: {settings.ENVIRONMENT}"}