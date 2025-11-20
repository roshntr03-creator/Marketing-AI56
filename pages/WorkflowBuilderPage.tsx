import React, { useState, useRef, useEffect } from 'react';
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
    QuestionMarkCircleIcon,
    CpuChipIcon
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
    const styles = {
        MODEL_SELECT: { bg: 'from-pink-500/20 to-rose-600/20', border: 'border-pink-500/50', iconColor: 'text-pink-400', glow: 'shadow-pink-500/20' },
        SCENE_GEN: { bg: 'from-indigo-500/20 to-blue-600/20', border: 'border-indigo-500/50', iconColor: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
        PRODUCT_ASSET: { bg: 'from-emerald-500/20 to-teal-600/20', border: 'border-emerald-500/50', iconColor: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
        COMPOSITOR: { bg: 'from-violet-500/20 to-purple-600/20', border: 'border-violet-500/50', iconColor: 'text-violet-400', glow: 'shadow-violet-500/20' },
        VIDEO_GEN: { bg: 'from-orange-500/20 to-amber-600/20', border: 'border-orange-500/50', iconColor: 'text-orange-400', glow: 'shadow-orange-500/20' },
    };

    const icons = {
        MODEL_SELECT: <UserIcon className="w-4 h-4" />,
        SCENE_GEN: <PhotoIcon className="w-4 h-4" />,
        PRODUCT_ASSET: <CubeIcon className="w-4 h-4" />,
        COMPOSITOR: <ArrowsRightLeftIcon className="w-4 h-4" />,
        VIDEO_GEN: <VideoCameraIcon className="w-4 h-4" />,
    };

    const style = styles[type] || styles.MODEL_SELECT;

    return (
        <div className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${style.bg} backdrop-blur-md border-b border-white/5 cursor-grab active:cursor-grabbing node-handle relative overflow-hidden group`}>
            {/* Animated Shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
            
            <div className="flex items-center gap-2.5 relative z-10">
                <div className={`p-1 rounded bg-black/30 backdrop-blur border border-white/10 ${style.iconColor}`}>
                    {icons[type]}
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider font-display drop-shadow-md">{title}</span>
            </div>
            <div className="flex gap-1.5 items-center">
                {status === 'RUNNING' && <span className="text-[10px] font-mono text-indigo-300 animate-pulse mr-2">PROCESSING</span>}
                <div className={`w-2 h-2 rounded-full border border-white/20 shadow-[0_0_10px_currentColor] ${status === 'RUNNING' ? 'bg-indigo-400 text-indigo-400 animate-pulse' : status === 'COMPLETED' ? 'bg-emerald-400 text-emerald-400' : status === 'ERROR' ? 'bg-red-500 text-red-500' : 'bg-zinc-600 text-zinc-600'}`}></div>
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
    
    // Initial nodes
    const [nodes, setNodes] = useState<NodeData[]>([
        { 
            id: 'n_model', type: 'MODEL_SELECT', x: 550, y: 150, title: 'Base Model', status: 'IDLE',
            data: { prompt: 'A professional fashion model posing naturally, studio lighting', result: null } 
        },
        { 
            id: 'n_scene', type: 'SCENE_GEN', x: 550, y: 550, title: 'Environment', status: 'IDLE',
            data: { prompt: 'A minimalist luxury marble podium, soft shadows, high key lighting', result: null } 
        },
        { 
            id: 'n_product', type: 'PRODUCT_ASSET', x: 1000, y: 350, title: 'Product Input', status: 'IDLE',
            data: { file: null, preview: null } 
        },
        { 
            id: 'n_comp', type: 'COMPOSITOR', x: 1450, y: 350, title: 'AI Compositor', status: 'IDLE',
            data: { prompt: 'Place the product naturally in the scene, ensuring realistic shadows and lighting matches.', result: null } 
        },
        { 
            id: 'n_video', type: 'VIDEO_GEN', x: 1900, y: 350, title: 'Motion Gen', status: 'IDLE',
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
        setViewport(prev => ({ ...prev, zoom: newZoom }));
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
            setViewport(prev => ({ ...prev, x: prev.x + e.movementX, y: prev.y + e.movementY }));
        } else if (draggingNode) {
            setNodes(prev => prev.map(n => {
                if (n.id === draggingNode) {
                    return { ...n, x: n.x + e.movementX / viewport.zoom, y: n.y + e.movementY / viewport.zoom };
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
        setViewport(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
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

        const w = 340; // node width
        const h = 400; // approx node height
        const startX = n1.x + w;
        const startY = n1.y + 80; // Approximate output handle Y
        const endX = n2.x;
        const endY = n2.y + 80; // Approximate input handle Y

        const dist = Math.abs(endX - startX);
        const cp1x = startX + dist * 0.5;
        const cp2x = endX - dist * 0.5;

        const pathData = `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;
        
        const isActive = n1.status === 'COMPLETED';
        const isError = n1.status === 'ERROR';

        return (
            <g key={conn.id}>
                {/* Glow underlying stroke */}
                <path d={pathData} stroke={isActive ? "rgba(99,102,241,0.4)" : "transparent"} strokeWidth="12" fill="none" className="transition-all duration-500" style={{filter: 'blur(6px)'}} />
                {/* Background stroke */}
                <path d={pathData} stroke="#18181b" strokeWidth="6" fill="none" />
                {/* Main connection line */}
                <path d={pathData} stroke={isActive ? "url(#gradientStroke)" : "#3f3f46"} strokeWidth="3" fill="none" className="transition-all duration-500" />
                
                {/* Animated particles for active flows */}
                {isActive && (
                     <circle r="3" fill="#fff">
                        <animateMotion dur="1.5s" repeatCount="indefinite" path={pathData} calcMode="linear" keyPoints="0;1" keyTimes="0;1" />
                     </circle>
                )}
            </g>
        );
    };

    return (
        <div className="relative w-full h-[calc(100vh-4rem)] bg-[#020203] overflow-hidden select-none font-sans">
            
            {/* Toolbar - Collapsible Floating Island */}
            <div className="absolute top-8 left-8 z-50 flex flex-col gap-4">
                <div className={`bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out overflow-hidden ${isToolbarCollapsed ? 'w-14 h-14 p-0 flex items-center justify-center cursor-pointer hover:bg-zinc-800' : 'p-6 w-80'}`}>
                    {isToolbarCollapsed ? (
                        <button onClick={() => setIsToolbarCollapsed(false)} title="Show Info" className="w-full h-full flex items-center justify-center">
                            <CpuChipIcon className="w-6 h-6 text-indigo-400" />
                        </button>
                    ) : (
                        <div className="relative animate-fade-in">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 text-indigo-400">
                                        <CpuChipIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h1 className="font-bold text-white text-lg font-display tracking-tight">Workflow OS</h1>
                                        <p className="text-[10px] text-indigo-300 font-mono uppercase tracking-wider">v2.4.0 • Connected</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsToolbarCollapsed(true)} className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
                                    <MinusIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                        <span>GPU Usage</span>
                                        <span className="text-white">32%</span>
                                    </div>
                                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full w-[32%] bg-indigo-500 rounded-full"></div>
                                    </div>
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Design your generation pipeline. Drag to pan, scroll to zoom. Connect nodes to chain AI models.
                                </p>
                            </div>
                            <div className="mt-6 flex gap-2">
                                <Button size="sm" variant="secondary" onClick={() => setViewport({x: 0, y: 0, zoom: 1})} className="w-full justify-center bg-white/5 border-white/10 hover:bg-white/10 text-xs">
                                    <ArrowPathIcon className="w-3.5 h-3.5 mr-2" /> Recenter
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation & Zoom Controls (Bottom Right) - Floating Glass */}
            <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-4 items-end">
                 <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl shadow-2xl flex flex-col gap-1 items-center">
                     <button onClick={() => setViewport(p => ({...p, zoom: Math.min(p.zoom + 0.1, 2)}))} className="p-2.5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors">
                        <MagnifyingGlassPlusIcon className="w-5 h-5" />
                     </button>
                     <div className="w-8 h-px bg-white/10"></div>
                     <span className="text-[10px] font-mono text-zinc-500 py-1 select-none">{Math.round(viewport.zoom * 100)}%</span>
                     <div className="w-8 h-px bg-white/10"></div>
                     <button onClick={() => setViewport(p => ({...p, zoom: Math.max(p.zoom - 0.1, 0.2)}))} className="p-2.5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors">
                        <MagnifyingGlassMinusIcon className="w-5 h-5" />
                     </button>
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
                    className="origin-top-left w-full h-full transition-transform duration-100 ease-out will-change-transform"
                    style={{
                        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`
                    }}
                >
                    {/* SVG Gradients Definition */}
                    <svg className="absolute w-0 h-0">
                        <defs>
                            <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#818cf8" />
                                <stop offset="100%" stopColor="#c084fc" />
                            </linearGradient>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                            </pattern>
                        </defs>
                    </svg>

                    {/* Technical Background */}
                    <div 
                        className="absolute -top-[10000px] -left-[10000px] w-[20000px] h-[20000px] pointer-events-none"
                        style={{
                            backgroundColor: '#050505',
                            backgroundImage: 'radial-gradient(#27272a 1px, transparent 1px), radial-gradient(#18181b 1px, transparent 1px)',
                            backgroundSize: '40px 40px, 200px 200px',
                            backgroundPosition: '0 0, 20px 20px'
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
                                className={`absolute w-[340px] bg-[#09090b]/80 backdrop-blur-xl border rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] flex flex-col transition-all duration-300 group ${node.status === 'RUNNING' ? 'border-indigo-500/50 ring-1 ring-indigo-500/30' : node.status === 'ERROR' ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-white/10 hover:border-white/20'}`}
                                style={{ 
                                    transform: `translate(${node.x}px, ${node.y}px)`,
                                    zIndex: draggingNode === node.id ? 100 : 10 
                                }}
                            >
                                <NodeHeader type={node.type} title={node.title} status={node.status} />
                                
                                <div className="p-5 space-y-5 relative">
                                    {node.errorMessage && (
                                        <div className="bg-red-950/30 border border-red-500/20 p-3 rounded-lg flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                                            <span className="text-[10px] text-red-300 leading-relaxed font-mono">{node.errorMessage}</span>
                                        </div>
                                    )}

                                    {(node.type === 'SCENE_GEN' || node.type === 'MODEL_SELECT') && (
                                        <>
                                            <div>
                                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block font-mono">Prompt Logic</label>
                                                <Textarea 
                                                    value={node.data.prompt} 
                                                    onChange={(e) => updateNodeData(node.id, { prompt: e.target.value })}
                                                    className="text-xs bg-black/50 min-h-[80px] border-white/5 resize-y rounded-lg text-zinc-300 font-mono leading-relaxed focus:border-white/10 focus:bg-black/80 transition-colors"
                                                    placeholder="Enter generation parameters..."
                                                />
                                            </div>
                                            {node.data.result ? (
                                                <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-black/50 aspect-video">
                                                    <img src={node.data.result} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                        <a href={node.data.result} target="_blank" rel="noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors border border-white/10">
                                                            <ArrowsPointingOutIcon className="w-5 h-5 text-white" />
                                                        </a>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="aspect-video bg-black/20 rounded-lg border border-white/5 flex items-center justify-center border-dashed group-hover:border-white/10 transition-colors">
                                                    <SparklesIcon className="w-6 h-6 text-zinc-800" />
                                                </div>
                                            )}
                                            <Button 
                                                size="sm" 
                                                onClick={() => runImageGen(node)} 
                                                isLoading={node.status === 'RUNNING'} 
                                                className={`w-full py-2.5 text-xs font-medium ${node.status === 'COMPLETED' ? 'bg-zinc-800 border-white/5 text-zinc-300 hover:bg-zinc-700' : 'shadow-lg shadow-indigo-500/10'}`}
                                            >
                                                {node.status === 'COMPLETED' ? <span className="flex items-center"><ArrowPathIcon className="w-3 h-3 mr-2"/> Regenerate</span> : 'Execute Node'}
                                            </Button>
                                        </>
                                    )}

                                    {node.type === 'PRODUCT_ASSET' && (
                                        <>
                                            <div className="relative group">
                                                {node.data.preview ? (
                                                    <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black/50">
                                                        <img src={node.data.preview} className="w-full h-48 object-contain p-4" />
                                                        <div className="absolute top-2 right-2">
                                                            <button 
                                                                className="p-1.5 bg-black/60 backdrop-blur rounded-lg border border-white/10 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateNodeData(node.id, { file: null, preview: null });
                                                                    updateNode(node.id, { status: 'IDLE' });
                                                                }}
                                                            >
                                                                <ArrowPathIcon className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="h-48 bg-black/20 rounded-xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-black/40 hover:border-indigo-500/30 transition-all cursor-pointer group/upload">
                                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover/upload:scale-110 transition-transform duration-300">
                                                            <ArrowUpOnSquareIcon className="w-5 h-5 text-zinc-500 group-hover/upload:text-indigo-400" />
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="text-xs text-zinc-300 font-medium block">Upload Asset</span>
                                                            <span className="text-[10px] text-zinc-600">PNG, JPG, WEBP</span>
                                                        </div>
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
                                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block font-mono">Merge Instructions</label>
                                                <Textarea 
                                                    value={node.data.prompt} 
                                                    onChange={(e) => updateNodeData(node.id, { prompt: e.target.value })}
                                                    className="text-xs bg-black/50 min-h-[60px] border-white/5 rounded-lg font-mono"
                                                    placeholder="Instructions..."
                                                />
                                            </div>
                                            {node.data.result ? (
                                                 <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-black/50 aspect-video">
                                                    <img src={node.data.result} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="aspect-video bg-black/20 rounded-lg flex flex-col items-center justify-center text-zinc-700 text-[10px] font-bold tracking-widest border border-white/5 border-dashed">
                                                    <ArrowsRightLeftIcon className="w-6 h-6 mb-2 opacity-20" />
                                                    <span>AWAITING SIGNALS</span>
                                                </div>
                                            )}
                                            <Button size="sm" onClick={() => runCompositor(node)} isLoading={node.status === 'RUNNING'} className="w-full py-2.5 text-xs font-medium shadow-lg shadow-violet-500/10">
                                                Initialize Merge
                                            </Button>
                                        </>
                                    )}

                                    {node.type === 'VIDEO_GEN' && (
                                        <>
                                            <div>
                                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block font-mono">Camera Control</label>
                                                <Textarea 
                                                    value={node.data.prompt} 
                                                    onChange={(e) => updateNodeData(node.id, { prompt: e.target.value })}
                                                    className="text-xs bg-black/50 min-h-[60px] border-white/5 rounded-lg font-mono"
                                                />
                                            </div>
                                             {node.data.result ? (
                                                <video src={node.data.result} controls autoPlay loop className="w-full h-40 object-cover rounded-lg border border-white/10 bg-black" />
                                            ) : (
                                                <div className="h-40 bg-black/20 rounded-lg flex items-center justify-center text-zinc-700 text-[10px] font-bold tracking-widest border border-white/5 border-dashed">
                                                    <VideoCameraIcon className="w-8 h-8 mb-2 opacity-20" />
                                                </div>
                                            )}
                                            <Button size="sm" onClick={() => runVideoGen(node)} isLoading={node.status === 'RUNNING'} className="w-full py-2.5 text-xs font-medium shadow-lg shadow-orange-500/10">
                                                <PlayIcon className="w-3 h-3 mr-2" /> Render Sequence
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {/* Connection Ports - Styled */}
                                <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-zinc-800 rounded-full border-2 border-zinc-600 hover:bg-white hover:border-indigo-500 hover:scale-125 transition-all cursor-pointer shadow-lg" title="Input"></div>
                                <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 bg-zinc-800 rounded-full border-2 border-zinc-600 hover:bg-white hover:border-indigo-500 hover:scale-125 transition-all cursor-pointer shadow-lg" title="Output"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkflowBuilderPage;