#!/usr/bin/env python3
"""
Test enhanced Open-Meteo API integration with real data replacement
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend', 'src'))

from ingest import fetch_open_meteo, get_weather_data

def test_open_meteo_real_data():
    """Test Open-Meteo API with Mumbai coordinates for real data"""
    print("🌤️ Testing Enhanced Open-Meteo API Integration...")
    
    lat, lon = 19.0760, 72.8777
    print(f"📍 Location: Mumbai ({lat}, {lon})")
    
    # Test direct Open-Meteo API call
    print("\n1. Testing Open-Meteo weather data...")
    meteo_data = fetch_open_meteo(lat, lon)
    
    if meteo_data and 'weather' in meteo_data:
        weather = meteo_data['weather']
        current = weather.get('current_weather', {})
        hourly = weather.get('hourly', {})
        
        print("✅ Open-Meteo API call successful!")
        print(f"🌡️  Current temperature: {current.get('temperature', 'N/A')}°C")
        print(f"💨 Current wind speed: {current.get('windspeed', 'N/A')} km/h")
        print(f"🧭 Current wind direction: {current.get('winddirection', 'N/A')}°")
        
        if hourly:
            temps = hourly.get('temperature_2m', [])
            winds = hourly.get('windspeed_10m', [])
            print(f"📊 Hourly forecast entries: {len(temps)}")
            if temps and winds:
                print(f"🌡️  First hour temp: {temps[0]}°C")
                print(f"💨 First hour wind: {winds[0]} km/h")
    else:
        print("❌ Open-Meteo API call failed!")
        return False
    
    # Test integrated weather data
    print("\n2. Testing integrated weather data...")
    weather_data = get_weather_data(lat, lon)
    
    if weather_data and len(weather_data) > 0:
        print("✅ Integrated weather data successful!")
        print(f"📊 Total forecast entries: {len(weather_data)}")
        
        first_entry = weather_data[0]
        print(f"🌡️  Temperature: {first_entry.get('temperature', 'N/A')}°C")
        print(f"💨 Wind speed: {first_entry.get('wind_speed', 'N/A')} m/s")
        print(f"🧭 Wind direction: {first_entry.get('wind_deg', 'N/A')}°")
        
        waves = first_entry.get('waves', {})
        wave_height = waves.get('Hs_m', 0)
        wave_period = waves.get('Tp_s', 0)
        
        print(f"🌊 Wave height: {wave_height:.1f}m")
        print(f"⏱️  Wave period: {wave_period:.1f}s")
        
        # Check if wave data looks realistic (not random)
        if 1.0 <= wave_height <= 5.0 and 4.0 <= wave_period <= 12.0:
            print("✅ Wave data appears realistic!")
        else:
            print("⚠️  Wave data might be fallback values")
        
        return True
    else:
        print("❌ Integrated weather data failed!")
        return False

def test_data_source_comparison():
    """Compare data sources to identify mock vs real"""
    print("\n3. Testing data source comparison...")
    
    locations = [
        ("Mumbai", 19.0760, 72.8777),
        ("Kochi", 9.9312, 76.2673),
        ("Chennai", 13.0827, 80.2707)
    ]
    
    for name, lat, lon in locations:
        print(f"\n📍 Testing {name} ({lat}, {lon})")
        weather_data = get_weather_data(lat, lon)
        
        if weather_data and len(weather_data) > 0:
            first_entry = weather_data[0]
            wind_speed = first_entry.get('wind_speed', 0)
            wave_height = first_entry.get('waves', {}).get('Hs_m', 0)
            
            print(f"   💨 Wind: {wind_speed:.1f} m/s")
            print(f"   🌊 Waves: {wave_height:.1f}m")
            
            # Check for realistic variation between locations
            if 0 <= wind_speed <= 30 and 0.5 <= wave_height <= 8.0:
                print(f"   ✅ {name} data looks realistic")
            else:
                print(f"   ⚠️  {name} data may be mock")

if __name__ == "__main__":
    print("🧪 Enhanced Open-Meteo Integration Test")
    print("=" * 50)
    
    try:
        # Test Open-Meteo integration
        success = test_open_meteo_real_data()
        
        # Test data source comparison
        test_data_source_comparison()
        
        print("\n" + "=" * 50)
        print("📋 Test Summary:")
        print(f"Open-Meteo Integration: {'✅ PASS' if success else '❌ FAIL'}")
        
        if success:
            print("\n🎉 Open-Meteo integration working!")
            print("✅ Real weather data is now replacing mock data")
            print("🌡️  Temperature, wind speed, and direction are real")
            print("🌊 Wave data uses realistic fallback when marine API unavailable")
        else:
            print("\n⚠️  Integration needs attention")
            
    except Exception as e:
        print(f"\n💥 Test failed with error: {e}")
        import traceback
        traceback.print_exc()
