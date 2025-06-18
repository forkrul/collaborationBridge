#!/bin/bash

# GitHub Pages setup script with local documentation build
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

echo "Setting up GitHub Pages for $OWNER/$REPO with local documentation build..."

# Check if gh-pages branch exists
echo "🔍 Checking if gh-pages branch exists..."
branch_exists=$(git ls-remote --heads origin gh-pages | wc -l)

if [ "$branch_exists" -eq 0 ]; then
    echo "📝 Creating gh-pages branch..."

    # Create orphan gh-pages branch
    git checkout --orphan gh-pages
    git rm -rf .

    # Create initial index.html
    cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Documentation Building...</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <h1>Documentation is being built...</h1>
    <div class="spinner"></div>
    <p>Please wait while we build and deploy the documentation.</p>
    <p>This page will be updated automatically once the build is complete.</p>
</body>
</html>
EOF

    git add index.html
    git commit -m "Initial gh-pages branch with placeholder"
    git push origin gh-pages

    # Switch back to master
    git checkout master

    echo "✅ gh-pages branch created and pushed"
fi

# Enable GitHub Pages with gh-pages branch
response=$(curl -s -w "%{http_code}" -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/$OWNER/$REPO/pages \
  -d '{
    "source": {
      "branch": "gh-pages",
      "path": "/"
    }
  }')

http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" -eq 201 ]; then
    echo "✅ GitHub Pages enabled successfully!"
    echo "📖 Documentation will be available at: https://$OWNER.github.io/$REPO/"
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
echo "1. Build documentation locally: make docs"
echo "2. Deploy documentation: ./scripts/deploy-docs.sh"
echo "3. Visit https://$OWNER.github.io/$REPO/ to view the documentation"
