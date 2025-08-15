#!/bin/bash
echo "Building pure frontend React app for static deployment..."
rm -rf dist/*
vite build --config vite.config.static.ts
echo "Static build complete! Files in dist/ folder:"
ls -la dist/
echo "Ready for Replit static deployment!"