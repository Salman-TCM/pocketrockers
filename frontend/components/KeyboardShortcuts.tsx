'use client';

import { motion } from 'framer-motion';
import { Keyboard, X } from '@phosphor-icons/react';
import Modal from './Modal';
import { usePlaylistStore } from '@/store/playlist-store';

const shortcuts = [
  { key: 'Space', description: 'Play/Pause current track' },
  { key: '→ / N', description: 'Next track' },
  { key: '← / P', description: 'Previous track' },
  { key: '↑', description: 'Volume up' },
  { key: '↓', description: 'Volume down' },
  { key: 'Shift + ↑', description: 'Select previous song' },
  { key: 'Shift + ↓', description: 'Select next song' },
  { key: 'Enter', description: 'Play selected song' },
  { key: 'M', description: 'Toggle mute' },
  { key: 'S', description: 'Shuffle playlist' },
  { key: 'R', description: 'Toggle repeat mode' },
  { key: 'L', description: 'Like current track' },
  { key: '?', description: 'Show this help' },
];

export default function KeyboardShortcuts() {
  const { showShortcutsModal, setShowShortcutsModal } = usePlaylistStore();

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowShortcutsModal(true)}
        className="p-2 rounded-xl bg-dark-200/50 border border-white/10 hover:border-neon-teal/30 transition-all duration-200"
        title="Keyboard Shortcuts (Press ?)"
      >
        <Keyboard size={18} className="text-gray-400 hover:text-neon-teal transition-colors" weight="duotone" />
      </motion.button>

      {/* Modal */}
      <Modal isOpen={showShortcutsModal} onClose={() => setShowShortcutsModal(false)} className="max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-neon-teal/20 to-neon-blue/20 rounded-xl">
                    <Keyboard size={24} className="text-neon-teal" weight="duotone" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
                    <p className="text-sm text-gray-400">Speed up your workflow</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowShortcutsModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-gray-400" weight="bold" />
                </motion.button>
              </div>

              {/* Shortcuts List */}
              <div className="p-6">
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <motion.div
                      key={shortcut.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-dark-300/30 hover:bg-dark-200/50 transition-colors"
                    >
                      <span className="text-gray-300">{shortcut.description}</span>
                      <div className="flex space-x-1">
                        {shortcut.key.split(' / ').map((key, i) => (
                          <span key={i} className="flex items-center">
                            <kbd className="px-2 py-1 text-xs font-mono bg-dark-400 border border-gray-600 rounded text-neon-teal">
                              {key}
                            </kbd>
                            {i < shortcut.key.split(' / ').length - 1 && (
                              <span className="mx-2 text-gray-500">or</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer Tip */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 p-4 bg-neon-teal/10 border border-neon-teal/30 rounded-xl"
                >
                  <p className="text-sm text-neon-teal font-medium">
                    💡 Tip: Press <kbd className="px-1 py-0.5 bg-dark-400 border border-gray-600 rounded text-xs">?</kbd> anywhere to open this menu quickly!
                  </p>
                </motion.div>
              </div>
      </Modal>
    </>
  );
}