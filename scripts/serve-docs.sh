#!/bin/bash

# Documentation server script

set -e

echo "Starting documentation server..."

# Change to docs directory
cd docs

# Check if documentation is built
if [ ! -d "build/html" ]; then
    echo "Documentation not built. Building now..."
    export PATH=$PATH:/home/augment-agent/.local/bin
    sphinx-build -b html source build/html
fi

# Start simple HTTP server
echo "Documentation server starting at http://localhost:8080"
echo "Press Ctrl+C to stop the server"

cd build/html
python3 -m http.server 8080
