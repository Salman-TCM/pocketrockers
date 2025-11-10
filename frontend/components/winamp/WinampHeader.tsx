'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlass,
  Gear,
  Minus,
  Square,
  X,
  List,
  GridFour,
  Sidebar,
  MusicNotes
} from '@phosphor-icons/react';

interface WinampHeaderProps {
  onSettingsClick: () => void;
  showSettings: boolean;
}

export default function WinampHeader({ onSettingsClick, showSettings }: WinampHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-14 border-b border-gray-700 flex items-center justify-between px-4"
      style={{
        background: 'linear-gradient(90deg, #374151 0%, #4b5563 50%, #374151 100%)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
    >
      {/* Left Side - Logo and Title */}
      <div className="flex items-center space-x-4">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center shadow-lg">
            <MusicNotes size={16} weight="fill" className="text-gray-200" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-100">Winamp Player</h1>
            <p className="text-xs text-gray-400">Modern Edition</p>
          </div>
        </motion.div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-600" />

        {/* View Controls */}
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === 'list' 
                ? 'bg-gray-600/50 text-gray-300' 
                : 'text-gray-500 hover:text-gray-200 hover:bg-gray-700/30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="List View"
          >
            <List size={14} weight={viewMode === 'list' ? 'fill' : 'regular'} />
          </motion.button>

          <motion.button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === 'grid' 
                ? 'bg-gray-600/50 text-gray-300' 
                : 'text-gray-500 hover:text-gray-200 hover:bg-gray-700/30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Grid View"
          >
            <GridFour size={14} weight={viewMode === 'grid' ? 'fill' : 'regular'} />
          </motion.button>
        </div>
      </div>

      {/* Center - Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <motion.div
            className="relative"
            initial={{ width: 200 }}
            whileFocus={{ width: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              placeholder="Search music..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 pl-10 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-500 focus:bg-gray-700/80 transition-all duration-200"
            />
            <MagnifyingGlass 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
          </motion.div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-gray-900 rounded-lg border border-gray-700 shadow-2xl z-50"
              >
                <div className="p-3">
                  <p className="text-xs text-gray-400 mb-2">Search results for "{searchQuery}"</p>
                  <div className="space-y-1">
                    <div className="p-2 hover:bg-white/5 rounded text-sm text-gray-300 cursor-pointer">
                      No results found
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side - Controls */}
      <div className="flex items-center space-x-3">
        {/* Layout Toggle */}
        <motion.button
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Toggle Sidebar"
        >
          <Sidebar size={16} />
        </motion.button>

        {/* Settings */}
        <motion.button
          onClick={onSettingsClick}
          className={`p-2 rounded-lg transition-all duration-200 ${
            showSettings 
              ? 'bg-gray-600/50 text-gray-300' 
              : 'text-gray-500 hover:text-gray-200 hover:bg-gray-700/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Settings"
        >
          <motion.div
            animate={{ rotate: showSettings ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Gear size={16} weight={showSettings ? 'fill' : 'regular'} />
          </motion.div>
        </motion.button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-600" />

        {/* Window Controls */}
        <div className="flex items-center space-x-1">
          <motion.button
            className="p-1.5 text-gray-400 hover:text-white hover:bg-yellow-500/20 rounded transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Minimize"
          >
            <Minus size={12} weight="bold" />
          </motion.button>

          <motion.button
            className="p-1.5 text-gray-400 hover:text-white hover:bg-blue-500/20 rounded transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Maximize"
          >
            <Square size={12} weight="bold" />
          </motion.button>

          <motion.button
            className="p-1.5 text-gray-400 hover:text-white hover:bg-red-500/20 rounded transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Close"
          >
            <X size={12} weight="bold" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}