/**
 * WEATHER ENGINE MARITIME - MAP FUNCTIONALITY
 * All map-related functions including initialization, layers, and routing
 */

// Map initialization
function initMap() {
    try {
        // Show loader initially
        const loader = document.getElementById('mapLoader');
        const fallback = document.getElementById('mapFallback');
        
        if (loader) loader.style.display = 'flex';
        if (fallback) fallback.style.display = 'none';

        map = L.map('map', {
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true,
            dragging: true,
            tap: true,
            touchZoom: true,
            preferCanvas: true
        }).setView([15.0, 74.0], 6);
        
        // Multiple tile layer options with fallbacks
        const OPENWEATHER_API_KEY = "3662ed76c1566a5fef2ac5a9d71c820a";
        const tileLayers = {
            satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri',
                maxZoom: 19,
                errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjMGY0Yzc1Ii8+CjwvSXZnPgo='
            }),
            ocean: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap © CartoDB',
                subdomains: 'abcd',
                maxZoom: 19,
                errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjMGY0Yzc1Ii8+CjwvSXZnPgo='
            }),
            openstreet: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
                maxZoom: 19,
                errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjMGY0Yzc1Ii8+CjwvSXZnPgo='
            })
        };

        // Try satellite first, fallback to ocean theme
        let currentLayer = tileLayers.satellite;
        currentLayer.addTo(map);
        
        // Handle tile loading errors
        currentLayer.on('tileerror', function() {
            console.warn('Satellite tiles failed, switching to ocean theme...');
            map.removeLayer(currentLayer);
            currentLayer = tileLayers.ocean;
            currentLayer.addTo(map);
            
            currentLayer.on('tileerror', function() {
                console.warn('Ocean tiles failed, switching to OpenStreetMap...');
                map.removeLayer(currentLayer);
                currentLayer = tileLayers.openstreet;
                currentLayer.addTo(map);
                
                currentLayer.on('tileerror', function() {
                    console.error('All tile sources failed, showing fallback...');
                    showMapFallback();
                });
            });
        });

        // Map ready event
        map.whenReady(function() {
            console.log('Map successfully initialized');
            setTimeout(() => {
                if (loader) loader.style.display = 'none';
                updateRouteDisplay();
                drawRoute();
            }, 1000);
        });

        // Map event listeners
        map.on('zoomend', () => {
            const zoomElement = document.getElementById('mapZoom');
            if (zoomElement) zoomElement.textContent = map.getZoom();
        });
        
        map.on('moveend', () => {
            console.log('Map moved to:', map.getCenter());
        });

        // Load timeout fallback
        setTimeout(() => {
            if (loader && loader.style.display !== 'none') {
                console.warn('Map loading timeout, showing fallback');
                showMapFallback();
            }
        }, 5000);
        
    } catch (error) {
        console.error('Map initialization failed:', error);
        showMapFallback();
    }
}

// Show fallback map visualization
function showMapFallback() {
    const loader = document.getElementById('mapLoader');
    const fallback = document.getElementById('mapFallback');
    
    if (loader) loader.style.display = 'none';
    if (fallback) {
        fallback.style.display = 'block';
        fallback.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gradient-to-br from-ocean-800 to-ocean-900 rounded-xl">
                <div class="text-center">
                    <div class="text-6xl mb-4">🗺️</div>
                    <div class="text-xl font-semibold mb-2">Interactive Map</div>
                    <div class="text-ocean-300">Map temporarily unavailable</div>
                    <button onclick="initMap()" class="mt-4 px-4 py-2 bg-ocean-600 hover:bg-ocean-500 rounded-lg transition-colors">
                        Retry Loading
                    </button>
                </div>
            </div>
        `;
    }
}

// Route drawing functionality
function drawRoute() {
    if (!map) return;
    
    try {
        // Clear existing route
        map.eachLayer(layer => {
            if (layer.options && layer.options.className === 'route-line') {
                map.removeLayer(layer);
            }
        });

        // Sample route coordinates (Mumbai to Kochi)
        const routeCoords = [
            [19.0760, 72.8777], // Mumbai
            [17.6868, 83.2185], // Waypoint 1 (Visakhapatnam area)
            [13.0827, 80.2707], // Waypoint 2 (Chennai area)
            [9.9312, 76.2673]   // Kochi
        ];

        // Draw route line
        const routeLine = L.polyline(routeCoords, {
            color: '#00ff88',
            weight: 4,
            opacity: 0.8,
            className: 'route-line'
        }).addTo(map);

        // Add route markers
        addRouteMarkers(routeCoords);
        
        // Fit map to route bounds
        map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });
        
    } catch (error) {
        console.error('Error drawing route:', error);
    }
}

// Add markers for route points
function addRouteMarkers(coords) {
    if (!map) return;
    
    const markerInfo = [
        { name: 'Mumbai Port', type: 'origin' },
        { name: 'Waypoint 1', type: 'waypoint' },
        { name: 'Waypoint 2', type: 'waypoint' },
        { name: 'Kochi Port', type: 'destination' }
    ];

    coords.forEach((coord, index) => {
        const info = markerInfo[index];
        const markerColor = info.type === 'origin' ? '#22c55e' : 
                           info.type === 'destination' ? '#ef4444' : '#06b6d4';
        
        const marker = L.circleMarker(coord, {
            radius: 8,
            fillColor: markerColor,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
            className: 'custom-marker'
        }).addTo(map);

        marker.bindPopup(`
            <div class="text-center">
                <div class="font-semibold">${info.name}</div>
                <div class="text-sm text-gray-600">${coord[0].toFixed(4)}, ${coord[1].toFixed(4)}</div>
            </div>
        `);
    });
}

// Update route display information
function updateRouteDisplay() {
    const routeElements = {
        origin: document.getElementById('routeOrigin'),
        destination: document.getElementById('routeDestination'),
        distance: document.getElementById('routeDistance'),
        duration: document.getElementById('routeDuration'),
        fuel: document.getElementById('routeFuel')
    };

    if (routeElements.origin) routeElements.origin.textContent = 'Mumbai Port (INMUN)';
    if (routeElements.destination) routeElements.destination.textContent = 'Kochi Port (INCOK)';
    if (routeElements.distance) routeElements.distance.textContent = '842 nm';
    if (routeElements.duration) routeElements.duration.textContent = '3.2 days';
    if (routeElements.fuel) routeElements.fuel.textContent = '156.3 MT';
}

// Map layer controls functionality
function toggleMapLayer(layerType) {
    console.log('Toggling layer:', layerType);
    const button = document.getElementById(layerType);
    if (!button) {
        console.error('Button not found for layer:', layerType);
        return;
    }
    
    const isActive = button.classList.contains('border-cyan-500');
    console.log('Layer', layerType, 'is currently', isActive ? 'ACTIVE' : 'INACTIVE');
    
    if (isActive) {
        // Deactivate layer
        button.classList.remove('border-cyan-500', 'bg-cyan-500/20');
        button.classList.add('border-gray-500/50');
        activeMapLayers = activeMapLayers.filter(l => l !== layerType);
        
        // Remove layer-specific visual effects
        removeLayerEffects(layerType);
        
    } else {
        // Activate layer
        button.classList.remove('border-gray-500/50');
        button.classList.add('border-cyan-500', 'bg-cyan-500/20');
        activeMapLayers.push(layerType);
        
        // Add layer-specific visual effects
        addLayerEffects(layerType);
    }
    
    // Update active layers counter
    const activeLayersElement = document.getElementById('activeLayers');
    if (activeLayersElement) {
        activeLayersElement.textContent = activeMapLayers.length;
    }
    
    // Log layer status
    console.log(`${layerType} layer:`, isActive ? 'DEACTIVATED' : 'ACTIVATED');
    console.log('Active layers:', activeMapLayers);
}

// Export map functions for global access
window.initMap = initMap;
window.showMapFallback = showMapFallback;
window.drawRoute = drawRoute;
window.updateRouteDisplay = updateRouteDisplay;
window.toggleMapLayer = toggleMapLayer;
