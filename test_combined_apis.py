#!/usr/bin/env python3
"""
Test combined OpenWeather + Stormglass API integration
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend', 'src'))

from ingest import fetch_openweather, fetch_stormglass_waves, get_weather_data

def test_openweather_mumbai():
    """Test OpenWeather API with Mumbai coordinates"""
    print("🌤️ Testing OpenWeather API with Mumbai coordinates...")
    
    lat, lon = 19.0760, 72.8777
    print(f"📍 Location: Mumbai ({lat}, {lon})")
    
    openweather_data = fetch_openweather(lat, lon)
    
    if openweather_data:
        print("✅ OpenWeather API call successful!")
        
        current = openweather_data.get('current', {})
        if current:
            wind = current.get('wind', {})
            wind_speed_ms = wind.get('speed', 0)
            wind_speed_kts = wind_speed_ms * 1.944
            wind_deg = wind.get('deg', 0)
            temp = current.get('main', {}).get('temp', 0)
            
            print(f"🌡️  Current temperature: {temp}°C")
            print(f"💨 Current wind speed: {wind_speed_ms} m/s ({wind_speed_kts:.1f} kts)")
            print(f"🧭 Current wind direction: {wind_deg}°")
        
        forecast = openweather_data.get('forecast', {}).get('list', [])
        print(f"📊 Forecast entries: {len(forecast)}")
        
        return True
    else:
        print("❌ OpenWeather API call failed!")
        return False

def test_combined_data_mumbai():
    """Test combined weather data for Mumbai"""
    print("\n🔄 Testing combined OpenWeather + Stormglass data...")
    
    lat, lon = 19.0760, 72.8777
    weather_data = get_weather_data(lat, lon)
    
    if weather_data and len(weather_data) > 0:
        print("✅ Combined weather data fetch successful!")
        print(f"📊 Total forecast entries: {len(weather_data)}")
        
        first_entry = weather_data[0]
        wind_speed_ms = first_entry.get('wind_speed', 0)
        wind_speed_kts = wind_speed_ms * 1.944
        
        print(f"🌡️  Temperature: {first_entry.get('temperature', 'N/A')}°C")
        print(f"💨 Wind speed: {wind_speed_ms} m/s ({wind_speed_kts:.1f} kts)")
        print(f"🧭 Wind direction: {first_entry.get('wind_deg', 'N/A')}°")
        
        waves = first_entry.get('waves', {})
        wave_height = waves.get('Hs_m', 0)
        wave_period = waves.get('Tp_s', 0)
        
        print(f"🌊 Wave height: {wave_height:.1f}m")
        print(f"⏱️  Wave period: {wave_period:.1f}s")
        
        # Check data source
        if hasattr(first_entry, 'source'):
            print(f"📡 Data source: {first_entry.get('source', 'Unknown')}")
        
        # Validate realistic values
        if 0 <= wind_speed_ms <= 50 and 0 <= wave_height <= 20:
            print("✅ Data values appear realistic!")
        else:
            print("⚠️  Some values may be outside normal ranges")
        
        return True
    else:
        print("❌ Combined weather data fetch failed!")
        return False

def test_wind_speed_conversion():
    """Test wind speed conversion from m/s to knots"""
    print("\n🔄 Testing wind speed conversion...")
    
    test_cases = [
        (5.0, 9.7),    # Light breeze
        (10.0, 19.4),  # Fresh breeze  
        (15.0, 29.2),  # Strong breeze
        (20.0, 38.9)   # Near gale
    ]
    
    for ms, expected_kts in test_cases:
        calculated_kts = ms * 1.944
        print(f"💨 {ms} m/s = {calculated_kts:.1f} kts (expected: {expected_kts} kts)")
        
        if abs(calculated_kts - expected_kts) < 0.1:
            print("   ✅ Conversion correct")
        else:
            print("   ❌ Conversion error")

if __name__ == "__main__":
    print("🧪 Combined API Integration Test")
    print("=" * 50)
    
    try:
        # Test OpenWeather API
        openweather_success = test_openweather_mumbai()
        
        # Test combined data
        combined_success = test_combined_data_mumbai()
        
        # Test wind speed conversion
        test_wind_speed_conversion()
        
        print("\n" + "=" * 50)
        print("📋 Test Summary:")
        print(f"OpenWeather API: {'✅ PASS' if openweather_success else '❌ FAIL'}")
        print(f"Combined Data: {'✅ PASS' if combined_success else '❌ FAIL'}")
        
        if openweather_success and combined_success:
            print("\n🎉 All tests passed! Real weather data integration working!")
            print("\n📝 Frontend Integration Code:")
            print("```javascript")
            print("// Get real wind speed in knots for dashboard")
            print("fetch('/route_forecast?route_id=1')")
            print("  .then(res => res.json())")
            print("  .then(data => {")
            print("    const windMs = data[0].forecast.times[0].wind_speed_ms;")
            print("    const windKts = (windMs * 1.944).toFixed(1);")
            print("    document.getElementById('windSpeed').textContent = `${windKts} kts`;")
            print("  });")
            print("```")
        else:
            print("\n⚠️  Some tests failed. Check API keys and network connection.")
            
    except Exception as e:
        print(f"\n💥 Test failed with error: {e}")
        import traceback
        traceback.print_exc()
