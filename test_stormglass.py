#!/usr/bin/env python3
"""
Test Stormglass API integration with Mumbai coordinates
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend', 'src'))

from ingest import fetch_stormglass_waves, get_weather_data

def test_stormglass_mumbai():
    """Test Stormglass API with Mumbai coordinates"""
    print("🌊 Testing Stormglass API with Mumbai coordinates...")
    
    # Mumbai coordinates
    lat, lon = 19.0760, 72.8777
    
    print(f"📍 Location: Mumbai ({lat}, {lon})")
    
    # Test direct Stormglass API call
    print("\n1. Testing direct Stormglass wave data fetch...")
    wave_data = fetch_stormglass_waves(lat, lon)
    
    if wave_data:
        print("✅ Stormglass API call successful!")
        hours = wave_data.get('hours', [])
        print(f"📊 Received {len(hours)} hours of wave data")
        
        if hours:
            first_hour = hours[0]
            print(f"🕐 First hour data: {first_hour.get('time', 'N/A')}")
            
            # Check wave height data
            if 'waveHeight' in first_hour:
                wave_sources = first_hour['waveHeight']
                print(f"🌊 Wave height sources: {list(wave_sources.keys())}")
                for source, value in wave_sources.items():
                    if value is not None:
                        print(f"   {source}: {value}m")
            
            # Check wave period data
            if 'wavePeriod' in first_hour:
                period_sources = first_hour['wavePeriod']
                print(f"⏱️  Wave period sources: {list(period_sources.keys())}")
                for source, value in period_sources.items():
                    if value is not None:
                        print(f"   {source}: {value}s")
    else:
        print("❌ Stormglass API call failed!")
        return False
    
    # Test combined weather data
    print("\n2. Testing combined weather + wave data...")
    weather_data = get_weather_data(lat, lon)
    
    if weather_data:
        print("✅ Combined weather data fetch successful!")
        print(f"📊 Received {len(weather_data)} forecast entries")
        
        if weather_data:
            first_entry = weather_data[0]
            print(f"🌡️  Temperature: {first_entry.get('temperature', 'N/A')}°C")
            print(f"💨 Wind speed: {first_entry.get('wind_speed', 'N/A')} m/s")
            print(f"🧭 Wind direction: {first_entry.get('wind_deg', 'N/A')}°")
            
            waves = first_entry.get('waves', {})
            print(f"🌊 Wave height: {waves.get('Hs_m', 'N/A')}m")
            print(f"⏱️  Wave period: {waves.get('Tp_s', 'N/A')}s")
            
            # Check if we're getting real or mock data
            if 'source' in first_entry:
                print(f"📡 Data source: {first_entry['source']}")
    else:
        print("❌ Combined weather data fetch failed!")
        return False
    
    return True

def test_stormglass_kochi():
    """Test Stormglass API with Kochi coordinates"""
    print("\n🌊 Testing Stormglass API with Kochi coordinates...")
    
    # Kochi coordinates
    lat, lon = 9.9312, 76.2673
    
    print(f"📍 Location: Kochi ({lat}, {lon})")
    
    # Test combined weather data
    weather_data = get_weather_data(lat, lon)
    
    if weather_data and len(weather_data) > 0:
        first_entry = weather_data[0]
        waves = first_entry.get('waves', {})
        wave_height = waves.get('Hs_m', 0)
        
        print(f"🌊 Wave height: {wave_height}m")
        
        # Check if wave height looks realistic (not random)
        if 0.1 <= wave_height <= 10.0:
            print("✅ Wave height appears realistic!")
        else:
            print("⚠️  Wave height might be mock data")
        
        return True
    else:
        print("❌ Kochi weather data fetch failed!")
        return False

if __name__ == "__main__":
    print("🧪 Stormglass API Integration Test")
    print("=" * 50)
    
    try:
        # Test Mumbai
        mumbai_success = test_stormglass_mumbai()
        
        # Test Kochi
        kochi_success = test_stormglass_kochi()
        
        print("\n" + "=" * 50)
        print("📋 Test Summary:")
        print(f"Mumbai: {'✅ PASS' if mumbai_success else '❌ FAIL'}")
        print(f"Kochi: {'✅ PASS' if kochi_success else '❌ FAIL'}")
        
        if mumbai_success and kochi_success:
            print("\n🎉 All tests passed! Stormglass integration working!")
        else:
            print("\n⚠️  Some tests failed. Check API key and network connection.")
            
    except Exception as e:
        print(f"\n💥 Test failed with error: {e}")
        import traceback
        traceback.print_exc()
