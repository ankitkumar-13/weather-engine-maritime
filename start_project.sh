#!/bin/bash
# Weather Engine Maritime - Complete Project Startup Script
# MariTHON Hackathon Submission
echo "🚢 Weather Engine Maritime - Complete Startup"
echo "=============================================="
echo ""
# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
# Project directory
PROJECT_DIR="/Users/gewu/Desktop/weather-engine-maritime"
echo -e "${BLUE}📁 Project Directory: ${PROJECT_DIR}${NC}"
echo ""
# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}
# Function to wait for port to be available
wait_for_port() {
    local port=$1
    local timeout=30
    local counter=0    
    while ! nc -z localhost $port >/dev/null 2>&1; do
        if [ $counter -eq $timeout ]; then
            echo -e "${RED}❌ Timeout waiting for port $port${NC}"
            return 1
        fi
        sleep 1
        counter=$((counter + 1))
    done
    return 0
}
# Check prerequisites
echo -e "${YELLOW}🔍 Checking Prerequisites...${NC}"
if ! command_exists python3; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi
if ! command_exists pip3; then
    echo -e "${RED}❌ pip3 is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python 3 and pip3 are available${NC}"
# Check if nc (netcat) is available for port checking
if ! command_exists nc; then
    echo -e "${YELLOW}⚠️  netcat not available, skipping port checks${NC}"
fi
echo ""
# Change to project directory
echo -e "${BLUE}📂 Changing to project directory...${NC}"
cd "$PROJECT_DIR" || { echo -e "${RED}❌ Failed to change to project directory${NC}"; exit 1; }
# Install backend dependencies
echo -e "${YELLOW}📦 Installing Backend Dependencies...${NC}"
cd backend
if [ -f "requirements.txt" ]; then
    pip3 install -r requirements.txt
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install backend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ requirements.txt not found in backend directory${NC}"
    exit 1
fi
echo ""
# Kill any existing processes on ports 8000 and 8080
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
pkill -f "uvicorn" 2>/dev/null || true
pkill -f "http.server" 2>/dev/null || true
pkill -f "main.py" 2>/dev/null || true
# Wait a moment for processes to clean up
sleep 2
echo -e "${GREEN}✅ Cleanup completed${NC}"
echo ""
# Start Backend Server
echo -e "${CYAN}🚀 Starting Backend API Server...${NC}"
cd "$PROJECT_DIR/backend"
# Check if main.py exists
if [ ! -f "main.py" ]; then
    echo -e "${RED}❌ main.py not found in backend directory${NC}"
    exit 1
fi
# Start backend in background
python3 main.py &
BACKEND_PID=$!
echo -e "${BLUE}🔧 Backend PID: $BACKEND_PID${NC}"
echo -e "${BLUE}🌐 Backend URL: http://localhost:8000${NC}"
# Wait for backend to start
echo -e "${YELLOW}⏳ Waiting for backend to start...${NC}"
sleep 5
# Test backend
if command_exists curl; then
    if curl -s http://localhost:8000/ >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend API is running successfully${NC}"
    else
        echo -e "${RED}❌ Backend API failed to start${NC}"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  curl not available, skipping backend test${NC}"
fi
echo ""
# Start Frontend Server
echo -e "${CYAN}🎨 Starting Frontend Server...${NC}"
cd "$PROJECT_DIR/frontend"
# Check if demo.html exists
if [ ! -f "demo.html" ]; then
    echo -e "${RED}❌ demo.html not found in frontend directory${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi
# Start frontend in background
python3 -m http.server 8080 &
FRONTEND_PID=$!
echo -e "${BLUE}🔧 Frontend PID: $FRONTEND_PID${NC}"
echo -e "${BLUE}🌐 Frontend URL: http://localhost:8080${NC}"
# Wait for frontend to start
echo -e "${YELLOW}⏳ Waiting for frontend to start...${NC}"
sleep 3
# Test frontend
if command_exists curl; then
    if curl -s http://localhost:8080/ >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend server is running successfully${NC}"
    else
        echo -e "${RED}❌ Frontend server failed to start${NC}"
        kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  curl not available, skipping frontend test${NC}"
fi
echo ""
# API Health Check
echo -e "${CYAN}🩺 Performing API Health Check...${NC}"
if command_exists curl; then
    echo -e "${YELLOW}Testing API endpoints...${NC}"    
    # Test root endpoint
    if curl -s http://localhost:8000/ | grep -q "running"; then
        echo -e "${GREEN}✅ Root endpoint: Working${NC}"
    else
        echo -e "${RED}❌ Root endpoint: Failed${NC}"
    fi    
    # Test route forecast endpoint
    if curl -s http://localhost:8000/route_forecast | grep -q "segment_id"; then
        echo -e "${GREEN}✅ Route forecast: Working${NC}"
    else
        echo -e "${RED}❌ Route forecast: Failed${NC}"
    fi    
    # Test alerts endpoint
    if curl -s http://localhost:8000/alerts >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Alerts endpoint: Working${NC}"
    else
        echo -e "${RED}❌ Alerts endpoint: Failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping API tests (curl not available)${NC}"
fi
echo ""
# Success message
echo -e "${GREEN}🎉 Weather Engine Maritime is now running!${NC}"
echo -e "${PURPLE}=============================================${NC}"
echo ""
echo -e "${CYAN}🌐 Access Points:${NC}"
echo -e "   ${BLUE}📡 Backend API:${NC}     http://localhost:8000"
echo -e "   ${BLUE}🎨 Frontend Demo:${NC}   http://localhost:8080/demo.html"
echo -e "   ${BLUE}📊 API Status:${NC}      http://localhost:8000/"
echo ""
echo -e "${CYAN}🎯 Demo Instructions:${NC}"
echo -e "   1. ${YELLOW}Open your browser${NC} to: http://localhost:8080/demo.html"
echo -e "   2. ${YELLOW}Click buttons${NC} to test: Load Forecast, Optimize Route, Check Alerts"
echo -e "   3. ${YELLOW}View the map${NC} for Mumbai → Kochi route visualization"
echo -e "   4. ${YELLOW}Watch animations${NC} and live data updates"
echo ""
echo -e "${CYAN}🔧 Process Information:${NC}"
echo -e "   ${BLUE}Backend PID:${NC}  $BACKEND_PID"
echo -e "   ${BLUE}Frontend PID:${NC} $FRONTEND_PID"
echo ""
echo -e "${CYAN}🛑 To Stop the Project:${NC}"
echo -e "   ${YELLOW}kill $BACKEND_PID $FRONTEND_PID${NC}"
echo -e "   ${YELLOW}or press Ctrl+C and run:${NC} pkill -f python3"
echo ""
echo -e "${PURPLE}🏆 Ready for MariTHON Demo!${NC}"
echo ""
# Save PIDs for later cleanup
echo "$BACKEND_PID" > /tmp/weather-engine-backend.pid
echo "$FRONTEND_PID" > /tmp/weather-engine-frontend.pid
# Keep script running
echo -e "${YELLOW}⏳ Press Ctrl+C to stop all services...${NC}"
# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🧹 Cleaning up...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    rm -f /tmp/weather-engine-backend.pid /tmp/weather-engine-frontend.pid 2>/dev/null || true
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}
# Trap Ctrl+C
trap cleanup INT
# Wait for user to stop
while true; do
    sleep 1
done
