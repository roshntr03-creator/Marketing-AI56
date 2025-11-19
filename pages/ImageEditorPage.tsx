import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PhotoIcon, ArrowUpOnSquareIcon, SparklesIcon } from '@heroicons/react/24/outline';
import aiService from '../services/aiService';

const ImageEditorPage: React.FC = () => {
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [sourcePreview, setSourcePreview] = useState<string | null>(null);
    const [instruction, setInstruction] = useState('');
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSourceFile(file);
            setSourcePreview(URL.createObjectURL(file));
            setEditedImageUrl(null); 
        }
    };

    const handleEdit = async () => {
        if (!sourceFile || !instruction) return;
        setIsLoading(true);
        setEditedImageUrl(null);
        try {
             const result = await aiService.editImage(sourceFile, instruction);
             setEditedImageUrl(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold font-display text-white">Magic Editor</h1>
                    <p className="text-sm text-zinc-400">Instruction-based image editing powered by Gemini.</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                {/* Toolbar */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                    <Card className="p-5 flex-shrink-0 space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">1. Upload Source</h3>
                        <label className="aspect-square border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-xl flex flex-col items-center justify-center text-zinc-400 p-4 relative bg-white/5 transition-colors group cursor-pointer">
                            {sourcePreview ? (
                                <img src={sourcePreview} alt="Source" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                        <ArrowUpOnSquareIcon className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs text-center">Click to upload</p>
                                </>
                            )}
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </label>
                    </Card>

                    <Card className="p-5 flex-shrink-0 space-y-4">
                         <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">2. Instruction</h3>
                        <Input 
                            value={instruction} 
                            onChange={e => setInstruction(e.target.value)} 
                            placeholder="e.g., Make it snowy, Add a hat..."
                            disabled={!sourceFile}
                            className="bg-zinc-900/50 border-white/10"
                        />
                        <Button onClick={handleEdit} isLoading={isLoading} disabled={!sourceFile || !instruction} className="w-full" size="lg">
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Execute Edit
                        </Button>
                    </Card>
                </div>

                {/* Main Canvas */}
                <div className="lg:col-span-9 h-full">
                    <Card className="h-full p-0 overflow-hidden bg-[#0f0f11] flex items-center justify-center relative border-white/10">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                        
                        {isLoading ? (
                            <div className="text-center space-y-4 z-10">
                                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-indigo-400 font-mono animate-pulse">Processing pixels...</p>
                            </div>
                        ) : editedImageUrl ? (
                            <div className="relative w-full h-full p-8">
                                <img src={editedImageUrl} alt="Edited result" className="w-full h-full object-contain shadow-2xl drop-shadow-2xl" />
                                <div className="absolute bottom-8 right-8 flex gap-2">
                                    <a href={editedImageUrl} download="edited-image.png">
                                        <Button variant="primary">Download Result</Button>
                                    </a>
                                    <Button variant="secondary" onClick={() => setEditedImageUrl(null)}>Reset</Button>
                                </div>
                            </div>
                        ) : (
                             <div className="text-center text-zinc-700 z-10">
                                <PhotoIcon className="w-24 h-24 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">Result Canvas</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ImageEditorPage;