
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { ArrowUpOnSquareIcon, SparklesIcon, VideoCameraIcon, ArrowUturnLeftIcon, PhotoIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import aiService from '../services/aiService';
import * as storage from '../services/storageService';
import Stepper from '../components/ui/Stepper';

const GENDERS = ['Any', 'Female', 'Male'];
const VIBES = ['Energetic', 'Calm', 'Luxurious', 'Funny', 'Serious'];
const SETTINGS = ['Studio', 'Home', 'Outdoor', 'Office', 'Cafe'];
const VIDEO_LENGTHS = ['10s', '15s', '2x15s'];

const UgcVideosPage: React.FC = () => {
    const navigate = useNavigate();
    const { addCreation, brandProfile } = useAppContext();

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
    const [videoLength, setVideoLength] = useState(VIDEO_LENGTHS[1]);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [splitScriptParts, setSplitScriptParts] = useState<{part1: string, part2: string} | null>(null);
    
    const [isLoadingScript, setIsLoadingScript] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSplitting, setIsSplitting] = useState(false);
    
    useEffect(() => {
        if (videoLength === '2x15s' && script) {
            const split = async () => {
                setIsSplitting(true);
                try {
                    const parts = await aiService.splitScript(script);
                    setSplitScriptParts(parts);
                } catch (e) {
                    console.error("Split failed", e);
                } finally {
                    setIsSplitting(false);
                }
            };
            split();
        } else {
            setSplitScriptParts(null);
        }
    }, [videoLength, script]);

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
            const result = await aiService.generateUGCScript(imageFile, brandProfile || undefined);
            setScript(result.script);
            setInteractionStyles(result.interactionStyles);
            setSelectedInteraction(result.interactionStyles[0] || '');
            setStep(2);
        } catch (error) {
            console.error("Script generation failed:", error);
            alert("Failed to generate script. Please try again.");
        } finally {
            setIsLoadingScript(false);
        }
    };

    const handleGenerateVideo = async () => {
        if (!script || !imageFile) return;
        
        setIsGenerating(true);

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            const imageId = `img-${Date.now()}`;
            
            try {
                await storage.saveAsset(imageId, base64Data);
                
                const jobParams = {
                    script: videoLength === '2x15s' && splitScriptParts ? [splitScriptParts.part1, splitScriptParts.part2] : script,
                    imageBase64Id: imageId, 
                    videoPrompt,
                    gender,
                    vibe,
                    setting,
                    selectedInteraction,
                    videoLength,
                    hasLogo: !!logoFile,
                };

                addCreation({
                    type: 'UGC_VIDEO',
                    title: `UGC: ${videoPrompt.substring(0,30) || imageFile.name}`,
                    params: jobParams,
                    status: 'Pending'
                });
                
                setIsGenerating(false);
                navigate('/creations');
            } catch (e) {
                console.error("Storage failed", e);
                setIsGenerating(false);
            }
        };
        reader.readAsDataURL(imageFile);
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="animate-fade-in">
                        <div className="flex flex-col items-center justify-center space-y-6">
                            {/* Replaced custom input with label + native input for reliability */}
                            <label className="w-full max-w-md aspect-video border-2 border-dashed border-white/10 hover:border-indigo-500/50 bg-white/5 rounded-xl flex flex-col items-center justify-center text-zinc-500 p-4 relative group transition-colors cursor-pointer">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md shadow-lg" />
                                ) : (
                                    <div className="text-center group-hover:scale-105 transition-transform">
                                        <ArrowUpOnSquareIcon className="w-12 h-12 mb-3 mx-auto text-indigo-500" />
                                        <p className="font-medium text-zinc-300">Upload Product Image</p>
                                        <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </label>
                            
                            <Button onClick={handleGenerateScript} disabled={!imageFile} isLoading={isLoadingScript} className="w-full max-w-md" size="lg">
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                {isLoadingScript ? 'Analyzing Image...' : 'Analyze & Generate Script'}
                            </Button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                             <Textarea label="AI Script" value={script} onChange={e => setScript(e.target.value)} rows={6} className="bg-zinc-900/50 font-mono text-sm border-white/10" />
                             <Textarea label="Scene Prompt" value={videoPrompt} onChange={e => setVideoPrompt(e.target.value)} placeholder="Describe the scene details..." rows={6} className="bg-zinc-900/50 border-white/10" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                            <OptionSelector title="Influencer" options={GENDERS} selected={gender} onSelect={setGender} />
                            <OptionSelector title="Vibe" options={VIBES} selected={vibe} onSelect={setVibe} />
                            <OptionSelector title="Setting" options={SETTINGS} selected={setting} onSelect={setSetting} />
                        </div>
                        
                        <div className="pt-4">
                             <h4 className="font-semibold text-zinc-300 mb-3 text-sm uppercase tracking-wider">Camera Movement</h4>
                             <div className="flex flex-wrap gap-3">
                                {interactionStyles.map(style => (
                                    <button 
                                        key={style} 
                                        onClick={() => setSelectedInteraction(style)}
                                        className={`px-4 py-2 rounded-lg text-sm border transition-all ${selectedInteraction === style ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20'}`}
                                    >
                                        {style}
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex justify-center">
                             <div className="bg-zinc-900 p-1 rounded-lg border border-white/10 inline-flex">
                                {VIDEO_LENGTHS.map(len => (
                                    <button
                                        key={len}
                                        onClick={() => setVideoLength(len)}
                                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${videoLength === len ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
                                    >
                                        {len}
                                    </button>
                                ))}
                             </div>
                        </div>

                        {isSplitting && <div className="text-center text-indigo-400 animate-pulse">Optimizing script for 2-part series...</div>}
                        
                        {splitScriptParts && (
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-4 bg-zinc-900/50 border-indigo-500/30">
                                    <span className="text-xs font-bold text-indigo-400 uppercase mb-2 block">Part 1</span>
                                    <p className="text-sm text-zinc-400">{splitScriptParts.part1}</p>
                                </Card>
                                <Card className="p-4 bg-zinc-900/50 border-indigo-500/30">
                                    <span className="text-xs font-bold text-indigo-400 uppercase mb-2 block">Part 2</span>
                                    <p className="text-sm text-zinc-400">{splitScriptParts.part2}</p>
                                </Card>
                            </div>
                        )}

                        <div className="max-w-md mx-auto">
                            <h4 className="font-semibold text-zinc-300 mb-3 text-center">Brand Watermark</h4>
                            <div className="border border-dashed border-white/10 rounded-lg p-4 flex items-center justify-between bg-white/5">
                                <div className="flex items-center gap-3">
                                     <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center overflow-hidden">
                                        {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover" /> : <PhotoIcon className="w-6 h-6 text-zinc-500" />}
                                     </div>
                                     <div>
                                         <p className="text-sm font-medium text-white">{logoFile ? logoFile.name : 'No logo selected'}</p>
                                         <p className="text-xs text-zinc-500">PNG with transparency recommended</p>
                                     </div>
                                </div>
                                <div className="relative">
                                    <label className="cursor-pointer">
                                        <div className="inline-flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">
                                            Upload
                                        </div>
                                        <input 
                                            type="file" 
                                            accept="image/png" 
                                            onChange={handleLogoFileChange} 
                                            className="hidden" 
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                    <VideoCameraIcon className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-display text-white">UGC Creator</h1>
                    <p className="text-zinc-400">Generate authentic, viral-style product videos from a single image.</p>
                </div>
            </div>

            <Card className="p-8 relative overflow-hidden border-white/10 bg-zinc-900/30">
                <div className="mb-8">
                    <Stepper steps={['Upload & Analyze', 'Direct & Script', 'Produce']} currentStep={step} />
                </div>

                {renderStepContent()}
                
                <div className="mt-10 flex justify-between items-center pt-6 border-t border-white/5">
                    <Button variant="ghost" onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="text-zinc-400 hover:text-white">
                        <ArrowUturnLeftIcon className="w-4 h-4 mr-2" />
                        {step === 1 ? 'Cancel' : 'Back'}
                    </Button>
                    
                    {step < 3 && (
                         <Button onClick={() => setStep(step + 1)} disabled={!script} rightIcon={<PlayIcon className="w-4 h-4" />}>
                            Next Step
                        </Button>
                    )}
                    {step === 3 && (
                        <Button onClick={handleGenerateVideo} isLoading={isGenerating} disabled={!script} size="lg" className="px-8">
                            <VideoCameraIcon className="w-5 h-5 mr-2" />
                            Start Generation
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

const OptionSelector: React.FC<{title: string, options: string[], selected: string, onSelect: (option: string) => void}> = ({ title, options, selected, onSelect }) => (
    <div>
        <h4 className="font-semibold text-zinc-300 mb-3 text-sm uppercase tracking-wider">{title}</h4>
        <div className="flex flex-wrap gap-2">
            {options.map(option => (
                <button 
                    key={option} 
                    onClick={() => onSelect(option)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${selected === option ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-white/10 bg-transparent text-zinc-400 hover:border-white/20 hover:text-white'}`}
                >
                    {option}
                </button>
            ))}
        </div>
    </div>
);

export default UgcVideosPage;
