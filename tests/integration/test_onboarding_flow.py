import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from src.collaboration_bridge.schemas.onboarding import OnboardingStatus

pytestmark = pytest.mark.asyncio


async def test_full_onboarding_flow(client: AsyncClient, db_session: AsyncSession):
    """
    Tests the complete user onboarding flow from registration to completion.
    """
    # 1. Register a new user
    registration_data = {
        "email": "test.user@example.com",
        "full_name": "Test User",
        "password": "a_secure_password",
    }
    response = await client.post("/api/v1/users/", json=registration_data)
    assert response.status_code == 201
    user_data = response.json()
    assert user_data["email"] == registration_data["email"]
    assert user_data["full_name"] == registration_data["full_name"]

    # 2. Log in and get an access token
    login_data = {
        "username": registration_data["email"],
        "password": registration_data["password"],
    }
    response = await client.post("/api/v1/users/token", data=login_data)
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}

    # 3. Check initial onboarding status
    response = await client.get("/api/v1/onboarding/status", headers=headers)
    assert response.status_code == 200
    onboarding_status = response.json()
    assert onboarding_status["status"] == OnboardingStatus.NOT_STARTED
    assert not onboarding_status["is_complete"]

    # 4. Add the first contact
    contact_data = {
        "name": "Test Manager",
        "title": "Manager",
        "level": "Direct Manager",
    }
    response = await client.post("/api/v1/contacts/", json=contact_data, headers=headers)
    assert response.status_code == 201
    contact_response = response.json()
    contact_id = contact_response["id"]

    # 5. Check onboarding status after adding contact
    response = await client.get("/api/v1/onboarding/status", headers=headers)
    assert response.status_code == 200
    onboarding_status = response.json()
    assert onboarding_status["status"] == OnboardingStatus.FIRST_CONTACT_ADDED

    # 6. Log the first interaction
    interaction_data = {
        "interaction": {
            "contact_id": contact_id,
            "interaction_datetime": "2024-01-01T10:00:00Z",
            "medium": "Email/Chat",
            "topic": "First Meeting",
            "rapport_score_post": 8,
            "observed_non_verbal": "Positive",
            "user_notes": "Good first meeting.",
        },
        "tactic_logs": [],
    }
    response = await client.post("/api/v1/interactions/", json=interaction_data, headers=headers)
    assert response.status_code == 201

    # 7. Check onboarding status after logging interaction
    response = await client.get("/api/v1/onboarding/status", headers=headers)
    assert response.status_code == 200
    onboarding_status = response.json()
    assert onboarding_status["status"] == OnboardingStatus.COMPLETED
    assert onboarding_status["is_complete"]