#!/bin/bash

# Documentation generation script

set -e

echo "Generating documentation..."

# Add local bin to PATH for sphinx
export PATH=$PATH:/home/augment-agent/.local/bin

# Change to docs directory
cd docs

# Clean previous build
echo "Cleaning previous build..."
rm -rf build/

# Build documentation
echo "Building documentation..."
sphinx-build -b html source build/html

echo "Documentation generated successfully!"
echo "Open docs/build/html/index.html to view the documentation."
echo "Or run 'make docs-serve' to start a local server."
