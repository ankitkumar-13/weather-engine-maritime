#!/bin/bash
# This script sets USE_MOCK=1 and starts the backend and frontend in development mode for a reproducible demo.
export USE_MOCK=1
# Start the backend
( cd backend && uvicorn src.main:app --reload --port 8000 ) &
# Start the frontend
( cd frontend && npm start ) &
wait
# Both backend and frontend should now be running in development mode.
