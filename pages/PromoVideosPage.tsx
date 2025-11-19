import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { VideoCameraIcon, SparklesIcon, FilmIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const VIDEO_STYLES = ['Cinematic', 'Dynamic', 'Minimalist', 'Corporate', 'Vibrant', 'Moody'];
const VIDEO_DURATIONS = ['10s', '15s'];

const PromoVideosPage: React.FC = () => {
    const { addCreation } = useAppContext();
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [duration, setDuration] = useState('10s');
    const [style, setStyle] = useState(VIDEO_STYLES[0]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;

        setIsGenerating(true);
        addCreation({
            type: 'PROMO_VIDEO',
            title: `Promo: ${prompt.substring(0, 40)}...`,
            params: { prompt, aspectRatio, style, duration },
            status: 'Pending'
        });
        
        setTimeout(() => {
            setIsGenerating(false);
            navigate('/creations');
        }, 500);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                    <FilmIcon className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-display text-white">Cinematic Promo</h1>
                    <p className="text-zinc-400">Generate broadcast-quality video clips.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                     <Card className="p-8 space-y-8 bg-zinc-900 border-white/10">
                        <div>
                            <Textarea
                                label="Vision Prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the video in detail (e.g., A drone shot of a futuristic city at sunset with neon lights)"
                                rows={6}
                                className="text-lg bg-zinc-950 font-medium border-white/10"
                            />
                            <p className="text-xs text-zinc-500 mt-2 text-right">Be descriptive for best results.</p>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 mb-4 uppercase tracking-wider">Visual Style</label>
                            <div className="grid grid-cols-3 gap-3">
                                {VIDEO_STYLES.map(s => (
                                    <button 
                                        key={s} 
                                        onClick={() => setStyle(s)}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border ${style === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-zinc-950 text-zinc-400 border-white/10 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button onClick={handleGenerate} isLoading={isGenerating} disabled={!prompt} className="w-full !py-4 text-lg" size="lg">
                            <SparklesIcon className="w-6 h-6 mr-2" />
                            Generate Video
                        </Button>
                    </Card>
                </div>
                
                <div className="lg:col-span-1">
                    <Card className="p-6 space-y-6 h-full bg-zinc-900/50 border-white/10">
                         <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Output Settings</h3>
                         
                         <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-3">Aspect Ratio</label>
                            <div className="flex flex-col gap-3">
                                {['16:9', '9:16'].map(ratio => (
                                    <button 
                                        key={ratio} 
                                        onClick={() => setAspectRatio(ratio)}
                                        className={`flex items-center p-4 rounded-xl border transition-all ${aspectRatio === ratio ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/10 bg-zinc-950 text-zinc-500 hover:border-white/20'}`}
                                    >
                                        <div className={`border-2 border-current rounded-sm mr-4 flex-shrink-0 ${ratio === '16:9' ? 'w-10 h-6' : 'w-6 h-10'}`}></div>
                                        <div className="text-left">
                                            <span className="font-medium block text-sm">{ratio === '16:9' ? 'Landscape' : 'Portrait'}</span>
                                            <span className="text-xs opacity-60 block">{ratio === '16:9' ? 'YouTube / TV' : 'Reels / TikTok'}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-3">Duration</label>
                            <div className="flex gap-3">
                                {VIDEO_DURATIONS.map(d => (
                                    <button 
                                        key={d} 
                                        onClick={() => setDuration(d)}
                                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${duration === d ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/10 bg-zinc-950 text-zinc-500 hover:border-white/20'}`}
                                    >
                                        <ClockIcon className="w-4 h-4" />
                                        <span className="font-medium text-sm">{d}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="p-4 bg-indigo-900/20 border border-indigo-500/20 rounded-xl mt-auto">
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></div>
                                <p className="text-xs text-indigo-200 leading-relaxed">
                                    Powered by Sora 2.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PromoVideosPage;