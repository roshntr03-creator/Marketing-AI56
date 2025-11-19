
import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { 
    SparklesIcon, 
    FilmIcon, 
    ArrowDownTrayIcon,
    TvIcon,
    DevicePhoneMobileIcon,
    Square2StackIcon,
    BoltIcon,
    SwatchIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import aiService from '../services/aiService';

const STYLES = [
    { id: 'Cinematic', label: 'Cinematic', color: 'from-slate-900 to-slate-800', desc: 'High contrast, movie-like quality' },
    { id: '3D Render', label: '3D Animation', color: 'from-indigo-900 to-purple-900', desc: 'Clean, Pixar-style geometry' },
    { id: 'Cyberpunk', label: 'Cyberpunk', color: 'from-pink-900 to-rose-900', desc: 'Neon lights, futuristic grit' },
    { id: 'Analog Film', label: 'Vintage Film', color: 'from-amber-900/40 to-orange-900/40', desc: 'Grainy, nostalgic aesthetic' },
    { id: 'Minimalist', label: 'Minimalist', color: 'from-gray-800 to-gray-900', desc: 'Clean lines, solid colors' },
    { id: 'Nature', label: 'Nature', color: 'from-emerald-900 to-teal-900', desc: 'Organic, natural lighting' },
];

const DURATIONS = ['5s', '10s', '15s'];
const ASPECT_RATIOS = [
    { id: '16:9', label: 'Landscape', icon: <TvIcon className="w-4 h-4"/> },
    { id: '9:16', label: 'Portrait', icon: <DevicePhoneMobileIcon className="w-4 h-4"/> },
    { id: '1:1', label: 'Square', icon: <Square2StackIcon className="w-4 h-4"/> },
];

type Tab = 'Vision' | 'Style' | 'Options';

const PromoVideosPage: React.FC = () => {
    const { addCreation, creations } = useAppContext();
    
    // State
    const [activeTab, setActiveTab] = useState<Tab>('Vision');
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
        if (!prompt) {
            setActiveTab('Vision');
            return;
        }

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
        <div className="h-[calc(100vh-9rem)] flex flex-col lg:flex-row gap-6 animate-fade-in pb-2">
            {/* Left Panel: Studio Controls */}
            <div className="w-full lg:w-4/12 flex flex-col h-full bg-[#09090b] border border-white/10 rounded-2xl overflow-hidden shadow-xl relative">
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-sm">
                    <div>
                        <h1 className="text-xl font-bold font-display text-white">Promo Studio</h1>
                        <p className="text-zinc-400 text-xs">Professional video generator</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5 bg-zinc-900/30">
                    <TabButton active={activeTab === 'Vision'} onClick={() => setActiveTab('Vision')} icon={<SparklesIcon className="w-4 h-4"/>} label="Vision" />
                    <TabButton active={activeTab === 'Style'} onClick={() => setActiveTab('Style')} icon={<SwatchIcon className="w-4 h-4"/>} label="Style" />
                    <TabButton active={activeTab === 'Options'} onClick={() => setActiveTab('Options')} icon={<Cog6ToothIcon className="w-4 h-4"/>} label="Options" />
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-zinc-900/20 relative">
                    <div className="p-6">
                        {activeTab === 'Vision' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Prompt Description</label>
                                    <button 
                                        onClick={handleEnhancePrompt}
                                        disabled={!prompt || isEnhancing}
                                        className="text-[10px] flex items-center gap-1 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors px-2 py-1 rounded hover:bg-indigo-500/10"
                                    >
                                        {isEnhancing ? <span className="animate-pulse">Enhancing...</span> : <><BoltIcon className="w-3 h-3" /> Auto-Enhance</>}
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-focus-within:opacity-100 transition duration-500 blur"></div>
                                    <Textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Describe your video in detail (e.g. A futuristic sneaker floating in zero gravity, neon lighting, 4k resolution...)"
                                        rows={12}
                                        className="relative bg-zinc-950 border-white/10 text-sm focus:border-indigo-500/50 resize-none shadow-inner leading-relaxed p-4 rounded-xl"
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-2">
                                    Tip: Be specific about lighting, camera movement, and mood.
                                </p>
                            </div>
                        )}

                        {activeTab === 'Style' && (
                             <div className="space-y-3 animate-fade-in">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-4">Select Visual Style</label>
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

                        {activeTab === 'Options' && (
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
                                         {DURATIONS.map(d => (
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

                                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                    <h4 className="text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <BoltIcon className="w-3 h-3" /> Pro Tip
                                    </h4>
                                    <p className="text-xs text-indigo-200/70 leading-relaxed">
                                        For social media stories and Reels, select the <strong>9:16 Portrait</strong> ratio and a <strong>15s</strong> duration for maximum engagement.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sticky Footer Action */}
                <div className="p-6 border-t border-white/5 bg-zinc-900 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <Button 
                        onClick={handleGenerate} 
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

            {/* Right Panel: Viewport */}
            <div className="w-full lg:w-8/12 h-full flex flex-col animate-fade-in">
                <div className="flex-1 bg-[#050505] rounded-2xl border border-white/10 relative overflow-hidden flex flex-col shadow-2xl">
                    {/* Viewport Header */}
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
                                aspectRatio === '16:9' ? 'w-full aspect-video max-w-5xl max-h-[calc(100%-2rem)]' : 
                                aspectRatio === '9:16' ? 'h-full aspect-[9/16] max-h-[calc(100%-2rem)]' : 
                                'h-full aspect-square max-h-[calc(100%-2rem)]'
                            }`}
                         >
                             {isGenerating ? (
                                 /* Enhanced Visibility Loading State */
                                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-50">
                                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                                     <div className="relative z-10 w-64 space-y-8">
                                        
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
                                            </div>

                                            {/* Glowing effect behind */}
                                            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full -z-10 opacity-50 animate-pulse"></div>
                                        </div>

                                        {/* Progress Bars / Stages */}
                                        <div className="space-y-3 text-center">
                                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                                                {loadingStage}...
                                            </div>
                                            {/* Segmented Bar */}
                                            <div className="flex gap-1 h-1.5 w-full px-4">
                                                {[0, 25, 50, 75].map((threshold, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`flex-1 rounded-full transition-colors duration-500 ${
                                                            progress > threshold ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-zinc-800'
                                                        }`}
                                                    ></div>
                                                ))}
                                            </div>
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
                                     <p className="text-xs text-zinc-700 mt-2 max-w-xs text-center">Define your vision in the Studio panel to begin.</p>
                                 </div>
                             )}
                         </div>
                    </div>

                    {/* Footer Timeline Placeholder */}
                    <div className="h-16 bg-zinc-900 border-t border-white/5 px-6 flex items-center gap-4 flex-shrink-0">
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

const TabButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({active, onClick, icon, label}) => (
    <button 
        onClick={onClick}
        className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors relative ${
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
