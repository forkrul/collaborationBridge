# 🚀 MVP Template DevContainer

This devcontainer provides a complete development environment for the MVP Template project with Nix package management, Node.js, Python, and all necessary development tools.

## 🛠️ What's Included

### Core Tools
- **Nix Package Manager**: Reproducible dependency management
- **Node.js 20**: Latest LTS with npm, yarn, and pnpm
- **Python 3.11**: With pip and development tools
- **Git**: Version control with GitHub CLI
- **Docker**: Container support for development
- **Zsh + Oh My Zsh**: Enhanced shell experience

### Development Tools
- **TypeScript**: Language server and tools
- **ESLint & Prettier**: Code linting and formatting
- **Mermaid CLI**: Diagram generation
- **PostgreSQL & Redis**: Database tools
- **Ripgrep, fd, bat, exa**: Modern CLI utilities

### VSCode Extensions
- **Augment AI**: AI-powered coding assistant
- **Mermaid Support**: Diagram editing and preview
- **Tailwind CSS**: Utility-first CSS framework support
- **i18n Ally**: Internationalization support
- **GitHub Integration**: Copilot, Pull Requests, Actions
- **Nix Support**: Syntax highlighting and tools

## 🚀 Quick Start

### 1. Open in DevContainer
```bash
# Using VSCode Command Palette
Ctrl+Shift+P → "Dev Containers: Reopen in Container"

# Or using CLI
code --folder-uri vscode-remote://dev-container+$(pwd)
```

### 2. Enter Development Environment
```bash
# Enter Nix shell with all dependencies
nix-shell

# Or use the flake (modern Nix)
nix develop
```

### 3. Start Development
```bash
# Install frontend dependencies
cd frontend && npm install

# Start development server
npm run dev

# Or use the convenience alias
ndev
```

## 📦 Available Commands

### Frontend Development
```bash
ndev         # Start development server (cd frontend && npm run dev)
nbuild       # Build for production (cd frontend && npm run build)
ntest        # Run tests (cd frontend && npm test)
nlint        # Run ESLint (cd frontend && npm run lint)
```

### Git Shortcuts
```bash
gs           # git status
ga           # git add
gc           # git commit
gp           # git push
gl           # git pull
gd           # git diff
gb           # git branch
gco          # git checkout
```

### Utilities
```bash
ll           # List files (exa -la)
cat          # View files (bat with syntax highlighting)
find         # Find files (fd)
grep         # Search text (ripgrep)
```

## 🎨 Theme System

The project includes a comprehensive theme system:
- **9 Color Themes**: Light, Corporate, Soft Dark, Blue, Green, Purple, Orange, Red, High Contrast
- **Dark/Light Modes**: Each theme supports both appearance modes
- **CSS Variables**: No hardcoded values, fully customizable
- **Live Preview**: Visit `/themes` to see all themes in action

## 🌍 Internationalization

Full i18n support with:
- **10 Languages**: English, Spanish, French, German, Japanese, Chinese, Afrikaans, Romanian, Zulu, Swiss German
- **Dynamic Switching**: Runtime language changes
- **Type-Safe**: Full TypeScript support for translations
- **Component Integration**: All UI components are internationalized

## 🔧 Nix Package Management

### Using shell.nix
```bash
# Enter development environment
nix-shell

# Install additional packages
nix-env -iA nixpkgs.packageName
```

### Using Flakes (Modern)
```bash
# Enter development environment
nix develop

# Run specific commands
nix run .#dev      # Start development server
nix run .#build    # Build application
nix run .#test     # Run tests
```

### Adding Dependencies
Edit `shell.nix` or `flake.nix` to add new dependencies:

```nix
# In shell.nix
buildInputs = with pkgs; [
  # existing packages...
  newPackage
];
```

## 🐳 Docker Support

The devcontainer includes Docker-in-Docker support:

```bash
# Check Docker status
docker --version

# Run containers
docker run hello-world

# Use docker-compose
docker-compose up -d
```

## 📁 Project Structure

```
.devcontainer/
├── devcontainer.json    # DevContainer configuration
├── Dockerfile          # Custom container image
├── setup.sh            # Post-creation setup script
└── README.md           # This file

frontend/               # Next.js frontend application
├── src/
│   ├── components/     # React components
│   ├── pages/         # Next.js pages
│   ├── i18n/          # Internationalization
│   └── lib/           # Utilities and configurations
├── public/            # Static assets
└── package.json       # Node.js dependencies

shell.nix              # Nix development environment
flake.nix             # Modern Nix flake configuration
```

## 🔍 Troubleshooting

### Container Won't Start
1. Check Docker is running on your host
2. Ensure you have enough disk space
3. Try rebuilding the container: `Ctrl+Shift+P` → "Dev Containers: Rebuild Container"

### Nix Commands Not Found
```bash
# Source Nix environment
source ~/.nix-profile/etc/profile.d/nix.sh

# Or restart your shell
exec zsh
```

### Node.js/npm Issues
```bash
# Reinstall Node.js via Nix
nix-env -e nodejs
nix-env -iA nixpkgs.nodejs_20

# Clear npm cache
npm cache clean --force
```

### Frontend Dependencies
```bash
# Clean install
rm -rf frontend/node_modules frontend/package-lock.json
cd frontend && npm install
```

## 🎯 Development Workflow

### 1. Theme Development
```bash
# Start development server
ndev

# Visit theme showcase
open http://localhost:3000/themes

# Edit themes in src/app/globals.css
```

### 2. i18n Development
```bash
# Add new translations in src/i18n/locales/
# Use the i18n Ally extension for easy editing

# Test language switching
open http://localhost:3000/en-GB
open http://localhost:3000/es
```

### 3. Component Development
```bash
# Create new components in src/components/
# Use Storybook for component development (if configured)
npm run storybook
```

## 📚 Documentation

- **THEMING.md**: Complete theme system guide
- **INTERNATIONALIZATION.md**: i18n implementation guide
- **README.md**: Project overview and setup

## 🤝 Contributing

1. Make changes in the devcontainer
2. Test thoroughly with different themes and languages
3. Update documentation if needed
4. Commit and push changes

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the container logs: `Ctrl+Shift+P` → "Dev Containers: Show Container Log"
3. Rebuild the container if necessary
4. Check the project documentation

---

Happy coding! 🎉 The devcontainer provides everything you need for productive development with the MVP Template.
