// This file provides deterministic mocked responses used when the backend is unreachable or in mock mode.

const mockForecastData = [
    {
        segment_id: 1,
        lat: 12.9,
        lon: 74.8,
        forecast: {
            times: [
                { t_iso: "2025-08-21T12:00Z", wind_speed_ms: 8.4, wind_deg: 200, waves: { Hs_m: 1.2, Tp_s: 6.5 } },
                { t_iso: "2025-08-21T18:00Z", wind_speed_ms: 10.0, wind_deg: 210, waves: { Hs_m: 1.5, Tp_s: 7.0 } },
                { t_iso: "2025-08-22T00:00Z", wind_speed_ms: 12.0, wind_deg: 220, waves: { Hs_m: 2.0, Tp_s: 8.0 } },
                // Add more time entries as needed
            ]
        }
    },
    // Add more segments as needed
];

const mockOptimizeResponse = {
    speed_profile: [
        { segment_id: 1, speed_kn: 12, eta_iso: "2025-08-22T00:00Z", fuel_t: 0.123 },
        // Add more segments as needed
    ],
    total_fuel: 1.234,
    naive_fuel: 1.456,
    savings_pct: 15.3
};

const mockAlertsResponse = [
    { segment_id: 1, time_iso: "2025-08-21T12:00Z", type: "HIGH_WAVE", severity: "HIGH", message: "Hs 4.2 m - avoid" },
    // Add more alerts as needed
];

export const getRouteForecast = (route_id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockForecastData);
        }, 500);
    });
};

export const optimizeSpeed = (route, vessel, constraints) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockOptimizeResponse);
        }, 500);
    });
};

export const getAlerts = (route_id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockAlertsResponse);
        }, 500);
    });
};