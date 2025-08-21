import pytest
from backend.src.optimizer import optimize_route, fuel_for_segment, compute_added_resistance

def test_fuel_for_segment():
    # Test with known values
    speed_kn = 12.0
    Hs_m = 2.0
    dist_nm = 50.0
    fuel_t, hours = fuel_for_segment(speed_kn, Hs_m, dist_nm)
    
    # Check if fuel_t is a positive number
    assert fuel_t > 0
    # Check if hours is a positive number
    assert hours > 0

def test_compute_added_resistance():
    # Test added resistance for different wave heights
    assert compute_added_resistance(0) == 0
    assert compute_added_resistance(1) == 0.05
    assert compute_added_resistance(6) == 0.3  # Should cap at 0.3

def test_optimize_route():
    route = [
        {"segment_id": 1, "lat": 12.9, "lon": 74.8, "dist_nm": 50},
        {"segment_id": 2, "lat": 13.0, "lon": 75.0, "dist_nm": 50}
    ]
    vessel = {"name": "DemoVessel", "base_speed_kn": 12.0}
    forecasts = {
    "1": [{"waves": {"Hs_m": 1.2}}],
    "2": [{"waves": {"Hs_m": 2.0}}]
}
    
    result = optimize_route(route, forecasts, vessel)
    
    # Check if the result contains the expected keys
    assert "speed_profile" in result
    assert "total_fuel" in result
    assert "naive_fuel" in result
    assert "savings_pct" in result
    
    # Check if total_fuel is less than naive_fuel
    assert result["total_fuel"] < result["naive_fuel"]
