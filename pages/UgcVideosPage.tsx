
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { 
    ArrowUpOnSquareIcon, 
    SparklesIcon, 
    VideoCameraIcon, 
    PhotoIcon, 
    AdjustmentsHorizontalIcon,
    CheckCircleIcon,
    ClockIcon,
    MapPinIcon,
    FaceSmileIcon,
    UserIcon,
    MicrophoneIcon,
    MusicalNoteIcon,
    ArrowPathIcon,
    PlayIcon,
    PauseIcon,
    SpeakerWaveIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import aiService from '../services/aiService';
import * as storage from '../services/storageService';

const GENDERS = ['Female', 'Male'];
const VIBES = ['Energetic', 'Calm', 'Luxurious', 'Funny', 'Serious', 'Authentic'];
const SETTINGS = ['Studio', 'Living Room', 'Outdoor Park', 'Modern Office', 'Cozy Cafe', 'Street Style'];
const VIDEO_LENGTHS = ['10s', '15s', '30s', '60s'];
const VOICES = ['Sarah (Energetic)', 'Mike (Deep)', 'Emma (Soft)', 'Alex (Bold)'];
const MUSIC_TRACKS = ['Trending Pop', 'Lo-Fi Chill', 'Upbeat Funk', 'Cinematic', 'No Music'];

const UgcVideosPage: React.FC = () => {
    const navigate = useNavigate();
    const { addCreation, brandProfile, creations } = useAppContext();

    // State
    const [step, setStep] = useState(1);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [script, setScript] = useState('');
    const [interactionStyles, setInteractionStyles] = useState<string[]>([]);
    const [selectedInteraction, setSelectedInteraction] = useState<string>('');
    const [videoPrompt, setVideoPrompt] = useState('');
    
    const [gender, setGender] = useState(GENDERS[0]);
    const [vibe, setVibe] = useState(VIBES[0]);
    const [setting, setSetting] = useState(SETTINGS[0]);
    
    // Audio State
    const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
    const [selectedMusic, setSelectedMusic] = useState(MUSIC_TRACKS[0]);
    
    const [videoLength, setVideoLength] = useState('15s');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    
    const [isLoadingScript, setIsLoadingScript] = useState(false);
    const [isRefiningScript, setIsRefiningScript] = useState(false);
    
    // Generation & Playback State
    const [currentJobId, setCurrentJobId] = useState<string | null>(null);
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const currentJob = creations.find(c => c.id === currentJobId);
    const isGenerating = currentJob?.status === 'Generating' || currentJob?.status === 'Pending';
    const generatedVideoUrl = currentJob?.status === 'Completed' ? currentJob.resultUrl : null;

    // Scroll ref for progressive disclosure
    const controlsRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleGenerateScript = async () => {
        if (!imageFile) return;
        setIsLoadingScript(true);
        try {
            // Pass videoLength to ensure script is timed correctly
            const result = await aiService.generateUGCScript(imageFile, videoLength, brandProfile || undefined);
            setScript(result.script);
            setInteractionStyles(result.interactionStyles);
            setSelectedInteraction(result.interactionStyles[0] || '');
            
            // Use the AI-generated visual description to populate the prompt
            // This ensures explicit visual requirements are met as per user request
            if (result.visualDescription) {
                 setVideoPrompt(result.visualDescription);
            } else if (!videoPrompt) {
                 setVideoPrompt(`A high-quality UGC video shot on an iPhone. ${vibe} atmosphere.`);
            }

            setStep(2);
            setTimeout(() => {
                controlsRef.current?.scrollTo({ top: 300, behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error("Script generation failed:", error);
            alert("Failed to generate script. Please try again.");
        } finally {
            setIsLoadingScript(false);
        }
    };

    const handleRefineScript = async (action: 'shorten' | 'hook' | 'emojify') => {
        if (!script) return;
        setIsRefiningScript(true);
        try {
            let instruction = "";
            switch (action) {
                case 'shorten': instruction = "Make this script shorter and punchier, under 30 seconds."; break;
                case 'hook': instruction = "Add a viral 'Wait for it' style hook to the beginning of this script."; break;
                case 'emojify': instruction = "Add relevant emojis to this script for social media context."; break;
            }
            const refined = await aiService.generateContent("script revision", `Original Script: "${script}". Instruction: ${instruction}`, "Social Media Expert");
            setScript(refined);
        } catch (e) {
            console.error(e);
        } finally {
            setIsRefiningScript(false);
        }
    };

    const handleGenerateVideo = async () => {
        if (!script || !imageFile) return;
        
        // Reset view to show loading
        setShowResult(true);

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            const imageId = `img-${Date.now()}`;
            
            try {
                await storage.saveAsset(imageId, base64Data);
                
                // If prompt is empty, construct one from tags, though AI usually fills it now
                const finalPrompt = videoPrompt || `UGC video. ${gender} actor. ${vibe} vibe. ${setting} setting.`;

                const jobId = `ugc-${Date.now()}`;
                
                const jobParams = {
                    script,
                    imageBase64Id: imageId, 
                    videoPrompt: finalPrompt,
                    gender,
                    vibe,
                    setting,
                    selectedInteraction,
                    videoLength,
                    voice: selectedVoice,
                    music: selectedMusic,
                    hasLogo: !!logoFile,
                };

                // Add to context queue - let AppContext handle the async call
                addCreation({
                    id: jobId,
                    type: 'UGC_VIDEO',
                    title: `UGC: ${finalPrompt.substring(0,30) || imageFile.name}`,
                    params: jobParams,
                    status: 'Pending'
                });
                
                setCurrentJobId(jobId);
                // Don't navigate away. Allow user to review here.
            } catch (e) {
                console.error("Storage failed", e);
            }
        };
        reader.readAsDataURL(imageFile);
    };

    const togglePreviewPlay = () => {
        setIsPlayingPreview(!isPlayingPreview);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-8 animate-fade-in pb-4">
            
            {/* Left Panel: The Studio Controls */}
            <div ref={controlsRef} className="w-full lg:w-5/12 flex flex-col h-full overflow-y-auto custom-scrollbar pr-2 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold font-display text-white">UGC Studio</h1>
                    <p className="text-zinc-400 text-sm">Create authentic, viral-ready product videos.</p>
                </div>

                {/* Section 1: Source */}
                <section className={`transition-all duration-500 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-50'}`}>
                    <SectionHeader step={1} title="Source Media" currentStep={step} />
                    
                    <Card className={`p-0 overflow-hidden border-white/10 transition-all duration-300 ${step === 1 ? 'ring-1 ring-indigo-500/30' : ''}`}>
                         {!imagePreview ? (
                            <label className="block w-full aspect-[3/2] relative group cursor-pointer bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-indigo-500/30 shadow-xl">
                                        <ArrowUpOnSquareIcon className="w-8 h-8" />
                                    </div>
                                    <p className="font-medium text-sm">Upload Product Shot</p>
                                    <p className="text-xs opacity-60 mt-1">Best results with clear lighting</p>
                                </div>
                                <div className="absolute inset-0 border-2 border-dashed border-white/10 group-hover:border-indigo-500/30 m-4 rounded-xl transition-colors pointer-events-none"></div>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                         ) : (
                             <div className="relative p-4 bg-zinc-900 flex items-center justify-between border-b border-white/5">
                                 <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-cover bg-center border border-white/10 shadow-lg" style={{backgroundImage: `url(${imagePreview})`}}></div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{imageFile?.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <p className="text-xs text-zinc-500">Ready for analysis</p>
                                        </div>
                                    </div>
                                 </div>
                                 {step === 1 && (
                                     <button onClick={() => {setImageFile(null); setImagePreview(null);}} className="px-3 py-1.5 rounded-md text-xs font-medium bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/5">
                                        Replace
                                     </button>
                                 )}
                             </div>
                         )}

                         {step === 1 && (
                             <div className="p-5 bg-zinc-900/50 space-y-4">
                                 {/* Target Duration Selector */}
                                 <div className="flex justify-between items-center px-1">
                                     <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                        <ClockIcon className="w-4 h-4"/> Target Duration
                                     </div>
                                     <div className="flex gap-1.5">
                                         {VIDEO_LENGTHS.map(len => (
                                             <button
                                                 key={len}
                                                 onClick={() => setVideoLength(len)}
                                                 className={`px-3 py-1.5 text-[10px] font-medium rounded-md transition-all border ${videoLength === len ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-zinc-800 text-zinc-400 border-white/5 hover:bg-zinc-700 hover:text-zinc-200'}`}
                                             >
                                                 {len}
                                             </button>
                                         ))}
                                     </div>
                                 </div>

                                 <Button onClick={handleGenerateScript} disabled={!imageFile} isLoading={isLoadingScript} className="w-full shadow-lg shadow-indigo-500/20" size="lg">
                                     <SparklesIcon className="w-5 h-5 mr-2" />
                                     Generate Magic Script
                                 </Button>
                             </div>
                         )}
                    </Card>
                </section>

                {/* Section 2: Direction */}
                {step >= 2 && (
                    <section className="animate-fade-in-up">
                        <SectionHeader step={2} title="Creative Direction" currentStep={step} />

                        <Card className="p-6 space-y-8 bg-zinc-900 border-white/10">
                            {/* Script Editor */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                        <AdjustmentsHorizontalIcon className="w-4 h-4"/> Script ({videoLength})
                                    </label>
                                    <div className="flex gap-1">
                                        <IconButton icon={<ArrowPathIcon className="w-3 h-3"/>} label="Shorten" onClick={() => handleRefineScript('shorten')} disabled={isRefiningScript} />
                                        <IconButton icon={<SparklesIcon className="w-3 h-3"/>} label="Hook" onClick={() => handleRefineScript('hook')} disabled={isRefiningScript} />
                                        <IconButton icon={<FaceSmileIcon className="w-3 h-3"/>} label="Emoji" onClick={() => handleRefineScript('emojify')} disabled={isRefiningScript} />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <Textarea 
                                        value={script} 
                                        onChange={e => setScript(e.target.value)} 
                                        rows={4} 
                                        className="bg-zinc-950 border-white/10 font-mono text-sm leading-relaxed focus:border-indigo-500/50 resize-none shadow-inner"
                                    />
                                    {isRefiningScript && (
                                        <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                                            <SparklesIcon className="w-6 h-6 text-indigo-400 animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Visual Prompt - RESTORED */}
                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="flex justify-between items-end">
                                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                        <VideoCameraIcon className="w-4 h-4"/> Visual Prompt
                                    </label>
                                    <span className="text-[10px] text-zinc-600 uppercase">Describes Scene</span>
                                </div>
                                <Textarea 
                                    value={videoPrompt} 
                                    onChange={e => setVideoPrompt(e.target.value)} 
                                    rows={4} 
                                    placeholder="Describe the actor, lighting, and camera movement (e.g. A young woman in a sunny park holding the product...)"
                                    className="bg-zinc-950 border-white/10 text-sm focus:border-indigo-500/50 resize-none shadow-inner"
                                />
                            </div>

                            {/* Audio Atmosphere */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Audio Atmosphere</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <SelectDropdown 
                                        label="Voice Persona" 
                                        icon={<MicrophoneIcon className="w-4 h-4"/>} 
                                        options={VOICES} 
                                        selected={selectedVoice} 
                                        onChange={setSelectedVoice} 
                                    />
                                    <SelectDropdown 
                                        label="Background Music" 
                                        icon={<MusicalNoteIcon className="w-4 h-4"/>} 
                                        options={MUSIC_TRACKS} 
                                        selected={selectedMusic} 
                                        onChange={setSelectedMusic} 
                                    />
                                </div>
                            </div>

                            {/* Visual Style */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Visual Style Tags</h4>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <SelectTile label="Vibe" icon={<FaceSmileIcon className="w-3 h-3"/>} options={VIBES} selected={vibe} onSelect={setVibe} />
                                    <SelectTile label="Setting" icon={<MapPinIcon className="w-3 h-3"/>} options={SETTINGS} selected={setting} onSelect={setSetting} />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                     <SelectTile label="Actor" icon={<UserIcon className="w-3 h-3"/>} options={GENDERS} selected={gender} onSelect={setGender} />
                                     <div>
                                         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Action</label>
                                         <div className="relative">
                                            <select 
                                                value={selectedInteraction}
                                                onChange={(e) => setSelectedInteraction(e.target.value)}
                                                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-indigo-500/50 transition-all hover:border-white/20 cursor-pointer"
                                            >
                                                {interactionStyles.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <div className="absolute right-3 top-3 pointer-events-none text-zinc-500">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                         </div>
                                     </div>
                                </div>
                            </div>

                            {step === 2 && (
                                <Button onClick={() => setStep(3)} className="w-full mt-4" variant="secondary" rightIcon={<ArrowUpOnSquareIcon className="w-4 h-4 rotate-90"/>}>
                                    Next: Final Polish
                                </Button>
                            )}
                        </Card>
                    </section>
                )}

                {/* Section 3: Production */}
                {step >= 3 && (
                    <section className="animate-fade-in-up pb-10">
                        <SectionHeader step={3} title="Production" currentStep={step} />
                        
                        <Card className="p-6 space-y-6 bg-zinc-900 border-white/10">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                                    <ClockIcon className="w-3 h-3"/> Confirmed Duration
                                </label>
                                <div className="flex bg-zinc-950 p-1 rounded-lg border border-white/5 opacity-80">
                                    {VIDEO_LENGTHS.map(len => (
                                        <button
                                            key={len}
                                            onClick={() => setVideoLength(len)}
                                            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all duration-200 ${videoLength === len ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                                        >
                                            {len}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                                    <PhotoIcon className="w-3 h-3"/> Brand Watermark
                                </label>
                                <label className="flex items-center gap-4 p-3 border border-dashed border-white/10 rounded-lg hover:bg-zinc-950/50 cursor-pointer transition-colors group bg-zinc-950/20">
                                    <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center text-zinc-600 group-hover:text-indigo-400 group-hover:border-indigo-500/30 border border-transparent transition-all">
                                        {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover rounded" /> : <ArrowUpOnSquareIcon className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-zinc-300">{logoFile ? logoFile.name : 'Upload Logo (Optional)'}</p>
                                        <p className="text-[10px] text-zinc-600">PNG with transparency recommended</p>
                                    </div>
                                    <input type="file" accept="image/png" onChange={handleLogoFileChange} className="hidden" />
                                </label>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <Button onClick={handleGenerateVideo} isLoading={isGenerating} size="lg" className="w-full shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300">
                                    <VideoCameraIcon className="w-5 h-5 mr-2" />
                                    Start Production
                                </Button>
                                <p className="text-[10px] text-center text-zinc-600 mt-3">Review generated video in the viewport on the right</p>
                            </div>
                        </Card>
                    </section>
                )}
            </div>

            {/* Right Panel: The Viewport */}
            <div className="hidden lg:flex lg:w-7/12 h-full flex-col animate-fade-in">
                 <div className="flex-1 bg-[#09090b] rounded-2xl border border-white/10 relative overflow-hidden flex flex-col shadow-2xl">
                     {/* Viewport Header */}
                     <div className="h-14 border-b border-white/5 bg-zinc-900/50 flex items-center px-6 justify-between backdrop-blur-md z-20">
                         <div className="flex gap-2">
                             <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E]"></div>
                             <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24]"></div>
                             <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29]"></div>
                         </div>
                         <div className="flex items-center gap-4">
                             <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-2 py-1 rounded bg-white/5">
                                 {videoLength} • {gender} • {vibe}
                             </span>
                         </div>
                         {generatedVideoUrl && (
                            <a href={generatedVideoUrl} download="ugc-video.mp4">
                                <Button size="sm" variant="ghost" className="h-8 text-xs gap-1">
                                    <ArrowDownTrayIcon className="w-3 h-3" /> Export
                                </Button>
                            </a>
                         )}
                     </div>

                     {/* Viewport Canvas */}
                     <div className="flex-1 relative bg-[#050505] flex items-center justify-center p-8 overflow-hidden">
                         {/* Background Grid Effect */}
                         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                         
                         {/* Phone Frame */}
                         <div className="relative h-full aspect-[9/16] bg-black rounded-[2.5rem] border-8 border-zinc-800 shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/5 transform transition-transform duration-700">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-xl z-30"></div>

                            {/* Screen Content */}
                            <div className="relative flex-1 bg-zinc-900 w-full h-full overflow-hidden group">
                                {showResult && isGenerating ? (
                                    /* Generating State */
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
                                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                                        <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest animate-pulse">Processing Video...</p>
                                        <p className="text-zinc-600 text-[10px] mt-2">Running Sora 2 Generation</p>
                                    </div>
                                ) : showResult && generatedVideoUrl ? (
                                    /* Generated Result State */
                                    <video 
                                        src={generatedVideoUrl} 
                                        className="w-full h-full object-cover" 
                                        controls 
                                        autoPlay 
                                        loop
                                    />
                                ) : imagePreview ? (
                                    /* Preview State */
                                    <>
                                        <div 
                                            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear ${isPlayingPreview ? 'scale-125' : 'scale-100'}`} 
                                            style={{backgroundImage: `url(${imagePreview})`, opacity: 0.6}}
                                        ></div>
                                        
                                        {/* Fake UI Overlay */}
                                        <div className="absolute top-4 right-4 z-20 flex flex-col gap-4 pt-8">
                                            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                                                <UserIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                                                <FaceSmileIcon className="w-5 h-5 text-white" />
                                            </div>
                                        </div>

                                        {/* Script Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20 flex flex-col justify-end h-1/2">
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-600 border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                                                        AI
                                                    </div>
                                                    <span className="text-sm font-bold text-white shadow-black drop-shadow-md">@MarketingAI</span>
                                                </div>
                                                {script ? (
                                                     <p className="text-white text-sm font-medium leading-snug drop-shadow-md line-clamp-4">
                                                        {script}
                                                    </p>
                                                ) : (
                                                    <div className="h-4 w-3/4 bg-white/20 rounded animate-pulse mb-2"></div>
                                                )}
                                            </div>
                                            
                                            {/* Music Ticker */}
                                            <div className="flex items-center gap-2 text-white/80 text-xs">
                                                <MusicalNoteIcon className="w-3 h-3 animate-bounce" />
                                                <span className="w-32 truncate">{selectedMusic} - Original Audio</span>
                                            </div>
                                        </div>
                                        
                                        {/* Logo Overlay */}
                                        {logoPreview && (
                                            <div className="absolute top-12 left-6 w-16 h-16 z-20">
                                                <img src={logoPreview} className="w-full h-full object-contain drop-shadow-lg" />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* Empty State */
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700 space-y-4">
                                        <VideoCameraIcon className="w-16 h-16 opacity-20" />
                                        <p className="text-xs font-mono uppercase tracking-widest opacity-50">No Signal</p>
                                    </div>
                                )}
                            </div>
                         </div>
                     </div>
                     
                     {/* Viewport Timeline / Footer */}
                     <div className="h-24 bg-zinc-900 border-t border-white/5 p-4 flex flex-col justify-between">
                         <div className="flex justify-between items-center text-xs text-zinc-400 mb-2">
                            <div className="flex items-center gap-2">
                                <button onClick={togglePreviewPlay} className="hover:text-white transition-colors" disabled={!imagePreview && !generatedVideoUrl}>
                                    {isPlayingPreview ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                                </button>
                                <span className="font-mono">00:00 / {videoLength}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <SpeakerWaveIcon className="w-4 h-4" />
                                <div className="w-20 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="w-2/3 h-full bg-indigo-500"></div>
                                </div>
                            </div>
                         </div>
                         
                         {/* Timeline Visual */}
                         <div className="w-full h-8 bg-zinc-950 rounded border border-white/5 relative overflow-hidden flex items-center px-1 gap-0.5">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`w-1 rounded-full bg-zinc-800 ${isPlayingPreview ? 'animate-pulse' : ''}`} 
                                    style={{height: `${Math.random() * 100}%`, opacity: Math.random() * 0.5 + 0.2}}
                                ></div>
                            ))}
                            {/* Playhead */}
                            <div className={`absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 ${isPlayingPreview ? 'left-full transition-all duration-[15s] ease-linear' : 'left-0'}`}></div>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

const SectionHeader: React.FC<{step: number, title: string, currentStep: number}> = ({step, title, currentStep}) => (
    <div className="flex items-center gap-3 mb-4">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${currentStep > step ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)]'}`}>
            {currentStep > step ? <CheckCircleIcon className="w-4 h-4"/> : step}
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">{title}</h3>
        <div className="flex-1 h-px bg-white/5 ml-2"></div>
    </div>
);

const IconButton: React.FC<{icon: React.ReactNode, label: string, onClick: () => void, disabled: boolean}> = ({icon, label, onClick, disabled}) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className="flex items-center gap-1 px-2 py-1 rounded border border-white/10 bg-zinc-900 hover:bg-white/5 text-[10px] font-medium text-zinc-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {icon}
        {label}
    </button>
);

const SelectDropdown: React.FC<{label: string, icon: React.ReactNode, options: string[], selected: string, onChange: (val: string) => void}> = ({label, icon, options, selected, onChange}) => (
    <div>
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
            {icon} {label}
        </label>
        <div className="relative">
            <select 
                value={selected}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-indigo-500/50 transition-all hover:border-white/20 cursor-pointer"
            >
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <div className="absolute right-3 top-3 pointer-events-none text-zinc-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    </div>
);

const SelectTile: React.FC<{label: string, icon: React.ReactNode, options: string[], selected: string, onSelect: (val: string) => void}> = ({label, icon, options, selected, onSelect}) => (
    <div>
        <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
            {icon} {label}
        </label>
        <div className="grid grid-cols-2 gap-1.5">
            {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => onSelect(opt)}
                    className={`px-2 py-2.5 rounded-md text-[10px] font-medium border transition-all truncate ${selected === opt ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' : 'bg-zinc-950 border-white/5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
)

export default UgcVideosPage;
