import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

const TimeSlider = ({ onTimeChange, selectedTimeIndex }) => {
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        // Generate time slots for the next 10 days (240 hours)
        const slots = Array.from({ length: 241 }, (_, i) => {
            const date = new Date();
            date.setHours(date.getHours() + i);
            return {
                index: i,
                datetime: date,
                iso: date.toISOString(),
                label: i === 0 ? 'Now' : `+${i}h`,
                dayLabel: date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                }),
                timeLabel: date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: false 
                })
            };
        });
        setTimeSlots(slots);
    }, []);

    const handleChange = (event) => {
        const newIndex = parseInt(event.target.value);
        onTimeChange(newIndex);
    };

    const currentSlot = timeSlots[selectedTimeIndex] || timeSlots[0];

    return (
        <div className="space-y-4">
            {/* Current Time Display */}
            {currentSlot && (
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                            <div className="font-semibold text-blue-900">
                                {currentSlot.index === 0 ? 'Current Time' : `${currentSlot.label} from now`}
                            </div>
                            <div className="text-sm text-blue-700">
                                {currentSlot.dayLabel} at {currentSlot.timeLabel}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-blue-600 font-medium">
                            Hour {currentSlot.index} of 240
                        </div>
                        <div className="text-xs text-blue-500">
                            Day {Math.floor(currentSlot.index / 24) + 1} of 10
                        </div>
                    </div>
                </div>
            )}

            {/* Slider */}
            <div className="relative">
                <input
                    type="range"
                    min="0"
                    max="240"
                    value={selectedTimeIndex || 0}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                        background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((selectedTimeIndex || 0) / 240) * 100}%, #E5E7EB ${((selectedTimeIndex || 0) / 240) * 100}%, #E5E7EB 100%)`
                    }}
                />
                
                {/* Time markers */}
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Now</span>
                    <span>2 days</span>
                    <span>5 days</span>
                    <span>7 days</span>
                    <span>10 days</span>
                </div>
                
                {/* Day markers */}
                <div className="relative mt-1">
                    {[0, 48, 120, 168, 240].map((hour, index) => (
                        <div
                            key={index}
                            className="absolute w-px h-3 bg-gray-300"
                            style={{ left: `${(hour / 240) * 100}%` }}
                        />
                    ))}
                </div>
            </div>

            {/* Quick Jump Buttons */}
            <div className="flex flex-wrap gap-2">
                {[
                    { label: 'Now', hours: 0 },
                    { label: '6h', hours: 6 },
                    { label: '12h', hours: 12 },
                    { label: '1d', hours: 24 },
                    { label: '2d', hours: 48 },
                    { label: '5d', hours: 120 },
                    { label: '7d', hours: 168 },
                    { label: '10d', hours: 240 }
                ].map((preset) => (
                    <button
                        key={preset.hours}
                        onClick={() => onTimeChange(preset.hours)}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                            selectedTimeIndex === preset.hours
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TimeSlider;
