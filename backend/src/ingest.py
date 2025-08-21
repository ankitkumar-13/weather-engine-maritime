from fastapi import HTTPException
import httpx
from typing import List, Dict, Any
import random
import time
import os
from datetime import datetime, timedelta

CACHE_TTL_SECONDS = 3600  # 1 hour cache TTL
CACHE = {}

def fetch_onecall(lat: float, lon: float) -> Dict[str, Any]:
    """Fetch weather data from OpenWeather API or return mock data"""
    owm_key = os.getenv("OWM_KEY")
    if not owm_key:
        return deterministic_mock(lat, lon)
    
    try:
        response = httpx.get(
            f"https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={owm_key}&units=metric"
        )
        response.raise_for_status()
        return response.json()
    except Exception:
        # Fallback to mock data if API fails
        return deterministic_mock(lat, lon)

def normalize_onecall(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Normalize the response from the weather API to our internal format"""
    normalized = []
    
    # Handle both real API response and mock data
    if "hourly" in data:
        hourly_data = data["hourly"][:240]  # 10 days * 24 hours
    else:
        hourly_data = data.get("forecast", [])
    
    for i, hourly in enumerate(hourly_data):
        dt_iso = datetime.fromtimestamp(hourly.get("dt", time.time() + i * 3600)).isoformat() + "Z"
        normalized.append({
            "t_iso": dt_iso,
            "wind_speed_ms": hourly.get("wind_speed", 0),
            "wind_deg": hourly.get("wind_deg", 0),
            "waves": {
                "Hs_m": hourly.get("waves", {}).get("Hs_m", random.uniform(0.5, 3.0)),
                "Tp_s": hourly.get("waves", {}).get("Tp_s", random.uniform(5, 10))
            }
        })
    
    return normalized

def deterministic_mock(lat: float, lon: float) -> Dict[str, Any]:
    """Create a deterministic mock based on lat/lon"""
    seed = int((lat + lon) * 1000) % 1000
    random.seed(seed)
    
    hourly_data = []
    for i in range(240):  # 10 days * 24 hours
        hourly_data.append({
            "dt": int(time.time()) + i * 3600,
            "wind_speed": random.uniform(2, 20),
            "wind_deg": random.randint(0, 360),
            "waves": {
                "Hs_m": random.uniform(0.5, 4.0),
                "Tp_s": random.uniform(5, 12)
            }
        })
    
    return {
        "lat": lat,
        "lon": lon,
        "hourly": hourly_data
    }

def get_weather_data(lat: float, lon: float) -> List[Dict[str, Any]]:
    """Get cached or fresh weather data"""
    cache_key = f"{lat},{lon}"
    if cache_key in CACHE:
        cached_data, timestamp = CACHE[cache_key]
        if time.time() - timestamp < CACHE_TTL_SECONDS:
            return cached_data

    try:
        data = fetch_onecall(lat, lon)
        normalized_data = normalize_onecall(data)
        CACHE[cache_key] = (normalized_data, time.time())
        return normalized_data
    except Exception:
        data = deterministic_mock(lat, lon)
        normalized_data = normalize_onecall(data)
        CACHE[cache_key] = (normalized_data, time.time())
        return normalized_data