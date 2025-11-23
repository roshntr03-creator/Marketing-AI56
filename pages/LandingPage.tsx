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
    BoltIcon,
    CommandLineIcon,
    DocumentTextIcon,
    GlobeAltIcon,
    LockClosedIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

// --- New Component: Creative Engine Visualization ---
// A centralized, meaningful animation showing the "Brain" orchestrating tasks.
const CreativeEngine = () => {
    // Phases: 0 = Idle, 1 = Analysis, 2 = Generation, 3 = Deployment
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
                     {/* Line to Satellite 1 (Strategy) */}
                     <line x1="50%" y1="50%" x2="20%" y2="30%" stroke="url(#grad1)" strokeWidth="1" className={`transition-opacity duration-500 ${phase >= 1 ? 'opacity-100' : 'opacity-10'}`} />
                     {/* Line to Satellite 2 (Video) */}
                     <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="url(#grad1)" strokeWidth="1" className={`transition-opacity duration-500 ${phase >= 2 ? 'opacity-100' : 'opacity-10'}`} />
                     {/* Line to Satellite 3 (Image) */}
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
                
                {/* Module 1: Strategy (Top Left) */}
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

                {/* Module 2: Video (Top Right) */}
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

                 {/* Module 3: Content (Bottom Center) */}
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

                {/* Floating Data Packets */}
                <div className="absolute top-[35%] left-[35%] w-2 h-2 bg-white rounded-full blur-[1px] animate-[float_4s_ease-in-out_infinite]"></div>
                <div className="absolute top-[60%] right-[40%] w-1.5 h-1.5 bg-indigo-400 rounded-full blur-[1px] animate-[float_5s_ease-in-out_infinite]"></div>
            </div>
        </div>
    );
};

// --- Showcase Section Component (Kept from previous version) ---
const ShowcaseSection = () => {
  return (
    <div className="relative w-full max-w-7xl mx-auto mt-16 perspective-1000 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 lg:px-8">
         
         {/* SORA 2 VIDEO SHOWCASE */}
         <div className="relative group">
             {/* Model Header */}
             <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-md bg-zinc-900/80 border border-white/10 text-white text-xs font-bold font-display tracking-wider shadow-lg backdrop-blur-md flex items-center gap-2 group-hover:border-indigo-500/50 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                        SORA 2.0
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest hidden xl:block">Video Gen</span>
                </div>
             </div>

             {/* Window Container */}
             <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl ring-1 ring-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-white/20">
                  {/* Window Chrome */}
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
                  
                  {/* Video Area */}
                  <div className="aspect-video bg-black relative group-hover:shadow-inner">
                       <video 
                           src="https://file.aiquickdraw.com/custom-page/akr/section-images/1760182741759dipnk388.mp4" 
                           autoPlay loop muted playsInline 
                           className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                       />
                       
                       {/* Floating Controls */}
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
             {/* Model Header */}
             <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-md bg-zinc-900/80 border border-white/10 text-white text-xs font-bold font-display tracking-wider shadow-lg backdrop-blur-md flex items-center gap-2 group-hover:border-blue-500/50 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                        GROK 3
                    </div>
                     <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest hidden xl:block">Image Gen</span>
                </div>
             </div>

             {/* Window Container */}
             <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl ring-1 ring-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-white/20">
                  {/* Window Chrome */}
                  <div className="h-10 bg-zinc-900/90 backdrop-blur border-b border-white/5 flex items-center px-4 gap-3 select-none">
                       <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                       </div>
                        <div className="ml-2 px-3 py-1 bg-black/50 rounded text-[10px] text-zinc-500 font-mono flex-1 text-center border border-white/5 truncate">
                            grok_batch_01.png
                        </div>
                  </div>
                  
                  {/* Image Grid Area */}
                  <div className="aspect-video bg-black relative overflow-hidden grid grid-cols-3 grid-rows-2 gap-[1px]">
                       <img src="https://tempfile.aiquickdraw.com/r/a799dda2-1537-4e93-9256-e2e24a420e21.png" className="w-full h-full object-cover" alt="Grok result 1" />
                       <img src="https://tempfile.aiquickdraw.com/r/e2e57053-4cd3-47c6-90a0-e2a7060fcd78.png" className="w-full h-full object-cover" alt="Grok result 2" />
                       <img src="https://tempfile.aiquickdraw.com/r/74bdda26-4010-46bd-ad45-98d42e307ad8.png" className="w-full h-full object-cover" alt="Grok result 3" />
                       <img src="https://tempfile.aiquickdraw.com/r/43984148-916a-44d6-9d68-ff0dc3d2fb23.png" className="w-full h-full object-cover" alt="Grok result 4" />
                       <img src="https://tempfile.aiquickdraw.com/r/cdcbf25b-8fa5-4472-a8c4-169d1690c6bd.png" className="w-full h-full object-cover" alt="Grok result 5" />
                       <img src="https://tempfile.aiquickdraw.com/r/382f80b4-2294-43ef-b04a-0a5650a3c85c.png" className="w-full h-full object-cover" alt="Grok result 6" />
                       
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                  
                   {/* Editor Footer Simulation */}
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
             {/* Model Header */}
             <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-md bg-zinc-900/80 border border-white/10 text-white text-xs font-bold font-display tracking-wider shadow-lg backdrop-blur-md flex items-center gap-2 group-hover:border-purple-500/50 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                        SEEDREAM v4
                    </div>
                     <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest hidden xl:block">Image Gen</span>
                </div>
             </div>

             {/* Window Container */}
             <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl ring-1 ring-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-white/20">
                  {/* Window Chrome */}
                  <div className="h-10 bg-zinc-900/90 backdrop-blur border-b border-white/5 flex items-center px-4 gap-3 select-none">
                       <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                       </div>
                        <div className="ml-2 px-3 py-1 bg-black/50 rounded text-[10px] text-zinc-500 font-mono flex-1 text-center border border-white/5 truncate">
                            seedream_render.png
                        </div>
                  </div>
                  
                  {/* Image Area - Fully Visible */}
                  <div className="aspect-video bg-black relative overflow-hidden flex items-center justify-center">
                       <img 
                            src="https://tempfile.aiquickdraw.com/h/7bbebf4da56bb54915c02a2dee560839_1763648214.png"
                            alt="AI Generated Image"
                            className="h-full w-full object-contain"
                       />
                       
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                        {/* Info Badge */}
                        <div className="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur border border-white/10 rounded text-[9px] text-zinc-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                            2K Res
                        </div>
                  </div>
                  
                   {/* Editor Footer Simulation */}
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
    {/* Gradient Orbs */}
    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[150px]"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[150px]"></div>
    {/* Grid Lines */}
    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
  </div>
);

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleGetStarted = (e: React.FormEvent) => {
        e.preventDefault();
        // Start the intro animation
        setIsTransitioning(true);
        
        // Navigate after animation plays
        setTimeout(() => {
            navigate('/signup');
        }, 2500);
    };

    return (
        <div className="relative w-full min-h-screen flex flex-col font-sans text-zinc-200 bg-[#050505] overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
            <BackgroundGrid />
            <CreativeEngine />

            {/* INTRO MOTION GRAPHIC OVERLAY */}
            {isTransitioning && (
                <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center animate-fade-in">
                    {/* Animated Background Glow */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        
                        {/* Animated Text */}
                        <h1 className="text-5xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                            Marketing AI
                        </h1>
                        
                        {/* Loading Indicator */}
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

            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
                <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between">
                    <Logo href="/" textClassName="text-xl font-bold tracking-tight text-white font-display" />
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
                            <a href="#features" className="hover:text-white transition-colors">Platform</a>
                            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                            <a href="#" className="hover:text-white transition-colors">Enterprise</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/signin" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors px-4 py-2">Log In</Link>
                            <button onClick={handleGetStarted}>
                                <Button size="sm" variant="primary" className="rounded-lg px-5 shadow-lg shadow-indigo-500/20 border border-indigo-400/20">Get Started</Button>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
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

                {/* TRIPLE SHOWCASE GRID */}
                <ShowcaseSection />
                
                {/* Trusted By / Social Proof */}
                <div className="mt-32 max-w-5xl mx-auto border-t border-white/5 pt-12 px-6">
                     <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-8">Trusted by innovative teams at</p>
                     <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                         {['Acme Corp', 'Global Dynamics', 'Stark Ind', 'Umbrella', 'Cyberdyne'].map((brand) => (
                             <span key={brand} className="text-xl font-bold font-display text-white">{brand}</span>
                         ))}
                     </div>
                </div>
            </main>

            {/* Features - Bento Grid - UPDATED DESIGN */}
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

                    <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[900px]">
                        
                        {/* Large Feature - Video Engine - Redesigned as "Editor Interface" */}
                        <div className="md:col-span-2 md:row-span-2 rounded-[2.5rem] bg-[#08080a] border border-white/10 overflow-hidden relative group hover:border-indigo-500/30 transition-all duration-500 shadow-2xl hover:shadow-[0_0_60px_rgba(79,70,229,0.15)]">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                            
                            <div className="relative z-10 p-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="p-3 rounded-2xl bg-zinc-900/80 border border-white/10 text-white shadow-lg backdrop-blur-md">
                                        <CubeIcon className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                                        Sora 2.0 Native
                                    </div>
                                </div>
                                
                                <div className="mb-16 relative z-20">
                                    <h3 className="text-4xl font-display font-bold text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">Generative Video Engine</h3>
                                    <p className="text-zinc-400 max-w-md leading-relaxed text-lg">
                                        Create broadcast-ready commercials using our proprietary <strong>timeline editor</strong>. 
                                        Multi-track sequencing, real-time rendering, and precise camera controls.
                                    </p>
                                </div>
                                
                                {/* VISUALIZATION: Abstract Editor Interface */}
                                <div className="flex-1 bg-[#0c0c0e] rounded-t-2xl border-t border-l border-r border-white/10 relative overflow-hidden shadow-2xl mt-auto translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                     {/* Editor Header */}
                                     <div className="h-10 border-b border-white/5 bg-black/40 flex items-center px-4 justify-between">
                                         <div className="flex gap-2">
                                             <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                             <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                             <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                         </div>
                                         <div className="flex items-center gap-2">
                                             <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                             <span className="text-[9px] font-mono text-zinc-500">REC 00:04:12:00</span>
                                         </div>
                                     </div>
                                     
                                     {/* Viewport Area */}
                                     <div className="h-[55%] bg-gradient-to-b from-zinc-900 to-black relative overflow-hidden">
                                         <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                                         {/* Animated waveform visual */}
                                         <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end gap-1 px-4 opacity-20">
                                             {[...Array(20)].map((_, i) => (
                                                 <div key={i} className="flex-1 bg-indigo-500 animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                                             ))}
                                         </div>
                                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-700">
                                             <PlayIcon className="w-16 h-16 opacity-50" />
                                         </div>
                                     </div>

                                     {/* Timeline Tracks */}
                                     <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-[#0a0a0c] border-t border-white/5 p-3 space-y-2">
                                         {/* Playhead */}
                                         <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-red-500 z-30 shadow-[0_0_10px_red]">
                                             <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-red-500 transform rotate-45"></div>
                                         </div>
                                         
                                         {/* Track 1 */}
                                         <div className="h-6 rounded bg-zinc-900/50 border border-white/5 relative overflow-hidden">
                                             <div className="absolute top-1 bottom-1 left-0 w-[60%] bg-indigo-900/40 border border-indigo-500/30 rounded mx-1"></div>
                                         </div>
                                         {/* Track 2 */}
                                         <div className="h-6 rounded bg-zinc-900/50 border border-white/5 relative overflow-hidden">
                                              <div className="absolute top-1 bottom-1 left-[20%] w-[40%] bg-purple-900/40 border border-purple-500/30 rounded mx-1"></div>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 - Brand Consistency - Redesigned as "Style Lock" */}
                        <div className="md:col-span-1 md:row-span-1 rounded-[2.5rem] bg-[#08080a] border border-white/10 p-8 relative overflow-hidden group hover:border-purple-500/30 transition-all shadow-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-600/20 transition-colors"></div>
                            
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-white mb-6 shadow-lg">
                                    <SwatchIcon className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 font-display">Brand Style Lock</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                                    Define your visual identity once. Our AI strictly adheres to your palette and typography.
                                </p>
                                
                                {/* VISUALIZATION: Color Palette Lock */}
                                <div className="mt-auto bg-zinc-900/50 rounded-xl border border-white/5 p-3 flex items-center justify-between relative overflow-hidden">
                                     <div className="flex gap-[-8px]">
                                         <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-[#08080a] shadow-lg z-30"></div>
                                         <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#08080a] shadow-lg -ml-3 z-20"></div>
                                         <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-[#08080a] shadow-lg -ml-3 z-10"></div>
                                     </div>
                                     <div className="flex items-center gap-2 text-xs font-bold text-white bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                                         <LockClosedIcon className="w-3 h-3 text-emerald-400" />
                                         LOCKED
                                     </div>
                                     {/* Scan line */}
                                     <div className="absolute top-0 bottom-0 w-1 bg-white/20 blur-sm animate-[scan_2s_ease-in-out_infinite]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 - Strategy - Redesigned as "Data Radar" */}
                        <div className="md:col-span-1 md:row-span-1 rounded-[2.5rem] bg-[#08080a] border border-white/10 p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-all shadow-xl hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                             <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-600/20 transition-colors"></div>
                            
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-white mb-6 shadow-lg">
                                    <ChartBarIcon className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 font-display">Market Intelligence</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                                    Real-time competitive analysis. We scan the market to build data-driven blueprints.
                                </p>
                                
                                {/* VISUALIZATION: Radar Scan */}
                                <div className="mt-auto relative h-24 w-full bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
                                     {/* Grid */}
                                     <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,#000_1px),linear-gradient(90deg,transparent_1px,#000_1px)] bg-[size:16px_16px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]"></div>
                                     
                                     {/* Radar Circles */}
                                     <div className="absolute w-32 h-32 border border-emerald-500/20 rounded-full"></div>
                                     <div className="absolute w-16 h-16 border border-emerald-500/30 rounded-full"></div>
                                     
                                     {/* Scanning Beam */}
                                     <div className="absolute w-32 h-32 bg-gradient-to-r from-transparent to-emerald-500/20 rounded-full [clip-path:polygon(50%_50%,100%_0,100%_100%)] animate-[spin_3s_linear_infinite] origin-center"></div>
                                     
                                     {/* Dots */}
                                     <div className="absolute top-6 left-10 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                     <div className="absolute bottom-8 right-12 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
                                     
                                     <div className="absolute bottom-2 right-2 text-[9px] font-mono text-emerald-500/80">LIVE FEED</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-32 px-6 bg-[#050505] border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto">
                     <div className="text-center mb-20">
                        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-white mb-6">Transparent Pricing.</h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Start small and scale. Access enterprise-grade tools without the enterprise-grade complexity.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Starter', price: '$29', desc: 'Perfect for solo creators.', features: ['10 Sora Video Gens', '50 HD Images', 'Basic Templates'] },
                            { name: 'Pro', price: '$99', desc: 'For growing brands.', popular: true, features: ['50 Sora Video Gens', 'Unlimited Images', 'Brand Style Lock', 'Priority Processing'] },
                            { name: 'Enterprise', price: 'Custom', desc: 'For large organizations.', features: ['Unlimited Generation', 'API Access', 'Custom Models', 'Dedicated Support'] }
                        ].map((plan, idx) => (
                            <div 
                                key={idx} 
                                className={`p-8 rounded-2xl border flex flex-col transition-all duration-300 relative ${
                                    plan.popular 
                                    ? 'bg-[#09090b] border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.1)] scale-105 z-10' 
                                    : 'bg-transparent border-white/5 hover:border-white/10 hover:bg-white/5'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg border border-indigo-500/50">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-white mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-4xl font-semibold text-white tracking-tight font-display">{plan.price}</span>
                                        {plan.price !== 'Custom' && <span className="text-zinc-500 text-sm">/mo</span>}
                                    </div>
                                    <p className="text-sm text-zinc-400">{plan.desc}</p>
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
                                        variant={plan.popular ? 'primary' : 'outline'} 
                                        className="w-full justify-center h-12"
                                    >
                                        Get {plan.name}
                                    </Button>
                                </Link>
                            </div>
                        ))}
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
                        <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-zinc-400 cursor-pointer transition-colors">Terms of Service</span>
                        <span className="hover:text-zinc-400 cursor-pointer transition-colors">Twitter</span>
                        <span className="hover:text-zinc-400 cursor-pointer transition-colors">GitHub</span>
                    </div>
                    <div className="text-xs text-zinc-700">
                        © 2024 All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;