import React from 'react';
import { Gauge, Clock, Fuel } from 'lucide-react';

const SpeedOverlay = ({ speedProfile, className = '' }) => {
    if (!speedProfile || speedProfile.length === 0) {
        return null;
    }

    return (
        <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Gauge className="h-4 w-4 mr-2 text-blue-600" />
                Speed Profile
            </h4>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
                {speedProfile.map((segment) => (
                    <div 
                        key={segment.segment_id} 
                        className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Segment {segment.segment_id}
                            </span>
                            <span className="text-lg font-bold text-blue-600">
                                {segment.speed_kn.toFixed(1)} kn
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span className="truncate">
                                    {new Date(segment.eta_iso).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Fuel className="h-3 w-3 mr-1" />
                                <span>{segment.fuel_t.toFixed(3)} tons</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Summary */}
            <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-600">
                    <div className="flex justify-between">
                        <span>Total Segments:</span>
                        <span className="font-medium">{speedProfile.length}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span>Total Fuel:</span>
                        <span className="font-medium">
                            {speedProfile.reduce((sum, s) => sum + s.fuel_t, 0).toFixed(3)} tons
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpeedOverlay;