
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
            setLoadingStage('Initializing');
            
            const interval = setInterval(() => {
                setProgress(prev => {
                    // Non-linear progress simulation
                    const increment = Math.max(0.2, (95 - prev) / 40); 
                    const newProg = prev + Math.random() * increment;
                    
                    if (newProg > 10 && newProg < 30) setLoadingStage('Analysis');
                    if (newProg > 30 && newProg < 60) setLoadingStage('Synthesis');
                    if (newProg > 60 && newProg < 80) setLoadingStage('Rendering');
                    if (newProg > 80) setLoadingStage('Finalizing');
                    
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
                    <div className="h-14 border-b border-white/5 bg-zinc-900/50 flex items-center px-6 justify-between backdrop-blur-md z-20 flex-shrink-0">
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

                    {/* Canvas Stage */}
                    <div className="flex-1 relative flex items-center justify-center p-4 lg:p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-zinc-950/90 overflow-hidden">
                         {/* Grid Background */}
                         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                         {/* Background Pulse during generation */}
                         {isGenerating && (
                             <div className="absolute inset-0 bg-indigo-900/5 animate-pulse duration-[3s]"></div>
                         )}

                         {/* Video Container - Strictly constrained dimensions to prevent overflow */}
                         <div 
                            className={`relative shadow-2xl transition-all duration-500 ease-in-out bg-black ring-1 ring-white/10 overflow-hidden mx-auto flex items-center justify-center ${
                                aspectRatio === '16:9' ? 'w-full aspect-video max-w-4xl' : 
                                aspectRatio === '9:16' ? 'h-full aspect-[9/16] max-h-[600px]' : 
                                'h-full aspect-square max-h-[600px]'
                            }`}
                         >
                             {isGenerating ? (
                                 /* Enhanced Visibility Loading State */
                                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-50">
                                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                                     <div className="relative z-10 w-64 space-y-8">
                                        
                                        {/* Header */}
                                        <div className="text-center">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold tracking-wider mb-2 animate-pulse">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                GENERATING PREVIEW
                                            </div>
                                        </div>

                                        {/* Central Pressure Gauge */}
                                        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                                            {/* Outer Ring */}
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
                                            
                                            {/* Inner Content */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-3xl font-bold text-white font-display tracking-tighter">{Math.round(progress)}%</span>
                                                <span className="text-[10px] text-zinc-500 font-mono mt-1 uppercase">Pressure</span>
                                            </div>

                                            {/* Glowing effect behind */}
                                            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full -z-10 opacity-50 animate-pulse"></div>
                                        </div>

                                        {/* Progress Bars / Stages */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                                <span>Stage: {loadingStage}</span>
                                            </div>
                                            {/* Segmented Bar */}
                                            <div className="flex gap-1 h-1.5 w-full">
                                                {[0, 25, 50, 75].map((threshold, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`flex-1 rounded-full transition-colors duration-500 ${
                                                            progress > threshold ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-zinc-800'
                                                        }`}
                                                    ></div>
                                                ))}
                                            </div>
                                            <p className="text-center text-[10px] text-zinc-600 pt-2">Optimizing Tensor Cores • Sora 2</p>
                                        </div>
                                     </div>
                                 </div>
                             ) : generatedVideoUrl ? (
                                 /* Video Player */
                                 <video 
                                    src={generatedVideoUrl} 
                                    className="w-full h-full object-contain bg-black" 
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
                    <div className="h-16 bg-zinc-900 border-t border-white/5 px-6 flex items-center gap-4 flex-shrink-0">
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
