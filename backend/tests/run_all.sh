#!/bin/bash

# Run backend tests
pytest backend/tests

# Perform curl checks
echo "Running curl checks..."

# Check /route_forecast
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/route_forecast?route_id=1

# Check /optimize
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8000/optimize -H "Content-Type: application/json" -d '{"route":[{"segment_id":1,"lat":12.9,"lon":74.8,"dist_nm":50}],"vessel":{"name":"DemoVessel","base_speed_kn":12.0},"constraints":{"deadline_iso":null}}'

# Check /alerts
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/alerts?route_id=1

echo "Curl checks completed."