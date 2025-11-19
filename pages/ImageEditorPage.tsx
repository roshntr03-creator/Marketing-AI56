import React, { useState, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { 
    PhotoIcon, 
    ArrowUpOnSquareIcon, 
    SparklesIcon, 
    ArrowDownTrayIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import aiService from '../services/aiService';

const ImageEditorPage: React.FC = () => {
    const { addCreation } = useAppContext();
    
    // State
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [sourcePreview, setSourcePreview] = useState<string | null>(null);
    const [instruction, setInstruction] = useState('');
    const [resultPreview, setResultPreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComparing, setIsComparing] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSourceFile(file);
            setSourcePreview(URL.createObjectURL(file));
            setResultPreview(null); // Reset result on new upload
        }
    };

    const handleEdit = async () => {
        if (!sourceFile || !instruction) return;
        setIsProcessing(true);
        
        try {
            const resultUrl = await aiService.editImage(sourceFile, instruction);
            setResultPreview(resultUrl);
            
            // Save to creations
            addCreation({
                type: 'IMAGE',
                title: `Edit: ${instruction.substring(0, 30)}...`,
                params: { 
                    prompt: instruction, 
                    originalImageName: sourceFile.name 
                },
                status: 'Completed',
                resultUrl: resultUrl
            });

        } catch (error) {
            console.error("Edit failed", error);
            // Ideally show error toast
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setSourceFile(null);
        setSourcePreview(null);
        setResultPreview(null);
        setInstruction('');
    };

    return (
        <div className="h-[calc(100vh-9rem)] flex flex-col lg:flex-row gap-6 animate-fade-in pb-2">
            {/* Left Panel */}
            <div className="w-full lg:w-4/12 flex flex-col h-full bg-[#09090b] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                 <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 backdrop-blur-sm">
                    <div>
                        <h1 className="text-xl font-bold font-display text-white">Magic Editor</h1>
                        <p className="text-zinc-400 text-xs">Generative Fill & Edit</p>
                    </div>
                    {sourcePreview && (
                         <button onClick={handleReset} className="text-xs text-zinc-500 hover:text-white transition-colors">
                             Reset
                         </button>
                    )}
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-zinc-900/20">
                    {/* Upload Section */}
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <PhotoIcon className="w-3 h-3"/> Source Image
                        </label>
                        
                        {!sourcePreview ? (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-[4/3] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 transition-all cursor-pointer group"
                            >
                                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <ArrowUpOnSquareIcon className="w-6 h-6 text-zinc-400 group-hover:text-indigo-400" />
                                </div>
                                <p className="text-sm font-medium text-zinc-300">Upload Image</p>
                                <p className="text-xs text-zinc-500 mt-1">JPG, PNG up to 5MB</p>
                            </div>
                        ) : (
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 group">
                                <img src={sourcePreview} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                                    <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                                        Change Image
                                    </Button>
                                </div>
                            </div>
                        )}
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="hidden" 
                        />
                    </div>

                    {/* Instruction Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <SparklesIcon className="w-3 h-3"/> Edit Instruction
                        </label>
                        <div className="relative group">
                             <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-20 transition duration-500 blur"></div>
                             <Textarea 
                                value={instruction}
                                onChange={e => setInstruction(e.target.value)}
                                placeholder="Describe the change (e.g. 'Change the background to a beach', 'Add a red hat', 'Make it cyberpunk style')..."
                                rows={5}
                                disabled={!sourceFile}
                                className="relative bg-zinc-950 border-white/10 focus:border-indigo-500/50 resize-none shadow-inner p-4 rounded-xl text-sm leading-relaxed"
                             />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-zinc-900 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <Button 
                        onClick={handleEdit} 
                        isLoading={isProcessing} 
                        disabled={!sourceFile || !instruction}
                        size="lg"
                        className="w-full py-4 text-base shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Generate Edit
                    </Button>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-8/12 h-full flex flex-col animate-fade-in">
                 <div className="flex-1 bg-[#050505] rounded-2xl border border-white/10 relative overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/5">
                    {/* Toolbar */}
                    <div className="h-14 border-b border-white/5 bg-zinc-900/50 flex items-center px-6 justify-between backdrop-blur-md z-20 flex-shrink-0">
                         <div className="flex items-center gap-3">
                             {resultPreview && (
                                 <button
                                    onMouseDown={() => setIsComparing(true)}
                                    onMouseUp={() => setIsComparing(false)}
                                    onMouseLeave={() => setIsComparing(false)}
                                    onTouchStart={() => setIsComparing(true)}
                                    onTouchEnd={() => setIsComparing(false)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-medium text-zinc-300 transition-all active:scale-95 select-none cursor-pointer"
                                 >
                                     <EyeIcon className="w-4 h-4" />
                                     Hold to Compare
                                 </button>
                             )}
                         </div>
                         
                         {resultPreview && (
                             <a href={resultPreview} download="edited-image.png">
                                <Button size="sm" variant="secondary" className="h-8 text-xs gap-1 bg-white/5 border-white/10 hover:bg-white/10">
                                    <ArrowDownTrayIcon className="w-3 h-3" /> Download
                                </Button>
                             </a>
                         )}
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 relative flex items-center justify-center p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-zinc-950/90 overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                        
                        <div className="relative max-w-full max-h-full shadow-2xl ring-1 ring-white/10 bg-black overflow-hidden flex items-center justify-center transition-all">
                             {!sourcePreview ? (
                                 <div className="flex flex-col items-center justify-center text-zinc-800 p-12">
                                     <PhotoIcon className="w-20 h-20 opacity-20 mb-4" />
                                     <p className="text-sm font-medium text-zinc-600 uppercase tracking-widest">No Image Loaded</p>
                                 </div>
                             ) : (
                                 <>
                                     {/* Result Image */}
                                     {resultPreview && !isProcessing && (
                                         <img 
                                            src={resultPreview} 
                                            className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${isComparing ? 'opacity-0' : 'opacity-100'}`}
                                            alt="Result" 
                                         />
                                     )}
                                     
                                     {/* Source Image (visible if comparing or no result yet) */}
                                     <img 
                                        src={sourcePreview} 
                                        className={`max-w-full max-h-full object-contain absolute inset-0 m-auto transition-opacity duration-200 ${isComparing || (!resultPreview && !isProcessing) ? 'opacity-100' : 'opacity-0'}`}
                                        alt="Source"
                                     />
                                     
                                     {/* Comparison Label Overlay */}
                                     {isComparing && resultPreview && (
                                         <div className="absolute top-4 left-4 px-2 py-1 bg-black/70 text-white text-xs rounded font-bold uppercase tracking-wider pointer-events-none">
                                             Original
                                         </div>
                                     )}

                                     {/* Processing Overlay */}
                                     {isProcessing && (
                                         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                              <div className="relative w-20 h-20 mb-4">
                                                  <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
                                                  <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                                  <SparklesIcon className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                              </div>
                                              <p className="text-indigo-300 font-mono text-sm uppercase tracking-widest animate-pulse">Applying Magic...</p>
                                         </div>
                                     )}
                                 </>
                             )}
                        </div>
                    </div>

                 </div>
            </div>
        </div>
    );
};

export default ImageEditorPage;