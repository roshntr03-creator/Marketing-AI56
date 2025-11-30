
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AdvancedNode } from './AdvancedNode';
import { NODE_DEFINITIONS } from '../../constants/workflowConstants';

interface CanvasProps {
  nodes: any[];
  edges: any[];
  viewport: any;
  onNodesChange: (nodes: any[]) => void;
  onEdgesChange: (edges: any[]) => void;
  onViewportChange: (viewport: any) => void;
  selectedElements: Set<string>;
  onSelectionChange: (selection: Set<string>) => void;
  readOnly?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  nodes,
  edges,
  viewport,
  onNodesChange,
  onEdgesChange,
  onViewportChange,
  selectedElements,
  onSelectionChange,
  readOnly = false
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{
      type: 'PAN' | 'NODE' | 'CONNECTION';
      startX: number;
      startY: number;
      initialViewport?: any;
      nodeId?: string;
      initialNodePos?: { x: number, y: number };
      sourceNodeId?: string;
      sourceHandleId?: string;
      handleType?: 'input' | 'output';
  } | null>(null);
  
  const [tempConnection, setTempConnection] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);

  const screenToCanvas = useCallback((sx: number, sy: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (sx - rect.left - viewport.x) / viewport.zoom,
      y: (sy - rect.top - viewport.y) / viewport.zoom
    };
  }, [viewport]);

  const getHandleCoords = (nodeId: string, handleId: string, type: 'input' | 'output') => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    
    const def = NODE_DEFINITIONS[node.type] || NODE_DEFINITIONS['text_input'];
    const ports = type === 'input' ? node.data.inputs : node.data.outputs;
    const index = Object.keys(ports || {}).indexOf(handleId);
    
    // Header ~50px + Padding + Index * ItemHeight
    const yOffset = 60 + 12 + (index * 24) + 12; 
    
    return {
        x: type === 'input' ? node.position.x : node.position.x + 280,
        y: node.position.y + yOffset
    };
  };

  const getPath = (x1: number, y1: number, x2: number, y2: number) => {
    const dist = Math.abs(x2 - x1);
    const control = Math.max(dist * 0.5, 80);
    return `M ${x1} ${y1} C ${x1 + control} ${y1}, ${x2 - control} ${y2}, ${x2} ${y2}`;
  };

  // --- Event Handlers ---

  const handleMouseDown = (e: React.MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.target === canvasRef.current)) {
          e.preventDefault();
          setDragState({ type: 'PAN', startX: e.clientX, startY: e.clientY, initialViewport: { ...viewport } });
          onSelectionChange(new Set());
      }
  };

  const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation();
      if (readOnly) return;
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
          setDragState({ type: 'NODE', startX: e.clientX, startY: e.clientY, nodeId, initialNodePos: { ...node.position } });
          onSelectionChange(new Set([nodeId]));
      }
  };

  const handleHandleDragStart = (e: React.MouseEvent, nodeId: string, handleId: string, type: 'input' | 'output') => {
      e.stopPropagation();
      if (readOnly) return;
      const coords = getHandleCoords(nodeId, handleId, type);
      setDragState({ type: 'CONNECTION', startX: coords.x, startY: coords.y, sourceNodeId: nodeId, sourceHandleId: handleId, handleType: type });
      const mousePos = screenToCanvas(e.clientX, e.clientY);
      setTempConnection({ x1: coords.x, y1: coords.y, x2: mousePos.x, y2: mousePos.y });
  };

  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
          if (!dragState) return;

          if (dragState.type === 'PAN') {
              const dx = e.clientX - dragState.startX;
              const dy = e.clientY - dragState.startY;
              onViewportChange({
                  ...dragState.initialViewport,
                  x: dragState.initialViewport.x + dx,
                  y: dragState.initialViewport.y + dy
              });
          } else if (dragState.type === 'NODE') {
              const dx = (e.clientX - dragState.startX) / viewport.zoom;
              const dy = (e.clientY - dragState.startY) / viewport.zoom;
              const newX = Math.round((dragState.initialNodePos!.x + dx) / 20) * 20; // Snap to grid
              const newY = Math.round((dragState.initialNodePos!.y + dy) / 20) * 20;
              
              onNodesChange(nodes.map(n => n.id === dragState.nodeId ? { ...n, position: { x: newX, y: newY } } : n));
          } else if (dragState.type === 'CONNECTION') {
              const mousePos = screenToCanvas(e.clientX, e.clientY);
              const startCoords = getHandleCoords(dragState.sourceNodeId!, dragState.sourceHandleId!, dragState.handleType!);
              setTempConnection({ x1: startCoords.x, y1: startCoords.y, x2: mousePos.x, y2: mousePos.y });
          }
      };

      const handleMouseUp = (e: MouseEvent) => {
          if (dragState?.type === 'CONNECTION') {
              const endPos = screenToCanvas(e.clientX, e.clientY);
              let targetMatch = null;
              nodes.forEach(node => {
                  if (node.id === dragState.sourceNodeId) return;
                  const targetType = dragState.handleType === 'output' ? 'input' : 'output';
                  const ports = targetType === 'input' ? node.data.inputs : node.data.outputs;
                  
                  Object.keys(ports || {}).forEach(handleId => {
                      const coords = getHandleCoords(node.id, handleId, targetType);
                      if (Math.hypot(coords.x - endPos.x, coords.y - endPos.y) < 30) {
                          targetMatch = { nodeId: node.id, handleId, type: targetType };
                      }
                  });
              });

              if (targetMatch) {
                  const newEdge = {
                      id: `e_${Date.now()}`,
                      source: dragState.handleType === 'output' ? dragState.sourceNodeId! : targetMatch.nodeId,
                      sourceHandle: dragState.handleType === 'output' ? dragState.sourceHandleId! : targetMatch.handleId,
                      target: dragState.handleType === 'output' ? targetMatch.nodeId : dragState.sourceNodeId!,
                      targetHandle: dragState.handleType === 'output' ? targetMatch.handleId : dragState.sourceHandleId!,
                      dataType: 'any'
                  };
                  // Prevent duplicates
                  if (!edges.some(e => e.source === newEdge.source && e.target === newEdge.target && e.sourceHandle === newEdge.sourceHandle && e.targetHandle === newEdge.targetHandle)) {
                      onEdgesChange([...edges, newEdge]);
                  }
              }
          }

          setDragState(null);
          setTempConnection(null);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
      };
  }, [dragState, viewport, nodes, edges, onNodesChange, onEdgesChange, onViewportChange, screenToCanvas]);


  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden bg-[#050505] cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onWheel={(e) => {
        const delta = e.deltaY * -0.001;
        const newZoom = Math.min(Math.max(viewport.zoom * (1 + delta), 0.1), 3);
        onViewportChange({ ...viewport, zoom: newZoom });
      }}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
          backgroundImage: `radial-gradient(circle, #52525b 1px, transparent 1px)`
        }}
      />
      
      <div 
        className="transform origin-top-left w-full h-full"
        style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})` }}
      >
          {/* Edges Layer */}
          <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-0">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <linearGradient id="edge-gradient" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                </linearGradient>
            </defs>
            {edges.map(edge => {
                const start = getHandleCoords(edge.source, edge.sourceHandle, 'output');
                const end = getHandleCoords(edge.target, edge.targetHandle, 'input');
                const path = getPath(start.x, start.y, end.x, end.y);
                
                const sourceNode = nodes.find(n => n.id === edge.source);
                const isActive = sourceNode?.data.status === 'completed' || sourceNode?.data.status === 'running';

                return (
                    <g key={edge.id} className="pointer-events-auto cursor-pointer group" onClick={() => !readOnly && onEdgesChange(edges.filter(e => e.id !== edge.id))}>
                        <path d={path} stroke="transparent" strokeWidth="20" fill="none" />
                        <path d={path} stroke="#3f3f46" strokeWidth="3" fill="none" />
                        <path 
                            d={path} 
                            stroke={isActive ? 'url(#edge-gradient)' : '#71717a'} 
                            strokeWidth="2" 
                            fill="none" 
                            filter={isActive ? 'url(#glow)' : ''}
                            className="group-hover:stroke-red-500 transition-colors"
                        />
                        {isActive && (
                            <circle r="3" fill="#fff">
                                <animateMotion dur="1.5s" repeatCount="indefinite" path={path} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                            </circle>
                        )}
                    </g>
                );
            })}
            {tempConnection && (
                <path 
                    d={getPath(tempConnection.x1, tempConnection.y1, tempConnection.x2, tempConnection.y2)} 
                    stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" fill="none" className="animate-pulse" 
                />
            )}
          </svg>

          {/* Nodes Layer */}
          {nodes.map(node => (
            <AdvancedNode
                key={node.id}
                node={node}
                selected={selectedElements.has(node.id)}
                onNodeClick={(e) => { e.stopPropagation(); onSelectionChange(new Set([node.id])); }}
                onNodeDrag={(e) => handleNodeDragStart(e, node.id)}
                onHandleDrag={(e, handleId, type) => handleHandleDragStart(e, node.id, handleId, type)}
            />
          ))}
      </div>
    </div>
  );
};

export default Canvas;
