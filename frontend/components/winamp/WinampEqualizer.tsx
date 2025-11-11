'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface WinampEqualizerProps {
  compact?: boolean;
}

const EQ_BANDS = [
  { label: '60', frequency: 60 },
  { label: '170', frequency: 170 },
  { label: '310', frequency: 310 },
  { label: '600', frequency: 600 },
  { label: '1K', frequency: 1000 },
  { label: '3K', frequency: 3000 },
  { label: '6K', frequency: 6000 },
  { label: '12K', frequency: 12000 },
  { label: '14K', frequency: 14000 },
  { label: '16K', frequency: 16000 }
];

const PRESETS = [
  { name: 'Flat', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Rock', values: [8, 4, -5, -8, -3, 4, 8, 11, 11, 11] },
  { name: 'Pop', values: [-1, 4, 7, 8, 5, 0, -2, -2, -1, -1] },
  { name: 'Classical', values: [0, 0, 0, 0, 0, 0, -7, -7, -7, -9] },
  { name: 'Jazz', values: [0, 0, 0, 2, 4, 4, 0, 1, 1, 1] },
  { name: 'Dance', values: [9, 7, 2, 0, 0, -5, -7, -7, 0, 0] },
  { name: 'Electronic', values: [4, 4, 0, 0, -3, 2, 0, 1, 4, 5] }
];

export default function WinampEqualizer({ compact = false }: WinampEqualizerProps) {
  const [enabled, setEnabled] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('Flat');
  const [eqValues, setEqValues] = useState(PRESETS[0].values);

  const handlePresetChange = (presetName: string) => {
    const preset = PRESETS.find(p => p.name === presetName);
    if (preset) {
      setSelectedPreset(presetName);
      setEqValues(preset.values);
    }
  };

  const handleSliderChange = (index: number, value: number) => {
    const newValues = [...eqValues];
    newValues[index] = value;
    setEqValues(newValues);
    setSelectedPreset('Custom');
  };

  const getSliderHeight = (value: number) => {
    return ((value + 12) / 24) * 100; // Convert from -12 to +12 range to 0-100%
  };

  return (
    <div className={`bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg ${compact ? 'p-3' : 'p-6'} h-full`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className={`font-bold text-green-400 ${compact ? 'text-sm' : 'text-lg'}`}>
            Equalizer
          </h3>
          <motion.button
            onClick={() => setEnabled(!enabled)}
            className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
              enabled
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {enabled ? 'ON' : 'OFF'}
          </motion.button>
        </div>
      </div>

      {/* Presets */}
      {!compact && (
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-400 mb-2">Presets</label>
          <select
            value={selectedPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
          >
            {PRESETS.map(preset => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* EQ Sliders */}
      <div className="flex items-end justify-between space-x-1 mb-4 h-48">
        {EQ_BANDS.map((band, index) => (
          <div key={band.frequency} className="flex flex-col items-center space-y-2">
            {/* Frequency Label */}
            <span className={`text-gray-400 font-medium ${compact ? 'text-xs' : 'text-xs'}`}>
              {band.label}
            </span>

            {/* Slider Track */}
            <div className="relative w-6 h-32 bg-gray-700 rounded-full">
              {/* Background Gradient */}
              <div 
                className="absolute inset-0 rounded-full bg-gradient-to-t from-red-500 via-yellow-500 to-green-500 opacity-30"
              />
              
              {/* Active Track */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 rounded-full bg-gradient-to-t from-green-400 to-green-500"
                style={{
                  height: enabled ? `${getSliderHeight(eqValues[index])}%` : '50%',
                  opacity: enabled ? 1 : 0.3
                }}
                animate={{
                  height: enabled ? `${getSliderHeight(eqValues[index])}%` : '50%'
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Slider Handle */}
              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={eqValues[index]}
                onChange={(e) => handleSliderChange(index, parseFloat(e.target.value))}
                disabled={!enabled}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{
                  background: 'transparent',
                  outline: 'none',
                  transform: 'rotate(90deg)',
                  transformOrigin: 'center'
                }}
              />

              {/* Handle Indicator */}
              <motion.div
                className={`absolute w-6 h-3 rounded-full border-2 ${
                  enabled 
                    ? 'bg-white border-green-400 shadow-lg' 
                    : 'bg-gray-500 border-gray-600'
                }`}
                style={{
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bottom: enabled ? `calc(${getSliderHeight(eqValues[index])}% - 6px)` : 'calc(50% - 6px)'
                }}
                animate={{
                  bottom: enabled ? `calc(${getSliderHeight(eqValues[index])}% - 6px)` : 'calc(50% - 6px)'
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Center Line */}
              <div className="absolute left-0 right-0 h-px bg-gray-600 top-1/2 transform -translate-y-px" />
            </div>

            {/* dB Value */}
            <span className={`text-gray-500 font-mono ${compact ? 'text-xs' : 'text-xs'}`}>
              {eqValues[index] > 0 ? '+' : ''}{eqValues[index].toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      {/* Additional Controls */}
      {!compact && (
        <div className="space-y-3">
          {/* Bass Boost */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Bass Boost</span>
            <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-xs rounded transition-colors">
              Auto
            </button>
          </div>

          {/* Surround */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">3D Surround</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => handlePresetChange('Flat')}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-sm text-white rounded transition-colors"
          >
            Reset to Flat
          </button>
        </div>
      )}
    </div>
  );
}