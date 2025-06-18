"""Service URL Manager - Centralized URL management system.

This module provides a centralized URL management system designed to handle
service discovery, URL generation, and environment-specific configuration
across different deployment scenarios.

Example:
    Basic usage:
        manager = ServiceURLManager('production')
        api_url = manager.get_service_url('api')
        
    API endpoint generation:
        upload_endpoint = manager.get_api_endpoint('files', 'upload')
        user_profile = manager.get_api_endpoint('users', 'profile', user_id=123)
        
    Health check URLs:
        health_urls = manager.health_check_urls()
"""

import json
import os
from pathlib import Path
from typing import Any, Dict, Optional
from urllib.parse import urljoin

from src.project_name.core.config import settings


class ServiceURLManager:
    """Centralized service URL management with environment-aware configuration.
    
    Provides dynamic URL construction, service discovery, and API endpoint
    management across multiple deployment environments.
    
    Attributes:
        environment: Current environment name.
        config: Loaded configuration dictionary.
    """
    
    def __init__(self, environment: Optional[str] = None, config_path: Optional[str] = None):
        """Initialize the Service URL Manager.
        
        Args:
            environment: Target environment name. Defaults to environment variable
                        or 'development'.
            config_path: Path to configuration JSON file. Defaults to
                        project-relative path.
                        
        Raises:
            ValueError: If configuration file is not found or environment is invalid.
            FileNotFoundError: If configuration file doesn't exist.
        """
        self.environment = environment or self._detect_environment()
        self.config_path = Path(config_path or self._default_config_path())
        self.config = self._load_configuration()
        self._validate_environment()
    
    def _detect_environment(self) -> str:
        """Detect environment from environment variables or settings."""
        # Try project-specific environment variable first
        project_env = os.getenv(f"{settings.PROJECT_NAME.upper().replace('-', '_')}_ENV")
        if project_env:
            return project_env
            
        # Fall back to general environment setting
        return getattr(settings, 'ENVIRONMENT', 'development')
    
    def _default_config_path(self) -> str:
        """Get default configuration file path."""
        project_root = Path(__file__).parent.parent.parent.parent
        return project_root / "config" / "service-urls.json"
    
    def _load_configuration(self) -> Dict[str, Any]:
        """Load and parse JSON configuration file.
        
        Returns:
            Parsed configuration dictionary.
            
        Raises:
            FileNotFoundError: If configuration file doesn't exist.
            ValueError: If configuration file is invalid JSON.
        """
        if not self.config_path.exists():
            raise FileNotFoundError(f"Configuration file not found: {self.config_path}")
        
        try:
            with open(self.config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in configuration file: {e}")
    
    def _validate_environment(self) -> None:
        """Validate that the current environment exists in configuration.
        
        Raises:
            ValueError: If environment is not found in configuration.
        """
        if self.environment not in self.config.get('environments', {}):
            available = list(self.config.get('environments', {}).keys())
            raise ValueError(
                f"Environment '{self.environment}' not found. "
                f"Available environments: {available}"
            )
    
    def get_service_url(self, service_name: str, include_health: bool = False) -> str:
        """Get URL for a specific service.
        
        Args:
            service_name: Name of the service.
            include_health: Whether to append health check endpoint.
            
        Returns:
            Complete service URL.
            
        Raises:
            ValueError: If service is not found in current environment.
        """
        env_config = self.config['environments'][self.environment]
        services = env_config.get('services', {})
        
        if service_name not in services:
            available = list(services.keys())
            raise ValueError(
                f"Service '{service_name}' not found in environment '{self.environment}'. "
                f"Available services: {available}"
            )
        
        service_config = services[service_name]
        base_url = self._build_service_base_url(env_config, service_config)
        
        if include_health:
            health_endpoint = service_config.get('health_endpoint', '/health')
            return urljoin(base_url, health_endpoint.lstrip('/'))
        
        return base_url
    
    def _build_service_base_url(self, env_config: Dict[str, Any], service_config: Dict[str, Any]) -> str:
        """Build base URL for a service.
        
        Args:
            env_config: Environment configuration.
            service_config: Service configuration.
            
        Returns:
            Base URL for the service.
        """
        protocol = env_config.get('protocol', 'http')
        domain = env_config['domain']
        
        # Build host
        subdomain = service_config.get('subdomain')
        if subdomain:
            host = f"{subdomain}.{domain}"
        else:
            host = domain
        
        # Add port if specified
        port = service_config.get('port')
        if port:
            host = f"{host}:{port}"
        
        # Build base URL
        base_url = f"{protocol}://{host}"
        
        # Add service path
        service_path = service_config.get('path', '')
        if service_path:
            base_url = urljoin(base_url, service_path.lstrip('/'))
        
        return base_url
    
    def get_all_service_urls(self, include_health: bool = False) -> Dict[str, str]:
        """Get URLs for all services in current environment.
        
        Args:
            include_health: Whether to append health check endpoints.
            
        Returns:
            Dictionary mapping service names to URLs.
        """
        services = self.config['environments'][self.environment].get('services', {})
        return {
            service_name: self.get_service_url(service_name, include_health)
            for service_name in services.keys()
        }
    
    def health_check_urls(self) -> Dict[str, str]:
        """Get health check URLs for all services.
        
        Returns:
            Dictionary mapping service names to health check URLs.
        """
        return self.get_all_service_urls(include_health=True)
    
    def get_api_endpoint(self, category: str, endpoint: str, **kwargs) -> str:
        """Get API endpoint URL with parameter substitution.
        
        Args:
            category: API endpoint category.
            endpoint: Endpoint name within category.
            **kwargs: Parameters for URL template substitution.
            
        Returns:
            Complete API endpoint URL.
            
        Raises:
            ValueError: If category or endpoint is not found.
        """
        api_endpoints = self.config.get('api_endpoints', {})
        
        if category not in api_endpoints:
            available = list(api_endpoints.keys())
            raise ValueError(
                f"API category '{category}' not found. "
                f"Available categories: {available}"
            )
        
        category_endpoints = api_endpoints[category]
        if endpoint not in category_endpoints:
            available = list(category_endpoints.keys())
            raise ValueError(
                f"Endpoint '{endpoint}' not found in category '{category}'. "
                f"Available endpoints: {available}"
            )
        
        # Get endpoint template and substitute parameters
        endpoint_template = category_endpoints[endpoint]
        try:
            endpoint_path = endpoint_template.format(**kwargs)
        except KeyError as e:
            raise ValueError(f"Missing parameter for endpoint template: {e}")
        
        # Get base API service URL
        api_base_url = self.get_service_url('api')
        return urljoin(api_base_url, endpoint_path.lstrip('/'))
    
    def switch_environment(self, new_environment: str) -> None:
        """Switch to a different environment.
        
        Args:
            new_environment: Name of the new environment.
            
        Raises:
            ValueError: If new environment is not found in configuration.
        """
        if new_environment not in self.config.get('environments', {}):
            available = list(self.config.get('environments', {}).keys())
            raise ValueError(
                f"Environment '{new_environment}' not found. "
                f"Available environments: {available}"
            )
        
        self.environment = new_environment
    
    def list_environments(self) -> list:
        """List all available environments.
        
        Returns:
            List of environment names.
        """
        return list(self.config.get('environments', {}).keys())
    
    def list_services(self) -> list:
        """List all services in current environment.
        
        Returns:
            List of service names.
        """
        return list(
            self.config['environments'][self.environment].get('services', {}).keys()
        )
    
    def get_environment_info(self) -> Dict[str, Any]:
        """Get information about current environment.
        
        Returns:
            Environment configuration dictionary.
        """
        return self.config['environments'][self.environment].copy()


# Convenience functions for common operations
_default_manager: Optional[ServiceURLManager] = None


def get_url_manager(environment: Optional[str] = None) -> ServiceURLManager:
    """Get or create a ServiceURLManager instance.
    
    Args:
        environment: Target environment name.
        
    Returns:
        ServiceURLManager instance.
    """
    global _default_manager
    
    if _default_manager is None or (environment and _default_manager.environment != environment):
        _default_manager = ServiceURLManager(environment)
    
    return _default_manager


def get_service_url(service_name: str, environment: Optional[str] = None) -> str:
    """Convenience function to get a service URL.
    
    Args:
        service_name: Name of the service.
        environment: Target environment name.
        
    Returns:
        Service URL.
    """
    manager = get_url_manager(environment)
    return manager.get_service_url(service_name)


def get_api_endpoint(category: str, endpoint: str, environment: Optional[str] = None, **kwargs) -> str:
    """Convenience function to get an API endpoint URL.
    
    Args:
        category: API endpoint category.
        endpoint: Endpoint name within category.
        environment: Target environment name.
        **kwargs: Parameters for URL template substitution.
        
    Returns:
        API endpoint URL.
    """
    manager = get_url_manager(environment)
    return manager.get_api_endpoint(category, endpoint, **kwargs)
