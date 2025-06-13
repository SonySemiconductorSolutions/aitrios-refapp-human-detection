#!/bin/bash

set -e

echo "Running post-create tasks..."

cd /workspace/frontend/app
echo "Installing dependencies for frontend..."
npm install

