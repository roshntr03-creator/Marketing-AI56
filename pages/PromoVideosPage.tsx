
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
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <FilmIcon className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-display">Cinematic Promo</h1>
                    <p className="text-text-secondary">Generate broadcast-quality video clips using <span className="text-primary font-bold">Sora 2</span>.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                     <Card className="p-8 space-y-8 border-primary/20 shadow-xl">
                        <div>
                            <Textarea
                                label="Vision Prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the video in detail (e.g., A drone shot of a futuristic city at sunset with neon lights)"
                                rows={6}
                                className="text-lg bg-background-dark font-medium"
                            />
                            <p className="text-xs text-text-muted mt-2 text-right">Be descriptive for best results.</p>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-text-secondary mb-4 uppercase tracking-wider">Visual Style</label>
                            <div className="grid grid-cols-3 gap-3">
                                {VIDEO_STYLES.map(s => (
                                    <button 
                                        key={s} 
                                        onClick={() => setStyle(s)}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border ${style === s ? 'bg-primary text-white border-primary shadow-md' : 'bg-background-dark text-text-secondary border-surface-border hover:border-white/30'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button onClick={handleGenerate} isLoading={isGenerating} disabled={!prompt} className="w-full !py-4 text-lg shadow-lg shadow-primary/25" size="lg">
                            <SparklesIcon className="w-6 h-6 mr-2" />
                            Generate Video
                        </Button>
                    </Card>
                </div>
                
                <div className="lg:col-span-1">
                    <Card className="p-6 space-y-6 h-full bg-background-dark/50">
                         <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Output Settings</h3>
                         
                         <div>
                            <label className="block text-sm font-medium text-text-primary mb-3">Aspect Ratio</label>
                            <div className="flex flex-col gap-3">
                                {['16:9', '9:16'].map(ratio => (
                                    <button 
                                        key={ratio} 
                                        onClick={() => setAspectRatio(ratio)}
                                        className={`flex items-center p-4 rounded-xl border transition-all ${aspectRatio === ratio ? 'border-primary bg-primary/10 text-white shadow-inner' : 'border-surface-border bg-background-dark text-text-secondary hover:border-primary/50'}`}
                                    >
                                        <div className={`border-2 border-current rounded-sm mr-4 flex-shrink-0 ${ratio === '16:9' ? 'w-10 h-6' : 'w-6 h-10'}`}></div>
                                        <div className="text-left">
                                            <span className="font-bold block">{ratio === '16:9' ? 'Landscape' : 'Portrait'}</span>
                                            <span className="text-xs opacity-70 block">{ratio === '16:9' ? 'YouTube / TV' : 'Reels / TikTok'}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-3">Duration</label>
                            <div className="flex gap-3">
                                {VIDEO_DURATIONS.map(d => (
                                    <button 
                                        key={d} 
                                        onClick={() => setDuration(d)}
                                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${duration === d ? 'border-primary bg-primary/10 text-white' : 'border-surface-border bg-background-dark text-text-secondary hover:border-primary/50'}`}
                                    >
                                        <ClockIcon className="w-4 h-4" />
                                        <span className="font-bold">{d}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mt-auto">
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                                <p className="text-xs text-blue-100 leading-relaxed">
                                    Powered by Sora 2. Generation typically takes 2-3 minutes. The process happens in the cloud, so you can navigate away safely.
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
