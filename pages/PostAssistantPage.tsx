
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { SparklesIcon, DocumentDuplicateIcon, ChatBubbleOvalLeftEllipsisIcon, HandThumbUpIcon, ShareIcon, HashtagIcon } from '@heroicons/react/24/outline';
import aiService from '../services/aiService';
import { SocialPost } from '../types';
import { useAppContext } from '../contexts/AppContext';

const PLATFORMS = ['Twitter', 'Instagram', 'LinkedIn', 'Facebook'];

const PostAssistantPage: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState(PLATFORMS[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const { showNotification } = useAppContext();

    const handleGenerate = async () => {
        if (!topic) return;
        setIsLoading(true);
        setPosts([]);
        try {
            const result = await aiService.generateSocialPosts(topic, platform);
            setPosts(result);
            showNotification("Posts drafted successfully!", "success");
        } catch (e) {
            console.error(e);
            showNotification("Failed to generate posts.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showNotification('Post copied to clipboard!', 'success');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                    <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-display text-white">Social Studio</h1>
                    <p className="text-zinc-400">Create engaging, platform-native social content.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Section */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 space-y-6 sticky top-24 bg-zinc-900 border-white/10">
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 block">Target Platform</label>
                             <div className="flex flex-wrap gap-2">
                                {PLATFORMS.map(p => (
                                    <Button 
                                        key={p} 
                                        variant={platform === p ? 'primary' : 'outline'} 
                                        onClick={() => setPlatform(p)}
                                        size="sm"
                                        className="flex-grow justify-center"
                                    >
                                        {p}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        
                        <Textarea 
                            label="Topic or Key Message" 
                            value={topic} 
                            onChange={e => setTopic(e.target.value)} 
                            placeholder="e.g., Announcing our new summer collection..." 
                            rows={8} 
                            className="bg-zinc-950 border-white/10"
                        />
                        
                        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!topic} className="w-full !py-3" size="lg">
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Draft Posts
                        </Button>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-2 space-y-4">
                     {posts.length > 0 ? (
                         <div className="space-y-6 animate-fade-in-up">
                             <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4 uppercase tracking-wider">
                                 Generated Options <span className="text-xs font-normal text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">{posts.length} results</span>
                             </h2>
                             {posts.map((post, index) => (
                                <div key={index} className="bg-zinc-900 rounded-xl border border-white/5 p-6 relative group hover:border-white/10 transition-all duration-200">
                                    <div className="flex items-start gap-5">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0"></div>
                                        <div className="flex-grow space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <div className="h-3 w-32 bg-zinc-800 rounded"></div>
                                                    <div className="h-2 w-20 bg-zinc-800 rounded"></div>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    className="text-zinc-400 hover:text-white bg-white/5"
                                                    onClick={() => handleCopyToClipboard(`${post.mainText}\n\n${post.hashtags.join(' ')}`)}
                                                >
                                                    <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                                                    Copy
                                                </Button>
                                            </div>
                                            <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed text-sm">{post.mainText}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {post.hashtags.map((tag, i) => (
                                                    <span key={i} className="text-xs text-indigo-400 hover:underline cursor-pointer">#{tag.replace('#', '')}</span>
                                                ))}
                                            </div>
                                            
                                            <div className="flex gap-8 pt-4 border-t border-white/5 text-zinc-600">
                                                <div className="flex items-center gap-2 text-xs font-medium"><HandThumbUpIcon className="w-4 h-4"/> Like</div>
                                                <div className="flex items-center gap-2 text-xs font-medium"><ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4"/> Comment</div>
                                                <div className="flex items-center gap-2 text-xs font-medium"><ShareIcon className="w-4 h-4"/> Share</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             ))}
                         </div>
                     ) : (
                         <div className="h-full flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl bg-white/5 min-h-[400px]">
                            {isLoading ? (
                                <div className="animate-pulse flex flex-col items-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-full mb-6"></div>
                                    <div className="w-48 h-4 bg-white/5 rounded mb-3"></div>
                                    <div className="w-32 h-4 bg-white/5 rounded"></div>
                                </div>
                            ) : (
                                <>
                                    <ChatBubbleOvalLeftEllipsisIcon className="w-16 h-16 text-zinc-700 mb-6" />
                                    <h3 className="text-lg font-medium text-white">No Drafts Yet</h3>
                                    <p className="text-zinc-500 mt-2 text-sm">Enter a topic on the left to generate post options.</p>
                                </>
                            )}
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default PostAssistantPage;
