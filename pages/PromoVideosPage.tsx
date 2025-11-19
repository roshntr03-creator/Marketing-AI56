
import React, { useState, useRef, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { 
    VideoCameraIcon, 
    SparklesIcon, 
    FilmIcon, 
    ClockIcon, 
    ArrowsPointingOutIcon,
    PlayIcon,
    PauseIcon,
    ArrowDownTrayIcon,
    TvIcon,
    DevicePhoneMobileIcon,
    Square2StackIcon,
    BoltIcon,
    CpuChipIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import aiService from '../services/aiService';
import * as storage from '../services/storageService';

const STYLES = [
    { id: 'Cinematic', label: 'Cinematic', color: 'from-slate-900 to-slate-800' },
    { id: '3D Render', label: '3D Animation', color: 'from-indigo-900 to-purple-900' },
    { id: 'Cyberpunk', label: 'Cyberpunk', color: 'from-pink-900 to-rose-900' },
    { id: 'Analog Film', label: 'Vintage Film', color: 'from-amber-900/40 to-orange-900/40' },
    { id: 'Minimalist', label: 'Minimalist', color: 'from-gray-800 to-gray-900' },
    { id: 'Nature', label: 'Nature', color: 'from-emerald-900 to-teal-900' },
];

const DURATIONS = ['5s', '10s', '15s'];
const ASPECT_RATIOS = [
    { id: '16:9', label: 'Landscape', icon: <TvIcon className="w-4 h-4"/> },
    { id: '9:16', label: 'Portrait', icon: <DevicePhoneMobileIcon className="w-4 h-4"/> },
    { id: '1:1', label: 'Square', icon: <Square2StackIcon className="w-4 h-4"/> },
];

const PromoVideosPage: React.FC = () => {
    const { addCreation, creations } = useAppContext();
    
    // State
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState(STYLES[0].id);
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [duration, setDuration] = useState('10s');
    
    // Processing State
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [currentJobId, setCurrentJobId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [loadingStage, setLoadingStage] = useState('Initializing');
    
    // Retrieve job status
    const currentJob = creations.find(c => c.id === currentJobId);
    const isGenerating = currentJob?.status === 'Generating' || currentJob?.status === 'Pending';
    const generatedVideoUrl = currentJob?.status === 'Completed' ? currentJob.resultUrl : null;
    
    // Simulation Effect for Progress
    useEffect(() => {
        if (isGenerating) {
            setProgress(0);
            setLoadingStage('Initializing Neural Network...');
            
            const interval = setInterval(() => {
                setProgress(prev => {
                    // Non-linear progress simulation
                    const increment = Math.max(0.2, (95 - prev) / 40); 
                    const newProg = prev + Math.random() * increment;
                    
                    if (newProg > 15 && newProg < 35) setLoadingStage('Parsing Scene Geometry...');
                    if (newProg > 35 && newProg < 60) setLoadingStage('Synthesizing Textures...');
                    if (newProg > 60 && newProg < 80) setLoadingStage('Rendering Lighting Effects...');
                    if (newProg > 80) setLoadingStage('Finalizing Video Stream...');
                    
                    return newProg >= 95 ? 95 : newProg;
                });
            }, 200);
            return () => clearInterval(interval);
        } else if (generatedVideoUrl) {
            setProgress(100);
            setLoadingStage('Complete');
        }
    }, [isGenerating, generatedVideoUrl]);

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

        const jobId = `promo-${Date.now()}`;
        
        addCreation({
            id: jobId,
            type: 'PROMO_VIDEO',
            title: `Promo: ${style} - ${prompt.substring(0, 30)}...`,
            params: { prompt, aspectRatio, style, duration },
            status: 'Pending'
        });
        
        setCurrentJobId(jobId);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 animate-fade-in pb-4">
            {/* Left Panel: Controls */}
            <div className="w-full lg:w-4/12 flex flex-col h-full overflow-y-auto custom-scrollbar pr-2 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold font-display text-white">Promo Studio</h1>
                    <p className="text-zinc-400 text-sm">Create broadcast-quality commercial clips.</p>
                </div>

                <Card className="p-5 space-y-6 bg-zinc-900 border-white/10">
                    {/* Prompt Section */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                <SparklesIcon className="w-4 h-4 text-indigo-500"/> Creative Vision
                            </label>
                            <button 
                                onClick={handleEnhancePrompt}
                                disabled={!prompt || isEnhancing}
                                className="text-[10px] flex items-center gap-1 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
                            >
                                {isEnhancing ? <span className="animate-pulse">Enhancing...</span> : <><BoltIcon className="w-3 h-3" /> AI Enhance</>}
                            </button>
                        </div>
                        <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your video in detail (e.g. A futuristic sneaker floating in zero gravity, neon lighting, 4k resolution...)"
                            rows={5}
                            className="bg-zinc-950 border-white/10 text-sm focus:border-indigo-500/50 resize-none shadow-inner leading-relaxed"
                        />
                    </div>

                    {/* Style Grid */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Visual Style</label>
                        <div className="grid grid-cols-2 gap-2">
                            {STYLES.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setStyle(s.id)}
                                    className={`relative overflow-hidden rounded-lg p-3 text-left transition-all duration-200 border ${style === s.id ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-white/5 hover:border-white/20'}`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-20`}></div>
                                    <span className={`relative z-10 text-xs font-medium ${style === s.id ? 'text-white' : 'text-zinc-400'}`}>{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Technical Settings */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Format</label>
                            <div className="flex flex-col gap-1">
                                {ASPECT_RATIOS.map(ratio => (
                                    <button
                                        key={ratio.id}
                                        onClick={() => setAspectRatio(ratio.id)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-all border ${aspectRatio === ratio.id ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' : 'bg-zinc-950 text-zinc-500 border-transparent hover:bg-white/5'}`}
                                    >
                                        {ratio.icon}
                                        {ratio.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Duration</label>
                             <div className="flex flex-col gap-1">
                                 {DURATIONS.map(d => (
                                     <button
                                        key={d}
                                        onClick={() => setDuration(d)}
                                        className={`flex items-center justify-center px-3 py-2 rounded text-xs font-medium transition-all border ${duration === d ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' : 'bg-zinc-950 text-zinc-500 border-transparent hover:bg-white/5'}`}
                                     >
                                         {d}
                                     </button>
                                 ))}
                             </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <Button 
                            onClick={handleGenerate} 
                            isLoading={isGenerating} 
                            disabled={!prompt} 
                            size="lg" 
                            className="w-full shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-shadow duration-300"
                        >
                            <FilmIcon className="w-5 h-5 mr-2" />
                            {isGenerating ? 'Generating...' : 'Generate Video'}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Right Panel: Viewport */}
            <div className="w-full lg:w-8/12 h-full flex flex-col animate-fade-in">
                <div className="flex-1 bg-[#050505] rounded-2xl border border-white/10 relative overflow-hidden flex flex-col shadow-2xl">
                    {/* Header */}
                    <div className="h-14 border-b border-white/5 bg-zinc-900/50 flex items-center px-6 justify-between backdrop-blur-md z-20">
                         <div className="flex items-center gap-2">
                             <div className="flex gap-1.5 mr-4">
                                 <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                 <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                             </div>
                             <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                 {aspectRatio === '16:9' ? 'Landscape' : aspectRatio === '9:16' ? 'Portrait' : 'Square'} • {duration}
                             </span>
                         </div>
                         {generatedVideoUrl && (
                            <a href={generatedVideoUrl} download={`promo-${Date.now()}.mp4`}>
                                <Button size="sm" variant="secondary" className="h-8 text-xs gap-1 bg-white/5 border-white/10 hover:bg-white/10">
                                    <ArrowDownTrayIcon className="w-3 h-3" /> Export MP4
                                </Button>
                            </a>
                         )}
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 relative flex items-center justify-center p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-zinc-950/90">
                         {/* Background Glow for activity */}
                         {isGenerating && (
                             <div className="absolute inset-0 bg-indigo-900/10 animate-pulse duration-[3s]"></div>
                         )}

                         <div 
                            className={`relative shadow-2xl transition-all duration-700 ease-in-out bg-black ring-1 ring-white/10 overflow-hidden ${
                                aspectRatio === '16:9' ? 'w-full aspect-video max-w-4xl' : 
                                aspectRatio === '9:16' ? 'h-full aspect-[9/16] max-h-full' : 
                                'h-full aspect-square max-h-full'
                            }`}
                         >
                             {isGenerating ? (
                                 /* Enhanced Loading State */
                                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-50">
                                     <div className="w-2/3 max-w-xs space-y-6">
                                        {/* Loading Icon */}
                                        <div className="relative mx-auto w-24 h-24">
                                            <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <CpuChipIcon className="w-8 h-8 text-indigo-400 animate-pulse" />
                                            </div>
                                        </div>

                                        {/* Text Details */}
                                        <div className="text-center space-y-1">
                                            <p className="text-white font-medium text-sm tracking-wide animate-pulse">{loadingStage}</p>
                                            <p className="text-zinc-500 text-xs font-mono">Sora 2 Model • {duration} • {style}</p>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                                                <span>Progress</span>
                                                <span>{Math.round(progress)}%</span>
                                            </div>
                                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden w-full">
                                                <div 
                                                    className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-300 ease-out" 
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                     </div>
                                     
                                     {/* Mock Terminal Output */}
                                     <div className="absolute bottom-4 left-4 right-4 h-20 bg-black/50 rounded border border-white/5 p-3 font-mono text-[9px] text-zinc-500 overflow-hidden hidden sm:block">
                                         <p className="text-zinc-400">> Request initialized: {currentJobId}</p>
                                         <p style={{opacity: progress > 10 ? 1 : 0}}>> Analyzing prompt tokens...</p>
                                         <p style={{opacity: progress > 30 ? 1 : 0}}>> Generating latent space vectors...</p>
                                         <p style={{opacity: progress > 60 ? 1 : 0}}>> Upscaling to high definition...</p>
                                         <p className="animate-pulse text-indigo-500 mt-1">_</p>
                                     </div>
                                 </div>
                             ) : generatedVideoUrl ? (
                                 /* Video Player */
                                 <video 
                                    src={generatedVideoUrl} 
                                    className="w-full h-full object-cover" 
                                    controls 
                                    autoPlay 
                                    loop
                                 />
                             ) : (
                                 /* Empty State */
                                 <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-800">
                                     <FilmIcon className="w-20 h-20 opacity-20 mb-4" />
                                     <p className="text-sm font-medium text-zinc-600 uppercase tracking-widest">No Video Loaded</p>
                                     <p className="text-xs text-zinc-700 mt-2 max-w-xs text-center">Select your style and enter a prompt to generate a cinematic clip.</p>
                                 </div>
                             )}
                             
                             {/* Overlay Lines (Decorative) */}
                             {!generatedVideoUrl && !isGenerating && (
                                 <>
                                     <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20"></div>
                                     <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20"></div>
                                     <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20"></div>
                                     <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20"></div>
                                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                         <div className="w-4 h-4 text-white/10">+</div>
                                     </div>
                                 </>
                             )}
                         </div>
                    </div>

                    {/* Footer Timeline Placeholder */}
                    <div className="h-16 bg-zinc-900 border-t border-white/5 px-6 flex items-center gap-4">
                        <button className="text-zinc-500 hover:text-white transition-colors" disabled={!generatedVideoUrl}>
                             <PlayIcon className="w-5 h-5" />
                        </button>
                        <div className="flex-1 h-10 bg-zinc-950 rounded border border-white/5 relative overflow-hidden">
                             {/* Fake timeline tracks */}
                             <div className="absolute top-2 bottom-2 left-0 right-0 flex flex-col justify-center gap-1 px-2">
                                 <div className="h-1 bg-indigo-900/30 rounded-full w-full"></div>
                                 <div className="h-1 bg-purple-900/30 rounded-full w-3/4"></div>
                             </div>
                             {/* Playhead */}
                             <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-zinc-700"></div>
                             
                             {/* Loading timeline indication */}
                             {isGenerating && (
                                 <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                             )}
                        </div>
                        <div className="text-xs font-mono text-zinc-500">
                            00:00 / {duration}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoVideosPage;
