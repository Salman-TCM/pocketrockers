'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User } from '@phosphor-icons/react';

interface OnlineUser {
  id: string;
  name: string;
  color: string;
  lastSeen: Date;
}

export default function UserPresence() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate user presence (in a real app, this would come from WebSocket)
  useEffect(() => {
    const colors = ['#00ffcc', '#b794f4', '#ff006e', '#00a8ff', '#84cc16'];
    const names = ['You', 'Alex', 'Sarah', 'Mike', 'Emma'];
    
    const generateUsers = () => {
      const userCount = Math.floor(Math.random() * 4) + 2; // 2-5 users
      const users: OnlineUser[] = [];
      
      for (let i = 0; i < userCount; i++) {
        users.push({
          id: `user-${i}`,
          name: names[i] || `User ${i}`,
          color: colors[i % colors.length],
          lastSeen: new Date(),
        });
      }
      
      setOnlineUsers(users);
    };

    generateUsers();
    
    // Simulate users joining/leaving
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to update
        generateUsers();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="relative">
      {/* User Count Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-dark-200/50 border border-white/10 hover:border-neon-lime/30 transition-all duration-200"
      >
        <Users size={16} className="text-neon-lime" weight="duotone" />
        <span className="text-sm font-medium text-neon-lime">{onlineUsers.length}</span>
        <span className="text-xs text-gray-400">online</span>
      </motion.button>

      {/* Expanded User List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-64 glass-panel z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Users size={18} className="text-neon-lime" weight="duotone" />
                <h3 className="font-semibold text-white">Online Users</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-neon-lime rounded-full animate-pulse" />
                  <span className="text-xs text-neon-lime">{onlineUsers.length}</span>
                </div>
              </div>
            </div>

            {/* User List */}
            <div className="p-2 max-h-64 overflow-y-auto">
              {onlineUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-200/30 transition-colors"
                >
                  {/* Avatar */}
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-dark-400 border border-white/20"
                    style={{ backgroundColor: user.color }}
                  >
                    {getUserInitials(user.name)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">{user.name}</span>
                      {user.name === 'You' && (
                        <span className="text-xs bg-neon-teal/20 text-neon-teal px-2 py-0.5 rounded">You</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-neon-lime rounded-full" />
                      <span className="text-xs text-gray-400">Active now</span>
                    </div>
                  </div>

                  {/* Activity Indicator */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                    className="w-2 h-2 bg-neon-lime rounded-full"
                  />
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Collaborative session active</span>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-neon-lime rounded-full animate-pulse" />
                  <span>Live</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click Outside to Close */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}