#!/bin/bash

# GitHub Pages setup script
# Usage: ./scripts/setup-github-pages.sh [OWNER] [REPO] [TOKEN]

set -e

# Default values
OWNER=${1:-"forkrul"}
REPO=${2:-"project-template-mvp"}
TOKEN=${3:-$GITHUB_TOKEN}

if [ -z "$TOKEN" ]; then
    echo "Error: GitHub token is required"
    echo "Usage: $0 [OWNER] [REPO] [TOKEN]"
    echo "Or set GITHUB_TOKEN environment variable"
    exit 1
fi

echo "Setting up GitHub Pages for $OWNER/$REPO..."

# Enable GitHub Pages with GitHub Actions
response=$(curl -s -w "%{http_code}" -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/$OWNER/$REPO/pages \
  -d '{
    "source": {
      "branch": "master",
      "path": "/"
    },
    "build_type": "workflow"
  }')

http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" -eq 201 ]; then
    echo "✅ GitHub Pages enabled successfully!"
    echo "📖 Documentation will be available at: https://$OWNER.github.io/$REPO/"
    echo "🔄 First deployment will start automatically when you push to master"
elif [ "$http_code" -eq 409 ]; then
    echo "ℹ️  GitHub Pages is already enabled for this repository"
    
    # Get current Pages configuration
    echo "📋 Current Pages configuration:"
    curl -s -H "Accept: application/vnd.github+json" \
      -H "Authorization: Bearer $TOKEN" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      https://api.github.com/repos/$OWNER/$REPO/pages | jq '.'
else
    echo "❌ Failed to enable GitHub Pages"
    echo "HTTP Status: $http_code"
    echo "Response: $response_body"
    exit 1
fi

echo ""
echo "🎯 Next steps:"
echo "1. Push your changes to the master branch"
echo "2. Check the Actions tab for the documentation build workflow"
echo "3. Visit https://$OWNER.github.io/$REPO/ once the workflow completes"
