from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import os
from datetime import datetime

from .ingest import get_weather_data
from .optimizer import optimize_route

app = FastAPI(title="Weather Engine Maritime API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class RoutePoint(BaseModel):
    segment_id: int
    lat: float
    lon: float
    dist_nm: float

class Vessel(BaseModel):
    name: str
    base_speed_kn: float

class OptimizeRequest(BaseModel):
    route: List[RoutePoint]
    vessel: Vessel
    constraints: Optional[Dict[str, Any]] = {}

@app.get("/")
async def root():
    return {"message": "Weather Engine Maritime API", "status": "running"}

@app.get("/route_forecast")
async def get_route_forecast(route_id: int = 1):
    """Get weather forecast for route points"""
    try:
        # Load sample route
        route_path = os.path.join(os.path.dirname(__file__), "..", "routes", "sample_route.json")
        with open(route_path, 'r') as f:
            route_data = json.load(f)
        
        route_points = route_data.get("route_points", [])
        
        result = []
        for point in route_points:
            # Get weather data for this point
            forecast_data = get_weather_data(point["lat"], point["lon"])
            
            result.append({
                "segment_id": point["segment_id"],
                "lat": point["lat"],
                "lon": point["lon"],
                "forecast": {
                    "times": forecast_data
                }
            })
        
        return result
    
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Route not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize")
async def optimize_speed(request: OptimizeRequest):
    """Optimize speed profile for the route"""
    try:
        # Convert route to dict format
        route = [point.dict() for point in request.route]
        vessel = request.vessel.dict()
        
        # Get forecasts for each segment
        forecasts = {}
        for point in route:
            segment_id = str(point["segment_id"])
            forecast_data = get_weather_data(point["lat"], point["lon"])
            forecasts[segment_id] = forecast_data
        
        # Run optimization
        result = optimize_route(
            route=route,
            forecasts=forecasts,
            vessel=vessel,
            start_time_iso=datetime.now().isoformat() + "Z",
            deadline_iso=request.constraints.get("deadline_iso")
        )
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/alerts")
async def get_alerts(route_id: int = 1):
    """Get weather alerts for route"""
    try:
        # Load sample route
        route_path = os.path.join(os.path.dirname(__file__), "..", "routes", "sample_route.json")
        with open(route_path, 'r') as f:
            route_data = json.load(f)
        
        route_points = route_data.get("route_points", [])
        
        alerts = []
        for point in route_points:
            # Get weather data for this point
            forecast_data = get_weather_data(point["lat"], point["lon"])
            
            # Check for alerts in forecast
            for i, forecast in enumerate(forecast_data[:24]):  # Check next 24 hours
                wind_speed = forecast.get("wind_speed_ms", 0)
                wave_height = forecast.get("waves", {}).get("Hs_m", 0)
                
                # Wind alerts
                if wind_speed > 17.2:  # ~34 knots
                    alerts.append({
                        "segment_id": point["segment_id"],
                        "time_iso": forecast["t_iso"],
                        "type": "CYCLONE/GALE",
                        "severity": "HIGH",
                        "message": f"Strong winds: {wind_speed:.1f} m/s ({wind_speed * 1.944:.0f} knots)"
                    })
                
                # Wave alerts
                if wave_height > 3.5:
                    alerts.append({
                        "segment_id": point["segment_id"],
                        "time_iso": forecast["t_iso"],
                        "type": "HIGH_WAVE",
                        "severity": "HIGH",
                        "message": f"High waves: {wave_height:.1f} m - consider route adjustment"
                    })
        
        return alerts
    
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Route not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    uvicorn.run(app, host="0.0.0.0", port=8000)