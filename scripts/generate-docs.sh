#!/bin/bash

# Documentation generation script

set -e

echo "Generating documentation..."

# Change to docs directory
cd docs

# Clean previous build
echo "Cleaning previous build..."
rm -rf build/

# Build documentation
echo "Building documentation..."
poetry run make html

echo "Documentation generated successfully!"
echo "Open docs/build/html/index.html to view the documentation."
