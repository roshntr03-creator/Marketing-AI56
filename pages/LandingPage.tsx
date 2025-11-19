import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { ArrowRightIcon, CheckCircleIcon, BoltIcon, CubeIcon, ChartBarIcon, SwatchIcon } from '@heroicons/react/24/outline';

// --- 3D Interface Mockup Component ---
const DashboardMockup = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto mt-16 perspective-1000 group">
      {/* 3D Tilt Container */}
      <div className="relative transform rotate-x-12 transition-transform duration-1000 ease-out hover:rotate-x-0 hover:scale-105 preserve-3d">
        
        {/* Glow behind the dashboard */}
        <div className="absolute -inset-10 bg-gradient-to-r from-indigo-500/30 to-purple-600/30 rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
        
        {/* Main Window */}
        <div className="relative bg-[#09090b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex h-[600px] md:h-[700px] ring-1 ring-white/5">
          
          {/* Reflection Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none z-20"></div>

          {/* Sidebar Mock */}
          <div className="w-16 md:w-72 border-r border-white/5 bg-[#050505] flex flex-col p-6 hidden md:flex z-10">
            <div className="flex items-center gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <div className="space-y-4 opacity-60">
                <div className="h-2 w-12 bg-zinc-800 rounded-full mb-4"></div>
                <div className="h-8 w-full bg-zinc-900/80 border border-white/5 rounded-lg animate-pulse"></div>
                <div className="h-8 w-3/4 bg-zinc-900/40 rounded-lg"></div>
                <div className="h-8 w-5/6 bg-zinc-900/40 rounded-lg"></div>
                <div className="h-8 w-4/5 bg-zinc-900/40 rounded-lg"></div>
            </div>
            <div className="mt-auto opacity-60">
                <div className="h-12 w-full bg-zinc-900/30 rounded-lg border border-white/5"></div>
            </div>
          </div>

          {/* Content Area Mock */}
          <div className="flex-1 p-6 md:p-10 bg-[#09090b] relative overflow-hidden z-10">
             {/* Header Mock */}
             <div className="flex justify-between items-center mb-10">
                 <div>
                     <div className="h-8 w-64 bg-zinc-800/50 rounded-lg mb-3"></div>
                     <div className="h-4 w-40 bg-zinc-800/30 rounded-lg"></div>
                 </div>
                 <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-zinc-800/50 border border-white/5"></div>
                    <div className="h-10 w-32 rounded-lg bg-indigo-600/20 border border-indigo-500/30"></div>
                 </div>
             </div>

             {/* Grid Cards Mock */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="col-span-2 h-80 bg-zinc-900/30 rounded-2xl border border-white/5 p-8 relative overflow-hidden backdrop-blur-sm">
                      {/* Fake Graph */}
                      <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-between px-8 pb-8 gap-2">
                          {[40, 70, 50, 90, 60, 80, 95].map((h, i) => (
                              <div key={i} style={{height: `${h}%`}} className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400/50 rounded-t-lg opacity-80"></div>
                          ))}
                      </div>
                      <div className="absolute top-8 left-8">
                          <div className="h-4 w-32 bg-zinc-700/50 rounded-full mb-2"></div>
                          <div className="h-8 w-20 bg-white/10 rounded-lg"></div>
                      </div>
                 </div>
                 <div className="col-span-1 space-y-6">
                     <div className="h-36 bg-zinc-900/30 rounded-2xl border border-white/5 p-6 relative overflow-hidden">
                         <div className="absolute top-3 right-3 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                         <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 border border-purple-500/20">
                             <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
                         </div>
                         <div className="h-3 w-24 bg-zinc-800 rounded-full"></div>
                     </div>
                     <div className="h-36 bg-zinc-900/30 rounded-2xl border border-white/5 p-6 relative overflow-hidden">
                          <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 border border-blue-500/20">
                             <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                         </div>
                         <div className="h-3 w-24 bg-zinc-800 rounded-full"></div>
                     </div>
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
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[150px]"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[150px]"></div>
    {/* Grid Lines */}
    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
  </div>
);

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleGetStarted = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/signup');
    };

    return (
        <div className="relative w-full min-h-screen flex flex-col font-sans text-zinc-200 bg-[#050505] overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
            <BackgroundGrid />

            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Logo href="/" iconClassName="w-6 h-6 text-indigo-500" textClassName="text-lg font-bold tracking-tight text-white" />
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
                            <a href="#features" className="hover:text-white transition-colors">Features</a>
                            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                            <a href="#" className="hover:text-white transition-colors">Blog</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/signin" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors px-4 py-2">Log In</Link>
                            <Link to="/signup">
                                <Button size="sm" variant="primary" className="rounded-lg px-5 shadow-lg shadow-indigo-500/20">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 pt-40 pb-24 px-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-10 animate-fade-in hover:bg-white/10 transition-colors cursor-default backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">v2.0 Release</span>
                </div>

                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 max-w-6xl mx-auto leading-[0.9] animate-fade-in-up drop-shadow-2xl">
                    Marketing <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Intelligence.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    The operating system for modern brands. Generate video, design visuals, and craft strategy with enterprise-grade AI.
                </p>

                <div className="max-w-md mx-auto mb-24 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                     <form onSubmit={handleGetStarted} className="flex gap-2 p-1.5 bg-zinc-900/80 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md ring-1 ring-white/5">
                        <input 
                            type="email" 
                            placeholder="Enter work email..." 
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 text-white placeholder-zinc-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button type="submit" className="rounded-lg px-8 shadow-lg" size="md">Start Free</Button>
                     </form>
                     <p className="text-xs text-zinc-600 mt-4 flex items-center justify-center gap-4">
                         <span className="flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" /> No credit card</span>
                         <span className="flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" /> 14-day trial</span>
                     </p>
                </div>

                <DashboardMockup />
            </main>

            {/* Features - Bento Grid */}
            <section id="features" className="py-32 px-6 relative z-10 border-t border-white/5 bg-[#050505]">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20 max-w-3xl">
                        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-white mb-6">Unified Power.</h2>
                        <p className="text-zinc-400 text-xl font-light leading-relaxed">Stop switching between fragmented tools. Access a cohesive suite of generative engines designed for professional workflows.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[900px]">
                        {/* Large Feature - Video */}
                        <div className="md:col-span-2 md:row-span-2 rounded-[2rem] bg-[#0e0e10] border border-white/5 p-10 flex flex-col relative overflow-hidden group hover:border-white/10 transition-all shadow-2xl">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-1000"></div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-white mb-auto shadow-lg backdrop-blur-md">
                                    <CubeIcon className="w-8 h-8 text-indigo-400" />
                                </div>
                                <div className="mt-24 mb-12">
                                    <h3 className="text-3xl font-semibold text-white mb-4">Generative Video Engine</h3>
                                    <p className="text-zinc-400 max-w-md leading-relaxed text-lg">Create broadcast-ready commercials and UGC content using our proprietary Sora 2 integration. Text-to-video has never been this precise.</p>
                                </div>
                                {/* Abstract visual */}
                                <div className="flex-1 bg-zinc-950 rounded-xl border border-white/5 relative overflow-hidden shadow-inner group-hover:shadow-lg transition-all">
                                    {/* Simulated Video UI */}
                                    <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 z-20">
                                        <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full w-1/3 bg-indigo-500 rounded-full"></div>
                                        </div>
                                        <div className="text-xs font-mono text-zinc-500">00:12 / 00:45</div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
                                    {/* Moving gradient blob */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 animate-pulse blur-[80px] opacity-40"></div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 - Imaging */}
                        <div className="md:col-span-1 md:row-span-1 rounded-[2rem] bg-[#0e0e10] border border-white/5 p-8 relative overflow-hidden group hover:border-white/10 transition-all shadow-xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>
                            <div className="w-12 h-12 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-white mb-8 shadow-lg">
                                <SwatchIcon className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Brand Imaging</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">Consistent visual identity generation. Never go off-brand with our context-aware style lock.</p>
                        </div>

                        {/* Feature 3 - Strategy */}
                        <div className="md:col-span-1 md:row-span-1 rounded-[2rem] bg-[#0e0e10] border border-white/5 p-8 relative overflow-hidden group hover:border-white/10 transition-all shadow-xl">
                             <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 blur-[80px] rounded-full pointer-events-none"></div>
                            <div className="w-12 h-12 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center justify-center text-white mb-8 shadow-lg">
                                <ChartBarIcon className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Market Strategy</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">Deep competitive analysis & data-driven planning. Know your enemy, then outperform them.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-32 px-6 bg-[#050505] border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto">
                     <div className="text-center mb-20">
                        <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-white mb-6">Transparent Pricing.</h2>
                        <p className="text-zinc-400 text-lg">Enterprise power, accessible scaling.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Starter', price: '$29', desc: 'For individuals.', features: ['10 Video Generations', '50 Image Generations', 'Standard Support'] },
                            { name: 'Pro', price: '$99', desc: 'For growing teams.', popular: true, features: ['50 Video Generations', 'Unlimited Images', 'Brand Analysis', 'Priority Support'] },
                            { name: 'Enterprise', price: 'Custom', desc: 'For organizations.', features: ['Unlimited Everything', 'API Access', 'SSO', 'Dedicated Success Manager'] }
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
                        <div className="w-6 h-6 rounded bg-zinc-800"></div>
                        <span className="text-sm font-semibold text-zinc-500">Marketing AI</span>
                    </div>
                    <div className="flex gap-8 text-sm text-zinc-600">
                        <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-zinc-400 cursor-pointer transition-colors">Terms of Service</span>
                        <span className="hover:text-zinc-400 cursor-pointer transition-colors">Twitter</span>
                        <span className="hover:text-zinc-400 cursor-pointer transition-colors">GitHub</span>
                    </div>
                    <div className="text-xs text-zinc-700">
                        © 2024 Marketing AI Inc.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;