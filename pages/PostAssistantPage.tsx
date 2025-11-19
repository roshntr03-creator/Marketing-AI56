import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { SparklesIcon, DocumentDuplicateIcon, ChatBubbleOvalLeftEllipsisIcon, HandThumbUpIcon, ShareIcon, HashtagIcon } from '@heroicons/react/24/outline';
import aiService from '../services/aiService';
import { SocialPost } from '../types';

const PLATFORMS = ['Twitter', 'Instagram', 'LinkedIn', 'Facebook'];

const PostAssistantPage: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState(PLATFORMS[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState<SocialPost[]>([]);

    const handleGenerate = async () => {
        if (!topic) return;
        setIsLoading(true);
        setPosts([]);
        try {
            const result = await aiService.generateSocialPosts(topic, platform);
            setPosts(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Post copied!');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-display">Social Studio</h1>
                    <p className="text-text-secondary">Create engaging, platform-native social content.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Section */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 space-y-6 sticky top-24">
                        <div>
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 block">Target Platform</label>
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
                            className="bg-background-dark"
                        />
                        
                        <Button onClick={handleGenerate} isLoading={isLoading} disabled={!topic} className="w-full !py-3.5 shadow-lg shadow-primary/20" size="lg">
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Draft Posts
                        </Button>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-2 space-y-4">
                     {posts.length > 0 ? (
                         <div className="space-y-6 animate-fade-in-up">
                             <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
                                 Generated Options <span className="text-xs font-normal text-text-secondary bg-white/10 px-2 py-0.5 rounded-full">{posts.length} results</span>
                             </h2>
                             {posts.map((post, index) => (
                                <div key={index} className="glass-panel rounded-xl p-6 relative group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex-shrink-0 border border-white/10"></div>
                                        <div className="flex-grow space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <div className="h-3 w-32 bg-white/10 rounded"></div>
                                                    <div className="h-2 w-20 bg-white/5 rounded"></div>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    className="text-text-secondary hover:text-white bg-white/5 hover:bg-white/10"
                                                    onClick={() => handleCopyToClipboard(`${post.mainText}\n\n${post.hashtags.join(' ')}`)}
                                                >
                                                    <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                                                    Copy
                                                </Button>
                                            </div>
                                            <p className="text-text-primary whitespace-pre-wrap leading-relaxed text-base">{post.mainText}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {post.hashtags.map((tag, i) => (
                                                    <span key={i} className="text-sm text-primary hover:underline cursor-pointer">#{tag.replace('#', '')}</span>
                                                ))}
                                            </div>
                                            
                                            <div className="flex gap-8 pt-4 border-t border-white/5 text-text-muted">
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
                         <div className="h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-surface-border rounded-3xl bg-white/5 min-h-[400px]">
                            {isLoading ? (
                                <div className="animate-pulse flex flex-col items-center">
                                    <div className="w-24 h-24 bg-white/5 rounded-full mb-6"></div>
                                    <div className="w-48 h-4 bg-white/10 rounded mb-3"></div>
                                    <div className="w-32 h-4 bg-white/10 rounded"></div>
                                </div>
                            ) : (
                                <>
                                    <ChatBubbleOvalLeftEllipsisIcon className="w-20 h-20 text-text-muted mb-6 opacity-30" />
                                    <h3 className="text-xl font-bold text-white">No Drafts Yet</h3>
                                    <p className="text-text-secondary mt-2">Enter a topic on the left to generate post options.</p>
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