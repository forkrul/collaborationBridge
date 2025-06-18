#!/bin/bash
"""
Install pre-push hook for work hours policy enforcement.
"""

set -e

HOOK_DIR=".git/hooks"
HOOK_FILE="$HOOK_DIR/pre-push"

# Create hooks directory if it doesn't exist
mkdir -p "$HOOK_DIR"

# Create the pre-push hook
cat > "$HOOK_FILE" << 'EOF'
#!/bin/bash
#
# Pre-push hook to enforce work hours policy
# Blocks pushes outside of 07:30-17:00 CET
#

# Run the work hours check
python scripts/check-work-hours.py

# Exit with the same code as the check
exit $?
EOF

# Make the hook executable
chmod +x "$HOOK_FILE"

echo "✅ Pre-push hook installed successfully!"
echo "🏢 Work hours policy: 07:30-17:00 CET"
echo "💡 Use 'git push --no-verify' to bypass (not recommended)"
