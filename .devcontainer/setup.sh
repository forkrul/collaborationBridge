#!/bin/bash

# DevContainer Setup Script for MVP Template
# This script sets up the development environment with Nix, dependencies, and tools

set -euo pipefail

echo "🚀 Setting up MVP Template Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Ensure we're in the workspace directory
if [ -d "/workspace" ]; then
    cd /workspace
else
    print_warning "Workspace directory not found, using current directory"
fi

# 1. Verify Nix installation
print_status "Verifying Nix installation..."

# Source Nix environment if available
if [ -f ~/.nix-profile/etc/profile.d/nix.sh ]; then
    source ~/.nix-profile/etc/profile.d/nix.sh
    export PATH="/nix/var/nix/profiles/default/bin:$HOME/.nix-profile/bin:$PATH"
fi

if command -v nix &> /dev/null; then
    print_success "Nix is available: $(nix --version)"

    # Ensure Nix configuration directory exists
    mkdir -p ~/.config/nix

    # Create or update Nix configuration
    if [ ! -f ~/.config/nix/nix.conf ]; then
        cat > ~/.config/nix/nix.conf << EOF
experimental-features = nix-command flakes
auto-optimise-store = true
trusted-users = vscode
EOF
        print_success "Nix configuration created"
    fi
else
    print_warning "Nix not found. It should be installed by the Dockerfile."
fi

# 2. Create shell.nix for the project if it doesn't exist
print_status "Creating shell.nix for dependency management..."
if [ ! -f "shell.nix" ]; then
    cat > shell.nix << 'EOF'
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    # Node.js and package managers
    nodejs_20
    nodePackages.npm
    nodePackages.yarn
    nodePackages.pnpm
    
    # Python and tools
    python311
    python311Packages.pip
    python311Packages.virtualenv
    
    # Development tools
    git
    gh
    curl
    wget
    jq
    yq
    
    # Database tools
    postgresql
    redis
    
    # Docker and containers
    docker
    docker-compose
    
    # Text processing
    ripgrep
    fd
    bat
    exa
    
    # Build tools
    gnumake
    gcc
    
    # Shell enhancements
    zsh
    oh-my-zsh
    starship
    
    # Additional utilities
    tree
    htop
    neofetch
    
    # Mermaid CLI for diagram generation
    nodePackages.mermaid-cli
    
    # TypeScript and linting tools
    nodePackages.typescript
    nodePackages.eslint
    nodePackages.prettier
    
    # Testing tools
    nodePackages.jest
    
    # Documentation tools
    nodePackages.markdownlint-cli
  ];

  shellHook = ''
    echo "🎯 MVP Template Development Environment"
    echo "📦 Available tools:"
    echo "  - Node.js $(node --version)"
    echo "  - Python $(python --version)"
    echo "  - Git $(git --version)"
    echo "  - Docker $(docker --version 2>/dev/null || echo 'not available')"
    echo ""
    echo "🚀 Quick start:"
    echo "  cd frontend && npm install && npm run dev"
    echo ""
    
    # Set up environment variables
    export NODE_ENV=development
    export NEXT_TELEMETRY_DISABLED=1
    
    # Add local node_modules to PATH
    export PATH="$PWD/frontend/node_modules/.bin:$PATH"
    
    # Create .env.local if it doesn't exist
    if [ ! -f "frontend/.env.local" ]; then
      echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" > frontend/.env.local
      echo "📝 Created frontend/.env.local with default values"
    fi
  '';
}
EOF
    print_success "Created shell.nix for dependency management"
else
    print_status "shell.nix already exists, skipping creation"
fi

# 3. Setup Git configuration
print_status "Configuring Git..."
git config --global init.defaultBranch main
git config --global pull.rebase false
git config --global core.autocrlf input
git config --global core.editor "code --wait"

# Set up Git aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

print_success "Git configuration completed"

# 4. Setup Zsh and Oh My Zsh
print_status "Setting up Zsh and Oh My Zsh..."
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi

# Configure Zsh with useful plugins
cat > ~/.zshrc << 'EOF'
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"

plugins=(
    git
    node
    npm
    docker
    docker-compose
    python
    pip
    vscode
    zsh-autosuggestions
    zsh-syntax-highlighting
)

source $ZSH/oh-my-zsh.sh

# Nix setup
if [ -e ~/.nix-profile/etc/profile.d/nix.sh ]; then
    source ~/.nix-profile/etc/profile.d/nix.sh
fi

# Custom aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Development aliases
alias ndev='cd frontend && npm run dev'
alias nbuild='cd frontend && npm run build'
alias ntest='cd frontend && npm test'
alias nlint='cd frontend && npm run lint'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'
alias gd='git diff'
alias gb='git branch'
alias gco='git checkout'

# Docker aliases
alias dps='docker ps'
alias dpa='docker ps -a'
alias di='docker images'
alias dex='docker exec -it'

# Nix aliases
alias nix-shell='nix-shell --run zsh'
alias nix-search='nix search nixpkgs'

echo "🎯 MVP Template Development Environment Ready!"
EOF

print_success "Zsh configuration completed"

# 5. Install frontend dependencies
print_status "Installing frontend dependencies..."
if [ -d "frontend" ]; then
    cd frontend

    # Ensure Node.js is available
    if ! command -v node &> /dev/null; then
        print_warning "Node.js not found, dependencies will be installed when Node.js is available"
        cd ..
        return 0
    fi

    # Use npm if package-lock.json exists, otherwise use yarn
    if [ -f "package-lock.json" ]; then
        print_status "Using npm (package-lock.json found)..."
        npm install --no-audit --no-fund
        print_success "Frontend dependencies installed with npm"
    elif [ -f "yarn.lock" ]; then
        print_status "Using yarn (yarn.lock found)..."
        yarn install --silent
        print_success "Frontend dependencies installed with yarn"
    elif [ -f "package.json" ]; then
        print_status "Using npm (package.json found)..."
        npm install --no-audit --no-fund
        print_success "Frontend dependencies installed with npm (default)"
    else
        print_warning "No package.json found, skipping dependency installation"
    fi

    cd ..
else
    print_warning "Frontend directory not found, skipping dependency installation"
fi

# 6. Setup environment files
print_status "Setting up environment files..."
if [ -d "frontend" ] && [ ! -f "frontend/.env.local" ]; then
    cat > frontend/.env.local << 'EOF'
# Local development environment variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_TELEMETRY_DISABLED=1

# Database (if using)
DATABASE_URL=postgresql://postgres:password@localhost:5432/mvp_template

# Redis (if using)
REDIS_URL=redis://localhost:6379

# Authentication (example values)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# API Keys (add your actual keys)
# OPENAI_API_KEY=your-openai-key
# STRIPE_SECRET_KEY=your-stripe-key
EOF
    print_success "Created frontend/.env.local with default values"
fi

# 7. Create useful scripts
print_status "Creating development scripts..."
mkdir -p scripts

cat > scripts/dev.sh << 'EOF'
#!/bin/bash
# Start development server
cd frontend && npm run dev
EOF

cat > scripts/build.sh << 'EOF'
#!/bin/bash
# Build the application
cd frontend && npm run build
EOF

cat > scripts/test.sh << 'EOF'
#!/bin/bash
# Run tests
cd frontend && npm test
EOF

cat > scripts/lint.sh << 'EOF'
#!/bin/bash
# Run linting
cd frontend && npm run lint
EOF

chmod +x scripts/*.sh
print_success "Development scripts created in scripts/ directory"

# 8. Setup VSCode workspace settings
print_status "Setting up VSCode workspace..."
mkdir -p .vscode

cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "eslint.workingDirectories": ["frontend"],
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "i18n-ally.localesPaths": [
    "frontend/src/i18n/locales"
  ],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.defaultNamespace": "common",
  "mermaid.theme": "dark"
}
EOF

cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "augmentcode.augment",
    "bierner.markdown-mermaid",
    "tomoyukim.vscode-mermaid-editor",
    "bbenoist.nix",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "github.copilot",
    "eamodio.gitlens",
    "ms-vscode.vscode-typescript-next",
    "lokalise.i18n-ally"
  ]
}
EOF

print_success "VSCode workspace configuration completed"

# 9. Final setup
print_status "Performing final setup..."

# Create a welcome message
cat > DEVCONTAINER_README.md << 'EOF'
# 🚀 MVP Template DevContainer

Welcome to your fully configured development environment!

## 🛠️ What's Included

- **Nix Package Manager**: For reproducible dependency management
- **Node.js 20**: Latest LTS version with npm, yarn, and pnpm
- **Python 3.11**: With pip and virtualenv
- **Development Tools**: Git, GitHub CLI, Docker, and more
- **VSCode Extensions**: Augment AI, Mermaid, Tailwind CSS, ESLint, Prettier
- **Shell**: Zsh with Oh My Zsh and useful plugins

## 🚀 Quick Start

```bash
# Enter Nix shell with all dependencies
nix-shell

# Start development server
cd frontend && npm run dev

# Or use the convenience script
./scripts/dev.sh
```

## 📦 Available Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run ESLint

# Convenience scripts
./scripts/dev.sh     # Start development
./scripts/build.sh   # Build application
./scripts/test.sh    # Run tests
./scripts/lint.sh    # Run linting
```

## 🎨 Theme System

The project includes a comprehensive theme system with:
- 9 color themes (Light, Corporate, Soft Dark, etc.)
- Dark/Light mode support
- CSS variables (no hardcoded values)
- i18n support for 10 languages

## 🔧 Tools Available

- **Augment AI**: AI-powered coding assistant
- **Mermaid**: Diagram generation and preview
- **Nix**: Reproducible package management
- **Git**: Version control with useful aliases
- **Docker**: Container support
- **Database**: PostgreSQL and Redis ready

## 📚 Documentation

- `THEMING.md`: Complete theme system guide
- `INTERNATIONALIZATION.md`: i18n implementation guide
- `README.md`: Project overview and setup

Happy coding! 🎉
EOF

print_success "DevContainer setup completed successfully!"

echo ""
echo "🎉 MVP Template Development Environment is ready!"
echo ""
echo "📋 Next steps:"
echo "  1. Open the integrated terminal"
echo "  2. Run 'nix-shell' to enter the development environment"
echo "  3. Run 'cd frontend && npm run dev' to start the development server"
echo "  4. Open http://localhost:3000 to see your application"
echo ""
echo "🔧 Available tools:"
echo "  - Augment AI Assistant (installed)"
echo "  - Mermaid diagram support (installed)"
echo "  - Nix package manager (configured)"
echo "  - All VSCode extensions (installed)"
echo ""
echo "📖 Check DEVCONTAINER_README.md for detailed information"
echo ""
