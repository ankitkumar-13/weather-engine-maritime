import React from 'react';
import { AlertTriangle, Wind, Waves } from 'lucide-react';

const AlertsPanel = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          <div className="w-12 h-12 mx-auto mb-4 text-green-500">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-medium">All Clear</p>
          <p className="text-xs text-gray-400 mt-1">No weather alerts for your route</p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getAlertIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'high_wave':
        return <Waves className="h-4 w-4" />;
      case 'cyclone/gale':
        return <Wind className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-4">
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`border rounded-lg p-3 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold">
                    {alert.type.replace('_', ' ').replace('/', '/')}
                  </p>
                  <span className="text-xs opacity-75">
                    Segment {alert.segment_id}
                  </span>
                </div>
                <p className="text-sm opacity-90 mb-2">
                  {alert.message}
                </p>
                <div className="flex items-center justify-between text-xs opacity-75">
                  <span className="font-medium">
                    {alert.severity.toUpperCase()} SEVERITY
                  </span>
                  <span>
                    {new Date(alert.time_iso).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;