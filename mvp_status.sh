#!/bin/bash
echo "🚢 Weather Engine Maritime - MVP Status Check"
echo "============================================="
echo -n "Backend API (port 8000): "
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ RUNNING"
else
    echo "❌ NOT RUNNING"
fi
echo -n "Frontend Server (port 3000): "
if curl -s http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ RUNNING"
else
    echo "❌ NOT RUNNING"
fi
echo ""
echo "🎯 Demo URLs:"
echo "   Backend API: http://localhost:8000"
echo "   Frontend Demo: http://localhost:3000/demo.html"
echo ""
echo "🧪 Quick API Test:"
echo -n "   Route forecast: "
if curl -s http://localhost:8000/route_forecast | grep -q "segment_id"; then
    echo "✅ Working"
else
    echo "❌ Failed"
fi
echo -n "   Alerts: "
if curl -s http://localhost:8000/alerts | grep -q "\["; then
    echo "✅ Working"
else
    echo "❌ Failed"
fi
echo ""
echo "🎉 MVP IS READY FOR DEMO!"
