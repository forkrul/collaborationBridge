"""Tests for Service URL Manager."""

import json
from unittest.mock import mock_open, patch

import pytest

from src.project_name.utils.service_url_manager import (
    ServiceURLManager,
    get_api_endpoint,
    get_service_url,
    get_url_manager,
)


@pytest.fixture
def sample_config():
    """Sample configuration for testing."""
    return {
        "environments": {
            "development": {
                "domain": "localhost",
                "protocol": "http",
                "services": {
                    "api": {
                        "subdomain": None,
                        "port": 8000,
                        "path": "",
                        "health_endpoint": "/health",
                    },
                    "frontend": {
                        "subdomain": None,
                        "port": 3000,
                        "path": "/app",
                        "health_endpoint": "/status",
                    },
                },
            },
            "production": {
                "domain": "example.com",
                "protocol": "https",
                "services": {
                    "api": {
                        "subdomain": "api",
                        "port": None,
                        "path": "",
                        "health_endpoint": "/health",
                    },
                    "frontend": {
                        "subdomain": "app",
                        "port": None,
                        "path": "",
                        "health_endpoint": "/status",
                    },
                },
            },
        },
        "api_endpoints": {
            "users": {"list": "/api/v1/users", "detail": "/api/v1/users/{user_id}"},
            "files": {"upload": "/api/v1/files/upload"},
        },
    }


@pytest.fixture
def mock_config_file(sample_config):
    """Mock configuration file."""
    config_json = json.dumps(sample_config)
    with patch("builtins.open", mock_open(read_data=config_json)):
        with patch("pathlib.Path.exists", return_value=True):
            yield


class TestServiceURLManager:
    """Test cases for ServiceURLManager class."""

    def test_init_with_environment(self, mock_config_file):
        """Test initialization with specific environment."""
        manager = ServiceURLManager(environment="production")
        assert manager.environment == "production"

    def test_init_with_config_path(self, mock_config_file):
        """Test initialization with custom config path."""
        with patch("pathlib.Path.exists", return_value=True):
            manager = ServiceURLManager(config_path="/custom/path.json")
            assert str(manager.config_path) == "/custom/path.json"

    def test_init_missing_config_file(self):
        """Test initialization with missing config file."""
        with patch("pathlib.Path.exists", return_value=False):
            with pytest.raises(FileNotFoundError):
                ServiceURLManager()

    def test_init_invalid_json(self):
        """Test initialization with invalid JSON."""
        with patch("builtins.open", mock_open(read_data="invalid json")):
            with patch("pathlib.Path.exists", return_value=True):
                with pytest.raises(ValueError, match="Invalid JSON"):
                    ServiceURLManager()

    def test_init_invalid_environment(self, mock_config_file):
        """Test initialization with invalid environment."""
        with pytest.raises(ValueError, match="Environment 'invalid' not found"):
            ServiceURLManager(environment="invalid")

    def test_get_service_url_port_based(self, mock_config_file):
        """Test getting service URL with port-based routing."""
        manager = ServiceURLManager(environment="development")
        url = manager.get_service_url("api")
        assert url == "http://localhost:8000"

    def test_get_service_url_subdomain_based(self, mock_config_file):
        """Test getting service URL with subdomain-based routing."""
        manager = ServiceURLManager(environment="production")
        url = manager.get_service_url("api")
        assert url == "https://api.example.com"

    def test_get_service_url_with_path(self, mock_config_file):
        """Test getting service URL with service path."""
        manager = ServiceURLManager(environment="development")
        url = manager.get_service_url("frontend")
        assert url == "http://localhost:3000/app"

    def test_get_service_url_with_health(self, mock_config_file):
        """Test getting service URL with health endpoint."""
        manager = ServiceURLManager(environment="development")
        url = manager.get_service_url("api", include_health=True)
        assert url == "http://localhost:8000/health"

    def test_get_service_url_invalid_service(self, mock_config_file):
        """Test getting URL for invalid service."""
        manager = ServiceURLManager(environment="development")
        with pytest.raises(ValueError, match="Service 'invalid' not found"):
            manager.get_service_url("invalid")

    def test_get_all_service_urls(self, mock_config_file):
        """Test getting all service URLs."""
        manager = ServiceURLManager(environment="development")
        urls = manager.get_all_service_urls()

        expected = {
            "api": "http://localhost:8000",
            "frontend": "http://localhost:3000/app",
        }
        assert urls == expected

    def test_health_check_urls(self, mock_config_file):
        """Test getting health check URLs."""
        manager = ServiceURLManager(environment="development")
        health_urls = manager.health_check_urls()

        expected = {
            "api": "http://localhost:8000/health",
            "frontend": "http://localhost:3000/app/status",
        }
        assert health_urls == expected

    def test_get_api_endpoint_simple(self, mock_config_file):
        """Test getting simple API endpoint."""
        manager = ServiceURLManager(environment="development")
        endpoint = manager.get_api_endpoint("files", "upload")
        assert endpoint == "http://localhost:8000/api/v1/files/upload"

    def test_get_api_endpoint_with_parameters(self, mock_config_file):
        """Test getting API endpoint with parameters."""
        manager = ServiceURLManager(environment="development")
        endpoint = manager.get_api_endpoint("users", "detail", user_id=123)
        assert endpoint == "http://localhost:8000/api/v1/users/123"

    def test_get_api_endpoint_missing_parameter(self, mock_config_file):
        """Test getting API endpoint with missing parameter."""
        manager = ServiceURLManager(environment="development")
        with pytest.raises(ValueError, match="Missing parameter"):
            manager.get_api_endpoint("users", "detail")

    def test_get_api_endpoint_invalid_category(self, mock_config_file):
        """Test getting API endpoint with invalid category."""
        manager = ServiceURLManager(environment="development")
        with pytest.raises(ValueError, match="API category 'invalid' not found"):
            manager.get_api_endpoint("invalid", "endpoint")

    def test_get_api_endpoint_invalid_endpoint(self, mock_config_file):
        """Test getting API endpoint with invalid endpoint."""
        manager = ServiceURLManager(environment="development")
        with pytest.raises(ValueError, match="Endpoint 'invalid' not found"):
            manager.get_api_endpoint("users", "invalid")

    def test_switch_environment(self, mock_config_file):
        """Test switching environments."""
        manager = ServiceURLManager(environment="development")
        assert manager.environment == "development"

        manager.switch_environment("production")
        assert manager.environment == "production"

        # Test URL generation in new environment
        url = manager.get_service_url("api")
        assert url == "https://api.example.com"

    def test_switch_environment_invalid(self, mock_config_file):
        """Test switching to invalid environment."""
        manager = ServiceURLManager(environment="development")
        with pytest.raises(ValueError, match="Environment 'invalid' not found"):
            manager.switch_environment("invalid")

    def test_list_environments(self, mock_config_file):
        """Test listing environments."""
        manager = ServiceURLManager(environment="development")
        environments = manager.list_environments()
        assert set(environments) == {"development", "production"}

    def test_list_services(self, mock_config_file):
        """Test listing services."""
        manager = ServiceURLManager(environment="development")
        services = manager.list_services()
        assert set(services) == {"api", "frontend"}

    def test_get_environment_info(self, mock_config_file):
        """Test getting environment info."""
        manager = ServiceURLManager(environment="development")
        info = manager.get_environment_info()

        assert info["domain"] == "localhost"
        assert info["protocol"] == "http"
        assert "services" in info


class TestConvenienceFunctions:
    """Test cases for convenience functions."""

    def test_get_url_manager(self, mock_config_file):
        """Test get_url_manager convenience function."""
        manager = get_url_manager("development")
        assert isinstance(manager, ServiceURLManager)
        assert manager.environment == "development"

    def test_get_service_url_convenience(self, mock_config_file):
        """Test get_service_url convenience function."""
        url = get_service_url("api", "development")
        assert url == "http://localhost:8000"

    def test_get_api_endpoint_convenience(self, mock_config_file):
        """Test get_api_endpoint convenience function."""
        endpoint = get_api_endpoint("users", "detail", "development", user_id=123)
        assert endpoint == "http://localhost:8000/api/v1/users/123"


class TestEnvironmentDetection:
    """Test cases for environment detection."""

    @patch.dict("os.environ", {"PROJECT_NAME_ENV": "staging"})
    def test_environment_detection_from_env_var(self, mock_config_file, sample_config):
        """Test environment detection from environment variable."""
        # Add staging environment to config
        sample_config["environments"]["staging"] = sample_config["environments"][
            "development"
        ]

        config_json = json.dumps(sample_config)
        with patch("builtins.open", mock_open(read_data=config_json)):
            with patch("pathlib.Path.exists", return_value=True):
                with patch(
                    "src.project_name.utils.service_url_manager.settings.PROJECT_NAME",
                    "project-name",
                ):
                    manager = ServiceURLManager()
                    assert manager.environment == "staging"

    def test_environment_detection_fallback(self, mock_config_file):
        """Test environment detection fallback to development."""
        with patch(
            "src.project_name.utils.service_url_manager.settings.ENVIRONMENT",
            "development",
        ):
            manager = ServiceURLManager()
            assert manager.environment == "development"
