
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { 
    PhotoIcon, 
    VideoCameraIcon, 
    SparklesIcon, 
    CubeIcon, 
    ArrowUpOnSquareIcon, 
    PlayIcon,
    ArrowsRightLeftIcon,
    UserIcon,
    MagnifyingGlassMinusIcon,
    MagnifyingGlassPlusIcon,
    ArrowsPointingOutIcon,
    ArrowPathIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MinusIcon,
    QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import aiService from '../services/aiService';

// --- Types ---
type NodeType = 'MODEL_SELECT' | 'SCENE_GEN' | 'PRODUCT_ASSET' | 'COMPOSITOR' | 'VIDEO_GEN';

interface NodeData {
    id: string;
    type: NodeType;
    x: number;
    y: number;
    title: string;
    data: any;
    status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'ERROR';
    errorMessage?: string;
}

interface Connection {
    id: string;
    from: string;
    to: string;
}

interface Viewport {
    x: number;
    y: number;
    zoom: number;
}

// --- Visual Components ---

const NodeHeader: React.FC<{ type: NodeType; title: string; status: string }> = ({ type, title, status }) => {
    const colors = {
        MODEL_SELECT: 'bg-pink-600 border-pink-500',
        SCENE_GEN: 'bg-indigo-600 border-indigo-500',
        PRODUCT_ASSET: 'bg-emerald-600 border-emerald-500',
        COMPOSITOR: 'bg-violet-600 border-violet-500',
        VIDEO_GEN: 'bg-orange-600 border-orange-500',
    };
    const icons = {
        MODEL_SELECT: <UserIcon className="w-4 h-4 text-white" />,
        SCENE_GEN: <PhotoIcon className="w-4 h-4 text-white" />,
        PRODUCT_ASSET: <CubeIcon className="w-4 h-4 text-white" />,
        COMPOSITOR: <ArrowsRightLeftIcon className="w-4 h-4 text-white" />,
        VIDEO_GEN: <VideoCameraIcon className="w-4 h-4 text-white" />,
    };

    return (
        <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl border-b border-white/10 cursor-grab active:cursor-grabbing node-handle transition-colors ${colors[type] || 'bg-zinc-700'}`}>
            <div className="flex items-center gap-2">
                {icons[type]}
                <span className="text-xs font-bold text-white uppercase tracking-wider">{title}</span>
            </div>
            <div className="flex gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full border border-black/20 ${status === 'RUNNING' ? 'bg-yellow-400 animate-pulse' : status === 'COMPLETED' ? 'bg-white' : status === 'ERROR' ? 'bg-red-500' : 'bg-black/20'}`}></div>
            </div>
        </div>
    );
};

const WorkflowBuilderPage: React.FC = () => {
    const { addCreation } = useAppContext();
    const containerRef = useRef<HTMLDivElement>(null);
    
    // --- State ---
    const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
    const [isPanning, setIsPanning] = useState(false);
    const [draggingNode, setDraggingNode] = useState<string | null>(null);
    const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);
    
    // Initial nodes moved further right (x: 550) and down (y: 150) to avoid overlapping with the top-left toolbar
    const [nodes, setNodes] = useState<NodeData[]>([
        { 
            id: 'n_model', type: 'MODEL_SELECT', x: 550, y: 150, title: 'Select Model', status: 'IDLE',
            data: { prompt: 'A professional fashion model posing naturally, studio lighting', result: null } 
        },
        { 
            id: 'n_scene', type: 'SCENE_GEN', x: 550, y: 550, title: 'Scene Generator', status: 'IDLE',
            data: { prompt: 'A minimalist luxury marble podium, soft shadows, high key lighting', result: null } 
        },
        { 
            id: 'n_product', type: 'PRODUCT_ASSET', x: 1000, y: 350, title: 'Product Object', status: 'IDLE',
            data: { file: null, preview: null } 
        },
        { 
            id: 'n_comp', type: 'COMPOSITOR', x: 1450, y: 350, title: 'Composition Engine', status: 'IDLE',
            data: { prompt: 'Place the product naturally in the scene, ensuring realistic shadows and lighting matches.', result: null } 
        },
        { 
            id: 'n_video', type: 'VIDEO_GEN', x: 1900, y: 350, title: 'Video Result', status: 'IDLE',
            data: { prompt: 'Cinematic slow motion camera orbit around the product', result: null } 
        }
    ]);

    const [connections] = useState<Connection[]>([
        { id: 'c1', from: 'n_model', to: 'n_product' },
        { id: 'c2', from: 'n_scene', to: 'n_product' },
        { id: 'c3', from: 'n_product', to: 'n_comp' },
        { id: 'c4', from: 'n_comp', to: 'n_video' }
    ]);

    // --- Viewport Handlers ---

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const scaleFactor = 0.001;
        const newZoom = Math.min(Math.max(viewport.zoom - e.deltaY * scaleFactor, 0.2), 2);
        
        setViewport(prev => ({
            ...prev,
            zoom: newZoom
        }));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.node-handle')) {
            const nodeId = (e.target as HTMLElement).closest('[data-node-id]')?.getAttribute('data-node-id');
            if (nodeId) setDraggingNode(nodeId);
            return;
        }
        
        if ((e.target as HTMLElement).closest('input, textarea, button')) return;

        setIsPanning(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            setViewport(prev => ({
                ...prev,
                x: prev.x + e.movementX,
                y: prev.y + e.movementY
            }));
        } else if (draggingNode) {
            setNodes(prev => prev.map(n => {
                if (n.id === draggingNode) {
                    return {
                        ...n,
                        x: n.x + e.movementX / viewport.zoom,
                        y: n.y + e.movementY / viewport.zoom
                    };
                }
                return n;
            }));
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
        setDraggingNode(null);
    };

    const pan = (dx: number, dy: number) => {
        setViewport(prev => ({
            ...prev,
            x: prev.x + dx,
            y: prev.y + dy
        }));
    };

    // --- Helper Functions ---

    const updateNode = (id: string, updates: Partial<NodeData>) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    };

    const updateNodeData = (id: string, data: any) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n));
    };

    const getInputs = (nodeId: string) => {
        return connections
            .filter(c => c.to === nodeId)
            .map(c => nodes.find(n => n.id === c.from))
            .filter(Boolean) as NodeData[];
    };

    // --- Execution Logic ---

    const runImageGen = async (node: NodeData) => {
        if (!node.data.prompt) return;
        updateNode(node.id, { status: 'RUNNING', errorMessage: undefined });
        
        try {
            const url = await aiService.generateImage(node.data.prompt, '1:1');
            updateNodeData(node.id, { result: url });
            updateNode(node.id, { status: 'COMPLETED' });
        } catch (e) {
            console.error(e);
            updateNode(node.id, { status: 'ERROR', errorMessage: 'Generation failed' });
        }
    };

    const runCompositor = async (node: NodeData) => {
        const inputNodes = getInputs(node.id);
        const productNode = inputNodes.find(n => n.type === 'PRODUCT_ASSET');
        
        let bgNode: NodeData | undefined;
        
        if (productNode) {
             const productInputs = getInputs(productNode.id);
             bgNode = productInputs.find(n => (n.type === 'SCENE_GEN' || n.type === 'MODEL_SELECT') && n.data.result);
        }

        if (!productNode?.data.preview) {
            updateNode(node.id, { status: 'ERROR', errorMessage: "Missing Product Image" });
            return;
        }
        
        if (!bgNode?.data.result) {
            const directBg = inputNodes.find(n => (n.type === 'SCENE_GEN' || n.type === 'MODEL_SELECT') && n.data.result);
            if (directBg) {
                bgNode = directBg;
            } else {
                updateNode(node.id, { status: 'ERROR', errorMessage: "Missing Background (Scene/Model)" });
                return;
            }
        }

        updateNode(node.id, { status: 'RUNNING', errorMessage: undefined });
        
        try {
            const bgUrl = bgNode.data.result;
            const fgUrl = productNode.data.preview;

            let realBgBase64 = bgUrl.includes(',') ? bgUrl.split(',')[1] : bgUrl;
            if (bgUrl.startsWith('http')) {
                const resp = await fetch(bgUrl);
                const blob = await resp.blob();
                realBgBase64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                    reader.readAsDataURL(blob);
                });
            }
            
            const fgBase64 = fgUrl.split(',')[1];
            
            const url = await aiService.compositeImages(realBgBase64, fgBase64, node.data.prompt);
            updateNodeData(node.id, { result: url });
            updateNode(node.id, { status: 'COMPLETED' });
        } catch (e) {
            console.error(e);
            updateNode(node.id, { status: 'ERROR', errorMessage: "Composition Failed" });
        }
    };

    const runVideoGen = async (node: NodeData) => {
        const inputNodes = getInputs(node.id);
        const compNode = inputNodes.find(n => n.type === 'COMPOSITOR');
        
        if (!compNode?.data.result) {
            updateNode(node.id, { status: 'ERROR', errorMessage: "Waiting for Composite" });
            return;
        }
        
        updateNode(node.id, { status: 'RUNNING', errorMessage: undefined });
        
        try {
             const videoUrl = await aiService.generatePromoVideo({
                 prompt: node.data.prompt,
                 duration: '5s',
                 aspectRatio: '1:1'
             });
             
             updateNodeData(node.id, { result: videoUrl });
             updateNode(node.id, { status: 'COMPLETED' });
             
             addCreation({
                 type: 'PROMO_VIDEO',
                 title: 'Workflow Result',
                 params: { prompt: node.data.prompt },
                 status: 'Completed',
                 resultUrl: videoUrl
             });

        } catch (e) {
            console.error(e);
            updateNode(node.id, { status: 'ERROR', errorMessage: "Generation Failed" });
        }
    };

    const renderConnection = (conn: Connection) => {
        const n1 = nodes.find(n => n.id === conn.from);
        const n2 = nodes.find(n => n.id === conn.to);
        if (!n1 || !n2) return null;

        const w = 320;
        const startX = n1.x + w;
        const startY = n1.y + 80;
        const endX = n2.x;
        const endY = n2.y + 80;

        const dist = Math.abs(endX - startX);
        const cp1x = startX + dist * 0.5;
        const cp2x = endX - dist * 0.5;

        const pathData = `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;
        
        const isActive = n1.status === 'COMPLETED';

        return (
            <g key={conn.id}>
                <path d={pathData} stroke="rgba(0,0,0,0.5)" strokeWidth="6" fill="none" />
                <path d={pathData} stroke="#3f3f46" strokeWidth="3" fill="none" />
                <path 
                    d={pathData} 
                    stroke={isActive ? '#6366f1' : 'transparent'} 
                    strokeWidth="3" 
                    fill="none" 
                    className="transition-all duration-1000"
                    strokeDasharray={isActive ? "10,5" : "0"}
                >
                    {isActive && <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />}
                </path>
            </g>
        );
    };

    return (
        <div className="relative w-full h-[calc(100vh-4rem)] bg-[#050505] overflow-hidden select-none">
            
            {/* Toolbar - Collapsible */}
            <div className="absolute top-6 left-6 z-50 flex flex-col gap-4">
                <div className={`bg-zinc-900/90 backdrop-blur border border-white/10 rounded-2xl shadow-2xl max-w-xs transition-all duration-300 overflow-hidden ${isToolbarCollapsed ? 'w-12 h-12 p-0 flex items-center justify-center cursor-pointer' : 'p-5 w-80'}`}>
                    {isToolbarCollapsed ? (
                        <button onClick={() => setIsToolbarCollapsed(false)} title="Show Info">
                            <QuestionMarkCircleIcon className="w-6 h-6 text-indigo-500" />
                        </button>
                    ) : (
                        <div className="relative">
                            <div className="flex justify-between items-start mb-2">
                                <h1 className="font-bold text-white text-xl font-display">Visual Builder</h1>
                                <button onClick={() => setIsToolbarCollapsed(true)} className="text-zinc-500 hover:text-white">
                                    <MinusIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                                Pan (Drag BG or use Controls), Zoom (Scroll), and Move Nodes to build your pipeline.
                            </p>
                            <div className="flex gap-2">
                                <Button size="sm" variant="secondary" onClick={() => setViewport({x: 0, y: 0, zoom: 1})}>
                                    <ArrowPathIcon className="w-4 h-4 mr-1" /> Reset View
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation & Zoom Controls (Bottom Right) */}
            <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-4 items-end">
                 {/* Zoom */}
                 <div className="bg-zinc-900/90 backdrop-blur border border-white/10 p-2 rounded-xl shadow-xl flex flex-col gap-2 items-center">
                     <button onClick={() => setViewport(p => ({...p, zoom: Math.min(p.zoom + 0.1, 2)}))} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                        <MagnifyingGlassPlusIcon className="w-5 h-5" />
                     </button>
                     <span className="text-[10px] font-mono text-zinc-500 select-none">{Math.round(viewport.zoom * 100)}%</span>
                     <button onClick={() => setViewport(p => ({...p, zoom: Math.max(p.zoom - 0.1, 0.2)}))} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                        <MagnifyingGlassMinusIcon className="w-5 h-5" />
                     </button>
                </div>

                {/* D-Pad Navigation */}
                <div className="bg-zinc-900/90 backdrop-blur border border-white/10 p-3 rounded-full shadow-xl grid grid-cols-3 gap-1 w-32 h-32">
                     <div className="col-start-2 flex items-center justify-center">
                        <button onClick={() => pan(0, 100)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Pan Up">
                            <ChevronUpIcon className="w-6 h-6" />
                        </button>
                     </div>
                     <div className="col-start-1 row-start-2 flex items-center justify-center">
                        <button onClick={() => pan(100, 0)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Pan Left">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                     </div>
                     <div className="col-start-2 row-start-2 flex items-center justify-center">
                        <div className="w-8 h-8 flex items-center justify-center text-zinc-600">
                            <ArrowsPointingOutIcon className="w-5 h-5"/>
                        </div>
                     </div>
                     <div className="col-start-3 row-start-2 flex items-center justify-center">
                        <button onClick={() => pan(-100, 0)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Pan Right">
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                     </div>
                     <div className="col-start-2 row-start-3 flex items-center justify-center">
                        <button onClick={() => pan(0, -100)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Pan Down">
                            <ChevronDownIcon className="w-6 h-6" />
                        </button>
                     </div>
                </div>
            </div>

            {/* Canvas Area */}
            <div 
                ref={containerRef}
                className={`w-full h-full cursor-default ${isPanning ? 'cursor-grabbing' : ''}`}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div 
                    className="origin-top-left w-full h-full transition-transform duration-75 ease-out will-change-transform"
                    style={{
                        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`
                    }}
                >
                    {/* Infinite Grid Background */}
                    <div 
                        className="absolute -top-[10000px] -left-[10000px] w-[20000px] h-[20000px] pointer-events-none opacity-20"
                        style={{
                            backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }}
                    ></div>

                    {/* Connections Layer */}
                    <svg className="absolute -top-[10000px] -left-[10000px] w-[20000px] h-[20000px] pointer-events-none overflow-visible" style={{zIndex: 0}}>
                        <g transform="translate(10000, 10000)">
                             {connections.map(renderConnection)}
                        </g>
                    </svg>

                    {/* Nodes Layer */}
                    <div className="absolute top-0 left-0 w-0 h-0" style={{zIndex: 10}}>
                        {nodes.map(node => (
                            <div
                                key={node.id}
                                data-node-id={node.id}
                                className={`absolute w-[320px] bg-zinc-900 border rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex flex-col transition-shadow duration-200 ${node.status === 'RUNNING' ? 'border-indigo-500 ring-2 ring-indigo-500/20' : node.status === 'ERROR' ? 'border-red-500/50' : 'border-white/10'}`}
                                style={{ 
                                    transform: `translate(${node.x}px, ${node.y}px)`,
                                    zIndex: draggingNode === node.id ? 100 : 10 
                                }}
                            >
                                <NodeHeader type={node.type} title={node.title} status={node.status} />
                                
                                <div className="p-4 space-y-4 relative">
                                    {node.errorMessage && (
                                        <div className="bg-red-500/10 border border-red-500/20 p-2 rounded text-[10px] text-red-400 mb-2">
                                            Error: {node.errorMessage}
                                        </div>
                                    )}

                                    {(node.type === 'SCENE_GEN' || node.type === 'MODEL_SELECT') && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Prompt Configuration</label>
                                                <Textarea 
                                                    value={node.data.prompt} 
                                                    onChange={(e) => updateNodeData(node.id, { prompt: e.target.value })}
                                                    className="text-xs bg-zinc-950 min-h-[80px] border-white/5 resize-y"
                                                    placeholder="Describe generation..."
                                                />
                                            </div>
                                            {node.data.result ? (
                                                <div className="relative group rounded-lg overflow-hidden border border-white/10">
                                                    <img src={node.data.result} className="w-full h-32 object-cover" />
                                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                                        <a href={node.data.result} target="_blank" rel="noreferrer">
                                                            <ArrowsPointingOutIcon className="w-5 h-5 text-white drop-shadow-md" />
                                                        </a>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-32 bg-zinc-950 rounded-lg border border-white/5 flex items-center justify-center border-dashed">
                                                    <SparklesIcon className="w-6 h-6 text-zinc-800" />
                                                </div>
                                            )}
                                            <Button 
                                                size="sm" 
                                                onClick={() => runImageGen(node)} 
                                                isLoading={node.status === 'RUNNING'} 
                                                className={`w-full ${node.status === 'COMPLETED' ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : ''}`}
                                            >
                                                {node.status === 'COMPLETED' ? 'Regenerate' : 'Generate'}
                                            </Button>
                                        </>
                                    )}

                                    {node.type === 'PRODUCT_ASSET' && (
                                        <>
                                            <div className="relative group">
                                                {node.data.preview ? (
                                                    <div className="relative rounded-lg overflow-hidden border border-white/10">
                                                        <img src={node.data.preview} className="w-full h-48 object-contain bg-zinc-950/50 p-2" />
                                                        <button 
                                                            className="absolute top-2 right-2 bg-zinc-900/80 p-1 rounded hover:bg-red-500/20 hover:text-red-400 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateNodeData(node.id, { file: null, preview: null });
                                                                updateNode(node.id, { status: 'IDLE' });
                                                            }}
                                                        >
                                                            <ArrowPathIcon className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="h-48 bg-zinc-950 rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-zinc-900/50 hover:border-emerald-500/30 transition-all cursor-pointer">
                                                        <ArrowUpOnSquareIcon className="w-8 h-8 text-zinc-700" />
                                                        <span className="text-xs text-zinc-500 font-medium">Upload Product</span>
                                                        <input 
                                                            type="file" 
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                if (e.target.files?.[0]) {
                                                                    updateNodeData(node.id, { 
                                                                        file: e.target.files[0],
                                                                        preview: URL.createObjectURL(e.target.files[0])
                                                                    });
                                                                    updateNode(node.id, { status: 'COMPLETED', errorMessage: undefined });
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {node.type === 'COMPOSITOR' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Compositing Logic</label>
                                                <Textarea 
                                                    value={node.data.prompt} 
                                                    onChange={(e) => updateNodeData(node.id, { prompt: e.target.value })}
                                                    className="text-xs bg-zinc-950 min-h-[60px] border-white/5"
                                                    placeholder="Instructions..."
                                                />
                                            </div>
                                            {node.data.result ? (
                                                 <div className="relative group rounded-lg overflow-hidden border border-white/10">
                                                    <img src={node.data.result} className="w-full h-32 object-cover" />
                                                </div>
                                            ) : (
                                                <div className="h-32 bg-zinc-950 rounded-lg flex flex-col items-center justify-center text-zinc-700 text-xs font-medium tracking-wider border border-white/5 border-dashed">
                                                    <ArrowsRightLeftIcon className="w-6 h-6 mb-2 opacity-20" />
                                                    <span>WAITING FOR INPUTS</span>
                                                </div>
                                            )}
                                            <Button size="sm" onClick={() => runCompositor(node)} isLoading={node.status === 'RUNNING'} className="w-full">
                                                Run Composition
                                            </Button>
                                        </>
                                    )}

                                    {node.type === 'VIDEO_GEN' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Motion Prompt</label>
                                                <Textarea 
                                                    value={node.data.prompt} 
                                                    onChange={(e) => updateNodeData(node.id, { prompt: e.target.value })}
                                                    className="text-xs bg-zinc-950 min-h-[60px] border-white/5"
                                                />
                                            </div>
                                             {node.data.result ? (
                                                <video src={node.data.result} controls autoPlay loop className="w-full h-40 object-cover rounded-lg border border-white/10" />
                                            ) : (
                                                <div className="h-40 bg-zinc-950 rounded-lg flex items-center justify-center text-zinc-700 text-xs font-medium tracking-wider border border-white/5 border-dashed">
                                                    <VideoCameraIcon className="w-8 h-8 mb-2 opacity-20" />
                                                </div>
                                            )}
                                            <Button size="sm" onClick={() => runVideoGen(node)} isLoading={node.status === 'RUNNING'} className="w-full">
                                                <PlayIcon className="w-3 h-3 mr-2" /> Generate Video
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {/* Connection Ports */}
                                <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-zinc-500 rounded-full border-2 border-zinc-900 hover:bg-white transition-colors cursor-pointer" title="Input"></div>
                                <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-zinc-500 rounded-full border-2 border-zinc-900 hover:bg-white transition-colors cursor-pointer" title="Output"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkflowBuilderPage;
