import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import VantaBackground from '../components/VantaBackground';
import Card from '../components/ui/Card';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && name) {
      setIsLoading(true);
       setTimeout(() => {
          login(email, name);
          navigate('/dashboard');
       }, 1500);
    }
  };

  const handleGoogleSignup = () => {
      setIsLoading(true);
      setTimeout(() => {
          login('user@gmail.com', 'Google User');
          navigate('/dashboard');
      }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-background-dark overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none">
         <VantaBackground>
            <div className="absolute inset-0 bg-gradient-to-b from-background-dark/60 to-background-dark/90" />
         </VantaBackground>
      </div>

      <div className="w-full max-w-md z-10 px-4 py-8">
        <div className="text-center mb-8 animate-fade-in-up">
          <Logo href="/" className="inline-flex" iconClassName="w-12 h-12" textClassName="text-3xl text-white font-display" />
        </div>
        
        <Card className="p-8 border border-surface-border shadow-2xl shadow-primary/10 animate-fade-in-up backdrop-blur-xl bg-background-card/80" style={{animationDelay: '0.1s'}}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white font-display">Create Account</h2>
            <p className="text-text-secondary text-sm mt-2">Start your enterprise AI journey today.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                label="Full Name"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
            />
            <Input
                label="Company Name (Optional)"
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc."
            />

            <Input
              label="Work Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
            />
            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min. 8 characters"
            />
            
            <div className="pt-4">
                <Button type="submit" className="w-full shadow-lg shadow-primary/25" isLoading={isLoading} size="lg" rightIcon={<ArrowRightIcon className="w-4 h-4" />}>
                    Create Account
                </Button>
            </div>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#131520] text-text-secondary rounded">Or register with</span>
                </div>
            </div>
            
            <Button 
                type="button" 
                variant="secondary" 
                size="md" 
                className="w-full justify-center hover:bg-white hover:text-black transition-colors" 
                onClick={handleGoogleSignup}
                disabled={isLoading}
            >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                Sign up with Google
            </Button>
          </form>
          
          <p className="mt-8 text-sm text-center text-text-secondary">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-primary hover:text-primary-hover hover:underline transition-colors">
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;