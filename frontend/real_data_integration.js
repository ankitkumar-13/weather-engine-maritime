/**
 * Real Data Integration for Frontend Dashboard
 * Replaces static metrics with live API data
 */

class DashboardUpdater {
    constructor() {
        this.apiBase = window.location.hostname === 'localhost' 
            ? 'http://localhost:8000' 
            : 'https://your-production-api.com';
        this.updateInterval = 30000; // 30 seconds
        this.init();
    }

    async init() {
        await this.updateAllMetrics();
        setInterval(() => this.updateAllMetrics(), this.updateInterval);
    }

    async updateAllMetrics() {
        try {
            await Promise.all([
                this.updateWaveHeight(),
                this.updateWindSpeed(),
                this.updateFuelSavings(),
                this.updateAlertCount()
            ]);
        } catch (error) {
            console.error('Error updating dashboard metrics:', error);
        }
    }

    async updateWaveHeight() {
        try {
            // Get wave data from route forecast
            const response = await fetch(`${this.apiBase}/route_forecast?route_id=1`);
            const data = await response.json();
            
            if (data.length > 0) {
                const currentWaves = data[0].forecast.times[0].waves.Hs_m;
                const waveElement = document.getElementById('waveHeight');
                
                if (waveElement) {
                    waveElement.textContent = `${currentWaves.toFixed(1)}m`;
                    
                    // Update trend indicator
                    const trendElement = waveElement.parentElement.querySelector('.text-sm');
                    if (currentWaves < 2.0) {
                        trendElement.innerHTML = '<i class="fas fa-arrow-down mr-1"></i>Calm';
                        trendElement.className = 'mt-2 text-sm text-green-400';
                    } else if (currentWaves < 3.5) {
                        trendElement.innerHTML = '<i class="fas fa-arrow-right mr-1"></i>Moderate';
                        trendElement.className = 'mt-2 text-sm text-yellow-400';
                    } else {
                        trendElement.innerHTML = '<i class="fas fa-arrow-up mr-1"></i>High';
                        trendElement.className = 'mt-2 text-sm text-red-400';
                    }
                }
            }
        } catch (error) {
            console.error('Error updating wave height:', error);
        }
    }

    async updateWindSpeed() {
        try {
            const response = await fetch(`${this.apiBase}/route_forecast?route_id=1`);
            const data = await response.json();
            
            if (data.length > 0) {
                const windData = data[0].forecast.times[0];
                const windSpeedMs = windData.wind_speed_ms;
                const windSpeedKnots = (windSpeedMs * 1.944).toFixed(1);
                const windDirection = this.getWindDirection(windData.wind_deg);
                
                const windElement = document.getElementById('windSpeed');
                if (windElement) {
                    windElement.textContent = `${windSpeedKnots} kts`;
                    
                    // Update trend based on wind strength with direction
                    const trendElement = windElement.parentElement.querySelector('.text-sm');
                    if (windSpeedMs < 5) {
                        trendElement.innerHTML = `<i class="fas fa-leaf mr-1"></i>Light ${windDirection}`;
                        trendElement.className = 'mt-2 text-sm text-green-400';
                    } else if (windSpeedMs < 15) {
                        trendElement.innerHTML = `<i class="fas fa-wind mr-1"></i>Moderate ${windDirection}`;
                        trendElement.className = 'mt-2 text-sm text-yellow-400';
                    } else {
                        trendElement.innerHTML = `<i class="fas fa-exclamation-triangle mr-1"></i>Strong ${windDirection}`;
                        trendElement.className = 'mt-2 text-sm text-red-400';
                    }
                }
            }
        } catch (error) {
            console.error('Error updating wind speed:', error);
            // Fallback to OpenWeather direct API call
            this.updateWindSpeedDirect();
        }
    }

    async updateWindSpeedDirect() {
        try {
            // Direct OpenWeather API call as fallback
            const lat = 19.0760; // Mumbai coordinates
            const lon = 72.8777;
            const apiKey = '24302ec53814dd7ded88bc752141cc52';
            
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
            );
            const data = await response.json();
            
            if (data.wind) {
                const windSpeedMs = data.wind.speed;
                const windSpeedKnots = (windSpeedMs * 1.944).toFixed(1);
                const windDirection = this.getWindDirection(data.wind.deg);
                
                const windElement = document.getElementById('windSpeed');
                if (windElement) {
                    windElement.textContent = `${windSpeedKnots} kts`;
                    
                    const trendElement = windElement.parentElement.querySelector('.text-sm');
                    trendElement.innerHTML = `<i class="fas fa-wind mr-1"></i>Live ${windDirection}`;
                    trendElement.className = 'mt-2 text-sm text-blue-400';
                }
            }
        } catch (error) {
            console.error('Error with direct wind speed update:', error);
        }
    }

    async updateFuelSavings() {
        try {
            // Get route data first
            const routeResponse = await fetch(`${this.apiBase}/route_forecast?route_id=1`);
            const routeData = await routeResponse.json();
            
            if (routeData.length > 0) {
                // Prepare optimization request
                const optimizationRequest = {
                    route: routeData.map(segment => ({
                        segment_id: segment.segment_id,
                        lat: segment.lat,
                        lon: segment.lon,
                        dist_nm: 50 // Default distance
                    })),
                    vessel: {
                        name: "DemoVessel",
                        base_speed_kn: 12.0
                    },
                    constraints: {}
                };

                const response = await fetch(`${this.apiBase}/optimize`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(optimizationRequest)
                });

                const optimization = await response.json();
                const savings = optimization.savings_pct;
                
                const savingsElement = document.getElementById('fuelSavings');
                if (savingsElement) {
                    savingsElement.textContent = `${savings.toFixed(1)}%`;
                    
                    // Update color and trend based on savings
                    const trendElement = savingsElement.parentElement.querySelector('.text-sm');
                    if (savings > 10) {
                        savingsElement.className = 'text-2xl font-bold metric-counter premium-text text-green-400';
                        trendElement.innerHTML = '<i class="fas fa-arrow-up mr-1"></i>Excellent';
                        trendElement.className = 'mt-2 text-sm text-green-400';
                    } else if (savings > 5) {
                        savingsElement.className = 'text-2xl font-bold metric-counter premium-text text-yellow-400';
                        trendElement.innerHTML = '<i class="fas fa-arrow-right mr-1"></i>Good';
                        trendElement.className = 'mt-2 text-sm text-yellow-400';
                    } else {
                        savingsElement.className = 'text-2xl font-bold metric-counter premium-text text-red-400';
                        trendElement.innerHTML = '<i class="fas fa-arrow-down mr-1"></i>Poor';
                        trendElement.className = 'mt-2 text-sm text-red-400';
                    }
                }
            }
        } catch (error) {
            console.error('Error updating fuel savings:', error);
        }
    }

    async updateAlertCount() {
        try {
            const response = await fetch(`${this.apiBase}/alerts?route_id=1`);
            const alerts = await response.json();
            
            // Filter for active alerts (next 24 hours)
            const now = new Date();
            const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            
            const activeAlerts = alerts.filter(alert => {
                const alertTime = new Date(alert.time_iso);
                return alertTime >= now && alertTime <= next24h;
            });

            const alertElement = document.getElementById('alertCount');
            if (alertElement) {
                alertElement.textContent = activeAlerts.length;
                
                // Update status and color
                const trendElement = alertElement.parentElement.querySelector('.text-sm');
                if (activeAlerts.length === 0) {
                    trendElement.innerHTML = '<i class="fas fa-check mr-1"></i>All Clear';
                    trendElement.className = 'mt-2 text-sm text-green-400';
                } else {
                    const criticalAlerts = activeAlerts.filter(a => a.severity === 'HIGH').length;
                    if (criticalAlerts > 0) {
                        trendElement.innerHTML = `<i class="fas fa-exclamation-triangle mr-1"></i>${criticalAlerts} Critical`;
                        trendElement.className = 'mt-2 text-sm text-red-400';
                    } else {
                        trendElement.innerHTML = `<i class="fas fa-warning mr-1"></i>${activeAlerts.length} Active`;
                        trendElement.className = 'mt-2 text-sm text-yellow-400';
                    }
                }
            }
        } catch (error) {
            console.error('Error updating alert count:', error);
        }
    }

    getWindDirection(degrees) {
        const directions = [
            'N', 'NNE', 'NE', 'ENE',
            'E', 'ESE', 'SE', 'SSE',
            'S', 'SSW', 'SW', 'WSW',
            'W', 'WNW', 'NW', 'NNW'
        ];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }
}

// Initialize dashboard updater when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DashboardUpdater();
});

// Export for manual testing
window.DashboardUpdater = DashboardUpdater;
