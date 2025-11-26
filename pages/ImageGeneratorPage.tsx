
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext, CREDIT_COSTS } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Textarea, Input } from '../components/ui/Input';
import aiService from '../services/aiService';
import { 
    SparklesIcon, 
    SwatchIcon, 
    Square2StackIcon, 
    TvIcon, 
    DevicePhoneMobileIcon, 
    ArrowDownTrayIcon,
    BoltIcon,
    ClockIcon,
    PaintBrushIcon,
    CpuChipIcon,
    PhotoIcon,
    RectangleStackIcon,
    MagnifyingGlassPlusIcon,
    AdjustmentsHorizontalIcon,
    NoSymbolIcon,
    HashtagIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

const MODELS = [
    { id: 'grok-imagine/text-to-image', name: 'Grok 3 (Imagine)', desc: 'High realism, strong adherence' },
    { id: 'nano-banana-pro', name: 'Nano Banana Pro', desc: 'Product-focused & detailed' },
    { id: 'bytedance/seedream-v4-text-to-image', name: 'Seedream v4', desc: 'Artistic & Illustrative' },
    { id: 'gemini-2.5-flash-image', name: 'Gemini Flash', desc: 'Fast prototyping' },
];

const STYLES = [
    { id: 'none', label: 'No Style', desc: 'Raw interpretation', color: 'from-zinc-800 to-zinc-900' },
    { id: 'photorealistic', label: 'Photorealistic', desc: '8k, Unreal Engine 5', color: 'from-blue-900 to-slate-900' },
    { id: 'anime', label: 'Anime', desc: 'Studio Ghibli style', color: 'from-pink-900 to-purple-900' },
    { id: 'digital-art', label: 'Digital Art', desc: 'Vector illustration', color: 'from-indigo-900 to-cyan-900' },
    { id: 'oil-painting', label: 'Oil Painting', desc: 'Textured canvas', color: 'from-amber-900/50 to-orange-900/50' },
    { id: 'cinematic', label: 'Cinematic', desc: 'Dramatic lighting', color: 'from-zinc-900 to-black' },
    { id: '3d-render', label: '3D Render', desc: 'Octane render', color: 'from-emerald-900 to-teal-900' },
    { id: 'cyberpunk', label: 'Cyberpunk', desc: 'Neon, futuristic', color: 'from-fuchsia-900 to-violet-900' },
    { id: 'watercolor', label: 'Watercolor', desc: 'Soft, artistic', color: 'from-cyan-900 to-blue-900' },
    { id: 'sketch', label: 'Pencil Sketch', desc: 'Black & white', color: 'from-gray-800 to-gray-900' },
];

const ASPECT_RATIOS = [
    { id: '1:1', label: 'Square', icon: <Square2StackIcon className="w-4 h-4"/> },
    { id: '16:9', label: 'Landscape', icon: <TvIcon className="w-4 h-4"/> },
    { id: '9:16', label: 'Portrait', icon: <DevicePhoneMobileIcon className="w-4 h-4"/> },
    { id: '4:3', label: 'Standard', icon: <TvIcon className="w-4 h-4"/> },
    { id: '3:4', label: 'Tall', icon: <DevicePhoneMobileIcon className="w-4 h-4"/> },
];

const ImageGeneratorPage: React.FC = () => {
    const { addCreation, creations, deductCredits, userProfile } = useAppContext();
    
    // Local State
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
    const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
    const [numImages, setNumImages] = useState(1);
    const [seed, setSeed] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    
    // UI State
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [currentJobId, setCurrentJobId] = useState<string | null>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    
    // Animation State
    const [progress, setProgress] = useState(0);
    const [loadingStage, setLoadingStage] = useState('Initializing');

    // Derived State
    const recentImages = creations.filter(c => c.type === 'IMAGE').slice(0, 10);
    const currentJob = creations.find(c => c.id === currentJobId);
    const isGenerating = currentJob?.status === 'Generating' || currentJob?.status === 'Pending';
    const displayedImage = currentJob?.status === 'Completed' ? currentJob.resultUrl : (currentJobId ? null : recentImages[0]?.resultUrl);

    // Credit Logic
    const totalCost = CREDIT_COSTS.IMAGE * numImages;
    const hasSufficientCredits = (userProfile?.credits || 0) >= totalCost;

    // Reset count when model changes if not Grok 3
    useEffect(() => {
        if (selectedModel !== 'grok-imagine/text-to-image') {
            setNumImages(1);
        }
    }, [selectedModel]);

    // Progress Simulation Effect
    useEffect(() => {
        if (isGenerating) {
            setProgress(0);
            setLoadingStage('Parsing Prompt');
            
            const interval = setInterval(() => {
                setProgress(prev => {
                    const increment = Math.max(0.5, (95 - prev) / 25); 
                    const newProg = prev + Math.random() * increment;
                    
                    if (newProg > 15 && newProg < 35) setLoadingStage('Diffusing Noise');
                    if (newProg > 35 && newProg < 60) setLoadingStage('Applying Composition');
                    if (newProg > 60 && newProg < 80) setLoadingStage('Detail Refinement');
                    if (newProg > 80 && newProg < 95) setLoadingStage('Upscaling');
                    
                    return newProg >= 95 ? 95 : newProg;
                });
            }, 100);
            return () => clearInterval(interval);
        } else if (currentJob?.status === 'Completed') {
            setProgress(100);
            setLoadingStage('Complete');
        }
    }, [isGenerating, currentJob?.status]);

    const handleEnhancePrompt = async () => {
        if (!prompt) return;
        setIsEnhancing(true);
        try {
            const result = await aiService.enhancePrompt(prompt);
            if (result.finalPrompt) {
                setPrompt(result.finalPrompt);
            }
            if (result.negativePrompt) {
                setNegativePrompt(result.negativePrompt);
                setShowAdvanced(true); // Auto-show negative prompt field
            }
        } catch (error) {
            console.error("Prompt enhancement failed", error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleGenerate = async () => {
        if (!prompt) return;

        if (!deductCredits(totalCost)) {
            alert(`Insufficient credits. You need ${totalCost} credits but have ${userProfile?.credits || 0}.`);
            return;
        }

        const jobId = `img-${Date.now()}`;
        
        // Construct full prompt with style
        let finalPrompt = prompt;
        const styleObj = STYLES.find(s => s.id === selectedStyle);
        if (styleObj && styleObj.id !== 'none') {
            finalPrompt = `${prompt}, ${styleObj.desc} style`;
        }

        addCreation({
            id: jobId,
            type: 'IMAGE',
            title: prompt.substring(0, 40),
            params: { 
                prompt: finalPrompt, 
                negativePrompt, 
                aspectRatio, 
                model: selectedModel, 
                numImages,
                seed: seed || undefined 
            },
            status: 'Pending'
        });
        
        setCurrentJobId(jobId);
    };

    const handleSelectRecent = (jobId: string) => {
        setCurrentJobId(jobId);
    };

    return (
        <div className="h-[calc(100vh-9rem)] flex flex-col lg:flex-row gap-6 animate-fade-in pb-2">
            
            {/* LEFT PANEL: Controls */}
            <div className="w-full lg:w-4/12 flex flex-col h-full bg-[#09090b] border border-white/10 rounded-2xl overflow-hidden shadow-xl relative z-10">
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-sm">
                    <div>
                        <h1 className="text-xl font-bold font-display text-white">Image Studio</h1>
                        <p className="text-zinc-400 text-xs">Advanced Generation Engine</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <CpuChipIcon className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-medium text-zinc-300">{userProfile?.credits || 0} Credits</span>
                    </div>
                </div>

                {/* Scrollable Controls */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-zinc-900/20">
                    
                    {/* Prompt Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <SparklesIcon className="w-3 h-3 text-indigo-400"/> Prompt
                            </label>
                            <button 
                                onClick={handleEnhancePrompt}
                                disabled={!prompt || isEnhancing}
                                className="text-[10px] flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-all bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 hover:bg-indigo-500/20"
                            >
                                {isEnhancing ? <span className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full"></span> : <BoltIcon className="w-3 h-3" />}
                                {isEnhancing ? 'Enhancing...' : 'Magic Enhance'}
                            </button>
                        </div>
                        <div className="relative group">
                             <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-20 transition duration-500 blur"></div>
                            <Textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your imagination in detail..."
                                rows={5}
                                className="relative bg-zinc-950 border-white/10 focus:border-indigo-500/50 resize-none shadow-inner p-4 rounded-xl text-sm leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Advanced Toggles */}
                    <div className="space-y-4">
                        <button 
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors w-full"
                        >
                            <AdjustmentsHorizontalIcon className="w-3 h-3" />
                            {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
                        </button>

                        {showAdvanced && (
                            <div className="space-y-4 animate-fade-in p-4 rounded-xl bg-white/5 border border-white/5">
                                {/* Negative Prompt */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                        <NoSymbolIcon className="w-3 h-3"/> Negative Prompt
                                    </label>
                                    <Textarea 
                                        value={negativePrompt}
                                        onChange={(e) => setNegativePrompt(e.target.value)}
                                        placeholder="blur, distortion, ugly, bad anatomy..."
                                        rows={2}
                                        className="bg-zinc-900 border-white/10 text-xs resize-none"
                                    />
                                </div>
                                {/* Seed */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                        <HashtagIcon className="w-3 h-3"/> Random Seed
                                    </label>
                                    <div className="flex gap-2">
                                        <Input 
                                            type="number"
                                            value={seed}
                                            onChange={(e) => setSeed(e.target.value)}
                                            placeholder="Random"
                                            className="bg-zinc-900 border-white/10 text-xs h-8"
                                        />
                                        <Button size="sm" variant="secondary" onClick={() => setSeed(Math.floor(Math.random() * 1000000000).toString())} className="h-8">
                                            Roll
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Model & Dimensions */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                             <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <CpuChipIcon className="w-3 h-3"/> AI Model
                            </label>
                            <div className="relative">
                                <select 
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full appearance-none bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 cursor-pointer hover:border-white/20 transition-colors"
                                >
                                    {MODELS.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-zinc-500">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                                </div>
                            </div>
                            <p className="text-[10px] text-zinc-500 px-1">
                                {MODELS.find(m => m.id === selectedModel)?.desc}
                            </p>
                        </div>

                        <div className="space-y-3">
                             <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <TvIcon className="w-3 h-3"/> Aspect Ratio
                            </label>
                            <div className="grid grid-cols-5 gap-2">
                                {ASPECT_RATIOS.map(ratio => (
                                    <button 
                                        key={ratio.id} 
                                        onClick={() => setAspectRatio(ratio.id)}
                                        className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg border transition-all duration-200 ${aspectRatio === ratio.id ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg scale-105' : 'bg-zinc-950 text-zinc-400 border-white/5 hover:bg-zinc-900 hover:text-zinc-200'}`}
                                        title={ratio.label}
                                    >
                                        {ratio.icon}
                                        <span className="text-[10px] font-bold">{ratio.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Image Count (Conditionally Rendered) */}
                    {selectedModel === 'grok-imagine/text-to-image' && (
                        <div className="space-y-3 animate-fade-in">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <RectangleStackIcon className="w-3 h-3"/> Batch Size
                            </label>
                            <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-white/5">
                                {[1, 2, 3, 4].map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setNumImages(n)}
                                        className={`flex-1 py-2 text-xs font-bold rounded transition-all ${numImages === n ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Styles Grid */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <SwatchIcon className="w-3 h-3"/> Art Style
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {STYLES.map(style => (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style.id)}
                                    className={`relative overflow-hidden rounded-xl p-3 text-left border transition-all duration-300 group h-16 ${selectedStyle === style.id ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-white/5 hover:border-white/20'}`}
                                >
                                    {/* Background Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-10 group-hover:opacity-25 transition-opacity`}></div>
                                    
                                    <div className="relative z-10 flex flex-col justify-center h-full">
                                        <span className={`text-xs font-bold ${selectedStyle === style.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{style.label}</span>
                                    </div>
                                    {selectedStyle === style.id && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-white/5 bg-zinc-900 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <Button 
                        onClick={handleGenerate} 
                        isLoading={isGenerating} 
                        disabled={!prompt || !hasSufficientCredits}
                        size="lg"
                        className={`w-full py-4 text-base transition-all duration-300 ${hasSufficientCredits ? 'shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] hover:-translate-y-0.5' : 'opacity-70 cursor-not-allowed'}`}
                    >
                        <PaintBrushIcon className="w-5 h-5 mr-2" />
                        Generate {numImages > 1 ? `(${numImages})` : ''} ({totalCost} Credits)
                    </Button>
                    {!hasSufficientCredits && (
                        <p className="text-[10px] text-red-400 text-center mt-2">Insufficient Credits ({userProfile?.credits})</p>
                    )}
                </div>
            </div>

            {/* RIGHT PANEL: Viewport & Gallery */}
            <div className="w-full lg:w-8/12 h-full flex flex-col gap-4 animate-fade-in">
                
                {/* Main Viewport */}
                <div className="flex-1 bg-[#050505] rounded-2xl border border-white/10 relative overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/5">
                    
                    {/* Viewport Header */}
                    <div className="h-14 border-b border-white/5 bg-zinc-900/50 flex items-center px-6 justify-between backdrop-blur-md z-20 flex-shrink-0">
                        <div className="flex items-center gap-4">
                             <div className="flex gap-1.5">
                                 <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                 <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                 <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                             </div>
                             <div className="h-4 w-px bg-white/10"></div>
                             <div className="flex items-center gap-2">
                                {displayedImage ? (
                                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                        {isGenerating ? (
                                            <>
                                                <span className="animate-pulse text-indigo-400">●</span> Processing
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-emerald-500">●</span> Ready
                                            </>
                                        )}
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Idle</span>
                                )}
                             </div>
                        </div>
                        {displayedImage && !isGenerating && (
                            <div className="flex gap-2">
                                <Button 
                                    size="sm" 
                                    variant="secondary" 
                                    onClick={() => setLightboxImage(displayedImage)}
                                    className="h-8 text-xs gap-1.5 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white"
                                >
                                    <MagnifyingGlassPlusIcon className="w-3 h-3" /> Zoom
                                </Button>
                                <a href={displayedImage} download={`creation-${Date.now()}.png`}>
                                    <Button size="sm" variant="secondary" className="h-8 text-xs gap-1.5 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">
                                        <ArrowDownTrayIcon className="w-3 h-3" /> Save
                                    </Button>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Canvas Stage */}
                    <div className="flex-1 relative flex items-center justify-center p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-zinc-950/90 overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

                         {/* Image Container */}
                         <div 
                            className={`relative shadow-2xl transition-all duration-500 ease-out bg-black ring-1 ring-white/10 overflow-hidden mx-auto flex items-center justify-center max-h-full max-w-full rounded-sm ${displayedImage && !isGenerating ? 'cursor-zoom-in hover:ring-indigo-500/50 hover:shadow-[0_0_50px_rgba(0,0,0,0.5)]' : ''}`}
                            onClick={() => !isGenerating && displayedImage && setLightboxImage(displayedImage)}
                            style={{
                                aspectRatio: aspectRatio.replace(':', '/')
                            }}
                         >
                             {isGenerating ? (
                                  /* Generating Visualization */
                                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-50 w-full h-full">
                                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                                     {/* Scanning Line */}
                                     <div className="absolute inset-0 w-full h-[2px] bg-indigo-500/50 blur-sm animate-[scan_2s_ease-in-out_infinite]"></div>
                                     
                                     <div className="relative z-10 w-64 space-y-8">
                                        {/* Hexagon Loader */}
                                        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                                            <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                                            <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                                                <circle 
                                                    cx="64" cy="64" r="60" 
                                                    stroke="#6366f1" 
                                                    strokeWidth="4" 
                                                    fill="none" 
                                                    strokeDasharray="377" 
                                                    strokeDashoffset={377 - (377 * progress) / 100} 
                                                    strokeLinecap="round"
                                                    className="transition-all duration-300 ease-linear"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-4xl font-bold text-white font-display tracking-tighter">{Math.round(progress)}%</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 text-center">
                                            <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest animate-pulse">
                                                {loadingStage}...
                                            </div>
                                            <div className="flex gap-1.5 h-1 w-full px-10 opacity-30 justify-center">
                                                 <div className="w-8 bg-indigo-500 rounded-full animate-[pulse_1s_infinite]"></div>
                                                 <div className="w-8 bg-indigo-500 rounded-full animate-[pulse_1s_infinite] delay-100"></div>
                                                 <div className="w-8 bg-indigo-500 rounded-full animate-[pulse_1s_infinite] delay-200"></div>
                                            </div>
                                        </div>
                                     </div>
                                  </div>
                             ) : displayedImage ? (
                                 /* Result */
                                 <img src={displayedImage} alt="Generated Artwork" className="w-full h-full object-contain" />
                             ) : (
                                 /* Empty State */
                                 <div className="flex flex-col items-center justify-center text-zinc-800">
                                     <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-inner">
                                         <PhotoIcon className="w-10 h-10 opacity-20 text-white" />
                                     </div>
                                     <p className="text-sm font-medium text-zinc-600 uppercase tracking-widest">Canvas Empty</p>
                                     <p className="text-xs text-zinc-700 mt-2">Configure settings to start generating</p>
                                 </div>
                             )}
                         </div>
                    </div>
                </div>

                {/* History Ribbon */}
                <div className="h-36 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-white/5 p-4 flex flex-col flex-shrink-0 shadow-lg">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                            <ClockIcon className="w-3 h-3" /> Session History
                        </div>
                        <span className="text-[10px] text-zinc-600">{recentImages.length} items</span>
                    </div>
                    
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar h-full items-center">
                        {recentImages.map(job => (
                            <button 
                                key={job.id}
                                onClick={() => handleSelectRecent(job.id)}
                                className={`relative aspect-square h-20 flex-shrink-0 rounded-lg overflow-hidden border transition-all duration-200 group ${currentJobId === job.id ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg scale-105 z-10' : 'border-white/10 hover:border-white/30 hover:scale-105 hover:z-10'}`}
                            >
                                {job.status === 'Completed' && job.resultUrl ? (
                                    <img src={job.resultUrl} alt={job.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <MagnifyingGlassPlusIcon className="w-4 h-4 text-white" />
                                </div>
                            </button>
                        ))}
                        
                        {recentImages.length === 0 && (
                            <div className="flex-1 flex items-center justify-center text-zinc-700 text-xs italic border-2 border-dashed border-zinc-800 rounded-lg h-20">
                                No generations yet
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Lightbox Viewer */}
            <Modal 
                isOpen={!!lightboxImage} 
                onClose={() => setLightboxImage(null)} 
                title="High Resolution Preview"
                maxWidth="max-w-7xl"
            >
                <div className="flex flex-col h-full justify-center items-center gap-6">
                    <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden rounded-xl bg-black border border-white/10 min-h-[60vh] shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        {lightboxImage && (
                            <img src={lightboxImage} alt="Full Preview" className="relative z-10 max-w-full max-h-[75vh] object-contain shadow-2xl" />
                        )}
                    </div>
                    <div className="flex gap-4">
                        {lightboxImage && (
                            <a href={lightboxImage} download={`image-${Date.now()}.png`}>
                                <Button size="lg" leftIcon={<ArrowDownTrayIcon className="w-5 h-5"/>} className="shadow-lg shadow-indigo-500/20">
                                    Download Full Res
                                </Button>
                            </a>
                        )}
                        <Button variant="secondary" size="lg" onClick={() => setLightboxImage(null)}>
                            Close Viewer
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ImageGeneratorPage;