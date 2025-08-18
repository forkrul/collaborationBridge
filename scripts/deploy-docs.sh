#!/bin/bash

# Deploy documentation to GitHub Pages
# This script builds the documentation locally and pushes it to the gh-pages branch

set -e

echo "🚀 Deploying documentation to GitHub Pages..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes. Please commit or stash them first."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Store current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Build documentation
echo "🔨 Building documentation..."
cd docs
uv run make clean
uv run make html
cd ..

# Check if build was successful
if [ ! -d "docs/build/html" ]; then
    echo "❌ Error: Documentation build failed"
    exit 1
fi

echo "✅ Documentation built successfully"

# Create temporary directory for gh-pages content
TEMP_DIR=$(mktemp -d)
echo "📁 Using temporary directory: $TEMP_DIR"

# Copy built documentation to temp directory
cp -r docs/build/html/* "$TEMP_DIR/"

# Add .nojekyll file to prevent Jekyll processing
touch "$TEMP_DIR/.nojekyll"

# Add CNAME file if it exists
if [ -f "CNAME" ]; then
    cp CNAME "$TEMP_DIR/"
fi

# Switch to gh-pages branch
echo "🔄 Switching to gh-pages branch..."
git checkout gh-pages

# Remove all files except .git
find . -maxdepth 1 -not -name '.git' -not -name '.' -exec rm -rf {} +

# Copy new documentation
cp -r "$TEMP_DIR"/* .

# Add all files
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to deploy"
else
    # Commit changes
    COMMIT_MSG="Deploy documentation - $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$COMMIT_MSG"
    
    # Push to gh-pages
    echo "📤 Pushing to gh-pages branch..."
    git push origin gh-pages
    
    echo "✅ Documentation deployed successfully!"
fi

# Switch back to original branch
echo "🔄 Switching back to $CURRENT_BRANCH branch..."
git checkout "$CURRENT_BRANCH"

# Clean up
rm -rf "$TEMP_DIR"

echo ""
echo "🎉 Documentation deployment complete!"
echo "📖 Your documentation should be available at:"
echo "   https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')/"
echo ""
echo "💡 Note: It may take a few minutes for GitHub Pages to update."
