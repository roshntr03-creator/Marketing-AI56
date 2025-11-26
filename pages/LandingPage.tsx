
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { 
    ArrowRightIcon, 
    CheckCircleIcon, 
    CubeIcon, 
    ChartBarIcon, 
    SwatchIcon, 
    PlayIcon,
    VideoCameraIcon,
    SparklesIcon,
    CpuChipIcon,
    PhotoIcon,
    SignalIcon,
    CurrencyDollarIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';
import { PRICING_PLANS, CREDIT_COSTS_DISPLAY } from '../constants';

// --- Constants ---
const BRANDS = [
    'Acme Corp', 'Global Dynamics', 'Stark Ind', 'Umbrella Corp', 
    'Cyberdyne', 'Weyland-Yutani', 'Massive Dynamic', 'InGen', 
    'Tyrell Corp', 'Oscorp', 'Aperture Science', 'Black Mesa'
];

// --- New Component: Creative Engine Visualization ---
const CreativeEngine = () => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase(p => (p + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
            <div className="relative w-[800px] h-[800px] opacity-60 scale-75 md:scale-100">
                
                {/* Orbital Rings */}
                <div className="absolute inset-0 border border-indigo-500/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
                <div className="absolute inset-[100px] border border-purple-500/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                <div className="absolute inset-[200px] border border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>

                {/* Central Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.2)] z-20">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center transition-all duration-1000 ${phase === 1 ? 'animate-pulse scale-110' : 'scale-100'}`}>
                        <CpuChipIcon className="w-10 h-10 text-white" />
                    </div>
                    {/* Core Radiating Waves */}
                    <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping" style={{animationDuration: '3s'}}></div>
                </div>

                {/* Connection Lines (Dynamic) */}
                <svg className="absolute inset-0 w-full h-full z-10">
                     <line x1="50%" y1="50%" x2="20%" y2="30%" stroke="url(#grad1)" strokeWidth="1" className={`transition-opacity duration-500 ${phase >= 1 ? 'opacity-100' : 'opacity-10'}`} />
                     <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="url(#grad1)" strokeWidth="1" className={`transition-opacity duration-500 ${phase >= 2 ? 'opacity-100' : 'opacity-10'}`} />
                     <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="url(#grad1)" strokeWidth="1" className={`transition-opacity duration-500 ${phase >= 3 ? 'opacity-100' : 'opacity-10'}`} />
                     
                     <defs>
                         <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                             <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
                             <stop offset="50%" stopColor="rgba(99, 102, 241, 1)" />
                             <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                         </linearGradient>
                     </defs>
                </svg>

                {/* Satellite Modules */}
                <div className={`absolute top-[25%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${phase === 1 ? 'scale-110 brightness-125' : 'scale-100 opacity-50'}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-xl">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <ChartBarIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-[100px]">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase">Analysis</div>
                            <div className="text-xs text-white font-medium">Market Intel</div>
                            {phase === 1 && <div className="h-0.5 w-full bg-emerald-500 mt-1 animate-[loading_1s_ease-in-out_infinite]"></div>}
                        </div>
                    </div>
                </div>

                <div className={`absolute top-[25%] right-[15%] transform translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${phase === 2 ? 'scale-110 brightness-125' : 'scale-100 opacity-50'}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-xl">
                        <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                            <VideoCameraIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-[100px]">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase">Production</div>
                            <div className="text-xs text-white font-medium">Video Gen</div>
                            {phase === 2 && <div className="h-0.5 w-full bg-indigo-500 mt-1 animate-[loading_1s_ease-in-out_infinite]"></div>}
                        </div>
                    </div>
                </div>

                 <div className={`absolute bottom-[10%] left-[50%] transform -translate-x-1/2 translate-y-1/2 transition-all duration-1000 ${phase === 3 ? 'scale-110 brightness-125' : 'scale-100 opacity-50'}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-xl">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                            <PhotoIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-[100px]">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase">Creative</div>
                            <div className="text-xs text-white font-medium">Visual Assets</div>
                            {phase === 3 && <div className="h-0.5 w-full bg-purple-500 mt-1 animate-[loading_1s_ease-in-out_infinite]"></div>}
                        </div>
                    </div>
                </div>

                <div className="absolute top-[35%] left-[35%] w-2 h-2 bg-white rounded-full blur-[1px] animate-[float_4s_ease-in-out_infinite]"></div>
                <div className="absolute top-[60%] right-[40%] w-1.5 h-1.5 bg-indigo-400 rounded-full blur-[1px] animate-[float_5s_ease-in-out_infinite]"></div>
            </div>
        </div>
    );
};

// --- Showcase Section Component ---
const ShowcaseSection = () => {
  return (
    <div className="relative w-full max-w-7xl mx-auto mt-16 perspective-1000 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 lg:px-8">
         
         {/* SORA 2 VIDEO SHOWCASE */}
         <div className="relative group">
             <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-md bg-zinc-900/80 border border-white/10 text-white text-xs font-bold font-display tracking-wider shadow-lg backdrop-blur-md flex items-center gap-2 group-hover:border-indigo-500/50 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                        SORA 2.0
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest hidden xl:block">Video Gen</span>
                </div>
             </div>

             <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl ring-1 ring-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-white/20">
                  <div className="h-10 bg-zinc-900/90 backdrop-blur border-b border-white/5 flex items-center px-4 gap-3 select-none">
                       <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                       </div>
                       <div className="ml-2 px-3 py-1 bg-black/50 rounded text-[10px] text-zinc-500 font-mono flex-1 text-center border border-white/5 truncate">
                           cinematic_render.mp4
                       </div>
                  </div>
                  
                  <div className="aspect-video bg-black relative group-hover:shadow-inner">
                       <video 
                           src="https://file.aiquickdraw.com/custom-page/akr/section-images/1760182741759dipnk388.mp4" 
                           autoPlay loop muted playsInline 
                           className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                       />
                       <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                            <div className="bg-black/60 backdrop-blur px-3 py-2 rounded-lg border border-white/10 flex gap-3 items-center">
                                <PlayIcon className="w-3 h-3 text-white fill-white" />
                                <div className="h-1 w-16 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full w-1/2 bg-indigo-500 animate-[pulse_2s_infinite]"></div>
                                </div>
                            </div>
                       </div>
                  </div>
             </div>
         </div>

         {/* GROK 3 IMAGE SHOWCASE */}
         <div className="relative group delay-75">
             <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-md bg-zinc-900/80 border border-white/10 text-white text-xs font-bold font-display tracking-wider shadow-lg backdrop-blur-md flex items-center gap-2 group-hover:border-blue-500/50 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                        GROK 3
                    </div>
                     <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest hidden xl:block">Image Gen</span>
                </div>
             </div>

             <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl ring-1 ring-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-white/20">
                  <div className="h-10 bg-zinc-900/90 backdrop-blur border-b border-white/5 flex items-center px-4 gap-3 select-none">
                       <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                       </div>
                        <div className="ml-2 px-3 py-1 bg-black/50 rounded text-[10px] text-zinc-500 font-mono flex-1 text-center border border-white/5 truncate">
                            grok_batch_01.png
                        </div>
                  </div>
                  
                  <div className="aspect-video bg-black relative overflow-hidden grid grid-cols-3 grid-rows-2 gap-[1px]">
                       <img src="https://tempfile.aiquickdraw.com/r/a799dda2-1537-4e93-9256-e2e24a420e21.png" className="w-full h-full object-cover" alt="Grok result 1" />
                       <img src="https://tempfile.aiquickdraw.com/r/e2e57053-4cd3-47c6-90a0-e2a7060fcd78.png" className="w-full h-full object-cover" alt="Grok result 2" />
                       <img src="https://tempfile.aiquickdraw.com/r/74bdda26-4010-46bd-ad45-98d42e307ad8.png" className="w-full h-full object-cover" alt="Grok result 3" />
                       <img src="https://tempfile.aiquickdraw.com/r/43984148-916a-44d6-9d68-ff0dc3d2fb23.png" className="w-full h-full object-cover" alt="Grok result 4" />
                       <img src="https://tempfile.aiquickdraw.com/r/cdcbf25b-8fa5-4472-a8c4-169d1690c6bd.png" className="w-full h-full object-cover" alt="Grok result 5" />
                       <img src="https://tempfile.aiquickdraw.com/r/382f80b4-2294-43ef-b04a-0a5650a3c85c.png" className="w-full h-full object-cover" alt="Grok result 6" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                  
                  <div className="h-12 bg-[#0e0e10] border-t border-white/5 flex items-center justify-between px-4">
                       <div className="flex gap-1 opacity-30 group-hover:opacity-60 transition-opacity">
                           {[...Array(8)].map((_, i) => (
                               <div key={i} className={`w-1 rounded-full ${i % 2 === 0 ? 'h-3 bg-white' : 'h-1.5 bg-zinc-500'} mx-0.5`}></div>
                           ))}
                       </div>
                       <div className="flex items-center gap-2">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Done</span>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                       </div>
                  </div>
             </div>
         </div>

         {/* SEEDREAM v4 IMAGE SHOWCASE */}
         <div className="relative group delay-100">
             <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-md bg-zinc-900/80 border border-white/10 text-white text-xs font-bold font-display tracking-wider shadow-lg backdrop-blur-md flex items-center gap-2 group-hover:border-purple-500/50 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                        SEEDREAM v4
                    </div>
                     <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest hidden xl:block">Image Gen</span>
                </div>
             </div>

             <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl ring-1 ring-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-white/20">
                  <div className="h-10 bg-zinc-900/90 backdrop-blur border-b border-white/5 flex items-center px-4 gap-3 select-none">
                       <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                       </div>
                        <div className="ml-2 px-3 py-1 bg-black/50 rounded text-[10px] text-zinc-500 font-mono flex-1 text-center border border-white/5 truncate">
                            seedream_render.png
                        </div>
                  </div>
                  
                  <div className="aspect-video bg-black relative overflow-hidden flex items-center justify-center">
                       <img 
                            src="https://tempfile.aiquickdraw.com/h/7bbebf4da56bb54915c02a2dee560839_1763648214.png"
                            alt="AI Generated Image"
                            className="h-full w-full object-contain"
                       />
                       
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                        <div className="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur border border-white/10 rounded text-[9px] text-zinc-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                            2K Res
                        </div>
                  </div>
                  
                  <div className="h-12 bg-[#0e0e10] border-t border-white/5 flex items-center justify-between px-4">
                       <div className="flex gap-1 opacity-30 group-hover:opacity-60 transition-opacity">
                           {[...Array(8)].map((_, i) => (
                               <div key={i} className={`w-1 rounded-full ${i % 3 === 0 ? 'h-3 bg-white' : 'h-1.5 bg-zinc-500'} mx-0.5`}></div>
                           ))}
                       </div>
                       <div className="flex items-center gap-2">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Done</span>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                       </div>
                  </div>
             </div>
         </div>

      </div>
    </div>
  );
};

// --- Background Effect ---
const BackgroundGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[150px]"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[150px]"></div>
    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
  </div>
);

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleGetStarted = (e?: React.FormEvent) => {
        if(e) e.preventDefault();
        setIsTransitioning(true);
        setTimeout(() => {
            navigate('/signup');
        }, 2500);
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="relative w-full min-h-screen flex flex-col font-sans text-zinc-200 bg-[#050505] overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
            <BackgroundGrid />
            <CreativeEngine />

            {isTransitioning && (
                <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center animate-fade-in">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <h1 className="text-5xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                            Marketing AI
                        </h1>
                        <div className="mt-8 w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '100%', transformOrigin: 'left', animationName: 'slideRight' }}></div>
                        </div>
                        <style>{`
                            @keyframes slideRight {
                                0% { transform: translateX(-100%); }
                                50% { transform: translateX(0%); }
                                100% { transform: translateX(100%); }
                            }
                        `}</style>
                    </div>
                </div>
            )}

            <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
                <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between">
                    <Logo href="/" textClassName="text-xl font-bold tracking-tight text-white font-display" />
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
                            <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Platform</button>
                            <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button>
                            <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Enterprise</button>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/signin" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors px-4 py-2">Log In</Link>
                            <button onClick={() => handleGetStarted()}>
                                <Button size="sm" variant="primary" className="rounded-lg px-5 shadow-lg shadow-indigo-500/20 border border-indigo-400/20">Get Started</Button>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-40 pb-32 text-center overflow-hidden min-h-screen flex flex-col justify-center">
                <div className="px-6 relative z-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-10 animate-fade-in hover:bg-white/10 transition-colors cursor-default backdrop-blur-md shadow-lg shadow-black/50">
                        <SparklesIcon className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Introducing Sora 2.0 & Seedream v4</span>
                    </div>

                    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 max-w-6xl mx-auto leading-[0.95] animate-fade-in-up drop-shadow-2xl">
                        The Enterprise <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">Creative OS.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                        Generate broadcast-quality video, design high-end visuals, and automate brand strategy. 
                        Powered by the world's most advanced models, built for professional workflows.
                    </p>

                    <div className="max-w-md mx-auto mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <form onSubmit={handleGetStarted} className="flex gap-2 p-1.5 bg-zinc-900/80 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md ring-1 ring-white/5 group hover:border-white/20 transition-colors">
                            <input 
                                type="email" 
                                placeholder="Enter work email..." 
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 text-white placeholder-zinc-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button type="submit" className="rounded-lg px-8 shadow-lg" size="md">Start Free</Button>
                        </form>
                        <p className="text-xs text-zinc-600 mt-4 flex items-center justify-center gap-6">
                            <span className="flex items-center gap-1.5"><CheckCircleIcon className="w-4 h-4 text-emerald-500" /> No credit card</span>
                            <span className="flex items-center gap-1.5"><CheckCircleIcon className="w-4 h-4 text-emerald-500" /> 14-day trial</span>
                        </p>
                    </div>
                </div>

                <ShowcaseSection />
                
                <div className="mt-32 border-t border-white/5 pt-12 w-full overflow-hidden">
                     <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-12 text-center">Trusted by innovative teams at</p>
                     <div className="relative flex w-full overflow-hidden">
                         <div className="flex animate-scroll whitespace-nowrap hover:[animation-play-state:paused]">
                             {BRANDS.map((brand) => (
                                 <div key={brand} className="mx-8 md:mx-16 flex items-center gap-4 group cursor-default select-none">
                                     <span className="text-xl md:text-2xl font-bold font-display text-zinc-700 group-hover:text-zinc-200 transition-colors duration-300">{brand}</span>
                                 </div>
                             ))}
                             {BRANDS.map((brand) => (
                                 <div key={`${brand}-dup`} className="mx-8 md:mx-16 flex items-center gap-4 group cursor-default select-none">
                                     <span className="text-xl md:text-2xl font-bold font-display text-zinc-700 group-hover:text-zinc-200 transition-colors duration-300">{brand}</span>
                                 </div>
                             ))}
                         </div>
                         <div className="absolute top-0 left-0 h-full w-24 md:w-48 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
                         <div className="absolute top-0 right-0 h-full w-24 md:w-48 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>
                     </div>
                </div>
            </main>

            <section id="features" className="py-32 px-6 relative z-10 border-t border-white/5 bg-[#050505]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05),transparent_40%)] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative">
                    <div className="mb-20 max-w-3xl">
                        <div className="flex items-center gap-2 text-indigo-500 font-bold text-sm uppercase tracking-widest mb-4">
                            <CpuChipIcon className="w-5 h-5" />
                            <span>Core Capabilities</span>
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-white mb-6">Built for Production.</h2>
                        <p className="text-zinc-400 text-xl font-light leading-relaxed">
                            Stop patching together fragmented tools. Our platform unifies generation, editing, and strategy into one seamless, enterprise-grade environment.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
                        <div className="md:col-span-2 md:row-span-2 rounded-[2rem] bg-[#08080a] border border-white/10 overflow-hidden relative group hover:border-indigo-500/30 transition-all duration-500 shadow-2xl hover:shadow-[0_0_60px_rgba(79,70,229,0.15)] flex flex-col">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                            <div className="relative z-10 p-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="p-3 rounded-2xl bg-zinc-900/80 border border-white/10 text-white shadow-lg backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                                        <CubeIcon className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                                        Sora 2.0 Native
                                    </div>
                                </div>
                                <div className="mb-12 relative z-20">
                                    <h3 className="text-3xl font-display font-bold text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">Generative Video Engine</h3>
                                    <p className="text-zinc-400 max-w-md leading-relaxed">
                                        Create broadcast-ready commercials using our proprietary <strong>timeline editor</strong>. 
                                        Multi-track sequencing, real-time rendering, and precise camera controls.
                                    </p>
                                </div>
                                <div className="flex-1 bg-[#0a0a0c] rounded-t-2xl border-t border-l border-r border-white/10 relative overflow-hidden shadow-2xl mt-auto translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                     <div className="h-8 border-b border-white/5 bg-black/40 flex items-center px-3 justify-between">
                                         <div className="flex gap-1.5">
                                             <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                                             <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                                         </div>
                                         <div className="text-[9px] font-mono text-indigo-400 flex items-center gap-2">
                                             <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                             REC 00:04:12:00
                                         </div>
                                     </div>
                                     <div className="h-[60%] bg-gradient-to-b from-zinc-900 to-black relative overflow-hidden group-hover:bg-zinc-900/80 transition-colors">
                                         <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                             <div className="flex items-end gap-1 h-16">
                                                 {[...Array(20)].map((_, i) => (
                                                     <div key={i} className="w-1.5 bg-indigo-500 animate-[pulse_1.5s_ease-in-out_infinite]" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.05}s` }}></div>
                                                 ))}
                                             </div>
                                         </div>
                                         <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/60 rounded text-[8px] text-zinc-400 font-mono border border-white/5">
                                             1080p • 60FPS
                                         </div>
                                     </div>
                                     <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-[#0e0e10] border-t border-white/5 p-3 space-y-2">
                                         <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 shadow-[0_0_8px_red] left-[30%] animate-[slideRight_4s_linear_infinite]"></div>
                                         <style>{`
                                            @keyframes slideRight {
                                                0% { left: 10%; }
                                                100% { left: 90%; }
                                            }
                                         `}</style>
                                         <div className="h-5 rounded bg-zinc-900 border border-white/5 relative overflow-hidden flex items-center px-1">
                                             <div className="h-3 w-[40%] bg-indigo-900/60 border border-indigo-500/30 rounded-sm relative overflow-hidden">
                                                 <div className="absolute inset-0 bg-indigo-500/10"></div>
                                             </div>
                                             <div className="h-3 w-[30%] ml-1 bg-purple-900/60 border border-purple-500/30 rounded-sm"></div>
                                         </div>
                                         <div className="h-5 rounded bg-zinc-900 border border-white/5 relative overflow-hidden flex items-center px-1">
                                              <div className="h-3 w-[60%] ml-[20%] bg-emerald-900/60 border border-emerald-500/30 rounded-sm"></div>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-1 md:row-span-1 rounded-[2rem] bg-[#08080a] border border-white/10 p-8 relative overflow-hidden group hover:border-purple-500/30 transition-all shadow-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-purple-600/10 transition-colors"></div>
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <SwatchIcon className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 font-display">Brand Style Lock</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Define identity once. AI adheres strictly to your palette.
                                </p>
                            </div>
                            <div className="mt-6 bg-zinc-900/60 rounded-xl border border-white/5 p-4 flex items-center justify-between relative overflow-hidden">
                                 <div className="flex -space-x-3">
                                     <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-[#08080a] shadow-lg z-30 group-hover:translate-x-1 transition-transform"></div>
                                     <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#08080a] shadow-lg z-20 group-hover:translate-x-1 transition-transform delay-75"></div>
                                     <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-[#08080a] shadow-lg z-10 group-hover:translate-x-1 transition-transform delay-150"></div>
                                 </div>
                                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/5 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-colors">
                                     <LockClosedIcon className="w-3 h-3" />
                                     LOCKED
                                 </div>
                            </div>
                        </div>

                        <div className="md:col-span-1 md:row-span-1 rounded-[2rem] bg-[#08080a] border border-white/10 p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-all shadow-xl hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] flex flex-col justify-between">
                             <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-emerald-600/10 transition-colors"></div>
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <SignalIcon className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 font-display">Market Intelligence</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Real-time competitive analysis and strategic radar.
                                </p>
                            </div>
                            <div className="mt-6 relative h-28 w-full bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
                                 <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,#000_1px),linear-gradient(90deg,transparent_1px,#000_1px)] bg-[size:16px_16px] opacity-10"></div>
                                 <div className="absolute w-24 h-24 border border-emerald-500/10 rounded-full"></div>
                                 <div className="absolute w-12 h-12 border border-emerald-500/20 rounded-full"></div>
                                 <div className="absolute w-32 h-32 bg-gradient-to-r from-transparent to-emerald-500/10 rounded-full [clip-path:polygon(50%_50%,100%_0,100%_100%)] animate-[spin_3s_linear_infinite] origin-center"></div>
                                 <div className="absolute top-8 left-12 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.8)]"></div>
                                 <div className="absolute bottom-6 right-16 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-300 shadow-[0_0_5px_rgba(52,211,153,0.8)]"></div>
                                 <div className="absolute bottom-2 right-3 text-[8px] font-mono text-emerald-500/60 flex items-center gap-1">
                                     <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span> LIVE
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="pricing" className="py-32 px-6 bg-[#050505] border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto">
                     <div className="text-center mb-20">
                        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-white mb-6">Flexible Credit Plans.</h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Start with a monthly credit allowance. Scale up as your production needs grow.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                            {PRICING_PLANS.map((plan, idx) => (
                                <div 
                                    key={idx} 
                                    className={`p-8 rounded-2xl border flex flex-col transition-all duration-300 relative ${
                                        plan.isPopular 
                                        ? 'bg-[#09090b] border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.1)] scale-105 z-10' 
                                        : 'bg-transparent border-white/5 hover:border-white/10 hover:bg-white/5'
                                    }`}
                                >
                                    {plan.isPopular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg border border-indigo-500/50">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-medium text-white mb-2">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1 mb-2">
                                            <span className="text-4xl font-semibold text-white tracking-tight font-display">{plan.price}</span>
                                            {plan.price !== 'Contact' && <span className="text-zinc-500 text-sm">/mo</span>}
                                        </div>
                                        <p className="text-sm text-zinc-400">{plan.description}</p>
                                    </div>
                                    
                                    <div className="space-y-4 mb-10 flex-1">
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <CheckCircleIcon className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                                <span className="text-sm text-zinc-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link to="/signup" className="w-full">
                                        <Button 
                                            variant={plan.isPopular ? 'primary' : 'outline'} 
                                            className="w-full justify-center h-12"
                                        >
                                            Get {plan.name}
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div className="lg:w-80 w-full p-6 rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm sticky top-24">
                            <div className="flex items-center gap-2 mb-6 text-emerald-400">
                                <CurrencyDollarIcon className="w-6 h-6" />
                                <h3 className="text-sm font-bold uppercase tracking-wider">Credit Cost Guide</h3>
                            </div>
                            <div className="space-y-4">
                                {CREDIT_COSTS_DISPLAY.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center pb-3 border-b border-white/5 last:border-0 last:pb-0">
                                        <span className="text-sm text-zinc-300">{item.item}</span>
                                        <span className="text-xs font-bold text-white bg-white/10 px-2 py-1 rounded">{item.cost} Credits</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-xs text-indigo-300 leading-relaxed">
                                <strong>Note:</strong> Credits roll over for one month on Pro plans. Failed generations are automatically refunded.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 px-6 border-t border-white/5 bg-[#050505]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                        <span className="text-sm font-semibold text-zinc-400">Marketing AI Inc.</span>
                    </div>
                    <div className="flex gap-8 text-sm text-zinc-600">
                        <Link to="/terms-agreement" className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy Policy</Link>
                        <Link to="/terms-agreement" className="hover:text-zinc-400 cursor-pointer transition-colors">Terms of Service</Link>
                        <a href="#" className="hover:text-zinc-400 cursor-pointer transition-colors" onClick={(e) => e.preventDefault()}>Twitter</a>
                        <a href="#" className="hover:text-zinc-400 cursor-pointer transition-colors" onClick={(e) => e.preventDefault()}>GitHub</a>
                    </div>
                    <div className="text-xs text-zinc-700">
                        © 2025 All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
