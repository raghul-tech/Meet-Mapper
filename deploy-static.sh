#!/bin/bash

# Build the static files
echo "Building static files..."
npm run build

# Set environment variable for static deployment
export STATIC_DEPLOY=true

# Start the static server
echo "Starting static server..."
cross-env STATIC_DEPLOY=true tsx server/index.ts