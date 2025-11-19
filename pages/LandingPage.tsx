import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PRICING_PLANS } from '../constants';
import Logo from '../components/ui/Logo';
import { ArrowRightIcon, PlayCircleIcon, VideoCameraIcon, PhotoIcon, ChartBarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// 3D Perspective Grid & Starfield Background
const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let frameId: number;
    let time = 0;

    interface Star {
      x: number;
      y: number;
      z: number;
      size: number;
    }

    const stars: Star[] = [];
    const numStars = 800;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 3,
        y: (Math.random() - 0.5) * height * 3,
        z: Math.random() * width,
        size: Math.random() * 1.5
      });
    }

    const drawGrid = (t: number) => {
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)'; // Very subtle indigo
        ctx.lineWidth = 1;
        
        const horizonY = height * 0.55;
        const gridSize = 80;
        const speed = 15;
        const offset = (t * speed) % gridSize;
        
        // Vertical lines (perspective)
        ctx.beginPath();
        for (let x = -width; x < width * 3; x += gridSize * 3) {
             const x1 = (x - width/2) * 0.1 + width/2;
             const x2 = (x - width/2) * 8 + width/2;
             
             const grad = ctx.createLinearGradient(x1, horizonY, x2, height);
             grad.addColorStop(0, 'rgba(99, 102, 241, 0)');
             grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.1)');
             grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
             ctx.strokeStyle = grad;
             
             ctx.moveTo(x1, horizonY);
             ctx.lineTo(x2, height);
             ctx.stroke();
        }

        // Horizontal lines (moving forward)
        for (let y = 0; y < height - horizonY; y += gridSize / 2) {
             const perspectiveY = horizonY + Math.pow(y / (height - horizonY), 2.5) * (height - horizonY);
             const moveY = perspectiveY + (offset * (y / (height - horizonY)) * 0.1);
             
             if (moveY > horizonY && moveY < height) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (moveY/height)})`;
                ctx.moveTo(0, moveY);
                ctx.lineTo(width, moveY);
                ctx.stroke();
             }
        }
        
        // Horizon Glow
        const gradient = ctx.createLinearGradient(0, horizonY - 100, 0, horizonY + 100);
        gradient.addColorStop(0, 'rgba(9, 9, 11, 1)');
        gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.05)'); // Subtle horizon light
        gradient.addColorStop(1, 'rgba(9, 9, 11, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, horizonY - 100, width, 200);
    };

    const drawStars = () => {
      ctx.fillStyle = '#ffffff';
      stars.forEach(star => {
        const x = (star.x / star.z) * width + width / 2;
        const y = (star.y / star.z) * height + height / 2;
        const size = (1 - star.z / width) * star.size;

        if (x > 0 && x < width && y > 0 && y < height && size > 0) {
            ctx.globalAlpha = (1 - star.z / width) * 0.8;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        star.z -= 0.2; // Slower star movement
        if (star.z <= 0) {
             star.z = width;
             star.x = (Math.random() - 0.5) * width * 3;
             star.y = (Math.random() - 0.5) * height * 3;
        }
      });
      ctx.globalAlpha = 1;
    };

    const render = () => {
      time += 0.02;
      ctx.fillStyle = '#050505'; // Very dark background
      ctx.fillRect(0, 0, width, height);
      
      drawStars();
      drawGrid(time);
      
      frameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
};

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };
    
    const handleGetStarted = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/signup');
    };

    return (
        <div className="relative w-full min-h-screen flex flex-col font-sans text-zinc-100 bg-[#050505] selection:bg-indigo-500/30 overflow-x-hidden">
            <InteractiveBackground />

            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Logo href="/" iconClassName="w-6 h-6 text-white" textClassName="text-lg font-medium tracking-tight text-white font-display" />
                    
                    <nav className="hidden md:flex items-center gap-8">
                        {['Features', 'Pricing'].map((item) => (
                            <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                                {item}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/signin" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Sign In</Link>
                        <Link to="/signup">
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 shadow-lg shadow-indigo-900/20">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center pt-40 pb-32 px-6 text-center min-h-screen">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/20 border border-indigo-500/20 mb-12 animate-fade-in-up backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    <span className="text-xs font-medium text-indigo-300 tracking-wide">Sora 2 Video Engine Live</span>
                </div>

                {/* Main Title */}
                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-8 max-w-5xl mx-auto leading-[1.1] animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    Marketing Intelligence <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-200 to-zinc-600">Reimagined.</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    The comprehensive operating system for modern brands. Generate video, design visuals, and craft strategy with enterprise-grade AI.
                </p>

                {/* Actions - CHANGED WHITE BUTTON TO INDIGO TO FIX CONTRAST ISSUE */}
                <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mx-auto animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                    <input 
                        type="email" 
                        placeholder="Enter your work email..." 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full sm:flex-1 h-12 px-4 rounded-lg bg-[#18181b] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
                    />
                    <Button 
                        type="submit"
                        size="lg" 
                        className="h-12 px-6 w-full sm:w-auto whitespace-nowrap bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)]" 
                        rightIcon={<ArrowRightIcon className="w-4 h-4" />}
                    >
                        Start Free
                    </Button>
                </form>
                
                <div className="mt-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                     <button className="text-sm text-zinc-500 hover:text-zinc-300 flex items-center gap-2 transition-colors">
                        <PlayCircleIcon className="w-4 h-4" />
                        <span>Watch 2-minute demo</span>
                     </button>
                </div>

            </main>

            {/* Features Grid */}
            <section id="features" className="relative z-10 py-32 px-6 bg-[#050505]">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20 border-b border-white/5 pb-8">
                        <h2 className="font-display text-3xl md:text-4xl font-medium text-white mb-4">Unified Intelligence.</h2>
                        <p className="text-zinc-400 max-w-xl text-lg leading-relaxed">Stop switching between fragmented tools. Access a cohesive suite of generative engines designed for professional workflows.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Large Feature */}
                        <div className="md:col-span-2 min-h-[360px] rounded-2xl bg-[#0e0e10] border border-white/5 p-10 flex flex-col hover:border-white/10 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-40 bg-indigo-500/5 blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-auto border border-indigo-500/20 shadow-lg shadow-indigo-900/10">
                                    <VideoCameraIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-medium text-white mb-3">Generative Video Production</h3>
                                    <p className="text-zinc-400 max-w-md leading-relaxed">Create broadcast-ready commercials and UGC content using our proprietary Sora 2 integration. Text-to-video has never been this precise.</p>
                                </div>
                            </div>
                        </div>

                        {/* Smaller Features */}
                        <div className="space-y-6">
                            <div className="h-[200px] rounded-2xl bg-[#0e0e10] border border-white/5 p-8 hover:border-white/10 transition-all duration-300 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-400 mb-4 border border-white/5">
                                        <PhotoIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-1">Brand Imaging</h3>
                                    <p className="text-sm text-zinc-500">Consistent visual identity generation.</p>
                                </div>
                            </div>
                            <div className="h-[200px] rounded-2xl bg-[#0e0e10] border border-white/5 p-8 hover:border-white/10 transition-all duration-300 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-400 mb-4 border border-white/5">
                                        <ChartBarIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-1">Market Strategy</h3>
                                    <p className="text-sm text-zinc-500">Deep competitive analysis & planning.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="relative z-10 py-32 px-6 border-t border-white/5 bg-[#080809]">
                <div className="max-w-7xl mx-auto">
                     <div className="text-center mb-20">
                        <h2 className="font-display text-3xl font-medium text-white mb-4">Transparent Pricing.</h2>
                        <p className="text-zinc-400 text-lg">Enterprise power, accessible scaling.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PRICING_PLANS.map((plan, idx) => (
                            <div 
                                key={idx} 
                                className={`p-8 rounded-2xl border flex flex-col transition-all duration-300 relative ${
                                    plan.isPopular 
                                    ? 'bg-[#121214] border-indigo-500/30 shadow-2xl shadow-indigo-900/5' 
                                    : 'bg-transparent border-white/5 hover:border-white/10 hover:bg-white/5'
                                }`}
                            >
                                {plan.isPopular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-0.5 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-400 shadow-lg">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-white mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-medium text-white tracking-tight font-display">{plan.price}</span>
                                        <span className="text-zinc-500 text-sm">{plan.frequency}</span>
                                    </div>
                                    <p className="text-sm text-zinc-400 leading-relaxed">{plan.description}</p>
                                </div>
                                
                                <div className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircleIcon className="w-5 h-5 text-indigo-500/80 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-zinc-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link to="/signup" className="w-full">
                                    <Button 
                                        variant={plan.isPopular ? 'primary' : 'outline'} 
                                        className={`w-full justify-center h-11 ${plan.isPopular ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500' : 'border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600'}`}
                                    >
                                        Select {plan.name}
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 bg-[#050505]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                         <Logo href="/" iconClassName="w-5 h-5 text-zinc-500" textClassName="text-sm text-zinc-500" />
                    </div>
                    <div className="flex gap-8 text-sm text-zinc-600">
                        <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-zinc-400 transition-colors">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;