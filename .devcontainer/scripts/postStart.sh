#!/bin/bash

set -e

echo "Running post-start tasks..."
if [ -n "$CODESPACE_NAME" ]; then
    gh codespace ports visibility 8000:public -c $CODESPACE_NAME
fi

echo "Starting the backend and frontend services..."
cd /workspace
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload &
(
    cd /workspace/frontend/app
    echo "Starting the frontend..."
    if [ -n "$CODESPACE_NAME" ]; then
        npm run dev -- --mode codespace --host 0.0.0.0 --port 3000
    else
        npm run dev -- --host 0.0.0.0 --port 3000
    fi
)
