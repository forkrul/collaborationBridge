#!/usr/bin/env bash

# Nix services management script
# Manages PostgreSQL and Redis for development

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Configuration
PGDATA="$PROJECT_ROOT/.nix-postgres"
REDIS_CONF="$PROJECT_ROOT/.nix-redis.conf"
REDIS_DATA="$PROJECT_ROOT/.nix-redis-data"
PG_LOG="$PROJECT_ROOT/.nix-postgres.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

init_postgres() {
    if [ -d "$PGDATA" ]; then
        log_info "PostgreSQL already initialized"
        return 0
    fi
    
    log_info "Initializing PostgreSQL database..."
    initdb -D "$PGDATA" --auth-local=trust --auth-host=trust
    log_success "PostgreSQL initialized"
}

init_redis() {
    if [ -f "$REDIS_CONF" ]; then
        log_info "Redis already configured"
        return 0
    fi
    
    log_info "Creating Redis configuration..."
    mkdir -p "$REDIS_DATA"
    
    cat > "$REDIS_CONF" << EOF
# Redis configuration for development
port 6379
bind 127.0.0.1
dir $REDIS_DATA
dbfilename dump.rdb
logfile $PROJECT_ROOT/.nix-redis.log
loglevel notice

# Persistence
save 900 1
save 300 10
save 60 10000

# Memory management
maxmemory 256mb
maxmemory-policy allkeys-lru

# Security (development only)
protected-mode no
EOF
    
    log_success "Redis configuration created"
}

start_postgres() {
    if pg_ctl -D "$PGDATA" status >/dev/null 2>&1; then
        log_info "PostgreSQL is already running"
        return 0
    fi
    
    log_info "Starting PostgreSQL..."
    pg_ctl -D "$PGDATA" -l "$PG_LOG" start
    
    # Wait for PostgreSQL to be ready
    for i in {1..30}; do
        if pg_isready -q; then
            break
        fi
        sleep 1
    done
    
    if pg_isready -q; then
        log_success "PostgreSQL started successfully"
        
        # Create development databases if they don't exist
        createdb project_dev 2>/dev/null || true
        createdb project_test 2>/dev/null || true
        log_info "Development databases ensured"
    else
        log_error "PostgreSQL failed to start properly"
        return 1
    fi
}

stop_postgres() {
    if ! pg_ctl -D "$PGDATA" status >/dev/null 2>&1; then
        log_info "PostgreSQL is not running"
        return 0
    fi
    
    log_info "Stopping PostgreSQL..."
    pg_ctl -D "$PGDATA" stop -m fast
    log_success "PostgreSQL stopped"
}

start_redis() {
    if redis-cli ping >/dev/null 2>&1; then
        log_info "Redis is already running"
        return 0
    fi
    
    log_info "Starting Redis..."
    redis-server "$REDIS_CONF" --daemonize yes
    
    # Wait for Redis to be ready
    for i in {1..10}; do
        if redis-cli ping >/dev/null 2>&1; then
            break
        fi
        sleep 1
    done
    
    if redis-cli ping >/dev/null 2>&1; then
        log_success "Redis started successfully"
    else
        log_error "Redis failed to start properly"
        return 1
    fi
}

stop_redis() {
    if ! redis-cli ping >/dev/null 2>&1; then
        log_info "Redis is not running"
        return 0
    fi
    
    log_info "Stopping Redis..."
    redis-cli shutdown
    log_success "Redis stopped"
}

status_services() {
    echo "📊 Service Status:"
    echo "=================="
    
    # PostgreSQL status
    if pg_ctl -D "$PGDATA" status >/dev/null 2>&1; then
        echo -e "PostgreSQL: ${GREEN}✅ Running${NC}"
        echo "  Data directory: $PGDATA"
        echo "  Log file: $PG_LOG"
    else
        echo -e "PostgreSQL: ${RED}❌ Stopped${NC}"
    fi
    
    # Redis status
    if redis-cli ping >/dev/null 2>&1; then
        echo -e "Redis:      ${GREEN}✅ Running${NC}"
        echo "  Config file: $REDIS_CONF"
        echo "  Data directory: $REDIS_DATA"
    else
        echo -e "Redis:      ${RED}❌ Stopped${NC}"
    fi
}

clean_services() {
    log_warning "This will remove all development data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Cancelled"
        return 0
    fi
    
    stop_redis
    stop_postgres
    
    log_info "Cleaning up data directories..."
    rm -rf "$PGDATA" "$REDIS_DATA" "$REDIS_CONF"
    rm -f "$PG_LOG" "$PROJECT_ROOT/.nix-redis.log"
    
    log_success "Cleanup complete"
}

show_help() {
    echo "Nix Services Management"
    echo "======================"
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  init     - Initialize PostgreSQL and Redis"
    echo "  start    - Start all services"
    echo "  stop     - Stop all services"
    echo "  restart  - Restart all services"
    echo "  status   - Show service status"
    echo "  clean    - Clean all data (destructive!)"
    echo "  pg       - PostgreSQL commands:"
    echo "    pg start   - Start PostgreSQL only"
    echo "    pg stop    - Stop PostgreSQL only"
    echo "    pg status  - PostgreSQL status"
    echo "  redis    - Redis commands:"
    echo "    redis start - Start Redis only"
    echo "    redis stop  - Stop Redis only"
    echo "    redis cli   - Open Redis CLI"
    echo "  help     - Show this help"
    echo ""
    echo "Environment:"
    echo "  PGDATA:     $PGDATA"
    echo "  REDIS_CONF: $REDIS_CONF"
}

# Main command handling
case "${1:-help}" in
    init)
        init_postgres
        init_redis
        ;;
    start)
        init_postgres
        init_redis
        start_postgres
        start_redis
        log_success "All services started!"
        ;;
    stop)
        stop_redis
        stop_postgres
        log_success "All services stopped!"
        ;;
    restart)
        stop_redis
        stop_postgres
        start_postgres
        start_redis
        log_success "All services restarted!"
        ;;
    status)
        status_services
        ;;
    clean)
        clean_services
        ;;
    pg)
        case "${2:-help}" in
            start)
                init_postgres
                start_postgres
                ;;
            stop)
                stop_postgres
                ;;
            status)
                pg_ctl -D "$PGDATA" status || echo "PostgreSQL is not running"
                ;;
            *)
                echo "Usage: $0 pg {start|stop|status}"
                ;;
        esac
        ;;
    redis)
        case "${2:-help}" in
            start)
                init_redis
                start_redis
                ;;
            stop)
                stop_redis
                ;;
            cli)
                redis-cli
                ;;
            *)
                echo "Usage: $0 redis {start|stop|cli}"
                ;;
        esac
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
