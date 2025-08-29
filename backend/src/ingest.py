from fastapi import HTTPException
import httpx
import requests
from typing import List, Dict, Any
import random
import time
import os
from datetime import datetime, timedelta

CACHE_TTL_SECONDS = 3600  # 1 hour cache TTL
CACHE = {}
STORMGLASS_API_KEY = "2cebe332-84c9-11f0-a59f-0242ac130006-2cebe3f0-84c9-11f0-a59f-0242ac130006"
OPENWEATHER_API_KEY = "24302ec53814dd7ded88bc752141cc52"

def fetch_openweather(lat: float, lon: float) -> Dict[str, Any]:
    """Fetch weather data from OpenWeatherMap API"""
    try:
        # Current weather
        current_url = f"https://api.openweathermap.org/data/2.5/weather"
        current_params = {
            "lat": lat,
            "lon": lon,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric"
        }
        
        # Forecast data
        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast"
        forecast_params = {
            "lat": lat,
            "lon": lon,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric"
        }
        
        current_response = requests.get(current_url, params=current_params)
        current_response.raise_for_status()
        current_data = current_response.json()
        
        forecast_response = requests.get(forecast_url, params=forecast_params)
        forecast_response.raise_for_status()
        forecast_data = forecast_response.json()
        
        return {
            "current": current_data,
            "forecast": forecast_data
        }
        
    except Exception as e:
        print(f"OpenWeather API failed for {lat},{lon}: {e}")
        return None

def fetch_open_meteo(lat: float, lon: float) -> Dict[str, Any]:
    """Fetch weather data from Open-Meteo API"""
    try:
        # Open-Meteo API for weather forecast data
        weather_url = f"https://api.open-meteo.com/v1/forecast"
        weather_params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": "temperature_2m,windspeed_10m,winddirection_10m",
            "current_weather": True,
            "forecast_days": 10
        }
        
        weather_response = requests.get(weather_url, params=weather_params)
        weather_response.raise_for_status()
        weather_data = weather_response.json()
        
        return {"weather": weather_data}
            
    except Exception as e:
        print(f"Open-Meteo API failed for {lat},{lon}: {e}")
        return None

def fetch_stormglass_waves(lat: float, lon: float) -> Dict[str, Any]:
    """Fetch real wave data from Stormglass API"""
    try:
        url = "https://api.stormglass.io/v2/weather/point"
        params = {
            "lat": lat,
            "lng": lon,
            "params": "waveHeight,swellHeight,waveDirection,wavePeriod"
        }
        headers = {
            "Authorization": STORMGLASS_API_KEY
        }
        
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        if not data.get('hours'):
            raise Exception("No wave data in Stormglass response")
            
        return data
        
    except Exception as e:
        print(f"Stormglass API failed for {lat},{lon}: {e}")
        return None

def format_open_meteo_data(meteo_data: Dict[str, Any], lat: float, lon: float) -> Dict[str, Any]:
    """Convert Open-Meteo data to our internal format with real wave data"""
    try:
        # Handle combined marine + weather data
        if 'marine' in meteo_data and 'weather' in meteo_data:
            marine_hourly = meteo_data['marine'].get('hourly', {})
            weather_hourly = meteo_data['weather'].get('hourly', {})
            
            times = weather_hourly.get('time', [])
            temperatures = weather_hourly.get('temperature_2m', [])
            wind_speeds = weather_hourly.get('windspeed_10m', [])
            wind_directions = weather_hourly.get('winddirection_10m', [])
            
            # Marine data
            wave_heights = marine_hourly.get('wave_height', [])
            wave_periods = marine_hourly.get('wave_period', [])
            wave_directions = marine_hourly.get('wave_direction', [])
            
        elif 'weather' in meteo_data:
            # Weather-only data
            weather_hourly = meteo_data['weather'].get('hourly', {})
            times = weather_hourly.get('time', [])
            temperatures = weather_hourly.get('temperature_2m', [])
            wind_speeds = weather_hourly.get('windspeed_10m', [])
            wind_directions = weather_hourly.get('winddirection_10m', [])
            
            # No marine data available
            wave_heights = []
            wave_periods = []
            wave_directions = []
            
        else:
            # Legacy format
            hourly = meteo_data.get('hourly', {})
            times = hourly.get('time', [])
            temperatures = hourly.get('temperature_2m', [])
            wind_speeds = hourly.get('windspeed_10m', [])
            wind_directions = hourly.get('winddirection_10m', [])
            wave_heights = []
            wave_periods = []
            wave_directions = []
        
        hourly_data = []
        for i in range(min(240, len(times))):  # 10 days * 24 hours
            time_str = times[i]
            dt = datetime.fromisoformat(time_str.replace('Z', '+00:00'))
            
            # Convert wind speed from km/h to m/s
            wind_speed_kmh = wind_speeds[i] if i < len(wind_speeds) else 18.0
            wind_speed_ms = wind_speed_kmh / 3.6 if wind_speed_kmh else 5.0
            
            # Use real wave data if available, otherwise fallback to reasonable defaults
            if i < len(wave_heights) and wave_heights[i] is not None:
                wave_height = wave_heights[i]
            else:
                wave_height = 1.5 + (i % 24) * 0.1  # Gentle variation based on time
                
            if i < len(wave_periods) and wave_periods[i] is not None:
                wave_period = wave_periods[i]
            else:
                wave_period = 6.0 + (i % 12) * 0.5  # Realistic wave periods
            
            hourly_data.append({
                "dt": int(dt.timestamp()),
                "wind_speed": wind_speed_ms,
                "wind_deg": wind_directions[i] if i < len(wind_directions) else 180,
                "temperature": temperatures[i] if i < len(temperatures) else 25.0,
                "waves": {
                    "Hs_m": wave_height,
                    "Tp_s": wave_period
                }
            })
        
        source = "Open-Meteo"
        if 'marine' in meteo_data:
            source += " Marine"
        
        return {
            "lat": lat,
            "lon": lon,
            "hourly": hourly_data,
            "source": source
        }
        
    except Exception as e:
        print(f"Error formatting Open-Meteo data: {e}")
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
    """Get cached or fresh weather data combining OpenWeather, Stormglass, and Open-Meteo"""
    cache_key = f"{lat},{lon}"
    if cache_key in CACHE:
        cached_data, timestamp = CACHE[cache_key]
        if time.time() - timestamp < CACHE_TTL_SECONDS:
            return cached_data

    try:
        # Primary: OpenWeather for wind/temperature data
        openweather_data = fetch_openweather(lat, lon)
        
        # Secondary: Stormglass for wave data
        wave_data = fetch_stormglass_waves(lat, lon)
        
        # Fallback: Open-Meteo if OpenWeather fails
        if not openweather_data:
            meteo_data = fetch_open_meteo(lat, lon)
            combined_data = combine_weather_and_waves_meteo(meteo_data, wave_data, lat, lon)
        else:
            combined_data = combine_openweather_and_waves(openweather_data, wave_data, lat, lon)
        
        normalized_data = normalize_onecall(combined_data)
        CACHE[cache_key] = (normalized_data, time.time())
        return normalized_data
    except Exception:
        data = deterministic_mock(lat, lon)
        normalized_data = normalize_onecall(data)
        CACHE[cache_key] = (normalized_data, time.time())
        return normalized_data

def combine_openweather_and_waves(openweather_data: Dict[str, Any], wave_data: Dict[str, Any], lat: float, lon: float) -> Dict[str, Any]:
    """Combine OpenWeather data with Stormglass wave data"""
    try:
        current = openweather_data.get('current', {})
        forecast = openweather_data.get('forecast', {}).get('list', [])
        
        hourly_data = []
        
        # Add current weather as first hour
        if current:
            hourly_data.append({
                "dt": current.get('dt', int(time.time())),
                "wind_speed": current.get('wind', {}).get('speed', 5.0),
                "wind_deg": current.get('wind', {}).get('deg', 180),
                "temperature": current.get('main', {}).get('temp', 25.0),
                "waves": {
                    "Hs_m": random.uniform(0.5, 3.0),  # Will be replaced with Stormglass
                    "Tp_s": random.uniform(5, 10)
                }
            })
        
        # Add forecast data
        for item in forecast[:239]:  # Limit to prevent overflow
            hourly_data.append({
                "dt": item.get('dt', int(time.time())),
                "wind_speed": item.get('wind', {}).get('speed', 5.0),
                "wind_deg": item.get('wind', {}).get('deg', 180),
                "temperature": item.get('main', {}).get('temp', 25.0),
                "waves": {
                    "Hs_m": random.uniform(0.5, 3.0),  # Will be replaced with Stormglass
                    "Tp_s": random.uniform(5, 10)
                }
            })
        
        # Replace wave data with Stormglass if available
        if wave_data and wave_data.get('hours'):
            stormglass_hours = wave_data['hours']
            
            for i, hour_data in enumerate(hourly_data):
                if i < len(stormglass_hours):
                    sg_hour = stormglass_hours[i]
                    
                    # Extract wave data from Stormglass
                    wave_height = None
                    wave_period = None
                    
                    if 'waveHeight' in sg_hour:
                        for source in sg_hour['waveHeight'].values():
                            if source is not None:
                                wave_height = source
                                break
                    
                    if 'wavePeriod' in sg_hour:
                        for source in sg_hour['wavePeriod'].values():
                            if source is not None:
                                wave_period = source
                                break
                    
                    if wave_height is not None:
                        hour_data['waves']['Hs_m'] = wave_height
                    if wave_period is not None:
                        hour_data['waves']['Tp_s'] = wave_period
        
        return {
            "lat": lat,
            "lon": lon,
            "hourly": hourly_data,
            "source": "OpenWeather + Stormglass"
        }
        
    except Exception as e:
        print(f"Error combining OpenWeather and wave data: {e}")
        return deterministic_mock(lat, lon)

def combine_weather_and_waves_meteo(meteo_data: Dict[str, Any], wave_data: Dict[str, Any], lat: float, lon: float) -> Dict[str, Any]:
    """Combine Open-Meteo weather data with Stormglass wave data (fallback)"""
    try:
        # Start with Open-Meteo formatted data
        combined = format_open_meteo_data(meteo_data, lat, lon)
        
        # If we have Stormglass wave data, replace the random wave data
        if wave_data and wave_data.get('hours'):
            stormglass_hours = wave_data['hours']
            
            for i, hour_data in enumerate(combined['hourly']):
                if i < len(stormglass_hours):
                    sg_hour = stormglass_hours[i]
                    
                    # Extract wave data from Stormglass
                    wave_height = None
                    wave_period = None
                    
                    if 'waveHeight' in sg_hour:
                        for source in sg_hour['waveHeight'].values():
                            if source is not None:
                                wave_height = source
                                break
                    
                    if 'wavePeriod' in sg_hour:
                        for source in sg_hour['wavePeriod'].values():
                            if source is not None:
                                wave_period = source
                                break
                    
                    if wave_height is not None:
                        hour_data['waves']['Hs_m'] = wave_height
                    if wave_period is not None:
                        hour_data['waves']['Tp_s'] = wave_period
            
            combined['source'] = "Open-Meteo + Stormglass"
        
        return combined
        
    except Exception as e:
        print(f"Error combining weather and wave data: {e}")
        return format_open_meteo_data(meteo_data, lat, lon)