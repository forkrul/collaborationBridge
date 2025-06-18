#!/bin/bash

# Development documentation server with auto-rebuild
# Usage: ./scripts/dev-docs.sh

set -e

echo "🚀 Starting development documentation server..."

# Check if we're in the project root
if [ ! -f "pyproject.toml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install documentation dependencies if needed
echo "📦 Checking documentation dependencies..."
poetry install --with docs --quiet

# Build initial documentation
echo "🔨 Building initial documentation..."
cd docs
poetry run make clean
poetry run make html
cd ..

echo "✅ Initial build complete!"
echo ""
echo "📖 Documentation server starting at: http://localhost:8080"
echo "📁 Serving from: docs/build/html/"
echo ""
echo "💡 Tips:"
echo "   - Edit files in docs/source/ to update documentation"
echo "   - Run 'make docs' in another terminal to rebuild after changes"
echo "   - Press Ctrl+C to stop the server"
echo ""

# Start the development server
cd docs
poetry run python -m http.server -d build/html 8080
