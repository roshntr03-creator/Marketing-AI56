import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Textarea } from '../components/ui/Input';
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
    MagnifyingGlassPlusIcon
} from '@heroicons/react/24/outline';

const MODELS = [
    { id: 'grok-imagine/text-to-image', name: 'Grok 3 (Imagine)', desc: 'High realism, great prompt adherence' },
    { id: 'nano-banana-pro', name: 'Nano Banana Pro', desc: 'Product-focused imagery & text integration' },
    { id: 'bytedance/seedream-v4-text-to-image', name: 'Seedream v4', desc: 'Artistic styles and illustrations' },
    { id: 'gemini-2.5-flash-image', name: 'Gemini Flash', desc: 'Fast, general purpose imagery' },
];

const STYLES = [
    { id: 'none', label: 'No Style', desc: 'Raw prompt interpretation', color: 'from-zinc-800 to-zinc-900' },
    { id: 'photorealistic', label: 'Photorealistic', desc: 'High detail, realistic lighting, 8k', color: 'from-blue-900 to-slate-900' },
    { id: 'anime', label: 'Anime', desc: 'Japanese animation style, vibrant', color: 'from-pink-900 to-purple-900' },
    { id: 'digital-art', label: 'Digital Art', desc: 'Modern illustration, vector style', color: 'from-indigo-900 to-cyan-900' },
    { id: 'oil-painting', label: 'Oil Painting', desc: 'Textured, classical art style', color: 'from-amber-900/50 to-orange-900/50' },
    { id: 'cinematic', label: 'Cinematic', desc: 'Movie lighting, dramatic composition', color: 'from-zinc-900 to-black' },
    { id: '3d-render', label: '3D Render', desc: 'Octane render, raytracing, unreal engine', color: 'from-emerald-900 to-teal-900' },
    { id: 'cyberpunk', label: 'Cyberpunk', desc: 'Neon, futuristic, high contrast', color: 'from-fuchsia-900 to-violet-900' },
];

const ASPECT_RATIOS = [
    { id: '1:1', label: 'Square', icon: <Square2StackIcon className="w-4 h-4"/> },
    { id: '16:9', label: 'Landscape', icon: <TvIcon className="w-4 h-4"/> },
    { id: '9:16', label: 'Portrait', icon: <DevicePhoneMobileIcon className="w-4 h-4"/> },
    { id: '4:3', label: 'Standard', icon: <TvIcon className="w-4 h-4"/> },
    { id: '3:4', label: 'Tall', icon: <DevicePhoneMobileIcon className="w-4 h-4"/> },
];

const ImageGeneratorPage: React.FC = () => {
    const { addCreation, creations } = useAppContext();
    
    // Local State
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
    const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
    const [numImages, setNumImages] = useState(1);
    
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
                    const increment = Math.max(0.5, (95 - prev) / 20); 
                    const newProg = prev + Math.random() * increment;
                    
                    if (newProg > 15 && newProg < 40) setLoadingStage('Diffusing Noise');
                    if (newProg > 40 && newProg < 70) setLoadingStage('Refining Details');
                    if (newProg > 70 && newProg < 90) setLoadingStage('Color Grading');
                    if (newProg > 90) setLoadingStage('Finalizing');
                    
                    return newProg >= 95 ? 95 : newProg;
                });
            }, 150);
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
        } catch (error) {
            console.error("Prompt enhancement failed", error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleGenerate = async () => {
        if (!prompt) return;

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
            params: { prompt: finalPrompt, aspectRatio, model: selectedModel, numImages },
            status: 'Pending'
        });
        
        setCurrentJobId(jobId);
    };

    const handleSelectRecent = (jobId: string) => {
        setCurrentJobId(jobId);
    };

    return (
        <div className="h-[calc(100vh-9rem)] flex flex-col lg:flex-row gap-6 animate-fade-in pb-2">
            
            {/* LEFT PANEL: Command Center */}
            <div className="w-full lg:w-4/12 flex flex-col h-full bg-[#09090b] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-sm">
                    <div>
                        <h1 className="text-xl font-bold font-display text-white">Image Studio</h1>
                        <p className="text-zinc-400 text-xs">Text-to-Image Generator</p>
                    </div>
                </div>

                {/* Scrollable Controls */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-zinc-900/20">
                    
                    {/* Model Selection */}
                    <div className="space-y-3">
                         <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <CpuChipIcon className="w-3 h-3"/> AI Model
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {MODELS.map(m => (
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

                    {/* Prompt Section */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <SparklesIcon className="w-3 h-3"/> Prompt
                            </label>
                            <button 
                                onClick={handleEnhancePrompt}
                                disabled={!prompt || isEnhancing}
                                className="text-[10px] flex items-center gap-1 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors px-2 py-1 rounded hover:bg-indigo-500/10"
                            >
                                {isEnhancing ? <span className="animate-pulse">Enhancing...</span> : <><BoltIcon className="w-3 h-3" /> Magic Enhance</>}
                            </button>
                        </div>
                        <div className="relative group">
                             <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-focus-within:opacity-100 transition duration-500 blur"></div>
                            <Textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your imagination..."
                                rows={4}
                                className="relative bg-zinc-950 border-white/10 focus:border-indigo-500/50 resize-none shadow-inner p-4 rounded-xl text-sm leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Grok 3 Specific: Image Count */}
                    {selectedModel === 'grok-imagine/text-to-image' && (
                        <div className="space-y-3 animate-fade-in">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <RectangleStackIcon className="w-3 h-3"/> Image Count
                            </label>
                            <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-white/5">
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setNumImages(n)}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${numImages === n ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Aspect Ratio */}
                    <div className="space-y-3">
                         <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <TvIcon className="w-3 h-3"/> Dimensions
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {ASPECT_RATIOS.map(ratio => (
                                <button 
                                    key={ratio.id} 
                                    onClick={() => setAspectRatio(ratio.id)}
                                    className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all ${aspectRatio === ratio.id ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' : 'bg-zinc-950 text-zinc-400 border-white/5 hover:bg-zinc-900 hover:text-zinc-200'}`}
                                    title={ratio.label}
                                >
                                    {ratio.icon}
                                    <span className="text-[10px] font-medium">{ratio.id}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Styles Grid */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <SwatchIcon className="w-3 h-3"/> Aesthetic
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {STYLES.map(style => (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style.id)}
                                    className={`relative overflow-hidden rounded-lg p-3 text-left border transition-all duration-200 group h-20 ${selectedStyle === style.id ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-white/5 hover:border-white/20'}`}
                                >
                                    {/* Background Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                                    
                                    <div className="relative z-10 flex flex-col justify-between h-full">
                                        <span className={`text-xs font-bold ${selectedStyle === style.id ? 'text-white' : 'text-zinc-300'}`}>{style.label}</span>
                                        {selectedStyle === style.id && (
                                            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_5px_rgba(129,140,248,0.8)]"></div>
                                        )}
                                    </div>
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
                        disabled={!prompt}
                        size="lg"
                        className="w-full py-4 text-base shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300"
                    >
                        <PaintBrushIcon className="w-5 h-5 mr-2" />
                        Generate {numImages > 1 ? `(${numImages})` : ''} Artwork
                    </Button>
                </div>
            </div>

            {/* RIGHT PANEL: Viewport & Gallery */}
            <div className="w-full lg:w-8/12 h-full flex flex-col gap-4 animate-fade-in">
                
                {/* Main Viewport */}
                <div className="flex-1 bg-[#050505] rounded-2xl border border-white/10 relative overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/5">
                    
                    {/* Viewport Header */}
                    <div className="h-14 border-b border-white/5 bg-zinc-900/50 flex items-center px-6 justify-between backdrop-blur-md z-20 flex-shrink-0">
                        <div className="flex items-center gap-2">
                             <div className="flex gap-1.5 mr-4">
                                 <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                             </div>
                             <div className="flex items-center gap-2">
                                {displayedImage && (
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                        {isGenerating ? 'Processing...' : 'Render Preview'}
                                    </span>
                                )}
                                {currentJob && (
                                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-white/5">
                                        {MODELS.find(m => m.id === currentJob.params.model)?.name || 'AI Model'}
                                    </span>
                                )}
                             </div>
                        </div>
                        {displayedImage && !isGenerating && (
                            <div className="flex gap-2">
                                <Button 
                                    size="sm" 
                                    variant="secondary" 
                                    onClick={() => setLightboxImage(displayedImage)}
                                    className="h-8 text-xs gap-1 bg-white/5 border-white/10 hover:bg-white/10"
                                >
                                    <MagnifyingGlassPlusIcon className="w-3 h-3" /> View
                                </Button>
                                <a href={displayedImage} download={`creation-${Date.now()}.png`}>
                                    <Button size="sm" variant="secondary" className="h-8 text-xs gap-1 bg-white/5 border-white/10 hover:bg-white/10">
                                        <ArrowDownTrayIcon className="w-3 h-3" /> Download
                                    </Button>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Canvas Stage */}
                    <div className="flex-1 relative flex items-center justify-center p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-zinc-950/90 overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                         {/* Image Container */}
                         <div 
                            className={`relative shadow-2xl transition-all duration-500 ease-in-out bg-black ring-1 ring-white/10 overflow-hidden mx-auto flex items-center justify-center max-h-full max-w-full ${displayedImage && !isGenerating ? 'cursor-zoom-in hover:ring-indigo-500/50' : ''}`}
                            onClick={() => !isGenerating && displayedImage && setLightboxImage(displayedImage)}
                            style={{
                                aspectRatio: aspectRatio.replace(':', '/')
                            }}
                         >
                             {isGenerating ? (
                                  /* Generating Visualization */
                                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-50 w-full h-full">
                                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                                     <div className="relative z-10 w-64 space-y-8">
                                        {/* Radial Progress */}
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
                                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest animate-pulse">
                                                {loadingStage}...
                                            </div>
                                            <div className="flex gap-1 h-1 w-full px-8 opacity-30">
                                                 <div className="flex-1 bg-indigo-500 rounded-full"></div>
                                                 <div className="flex-1 bg-indigo-500 rounded-full"></div>
                                                 <div className="flex-1 bg-indigo-500 rounded-full"></div>
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
                                     <PhotoIcon className="w-20 h-20 opacity-20 mb-4" />
                                     <p className="text-sm font-medium text-zinc-600 uppercase tracking-widest">Ready to Create</p>
                                 </div>
                             )}
                         </div>
                    </div>
                </div>

                {/* History Ribbon */}
                <div className="h-32 bg-zinc-900 rounded-xl border border-white/5 p-4 flex flex-col flex-shrink-0 shadow-lg">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-1">
                        <ClockIcon className="w-3 h-3" /> Recent Creations
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        {recentImages.map(job => (
                            <button 
                                key={job.id}
                                onClick={() => handleSelectRecent(job.id)}
                                className={`relative aspect-square h-full flex-shrink-0 rounded-lg overflow-hidden border transition-all group ${currentJobId === job.id ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-white/10 hover:border-white/30'}`}
                            >
                                {job.status === 'Completed' && job.resultUrl ? (
                                    <img src={job.resultUrl} alt={job.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                    <p className="text-[8px] text-white line-clamp-1">{job.title}</p>
                                </div>
                            </button>
                        ))}
                        {recentImages.length === 0 && (
                            <div className="flex items-center justify-center h-full w-full text-zinc-600 text-xs italic">
                                No history yet
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
                    <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden rounded-lg bg-black/50 border border-white/10 min-h-[60vh]">
                        {lightboxImage && (
                            <img src={lightboxImage} alt="Full Preview" className="max-w-full max-h-[75vh] object-contain shadow-2xl" />
                        )}
                    </div>
                    <div className="flex gap-4">
                        {lightboxImage && (
                            <a href={lightboxImage} download={`image-${Date.now()}.png`}>
                                <Button size="lg" leftIcon={<ArrowDownTrayIcon className="w-5 h-5"/>}>
                                    Download Image
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