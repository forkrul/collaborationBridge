{ pkgs ? import <nixpkgs> {} }:

let
  # Python version to use
  python = pkgs.python311;
  
  # Python packages from nixpkgs
  pythonPackages = python.pkgs;
  
  # Custom Python environment with packages
  pythonEnv = python.withPackages (ps: with ps; [
    # Core dependencies
    fastapi
    uvicorn
    pydantic
    pydantic-settings
    sqlalchemy
    alembic
    asyncpg
    aiosqlite
    redis
    httpx
    python-jose
    passlib
    python-multipart
    email-validator
    structlog
    sentry-sdk
    
    # Development dependencies
    ruff
    black
    isort
    mypy
    pre-commit
    ipython
    rich
    
    # Testing dependencies
    pytest
    pytest-asyncio
    pytest-cov
    pytest-env
    factory-boy
    faker
    
    # Documentation dependencies
    sphinx
    sphinx-rtd-theme
    myst-parser
    
    # Additional useful packages
    pip
    setuptools
    wheel
    poetry
  ]);

in pkgs.mkShell {
  name = "python-mvp-template";
  
  buildInputs = with pkgs; [
    # Python environment
    pythonEnv
    
    # Database tools
    postgresql_16
    redis
    sqlite
    
    # Development tools
    git
    curl
    wget
    jq
    
    # Docker and containerization
    docker
    docker-compose
    
    # Documentation tools
    pandoc
    graphviz
    
    # Node.js for some documentation tools
    nodejs_20
    
    # System dependencies
    gcc
    pkg-config
    openssl
    libffi
    zlib
    
    # Shell utilities
    bash
    coreutils
    findutils
    gnugrep
    gnused
    gawk
    
    # Network tools
    netcat
    
    # Process management
    procps
    
    # File watching (for development)
    inotify-tools
    
    # Encryption tools
    gnupg
    
    # Archive tools
    unzip
    zip
    tar
    gzip
  ];
  
  shellHook = ''
    echo "🚀 Python MVP Template Development Environment"
    echo "=============================================="
    echo ""
    echo "📦 Available tools:"
    echo "  Python:        $(python --version)"
    echo "  Poetry:        $(poetry --version 2>/dev/null || echo 'Not available')"
    echo "  PostgreSQL:    $(postgres --version | head -n1)"
    echo "  Redis:         $(redis-server --version)"
    echo "  Docker:        $(docker --version 2>/dev/null || echo 'Not available')"
    echo "  Node.js:       $(node --version 2>/dev/null || echo 'Not available')"
    echo ""
    echo "🛠️  Quick commands:"
    echo "  make install   - Install Python dependencies"
    echo "  make dev       - Start development server"
    echo "  make test      - Run tests"
    echo "  make docs      - Build documentation"
    echo "  make lint      - Run linting"
    echo ""
    echo "💡 Environment variables:"
    export PYTHONPATH="$PWD/src:$PYTHONPATH"
    export PATH="$PWD/scripts:$PATH"
    
    # Set up PostgreSQL data directory if it doesn't exist
    export PGDATA="$PWD/.nix-postgres"
    if [ ! -d "$PGDATA" ]; then
      echo "🗄️  Initializing PostgreSQL database..."
      initdb -D "$PGDATA" --auth-local=trust --auth-host=trust
      echo "✅ PostgreSQL initialized"
    fi
    
    # Set up Redis configuration
    export REDIS_CONF="$PWD/.nix-redis.conf"
    if [ ! -f "$REDIS_CONF" ]; then
      echo "📝 Creating Redis configuration..."
      cat > "$REDIS_CONF" << EOF
# Redis configuration for development
port 6379
bind 127.0.0.1
dir $PWD/.nix-redis-data
dbfilename dump.rdb
save 900 1
save 300 10
save 60 10000
EOF
      mkdir -p "$PWD/.nix-redis-data"
      echo "✅ Redis configuration created"
    fi
    
    # Create convenience functions
    pg_start() {
      echo "🚀 Starting PostgreSQL..."
      pg_ctl -D "$PGDATA" -l "$PWD/.nix-postgres.log" start
      echo "✅ PostgreSQL started (log: .nix-postgres.log)"
    }
    
    pg_stop() {
      echo "🛑 Stopping PostgreSQL..."
      pg_ctl -D "$PGDATA" stop
      echo "✅ PostgreSQL stopped"
    }
    
    pg_status() {
      pg_ctl -D "$PGDATA" status
    }
    
    redis_start() {
      echo "🚀 Starting Redis..."
      redis-server "$REDIS_CONF" --daemonize yes
      echo "✅ Redis started"
    }
    
    redis_stop() {
      echo "🛑 Stopping Redis..."
      redis-cli shutdown
      echo "✅ Redis stopped"
    }
    
    redis_status() {
      redis-cli ping 2>/dev/null && echo "Redis is running" || echo "Redis is not running"
    }
    
    services_start() {
      pg_start
      redis_start
      echo "🎉 All services started!"
    }
    
    services_stop() {
      redis_stop
      pg_stop
      echo "🎉 All services stopped!"
    }
    
    services_status() {
      echo "📊 Service Status:"
      echo -n "  PostgreSQL: "; pg_status | grep -q "server is running" && echo "✅ Running" || echo "❌ Stopped"
      echo -n "  Redis:      "; redis_status
    }
    
    # Export functions
    export -f pg_start pg_stop pg_status
    export -f redis_start redis_stop redis_status
    export -f services_start services_stop services_status
    
    echo "🔧 Database functions available:"
    echo "  services_start  - Start PostgreSQL and Redis"
    echo "  services_stop   - Stop PostgreSQL and Redis"
    echo "  services_status - Check service status"
    echo "  pg_start/stop   - Control PostgreSQL"
    echo "  redis_start/stop - Control Redis"
    echo ""
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
      echo "⚠️  No .env file found. Copy .env.example to .env and configure:"
      echo "  cp .env.example .env"
      echo ""
    fi
    
    # Check if poetry.lock exists
    if [ ! -f "poetry.lock" ]; then
      echo "📦 No poetry.lock found. Run 'make install' to install dependencies."
      echo ""
    fi
    
    echo "🎯 Ready to develop! Run 'make help' for available commands."
  '';
  
  # Environment variables
  PYTHONPATH = "./src";
  POETRY_VENV_IN_PROJECT = "1";
  POETRY_CACHE_DIR = "./.poetry-cache";
  
  # Database URLs for development
  DATABASE_URL = "postgresql://localhost:5432/project_dev";
  TEST_DATABASE_URL = "postgresql://localhost:5432/project_test";
  REDIS_URL = "redis://localhost:6379/0";
}
