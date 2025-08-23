/**
 * WEATHER ENGINE MARITIME - CHARTS FUNCTIONALITY
 * Chart.js implementations for weather, performance, and fuel consumption charts
 */

// Initialize all charts
function initCharts() {
    initWeatherChart();
    initPerformanceChart();
    initWeatherTrendChart();
    initFuelChart();
}

// Weather conditions chart
function initWeatherChart() {
    const ctx = document.getElementById('weatherChart');
    if (!ctx) return;

    weatherChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Calm', 'Moderate', 'Rough', 'Severe'],
            datasets: [{
                data: [45, 30, 20, 5],
                backgroundColor: ['#22c55e', '#eab308', '#f97316', '#ef4444'],
                borderWidth: 2,
                borderColor: '#1e293b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        padding: 20,
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

// Performance metrics chart
function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [{
                label: 'Speed (knots)',
                data: [12.5, 13.2, 12.8, 13.5, 13.1, 12.9],
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Fuel Rate (MT/hr)',
                data: [2.1, 2.3, 2.0, 2.4, 2.2, 2.1],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            ...CHART_CONFIG,
            scales: {
                ...CHART_CONFIG.scales,
                y: {
                    ...CHART_CONFIG.scales.y,
                    beginAtZero: false
                }
            }
        }
    });
}

// Weather trend chart
function initWeatherTrendChart() {
    const ctx = document.getElementById('weatherTrendChart');
    if (!ctx) return;

    weatherTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: 'Wave Height (m)',
                data: [1.2, 2.1, 3.2, 2.8, 1.9],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Wind Speed (kts)',
                data: [15, 22, 28, 25, 18],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: CHART_CONFIG
    });
}

// Fuel consumption chart
function initFuelChart() {
    const ctx = document.getElementById('fuelChart');
    if (!ctx) return;

    fuelChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Optimal Route', 'Standard Route', 'Direct Route'],
            datasets: [{
                label: 'Fuel Consumption (MT)',
                data: [145.2, 171.8, 189.3],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)', 
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    '#22c55e',
                    '#fbbf24',
                    '#ef4444'
                ],
                borderWidth: 2
            }]
        },
        options: {
            ...CHART_CONFIG,
            plugins: {
                ...CHART_CONFIG.plugins,
                legend: {
                    display: false
                }
            }
        }
    });
}

// Update chart data dynamically
function updateChartData(chartInstance, newData) {
    if (!chartInstance) return;
    
    chartInstance.data.datasets[0].data = newData;
    chartInstance.update('active');
}

// Simulate real-time data updates
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Update performance chart with random data
        if (performanceChart) {
            const speedData = performanceChart.data.datasets[0].data;
            const fuelData = performanceChart.data.datasets[1].data;
            
            // Add some random variation
            for (let i = 0; i < speedData.length; i++) {
                speedData[i] += (Math.random() - 0.5) * 0.2;
                fuelData[i] += (Math.random() - 0.5) * 0.1;
            }
            
            performanceChart.update('none');
        }
        
        // Update weather trend chart
        if (weatherTrendChart) {
            const waveData = weatherTrendChart.data.datasets[0].data;
            const windData = weatherTrendChart.data.datasets[1].data;
            
            for (let i = 0; i < waveData.length; i++) {
                waveData[i] += (Math.random() - 0.5) * 0.3;
                windData[i] += (Math.random() - 0.5) * 2;
                
                // Keep values within reasonable bounds
                waveData[i] = Math.max(0.5, Math.min(5, waveData[i]));
                windData[i] = Math.max(5, Math.min(40, windData[i]));
            }
            
            weatherTrendChart.update('none');
        }
    }, 5000); // Update every 5 seconds
}

// Destroy all charts (cleanup function)
function destroyCharts() {
    [weatherChart, performanceChart, weatherTrendChart, fuelChart].forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
}

// Export chart functions for global access
window.initCharts = initCharts;
window.initWeatherChart = initWeatherChart;
window.initPerformanceChart = initPerformanceChart;
window.initWeatherTrendChart = initWeatherTrendChart;
window.initFuelChart = initFuelChart;
window.updateChartData = updateChartData;
window.simulateRealTimeUpdates = simulateRealTimeUpdates;
window.destroyCharts = destroyCharts;
