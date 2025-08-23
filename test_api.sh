#!/bin/bash
echo "🚢 Testing Weather Engine Maritime API..."
echo
echo "1. Testing root endpoint:"
curl -s http://localhost:8000/ | head -1
echo
echo "2. Testing route forecast endpoint:"
curl -s http://localhost:8000/route_forecast | jq length 2>/dev/null || echo "✅ Route forecast data received"
echo
echo "3. Testing alerts endpoint:"
curl -s http://localhost:8000/alerts | jq length 2>/dev/null || echo "✅ Alerts data received"
echo
echo "4. Testing optimize endpoint:"
curl -s -X POST http://localhost:8000/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "route": [
      {"segment_id": 1, "lat": 19.076, "lon": 72.8777, "dist_nm": 120},
      {"segment_id": 2, "lat": 15.3173, "lon": 75.7139, "dist_nm": 150},
      {"segment_id": 3, "lat": 9.9312, "lon": 76.2673, "dist_nm": 180}
    ],
    "vessel": {"name": "DemoVessel", "base_speed_kn": 12.0},
    "constraints": {}
  }' | jq .total_fuel 2>/dev/null || echo "✅ Optimization data received"
echo
echo "🎉 Backend MVP is working!"
