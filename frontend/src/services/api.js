import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      // Backend is not running, use mock data
      return Promise.reject(new Error('Backend unavailable'));
    }
    return Promise.reject(error);
  }
);

// Fetch route forecast
export const fetchRouteForecast = async (routeId) => {
  try {
    const response = await api.get(`/route_forecast?route_id=${routeId}`);
    return response.data;
  } catch (error) {
    // Fallback to mock data if backend is unavailable
    return getMockRouteForecast();
  }
};

// Optimize speed
export const optimizeRoute = async (route, vessel, constraints = {}) => {
  try {
    const response = await api.post('/optimize', { route, vessel, constraints });
    return response.data;
  } catch (error) {
    // Fallback to mock optimization
    return getMockOptimization(route, vessel);
  }
};

// Fetch alerts
export const fetchAlerts = async (routeId) => {
  try {
    const response = await api.get(`/alerts?route_id=${routeId}`);
    return response.data;
  } catch (error) {
    // Fallback to mock alerts
    return getMockAlerts();
  }
};

// Mock data functions
const getMockRouteForecast = () => {
  const mockRoutePoints = [
    { segment_id: 1, lat: 19.0760, lon: 72.8777 },
    { segment_id: 2, lat: 15.3173, lon: 75.7139 },
    { segment_id: 3, lat: 9.9312, lon: 76.2673 }
  ];

  return mockRoutePoints.map(point => ({
    segment_id: point.segment_id,
    lat: point.lat,
    lon: point.lon,
    forecast: {
      times: Array.from({ length: 240 }, (_, i) => ({
        t_iso: new Date(Date.now() + i * 3600000).toISOString(),
        wind_speed_ms: 8 + Math.sin(i / 12) * 6 + Math.random() * 2,
        wind_deg: 200 + Math.sin(i / 24) * 60,
        waves: {
          Hs_m: 1.5 + Math.sin(i / 18) * 1.0 + Math.random() * 0.5,
          Tp_s: 6 + Math.random() * 3
        },
        mock: true
      }))
    }
  }));
};

const getMockOptimization = (route, vessel) => {
  const totalFuel = route.length * 0.8; // Mock calculation
  const naiveFuel = route.length * 1.0;
  const savings = ((naiveFuel - totalFuel) / naiveFuel) * 100;

  return {
    speed_profile: route.map((segment, i) => ({
      segment_id: segment.segment_id,
      speed_kn: vessel.base_speed_kn - 1 + Math.random() * 2,
      eta_iso: new Date(Date.now() + (i + 1) * 8 * 3600000).toISOString(),
      fuel_t: totalFuel / route.length
    })),
    total_fuel: totalFuel,
    naive_fuel: naiveFuel,
    savings_pct: savings
  };
};

const getMockAlerts = () => {
  return [
    {
      segment_id: 2,
      time_iso: new Date(Date.now() + 12 * 3600000).toISOString(),
      type: "HIGH_WAVE",
      severity: "MEDIUM",
      message: "Moderate waves: 3.2 m - monitor conditions"
    }
  ];
};