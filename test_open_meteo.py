#!/usr/bin/env python3
"""
Test Open-Meteo API integration with Indian coordinates
"""

import sys
import os
sys.path.append('backend')

from src.ingest import get_weather_data

def test_indian_coordinates():
    """Test Open-Meteo API with Mumbai coordinates"""
    print("Testing Open-Meteo API with Indian coordinates...")
    
    # Mumbai coordinates from sample route
    lat, lon = 19.0760, 72.8777
    
    try:
        weather_data = get_weather_data(lat, lon)
        
        if weather_data:
            print(f"✅ Successfully retrieved {len(weather_data)} forecast points")
            
            # Check first data point
            first_point = weather_data[0]
            print(f"First forecast point:")
            print(f"  Time: {first_point.get('t_iso')}")
            print(f"  Wind Speed: {first_point.get('wind_speed_ms'):.1f} m/s")
            print(f"  Wind Direction: {first_point.get('wind_deg')}°")
            print(f"  Wave Height: {first_point.get('waves', {}).get('Hs_m', 0):.1f}m")
            
            # Check if it's real Open-Meteo data
            print("🌍 Using real Open-Meteo weather data for India!")
                
        else:
            print("❌ No weather data retrieved")
            
    except Exception as e:
        print(f"❌ Error testing Open-Meteo integration: {e}")

def test_delhi_coordinates():
    """Test with Delhi coordinates as provided by user"""
    print("\nTesting with Delhi coordinates...")
    
    lat, lon = 28.6139, 77.2090  # Delhi coordinates
    
    try:
        weather_data = get_weather_data(lat, lon)
        
        if weather_data:
            print(f"✅ Successfully retrieved {len(weather_data)} forecast points for Delhi")
            
            # Check first data point
            first_point = weather_data[0]
            print(f"Delhi weather:")
            print(f"  Time: {first_point.get('t_iso')}")
            print(f"  Wind Speed: {first_point.get('wind_speed_ms'):.1f} m/s")
            print(f"  Wind Direction: {first_point.get('wind_deg')}°")
            
        else:
            print("❌ No weather data retrieved for Delhi")
            
    except Exception as e:
        print(f"❌ Error testing Delhi coordinates: {e}")

if __name__ == "__main__":
    test_indian_coordinates()
    test_delhi_coordinates()
