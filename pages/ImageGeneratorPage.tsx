import React, { useState } from 'react';
import { Textarea } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import aiService from '../services/aiService';
import { useAppContext } from '../contexts/AppContext';
import { PhotoIcon } from '@heroicons/react/24/outline';

const ImageGeneratorPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { addCreation, t, creations } = useAppContext();
    
    const imageCreations = creations.filter(c => c.type === 'IMAGE');

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setImageUrl(null);
        try {
            const url = await aiService.generateImage(prompt, aspectRatio);
            setImageUrl(url);
            addCreation({
                type: 'IMAGE',
                title: prompt.substring(0, 50),
                params: { prompt, aspectRatio },
                // The resultUrl will be added automatically by the context's polling effect
            });
        } catch (error) {
            console.error("Image generation failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Generator Controls */}
            <div className="lg:col-span-1 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Image Generator</h1>
                    <p className="text-text-secondary">Create stunning visuals from text prompts.</p>
                </div>
                <Card className="p-6">
                    <div className="space-y-4">
                        <Textarea 
                            label={t('image_generator.prompt')}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A cinematic photo of a robot holding a red skateboard"
                            rows={5}
                        />
                        
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">{t('image_generator.aspect_ratio')}</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['1:1', '16:9', '9:16', '4:3', '3:4'].map(ratio => (
                                    <Button 
                                        key={ratio} 
                                        variant={aspectRatio === ratio ? 'primary' : 'secondary'}
                                        onClick={() => setAspectRatio(ratio)}
                                        className="text-xs"
                                    >
                                        {ratio}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Button onClick={handleGenerate} isLoading={isLoading} className="w-full !py-3">
                            {t('image_generator.generate')}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Gallery */}
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Your Images</h2>
                 {imageCreations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {imageCreations.map(job => (
                            <Card key={job.id} className="group relative overflow-hidden">
                                <div className="aspect-square bg-background-dark flex items-center justify-center">
                                    {job.status === 'Completed' && job.resultUrl ? (
                                        <img src={job.resultUrl} alt={job.title} className="w-full h-full object-cover" />
                                    ) : (
                                       <div className="flex flex-col items-center text-text-secondary">
                                            <PhotoIcon className="w-10 h-10"/>
                                            <span className="text-sm mt-2">{job.status}...</span>
                                       </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                    <p className="text-white text-sm font-medium line-clamp-2">{job.title}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                 ) : (
                    <Card className="p-12 text-center border-dashed border-border-dark">
                        <p className="text-text-secondary">Your generated images will appear here.</p>
                    </Card>
                 )}
            </div>
        </div>
    );
};

export default ImageGeneratorPage;