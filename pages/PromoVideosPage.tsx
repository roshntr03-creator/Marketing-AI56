
import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/ui/Button';
import { Textarea, Input } from '../components/ui/Input';
import { 
    SparklesIcon, 
    FilmIcon, 
    ArrowDownTrayIcon,
    TvIcon,
    DevicePhoneMobileIcon,
    Square2StackIcon,
    BoltIcon,
    SwatchIcon,
    Cog6ToothIcon,
    CpuChipIcon,
    VideoCameraIcon,
    NoSymbolIcon,
    AdjustmentsHorizontalIcon,
    PlayIcon,
    PauseIcon,
    StopIcon,
    PencilSquareIcon,
    TrashIcon,
    SpeakerWaveIcon,
    PlusIcon,
    ScissorsIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import aiService from '../services/aiService';

const VIDEO_MODELS = [
    { id: 'sora-2-text-to-video', name: 'Sora 2 (Kie)', desc: 'State-of-the-art realism (10s, 15s)' },
    { id: 'grok-imagine/text-to-video', name: 'Grok 3 (Video)', desc: 'Creative video generation (6s)' },
];

const STYLES = [
    { id: 'Cinematic', label: 'Cinematic', color: 'from-slate-900 to-slate-800', desc: 'High contrast, movie-like quality' },
    { id: '3D Render', label: '3D Animation', color: 'from-indigo-900 to-purple-900', desc: 'Clean, Pixar-style geometry' },
    { id: 'Cyberpunk', label: 'Cyberpunk', color: 'from-pink-900 to-rose-900', desc: 'Neon lights, futuristic grit' },
    { id: 'Analog Film', label: 'Vintage Film', color: 'from-amber-900/40 to-orange-900/40', desc: 'Grainy, nostalgic aesthetic' },
    { id: 'Minimalist', label: 'Minimalist', color: 'from-gray-800 to-gray-900', desc: 'Clean lines, solid colors' },
    { id: 'Nature', label: 'Nature', color: 'from-emerald-900 to-teal-900', desc: 'Organic, natural lighting' },
];

const MODEL_DURATIONS: Record<string, string[]> = {
    'sora-2-text-to-video': ['10s', '15s'],
    'grok-imagine/text-to-video': ['6s'],
};

const ASPECT_RATIOS = [
    { id: '16:9', label: 'Landscape', icon: <TvIcon className="w-4 h-4"/> },
    { id: '9:16', label: 'Portrait', icon: <DevicePhoneMobileIcon className="w-4 h-4"/> },
    { id: '1:1', label: 'Square', icon: <Square2StackIcon className="w-4 h-4"/> },
];

type Tab = 'Vision' | 'Camera' | 'Style' | 'Settings';
type EditorFilter = 'none' | 'grayscale' | 'sepia' | 'high-contrast' | 'warm' | 'cool';

interface TextOverlay {
    id: string;
    text: string;
    x: number;
    y: number;
    color: string;
}

// Key for session storage
const STORAGE_KEY = 'promo_video_page_state';

const PromoVideosPage: React.FC = () => {
    const { addCreation, creations } = useAppContext();
    
    // --- Generator State ---
    const [activeTab, setActiveTab] = useState<Tab>('Vision');
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [style, setStyle] = useState(STYLES[0].id);
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [selectedModel, setSelectedModel] = useState(VIDEO_MODELS[0].id);
    const [duration, setDuration] = useState(MODEL_DURATIONS[VIDEO_MODELS[0].id][0]);
    const [seed, setSeed] = useState<string>('');
    
    // Camera Control State
    const [cameraZoom, setCameraZoom] = useState('None');
    const [cameraPan, setCameraPan] = useState('None');
    const [cameraTilt, setCameraTilt] = useState('None');

    // --- Processing State ---
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [currentJobId, setCurrentJobId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [loadingStage, setLoadingStage] = useState('Initializing');
    
    // --- Editor State ---
    const [editorMode, setEditorMode] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [overlays, setOverlays] = useState<TextOverlay[]>([]);
    const [activeFilter, setActiveFilter] = useState<EditorFilter>('none');
    const [isRenderingEdit, setIsRenderingEdit] = useState(false);
    
    const videoRef = useRef<HTMLVideoElement>(null);

    // Retrieve job status
    const currentJob = creations.find(c => c.id === currentJobId);
    const isGenerating = currentJob?.status === 'Generating' || currentJob?.status === 'Pending';
    const generatedVideoUrl = currentJob?.status === 'Completed' ? currentJob.resultUrl : null;

    // --- 1. Persistence Logic (Load on Mount) ---
    useEffect(() => {
        const savedState = sessionStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                setPrompt(parsed.prompt || '');
                setNegativePrompt(parsed.negativePrompt || '');
                setStyle(parsed.style || STYLES[0].id);
                setAspectRatio(parsed.aspectRatio || '16:9');
                setSelectedModel(parsed.selectedModel || VIDEO_MODELS[0].id);
                setDuration(parsed.duration || '10s');
                setSeed(parsed.seed || '');
                setCameraZoom(parsed.cameraZoom || 'None');
                setCameraPan(parsed.cameraPan || 'None');
                setCameraTilt(parsed.cameraTilt || 'None');
                setOverlays(parsed.overlays || []);
                setActiveFilter(parsed.activeFilter || 'none');
                
                if (parsed.currentJobId) {
                    setCurrentJobId(parsed.currentJobId);
                    const job = creations.find(c => c.id === parsed.currentJobId);
                    if (job?.status === 'Completed') {
                        setEditorMode(true);
                    }
                }
            } catch (e) {
                console.error("Failed to load saved state", e);
            }
        }
    }, [creations]);

    // --- 2. Persistence Logic (Save on Change) ---
    useEffect(() => {
        const stateToSave = {
            prompt, negativePrompt, style, aspectRatio, selectedModel, duration, seed,
            cameraZoom, cameraPan, cameraTilt, currentJobId, overlays, activeFilter
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }, [prompt, negativePrompt, style, aspectRatio, selectedModel, duration, seed, cameraZoom, cameraPan, cameraTilt, currentJobId, overlays, activeFilter]);

    // Update duration when model changes
    useEffect(() => {
        const availableDurations = MODEL_DURATIONS[selectedModel] || ['10s'];
        if (!availableDurations.includes(duration)) {
            setDuration(availableDurations[0]);
        }
    }, [selectedModel]);
    
    // Switch to editor when job completes
    useEffect(() => {
        if (currentJob?.status === 'Completed' && !editorMode) {
            setEditorMode(true);
        }
    }, [currentJob?.status]);

    // Simulation Effect for Progress
    useEffect(() => {
        if (isGenerating) {
            setProgress(0);
            setLoadingStage('Initializing');
            const interval = setInterval(() => {
                setProgress(prev => {
                    const increment = Math.max(0.2, (95 - prev) / 40); 
                    const newProg = prev + Math.random() * increment;
                    if (newProg > 10 && newProg < 30) setLoadingStage('Analyzing Prompt');
                    if (newProg > 30 && newProg < 60) setLoadingStage('Synthesizing Motion');
                    if (newProg > 60 && newProg < 80) setLoadingStage('Rendering Textures');
                    if (newProg > 80) setLoadingStage('Final Polish');
                    return newProg >= 95 ? 95 : newProg;
                });
            }, 200);
            return () => clearInterval(interval);
        } else if (generatedVideoUrl) {
            setProgress(100);
            setLoadingStage('Complete');
        }
    }, [isGenerating, generatedVideoUrl]);

    // Editor: Sync video time
    useEffect(() => {
        const vid = videoRef.current;
        if (!vid) return;
        
        const updateTime = () => setCurrentTime(vid.currentTime);
        const updateDuration = () => setVideoDuration(vid.duration || 0);
        
        vid.addEventListener('timeupdate', updateTime);
        vid.addEventListener('loadedmetadata', updateDuration);
        
        return () => {
            vid.removeEventListener('timeupdate', updateTime);
            vid.removeEventListener('loadedmetadata', updateDuration);
        };
    }, [generatedVideoUrl, editorMode]);

    // Editor: Handle Play/Pause
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleEnhancePrompt = async () => {
        if (!prompt) return;
        setIsEnhancing(true);
        try {
            const result = await aiService.enhancePrompt(prompt);
            if (result.finalPrompt) setPrompt(result.finalPrompt);
            if (result.negativePrompt) setNegativePrompt(result.negativePrompt);
        } catch (error) {
            console.error("Prompt enhancement failed", error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const createJob = () => {
        const jobId = `promo-${Date.now()}`;
        const camera = { zoom: cameraZoom, pan: cameraPan, tilt: cameraTilt };

        addCreation({
            id: jobId,
            type: 'PROMO_VIDEO',
            title: `Promo: ${prompt.substring(0, 30)}...`,
            params: { 
                prompt, negativePrompt, aspectRatio, style, duration, 
                model: selectedModel, camera, seed
            },
            status: 'Pending'
        });
        
        setCurrentJobId(jobId);
        setEditorMode(false); // Reset editor until done
        setOverlays([]);
        setActiveFilter('none');
    };

    // --- Editor Actions ---
    const addTextOverlay = () => {
        setOverlays([...overlays, {
            id: Date.now().toString(),
            text: 'New Text',
            x: 50, y: 50,
            color: '#ffffff'
        }]);
    };

    const removeOverlay = (id: string) => {
        setOverlays(overlays.filter(o => o.id !== id));
    };

    const updateOverlay = (id: string, updates: Partial<TextOverlay>) => {
        setOverlays(overlays.map(o => o.id === id ? { ...o, ...updates } : o));
    };

    const handleExportEdit = async () => {
        if (!generatedVideoUrl) return;
        setIsRenderingEdit(true);
        try {
            // Simulate rendering delay
            await aiService.exportVideoWithEdits(generatedVideoUrl, { overlays, activeFilter });
            alert("Video Rendered Successfully! (Simulated)");
        } finally {
            setIsRenderingEdit(false);
        }
    };

    const availableDurations = MODEL_DURATIONS[selectedModel] || [];

    const getFilterStyle = (filter: EditorFilter) => {
        switch (filter) {
            case 'grayscale': return { filter: 'grayscale(100%)' };
            case 'sepia': return { filter: 'sepia(100%)' };
            case 'high-contrast': return { filter: 'contrast(130%) saturate(120%)' };
            case 'warm': return { filter: 'sepia(30%) saturate(140%) hue-rotate(-10deg)' };
            case 'cool': return { filter: 'saturate(90%) hue-rotate(10deg) brightness(110%)' };
            default: return {};
        }
    };

    return (
        <div className="h-[calc(100vh-9rem)] flex flex-col lg:flex-row gap-6 animate-fade-in pb-2">
            {/* Left Panel: Studio Controls */}
            <div className="w-full lg:w-4/12 flex flex-col h-full bg-[#09090b] border border-white/10 rounded-2xl overflow-hidden shadow-xl relative">
                <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-sm">
                    <div>
                        <h1 className="text-xl font-bold font-display text-white">Promo Studio</h1>
                        <p className="text-zinc-400 text-xs">AI Video Generator & Editor</p>
                    </div>
                </div>

                {/* Generator Tabs */}
                <div className="flex border-b border-white/5 bg-zinc-900/30 overflow-x-auto scrollbar-none">
                    <TabButton active={activeTab === 'Vision'} onClick={() => setActiveTab('Vision')} icon={<SparklesIcon className="w-4 h-4"/>} label="Vision" />
                    <TabButton active={activeTab === 'Camera'} onClick={() => setActiveTab('Camera')} icon={<VideoCameraIcon className="w-4 h-4"/>} label="Camera" />
                    <TabButton active={activeTab === 'Style'} onClick={() => setActiveTab('Style')} icon={<SwatchIcon className="w-4 h-4"/>} label="Style" />
                    <TabButton active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} icon={<Cog6ToothIcon className="w-4 h-4"/>} label="Settings" />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-zinc-900/20 relative p-6">
                    {activeTab === 'Vision' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="space-y-3">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                    <CpuChipIcon className="w-3 h-3"/> AI Model
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {VIDEO_MODELS.map(m => (
                                        <button
                                            key={m.id}
                                            onClick={() => setSelectedModel(m.id)}
                                            className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${selectedModel === m.id ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-zinc-950 border-white/5 text-zinc-400 hover:bg-zinc-900'}`}
                                        >
                                            <span className="block font-semibold">{m.name}</span>
                                            <span className="text-[10px] opacity-70">{m.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end mb-1">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Positive Prompt</label>
                                    <button 
                                        onClick={handleEnhancePrompt}
                                        disabled={!prompt || isEnhancing}
                                        className="text-[10px] flex items-center gap-1 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors px-2 py-1 rounded hover:bg-indigo-500/10"
                                    >
                                        {isEnhancing ? <span className="animate-pulse">Enhancing...</span> : <><BoltIcon className="w-3 h-3" /> Auto-Enhance</>}
                                    </button>
                                </div>
                                <Textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe your video in detail..."
                                    rows={6}
                                    className="relative bg-zinc-950 border-white/10 text-sm focus:border-indigo-500/50 resize-none shadow-inner leading-relaxed p-4 rounded-xl"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                    <NoSymbolIcon className="w-3 h-3"/> Negative Prompt
                                </label>
                                <Textarea
                                    value={negativePrompt}
                                    onChange={(e) => setNegativePrompt(e.target.value)}
                                    placeholder="blur, distortion, watermark, text, low quality..."
                                    rows={3}
                                    className="bg-zinc-950 border-white/10 text-sm focus:border-red-500/30 resize-none shadow-inner p-3 rounded-lg placeholder-zinc-700"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Camera' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 text-center">Camera Director</h3>
                                
                                <div className="mb-6">
                                    <label className="text-[10px] font-medium text-zinc-500 uppercase mb-2 block text-center">Zoom</label>
                                    <div className="flex justify-center gap-2">
                                        {['Zoom In', 'None', 'Zoom Out'].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => setCameraZoom(opt)}
                                                className={`px-3 py-1.5 rounded text-xs border transition-all ${cameraZoom === opt ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-950 border-white/10 text-zinc-400'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <label className="text-[10px] font-medium text-zinc-500 uppercase mb-1">Pan / Tilt</label>
                                    <div className="grid grid-cols-3 gap-1">
                                        <div className="col-start-2">
                                            <button onClick={() => setCameraTilt('Tilt Up')} className={`p-2 rounded border ${cameraTilt === 'Tilt Up' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-950 border-white/10 text-zinc-400'}`} title="Tilt Up">▲</button>
                                        </div>
                                        <div className="col-start-1 row-start-2">
                                            <button onClick={() => setCameraPan('Pan Left')} className={`p-2 rounded border ${cameraPan === 'Pan Left' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-950 border-white/10 text-zinc-400'}`} title="Pan Left">◀</button>
                                        </div>
                                        <div className="col-start-2 row-start-2">
                                            <button 
                                                onClick={() => { setCameraPan('None'); setCameraTilt('None'); }} 
                                                className={`p-2 rounded border font-bold text-xs ${cameraPan === 'None' && cameraTilt === 'None' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-950 border-white/10 text-zinc-400'}`}
                                            >
                                                •
                                            </button>
                                        </div>
                                        <div className="col-start-3 row-start-2">
                                            <button onClick={() => setCameraPan('Pan Right')} className={`p-2 rounded border ${cameraPan === 'Pan Right' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-950 border-white/10 text-zinc-400'}`} title="Pan Right">▶</button>
                                        </div>
                                        <div className="col-start-2 row-start-3">
                                            <button onClick={() => setCameraTilt('Tilt Down')} className={`p-2 rounded border ${cameraTilt === 'Tilt Down' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-950 border-white/10 text-zinc-400'}`} title="Tilt Down">▼</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Style' && (
                            <div className="space-y-3 animate-fade-in">
                            <div className="grid grid-cols-1 gap-3">
                                {STYLES.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setStyle(s.id)}
                                        className={`relative overflow-hidden rounded-xl p-4 text-left transition-all duration-200 border group ${style === s.id ? 'border-indigo-500 bg-zinc-900 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'}`}
                                    >
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${s.color} opacity-20 blur-2xl rounded-full -mr-4 -mt-4 transition-opacity group-hover:opacity-40`}></div>
                                        <div className="relative z-10 flex justify-between items-center">
                                            <div>
                                                <span className={`block text-sm font-medium ${style === s.id ? 'text-white' : 'text-zinc-300'}`}>{s.label}</span>
                                                <span className="text-xs text-zinc-500">{s.desc}</span>
                                            </div>
                                            <div className={`w-4 h-4 rounded-full border ${style === s.id ? 'border-indigo-500 bg-indigo-500' : 'border-zinc-600 bg-transparent'}`}>
                                                {style === s.id && <div className="w-full h-full flex items-center justify-center text-white text-[8px]">✓</div>}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Settings' && (
                            <div className="space-y-8 animate-fade-in">
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                    <TvIcon className="w-4 h-4" /> Aspect Ratio
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {ASPECT_RATIOS.map(ratio => (
                                        <button
                                            key={ratio.id}
                                            onClick={() => setAspectRatio(ratio.id)}
                                            className={`flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-xl text-xs font-medium transition-all border ${aspectRatio === ratio.id ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' : 'bg-zinc-950 text-zinc-400 border-white/5 hover:bg-zinc-900 hover:text-zinc-200'}`}
                                        >
                                            {ratio.icon}
                                            {ratio.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                    <FilmIcon className="w-4 h-4" /> Duration
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {availableDurations.map(d => (
                                            <button
                                            key={d}
                                            onClick={() => setDuration(d)}
                                            className={`flex items-center justify-center px-3 py-4 rounded-xl text-sm font-bold transition-all border ${duration === d ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' : 'bg-zinc-950 text-zinc-400 border-white/5 hover:bg-zinc-900 hover:text-zinc-200'}`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                    <AdjustmentsHorizontalIcon className="w-4 h-4" /> Random Seed
                                </label>
                                <Input 
                                    value={seed} 
                                    onChange={(e) => setSeed(e.target.value)} 
                                    placeholder="Random" 
                                    type="number" 
                                    className="bg-zinc-950 border-white/10"
                                />
                                <p className="text-[10px] text-zinc-500">Use the same seed to reproduce style and composition.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/5 bg-zinc-900 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <Button 
                        onClick={createJob} 
                        isLoading={isGenerating} 
                        disabled={!prompt && activeTab === 'Vision'}
                        size="lg" 
                        className="w-full shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 py-4 text-base"
                    >
                        <FilmIcon className="w-5 h-5 mr-2" />
                        {isGenerating ? 'Generating...' : 'Generate Video'}
                    </Button>
                </div>
            </div>

            {/* Right Panel: Viewport & Editor */}
            <div className="w-full lg:w-8/12 h-full flex flex-col animate-fade-in">
                <div className="flex-1 bg-[#09090b] rounded-2xl border border-white/10 relative overflow-hidden flex flex-col shadow-2xl">
                    
                    {/* Top Toolbar */}
                    <div className="h-16 border-b border-white/5 bg-zinc-900/50 flex items-center px-6 justify-between backdrop-blur-md z-20 flex-shrink-0">
                         <div className="flex items-center gap-4">
                             <div className="flex gap-2">
                                 {editorMode ? (
                                     <>
                                        <Button size="sm" variant="ghost" onClick={addTextOverlay} className="bg-zinc-800/50 border border-white/5 text-zinc-300 hover:text-white hover:bg-zinc-800">
                                            <PencilSquareIcon className="w-4 h-4 mr-1.5"/> Add Text
                                        </Button>
                                        <div className="relative group">
                                            <Button size="sm" variant="ghost" className="bg-zinc-800/50 border border-white/5 text-zinc-300 hover:text-white hover:bg-zinc-800">
                                                <SwatchIcon className="w-4 h-4 mr-1.5"/> Filters
                                            </Button>
                                            <div className="absolute top-full left-0 mt-2 w-40 bg-zinc-900 border border-white/10 rounded-lg shadow-xl hidden group-hover:block z-50 py-2">
                                                {['none', 'grayscale', 'sepia', 'high-contrast', 'warm', 'cool'].map(f => (
                                                    <button key={f} onClick={() => setActiveFilter(f as EditorFilter)} className="block w-full text-left px-4 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/5 capitalize">{f}</button>
                                                ))}
                                            </div>
                                        </div>
                                     </>
                                 ) : (
                                     <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Preview Mode</span>
                                 )}
                             </div>
                         </div>
                         
                         <div className="flex items-center gap-4">
                             {generatedVideoUrl && (
                                <span className="text-xs font-mono text-zinc-500 bg-black/30 px-3 py-1.5 rounded border border-white/5">
                                    {currentTime.toFixed(2)}s / {videoDuration.toFixed(2)}s
                                </span>
                             )}
                             {generatedVideoUrl && (
                                <Button size="sm" variant="primary" onClick={handleExportEdit} isLoading={isRenderingEdit} className="h-8 text-xs gap-1 shadow-lg shadow-indigo-500/20">
                                    <ArrowDownTrayIcon className="w-3 h-3 mr-1.5" /> {editorMode ? 'Export Project' : 'Download'}
                                </Button>
                             )}
                         </div>
                    </div>

                    {/* Canvas Stage */}
                    <div className="flex-1 relative flex flex-col bg-zinc-950 overflow-hidden">
                         {/* Checkerboard Background */}
                         <div className="absolute inset-0 opacity-20 pointer-events-none" 
                              style={{
                                  backgroundImage: `linear-gradient(45deg, #27272a 25%, transparent 25%), linear-gradient(-45deg, #27272a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #27272a 75%), linear-gradient(-45deg, transparent 75%, #27272a 75%)`,
                                  backgroundSize: '20px 20px',
                                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                              }}
                         ></div>

                         <div className="flex-1 relative flex items-center justify-center p-8">
                            {/* Video Container */}
                            <div 
                                className={`relative shadow-2xl transition-all duration-500 ease-in-out bg-black overflow-hidden mx-auto flex items-center justify-center group ${
                                    aspectRatio === '16:9' ? 'w-full aspect-video max-w-4xl max-h-[calc(100%-2rem)]' : 
                                    aspectRatio === '9:16' ? 'h-full aspect-[9/16] max-h-[calc(100%-2rem)]' : 
                                    'h-full aspect-square max-h-[calc(100%-2rem)]'
                                }`}
                            >
                                {isGenerating ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-50">
                                        <div className="relative z-10 w-64 space-y-8">
                                            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="64" cy="64" r="60" stroke="#27272a" strokeWidth="4" fill="none" />
                                                    <circle 
                                                        cx="64" cy="64" r="60" 
                                                        stroke="#6366f1" 
                                                        strokeWidth="4" 
                                                        fill="none" 
                                                        strokeDasharray="377" 
                                                        strokeDashoffset={377 - (377 * progress) / 100} 
                                                        className="transition-all duration-300 ease-linear"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-3xl font-bold text-white font-display tracking-tighter">{Math.round(progress)}%</span>
                                                </div>
                                                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full -z-10 opacity-50 animate-pulse"></div>
                                            </div>
                                            <div className="space-y-3 text-center">
                                                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                                    {loadingStage}...
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : generatedVideoUrl ? (
                                    <div className="relative w-full h-full shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                        <video 
                                            ref={videoRef}
                                            src={generatedVideoUrl} 
                                            className="w-full h-full object-contain bg-black" 
                                            style={getFilterStyle(activeFilter)}
                                            playsInline
                                            onClick={togglePlay}
                                        />
                                        {/* Overlays Layer */}
                                        {overlays.map(overlay => (
                                            <div 
                                                key={overlay.id}
                                                className="absolute cursor-move group/overlay"
                                                style={{ top: `${overlay.y}%`, left: `${overlay.x}%`, transform: 'translate(-50%, -50%)' }}
                                            >
                                                <div className="relative p-2 border-2 border-transparent hover:border-indigo-500 rounded transition-colors">
                                                    <input 
                                                        value={overlay.text}
                                                        onChange={(e) => updateOverlay(overlay.id, { text: e.target.value })}
                                                        className="bg-transparent border-none focus:ring-0 text-white font-bold text-2xl outline-none text-center w-auto min-w-[100px] shadow-black drop-shadow-md font-display"
                                                        style={{ color: overlay.color }}
                                                    />
                                                    <button 
                                                        onClick={() => removeOverlay(overlay.id)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/overlay:opacity-100 transition-opacity shadow-sm"
                                                    >
                                                        <TrashIcon className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {/* Play/Pause Overlay Indicator */}
                                        {!isPlaying && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                                                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                                                    <PlayIcon className="w-8 h-8 text-white ml-1" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl m-8 bg-zinc-900/50">
                                        <div className="p-6 bg-zinc-900 rounded-full mb-4 shadow-inner">
                                            <FilmIcon className="w-12 h-12 opacity-50" />
                                        </div>
                                        <h3 className="text-lg font-bold text-zinc-300">No Video Loaded</h3>
                                        <p className="text-sm mt-2 max-w-xs text-center opacity-60">Generate a video using the panel on the left to start editing.</p>
                                    </div>
                                )}
                            </div>
                         </div>

                        {/* Timeline Panel */}
                        {editorMode && generatedVideoUrl && (
                            <div className="h-64 bg-[#09090b] border-t border-white/10 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative z-30">
                                {/* Timeline Toolbar */}
                                <div className="h-10 border-b border-white/5 flex items-center px-4 justify-between bg-zinc-900">
                                    <div className="flex items-center gap-4 text-zinc-400">
                                        <div className="flex items-center gap-1">
                                            <button onClick={togglePlay} className="p-1.5 hover:text-white hover:bg-white/5 rounded transition-colors">
                                                {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                                            </button>
                                            <button onClick={() => { if(videoRef.current) videoRef.current.currentTime = 0; }} className="p-1.5 hover:text-white hover:bg-white/5 rounded transition-colors">
                                                <StopIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="h-4 w-px bg-white/10"></div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <ScissorsIcon className="w-4 h-4" />
                                            <span>Split</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline Tracks Area */}
                                <div className="flex-1 flex overflow-hidden">
                                    {/* Track Headers (Left) */}
                                    <div className="w-48 flex-shrink-0 border-r border-white/5 bg-zinc-900/50 flex flex-col">
                                        <div className="h-8 border-b border-white/5"></div> {/* Ruler Spacer */}
                                        
                                        {/* Video Header */}
                                        <div className="h-12 border-b border-white/5 flex items-center px-4 gap-3">
                                            <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                <FilmIcon className="w-3 h-3" />
                                            </div>
                                            <span className="text-xs font-medium text-zinc-300">Video 1</span>
                                        </div>
                                        
                                        {/* Overlay Header */}
                                        <div className="h-12 border-b border-white/5 flex items-center px-4 gap-3">
                                            <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-purple-400">
                                                <PencilSquareIcon className="w-3 h-3" />
                                            </div>
                                            <span className="text-xs font-medium text-zinc-300">Overlay</span>
                                        </div>
                                        
                                        {/* Audio Header */}
                                        <div className="h-12 border-b border-white/5 flex items-center px-4 gap-3">
                                            <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                                <SpeakerWaveIcon className="w-3 h-3" />
                                            </div>
                                            <span className="text-xs font-medium text-zinc-300">Audio 1</span>
                                        </div>
                                    </div>

                                    {/* Timeline Content (Right) */}
                                    <div className="flex-1 overflow-x-auto custom-scrollbar bg-[#0c0c0e] relative">
                                        {/* Time Ruler */}
                                        <div className="h-8 border-b border-white/5 flex items-end sticky top-0 bg-[#0c0c0e] z-10">
                                            {[...Array(20)].map((_, i) => (
                                                <div key={i} className="flex-1 flex flex-col justify-end border-l border-white/5 h-full pl-1 relative group">
                                                    <span className="text-[9px] text-zinc-600 font-mono mb-1 block group-hover:text-zinc-400">{i * 2}s</span>
                                                    <div className="h-1.5 w-px bg-zinc-700"></div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Playhead */}
                                        <div 
                                            className="absolute top-0 bottom-0 w-px bg-red-500 z-30 pointer-events-none transition-all duration-100 linear"
                                            style={{ left: `${(currentTime / (videoDuration || 10)) * 100}%` }}
                                        >
                                            <div className="absolute -top-0 -left-1.5 w-3 h-3 bg-red-500 transform rotate-45 shadow-md"></div>
                                            <div className="absolute top-0 bottom-0 w-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                        </div>

                                        {/* Track Lanes */}
                                        <div className="relative min-w-[800px]">
                                            
                                            {/* Video Lane */}
                                            <div className="h-12 border-b border-white/5 p-1">
                                                <div className="h-full bg-indigo-900/30 border border-indigo-500/30 rounded-md relative overflow-hidden group hover:bg-indigo-900/40 transition-colors cursor-pointer">
                                                    <div className="absolute inset-0 flex items-center px-3 gap-2">
                                                        <div className="w-8 h-6 bg-black/30 rounded text-xs flex items-center justify-center text-white/50 font-mono">img</div>
                                                        <span className="text-[10px] font-medium text-indigo-200 truncate">Generated_Clip_001.mp4</span>
                                                    </div>
                                                    {/* Thumbnails simulation */}
                                                    <div className="absolute inset-0 flex opacity-20 pointer-events-none">
                                                        {[...Array(10)].map((_, i) => (
                                                            <div key={i} className="flex-1 border-r border-black/20 bg-white/10"></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Overlay Lane */}
                                            <div className="h-12 border-b border-white/5 p-1 relative">
                                                {overlays.map(overlay => (
                                                    <div 
                                                        key={overlay.id}
                                                        className="absolute top-1 bottom-1 bg-purple-900/40 border border-purple-500/30 rounded-md flex items-center px-3 text-[10px] text-purple-200 cursor-pointer hover:bg-purple-900/60"
                                                        style={{ left: '0%', width: '100%' }}
                                                    >
                                                        <span className="truncate">{overlay.text}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Audio Lane */}
                                            <div className="h-12 border-b border-white/5 p-1">
                                                <div className="h-full bg-emerald-900/20 border border-emerald-500/20 rounded-md relative flex items-center justify-center overflow-hidden">
                                                    {/* Waveform */}
                                                    <div className="flex gap-0.5 items-center w-full px-2 opacity-40">
                                                        {[...Array(50)].map((_, i) => (
                                                            <div 
                                                                key={i} 
                                                                className="flex-1 bg-emerald-500 rounded-full" 
                                                                style={{ height: `${Math.random() * 80 + 20}%` }}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TabButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({active, onClick, icon, label}) => (
    <button 
        onClick={onClick}
        className={`flex-none px-6 py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors relative min-w-[100px] ${
            active 
            ? 'text-white bg-white/5' 
            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
        }`}
    >
        {icon}
        {label}
        {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></div>}
    </button>
);

export default PromoVideosPage;
