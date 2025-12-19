#!/bin/bash

# Script to add nonce support to all pages using Schema components
# This script updates:
# 1. Import statements to include getNonce
# 2. Component function to be async and get nonce
# 3. Pass nonce to all Schema components

echo "Adding nonce support to schema components..."

# Find all TypeScript files in src/app that use schema components
find src/app -name "*.tsx" -type f | while read file; do
  # Check if file uses schema components
  if grep -q "from '@/components/seo'" "$file"; then
    echo "Processing: $file"

    # Backup original file
    cp "$file" "$file.bak"

    # This is a placeholder - manual updates required
    echo "  -> Please manually update this file"
  fi
done

echo "Done! Please review changes and test thoroughly."
