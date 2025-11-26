
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { 
    SparklesIcon, 
    DocumentDuplicateIcon, 
    BeakerIcon, 
    AdjustmentsHorizontalIcon, 
    CodeBracketIcon, 
    ArrowPathIcon, 
    CommandLineIcon, 
    BoltIcon, 
    LightBulbIcon, 
    CameraIcon, 
    SwatchIcon, 
    EyeIcon, 
    ArrowDownTrayIcon, 
    CubeIcon 
} from '@heroicons/react/24/outline';
import { EnhancedPrompt } from '../types';
import aiService from '../services/aiService';
import { useAppContext } from '../contexts/AppContext';

const QUICK_PRESETS = [
    "A futuristic city with neon lights",
    "Portrait of an elderly warrior, detailed textures",
    "Isometric 3D room, cute pastel colors",
    "Cyberpunk street food vendor, rainy night"
];

const PromptEnhancerPage: React.FC = () => {
    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [enhancedPrompt, setEnhancedPrompt] = useState<EnhancedPrompt | null>(null);
    const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
    const { showNotification } = useAppContext();

    const handleEnhance = async () => {
        if (!idea) return;
        setIsLoading(true);
        setEnhancedPrompt(null);
        try {
            const result = await aiService.enhancePrompt(idea);
            setEnhancedPrompt(result);
            showNotification("Prompt enhanced successfully!", "success");
        } catch (e) {
            console.error(e);
            showNotification("Failed to enhance prompt.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePresetClick = (preset: string) => {
        setIdea(preset);
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
    };

    const handleDownloadJson = () => {
        if (!enhancedPrompt) return;
        const blob = new Blob([JSON.stringify(enhancedPrompt, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prompt_data_${Date.now()}.json`;
        a.click();
        showNotification("Prompt JSON downloaded.", "info");
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="text-center space-y-4 mb-12 pt-8">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-white/5 mb-4 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                    <SparklesIcon className="w-8 h-8 text-indigo-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
                    Prompt Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Studio</span>
                </h1>
                <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
                    Transform raw ideas into engineering-grade generation prompts using advanced LLM reasoning.
                </p>
            </div>
            
            {/* Input Section */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-focus-within:opacity-50 blur transition duration-500"></div>
                <Card className="relative p-1 bg-[#09090b] border-white/10 overflow-hidden">
                    <div className="bg-zinc-900/80 p-6 md:p-8 rounded-xl backdrop-blur-xl">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <BeakerIcon className="w-4 h-4" />
                                Input Concept
                            </label>
                            <span className={`text-xs font-mono transition-colors ${idea.length > 0 ? 'text-indigo-400' : 'text-zinc-600'}`}>
                                {idea.length} chars
                            </span>
                        </div>
                        <Textarea 
                            value={idea}
                            onChange={e => setIdea(e.target.value)}
                            placeholder="e.g., A cyberpunk detective standing in the rain, neon lights reflection..."
                            rows={4}
                            className="text-lg bg-transparent border-none focus:ring-0 p-0 text-white placeholder-zinc-600 resize-none font-medium leading-relaxed"
                            autoFocus
                        />
                        
                        {/* Quick Presets */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {QUICK_PRESETS.map((preset, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handlePresetClick(preset)}
                                    className="text-[10px] px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 text-zinc-400 hover:text-indigo-300 transition-all"
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                            <div className="text-xs text-zinc-500 flex items-center gap-2">
                                <BoltIcon className="w-4 h-4" />
                                Powered by Gemini 2.5 Flash
                            </div>
                            <Button 
                                onClick={handleEnhance} 
                                isLoading={isLoading} 
                                disabled={!idea} 
                                size="lg" 
                                className="px-8 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300"
                            >
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                {isLoading ? 'Enhancing...' : 'Enhance Prompt'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Results Section */}
            {enhancedPrompt && (
                 <div className="space-y-6 animate-fade-in-up">
                     
                     {/* Tab Navigation */}
                     <div className="flex justify-center mb-8">
                         <div className="p-1 bg-zinc-900/80 border border-white/10 rounded-xl inline-flex shadow-xl backdrop-blur-md">
                             <button
                                onClick={() => setActiveTab('visual')}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'visual' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                             >
                                 <AdjustmentsHorizontalIcon className="w-4 h-4" />
                                 Visual Breakdown
                             </button>
                             <button
                                onClick={() => setActiveTab('json')}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'json' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                             >
                                 <CodeBracketIcon className="w-4 h-4" />
                                 Prompt JSON
                             </button>
                         </div>
                     </div>

                     {activeTab === 'visual' ? (
                        <div className="space-y-6">
                            {/* Hero Result Card */}
                            <div className="bg-gradient-to-br from-zinc-900 to-[#0c0c0e] border border-white/10 rounded-2xl p-1 relative group">
                                <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
                                <div className="relative p-8 flex flex-col h-full">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                            <SparklesIcon className="w-5 h-5" />
                                            Optimized Master Prompt
                                        </h3>
                                        <div className="flex gap-2">
                                            <Button 
                                                size="sm" 
                                                variant="secondary" 
                                                className="text-xs bg-white/5 hover:bg-white/10" 
                                                onClick={() => handleEnhance()}
                                            >
                                                <ArrowPathIcon className="w-3 h-3 mr-1.5" /> Regenerate
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-grow p-6 bg-black/40 rounded-xl border border-white/5 font-serif text-xl leading-relaxed text-zinc-100 shadow-inner relative overflow-hidden">
                                        {enhancedPrompt.finalPrompt}
                                        <div className="absolute bottom-4 right-4">
                                            <Button 
                                                size="sm"
                                                onClick={() => handleCopyToClipboard(enhancedPrompt.finalPrompt)} 
                                                className="shadow-lg"
                                            >
                                                <DocumentDuplicateIcon className="w-4 h-4 mr-2"/> Copy
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <div className="flex items-start gap-3">
                                            <span className="text-xs font-bold text-red-400 uppercase tracking-wider mt-1">Negative:</span>
                                            <p className="text-sm text-zinc-400">{enhancedPrompt.negativePrompt}</p>
                                            <button onClick={() => handleCopyToClipboard(enhancedPrompt.negativePrompt)} className="text-zinc-500 hover:text-white ml-auto">
                                                <DocumentDuplicateIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detail Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <DetailCard icon={<CubeIcon/>} title="Subject" value={enhancedPrompt.subject} delay={0} />
                                <DetailCard icon={<SwatchIcon/>} title="Art Style" value={enhancedPrompt.style} delay={1} />
                                <DetailCard icon={<EyeIcon/>} title="Composition" value={enhancedPrompt.composition} delay={2} />
                                <DetailCard icon={<LightBulbIcon/>} title="Lighting" value={enhancedPrompt.lighting} delay={3} />
                                <DetailCard icon={<CameraIcon/>} title="Camera / Medium" value={enhancedPrompt.colorPalette} delay={4} /> {/* Using colorPalette slot for now, AI might map it */}
                                <DetailCard icon={<SparklesIcon/>} title="Atmosphere" value={enhancedPrompt.mood} delay={5} />
                            </div>
                        </div>
                     ) : (
                        <div className="animate-fade-in w-full mx-auto max-w-4xl">
                            <div className="bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
                                {/* Editor Header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                                        </div>
                                        <div className="h-4 w-px bg-white/10 mx-1"></div>
                                        <span className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                                            <CommandLineIcon className="w-3 h-3" /> prompt_config.json
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            size="sm" 
                                            variant="ghost"
                                            className="text-xs h-7 hover:bg-white/10"
                                            onClick={handleDownloadJson}
                                        >
                                            <ArrowDownTrayIcon className="w-3 h-3 mr-1.5" /> Download
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="primary"
                                            className="text-xs h-7"
                                            onClick={() => handleCopyToClipboard(JSON.stringify(enhancedPrompt, null, 2))}
                                        >
                                            <DocumentDuplicateIcon className="w-3 h-3 mr-1.5" /> Copy JSON
                                        </Button>
                                    </div>
                                </div>
                                
                                {/* Code Area */}
                                <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed bg-[#1e1e1e] text-[#d4d4d4] custom-scrollbar">
                                    <table className="w-full border-collapse">
                                        <tbody>
                                            {JSON.stringify(enhancedPrompt, null, 2).split('\n').map((line, i) => (
                                                <tr key={i}>
                                                    <td className="text-right pr-4 text-[#858585] select-none w-10 align-top text-xs py-[2px]">{i + 1}</td>
                                                    <td className="align-top py-[2px] whitespace-pre-wrap break-all">
                                                        <JsonHighlighter line={line} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Footer Status */}
                                <div className="px-4 py-1 bg-[#007acc] text-white text-[10px] flex justify-between items-center">
                                    <span>JSON</span>
                                    <span>UTF-8</span>
                                </div>
                            </div>
                        </div>
                     )}
                </div>
            )}
        </div>
    );
};

// --- Sub-Components ---

const DetailCard: React.FC<{ icon: any, title: string, value: string, delay: number }> = ({ icon, title, value, delay }) => (
    <div 
        className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl flex flex-col gap-2 hover:bg-white/5 hover:border-white/10 transition-all animate-fade-in-up"
        style={{ animationDelay: `${delay * 0.1}s` }}
    >
        <div className="flex items-center gap-2 text-zinc-500 mb-1">
            <div className="w-4 h-4">{icon}</div>
            <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
        </div>
        <p className="text-sm text-zinc-200 font-medium leading-snug">
            {value || <span className="text-zinc-600 italic">Not specified</span>}
        </p>
    </div>
);

const JsonHighlighter: React.FC<{ line: string }> = ({ line }) => {
    // Very basic syntax highlighting for JSON lines
    const parts = line.split(/(".*?"|:|[0-9]+|true|false|null)/g).filter(Boolean);
    
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('"')) {
                    if (line.trim().startsWith(part) && line.includes(':')) {
                        // Key (Property) - Light Blue
                        return <span key={i} style={{ color: '#9cdcfe' }}>{part}</span>;
                    }
                    // String Value - Orange/Salmon
                    return <span key={i} style={{ color: '#ce9178' }}>{part}</span>;
                }
                if (part === ':') return <span key={i} style={{ color: '#d4d4d4' }}>{part}</span>;
                if (!isNaN(Number(part))) return <span key={i} style={{ color: '#b5cea8' }}>{part}</span>; // Number - Light Green
                if (['true', 'false', 'null'].includes(part)) return <span key={i} style={{ color: '#569cd6' }}>{part}</span>; // Boolean/Null - Blue
                return <span key={i} style={{ color: '#d4d4d4' }}>{part}</span>; // Brackets/Commas
            })}
        </>
    );
};

export default PromptEnhancerPage;
