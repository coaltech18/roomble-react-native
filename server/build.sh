#!/bin/bash

echo "🚀 Starting Roomble server build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if TypeScript is available
if ! command -v tsc &> /dev/null; then
    echo "❌ TypeScript not found, installing globally..."
    npm install -g typescript
fi

# Build the project
echo "🔨 Building TypeScript..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output: dist/"
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Build process completed!"
