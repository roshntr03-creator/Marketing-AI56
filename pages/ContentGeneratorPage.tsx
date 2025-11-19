import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { PencilSquareIcon, DocumentDuplicateIcon, SparklesIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import MarkdownRenderer from '../components/ui/MarkdownRenderer';

const CONTENT_TYPES = [
    { id: 'blog_post', name: 'Blog Post' },
    { id: 'ad_copy', name: 'Ad Copy' },
    { id: 'social_media_update', name: 'Social Update' },
    { id: 'email', name: 'Email' },
    { id: 'product_description', name: 'Product Desc.' },
];
const TONES = ['Professional', 'Casual', 'Witty', 'Empathetic', 'Formal', 'Persuasive'];

const ContentGeneratorPage: React.FC = () => {
    const { addCreation, creations } = useAppContext();
    const [contentType, setContentType] = useState(CONTENT_TYPES[0].id);
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState(TONES[0]);
    const [lastJobId, setLastJobId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const lastJob = creations.find(job => job.id === lastJobId);

    const handleGenerate = () => {
        if (!topic) return;
        const newJobId = `job-${Date.now()}`;
        addCreation({
            id: newJobId,
            type: 'CONTENT',
            title: `${contentType}: ${topic.substring(0, 20)}...`,
            params: { contentType, topic, tone },
            status: 'Pending'
        });
        setLastJobId(newJobId);
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 animate-fade-in pb-4">
            {/* Left Controls */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6 h-full">
                <div>
                    <h1 className="text-2xl font-bold font-display">Copywriter</h1>
                    <p className="text-sm text-text-secondary">Generate high-converting text assets.</p>
                </div>
                
                <Card className="p-6 space-y-6 flex-1 flex flex-col bg-background-card border-surface-border shadow-lg">
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 block">Asset Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {CONTENT_TYPES.map(type => (
                                <button 
                                    key={type.id} 
                                    onClick={() => setContentType(type.id)} 
                                    className={`text-xs py-2.5 px-2 rounded-lg border transition-all font-medium ${contentType === type.id ? 'bg-primary text-white border-primary shadow-md' : 'bg-background-dark text-text-secondary border-surface-border hover:bg-white/5'}`}
                                >
                                    {type.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                        <Textarea 
                            label="Topic / Brief" 
                            value={topic} 
                            onChange={e => setTopic(e.target.value)} 
                            placeholder="Describe what you need in detail..." 
                            className="bg-background-dark flex-1 min-h-[120px]"
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 block">Tone</label>
                        <div className="flex flex-wrap gap-2">
                            {TONES.map(t => (
                                <button 
                                    key={t} 
                                    onClick={() => setTone(t)}
                                    className={`px-3 py-1.5 text-xs rounded-full border transition-all font-medium ${tone === t ? 'bg-white text-black border-white' : 'bg-transparent text-text-secondary border-surface-border hover:border-white/50 hover:text-white'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button onClick={handleGenerate} disabled={!topic} className="w-full !py-3.5 shadow-lg shadow-primary/20 mt-auto" size="lg">
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Generate Content
                    </Button>
                </Card>
            </div>

            {/* Right Output */}
            <div className="w-full lg:w-2/3 flex flex-col h-full">
                <Card className="flex-1 flex flex-col p-0 overflow-hidden relative border-surface-border bg-background-dark/50 shadow-2xl">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                            <span className="ml-4 text-xs font-mono text-text-muted uppercase tracking-widest">AI_Output_v1.md</span>
                        </div>
                        {lastJob?.resultText && (
                             <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(lastJob.resultText!)} className={`transition-colors ${copied ? 'text-green-400 bg-green-500/10' : 'text-text-secondary hover:text-white'}`}>
                                {copied ? <ClipboardDocumentCheckIcon className="w-4 h-4" /> : <DocumentDuplicateIcon className="w-4 h-4" />}
                                {copied ? 'Copied' : 'Copy Text'}
                            </Button>
                        )}
                    </div>
                    
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar font-sans text-base leading-relaxed bg-background-dark/30">
                        {lastJob ? (
                            lastJob.status === 'Generating' || lastJob.status === 'Pending' ? (
                                <div className="h-full flex flex-col items-center justify-center text-primary">
                                    <div className="relative w-16 h-16 mb-6">
                                        <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                    <p className="text-sm font-mono animate-pulse tracking-widest">DRAFTING CONTENT...</p>
                                </div>
                            ) : lastJob.status === 'Failed' ? (
                                <div className="h-full flex items-center justify-center text-red-400">
                                    <p>Generation failed. Please try again.</p>
                                </div>
                            ) : (
                                <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-text-secondary prose-strong:text-white">
                                    <MarkdownRenderer content={lastJob.resultText || ''} />
                                </div>
                            )
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-text-muted/30">
                                <PencilSquareIcon className="w-24 h-24 mb-4 opacity-50" />
                                <p className="text-xl font-display">Ready to write.</p>
                                <p className="text-sm mt-2">Select parameters and hit generate.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ContentGeneratorPage;