
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/ui/Button';
import { Textarea, Input } from '../components/ui/Input';
import { 
    PencilSquareIcon, 
    DocumentDuplicateIcon, 
    SparklesIcon, 
    ClipboardDocumentCheckIcon,
    NewspaperIcon,
    ChatBubbleLeftRightIcon,
    MegaphoneIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    FilmIcon,
    TagIcon,
    UserGroupIcon,
    LanguageIcon,
    ClockIcon,
    ArrowDownTrayIcon,
    ArrowPathIcon,
    BoldIcon,
    ItalicIcon,
    ListBulletIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline';
import MarkdownRenderer from '../components/ui/MarkdownRenderer';

const CONTENT_TEMPLATES = [
    { id: 'Blog Post', name: 'Blog Article', icon: NewspaperIcon, desc: 'SEO-optimized articles' },
    { id: 'Social Media Post', name: 'Social Post', icon: ChatBubbleLeftRightIcon, desc: 'Engaging short-form text' },
    { id: 'Ad Copy', name: 'Ad Copy', icon: MegaphoneIcon, desc: 'High-conversion ads' },
    { id: 'Email Newsletter', name: 'Email', icon: EnvelopeIcon, desc: 'Newsletters & outreach' },
    { id: 'Website Copy', name: 'Website Copy', icon: GlobeAltIcon, desc: 'Landing page content' },
    { id: 'Video Script', name: 'Video Script', icon: FilmIcon, desc: 'Scripts for YouTube/TikTok' },
];

const TONES = ['Professional', 'Casual', 'Witty', 'Empathetic', 'Formal', 'Persuasive', 'Urgent'];
const LANGUAGES = ['English (US)', 'English (UK)', 'Arabic', 'Spanish', 'French', 'German'];
const LENGTHS = ['Short', 'Medium', 'Long'];

// --- Typewriter Effect Component ---
const TypewriterEffect: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const indexRef = useRef(0);

    useEffect(() => {
        setDisplayedText('');
        indexRef.current = 0;
        
        const interval = setInterval(() => {
            if (indexRef.current < text.length) {
                setDisplayedText((prev) => prev + text.charAt(indexRef.current));
                indexRef.current++;
            } else {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, 8); // Speed of typing

        return () => clearInterval(interval);
    }, [text]);

    return <MarkdownRenderer content={displayedText} />;
};

const ContentGeneratorPage: React.FC = () => {
    const { addCreation, creations, brandProfile } = useAppContext();
    
    // Configuration State
    const [contentType, setContentType] = useState(CONTENT_TEMPLATES[0].id);
    const [topic, setTopic] = useState('');
    const [audience, setAudience] = useState(brandProfile?.audience || '');
    const [tone, setTone] = useState(brandProfile?.toneOfVoice || 'Professional');
    const [keywords, setKeywords] = useState('');
    const [language, setLanguage] = useState('English (US)');
    const [length, setLength] = useState('Medium');

    // UI State
    const [activeJobId, setActiveJobId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Derived Data
    const activeJob = creations.find(job => job.id === activeJobId);
    const isGenerating = activeJob?.status === 'Generating' || activeJob?.status === 'Pending';
    const recentDocs = creations.filter(c => c.type === 'CONTENT').slice(0, 10);

    useEffect(() => {
        // If a new job starts or we load the page, set active job
        if (activeJobId === null && recentDocs.length > 0) {
            setActiveJobId(recentDocs[0].id);
        }
    }, []);

    const handleGenerate = () => {
        if (!topic) return;
        const newJobId = `doc-${Date.now()}`;
        const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);

        addCreation({
            id: newJobId,
            type: 'CONTENT',
            title: `${contentType}: ${topic.substring(0, 30)}...`,
            params: { 
                contentType, 
                topic, 
                tone, 
                audience, 
                keywords: keywordList, 
                length, 
                language 
            },
            status: 'Pending'
        });
        setActiveJobId(newJobId);
        setIsTyping(true); // Start typing expectation
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!activeJob?.resultText) return;
        const blob = new Blob([activeJob.resultText], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeJob.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
        a.click();
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-[#050505] text-zinc-100 overflow-hidden relative font-sans">
            
            {/* LEFT PANEL: CONFIGURATION */}
            <div className="w-96 flex-shrink-0 border-r border-white/10 bg-[#09090b] flex flex-col z-20">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold font-display text-white">Content Studio</h2>
                        <p className="text-xs text-zinc-500 mt-1">Configure your AI writer</p>
                    </div>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-zinc-400">
                        <ClockIcon className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    
                    {/* Template Selector */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <BookOpenIcon className="w-3 h-3"/> Template
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {CONTENT_TEMPLATES.map(tpl => (
                                <button
                                    key={tpl.id}
                                    onClick={() => setContentType(tpl.id)}
                                    className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all duration-200 ${contentType === tpl.id ? 'bg-indigo-500/10 border-indigo-500 text-white' : 'bg-zinc-900/50 border-white/5 hover:bg-zinc-800 hover:border-white/10 text-zinc-400'}`}
                                >
                                    <tpl.icon className={`w-4 h-4 mb-2 ${contentType === tpl.id ? 'text-indigo-400' : 'text-zinc-500'}`} />
                                    <span className="text-xs font-semibold">{tpl.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Topic Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <PencilSquareIcon className="w-3 h-3"/> Brief
                        </label>
                        <Textarea 
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            placeholder="What should I write about?"
                            className="bg-zinc-900/50 border-white/10 text-sm min-h-[100px]"
                        />
                    </div>

                    {/* Detailed Settings */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tone</label>
                            <div className="flex flex-wrap gap-2">
                                {TONES.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTone(t)}
                                        className={`px-2.5 py-1 rounded-md text-[10px] border transition-all ${tone === t ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Audience</label>
                                <Input value={audience} onChange={e => setAudience(e.target.value)} placeholder="Target persona..." className="bg-zinc-900/50 border-white/10 h-9 text-xs" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Keywords</label>
                                <Input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="SEO tags..." className="bg-zinc-900/50 border-white/10 h-9 text-xs" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Length</label>
                                <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/5">
                                    {LENGTHS.map(l => (
                                        <button key={l} onClick={() => setLength(l)} className={`flex-1 text-[10px] py-1 rounded ${length === l ? 'bg-zinc-700 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}>{l}</button>
                                    ))}
                                </div>
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Language</label>
                                <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full bg-zinc-900/50 border border-white/10 rounded-lg text-xs px-2 py-1.5 text-zinc-300 outline-none focus:border-indigo-500">
                                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                             </div>
                        </div>
                    </div>
                </div>
                
                {/* Generate Button Footer */}
                <div className="p-6 border-t border-white/10 bg-zinc-900/80 backdrop-blur">
                    <Button 
                        onClick={handleGenerate} 
                        isLoading={isGenerating} 
                        disabled={!topic}
                        className="w-full justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] py-3"
                    >
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        Generate Content
                    </Button>
                </div>
            </div>
            
            {/* RIGHT PANEL: EDITOR */}
            <div className="flex-1 relative bg-[#0c0c0e] flex flex-col min-w-0">
               
               {/* Toolbar */}
               <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0c0c0e] z-10">
                   <div className="flex items-center gap-2 text-zinc-400">
                       <span className="text-xs font-bold uppercase tracking-wider">{activeJob?.params.contentType || 'Untitled'}</span>
                       {activeJob?.status === 'Completed' && <span className="bg-emerald-500/10 text-emerald-500 text-[9px] px-2 py-0.5 rounded border border-emerald-500/20">Saved</span>}
                   </div>
                   
                   <div className="flex items-center gap-3">
                        {activeJob?.resultText && !isGenerating && (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(activeJob.resultText!)} className={`text-xs ${copied ? 'text-emerald-400' : 'text-zinc-400'}`}>
                                    {copied ? <ClipboardDocumentCheckIcon className="w-4 h-4 mr-1.5" /> : <DocumentDuplicateIcon className="w-4 h-4 mr-1.5" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </Button>
                                <Button variant="secondary" size="sm" onClick={handleDownload} className="text-xs border-white/10 bg-white/5">
                                    <ArrowDownTrayIcon className="w-4 h-4 mr-1.5" /> Export
                                </Button>
                            </>
                        )}
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${isSidebarOpen ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-400'}`}
                        >
                            <ClockIcon className="w-5 h-5" />
                        </button>
                   </div>
               </div>

               {/* Document Area */}
               <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex justify-center bg-[#0c0c0e]">
                   <div className="w-full max-w-3xl bg-[#121214] min-h-[800px] rounded-xl shadow-2xl border border-white/5 p-12 relative">
                       {isGenerating ? (
                           <div className="flex flex-col items-center justify-center py-32 opacity-50">
                               <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
                               <p className="text-sm font-mono text-indigo-300 uppercase tracking-widest animate-pulse">Drafting Content...</p>
                           </div>
                       ) : activeJob?.resultText ? (
                           <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-zinc-300 prose-strong:text-white">
                               {isTyping ? (
                                   <TypewriterEffect text={activeJob.resultText} onComplete={() => setIsTyping(false)} />
                               ) : (
                                   <MarkdownRenderer content={activeJob.resultText} />
                               )}
                           </div>
                       ) : (
                           <div className="flex flex-col items-center justify-center h-full py-40 text-zinc-700 select-none">
                               <PencilSquareIcon className="w-16 h-16 mb-4 opacity-20" />
                               <h3 className="text-xl font-medium text-zinc-500">Blank Canvas</h3>
                               <p className="text-sm mt-2 opacity-60">Configure settings on the left to start writing.</p>
                           </div>
                       )}
                   </div>
               </div>
            </div>
            
            {/* History Sidebar (Slide over) */}
            <div className={`absolute top-0 right-0 bottom-0 w-80 bg-[#121214] border-l border-white/10 transform transition-transform duration-300 z-30 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" /> History
                    </span>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-500 hover:text-white">
                        <ArrowPathIcon className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-4rem)] custom-scrollbar">
                    {recentDocs.map(doc => (
                        <button
                            key={doc.id}
                            onClick={() => { setActiveJobId(doc.id); setIsSidebarOpen(false); setIsTyping(false); }}
                            className={`w-full text-left p-4 rounded-xl border transition-all group relative overflow-hidden ${activeJobId === doc.id ? 'bg-zinc-800 border-indigo-500/50 shadow-lg' : 'bg-zinc-900/50 border-white/5 hover:border-white/10 hover:bg-zinc-800'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${activeJobId === doc.id ? 'bg-indigo-500/20 text-indigo-300' : 'bg-black/30 text-zinc-500'}`}>
                                    {doc.params.contentType}
                                </span>
                                <span className="text-[10px] text-zinc-600">{new Date(doc.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className={`text-sm font-medium truncate ${activeJobId === doc.id ? 'text-white' : 'text-zinc-300 group-hover:text-zinc-200'}`}>
                                {doc.title}
                            </p>
                        </button>
                    ))}
                    {recentDocs.length === 0 && <div className="text-center text-zinc-600 text-xs py-10">No history available.</div>}
                </div>
            </div>
        </div>
    );
};

export default ContentGeneratorPage;
