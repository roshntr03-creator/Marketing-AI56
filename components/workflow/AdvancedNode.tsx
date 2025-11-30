
import React from 'react';
import { motion } from 'framer-motion';
import { NODE_DEFINITIONS } from '../../constants/workflowConstants';

export const AdvancedNode: React.FC<{
  node: any;
  selected: boolean;
  onNodeClick: (e: React.MouseEvent) => void;
  onNodeDrag: (e: React.MouseEvent) => void;
  onHandleDrag: (e: React.MouseEvent, handleId: string, type: 'input' | 'output') => void;
}> = ({ node, selected, onNodeClick, onNodeDrag, onHandleDrag }) => {
  const definition = NODE_DEFINITIONS[node.type] || NODE_DEFINITIONS['text_input'];
  
  return (
    <motion.div
      className={`absolute bg-gradient-to-br ${definition.color} rounded-2xl shadow-2xl border-2 backdrop-blur-sm ${
        selected ? 'border-white/80 ring-2 ring-white/50' : 'border-white/30'
      }`}
      style={{
        width: 280,
        left: node.position.x,
        top: node.position.y,
        zIndex: selected ? 50 : 10
      }}
      onMouseDown={onNodeClick}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      {/* Header */}
      <div className="p-3 bg-black/20 rounded-t-2xl cursor-grab active:cursor-grabbing" onMouseDown={onNodeDrag}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{definition.icon}</span>
            <div>
              <h3 className="text-white font-bold text-xs uppercase tracking-wider">{node.data.label}</h3>
              <p className="text-white/60 text-[10px] capitalize">{definition.category}</p>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className={`w-2 h-2 rounded-full ${
            node.data.status === 'completed' ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]' :
            node.data.status === 'running' ? 'bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]' :
            node.data.status === 'failed' ? 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]' : 'bg-white/40'
          }`} />
        </div>
      </div>

      {/* Body */}
      <div className="p-3 space-y-3 bg-black/10 rounded-b-2xl">
        {/* Input Handles */}
        {Object.entries(node.data.inputs || {}).map(([id, port]: [string, any]) => (
          <div key={id} className="flex items-center justify-between relative">
            <span className="text-white/90 text-[10px] font-mono ml-2">{port.label}</span>
            <div
              className={`absolute -left-[19px] w-3 h-3 rounded-full border-2 cursor-crosshair ${
                port.required ? 'bg-red-500 border-red-200' : 'bg-green-500 border-green-200'
              } shadow-lg hover:scale-150 transition-transform`}
              onMouseDown={(e) => onHandleDrag(e, id, 'input')}
              title={port.label}
            />
          </div>
        ))}

        {/* Configuration Preview */}
        <div className="bg-black/20 rounded-lg p-2 border border-white/5">
          <div className="text-white/60 text-[10px] space-y-1">
            {Object.entries(node.data.config).slice(0, 2).map(([key, value]) => (
              <div key={key} className="flex justify-between overflow-hidden">
                <span className="opacity-70">{key}:</span>
                <span className="text-white font-mono truncate max-w-[120px]">
                  {typeof value === 'string' && value.length > 20 ? 
                    `${value.slice(0, 20)}...` : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Output Handles */}
        {Object.entries(node.data.outputs || {}).map(([id, port]: [string, any]) => (
          <div key={id} className="flex items-center justify-between relative">
            <div className="flex-1"></div>
            <span className="text-white/90 text-[10px] font-mono mr-2">{port.label}</span>
            <div
              className={`absolute -right-[19px] w-3 h-3 rounded-full border-2 cursor-crosshair ${
                port.required ? 'bg-indigo-500 border-indigo-200' : 'bg-blue-500 border-blue-200'
              } shadow-lg hover:scale-150 transition-transform`}
              onMouseDown={(e) => onHandleDrag(e, id, 'output')}
              title={port.label}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};
