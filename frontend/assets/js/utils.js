/**
 * WEATHER ENGINE MARITIME - UTILITY FUNCTIONS
 * Common utility functions used across the application
 */

// Live time display
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        timeZone: 'UTC' 
    }) + ' UTC';
    
    const liveTimeElement = document.getElementById('liveTime');
    const timelineTimeElement = document.getElementById('timelineTime');
    
    if (liveTimeElement) liveTimeElement.textContent = timeString;
    if (timelineTimeElement) timelineTimeElement.textContent = timeString;
}

// Initialize time updates
function initTimeUpdates() {
    setInterval(updateTime, 1000);
    updateTime();
}

// Animate metrics with smooth counting
function animateMetrics() {
    const metrics = [
        { id: 'fuelSavings', target: 15.2, suffix: '%', duration: 2000 },
        { id: 'routeEfficiency', target: 94.7, suffix: '%', duration: 2500 },
        { id: 'weatherAccuracy', target: 98.3, suffix: '%', duration: 3000 },
        { id: 'co2Reduction', target: 23.8, suffix: '%', duration: 2200 }
    ];

    metrics.forEach(metric => {
        const element = document.getElementById(metric.id);
        if (!element) return;

        let current = 0;
        const increment = metric.target / (metric.duration / 16);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= metric.target) {
                current = metric.target;
                clearInterval(timer);
            }
            element.textContent = current.toFixed(1) + metric.suffix;
        }, 16);
    });
}

// Show notification messages
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-6 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-600' : 
        type === 'warning' ? 'bg-yellow-600' : 
        type === 'error' ? 'bg-red-600' : 'bg-blue-600'
    } text-white max-w-sm`;
    
    notification.innerHTML = `
        <div class="flex items-start">
            <div class="mr-3 text-lg">
                ${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}
            </div>
            <div>
                <div class="text-sm">${message}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    
    // Slide out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Convert speed units
function convertSpeed(speed, fromUnit, toUnit) {
    const conversions = {
        'knots': { 'mph': 1.15078, 'kmh': 1.852 },
        'mph': { 'knots': 0.868976, 'kmh': 1.60934 },
        'kmh': { 'knots': 0.539957, 'mph': 0.621371 }
    };
    
    if (fromUnit === toUnit) return speed;
    return speed * conversions[fromUnit][toUnit];
}

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Local storage helpers
const Storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Could not read from localStorage:', e);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Could not remove from localStorage:', e);
        }
    }
};
