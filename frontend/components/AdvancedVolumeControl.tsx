'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SpeakerHigh, 
  SpeakerX, 
  SpeakerLow, 
  SpeakerSimpleHigh,
  Equalizer 
} from '@phosphor-icons/react';

interface AdvancedVolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
}

export default function AdvancedVolumeControl({
  volume,
  onVolumeChange,
  isMuted = false,
  onMuteToggle
}: AdvancedVolumeControlProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return SpeakerX;
    if (volume < 30) return SpeakerLow;
    if (volume < 70) return SpeakerHigh;
    return SpeakerSimpleHigh;
  };

  const VolumeIcon = getVolumeIcon();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateVolume(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateVolume(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateVolume = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newVolume = Math.max(0, Math.min(100, (x / width) * 100));
    
    onVolumeChange(Math.round(newVolume));
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Audio visualization bars
  const AudioBars = () => (
    <div className="flex items-end space-x-1 h-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-neon-teal to-neon-blue rounded-full"
          animate={{
            height: volume > 0 && !isMuted
              ? [Math.random() * 16 + 8, Math.random() * 24 + 8, Math.random() * 16 + 8]
              : 4
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="flex items-center space-x-4">
      {/* Volume Icon with Mute Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onMuteToggle}
        className={`p-2 rounded-lg transition-colors ${
          isMuted 
            ? 'text-red-400 hover:bg-red-500/20' 
            : 'text-gray-400 hover:text-neon-teal hover:bg-neon-teal/10'
        }`}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        <VolumeIcon size={20} weight="duotone" />
      </motion.button>

      {/* Volume Slider */}
      <div className="flex items-center space-x-3">
        <div
          ref={sliderRef}
          className="relative w-24 h-2 bg-dark-300 rounded-full cursor-pointer group"
          onMouseDown={handleMouseDown}
        >
          {/* Track */}
          <div className="absolute inset-0 bg-dark-300 rounded-full" />
          
          {/* Progress */}
          <motion.div
            animate={{ 
              width: `${isMuted ? 0 : volume}%`,
              opacity: isMuted ? 0.3 : 1
            }}
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-neon-teal to-neon-blue rounded-full"
          />
          
          {/* Handle */}
          <motion.div
            animate={{ 
              left: `${isMuted ? 0 : volume}%`,
              scale: isDragging ? 1.3 : 1
            }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border-2 border-neon-teal"
          />
          
          {/* Hover Effect */}
          <motion.div
            animate={{ 
              width: `${isMuted ? 0 : volume}%`,
              opacity: isDragging ? 0.3 : 0
            }}
            className="absolute left-0 top-0 h-full bg-neon-teal/20 rounded-full"
          />
        </div>

        {/* Volume Percentage */}
        <span className="text-xs text-gray-400 w-8 text-right">
          {isMuted ? '0' : volume}%
        </span>
      </div>

      {/* Equalizer Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowEqualizer(!showEqualizer)}
        className={`p-2 rounded-lg transition-colors ${
          showEqualizer 
            ? 'text-neon-purple bg-neon-purple/20' 
            : 'text-gray-400 hover:text-neon-purple hover:bg-neon-purple/10'
        }`}
        title="Audio Visualizer"
      >
        <Equalizer size={18} weight="duotone" />
      </motion.button>

      {/* Audio Visualization */}
      {showEqualizer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="ml-2"
        >
          <AudioBars />
        </motion.div>
      )}
    </div>
  );
}