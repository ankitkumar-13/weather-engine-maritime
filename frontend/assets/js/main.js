/**
 * WEATHER ENGINE MARITIME - MAIN INITIALIZATION
 * Main application initialization and event handlers
 */

// Main application initialization
function initApp() {
    console.log('Initializing Weather Engine Maritime...');
    
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init(ANIMATION_CONFIG);
    }
    
    // Initialize time updates
    initTimeUpdates();
    
    // Initialize metrics animation
    setTimeout(animateMetrics, 500);
    
    // Initialize map
    setTimeout(initMap, 1000);
    
    // Initialize charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
        setTimeout(initCharts, 1500);
        setTimeout(simulateRealTimeUpdates, 3000);
    }
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('Weather Engine Maritime initialized successfully');
}

// Setup all event listeners
function setupEventListeners() {
    // Layer toggle listeners
    ['weatherLayer', 'windLayer', 'waveLayer', 'trafficLayer', 'safetyLayer'].forEach(layerId => {
        const button = document.getElementById(layerId);
        if (button) {
            button.addEventListener('click', () => toggleMapLayer(layerId));
        }
    });

    // Alert type filter listeners
    ['weatherAlerts', 'navigationAlerts', 'securityAlerts', 'mechanicalAlerts'].forEach(alertType => {
        const button = document.getElementById(alertType);
        if (button) {
            button.addEventListener('click', () => toggleAlertFilter(alertType));
        }
    });

    // Route selection listeners
    const originSelect = document.getElementById('routeOriginSelect');
    const destinationSelect = document.getElementById('routeDestinationSelect');
    
    if (originSelect) {
        originSelect.addEventListener('change', updateRouteSelection);
    }
    
    if (destinationSelect) {
        destinationSelect.addEventListener('change', updateRouteSelection);
    }

    // Time slider listener
    const timeSlider = document.getElementById('timeSlider');
    if (timeSlider) {
        timeSlider.addEventListener('input', updateTimeDisplay);
    }

    // Speed control listener
    const speedSlider = document.getElementById('speedSlider');
    if (speedSlider) {
        speedSlider.addEventListener('input', updateSpeedDisplay);
    }

    // Navigation button listeners
    const demoButton = document.getElementById('demoButton');
    if (demoButton) {
        demoButton.addEventListener('click', () => {
            window.location.href = 'demo.html';
        });
    }

    // Responsive menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu && !mobileMenu.contains(e.target) && !menuToggle?.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Alt + M = Toggle Map layers
    if (e.altKey && e.key === 'm') {
        e.preventDefault();
        const firstLayer = document.getElementById('weatherLayer');
        if (firstLayer) firstLayer.click();
    }
    
    // Alt + R = Reset view
    if (e.altKey && e.key === 'r') {
        e.preventDefault();
        if (map) {
            map.setView([15.0, 74.0], 6);
        }
    }
    
    // Escape = Close modals/menus
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }
}

// Update route selection
function updateRouteSelection() {
    const origin = document.getElementById('routeOriginSelect')?.value;
    const destination = document.getElementById('routeDestinationSelect')?.value;
    
    if (origin && destination && origin !== destination) {
        console.log(`Route selected: ${origin} to ${destination}`);
        updateRouteDisplay();
        if (map) {
            drawRoute();
        }
        showNotification(`Route updated: ${origin} to ${destination}`, 'success');
    }
}

// Update time display from slider
function updateTimeDisplay(e) {
    const value = e.target.value;
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    const timeDisplay = document.getElementById('currentTime');
    if (timeDisplay) {
        timeDisplay.textContent = timeString;
    }
}

// Update speed display from slider
function updateSpeedDisplay(e) {
    const speed = parseFloat(e.target.value);
    const speedDisplay = document.getElementById('currentSpeed');
    
    if (speedDisplay) {
        speedDisplay.textContent = `${speed.toFixed(1)} kts`;
    }
    
    // Update ETA based on speed change
    updateETA(speed);
}

// Update ETA calculation
function updateETA(speed) {
    const distance = 842; // nautical miles (Mumbai to Kochi)
    const hours = distance / speed;
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    
    const etaDisplay = document.getElementById('routeDuration');
    if (etaDisplay) {
        etaDisplay.textContent = `${days}.${remainingHours} days`;
    }
}

// Toggle alert filter
function toggleAlertFilter(alertType) {
    const button = document.getElementById(alertType);
    if (!button) return;
    
    const isActive = button.classList.contains('bg-red-600');
    
    if (isActive) {
        button.classList.remove('bg-red-600');
        button.classList.add('bg-gray-600');
    } else {
        button.classList.remove('bg-gray-600');
        button.classList.add('bg-red-600');
    }
    
    console.log(`Alert filter ${alertType} ${isActive ? 'disabled' : 'enabled'}`);
}

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        console.log(`Page load time: ${loadTime}ms`);
        
        // Log any performance issues
        if (loadTime > 3000) {
            console.warn('Slow page load detected');
        }
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    monitorPerformance();
});

// Export main functions for global access
window.initApp = initApp;
window.setupEventListeners = setupEventListeners;
window.updateRouteSelection = updateRouteSelection;
window.toggleAlertFilter = toggleAlertFilter;
