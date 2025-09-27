"""Test the main application functionality."""

import pytest
from httpx import AsyncClient, ASGITransport
from src.collaboration_bridge.main import app


@pytest.mark.asyncio
async def test_root_endpoint():
    """Test the root endpoint returns correct information."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/")
        
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Collaboration Bridge" in data["message"]
    assert data["description"] == "A science-backed manager interaction tracking application"
    assert data["version"] == "0.1.0"


@pytest.mark.asyncio
async def test_health_endpoint():
    """Test the health check endpoint."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/health")
        
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert "environment" in data


@pytest.mark.asyncio
async def test_docs_endpoint():
    """Test that the API documentation is available."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/docs")
        
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]


@pytest.mark.asyncio
async def test_openapi_endpoint():
    """Test that the OpenAPI schema is available."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/openapi.json")
        
    assert response.status_code == 200
    data = response.json()
    assert data["info"]["title"] == "Collaboration Bridge API"
    assert data["info"]["version"] == "0.1.0"
    assert "paths" in data
