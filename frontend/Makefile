# Frontend Makefile for Migration System
# Makes it easy to work with the migration system

.PHONY: help install dev test demo migration-test clean

# Default target
help:
	@echo "🚀 Migration System Commands"
	@echo ""
	@echo "Quick Start:"
	@echo "  make demo          - Start demo server (visit http://localhost:3000/migration-demo)"
	@echo "  make test          - Run all tests"
	@echo "  make migration-test - Run migration-specific tests"
	@echo ""
	@echo "Development:"
	@echo "  make install       - Install dependencies"
	@echo "  make dev           - Start development server"
	@echo "  make clean         - Clean node_modules and reinstall"
	@echo ""
	@echo "Testing:"
	@echo "  make test-button   - Test MigratedButton component"
	@echo "  make test-field    - Test MigratedTextField component"
	@echo "  make test-all      - Run all tests with coverage"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install

# Start development server
dev:
	@echo "🚀 Starting development server..."
	@echo "Visit: http://localhost:3000/migration-demo"
	npm run dev

# Quick demo start
demo: install
	@echo "🎨 Starting Migration Demo..."
	@echo ""
	@echo "🌟 Migration Demo will be available at:"
	@echo "   http://localhost:3000/migration-demo"
	@echo ""
	@echo "Features:"
	@echo "  ✅ Live component switching (shadcn ↔ Reshaped)"
	@echo "  ✅ Theme switching (Blue, Green, Purple)"
	@echo "  ✅ Dark/Light mode toggle"
	@echo "  ✅ 100% component coverage"
	@echo ""
	npm run dev

# Run all tests
test:
	@echo "🧪 Running all tests..."
	npm test

# Run migration-specific tests
migration-test:
	@echo "🧪 Running migration tests..."
	npm test -- --testPathPattern=migration

# Run specific component tests
test-button:
	@echo "🧪 Testing MigratedButton..."
	npm test -- --testPathPattern=MigratedButton --verbose

test-field:
	@echo "🧪 Testing MigratedTextField..."
	npm test -- --testPathPattern=MigratedTextField --verbose

test-all:
	@echo "🧪 Running all tests with coverage..."
	npm test -- --coverage

# Clean and reinstall
clean:
	@echo "🧹 Cleaning and reinstalling..."
	rm -rf node_modules package-lock.json
	npm install

# Development helpers
lint:
	@echo "🔍 Linting code..."
	npm run lint

format:
	@echo "✨ Formatting code..."
	npm run format

# Build for production
build:
	@echo "🏗️  Building for production..."
	npm run build
