#!/bin/bash

# Script to fix all migration test files by updating them to use the simplified test utils

echo "🔧 Fixing migration test files..."

# List of test files to fix
test_files=(
  "src/components/migration/__tests__/MigratedTextField.test.tsx"
  "src/components/migration/__tests__/MigratedSelect.test.tsx"
  "src/components/migration/__tests__/MigratedBadge.test.tsx"
  "src/components/migration/__tests__/MigratedModal.test.tsx"
  "src/components/migration/__tests__/MigratedCheckbox.test.tsx"
  "src/components/migration/__tests__/MigratedTextArea.test.tsx"
  "src/components/migration/__tests__/MigratedProgress.test.tsx"
  "src/components/migration/__tests__/MigratedSwitch.test.tsx"
  "src/components/migration/__tests__/MigratedTable.test.tsx"
  "src/components/migration/__tests__/MigratedDropdownMenu.test.tsx"
  "src/components/migration/__tests__/MigratedBreadcrumbs.test.tsx"
  "src/components/migration/__tests__/MigratedPagination.test.tsx"
  "src/components/migration/__tests__/MigratedFormControl.test.tsx"
)

for file in "${test_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  📝 Fixing $file..."
    
    # Create a backup
    cp "$file" "$file.backup"
    
    # Replace the imports and test setup
    sed -i '1,/^const renderWithProvider/c\
import React from '\''react'\'';\
import { render, screen, fireEvent } from '\''./test-utils'\'';\
import { MigratedButton } from '\''../MigratedButton'\'';\
\
// Mock the migration theme hook to avoid provider issues\
jest.mock('\''../CoexistenceProvider'\'', () => ({\
  CoexistenceProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,\
  useMigrationTheme: () => ({\
    currentTheme: '\''blue'\'',\
    appearance: '\''light'\'' as const,\
    setTheme: jest.fn(),\
    setAppearance: jest.fn(),\
    availableThemes: ['\''blue'\'', '\''green'\'', '\''purple'\''],\
    reshapedTheme: {\
      color: '\''primary'\'',\
      appearance: '\''light'\'' as const,\
    },\
  }),\
}));\
\
const renderWithProvider' "$file"
    
    # Remove renderWithProvider wrapper calls
    sed -i 's/renderWithProvider(/render(/g' "$file"
    sed -i 's/<CoexistenceProvider>//g' "$file"
    sed -i 's/<\/CoexistenceProvider>//g' "$file"
    
    echo "  ✅ Fixed $file"
  else
    echo "  ⚠️  File not found: $file"
  fi
done

echo "🎉 All test files have been fixed!"
echo ""
echo "To run the tests:"
echo "  npm test -- --testPathPattern=migration"
