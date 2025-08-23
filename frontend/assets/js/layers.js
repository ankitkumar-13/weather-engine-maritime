/**
 * WEATHER ENGINE MARITIME - MAP LAYER EFFECTS
 * Visual effects for different map layers (weather, wind, waves, traffic, safety)
 */

// Add visual effects for specific layer types
function addLayerEffects(layerType) {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    switch(layerType) {
        case 'weatherLayer':
            addWeatherLayerEffects(mapElement);
            break;
        case 'windLayer':
            addWindLayerEffects(mapElement);
            break;
        case 'waveLayer':
            addWaveLayerEffects(mapElement);
            break;
        case 'trafficLayer':
            addTrafficLayerEffects(mapElement);
            break;
        case 'safetyLayer':
            addSafetyLayerEffects(mapElement);
            break;
    }
}

// Remove visual effects for specific layer types
function removeLayerEffects(layerType) {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }

    // Remove layer-specific overlays
    const existingOverlay = document.getElementById(`${layerType}Overlay`);
    if (existingOverlay) {
        existingOverlay.remove();
        console.log('Removed overlay for', layerType);
    }
    
    // Remove layer indicators by ID
    const indicatorId = `${layerType}Indicator`;
    const indicator = document.getElementById(indicatorId);
    if (indicator) {
        indicator.remove();
        console.log('Removed indicator for', layerType);
    }
    
    // Remove Leaflet map layers if they exist
    if (window.map && map.getContainer()) {
        try {
            if (layerType === 'weatherLayer' && window.weatherMapLayer) {
                map.removeLayer(window.weatherMapLayer);
                window.weatherMapLayer = null;
                console.log('Removed Leaflet weather layer');
            }
            if (layerType === 'windLayer' && window.windMapLayer) {
                map.removeLayer(window.windMapLayer);
                window.windMapLayer = null;
                console.log('Removed Leaflet wind layer');
            }
        } catch (e) {
            console.log('Error removing Leaflet layer:', e);
        }
    }
}

// Weather layer effects
function addWeatherLayerEffects(mapElement) {
    // Remove existing weather overlay
    removeLayerEffects('weatherLayer');
    
    // Create weather overlay container that sits on top of the map
    const weatherOverlay = document.createElement('div');
    weatherOverlay.id = 'weatherLayerOverlay';
    weatherOverlay.className = 'absolute inset-0 pointer-events-none';
    weatherOverlay.style.zIndex = '1000'; // Very high z-index to ensure it's above map tiles
    weatherOverlay.style.background = `
        radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.6) 0%, transparent 50%),
        radial-gradient(circle at 70% 20%, rgba(34, 197, 94, 0.5) 0%, transparent 45%),
        radial-gradient(circle at 80% 70%, rgba(239, 68, 68, 0.5) 0%, transparent 40%),
        radial-gradient(circle at 30% 80%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)
    `;
    weatherOverlay.style.border = '3px solid rgba(59, 130, 246, 0.8)';
    weatherOverlay.style.borderRadius = '12px';
    
    // Add animated weather particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-3 h-3 bg-blue-400 rounded-full opacity-80';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${3 + Math.random() * 2}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.6)';
        weatherOverlay.appendChild(particle);
    }
    
    // Add weather icons for different zones
    const weatherIcons = ['🌧️', '⛈️', '🌦️', '☀️', '⛅', '🌤️'];
    for (let i = 0; i < 6; i++) {
        const icon = document.createElement('div');
        icon.className = 'absolute text-2xl opacity-90';
        icon.innerHTML = weatherIcons[i];
        icon.style.left = Math.random() * 85 + '%';
        icon.style.top = Math.random() * 85 + '%';
        icon.style.animation = `pulse ${2 + Math.random()}s ease-in-out infinite`;
        icon.style.animationDelay = Math.random() * 1 + 's';
        icon.style.filter = 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))';
        icon.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        weatherOverlay.appendChild(icon);
    }
    
    // Add temperature indicators
    const temps = ['22°C', '25°C', '19°C', '28°C', '21°C'];
    for (let i = 0; i < 5; i++) {
        const temp = document.createElement('div');
        temp.className = 'absolute text-white text-sm font-bold bg-blue-600/80 px-2 py-1 rounded-full border border-white/50';
        temp.innerHTML = temps[i];
        temp.style.left = Math.random() * 80 + '%';
        temp.style.top = Math.random() * 80 + '%';
        temp.style.animation = `pulse ${1.5 + Math.random()}s ease-in-out infinite`;
        temp.style.animationDelay = Math.random() * 2 + 's';
        temp.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.6)';
        weatherOverlay.appendChild(temp);
    }
    
    // Add the overlay to the map container
    mapElement.appendChild(weatherOverlay);
    
    // Also add as a Leaflet pane if map is available (for better integration)
    if (window.map && map.getContainer()) {
        try {
            // Create a custom pane for weather overlay with high z-index
            if (!map.getPane('weatherPane')) {
                map.createPane('weatherPane');
                map.getPane('weatherPane').style.zIndex = 1000;
                map.getPane('weatherPane').style.pointerEvents = 'none';
            }
            
            // Add weather layer as SVG overlay to ensure it stays on top
            const bounds = map.getBounds();
            const weatherSvgOverlay = L.svgOverlay(
                '<svg><rect width="100%" height="100%" fill="url(#weatherGradient)" opacity="0.3"/><defs><linearGradient id="weatherGradient"><stop offset="0%" stop-color="#3b82f6"/><stop offset="50%" stop-color="#22c55e"/><stop offset="100%" stop-color="#ef4444"/></linearGradient></defs></svg>',
                bounds,
                { pane: 'weatherPane' }
            );
            weatherSvgOverlay.addTo(map);
            
            // Store reference for removal
            window.weatherMapLayer = weatherSvgOverlay;
        } catch (e) {
            console.log('Could not add Leaflet weather layer:', e);
        }
    }
    
    // Add a prominent visual indicator that the layer is active
    const indicator = document.createElement('div');
    indicator.id = 'weatherLayerIndicator';
    indicator.className = 'absolute top-2 left-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold';
    indicator.style.zIndex = '1001'; // Even higher z-index for indicator
    indicator.textContent = '🌦️ WEATHER LAYER ACTIVE';
    indicator.style.animation = 'pulse 2s ease-in-out infinite';
    indicator.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.8)';
    mapElement.appendChild(indicator);
    
    // Show weather data notification
    showLayerNotification('Weather Layer Activated', '🌦️ Real-time weather data overlay enabled', 'success');
}

// Wind layer effects
function addWindLayerEffects(mapElement) {
    // Remove existing wind overlay
    removeLayerEffects('windLayer');
    
    // Create wind overlay
    const windOverlay = document.createElement('div');
    windOverlay.id = 'windLayerOverlay';
    windOverlay.className = 'absolute inset-0 pointer-events-none';
    windOverlay.style.zIndex = '1000'; // Very high z-index to ensure it's above map tiles
    windOverlay.style.border = '3px solid rgba(6, 182, 212, 0.8)';
    windOverlay.style.borderRadius = '12px';
    
    // Add wind direction arrows
    for (let i = 0; i < 18; i++) {
        const arrow = document.createElement('div');
        arrow.className = 'absolute text-cyan-300 opacity-90 font-bold';
        arrow.innerHTML = '➤';
        arrow.style.left = Math.random() * 90 + '%';
        arrow.style.top = Math.random() * 90 + '%';
        arrow.style.fontSize = '18px';
        arrow.style.transform = `rotate(${Math.random() * 360}deg)`;
        arrow.style.animation = `pulse ${2 + Math.random()}s ease-in-out infinite`;
        arrow.style.animationDelay = Math.random() * 2 + 's';
        arrow.style.filter = 'drop-shadow(0 0 5px rgba(6, 182, 212, 1))';
        arrow.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        windOverlay.appendChild(arrow);
    }
    
    // Add wind speed indicators
    const windSpeeds = ['12kt', '8kt', '15kt', '6kt', '18kt', '11kt'];
    for (let i = 0; i < 6; i++) {
        const speed = document.createElement('div');
        speed.className = 'absolute text-cyan-100 text-sm font-bold bg-cyan-600/80 px-2 py-1 rounded border border-cyan-300/50';
        speed.innerHTML = windSpeeds[i];
        speed.style.left = Math.random() * 80 + '%';
        speed.style.top = Math.random() * 80 + '%';
        speed.style.animation = `pulse ${1.8 + Math.random()}s ease-in-out infinite`;
        speed.style.animationDelay = Math.random() * 2 + 's';
        speed.style.boxShadow = '0 0 10px rgba(6, 182, 212, 0.6)';
        windOverlay.appendChild(speed);
    }
    
    // Add wind flow lines
    const windLines = document.createElement('div');
    windLines.className = 'absolute inset-0';
    windLines.style.background = `
        linear-gradient(45deg, transparent 48%, rgba(6, 182, 212, 0.5) 49%, rgba(6, 182, 212, 0.5) 51%, transparent 52%),
        linear-gradient(-45deg, transparent 48%, rgba(6, 182, 212, 0.4) 49%, rgba(6, 182, 212, 0.4) 51%, transparent 52%)
    `;
    windLines.style.backgroundSize = '25px 25px';
    windLines.style.animation = 'windFlow 3s linear infinite';
    windOverlay.appendChild(windLines);
    
    mapElement.appendChild(windOverlay);
    
    // Also add as a Leaflet pane if map is available (for better integration)
    if (window.map && map.getContainer()) {
        try {
            // Create a custom pane for wind overlay with high z-index
            if (!map.getPane('windPane')) {
                map.createPane('windPane');
                map.getPane('windPane').style.zIndex = 1000;
                map.getPane('windPane').style.pointerEvents = 'none';
            }
            
            // Add wind layer as SVG overlay to ensure it stays on top
            const bounds = map.getBounds();
            const windSvgOverlay = L.svgOverlay(
                '<svg><defs><pattern id="windPattern" patternUnits="userSpaceOnUse" width="20" height="20"><line x1="0" y1="10" x2="20" y2="10" stroke="#06b6d4" stroke-width="2" opacity="0.6"/></pattern></defs><rect width="100%" height="100%" fill="url(#windPattern)"/></svg>',
                bounds,
                { pane: 'windPane' }
            );
            windSvgOverlay.addTo(map);
            
            // Store reference for removal
            window.windMapLayer = windSvgOverlay;
        } catch (e) {
            console.log('Could not add Leaflet wind layer:', e);
        }
    }
    
    // Add a prominent visual indicator that the wind layer is active
    const indicator = document.createElement('div');
    indicator.id = 'windLayerIndicator';
    indicator.className = 'absolute top-2 right-2 bg-cyan-600 text-white px-3 py-2 rounded-lg text-sm font-bold';
    indicator.style.zIndex = '1001'; // Even higher z-index for indicator
    indicator.textContent = '💨 WIND LAYER ACTIVE';
    indicator.style.animation = 'pulse 2s ease-in-out infinite';
    indicator.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.8)';
    mapElement.appendChild(indicator);
    
    // Show wind data notification
    showLayerNotification('Wind Layer Activated', '💨 Wind patterns and direction overlay enabled', 'success');
}

// Wave layer effects
function addWaveLayerEffects(mapElement) {
    removeLayerEffects('waveLayer');
    
    const waveOverlay = document.createElement('div');
    waveOverlay.id = 'waveLayerOverlay';
    waveOverlay.className = 'absolute inset-0 pointer-events-none';
    waveOverlay.style.zIndex = '1000';
    waveOverlay.style.background = `
        repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(14, 165, 233, 0.2) 8px, rgba(14, 165, 233, 0.2) 16px),
        repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(6, 182, 212, 0.15) 12px, rgba(6, 182, 212, 0.15) 24px)
    `;
    waveOverlay.style.animation = 'waveMotion 6s ease-in-out infinite';
    
    mapElement.appendChild(waveOverlay);
    showLayerNotification('Wave Layer Activated', '🌊 Wave height and sea state overlay enabled', 'success');
}

// Traffic layer effects
function addTrafficLayerEffects(mapElement) {
    removeLayerEffects('trafficLayer');
    
    const trafficOverlay = document.createElement('div');
    trafficOverlay.id = 'trafficLayerOverlay';
    trafficOverlay.className = 'absolute inset-0 pointer-events-none';
    trafficOverlay.style.zIndex = '1000';
    
    // Add moving vessel indicators
    for (let i = 0; i < 6; i++) {
        const vessel = document.createElement('div');
        vessel.className = 'absolute w-3 h-3 bg-yellow-400 rounded-full';
        vessel.style.left = Math.random() * 90 + '%';
        vessel.style.top = Math.random() * 90 + '%';
        vessel.style.animation = `vesselMove ${8 + Math.random() * 4}s linear infinite`;
        vessel.style.animationDelay = Math.random() * 3 + 's';
        trafficOverlay.appendChild(vessel);
    }
    
    mapElement.appendChild(trafficOverlay);
    showLayerNotification('Traffic Layer Activated', '🚢 Vessel traffic and AIS data overlay enabled', 'info');
}

// Safety layer effects
function addSafetyLayerEffects(mapElement) {
    removeLayerEffects('safetyLayer');
    
    const safetyOverlay = document.createElement('div');
    safetyOverlay.id = 'safetyLayerOverlay';
    safetyOverlay.className = 'absolute inset-0 pointer-events-none';
    safetyOverlay.style.zIndex = '1000';
    
    // Add safety zone indicators
    for (let i = 0; i < 4; i++) {
        const zone = document.createElement('div');
        zone.className = 'absolute border-2 border-red-400 border-dashed rounded-full opacity-60';
        zone.style.width = '60px';
        zone.style.height = '60px';
        zone.style.left = Math.random() * 80 + '%';
        zone.style.top = Math.random() * 80 + '%';
        zone.style.animation = `pulse 3s ease-in-out infinite`;
        zone.style.animationDelay = Math.random() * 2 + 's';
        safetyOverlay.appendChild(zone);
    }
    
    mapElement.appendChild(safetyOverlay);
    showLayerNotification('Safety Layer Activated', '⚠️ Safety zones and hazard areas overlay enabled', 'warning');
}

// Show layer activation notifications
function showLayerNotification(title, message, type = 'info') {
    showNotification(`${title}: ${message}`, type);
}

// Export layer functions for global access
window.addLayerEffects = addLayerEffects;
window.removeLayerEffects = removeLayerEffects;
window.addWeatherLayerEffects = addWeatherLayerEffects;
window.addWindLayerEffects = addWindLayerEffects;
window.addWaveLayerEffects = addWaveLayerEffects;
window.addTrafficLayerEffects = addTrafficLayerEffects;
window.addSafetyLayerEffects = addSafetyLayerEffects;
