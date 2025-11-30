
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { 
  PlayIcon, 
  StopIcon, 
  ArrowsPointingOutIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  TrashIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  PuzzlePieceIcon,
  XMarkIcon,
  Squares2X2Icon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import Canvas from '../components/workflow/Canvas';
import NodeProperties from '../components/workflow/NodeProperties';
import ExecutionOverlay from '../components/workflow/ExecutionOverlay';
import { NODE_DEFINITIONS } from '../constants/workflowConstants';
import { workflowEngine } from '../services/workflowExecution';
import { Workflow, Node, Edge, ExecutionState, NodeType } from '../types/workflow';

// Helper to create initial node structure
const createNodeFromType = (type: NodeType, x: number, y: number): Node => {
    const def = NODE_DEFINITIONS[type] || NODE_DEFINITIONS['text_input'];
    return {
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        type,
        position: { x, y },
        data: {
            label: def.label,
            config: JSON.parse(JSON.stringify(def.config)), // Deep copy defaults
            inputs: JSON.parse(JSON.stringify(def.inputs)),
            outputs: JSON.parse(JSON.stringify(def.outputs)),
            status: 'idle'
        }
    };
};

const WorkflowBuilderPage: React.FC = () => {
  const { showNotification } = useAppContext();
  
  // State Management
  const [nodes, setNodes] = useState<Node[]>([
      createNodeFromType('text_input', 100, 200),
      createNodeFromType('llm_processor', 500, 200),
      createNodeFromType('viewer', 900, 200)
  ]);
  
  const [edges, setEdges] = useState<Edge[]>([
      { id: 'e1', source: nodes[0].id, sourceHandle: 'text', target: nodes[1].id, targetHandle: 'context', dataType: 'text' },
      { id: 'e2', source: nodes[1].id, sourceHandle: 'response', target: nodes[2].id, targetHandle: 'data', dataType: 'any' }
  ]);

  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [selectedElements, setSelectedElements] = useState<Set<string>>(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [executionState, setExecutionState] = useState<ExecutionState | null>(null);
  const [showProperties, setShowProperties] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showPalette, setShowPalette] = useState(true);
  
  // Execution Handler
  const executeWorkflow = useCallback(async () => {
    if (isRunning || nodes.length === 0) return;
    
    setIsRunning(true);
    
    // Prepare Workflow Object
    const workflowData: Workflow = {
        id: 'temp-workflow',
        name: 'Untitled Workflow',
        description: '',
        version: '1.0',
        nodes,
        edges,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: false,
        tags: [],
        statistics: { totalExecutions: 0, successRate: 0, averageExecutionTime: 0 }
    };

    // Initial State for UI
    setExecutionState({
        workflowId: workflowData.id,
        executionId: 'init',
        status: 'running',
        progress: 0,
        currentNodes: [],
        results: {},
        errors: {},
        startTime: new Date()
    });

    try {
        const result = await workflowEngine.executeWorkflow(workflowData);
        
        setExecutionState(result);
        
        // Update nodes with results for display
        setNodes(prev => prev.map(node => {
            if (result.results[node.id]) {
                return { 
                    ...node, 
                    data: { 
                        ...node.data, 
                        status: 'completed', 
                        result: result.results[node.id],
                        executionTime: 100 // Mock time since engine returns it internally but we might want to expose it better
                    } 
                };
            } else if (result.errors[node.id]) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        status: 'failed',
                        error: result.errors[node.id]
                    }
                };
            }
            return node;
        }));

        if (result.status === 'completed') {
            showNotification('Workflow execution completed successfully!', 'success');
        } else {
            showNotification('Workflow execution failed.', 'error');
        }

    } catch (error) {
        console.error(error);
        showNotification('Execution error occured.', 'error');
    } finally {
        setIsRunning(false);
    }
  }, [nodes, edges, isRunning, showNotification]);

  const stopExecution = () => {
      if(executionState?.executionId) {
          workflowEngine.abortExecution(executionState.executionId);
      }
      setIsRunning(false);
      showNotification('Execution aborted.', 'info');
  };

  const updateNode = (nodeId: string, updates: any) => {
      setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, ...updates } : n));
  };

  const removeNode = (nodeId: string) => {
      setNodes(prev => prev.filter(n => n.id !== nodeId));
      setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
      setSelectedElements(prev => {
          const newSet = new Set(prev);
          newSet.delete(nodeId);
          return newSet;
      });
  };

  // Canvas Drop Handler
  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow');
      
      if (type && NODE_DEFINITIONS[type]) {
          // Calculate drop position relative to canvas
          // This is a simplification; real implementation needs canvas bounds
          const rect = (e.target as Element).getBoundingClientRect();
          const x = (e.clientX - rect.left - viewport.x) / viewport.zoom;
          const y = (e.clientY - rect.top - viewport.y) / viewport.zoom;
          
          const newNode = createNodeFromType(type as NodeType, x, y);
          setNodes(prev => [...prev, newNode]);
      }
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
  };

  // Group definitions by category for sidebar
  const groupedDefinitions = useMemo(() => {
    return Object.entries(NODE_DEFINITIONS).reduce((acc, [type, def]) => {
        if (!acc[def.category]) acc[def.category] = [];
        acc[def.category].push({ type: type as NodeType, ...def });
        return acc;
    }, {} as Record<string, Array<{ type: NodeType } & typeof NODE_DEFINITIONS[string]>>);
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-[#050505] overflow-hidden flex relative">
      
      {/* LEFT PANEL: NODE PALETTE */}
      <AnimatePresence>
        {showPalette && (
            <motion.div 
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="w-64 bg-[#09090b] border-r border-white/10 flex flex-col z-20 shadow-2xl flex-shrink-0"
            >
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Tools</h2>
                    <button onClick={() => setShowPalette(false)} className="text-zinc-500 hover:text-white">
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {Object.entries(groupedDefinitions).map(([category, items]) => (
                        <div key={category}>
                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">{category}</h3>
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <div
                                        key={item.type}
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('application/reactflow', item.type);
                                            e.dataTransfer.effectAllowed = 'move';
                                        }}
                                        onClick={() => {
                                            // Double click to add to center
                                            const centerX = (-viewport.x + 400) / viewport.zoom;
                                            const centerY = (-viewport.y + 300) / viewport.zoom;
                                            const newNode = createNodeFromType(item.type, centerX, centerY);
                                            setNodes(prev => [...prev, newNode]);
                                        }}
                                        className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 cursor-grab active:cursor-grabbing transition-all group"
                                    >
                                        <span className="text-xl opacity-80 group-hover:scale-110 transition-transform">{item.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs font-medium text-zinc-300 block truncate">{item.label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CANVAS AREA */}
      <div 
        className="flex-1 relative h-full bg-[#050505]"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
          <Canvas
            nodes={nodes}
            edges={edges}
            viewport={viewport}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
            onViewportChange={setViewport}
            selectedElements={selectedElements}
            onSelectionChange={setSelectedElements}
            readOnly={isRunning}
          />

          {/* FLOATING TOOLBAR */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-2 shadow-2xl z-30">
                <div className="flex items-center gap-1">
                    <button
                        onClick={executeWorkflow}
                        disabled={isRunning}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isRunning 
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20'
                        }`}
                    >
                        {isRunning ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <PlayIcon className="w-4 h-4" />}
                        {isRunning ? 'Running...' : 'Run'}
                    </button>
                    {isRunning && (
                        <button
                            onClick={stopExecution}
                            className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-colors"
                        >
                            <StopIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="w-px h-6 bg-white/10 mx-1"></div>

                <div className="flex items-center gap-1">
                    <button onClick={() => setViewport(v => ({ ...v, zoom: Math.min(v.zoom * 1.2, 2) }))} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg">
                        <MagnifyingGlassPlusIcon className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] text-zinc-500 font-mono w-8 text-center">{Math.round(viewport.zoom * 100)}%</span>
                    <button onClick={() => setViewport(v => ({ ...v, zoom: Math.max(v.zoom * 0.8, 0.5) }))} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg">
                        <MagnifyingGlassMinusIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewport({ x: 0, y: 0, zoom: 1 })} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg">
                        <ArrowsPointingOutIcon className="w-4 h-4" />
                    </button>
                </div>

                <div className="w-px h-6 bg-white/10 mx-1"></div>

                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => setShowPalette(!showPalette)} 
                        className={`p-2 rounded-lg transition-colors ${showPalette ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-400 hover:text-white'}`}
                    >
                        <Squares2X2Icon className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setShowProperties(!showProperties)} 
                        className={`p-2 rounded-lg transition-colors ${showProperties ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-400 hover:text-white'}`}
                    >
                        <Cog6ToothIcon className="w-4 h-4" />
                    </button>
                </div>
          </div>

          {/* MINI MAP (Simplified Visual) */}
          {showMiniMap && (
              <div className="absolute bottom-6 left-6 w-48 h-32 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden pointer-events-none shadow-xl z-20 hidden md:block">
                  <div className="w-full h-full relative opacity-50">
                      {nodes.map(node => (
                          <div 
                            key={node.id} 
                            className={`absolute w-1.5 h-1.5 rounded-full ${node.data.status === 'completed' ? 'bg-green-500' : 'bg-zinc-500'}`}
                            style={{
                                left: `${Math.min(Math.max((node.position.x / 5000) * 100 + 50, 0), 100)}%`,
                                top: `${Math.min(Math.max((node.position.y / 5000) * 100 + 50, 0), 100)}%`
                            }}
                          />
                      ))}
                  </div>
              </div>
          )}

          {/* Delete Selected Button (Visible when selection exists) */}
          {selectedElements.size > 0 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
                  <button 
                    onClick={() => {
                        setNodes(prev => prev.filter(n => !selectedElements.has(n.id)));
                        setEdges(prev => prev.filter(e => !selectedElements.has(e.source) && !selectedElements.has(e.target))); // Fixed: remove edges connected to deleted nodes
                        setSelectedElements(new Set());
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors text-xs font-bold"
                  >
                      <TrashIcon className="w-4 h-4" /> Delete Selected ({selectedElements.size})
                  </button>
              </div>
          )}
      </div>

      {/* RIGHT PANEL: PROPERTIES */}
      <AnimatePresence>
        {showProperties && (
            <motion.div 
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="w-80 bg-[#09090b] border-l border-white/10 flex flex-col z-20 shadow-2xl flex-shrink-0"
            >
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Properties</h2>
                    <button onClick={() => setShowProperties(false)} className="text-zinc-500 hover:text-white">
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {(() => {
                        const selectedNodeId = Array.from(selectedElements).find(id => nodes.some(n => n.id === id));
                        const selectedNode = nodes.find(n => n.id === selectedNodeId);

                        if (selectedNode) {
                            return (
                                <NodeProperties 
                                    node={selectedNode} 
                                    onUpdate={(updates) => updateNode(selectedNode.id, updates)}
                                    onRemove={() => removeNode(selectedNode.id)}
                                />
                            );
                        } else {
                            return (
                                <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-4">
                                    <div className="p-4 bg-white/5 rounded-full">
                                        <PuzzlePieceIcon className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p className="text-xs text-center max-w-[150px]">Select a node to configure its parameters.</p>
                                </div>
                            );
                        }
                    })()}
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Running Overlay */}
      {isRunning && executionState && (
          <ExecutionOverlay 
            executionState={executionState} 
            onAbort={stopExecution} 
          />
      )}

    </div>
  );
};

export default WorkflowBuilderPage;
