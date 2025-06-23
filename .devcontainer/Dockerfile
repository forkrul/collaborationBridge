# MVP Template DevContainer Dockerfile
FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV FORCE_COLOR=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    pkg-config \
    libssl-dev \
    libffi-dev \
    zlib1g-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    libncurses5-dev \
    libncursesw5-dev \
    xz-utils \
    tk-dev \
    libxml2-dev \
    libxmlsec1-dev \
    libffi-dev \
    liblzma-dev \
    jq \
    unzip \
    zip \
    rsync \
    htop \
    tree \
    ripgrep \
    fd-find \
    bat \
    exa \
    shellcheck \
    && rm -rf /var/lib/apt/lists/*

# Install Nix package manager
RUN sh <(curl -L https://nixos.org/nix/install) --no-daemon

# Set up Nix environment for vscode user
USER vscode

# Configure Nix
RUN mkdir -p /home/vscode/.config/nix && \
    echo "experimental-features = nix-command flakes" > /home/vscode/.config/nix/nix.conf && \
    echo "auto-optimise-store = true" >> /home/vscode/.config/nix/nix.conf && \
    echo "trusted-users = vscode" >> /home/vscode/.config/nix/nix.conf

# Add Nix to PATH
ENV PATH="/nix/var/nix/profiles/default/bin:/home/vscode/.nix-profile/bin:${PATH}"

# Source Nix in shell profiles
RUN echo 'if [ -e /home/vscode/.nix-profile/etc/profile.d/nix.sh ]; then . /home/vscode/.nix-profile/etc/profile.d/nix.sh; fi' >> /home/vscode/.bashrc && \
    echo 'if [ -e /home/vscode/.nix-profile/etc/profile.d/nix.sh ]; then . /home/vscode/.nix-profile/etc/profile.d/nix.sh; fi' >> /home/vscode/.zshrc

# Install Node.js via Nix (this ensures we have a working Node.js environment)
RUN . /home/vscode/.nix-profile/etc/profile.d/nix.sh && \
    nix-env -iA nixpkgs.nodejs_20 nixpkgs.nodePackages.npm nixpkgs.nodePackages.yarn

# Install Python via Nix
RUN . /home/vscode/.nix-profile/etc/profile.d/nix.sh && \
    nix-env -iA nixpkgs.python311 nixpkgs.python311Packages.pip

# Install development tools via Nix
RUN . /home/vscode/.nix-profile/etc/profile.d/nix.sh && \
    nix-env -iA \
    nixpkgs.git \
    nixpkgs.gh \
    nixpkgs.docker \
    nixpkgs.docker-compose \
    nixpkgs.postgresql_16 \
    nixpkgs.redis \
    nixpkgs.nodePackages.typescript \
    nixpkgs.nodePackages.eslint \
    nixpkgs.nodePackages.prettier \
    nixpkgs.nodePackages.mermaid-cli

# Set up Oh My Zsh
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Configure Zsh with useful settings
RUN echo 'export ZSH="$HOME/.oh-my-zsh"' > /home/vscode/.zshrc && \
    echo 'ZSH_THEME="robbyrussell"' >> /home/vscode/.zshrc && \
    echo 'plugins=(git node npm docker python pip vscode)' >> /home/vscode/.zshrc && \
    echo 'source $ZSH/oh-my-zsh.sh' >> /home/vscode/.zshrc && \
    echo '' >> /home/vscode/.zshrc && \
    echo '# Nix setup' >> /home/vscode/.zshrc && \
    echo 'if [ -e ~/.nix-profile/etc/profile.d/nix.sh ]; then' >> /home/vscode/.zshrc && \
    echo '    source ~/.nix-profile/etc/profile.d/nix.sh' >> /home/vscode/.zshrc && \
    echo 'fi' >> /home/vscode/.zshrc && \
    echo '' >> /home/vscode/.zshrc && \
    echo '# Development aliases' >> /home/vscode/.zshrc && \
    echo 'alias ndev="cd frontend && npm run dev"' >> /home/vscode/.zshrc && \
    echo 'alias nbuild="cd frontend && npm run build"' >> /home/vscode/.zshrc && \
    echo 'alias ntest="cd frontend && npm test"' >> /home/vscode/.zshrc && \
    echo 'alias nlint="cd frontend && npm run lint"' >> /home/vscode/.zshrc && \
    echo 'alias ll="ls -alF"' >> /home/vscode/.zshrc && \
    echo 'alias la="ls -A"' >> /home/vscode/.zshrc && \
    echo 'alias l="ls -CF"' >> /home/vscode/.zshrc && \
    echo '' >> /home/vscode/.zshrc && \
    echo '# Git aliases' >> /home/vscode/.zshrc && \
    echo 'alias gs="git status"' >> /home/vscode/.zshrc && \
    echo 'alias ga="git add"' >> /home/vscode/.zshrc && \
    echo 'alias gc="git commit"' >> /home/vscode/.zshrc && \
    echo 'alias gp="git push"' >> /home/vscode/.zshrc && \
    echo 'alias gl="git pull"' >> /home/vscode/.zshrc && \
    echo 'alias gd="git diff"' >> /home/vscode/.zshrc && \
    echo 'alias gb="git branch"' >> /home/vscode/.zshrc && \
    echo 'alias gco="git checkout"' >> /home/vscode/.zshrc

# Create workspace directory
RUN mkdir -p /workspace
WORKDIR /workspace

# Set up Git configuration
RUN git config --global init.defaultBranch main && \
    git config --global pull.rebase false && \
    git config --global core.autocrlf input && \
    git config --global core.editor "code --wait"

# Create welcome message
RUN echo '#!/bin/bash' > /home/vscode/welcome.sh && \
    echo 'echo "🎯 MVP Template Development Environment"' >> /home/vscode/welcome.sh && \
    echo 'echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"' >> /home/vscode/welcome.sh && \
    echo 'echo ""' >> /home/vscode/welcome.sh && \
    echo 'echo "📦 Available tools:"' >> /home/vscode/welcome.sh && \
    echo 'echo "  • Node.js $(node --version 2>/dev/null || echo \"not available\")"' >> /home/vscode/welcome.sh && \
    echo 'echo "  • npm $(npm --version 2>/dev/null || echo \"not available\")"' >> /home/vscode/welcome.sh && \
    echo 'echo "  • Python $(python --version 2>/dev/null || echo \"not available\")"' >> /home/vscode/welcome.sh && \
    echo 'echo "  • Git $(git --version 2>/dev/null || echo \"not available\")"' >> /home/vscode/welcome.sh && \
    echo 'echo "  • Nix $(nix --version 2>/dev/null || echo \"not available\")"' >> /home/vscode/welcome.sh && \
    echo 'echo ""' >> /home/vscode/welcome.sh && \
    echo 'echo "🚀 Quick commands:"' >> /home/vscode/welcome.sh && \
    echo 'echo "  • nix-shell    → Enter Nix development environment"' >> /home/vscode/welcome.sh && \
    echo 'echo "  • ndev         → Start frontend development server"' >> /home/vscode/welcome.sh && \
    echo 'echo "  • nbuild       → Build frontend application"' >> /home/vscode/welcome.sh && \
    echo 'echo "  • ntest        → Run frontend tests"' >> /home/vscode/welcome.sh && \
    echo 'echo ""' >> /home/vscode/welcome.sh && \
    echo 'echo "🎨 Theme System: 9 color themes with i18n support"' >> /home/vscode/welcome.sh && \
    echo 'echo "🌍 Languages: 10 supported languages"' >> /home/vscode/welcome.sh && \
    echo 'echo ""' >> /home/vscode/welcome.sh && \
    echo 'echo "📚 Documentation:"' >> /home/vscode/welcome.sh && \
    echo 'echo "  • THEMING.md - Theme system guide"' >> /home/vscode/welcome.sh && \
    echo 'echo "  • INTERNATIONALIZATION.md - i18n guide"' >> /home/vscode/welcome.sh && \
    echo 'echo ""' >> /home/vscode/welcome.sh && \
    echo 'echo "🔧 Development environment ready!"' >> /home/vscode/welcome.sh && \
    echo 'echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"' >> /home/vscode/welcome.sh && \
    chmod +x /home/vscode/welcome.sh

# Add welcome message to shell startup
RUN echo '' >> /home/vscode/.zshrc && \
    echo '# Welcome message' >> /home/vscode/.zshrc && \
    echo '/home/vscode/welcome.sh' >> /home/vscode/.zshrc

# Switch back to root for any final setup
USER root

# Ensure vscode user owns their home directory
RUN chown -R vscode:vscode /home/vscode

# Switch back to vscode user
USER vscode

# Set the default shell to zsh
ENV SHELL=/bin/zsh

# Default command
CMD ["/bin/zsh"]
