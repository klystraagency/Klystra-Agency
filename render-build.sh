#!/usr/bin/env bash
set -o errexit

echo "Installing all dependencies (including devDependencies)..."
npm install --legacy-peer-deps

echo "Building client and server..."
npm run build
