{
  description = "Python MVP Template - FastAPI development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        python = pkgs.python311;
        
        # Python environment with all dependencies
        pythonEnv = python.withPackages (ps: with ps; [
          # Core FastAPI dependencies
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
          
          # Development tools
          ruff
          black
          isort
          mypy
          pre-commit
          ipython
          rich
          
          # Testing
          pytest
          pytest-asyncio
          pytest-cov
          pytest-env
          factory-boy
          faker
          
          # Documentation
          sphinx
          sphinx-rtd-theme
          myst-parser
          
          # Package management
          pip
          setuptools
          wheel
          poetry
        ]);
        
        # Development scripts
        devScripts = pkgs.writeScriptBin "dev-services" ''
          #!${pkgs.bash}/bin/bash
          
          case "$1" in
            start)
              echo "🚀 Starting development services..."
              ${pkgs.postgresql_16}/bin/pg_ctl -D .nix-postgres -l .nix-postgres.log start
              ${pkgs.redis}/bin/redis-server .nix-redis.conf --daemonize yes
              echo "✅ Services started!"
              ;;
            stop)
              echo "🛑 Stopping development services..."
              ${pkgs.redis}/bin/redis-cli shutdown || true
              ${pkgs.postgresql_16}/bin/pg_ctl -D .nix-postgres stop || true
              echo "✅ Services stopped!"
              ;;
            status)
              echo "📊 Service Status:"
              ${pkgs.postgresql_16}/bin/pg_ctl -D .nix-postgres status || echo "PostgreSQL: Stopped"
              ${pkgs.redis}/bin/redis-cli ping >/dev/null 2>&1 && echo "Redis: Running" || echo "Redis: Stopped"
              ;;
            init)
              echo "🔧 Initializing development services..."
              if [ ! -d ".nix-postgres" ]; then
                ${pkgs.postgresql_16}/bin/initdb -D .nix-postgres --auth-local=trust --auth-host=trust
                echo "✅ PostgreSQL initialized"
              fi
              if [ ! -f ".nix-redis.conf" ]; then
                cat > .nix-redis.conf << EOF
          port 6379
          bind 127.0.0.1
          dir $(pwd)/.nix-redis-data
          dbfilename dump.rdb
          save 900 1
          save 300 10
          save 60 10000
          EOF
                mkdir -p .nix-redis-data
                echo "✅ Redis configuration created"
              fi
              ;;
            *)
              echo "Usage: dev-services {start|stop|status|init}"
              exit 1
              ;;
          esac
        '';
        
      in
      {
        devShells.default = pkgs.mkShell {
          name = "python-mvp-template";
          
          buildInputs = with pkgs; [
            # Python environment
            pythonEnv
            
            # Database services
            postgresql_16
            redis
            sqlite
            
            # Development tools
            git
            curl
            wget
            jq
            
            # Container tools
            docker
            docker-compose
            
            # Documentation
            pandoc
            graphviz
            
            # Node.js for some tools
            nodejs_20
            
            # System dependencies
            gcc
            pkg-config
            openssl
            libffi
            zlib
            
            # Utilities
            bash
            coreutils
            findutils
            gnugrep
            gnused
            gawk
            netcat
            procps
            inotify-tools
            gnupg
            unzip
            zip
            tar
            gzip
            
            # Custom scripts
            devScripts
          ];
          
          shellHook = ''
            echo "🚀 Python MVP Template (Nix Flake)"
            echo "================================="
            echo ""
            echo "📦 Environment:"
            echo "  Python:     $(python --version)"
            echo "  Poetry:     $(poetry --version 2>/dev/null || echo 'Available')"
            echo "  PostgreSQL: $(postgres --version | head -n1)"
            echo "  Redis:      $(redis-server --version)"
            echo ""
            
            # Set up environment
            export PYTHONPATH="$PWD/src:$PYTHONPATH"
            export PATH="$PWD/scripts:$PATH"
            export PGDATA="$PWD/.nix-postgres"
            
            # Initialize services if needed
            if [ ! -d ".nix-postgres" ] || [ ! -f ".nix-redis.conf" ]; then
              echo "🔧 Initializing development services..."
              dev-services init
            fi
            
            echo "🛠️  Available commands:"
            echo "  make install      - Install dependencies"
            echo "  make dev          - Start development server"
            echo "  make test         - Run tests"
            echo "  dev-services start - Start PostgreSQL & Redis"
            echo "  dev-services stop  - Stop services"
            echo "  dev-services status - Check service status"
            echo ""
            
            # Check for configuration files
            if [ ! -f ".env" ]; then
              echo "⚠️  Copy .env.example to .env and configure"
            fi
            
            echo "🎯 Ready! Run 'make help' for all commands."
          '';
          
          # Environment variables
          PYTHONPATH = "./src";
          POETRY_VENV_IN_PROJECT = "1";
          DATABASE_URL = "postgresql://localhost:5432/project_dev";
          TEST_DATABASE_URL = "postgresql://localhost:5432/project_test";
          REDIS_URL = "redis://localhost:6379/0";
        };
        
        # Package the application
        packages.default = python.pkgs.buildPythonApplication {
          pname = "project-name";
          version = "0.1.0";
          src = ./.;
          
          propagatedBuildInputs = with python.pkgs; [
            fastapi
            uvicorn
            pydantic
            pydantic-settings
            sqlalchemy
            alembic
            asyncpg
            redis
            httpx
            python-jose
            passlib
            python-multipart
            email-validator
            structlog
            sentry-sdk
          ];
          
          meta = with pkgs.lib; {
            description = "Python MVP Template with FastAPI";
            license = licenses.mit;
            maintainers = [ ];
          };
        };
        
        # Docker image
        packages.docker = pkgs.dockerTools.buildImage {
          name = "python-mvp-template";
          tag = "latest";
          
          contents = [ self.packages.${system}.default ];
          
          config = {
            Cmd = [ "${self.packages.${system}.default}/bin/uvicorn" "src.project_name.main:app" "--host" "0.0.0.0" "--port" "8000" ];
            ExposedPorts = {
              "8000/tcp" = {};
            };
          };
        };
      });
}
