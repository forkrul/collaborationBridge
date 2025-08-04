#!/bin/bash

# Script to fix ComponentSize to StandardComponentSize in components that only support sm/md/lg

cd packages/components/src

# List of components that only support sm/md/lg (not xs)
components=(
  "Button/Button.tsx"
  "Card/Card.tsx" 
  "Chart/Chart.tsx"
  "Checkbox/Checkbox.tsx"
  "Dialog/Dialog.tsx"
  "FileUpload/FileUpload.tsx"
  "Header/Header.tsx"
  "Input/Input.tsx"
  "Label/Label.tsx"
  "MultiStepForm/MultiStepForm.tsx"
  "Pagination/Pagination.tsx"
  "Popover/Popover.tsx"
  "Progress/Progress.tsx"
  "Search/Search.tsx"
  "Select/Select.tsx"
  "Sidebar/Sidebar.tsx"
  "Table/Table.tsx"
  "Textarea/Textarea.tsx"
  "ThemeToggle/ThemeToggle.tsx"
)

for component in "${components[@]}"; do
  if [ -f "$component" ]; then
    echo "Fixing $component..."
    
    # Replace ComponentSize import with StandardComponentSize
    sed -i 's/ComponentSize/StandardComponentSize/g' "$component"
    
    echo "Fixed $component"
  else
    echo "Warning: $component not found"
  fi
done

echo "All components updated!"
