
import React, { useState } from 'react';
import { Textarea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import aiService from '../../services/aiService';
import { useAppContext } from '../../contexts/AppContext';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { addCreation, t } = useAppContext();
    
    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setImageUrl(null);
        const urls = await aiService.generateImage(prompt, aspectRatio);
        setImageUrl(urls[0] || null);
        setIsLoading(false);
    };

    const handleSave = () => {
        if (!imageUrl) return;
        addCreation({
            type: 'IMAGE',
            title: prompt.substring(0, 50),
            params: { prompt, aspectRatio },
            status: 'Completed',
            resultUrl: imageUrl
        });
        // In a real app, you'd likely want to handle the blob directly
        alert('Image saved to Creations Hub!');
    };

    return (
        <Card className="p-6">
            <div className="space-y-4">
                <Textarea 
                    label={t('image_generator.prompt')}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A cinematic photo of a robot holding a red skateboard"
                />
                
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('image_generator.aspect_ratio')}</label>
                    <div className="flex gap-2">
                        {['1:1', '16:9', '9:16', '4:3', '3:4'].map(ratio => (
                            <Button 
                                key={ratio} 
                                variant={aspectRatio === ratio ? 'primary' : 'secondary'}
                                onClick={() => setAspectRatio(ratio)}
                            >
                                {ratio}
                            </Button>
                        ))}
                    </div>
                </div>

                <Button onClick={handleGenerate} isLoading={isLoading} className="w-full">
                    {t('image_generator.generate')}
                </Button>

                {(isLoading || imageUrl) && (
                    <div className="mt-6">
                        {isLoading && <div className="text-center p-8">Generating...</div>}
                        {imageUrl && (
                            <div className="space-y-4">
                                <img src={imageUrl} alt={prompt} className="rounded-lg w-full object-contain" />
                                <div className="flex gap-2">
                                    <a href={imageUrl} download={`${prompt.substring(0,20)}.png`} className="w-full">
                                        <Button variant="secondary" className="w-full">{t('image_generator.download')}</Button>
                                    </a>
                                    <Button onClick={handleSave} className="w-full">{t('image_generator.save_to_creations')}</Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ImageGenerator;
