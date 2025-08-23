/**
 * WEATHER ENGINE MARITIME - CONFIGURATION
 * Global variables and configuration settings
 */

// Global variables
let map;
let weatherChart;
let performanceChart;
let weatherTrendChart;
let fuelChart;
let activeMapLayers = [];

// API Configuration
const API_BASE = 'http://localhost:8000';

// Port coordinates database
const PORTS = {
    mumbai: { name: 'Mumbai Port (INMUN)', coords: [19.0760, 72.8777], country: '🇮🇳', code: 'INMUN' },
    chennai: { name: 'Chennai Port (INMAA)', coords: [13.0827, 80.2707], country: '🇮🇳', code: 'INMAA' },
    visakhapatnam: { name: 'Visakhapatnam Port (INVTZ)', coords: [17.6868, 83.2185], country: '🇮🇳', code: 'INVTZ' },
    kolkata: { name: 'Kolkata Port (INCCU)', coords: [22.5726, 88.3639], country: '🇮🇳', code: 'INCCU' },
    singapore: { name: 'Singapore Port (SGSIN)', coords: [1.2966, 103.8006], country: '🇸🇬', code: 'SGSIN' },
    dubai: { name: 'Dubai Port (AEJEA)', coords: [25.2769, 55.3073], country: '🇦🇪', code: 'AEJEA' },
    hambantota: { name: 'Hambantota Port (LKHBT)', coords: [6.1240, 81.1185], country: '🇱🇰', code: 'LKHBT' },
    kochi: { name: 'Kochi Port (INCOK)', coords: [9.9312, 76.2673], country: '🇮🇳', code: 'INCOK' }
};

// Chart configuration
const CHART_CONFIG = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#ffffff',
                font: { size: 12 }
            }
        }
    },
    scales: {
        x: {
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
        },
        y: {
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
        }
    }
};

// Animation settings
const ANIMATION_CONFIG = {
    duration: 1000,
    once: true,
    offset: 100
};
