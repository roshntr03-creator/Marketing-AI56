
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import Card from '../components/ui/Card';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, t } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      setTimeout(() => {
          login(email);
          navigate('/dashboard');
      }, 1000);
    }
  };

  const handleGoogleLogin = () => {
      setIsLoading(true);
      setTimeout(() => {
          login('google.user@example.com', 'Google User');
          navigate('/dashboard');
      }, 1000);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
      e.preventDefault();
      alert("Reset link sent to your email address.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#09090b] overflow-hidden font-sans text-zinc-100">
      <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md z-10 px-4">
        <div className="text-center mb-8">
          <Logo href="/" className="inline-flex justify-center mb-6" textClassName="text-xl text-white" />
          <h2 className="text-2xl font-semibold text-white tracking-tight">{t('signin.title')}</h2>
          <p className="text-zinc-500 text-sm mt-2">Welcome back to your workspace.</p>
        </div>
        
        <Card className="p-8 border border-white/5 shadow-2xl bg-[#09090b]/80 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('signin.email')}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
              className="bg-zinc-900/50 border-white/10 focus:border-indigo-500/50"
            />
            <Input
              label={t('signin.password')}
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-zinc-900/50 border-white/10 focus:border-indigo-500/50"
            />
            
            <div className="flex items-center justify-end">
                <button onClick={handleForgotPassword} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</button>
            </div>

            <div className="pt-2">
                <Button type="submit" className="w-full" isLoading={isLoading} size="lg" rightIcon={<ArrowRightIcon className="w-4 h-4"/>}>
                    {t('signin.button')}
                </Button>
            </div>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#09090b] text-zinc-500">Or continue with</span>
                </div>
            </div>
            
            <Button 
                type="button" 
                variant="secondary" 
                size="md" 
                className="w-full justify-center"
                onClick={handleGoogleLogin}
                disabled={isLoading}
            >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                Google
            </Button>
          </form>
          
          <p className="mt-6 text-sm text-center text-zinc-500">
            {t('signin.no_account')}{' '}
            <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Create Account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SignInPage;
