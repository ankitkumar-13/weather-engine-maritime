#!/bin/bash
# Weather Engine Maritime - Quick Stop Script
# MariTHON Hackathon Submission
echo "🛑 Stopping Weather Engine Maritime..."
# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
# Kill processes by name
echo -e "${YELLOW}🧹 Stopping backend processes...${NC}"
pkill -f "uvicorn" 2>/dev/null || true
pkill -f "main.py" 2>/dev/null || true
echo -e "${YELLOW}🧹 Stopping frontend processes...${NC}"
pkill -f "http.server" 2>/dev/null || true
# Kill processes by PID if files exist
if [ -f /tmp/weather-engine-backend.pid ]; then
    BACKEND_PID=$(cat /tmp/weather-engine-backend.pid)
    kill $BACKEND_PID 2>/dev/null || true
    rm -f /tmp/weather-engine-backend.pid
    echo -e "${GREEN}✅ Backend stopped (PID: $BACKEND_PID)${NC}"
fi
if [ -f /tmp/weather-engine-frontend.pid ]; then
    FRONTEND_PID=$(cat /tmp/weather-engine-frontend.pid)
    kill $FRONTEND_PID 2>/dev/null || true
    rm -f /tmp/weather-engine-frontend.pid
    echo -e "${GREEN}✅ Frontend stopped (PID: $FRONTEND_PID)${NC}"
fi
# General cleanup
pkill -f "python3.*8000" 2>/dev/null || true
pkill -f "python3.*8080" 2>/dev/null || true
echo -e "${GREEN}🎉 All Weather Engine Maritime services stopped!${NC}"
