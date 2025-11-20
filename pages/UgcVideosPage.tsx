import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { 
    ArrowUpOnSquareIcon, 
    SparklesIcon, 
    VideoCameraIcon, 
    PlayIcon,
    ArrowDownTrayIcon,
    DocumentTextIcon,
    UserGroupIcon,
    FilmIcon,
    MapPinIcon,
    FaceSmileIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import aiService from '../services/aiService';
import * as storage from '../services/storageService';

// --- Constants ---
const VIDEO_LENGTHS = ['10s', '15s'];
const VIDEO_MODELS = [
    { id: 'sora-2-text-to-video', name: 'Sora 2 (Kie)', desc: 'Professional UGC realism' },
];

const ENVIRONMENTS = [
    { id: 'living-room', name: 'Living Room', desc: 'Cozy, authentic home vibe', icon: '🏠' },
    { id: 'studio', name: 'Minimal Studio', desc: 'Clean, professional background', icon: '📸' },
    { id: 'outdoor', name: 'Urban Outdoor', desc: 'Natural lighting, energetic', icon: '🌳' },
    { id: 'office', name: 'Modern Office', desc: 'Professional business setting', icon: '🏢' },
];

const STORAGE_KEY = 'ugc_page_state';
type Tab = 'Blueprint' | 'Casting' | 'Production';

const UgcVideosPage: React.FC = () => {
    const { addCreation, brandProfile, creations } = useAppContext();

    // --- State ---
    const [activeTab, setActiveTab] = useState<Tab>('Blueprint');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [videoLength, setVideoLength] = useState('15s');
    
    // Scripting
    const [scriptHook, setScriptHook] = useState('');
    const [scriptBody, setScriptBody] = useState('');
    const [scriptCTA, setScriptCTA] = useState('');
    const [visualPrompt, setVisualPrompt] = useState('');
    
    // Casting
    const [avatarDescription, setAvatarDescription] = useState('');
    const [selectedEnv, setSelectedEnv] = useState(ENVIRONMENTS[0].id);
    
    // Production
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState(VIDEO_MODELS[0].id);

    // Process State
    const [isGeneratingScript, setIsGeneratingScript] = useState(false);
    const [currentJobId, setCurrentJobId] = useState<string | null>(null);

    const currentJob = creations.find(c => c.id === currentJobId);
    const isGeneratingVideo = currentJob?.status === 'Generating' || currentJob?.status === 'Pending';
    const generatedVideoUrl = currentJob?.status === 'Completed' ? currentJob.resultUrl : null;

    // --- Persistence ---
    useEffect(() => {
        const savedState = sessionStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                // We don't restore files (imageFile) as they can't be stringified, 
                // but we restore text fields
                setScriptHook(parsed.scriptHook || '');
                setScriptBody(parsed.scriptBody || '');
                setScriptCTA(parsed.scriptCTA || '');
                setVisualPrompt(parsed.visualPrompt || '');
                setAvatarDescription(parsed.avatarDescription || '');
                setSelectedEnv(parsed.selectedEnv || ENVIRONMENTS[0].id);
                setVideoLength(parsed.videoLength || '15s');
                if (parsed.currentJobId) setCurrentJobId(parsed.currentJobId);
            } catch (e) { console.error(e); }
        }
    }, []);

    useEffect(() => {
        const state = {
            scriptHook, scriptBody, scriptCTA, visualPrompt, 
            avatarDescription, selectedEnv, 
            videoLength, currentJobId
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [scriptHook, scriptBody, scriptCTA, visualPrompt, avatarDescription, selectedEnv, videoLength, currentJobId]);

    // --- Handlers ---

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const generateScript = async () => {
        if (!imageFile) return;
        setIsGeneratingScript(true);
        try {
            const res = await aiService.generateUGCScript(imageFile, videoLength, brandProfile || undefined);
            setScriptHook(res.hook);
            setScriptBody(res.body);
            setScriptCTA(res.cta);
            if (res.visualDescription) setVisualPrompt(res.visualDescription);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGeneratingScript(false);
        }
    };

    const startProduction = () => {
        if (!scriptHook || !imageFile) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            const imageId = `img-${Date.now()}`;
            try {
                await storage.saveAsset(imageId, base64Data);
                const jobId = `ugc-${Date.now()}`;
                
                addCreation({
                    id: jobId,
                    type: 'UGC_VIDEO',
                    title: `UGC: ${scriptHook.substring(0, 20)}...`,
                    params: {
                        scriptHook, scriptBody, scriptCTA,
                        imageBase64Id: imageId,
                        videoPrompt: visualPrompt,
                        avatarDescription,
                        setting: selectedEnv,
                        videoLength,
                        model: selectedModel,
                        hasLogo: !!logoFile
                    },
                    status: 'Pending'
                });
                setCurrentJobId(jobId);
            } catch (e) { console.error(e); }
        };
        reader.readAsDataURL(imageFile);
    };

    return (
        <div className="h-[calc(100vh-9rem)] flex flex-col lg:flex-row gap-6 animate-fade-in pb-2">
            
            {/* LEFT PANEL: STUDIO CONTROLS */}
            <div className="w-full lg:w-5/12 flex flex-col h-full bg-[#09090b] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-5 border-b border-white/5 bg-zinc-900/50 backdrop-blur-sm">
                    <h1 className="text-xl font-bold font-display text-white">UGC Studio</h1>
                    <p className="text-zinc-400 text-xs">Professional Viral Video Creator</p>
                </div>

                {/* Progress Stepper */}
                <div className="flex border-b border-white/5 bg-zinc-900/30 overflow-x-auto scrollbar-none">
                    <TabButton active={activeTab === 'Blueprint'} onClick={() => setActiveTab('Blueprint')} icon={<DocumentTextIcon className="w-4 h-4"/>} label="1. Blueprint" />
                    <TabButton active={activeTab === 'Casting'} onClick={() => setActiveTab('Casting')} icon={<UserGroupIcon className="w-4 h-4"/>} label="2. Casting" />
                    <TabButton active={activeTab === 'Production'} onClick={() => setActiveTab('Production')} icon={<FilmIcon className="w-4 h-4"/>} label="3. Export" />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-zinc-900/20">
                    
                    {/* TAB 1: BLUEPRINT (SCRIPT) */}
                    {activeTab === 'Blueprint' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="p-4 bg-zinc-900 rounded-xl border border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                        <ArrowUpOnSquareIcon className="w-3 h-3"/> Product Source
                                    </label>
                                    {imagePreview && (
                                        <button onClick={() => {setImageFile(null); setImagePreview(null)}} className="text-[10px] text-red-400 hover:text-red-300">Remove</button>
                                    )}
                                </div>
                                {!imagePreview ? (
                                    <label className="block w-full aspect-[3/1] border-2 border-dashed border-white/10 rounded-lg hover:bg-white/5 cursor-pointer transition-colors flex flex-col items-center justify-center gap-2">
                                        <ArrowUpOnSquareIcon className="w-6 h-6 text-zinc-600" />
                                        <span className="text-xs text-zinc-500">Upload Product Image</span>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                ) : (
                                    <div className="flex gap-4 items-center">
                                        <img src={imagePreview} className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                                        <div className="flex-1">
                                            <p className="text-sm text-white font-medium truncate">{imageFile?.name}</p>
                                            <p className="text-xs text-zinc-500">Ready for analysis</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {imageFile && (
                                <Button onClick={generateScript} isLoading={isGeneratingScript} size="lg" className="w-full shadow-lg shadow-indigo-500/20">
                                    <SparklesIcon className="w-5 h-5 mr-2" />
                                    Auto-Generate Magic Script
                                </Button>
                            )}

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">The Hook (0-3s)</label>
                                    <span className="text-[10px] text-zinc-600">Grab attention instantly</span>
                                </div>
                                <Textarea 
                                    value={scriptHook} 
                                    onChange={e => setScriptHook(e.target.value)} 
                                    placeholder="e.g. Stop scrolling! You need to see this..."
                                    rows={2}
                                    className="bg-zinc-950 border-white/10 text-sm focus:border-indigo-500/50"
                                />

                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">The Body (3-12s)</label>
                                    <span className="text-[10px] text-zinc-600">Benefits & Demo</span>
                                </div>
                                <Textarea 
                                    value={scriptBody} 
                                    onChange={e => setScriptBody(e.target.value)} 
                                    rows={4}
                                    className="bg-zinc-950 border-white/10 text-sm focus:border-indigo-500/50"
                                />

                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Call to Action (12-15s)</label>
                                    <span className="text-[10px] text-zinc-600">Closing push</span>
                                </div>
                                <Textarea 
                                    value={scriptCTA} 
                                    onChange={e => setScriptCTA(e.target.value)} 
                                    rows={2}
                                    className="bg-zinc-950 border-white/10 text-sm focus:border-indigo-500/50"
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB 2: CASTING */}
                    {activeTab === 'Casting' && (
                        <div className="space-y-8 animate-fade-in">
                             <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                                    <FaceSmileIcon className="w-4 h-4"/> Creator Persona
                                </label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-focus-within:opacity-100 transition duration-500 blur"></div>
                                    <Textarea 
                                        value={avatarDescription}
                                        onChange={e => setAvatarDescription(e.target.value)}
                                        rows={4}
                                        className="relative bg-zinc-950 border-white/10 text-sm resize-none rounded-xl p-4"
                                        placeholder="Describe the creator (e.g., 'A friendly female tech reviewer in her 20s with glasses', 'An energetic fitness coach in workout gear')..."
                                    />
                                </div>
                             </div>

                             <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                                    <MapPinIcon className="w-4 h-4"/> Shooting Environment
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {ENVIRONMENTS.map(env => (
                                        <button
                                            key={env.id}
                                            onClick={() => setSelectedEnv(env.id)}
                                            className={`p-3 rounded-xl border transition-all text-left ${selectedEnv === env.id ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' : 'bg-zinc-900 text-zinc-400 border-white/5 hover:bg-zinc-800'}`}
                                        >
                                            <span className="text-xl mb-1 block">{env.icon}</span>
                                            <span className="text-xs font-bold block">{env.name}</span>
                                            <span className="text-[10px] opacity-70">{env.desc}</span>
                                        </button>
                                    ))}
                                </div>
                             </div>
                             
                             <div className="pt-4 border-t border-white/5">
                                 <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Visual Prompt (AI Instruction)</label>
                                 <Textarea 
                                     value={visualPrompt}
                                     onChange={e => setVisualPrompt(e.target.value)}
                                     rows={3}
                                     className="text-xs bg-zinc-950 border-white/10"
                                     placeholder="Refine how the AI generates the scene..."
                                 />
                             </div>
                        </div>
                    )}

                    {/* TAB 3: PRODUCTION (WAS 4) */}
                    {activeTab === 'Production' && (
                         <div className="space-y-8 animate-fade-in">
                            <div className="bg-zinc-900 border border-white/10 rounded-xl p-5 space-y-4">
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-sm font-medium text-zinc-300">Target Duration</span>
                                    <div className="flex gap-1">
                                        {VIDEO_LENGTHS.map(len => (
                                            <button 
                                                key={len}
                                                onClick={() => setVideoLength(len)}
                                                className={`px-2 py-1 rounded text-xs font-bold transition-all ${videoLength === len ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                                            >
                                                {len}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-sm font-medium text-zinc-300">AI Model</span>
                                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30">Sora 2.0</span>
                                </div>
                                
                                <div>
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Watermark / Logo</span>
                                    <label className="flex items-center gap-3 p-2 rounded-lg border border-dashed border-white/10 hover:bg-white/5 cursor-pointer">
                                        <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center text-zinc-500">
                                            {logoPreview ? <img src={logoPreview} className="w-full h-full object-contain rounded"/> : <ArrowUpOnSquareIcon className="w-4 h-4" />}
                                        </div>
                                        <span className="text-xs text-zinc-400">{logoFile ? logoFile.name : 'Upload PNG (Optional)'}</span>
                                        <input type="file" accept="image/png" onChange={handleLogoChange} className="hidden" />
                                    </label>
                                </div>
                            </div>
                         </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/5 bg-zinc-900 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <Button 
                        onClick={activeTab === 'Production' ? startProduction : () => setActiveTab(prev => {
                            if (prev === 'Blueprint') return 'Casting';
                            return 'Production';
                        })} 
                        isLoading={isGeneratingVideo} 
                        disabled={!imageFile || (activeTab === 'Production' && !scriptHook)}
                        size="lg" 
                        className="w-full shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 py-4 text-base"
                    >
                        {activeTab === 'Production' ? (
                            <>
                                <FilmIcon className="w-5 h-5 mr-2" />
                                Start Production
                            </>
                        ) : (
                            <>
                                Next Step
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* RIGHT PANEL: PREVIEW PHONE */}
            <div className="w-full lg:w-7/12 h-full flex flex-col animate-fade-in items-center justify-center bg-[#050505] rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                
                {/* Phone Container */}
                <div className="relative h-[90%] aspect-[9/16] bg-black rounded-[2.5rem] border-[6px] border-zinc-800 shadow-2xl overflow-hidden ring-1 ring-white/5">
                    {/* Dynamic Content */}
                    <div className="w-full h-full relative bg-zinc-900 flex flex-col">
                        
                        {isGeneratingVideo ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
                                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                                <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest animate-pulse">Rendering Video...</p>
                            </div>
                        ) : generatedVideoUrl ? (
                            <video src={generatedVideoUrl} className="w-full h-full object-cover" controls autoPlay loop />
                        ) : imagePreview ? (
                            <>
                                {/* Background Image (Simulated) */}
                                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{backgroundImage: `url(${imagePreview})`}}></div>
                                
                                {/* Avatar Mock Overlay */}
                                <div className="absolute top-8 right-4 flex flex-col gap-3 items-center">
                                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden bg-zinc-800 flex items-center justify-center text-zinc-500">
                                        <UserIcon className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col gap-2 text-white">
                                         <div className="p-2 bg-black/30 backdrop-blur rounded-full"><div className="w-5 h-5" /></div>
                                         <div className="p-2 bg-black/30 backdrop-blur rounded-full"><div className="w-5 h-5" /></div>
                                         <div className="p-2 bg-black/30 backdrop-blur rounded-full"><div className="w-5 h-5" /></div>
                                    </div>
                                </div>

                                {/* UI Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                    <div className="mb-4 space-y-1">
                                        <div className="font-bold text-white text-sm drop-shadow-md">@MarketingAI</div>
                                        <p className="text-white/90 text-xs leading-snug line-clamp-2 drop-shadow-md">
                                            {scriptHook || "Your script hook will appear here..."}
                                        </p>
                                        <p className="text-zinc-300 text-[10px] line-clamp-2">
                                            {scriptBody}
                                        </p>
                                        <div className="mt-2 text-[10px] text-indigo-300 font-medium">
                                            {avatarDescription ? `Persona: ${avatarDescription.substring(0, 30)}...` : ''}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Play Button Simulation */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <PlayIcon className="w-8 h-8 text-white ml-1" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-700">
                                <VideoCameraIcon className="w-12 h-12 opacity-20 mb-3" />
                                <p className="text-xs uppercase tracking-widest opacity-50">No Source</p>
                            </div>
                        )}

                    </div>
                </div>
                
                {generatedVideoUrl && (
                    <div className="absolute bottom-8 right-8">
                        <a href={generatedVideoUrl} download="ugc_video.mp4">
                            <Button variant="secondary" leftIcon={<ArrowDownTrayIcon className="w-4 h-4"/>}>Download</Button>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

const TabButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({active, onClick, icon, label}) => (
    <button 
        onClick={onClick}
        className={`flex-none px-5 py-3 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors relative min-w-[120px] ${
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

export default UgcVideosPage;