
import React from 'react';
import { motion } from 'framer-motion';

interface ExecutionOverlayProps {
  executionState: any;
  onAbort: () => void;
}

const ExecutionOverlay: React.FC<ExecutionOverlayProps> = ({ executionState, onAbort }) => {
  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const duration = end.getTime() - startTime.getTime();
    const seconds = Math.floor(duration / 1000) % 60;
    const minutes = Math.floor(duration / 60000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 shadow-2xl border border-white/20 max-w-md w-full mx-4 pointer-events-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg font-display">Running Workflow...</h3>
          <button
            onClick={onAbort}
            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-zinc-400 mb-2">
            <span>Processing Nodes</span>
            <span>{Math.round(executionState.progress)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${executionState.progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>
        </div>

        {/* Status */}
        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 text-white">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="capitalize text-sm font-medium">{executionState.status}</span>
            <span className="text-zinc-500 text-xs ml-auto font-mono">
              {formatDuration(new Date(executionState.startTime), executionState.endTime ? new Date(executionState.endTime) : undefined)}
            </span>
          </div>
          {executionState.currentNodes.length > 0 && (
            <div className="text-zinc-400 text-xs mt-2 font-mono">
              Active Node ID: {executionState.currentNodes.join(', ')}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onAbort}
            className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 px-4 rounded-lg font-medium transition-colors text-sm"
          >
            Abort Execution
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExecutionOverlay;
