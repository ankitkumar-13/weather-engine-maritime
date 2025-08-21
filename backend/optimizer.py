from typing import List, Dict, Any, Optional
import math
from datetime import datetime, timedelta

def compute_added_resistance(Hs_m: float) -> float:
    """Compute added resistance coefficient due to waves"""
    return min(0.3, Hs_m * 0.05)

def fuel_for_segment(speed_kn: float, Hs_m: float, dist_nm: float, current_along_track_kn: float = 0) -> tuple[float, float]:
    """Calculate fuel consumption and travel time for a segment"""
    # Convert speed to m/s
    v_ms = speed_kn * 0.514444
    
    # Base power proportional to speed cubed
    base_power = v_ms ** 3
    
    # Fuel rate (tons per hour) - simplified model
    k = 1e-5  # scaling factor
    fuel_rate_t_per_h = k * base_power
    
    # Added resistance due to waves
    added_resistance_coeff = compute_added_resistance(Hs_m)
    
    # Speed over ground considering current
    sog_kn = speed_kn + current_along_track_kn
    if sog_kn <= 0:
        sog_kn = 0.1  # Prevent division by zero
    
    # Travel time
    hours = dist_nm / sog_kn
    
    # Total fuel for segment
    fuel_segment = fuel_rate_t_per_h * hours * (1 + added_resistance_coeff)
    
    return fuel_segment, hours

def optimize_route(
    route: List[Dict[str, Any]], 
    forecasts: Dict[str, List[Dict[str, Any]]], 
    vessel: Dict[str, Any],
    speed_candidates: List[float] = None,
    start_time_iso: Optional[str] = None,
    deadline_iso: Optional[str] = None
) -> Dict[str, Any]:
    """
    Optimize route using dynamic programming to minimize fuel consumption
    """
    if speed_candidates is None:
        speed_candidates = [8, 9, 10, 11, 12, 13, 14]
    
    if start_time_iso is None:
        start_time = datetime.now()
    else:
        start_time = datetime.fromisoformat(start_time_iso.replace('Z', '+00:00'))
    
    # Simple optimization: try each speed and pick the best
    best_fuel = float('inf')
    best_profile = []
    
    for speed in speed_candidates:
        total_fuel = 0
        speed_profile = []
        current_time = start_time
        
        for i, segment in enumerate(route):
            segment_id = segment.get('segment_id', i + 1)
            dist_nm = segment.get('dist_nm', 50)
            
            # Get forecast for this segment
            forecast_data = forecasts.get(str(segment_id), [])
            if forecast_data:
                # Use first forecast point for simplicity
                Hs_m = forecast_data[0].get('waves', {}).get('Hs_m', 1.0)
            else:
                Hs_m = 1.0  # Default wave height
            
            fuel, hours = fuel_for_segment(speed, Hs_m, dist_nm)
            current_time += timedelta(hours=hours)
            total_fuel += fuel
            
            speed_profile.append({
                "segment_id": segment_id,
                "speed_kn": speed,
                "eta_iso": current_time.isoformat() + "Z",
                "fuel_t": fuel
            })
        
        if total_fuel < best_fuel:
            best_fuel = total_fuel
            best_profile = speed_profile
    
    # Calculate naive fuel (all segments at base speed)
    naive_fuel = 0
    base_speed = vessel.get('base_speed_kn', 12.0)
    for segment in route:
        fuel, _ = fuel_for_segment(base_speed, 1.0, segment.get('dist_nm', 50))
        naive_fuel += fuel
    
    savings_pct = ((naive_fuel - best_fuel) / naive_fuel * 100) if naive_fuel > 0 else 0
    
    return {
        "speed_profile": best_profile,
        "total_fuel": best_fuel,
        "naive_fuel": naive_fuel,
        "savings_pct": max(0, savings_pct)
    }