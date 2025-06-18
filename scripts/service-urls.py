#!/usr/bin/env python3
"""Service URL Manager CLI tool.

This script provides a command-line interface for managing and testing
service URLs across different environments.

Usage:
    python scripts/service-urls.py list-environments
    python scripts/service-urls.py list-services --env production
    python scripts/service-urls.py get-url api --env staging
    python scripts/service-urls.py health-check --env development
    python scripts/service-urls.py test-endpoints --env production
"""

import argparse
import asyncio
import json
import sys
from pathlib import Path
from typing import Dict, Any

import httpx
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from project_name.utils.service_url_manager import ServiceURLManager

console = Console()


def create_parser() -> argparse.ArgumentParser:
    """Create command line argument parser."""
    parser = argparse.ArgumentParser(
        description="Service URL Manager CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    
    parser.add_argument(
        "--env", 
        default=None,
        help="Environment to use (default: auto-detect)"
    )
    
    parser.add_argument(
        "--config",
        default=None,
        help="Path to configuration file"
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # List environments
    subparsers.add_parser(
        "list-environments",
        help="List all available environments"
    )
    
    # List services
    subparsers.add_parser(
        "list-services",
        help="List all services in current environment"
    )
    
    # Get service URL
    url_parser = subparsers.add_parser(
        "get-url",
        help="Get URL for a specific service"
    )
    url_parser.add_argument("service", help="Service name")
    url_parser.add_argument("--health", action="store_true", help="Include health endpoint")
    
    # Get API endpoint
    api_parser = subparsers.add_parser(
        "get-endpoint",
        help="Get API endpoint URL"
    )
    api_parser.add_argument("category", help="API category")
    api_parser.add_argument("endpoint", help="Endpoint name")
    api_parser.add_argument("--params", help="JSON string of parameters")
    
    # Health check
    subparsers.add_parser(
        "health-check",
        help="Check health of all services"
    )
    
    # Test endpoints
    test_parser = subparsers.add_parser(
        "test-endpoints",
        help="Test connectivity to all service endpoints"
    )
    test_parser.add_argument("--timeout", type=int, default=5, help="Request timeout in seconds")
    
    # Environment info
    subparsers.add_parser(
        "env-info",
        help="Show environment configuration"
    )
    
    return parser


def list_environments(manager: ServiceURLManager) -> None:
    """List all available environments."""
    environments = manager.list_environments()
    
    table = Table(title="Available Environments")
    table.add_column("Environment", style="cyan")
    table.add_column("Current", style="green")
    
    for env in environments:
        is_current = "✓" if env == manager.environment else ""
        table.add_row(env, is_current)
    
    console.print(table)


def list_services(manager: ServiceURLManager) -> None:
    """List all services in current environment."""
    services = manager.list_services()
    service_urls = manager.get_all_service_urls()
    
    table = Table(title=f"Services in '{manager.environment}' Environment")
    table.add_column("Service", style="cyan")
    table.add_column("URL", style="green")
    
    for service in services:
        url = service_urls.get(service, "N/A")
        table.add_row(service, url)
    
    console.print(table)


def get_service_url(manager: ServiceURLManager, service: str, include_health: bool = False) -> None:
    """Get URL for a specific service."""
    try:
        url = manager.get_service_url(service, include_health=include_health)
        
        panel_title = f"Service URL: {service}"
        if include_health:
            panel_title += " (with health endpoint)"
        
        console.print(Panel(url, title=panel_title, style="green"))
    except ValueError as e:
        console.print(f"[red]Error: {e}[/red]")


def get_api_endpoint(manager: ServiceURLManager, category: str, endpoint: str, params: str = None) -> None:
    """Get API endpoint URL."""
    try:
        kwargs = {}
        if params:
            kwargs = json.loads(params)
        
        url = manager.get_api_endpoint(category, endpoint, **kwargs)
        
        panel_title = f"API Endpoint: {category}.{endpoint}"
        console.print(Panel(url, title=panel_title, style="green"))
    except (ValueError, json.JSONDecodeError) as e:
        console.print(f"[red]Error: {e}[/red]")


async def health_check(manager: ServiceURLManager) -> None:
    """Check health of all services."""
    health_urls = manager.health_check_urls()
    
    table = Table(title=f"Health Check Results - {manager.environment}")
    table.add_column("Service", style="cyan")
    table.add_column("URL", style="blue")
    table.add_column("Status", style="bold")
    table.add_column("Response Time", style="yellow")
    
    async with httpx.AsyncClient(timeout=5.0) as client:
        for service, url in health_urls.items():
            if not url or url.endswith("null"):
                table.add_row(service, "N/A", "[yellow]No health endpoint[/yellow]", "N/A")
                continue
            
            try:
                import time
                start_time = time.time()
                response = await client.get(url)
                response_time = f"{(time.time() - start_time) * 1000:.0f}ms"
                
                if response.status_code == 200:
                    status = "[green]✓ Healthy[/green]"
                else:
                    status = f"[red]✗ Error ({response.status_code})[/red]"
                
                table.add_row(service, url, status, response_time)
            except Exception as e:
                table.add_row(service, url, f"[red]✗ Failed: {str(e)[:30]}[/red]", "N/A")
    
    console.print(table)


async def test_endpoints(manager: ServiceURLManager, timeout: int = 5) -> None:
    """Test connectivity to all service endpoints."""
    service_urls = manager.get_all_service_urls()
    
    table = Table(title=f"Endpoint Connectivity Test - {manager.environment}")
    table.add_column("Service", style="cyan")
    table.add_column("URL", style="blue")
    table.add_column("Status", style="bold")
    table.add_column("Response Time", style="yellow")
    
    async with httpx.AsyncClient(timeout=timeout) as client:
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            console=console
        ) as progress:
            task = progress.add_task("Testing endpoints...", total=len(service_urls))
            
            for service, url in service_urls.items():
                progress.update(task, description=f"Testing {service}...")
                
                try:
                    import time
                    start_time = time.time()
                    response = await client.get(url)
                    response_time = f"{(time.time() - start_time) * 1000:.0f}ms"
                    
                    if response.status_code < 400:
                        status = f"[green]✓ {response.status_code}[/green]"
                    else:
                        status = f"[yellow]⚠ {response.status_code}[/yellow]"
                    
                    table.add_row(service, url, status, response_time)
                except Exception as e:
                    table.add_row(service, url, f"[red]✗ {str(e)[:30]}[/red]", "N/A")
                
                progress.advance(task)
    
    console.print(table)


def show_environment_info(manager: ServiceURLManager) -> None:
    """Show environment configuration."""
    info = manager.get_environment_info()
    
    # Basic info
    console.print(Panel(
        f"Environment: [cyan]{manager.environment}[/cyan]\n"
        f"Domain: [green]{info.get('domain', 'N/A')}[/green]\n"
        f"Protocol: [blue]{info.get('protocol', 'N/A')}[/blue]",
        title="Environment Configuration"
    ))
    
    # Services table
    services = info.get('services', {})
    if services:
        table = Table(title="Service Configuration")
        table.add_column("Service", style="cyan")
        table.add_column("Subdomain", style="blue")
        table.add_column("Port", style="yellow")
        table.add_column("Path", style="green")
        table.add_column("Health Endpoint", style="magenta")
        
        for service_name, service_config in services.items():
            table.add_row(
                service_name,
                service_config.get('subdomain') or "N/A",
                str(service_config.get('port')) if service_config.get('port') else "N/A",
                service_config.get('path') or "/",
                service_config.get('health_endpoint') or "N/A"
            )
        
        console.print(table)


def main():
    """Main CLI function."""
    parser = create_parser()
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    try:
        manager = ServiceURLManager(
            environment=args.env,
            config_path=args.config
        )
        
        if args.command == "list-environments":
            list_environments(manager)
        elif args.command == "list-services":
            list_services(manager)
        elif args.command == "get-url":
            get_service_url(manager, args.service, args.health)
        elif args.command == "get-endpoint":
            get_api_endpoint(manager, args.category, args.endpoint, args.params)
        elif args.command == "health-check":
            asyncio.run(health_check(manager))
        elif args.command == "test-endpoints":
            asyncio.run(test_endpoints(manager, args.timeout))
        elif args.command == "env-info":
            show_environment_info(manager)
        
    except Exception as e:
        console.print(f"[red]Error: {e}[/red]")
        sys.exit(1)


if __name__ == "__main__":
    main()
