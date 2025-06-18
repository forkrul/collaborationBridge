#!/usr/bin/env bash

# Nix installation script for the Python MVP Template
# This script helps set up Nix and direnv for the project

set -e

# Colors
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

check_nix() {
    if command -v nix >/dev/null 2>&1; then
        log_success "Nix is already installed"
        nix --version
        return 0
    else
        return 1
    fi
}

install_nix() {
    log_info "Installing Nix package manager..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        log_info "Detected Linux, installing Nix with daemon..."
        sh <(curl -L https://nixos.org/nix/install) --daemon
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        log_info "Detected macOS, installing Nix with daemon..."
        sh <(curl -L https://nixos.org/nix/install) --daemon
    else
        log_warning "Unsupported OS: $OSTYPE"
        log_info "Please install Nix manually: https://nixos.org/download.html"
        return 1
    fi
    
    log_success "Nix installation completed!"
    log_warning "Please restart your shell or run: source ~/.bashrc"
}

enable_flakes() {
    log_info "Enabling Nix flakes..."
    
    # Create nix config directory
    mkdir -p ~/.config/nix
    
    # Add experimental features
    if ! grep -q "experimental-features" ~/.config/nix/nix.conf 2>/dev/null; then
        echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
        log_success "Nix flakes enabled"
    else
        log_info "Nix flakes already enabled"
    fi
}

check_direnv() {
    if command -v direnv >/dev/null 2>&1; then
        log_success "direnv is already installed"
        direnv version
        return 0
    else
        return 1
    fi
}

install_direnv() {
    log_info "Installing direnv..."
    
    if check_nix; then
        # Install via Nix
        nix-env -iA nixpkgs.direnv
        log_success "direnv installed via Nix"
    else
        # Install via curl
        curl -sfL https://direnv.net/install.sh | bash
        log_success "direnv installed via curl"
    fi
}

setup_direnv() {
    log_info "Setting up direnv shell integration..."
    
    # Detect shell
    SHELL_NAME=$(basename "$SHELL")
    
    case "$SHELL_NAME" in
        bash)
            SHELL_RC="$HOME/.bashrc"
            HOOK_LINE='eval "$(direnv hook bash)"'
            ;;
        zsh)
            SHELL_RC="$HOME/.zshrc"
            HOOK_LINE='eval "$(direnv hook zsh)"'
            ;;
        fish)
            SHELL_RC="$HOME/.config/fish/config.fish"
            HOOK_LINE='direnv hook fish | source'
            ;;
        *)
            log_warning "Unsupported shell: $SHELL_NAME"
            log_info "Please add direnv hook manually: https://direnv.net/docs/hook.html"
            return 1
            ;;
    esac
    
    # Add hook if not already present
    if [ -f "$SHELL_RC" ] && ! grep -q "direnv hook" "$SHELL_RC"; then
        echo "" >> "$SHELL_RC"
        echo "# direnv hook" >> "$SHELL_RC"
        echo "$HOOK_LINE" >> "$SHELL_RC"
        log_success "direnv hook added to $SHELL_RC"
    else
        log_info "direnv hook already configured"
    fi
}

test_environment() {
    log_info "Testing Nix environment..."
    
    if check_nix; then
        # Test nix-shell
        if nix-shell --run "echo 'Nix shell works!'" 2>/dev/null; then
            log_success "Nix shell is working"
        else
            log_error "Nix shell test failed"
            return 1
        fi
        
        # Test flakes if enabled
        if nix flake --help >/dev/null 2>&1; then
            log_success "Nix flakes are working"
        else
            log_warning "Nix flakes not available (this is optional)"
        fi
    else
        log_error "Nix is not available"
        return 1
    fi
}

show_next_steps() {
    echo ""
    log_success "Setup complete! Next steps:"
    echo ""
    echo "1. Restart your shell or run:"
    echo "   source ~/.bashrc  # or ~/.zshrc"
    echo ""
    echo "2. Enter the project directory and start development:"
    echo "   cd /path/to/project"
    echo "   nix-shell  # or 'nix develop' with flakes"
    echo ""
    echo "3. With direnv (automatic environment loading):"
    echo "   direnv allow"
    echo "   # Environment will load automatically when you cd into the project"
    echo ""
    echo "4. Install project dependencies:"
    echo "   make install"
    echo ""
    echo "5. Start development services:"
    echo "   services_start"
    echo ""
    echo "6. Start the development server:"
    echo "   make dev"
    echo ""
    log_info "For more information, see: docs/source/nix/index.md"
}

main() {
    echo "🚀 Python MVP Template - Nix Setup"
    echo "=================================="
    echo ""
    
    # Check if Nix is already installed
    if ! check_nix; then
        read -p "Install Nix package manager? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_nix
        else
            log_info "Skipping Nix installation"
        fi
    fi
    
    # Enable flakes
    if check_nix; then
        read -p "Enable Nix flakes? (Y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            enable_flakes
        fi
    fi
    
    # Check if direnv is installed
    if ! check_direnv; then
        read -p "Install direnv for automatic environment loading? (Y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            install_direnv
            setup_direnv
        fi
    fi
    
    # Test the environment
    if check_nix; then
        test_environment
    fi
    
    show_next_steps
}

# Run main function
main "$@"
