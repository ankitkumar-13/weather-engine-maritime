import React, { useEffect, useRef } from 'react';

const Map = ({ forecastData, selectedTimeIndex, speedProfile }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Simple fallback map implementation using Canvas or basic rendering
    if (!mapRef.current || !forecastData.length) return;

    const canvas = mapRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw background
    ctx.fillStyle = '#E0F2FE';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate bounds
    const lats = forecastData.map(p => p.lat);
    const lons = forecastData.map(p => p.lon);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    
    const latRange = maxLat - minLat || 1;
    const lonRange = maxLon - minLon || 1;
    
    // Convert lat/lon to canvas coordinates
    const toCanvasCoords = (lat, lon) => {
      const x = ((lon - minLon) / lonRange) * (canvas.width - 100) + 50;
      const y = ((maxLat - lat) / latRange) * (canvas.height - 100) + 50;
      return { x, y };
    };
    
    // Draw route line
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    forecastData.forEach((point, index) => {
      const { x, y } = toCanvasCoords(point.lat, point.lon);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Draw points
    forecastData.forEach((point, index) => {
      const { x, y } = toCanvasCoords(point.lat, point.lon);
      const currentForecast = point.forecast?.times[selectedTimeIndex];
      
      // Determine color based on conditions
      let color = '#10B981'; // Green
      
      if (currentForecast) {
        const windSpeed = currentForecast.wind_speed_ms || 0;
        const waveHeight = currentForecast.waves?.Hs_m || 0;
        
        if (windSpeed > 17.2 || waveHeight > 3.5) {
          color = '#EF4444'; // Red
        } else if (windSpeed > 12 || waveHeight > 2.5) {
          color = '#F59E0B'; // Orange
        }
      }
      
      // Draw marker
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw white border
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw segment label
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.fillText(`S${point.segment_id}`, x + 12, y + 4);
      
      // Speed profile overlay
      if (speedProfile) {
        const speedData = speedProfile.find(sp => sp.segment_id === point.segment_id);
        if (speedData) {
          ctx.fillStyle = '#000000';
          ctx.font = '10px Arial';
          ctx.fillText(`${speedData.speed_kn.toFixed(1)}kn`, x + 12, y + 16);
        }
      }
    });
    
  }, [forecastData, selectedTimeIndex, speedProfile]);

  const handleCanvasClick = (event) => {
    // Handle click events if needed
    const rect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log('Clicked at:', x, y);
  };

  return (
    <div className="relative w-full h-96">
      <canvas
        ref={mapRef}
        className="w-full h-full border border-gray-300 rounded-lg bg-blue-50"
        onClick={handleCanvasClick}
        style={{ minHeight: '400px' }}
      />
      
      {/* Weather Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
        <h4 className="text-sm font-semibold mb-2">Conditions</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Good (Wind &lt;12 m/s, Waves &lt;2.5m)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span>Moderate (Wind 12-17 m/s, Waves 2.5-3.5m)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Severe (Wind &gt;17 m/s, Waves &gt;3.5m)</span>
          </div>
        </div>
      </div>

      {/* Route Info */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg">
        <h4 className="text-sm font-semibold mb-1">Route: Mumbai → Kochi</h4>
        <p className="text-xs text-gray-600">
          {forecastData.length} segments • Indian Ocean
        </p>
      </div>

      {/* Current Weather Info for Selected Time */}
      {forecastData.length > 0 && selectedTimeIndex >= 0 && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg max-w-xs">
          <h4 className="text-sm font-semibold mb-2">Current Conditions</h4>
          {forecastData.map((segment) => {
            const forecast = segment.forecast?.times[selectedTimeIndex];
            if (!forecast) return null;
            
            return (
              <div key={segment.segment_id} className="mb-2 text-xs">
                <div className="font-medium text-gray-700">Segment {segment.segment_id}</div>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  <div>Wind: {forecast.wind_speed_ms?.toFixed(1)} m/s</div>
                  <div>Waves: {forecast.waves?.Hs_m?.toFixed(1)} m</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Map;
