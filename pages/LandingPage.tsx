import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import VantaBackground from '../components/VantaBackground';
import { LANDING_FEATURES, PRICING_PLANS } from '../constants';
import Card from '../components/ui/Card';
import Logo from '../components/ui/Logo';
import { ArrowRightIcon, SparklesIcon, CheckCircleIcon, EnvelopeIcon, MapPinIcon, PlayCircleIcon } from '@heroicons/react/24/solid';

const LandingPage: React.FC = () => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative w-full min-h-screen flex flex-col font-sans text-text-primary bg-background-dark overflow-x-hidden">
            {/* Immersive Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <VantaBackground>
                   <div className="absolute inset-0 bg-gradient-to-b from-background-dark/30 via-background-dark/80 to-background-dark pointer-events-none" />
                </VantaBackground>
            </div>

            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background-dark/80 backdrop-blur-xl transition-all duration-300 shadow-lg shadow-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Logo href="/" iconClassName="w-10 h-10" textClassName="text-xl text-white font-display tracking-tight" />
                    
                    <nav className="hidden md:flex items-center gap-8">
                        <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Capabilities</button>
                        <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Pricing</button>
                        <button onClick={() => scrollToSection('contact')} className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Contact</button>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/signin" className="hidden sm:block text-sm font-medium text-white hover:text-primary transition-colors">
                            Sign In
                        </Link>
                        <Link to="/signup">
                            <Button size="sm" variant="primary" rightIcon={<ArrowRightIcon className="w-4 h-4" />}>
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center min-h-screen">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in-up shadow-lg shadow-primary/10 hover:bg-white/10 transition-colors cursor-default">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                    </span>
                    <span className="text-xs font-bold text-primary-300 uppercase tracking-widest">Enterprise AI Suite 2.0</span>
                </div>

                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 max-w-5xl mx-auto leading-[1.1] animate-fade-in-up drop-shadow-2xl" style={{animationDelay: '0.1s'}}>
                    Marketing mastery, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary animate-gradient-x">reimagined by AI.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    The unified operating system for modern marketing teams. Generate cinema-quality video, edit assets, and deploy campaigns with a single prompt.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                    <Link to="/signup">
                        <Button size="lg" variant="primary" className="w-full sm:w-auto min-w-[200px] h-14 text-lg shadow-xl shadow-primary/20">
                            Start Free Trial
                        </Button>
                    </Link>
                    <button onClick={() => scrollToSection('features')}>
                         <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 text-lg border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10" leftIcon={<PlayCircleIcon className="w-5 h-5" />}>
                            See How It Works
                        </Button>
                    </button>
                </div>

                {/* Floating Visuals */}
                <div className="absolute top-1/3 left-10 hidden xl:block animate-float opacity-60 pointer-events-none">
                    <div className="glass-panel p-4 rounded-2xl rotate-[-6deg] w-64 border-t border-white/20">
                        <div className="flex items-center gap-3 mb-3">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 animate-pulse"></div>
                             <div className="h-2 w-24 bg-white/20 rounded"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-white/10 rounded"></div>
                            <div className="h-2 w-3/4 bg-white/10 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-20 right-10 hidden xl:block animate-float opacity-60 pointer-events-none" style={{animationDelay: '1s'}}>
                    <div className="glass-panel p-2 rounded-2xl rotate-[6deg] w-64 border-t border-white/20">
                        <div className="aspect-video bg-gradient-to-tr from-primary/40 to-purple-500/40 rounded-lg border border-white/10 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                    <PlayCircleIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-32 px-4 bg-background-dark border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">Capabilities</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto text-lg">A comprehensive suite of tools designed to replace your entire agency stack.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {LANDING_FEATURES.map((feature, index) => (
                           <Card key={index} className="p-8 hover:-translate-y-2 transition-transform duration-300 bg-gradient-to-b from-white/5 to-transparent border-white/10 group" hoverEffect>
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20 shadow-inner shadow-primary/5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 font-display">{feature.name}</h3>
                                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                           </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="relative z-10 py-32 px-4 bg-[#050914] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                     <div className="text-center mb-20">
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">Transparent Pricing</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto text-lg">Choose the perfect plan for your growth stage. Upgrade or cancel anytime.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {PRICING_PLANS.map((plan, idx) => (
                            <Card 
                                key={idx} 
                                className={`relative p-8 flex flex-col h-full transition-transform duration-300 ${plan.isPopular ? 'border-primary shadow-2xl shadow-primary/10 bg-background-card scale-105 z-10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                            >
                                {plan.isPopular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white font-display">{plan.name}</h3>
                                    <p className="text-sm text-text-secondary mt-2 min-h-[40px]">{plan.description}</p>
                                </div>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-5xl font-bold text-white tracking-tight">{plan.price}</span>
                                    <span className="text-text-secondary text-lg">{plan.frequency}</span>
                                </div>
                                <Link to="/signup" className="w-full">
                                    <Button 
                                        variant={plan.isPopular ? 'primary' : 'secondary'} 
                                        className="w-full justify-center py-4 text-lg font-bold"
                                    >
                                        {plan.price === 'Contact Us' ? 'Contact Sales' : 'Get Started'}
                                    </Button>
                                </Link>
                                <div className="mt-8 space-y-4 flex-1 pt-8 border-t border-white/5">
                                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">What's Included:</p>
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-text-primary">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                    
                    <div className="mt-16 text-center">
                        <p className="text-text-muted text-sm">Need a custom enterprise solution? <a href="#contact" className="text-primary hover:underline">Contact our sales team</a>.</p>
                    </div>
                </div>
            </section>

            {/* Contact / Footer Section */}
            <section id="contact" className="relative z-10 py-24 px-4 bg-background-dark border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <Logo href="/" iconClassName="w-8 h-8" textClassName="text-2xl text-white" />
                        <p className="mt-6 text-text-secondary max-w-sm leading-relaxed">
                            AI Marketing Suite is the premier platform for automated content generation. 
                            San Francisco, CA.
                        </p>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-text-secondary">
                                <MapPinIcon className="w-5 h-5 text-primary" />
                                <span>123 AI Boulevard, Tech City, CA 94105</span>
                            </div>
                            <div className="flex items-center gap-3 text-text-secondary">
                                <EnvelopeIcon className="w-5 h-5 text-primary" />
                                <span>enterprise@aimarketingsuite.com</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-white font-bold mb-6 font-display">Platform</h4>
                            <ul className="space-y-4 text-sm text-text-secondary">
                                <li><button onClick={() => scrollToSection('features')} className="hover:text-primary transition-colors">Features</button></li>
                                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-primary transition-colors">Pricing</button></li>
                                <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
                                <li><Link to="/signin" className="hover:text-primary transition-colors">Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 font-display">Legal</h4>
                            <ul className="space-y-4 text-sm text-text-secondary">
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
                    <p>&copy; {new Date().getFullYear()} AI Marketing Suite. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;