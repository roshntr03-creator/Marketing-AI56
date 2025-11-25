
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
    PhotoIcon, 
    DocumentTextIcon, 
    CpuChipIcon, 
    PlayIcon, 
    ArrowPathIcon, 
    CubeIcon,
    EyeIcon,
    XMarkIcon,
    MagnifyingGlassMinusIcon,
    MagnifyingGlassPlusIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    StopIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import aiService from '../services/aiService';
import { Input, Textarea } from '../components/ui/Input';

// --- Types & Interfaces ---

type NodeType = 'INPUT_TEXT' | 'INPUT_IMAGE' | 'LLM' | 'IMAGE_GEN' | 'VIEWER';
type DataType = 'text' | 'image' | 'any';

interface NodeData {
    id: string;
    type: NodeType;
    x: number;
    y: number;
    label: string;
    inputs: { id: string; label: string; type: DataType }[];
    outputs: { id: string; label: string; type: DataType }[];
    config: Record<string, any>;
    status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'ERROR';
    result?: any;
    error?: string;
}

interface Edge {
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
}

interface Viewport {
    x: number;
    y: number;
    zoom: number;
}

interface DragState {
    type: 'PAN' | 'NODE' | 'CONNECTION';
    startX: number;
    startY: number;
    initialViewport?: Viewport;
    nodeId?: string; // For Node Dragging
    initialNodePos?: { x: number, y: number };
    sourceNodeId?: string; // For Connecting
    sourceHandleId?: string;
    handleType?: 'input' | 'output';
}

// --- Constants ---

const NODE_WIDTH = 280;
const HEADER_HEIGHT = 40;
const GRID_SIZE = 20;

const TYPE_COLORS: Record<DataType, string> = {
    text: '#fbbf24', // Amber
    image: '#ec4899', // Pink
    any: '#94a3b8'   // Slate
};

const NODE_DEFINITIONS: Record<NodeType, { label: string, icon: any, color: string, inputs: {id:string, label:string, type:DataType}[], outputs: {id:string, label:string, type:DataType}[], defaultConfig: any }> = {
    INPUT_TEXT: {
        label: 'Text Input',
        icon: DocumentTextIcon,
        color: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
        inputs: [],
        outputs: [{ id: 'out', label: 'Text', type: 'text' }],
        defaultConfig: { value: 'A futuristic cityscape' }
    },
    INPUT_IMAGE: {
        label: 'Image Input',
        icon: PhotoIcon,
        color: 'border-pink-500/30 bg-pink-500/10 text-pink-500',
        inputs: [],
        outputs: [{ id: 'out', label: 'Image', type: 'image' }],
        defaultConfig: { url: '' }
    },
    LLM: {
        label: 'AI Processor',
        icon: CpuChipIcon,
        color: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
        inputs: [{ id: 'in', label: 'Context', type: 'text' }],
        outputs: [{ id: 'out', label: 'Response', type: 'text' }],
        defaultConfig: { model: 'gemini-2.5-flash', prompt: 'Enhance this prompt: {{input}}' }
    },
    IMAGE_GEN: {
        label: 'Image Gen',
        icon: CubeIcon,
        color: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
        inputs: [{ id: 'in', label: 'Prompt', type: 'text' }],
        outputs: [{ id: 'out', label: 'Image', type: 'image' }],
        defaultConfig: { model: 'nano-banana-pro', aspectRatio: '16:9', prompt: '' }
    },
    VIEWER: {
        label: 'Viewer',
        icon: EyeIcon,
        color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
        inputs: [{ id: 'in', label: 'Data', type: 'any' }],
        outputs: [],
        defaultConfig: {}
    }
};

// --- Helper Functions ---

const getHandleCoords = (nodeId: string, handleId: string, type: 'input' | 'output', nodes: NodeData[]) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };

    const list = type === 'input' ? node.inputs : node.outputs;
    const index = list.findIndex(h => h.id === handleId);
    
    // Calculate Y position based on header height and item height
    const yOffset = HEADER_HEIGHT + 12 + (index * 28) + 10; 
    
    return {
        x: type === 'input' ? node.x : node.x + NODE_WIDTH,
        y: node.y + yOffset
    };
};

// --- Node Component ---

const NodeWidget = React.memo(({ 
    node, 
    selected, 
    onMouseDown, 
    onHandleMouseDown,
    updateNodeConfig,
    deleteNode
}: { 
    node: NodeData, 
    selected: boolean, 
    onMouseDown: (e: React.MouseEvent, id: string) => void,
    onHandleMouseDown: (e: React.MouseEvent, nodeId: string, handleId: string, type: 'input' | 'output') => void,
    updateNodeConfig: (id: string, key: string, value: any) => void,
    deleteNode: (id: string) => void
}) => {
    const def = NODE_DEFINITIONS[node.type];
    const Icon = def.icon;

    const stopPropagation = (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
        e.stopPropagation();
    };

    // Status visual indicators
    const statusGlow = 
        node.status === 'RUNNING' ? 'shadow-[0_0_30px_rgba(99,102,241,0.3)] border-indigo-500' :
        node.status === 'SUCCESS' ? 'shadow-[0_0_30px_rgba(16,185,129,0.2)] border-emerald-500/50' :
        node.status === 'ERROR' ? 'shadow-[0_0_30px_rgba(239,68,68,0.2)] border-red-500/50' :
        '';

    return (
        <div 
            className={`absolute flex flex-col rounded-xl bg-[#121214]/90 backdrop-blur-md border shadow-xl transition-all duration-200 group ${selected ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-indigo-500/20 z-50' : 'border-white/10 z-10 hover:border-white/20'} ${statusGlow}`}
            style={{ 
                width: NODE_WIDTH, 
                transform: `translate(${node.x}px, ${node.y}px)`,
            }}
            onMouseDown={(e) => onMouseDown(e, node.id)}
        >
            {/* Header */}
            <div className={`h-10 px-3 flex items-center justify-between rounded-t-xl border-b border-white/5 ${def.color} cursor-grab active:cursor-grabbing select-none`}>
                <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider text-zinc-100">
                    <Icon className="w-4 h-4" />
                    {node.label}
                </div>
                <div className="flex items-center gap-2">
                    {node.status === 'RUNNING' && <ArrowPathIcon className="w-3 h-3 animate-spin text-indigo-400" />}
                    {node.status === 'SUCCESS' && <CheckCircleIcon className="w-3 h-3 text-emerald-400" />}
                    {node.status === 'ERROR' && <ExclamationTriangleIcon className="w-3 h-3 text-red-400" />}
                    <button 
                        onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }} 
                        className="text-zinc-500 hover:text-red-400 ml-1 transition-colors p-1 rounded hover:bg-white/10"
                    >
                        <XMarkIcon className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="p-3 relative cursor-default" onMouseDown={stopPropagation}>
                
                {/* Handles - Absolute Positioned relative to Body */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {/* Inputs */}
                    <div className="absolute left-[-6px] top-[10px] flex flex-col gap-[8px] pointer-events-auto">
                        {node.inputs.map((input) => (
                            <div key={input.id} className="h-[20px] flex items-center relative group/handle">
                                <div 
                                    className="w-3 h-3 rounded-full border border-zinc-700 bg-[#121214] hover:bg-white hover:scale-125 transition-all cursor-crosshair z-20 shadow-sm"
                                    style={{ borderColor: TYPE_COLORS[input.type] }}
                                    onMouseDown={(e) => onHandleMouseDown(e, node.id, input.id, 'input')}
                                    title={`${input.label} (${input.type})`}
                                />
                                <span className="ml-2 text-[9px] font-mono text-zinc-500 group-hover/handle:text-zinc-300 transition-colors">{input.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Outputs */}
                    <div className="absolute right-[-6px] top-[10px] flex flex-col gap-[8px] pointer-events-auto w-full">
                        {node.outputs.map((output) => (
                            <div key={output.id} className="h-[20px] flex items-center justify-end relative group/handle">
                                <span className="mr-2 text-[9px] font-mono text-zinc-500 group-hover/handle:text-zinc-300 transition-colors text-right">{output.label}</span>
                                <div 
                                    className="w-3 h-3 rounded-full border border-zinc-700 bg-[#121214] hover:bg-white hover:scale-125 transition-all cursor-crosshair z-20 shadow-sm"
                                    style={{ borderColor: TYPE_COLORS[output.type] }}
                                    onMouseDown={(e) => onHandleMouseDown(e, node.id, output.id, 'output')}
                                    title={`${output.label} (${output.type})`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Config Area */}
                <div className="space-y-3 pt-1 px-1">
                    {(node.inputs.length > 0 || node.outputs.length > 0) && <div style={{ height: Math.max(node.inputs.length, node.outputs.length) * 28 - 10 }}></div>}

                    {node.type === 'INPUT_TEXT' && (
                        <Textarea 
                            value={node.config.value}
                            onChange={(e) => updateNodeConfig(node.id, 'value', e.target.value)}
                            placeholder="Enter text..."
                            className="bg-zinc-950 border-white/5 text-xs min-h-[80px] resize-y focus:border-indigo-500/50 p-2 rounded font-mono"
                        />
                    )}
                    
                    {node.type === 'INPUT_IMAGE' && (
                        <div className="space-y-2">
                            <Input
                                value={node.config.url}
                                onChange={(e) => updateNodeConfig(node.id, 'url', e.target.value)}
                                placeholder="Image URL..."
                                className="bg-zinc-950 border-white/5 text-xs p-2"
                            />
                            {node.config.url && (
                                <div className="rounded-lg overflow-hidden border border-white/5 h-32 bg-black/20 relative">
                                    <img src={node.config.url} className="w-full h-full object-cover" alt="preview" onError={(e) => (e.currentTarget.src = 'https://placehold.co/300x200?text=Invalid+Image')} />
                                </div>
                            )}
                        </div>
                    )}

                    {node.type === 'LLM' && (
                        <div className="space-y-2">
                            <select 
                                value={node.config.model}
                                onChange={(e) => updateNodeConfig(node.id, 'model', e.target.value)}
                                className="bg-zinc-950 border border-white/10 rounded w-full py-1.5 px-2 text-[10px] text-zinc-300 focus:outline-none focus:border-indigo-500 font-mono"
                            >
                                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                                <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
                            </select>
                            <Textarea 
                                value={node.config.prompt}
                                onChange={(e) => updateNodeConfig(node.id, 'prompt', e.target.value)}
                                placeholder="System instructions (Use {{input}} for context)..."
                                className="bg-zinc-950 border-white/5 text-[10px] min-h-[80px] font-mono p-2 text-zinc-400 focus:text-zinc-200"
                            />
                        </div>
                    )}

                    {node.type === 'IMAGE_GEN' && (
                        <div className="space-y-2">
                             <select 
                                value={node.config.model}
                                onChange={(e) => updateNodeConfig(node.id, 'model', e.target.value)}
                                className="bg-zinc-950 border border-white/10 rounded w-full py-1.5 px-2 text-[10px] text-zinc-300 focus:outline-none focus:border-indigo-500 font-mono"
                            >
                                <option value="nano-banana-pro">Nano Banana Pro</option>
                                <option value="bytedance/seedream-v4-text-to-image">Seedream v4</option>
                            </select>
                            <div className="flex gap-1 bg-zinc-950 p-1 rounded border border-white/5">
                                {['1:1', '16:9', '9:16'].map(r => (
                                    <button 
                                        key={r}
                                        onClick={() => updateNodeConfig(node.id, 'aspectRatio', r)}
                                        className={`flex-1 py-1 rounded text-[9px] transition-colors ${node.config.aspectRatio === r ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                            <Input 
                                value={node.config.prompt}
                                onChange={(e) => updateNodeConfig(node.id, 'prompt', e.target.value)}
                                placeholder="Additional styling prompts..."
                                className="bg-zinc-950 border-white/5 text-xs p-2"
                            />
                        </div>
                    )}

                    {/* Result Display */}
                    {node.result && (
                        <div className="mt-3 pt-3 border-t border-white/5 animate-fade-in">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-bold uppercase text-emerald-500 tracking-wider">Output</span>
                            </div>
                            <div className="bg-black/40 rounded-lg border border-white/5 overflow-hidden group relative">
                                {typeof node.result === 'string' && (node.result.startsWith('http') || node.result.startsWith('data:image')) ? (
                                    <div className="relative cursor-zoom-in">
                                        <img src={node.result} className="w-full h-40 object-contain bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-zinc-900/50" alt="Result"/>
                                    </div>
                                ) : (
                                    <div className="p-3 max-h-32 overflow-y-auto custom-scrollbar bg-zinc-950">
                                        <p className="text-[10px] text-zinc-300 font-mono whitespace-pre-wrap break-words leading-relaxed">
                                            {typeof node.result === 'object' ? JSON.stringify(node.result, null, 2) : node.result}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {node.error && (
                        <div className="mt-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-300 flex gap-2 items-start animate-pulse">
                            <ExclamationTriangleIcon className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            {node.error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

// --- Main Page ---

const WorkflowBuilderPage: React.FC = () => {
    // Initial Workflow Demo
    const [nodes, setNodes] = useState<NodeData[]>([
        { id: 'n1', type: 'INPUT_TEXT', x: 100, y: 200, label: 'Concept', inputs: [], outputs: NODE_DEFINITIONS.INPUT_TEXT.outputs, config: { value: 'A cyberpunk street vendor selling neon noodles' }, status: 'IDLE' },
        { id: 'n2', type: 'LLM', x: 500, y: 200, label: 'Prompt Engineer', inputs: NODE_DEFINITIONS.LLM.inputs, outputs: NODE_DEFINITIONS.LLM.outputs, config: { model: 'gemini-2.5-flash', prompt: 'Convert this concept into a highly detailed image generation prompt with lighting, style, and camera details: {{input}}' }, status: 'IDLE' },
        { id: 'n3', type: 'IMAGE_GEN', x: 900, y: 200, label: 'Renderer', inputs: NODE_DEFINITIONS.IMAGE_GEN.inputs, outputs: NODE_DEFINITIONS.IMAGE_GEN.outputs, config: { model: 'nano-banana-pro', aspectRatio: '16:9', prompt: '' }, status: 'IDLE' },
    ]);
    const [edges, setEdges] = useState<Edge[]>([
        { id: 'e1', source: 'n1', sourceHandle: 'out', target: 'n2', targetHandle: 'in' },
        { id: 'e2', source: 'n2', sourceHandle: 'out', target: 'n3', targetHandle: 'in' }
    ]);

    const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [tempConnection, setTempConnection] = useState<{ x1: number, y1: number, x2: number, y2: number, type: 'input'|'output' } | null>(null);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const dragState = useRef<DragState | null>(null);
    const isSpacePressed = useRef(false);

    // FIX: Refs for nodes/edges to avoid stale closures/re-binding event listeners
    const nodesRef = useRef(nodes);
    const edgesRef = useRef(edges);
    const viewportRef = useRef(viewport);
    
    useEffect(() => { nodesRef.current = nodes; }, [nodes]);
    useEffect(() => { edgesRef.current = edges; }, [edges]);
    useEffect(() => { viewportRef.current = viewport; }, [viewport]);

    // --- Coordinates ---
    const screenToCanvas = useCallback((sx: number, sy: number) => {
        if (!containerRef.current) return { x: 0, y: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        const vp = viewportRef.current;
        return {
            x: (sx - rect.left - vp.x) / vp.zoom,
            y: (sy - rect.top - vp.y) / vp.zoom
        };
    }, []);

    // --- Event Handlers ---

    useEffect(() => {
        const handleWindowMouseMove = (e: MouseEvent) => {
            const currentDrag = dragState.current;
            if (!currentDrag) return;

            if (currentDrag.type === 'PAN') {
                const dx = e.clientX - currentDrag.startX;
                const dy = e.clientY - currentDrag.startY;
                if (currentDrag.initialViewport) {
                    setViewport({
                        ...currentDrag.initialViewport,
                        x: currentDrag.initialViewport.x + dx,
                        y: currentDrag.initialViewport.y + dy
                    });
                }
            } 
            else if (currentDrag.type === 'NODE') {
                const draggedNodeId = currentDrag.nodeId;
                if (!draggedNodeId) return; 

                const vp = viewportRef.current;
                const dx = (e.clientX - currentDrag.startX) / vp.zoom;
                const dy = (e.clientY - currentDrag.startY) / vp.zoom;
                
                if (currentDrag.initialNodePos) {
                    let newX = currentDrag.initialNodePos.x + dx;
                    let newY = currentDrag.initialNodePos.y + dy;
                    
                    // Snap to grid
                    newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
                    newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

                    setNodes(prev => prev.map(n => n.id === draggedNodeId ? { ...n, x: newX, y: newY } : n));
                }
            }
            else if (currentDrag.type === 'CONNECTION') {
                const currentCanvas = screenToCanvas(e.clientX, e.clientY);
                setTempConnection(prev => prev ? { ...prev, x2: currentCanvas.x, y2: currentCanvas.y } : null);
            }
        };

        const handleWindowMouseUp = (e: MouseEvent) => {
            const currentDrag = dragState.current;
            
            if (currentDrag?.type === 'CONNECTION') {
                // Connection Finalization Logic
                const endCanvas = screenToCanvas(e.clientX, e.clientY);
                const SNAP_RADIUS = 40;
                let targetMatch: { nodeId: string, handleId: string, type: DataType } | null = null;

                const currentNodes = nodesRef.current;

                // Check against all potential handles
                currentNodes.forEach(node => {
                    if (node.id === currentDrag.sourceNodeId) return;

                    const targetType = currentDrag.handleType === 'output' ? 'input' : 'output';
                    const candidateHandles = targetType === 'input' ? node.inputs : node.outputs;

                    candidateHandles.forEach(handle => {
                        const pos = getHandleCoords(node.id, handle.id, targetType, currentNodes);
                        const dist = Math.hypot(pos.x - endCanvas.x, pos.y - endCanvas.y);
                        
                        if (dist < SNAP_RADIUS) {
                            // Type Validation
                            const sourceNode = currentNodes.find(n => n.id === currentDrag.sourceNodeId);
                            const sourceHandleDef = currentDrag.handleType === 'output' 
                                ? sourceNode?.outputs.find(h => h.id === currentDrag.sourceHandleId)
                                : sourceNode?.inputs.find(h => h.id === currentDrag.sourceHandleId);
                            
                            const sourceType = sourceHandleDef?.type;
                            
                            if (handle.type === 'any' || sourceType === 'any' || handle.type === sourceType) {
                                targetMatch = { nodeId: node.id, handleId: handle.id, type: handle.type };
                            }
                        }
                    });
                });

                if (targetMatch) {
                    const fromOutput = currentDrag.handleType === 'output';
                    const newEdge: Edge = {
                        id: `e_${Date.now()}`,
                        source: fromOutput ? currentDrag.sourceNodeId! : targetMatch!.nodeId,
                        sourceHandle: fromOutput ? currentDrag.sourceHandleId! : targetMatch!.handleId,
                        target: fromOutput ? targetMatch!.nodeId : currentDrag.sourceNodeId!,
                        targetHandle: fromOutput ? targetMatch!.handleId : currentDrag.sourceHandleId!
                    };

                    const currentEdges = edgesRef.current;
                    const exists = currentEdges.some(edge => 
                        edge.source === newEdge.source && edge.target === newEdge.target && 
                        edge.sourceHandle === newEdge.sourceHandle && edge.targetHandle === newEdge.targetHandle
                    );

                    if (!exists) {
                        setEdges(prev => [...prev, newEdge]);
                    }
                }
            }

            dragState.current = null;
            setTempConnection(null);
        };

        window.addEventListener('mousemove', handleWindowMouseMove);
        window.addEventListener('mouseup', handleWindowMouseUp);
        
        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
            window.removeEventListener('mouseup', handleWindowMouseUp);
        };
    }, [screenToCanvas]);

    // --- Logic ---

    const updateNodeConfig = (id: string, key: string, value: any) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, config: { ...n.config, [key]: value } } : n));
    };

    const deleteNode = (id: string) => {
        setNodes(prev => prev.filter(n => n.id !== id));
        setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
        if (selectedNodeId === id) setSelectedNodeId(null);
    };

    const addNode = (type: NodeType) => {
        const container = containerRef.current;
        const cx = container ? container.clientWidth / 2 : 500;
        const cy = container ? container.clientHeight / 2 : 400;
        
        const rect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };
        const vp = viewportRef.current;
        
        const pos = {
            x: (rect.left + cx - rect.left - vp.x) / vp.zoom,
            y: (rect.top + cy - rect.top - vp.y) / vp.zoom
        };
        
        const def = NODE_DEFINITIONS[type];
        const newNode: NodeData = {
            id: `n_${Date.now()}`,
            type,
            x: pos.x - NODE_WIDTH / 2,
            y: pos.y - 50,
            label: def.label,
            inputs: JSON.parse(JSON.stringify(def.inputs)),
            outputs: JSON.parse(JSON.stringify(def.outputs)),
            config: JSON.parse(JSON.stringify(def.defaultConfig)),
            status: 'IDLE'
        };
        setNodes(prev => [...prev, newNode]);
    };

    // --- EXECTUTION ENGINE ---
    const runWorkflow = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setNodes(prev => prev.map(n => ({ ...n, status: 'IDLE', error: undefined, result: undefined })));

        // 1. Build Dependency Graph
        const graph = new Map<string, string[]>();
        const inDegree = new Map<string, number>();
        
        nodes.forEach(n => { 
            graph.set(n.id, []); 
            inDegree.set(n.id, 0); 
        });
        
        edges.forEach(e => {
            if (graph.has(e.source) && inDegree.has(e.target)) {
                graph.get(e.source)!.push(e.target);
                inDegree.set(e.target, inDegree.get(e.target)! + 1);
            }
        });

        // 2. Topological Sort / Queue
        const queue = nodes.filter(n => inDegree.get(n.id) === 0);
        
        try {
            while (queue.length > 0) {
                const current = queue.shift()!;
                
                // Set Running Status
                setNodes(prev => prev.map(n => n.id === current.id ? { ...n, status: 'RUNNING' } : n));
                
                // Gather Inputs from previous nodes
                const incomingEdges = edges.filter(e => e.target === current.id);
                const inputValues = incomingEdges.map(e => {
                    const sourceNode = nodesRef.current.find(n => n.id === e.source);
                    return sourceNode?.result;
                }).filter(v => v !== undefined && v !== null);

                let result: any = null;
                
                // Artificial delay for visual flow
                await new Promise(r => setTimeout(r, 1000)); 

                // EXECUTION LOGIC
                if (current.type === 'INPUT_TEXT') {
                    result = current.config.value;
                }
                else if (current.type === 'INPUT_IMAGE') {
                    result = current.config.url;
                }
                else if (current.type === 'LLM') {
                    // Simple variable substitution for now: {{input}}
                    // If multiple inputs, join them
                    const context = inputValues.join('\n\n');
                    let prompt = current.config.prompt || '';
                    if (prompt.includes('{{input}}')) {
                        prompt = prompt.replace('{{input}}', context);
                    } else {
                        prompt = `${prompt}\n\nInput Context:\n${context}`;
                    }
                    
                    result = await aiService.generateText(prompt, current.config.model);
                }
                else if (current.type === 'IMAGE_GEN') {
                    let prompt = current.config.prompt || '';
                    const context = inputValues.join(' ');
                    
                    if (prompt.includes('{{input}}')) {
                        prompt = prompt.replace('{{input}}', context);
                    } else if (context) {
                        prompt = `${context} ${prompt}`;
                    }
                    
                    if (!prompt.trim()) prompt = "Abstract creative art";
                    
                    const results = await aiService.generateImage(prompt, current.config.aspectRatio, current.config.model);
                    result = results[0];
                }
                else if (current.type === 'VIEWER') {
                    result = inputValues[0]; // Pass through for viewer
                }

                // Update Node with Result
                setNodes(prev => prev.map(n => n.id === current.id ? { ...n, status: 'SUCCESS', result } : n));

                // Process Neighbors
                const neighbors = graph.get(current.id) || [];
                for (const neighborId of neighbors) {
                    inDegree.set(neighborId, inDegree.get(neighborId)! - 1);
                    if (inDegree.get(neighborId) === 0) {
                        queue.push(nodesRef.current.find(n => n.id === neighborId)!);
                    }
                }
            }
        } catch (e: any) {
            console.error("Workflow Error", e);
            // Find the current running node and mark error
            setNodes(prev => prev.map(n => n.status === 'RUNNING' ? { ...n, status: 'ERROR', error: e.message || 'Execution failed' } : n));
        } finally {
            setIsRunning(false);
        }
    };

    const getPath = (x1: number, y1: number, x2: number, y2: number) => {
        const dist = Math.abs(x2 - x1);
        // Control points for smooth Bezier
        const control = Math.max(dist * 0.5, 80);
        return `M ${x1} ${y1} C ${x1 + control} ${y1}, ${x2 - control} ${y2}, ${x2} ${y2}`;
    };

    const onNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
        if (e.button !== 0 || isSpacePressed.current) return;
        e.stopPropagation();
        setSelectedNodeId(nodeId);
        const node = nodesRef.current.find(n => n.id === nodeId);
        if (node) {
            dragState.current = { type: 'NODE', startX: e.clientX, startY: e.clientY, nodeId, initialNodePos: { x: node.x, y: node.y } };
        }
    }, []);

    const onHandleMouseDown = useCallback((e: React.MouseEvent, nodeId: string, handleId: string, type: 'input' | 'output') => {
        e.stopPropagation();
        const coords = getHandleCoords(nodeId, handleId, type, nodesRef.current);
        dragState.current = { type: 'CONNECTION', startX: coords.x, startY: coords.y, sourceNodeId: nodeId, sourceHandleId: handleId, handleType: type };
        const mouseCanvas = screenToCanvas(e.clientX, e.clientY);
        setTempConnection({ x1: coords.x, y1: coords.y, x2: mouseCanvas.x, y2: mouseCanvas.y, type });
    }, [screenToCanvas]);

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-[#050505] text-white overflow-hidden font-sans relative selection:bg-indigo-500/30">
            
            {/* Floating Toolbar */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-[#121214]/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl ring-1 ring-black/50 animate-fade-in-up">
                <button 
                    onClick={runWorkflow} 
                    disabled={isRunning} 
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${isRunning ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-indigo-500/40 text-white'}`}
                >
                    {isRunning ? <ArrowPathIcon className="w-4 h-4 animate-spin"/> : <PlayIcon className="w-4 h-4"/>}
                    {isRunning ? 'Running...' : 'Execute Workflow'}
                </button>
                
                <div className="w-px h-6 bg-white/10 mx-1"></div>
                
                <button onClick={() => setViewport(v => ({...v, zoom: Math.max(v.zoom - 0.1, 0.2)}))} className="p-2.5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors">
                    <MagnifyingGlassMinusIcon className="w-4 h-4"/>
                </button>
                <span className="text-[10px] font-mono text-zinc-500 w-12 text-center">{Math.round(viewport.zoom * 100)}%</span>
                <button onClick={() => setViewport(v => ({...v, zoom: Math.min(v.zoom + 0.1, 2)}))} className="p-2.5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors">
                    <MagnifyingGlassPlusIcon className="w-4 h-4"/>
                </button>
                
                <div className="w-px h-6 bg-white/10 mx-1"></div>
                
                <button 
                    onClick={() => { setNodes([]); setEdges([]); }}
                    className="p-2.5 hover:bg-red-500/10 hover:text-red-400 rounded-xl text-zinc-400 transition-colors" 
                    title="Clear All"
                >
                    <TrashIcon className="w-4 h-4"/>
                </button>
            </div>

            {/* Nodes Palette */}
            <div className="absolute top-6 left-6 z-40 flex flex-col gap-3 animate-fade-in">
                <div className="bg-[#121214]/90 backdrop-blur border border-white/10 rounded-2xl p-3 shadow-2xl flex flex-col gap-2 w-48">
                    <h3 className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest mb-1 px-2">Nodes</h3>
                    {Object.entries(NODE_DEFINITIONS).map(([type, def]) => (
                        <button 
                            key={type}
                            onClick={() => addNode(type as NodeType)}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all group border border-transparent hover:border-white/5"
                        >
                            <div className={`p-1.5 rounded-lg bg-opacity-10 ${def.color.split(' ')[1]} group-hover:scale-110 transition-transform`}>
                                <def.icon className={`w-4 h-4 ${def.color.split(' ')[2]}`} />
                            </div>
                            <span className="text-xs font-medium">{def.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Canvas Area */}
            <div 
                ref={containerRef}
                className="flex-1 relative overflow-hidden cursor-default canvas-bg outline-none bg-[#050505]"
                onMouseDown={(e) => {
                    const isBackground = (e.target as HTMLElement).classList.contains('canvas-bg');
                    if (e.button === 1 || (e.button === 0 && isSpacePressed.current) || (e.button === 0 && isBackground)) {
                        e.preventDefault();
                        if(isBackground) setSelectedNodeId(null);
                        dragState.current = { type: 'PAN', startX: e.clientX, startY: e.clientY, initialViewport: { ...viewport } };
                    }
                }}
                onWheel={(e) => {
                    // Pinch/Zoom logic
                    const zoomIntensity = 0.001;
                    const newZoom = Math.min(Math.max(viewport.zoom - e.deltaY * zoomIntensity, 0.2), 2.5);
                    const rect = containerRef.current!.getBoundingClientRect();
                    const mouseX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
                    const mouseY = (e.clientY - rect.top - viewport.y) / viewport.zoom;
                    const newX = e.clientX - rect.left - mouseX * newZoom;
                    const newY = e.clientY - rect.top - mouseY * newZoom;
                    setViewport({ x: newX, y: newY, zoom: newZoom });
                }}
                tabIndex={0}
            >
                {/* Infinite Grid Pattern */}
                <div 
                    className="absolute inset-0 pointer-events-none opacity-[0.15] canvas-bg"
                    style={{
                        backgroundSize: `${GRID_SIZE * viewport.zoom}px ${GRID_SIZE * viewport.zoom}px`,
                        backgroundPosition: `${viewport.x}px ${viewport.y}px`,
                        backgroundImage: `radial-gradient(circle, #52525b 1px, transparent 1px)`
                    }}
                />

                <div className="transform origin-top-left w-full h-full" style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})` }}>
                    {/* Edges Layer */}
                    <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-0">
                        <defs>
                            <linearGradient id="edge-gradient" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        {edges.map(edge => {
                            const start = getHandleCoords(edge.source, edge.sourceHandle, 'output', nodes);
                            const end = getHandleCoords(edge.target, edge.targetHandle, 'input', nodes);
                            const path = getPath(start.x, start.y, end.x, end.y);
                            
                            const sourceNode = nodes.find(n => n.id === edge.source);
                            const isActive = sourceNode?.status === 'SUCCESS' || sourceNode?.status === 'RUNNING';

                            return (
                                <g key={edge.id} onClick={() => setEdges(edges.filter(e => e.id !== edge.id))} className="pointer-events-auto cursor-pointer group">
                                    {/* Invisible fat stroke for easier clicking */}
                                    <path d={path} stroke="transparent" strokeWidth="20" fill="none" />
                                    {/* Base Stroke */}
                                    <path d={path} stroke="#27272a" strokeWidth="4" fill="none" />
                                    {/* Active/Color Stroke */}
                                    <path 
                                        d={path} 
                                        stroke={isActive ? 'url(#edge-gradient)' : '#52525b'} 
                                        strokeWidth="2" 
                                        fill="none" 
                                        className="transition-colors duration-500 group-hover:stroke-red-500"
                                        filter={isActive ? 'url(#glow)' : ''}
                                    />
                                    {/* Flow Particle */}
                                    {isActive && (
                                        <circle r="3" fill="#fff">
                                            <animateMotion dur="1s" repeatCount="indefinite" path={path} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
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
                        <NodeWidget 
                            key={node.id} 
                            node={node} 
                            selected={selectedNodeId === node.id} 
                            onMouseDown={onNodeMouseDown} 
                            onHandleMouseDown={onHandleMouseDown} 
                            updateNodeConfig={updateNodeConfig}
                            deleteNode={deleteNode}
                        />
                    ))}
                </div>
            </div>

            {/* Minimap */}
            <div className="absolute bottom-6 right-6 z-40 w-48 h-32 bg-[#121214]/80 backdrop-blur border border-white/10 rounded-xl overflow-hidden shadow-2xl pointer-events-none ring-1 ring-black/50">
                <div className="relative w-full h-full opacity-70">
                    {nodes.map(n => (
                        <div 
                            key={n.id} 
                            className={`absolute w-2 h-1.5 rounded-sm ${n.status === 'SUCCESS' ? 'bg-emerald-500' : n.status === 'ERROR' ? 'bg-red-500' : 'bg-zinc-500'}`}
                            style={{
                                left: `${(n.x / 4000) * 100 + 20}%`, // Adjusted scale mapping for demo
                                top: `${(n.y / 3000) * 100 + 20}%`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkflowBuilderPage;
