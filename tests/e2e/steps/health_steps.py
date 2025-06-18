"""BDD steps for health check feature."""

import requests
from behave import given, when, then


@given("the application is running")
def step_application_running(context):
    """Ensure the application is running."""
    context.base_url = "http://localhost:8000"


@when("I request the health endpoint")
def step_request_health(context):
    """Request the health endpoint."""
    context.response = requests.get(f"{context.base_url}/api/v1/health")


@when("I request the root endpoint")
def step_request_root(context):
    """Request the root endpoint."""
    context.response = requests.get(f"{context.base_url}/")


@then("the response should indicate the application is healthy")
def step_check_healthy(context):
    """Check that the response indicates healthy status."""
    assert context.response.status_code == 200
    data = context.response.json()
    assert data["status"] == "healthy"


@then("the response should include version information")
def step_check_version(context):
    """Check that the response includes version information."""
    data = context.response.json()
    assert "version" in data


@then("the response should include a welcome message")
def step_check_welcome(context):
    """Check that the response includes a welcome message."""
    assert context.response.status_code == 200
    data = context.response.json()
    assert "message" in data


@then("the response should include API documentation links")
def step_check_docs_links(context):
    """Check that the response includes documentation links."""
    data = context.response.json()
    # docs_url can be None if docs are disabled
    assert "docs_url" in data
