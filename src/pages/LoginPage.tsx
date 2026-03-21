import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    const debug = params.get('debug');
    if (error === 'google_failed') {
      const msg = debug ? `Google sign-in failed: ${decodeURIComponent(debug)}` : 'Google sign-in failed. Please try again.';
      toast.error(msg);
    }
  }, [location.search]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Invalid email or password.');
        return;
      }
      const { token, user } = data.data;
      loginWithToken(token, {
        id: user._id ?? user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role ?? 'customer',
        addresses: user.addresses ?? [],
        createdAt: new Date(user.createdAt ?? Date.now()),
        avatar: user.avatar,
      });
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate('/account');
    } catch {
      toast.error('Network error — please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const features = [
    { icon: Sparkles, text: 'Premium Quality Prints' },
    { icon: Shield, text: 'Secure Checkout' },
    { icon: Zap, text: 'Fast Turnaround' },
  ];
  
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Visual */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/login-bg.jpg" 
            alt="Abstract background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/80 via-[#0F172A]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 via-transparent to-transparent" />
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#3B6CFF] flex items-center justify-center">
                <span className="text-xl font-bold text-white">R</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Ray<span className="text-[#3B6CFF]">Print</span>
              </span>
            </Link>
          </motion.div>
          
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-md"
          >
            <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
              Print that<br />
              <span className="text-[#3B6CFF]">moves</span> people.
            </h1>
            <p className="text-lg text-white/75 mb-10">
              From business cards to billboards—upload your art or customize a template. 
              Fast turnaround, premium finishes.
            </p>
            
            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-[rgba(59,108,255,0.2)] flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-[#3B6CFF]" />
                  </div>
                  <span className="text-white font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex gap-8"
          >
            <div>
              <p className="text-3xl font-bold text-white">50K+</p>
              <p className="text-sm text-white/70">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">1M+</p>
              <p className="text-sm text-white/70">Products Printed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">99.8%</p>
              <p className="text-sm text-white/70">Satisfaction</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#3B6CFF] flex items-center justify-center">
                <span className="text-xl font-bold text-white">R</span>
              </div>
              <span className="text-2xl font-bold text-[#0F172A]">
                Ray<span className="text-[#3B6CFF]">Print</span>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-3">
                Welcome back
              </h2>
              <p className="text-[#64748B]">
                Sign in to access your account and orders
              </p>
            </motion.div>
          </div>
          
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#3B6CFF]/20 via-[#3B6CFF]/10 to-[#3B6CFF]/20 rounded-3xl blur-xl opacity-50" />
            
            <div className="relative bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/60">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Label className="text-sm font-medium text-[#475569] mb-3 block">
                    Email Address
                  </Label>
                  <div className={`relative transition-all duration-300 ${
                    focusedField === 'email' ? 'transform scale-[1.02]' : ''
                  }`}>
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      focusedField === 'email' ? 'text-[#3B6CFF]' : 'text-[#94a3b8]'
                    }`} />
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="pl-12 py-6 bg-slate-50 border-slate-200 text-[#0F172A] rounded-xl focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#3B6CFF]/20 transition-all placeholder:text-slate-400"
                      placeholder="you@example.com"
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Label className="text-sm font-medium text-[#475569] mb-3 block">
                    Password
                  </Label>
                  <div className={`relative transition-all duration-300 ${
                    focusedField === 'password' ? 'transform scale-[1.02]' : ''
                  }`}>
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      focusedField === 'password' ? 'text-[#3B6CFF]' : 'text-[#94a3b8]'
                    }`} />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="pl-12 pr-12 py-6 bg-slate-50 border-slate-200 text-[#0F172A] rounded-xl focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#3B6CFF]/20 transition-all placeholder:text-slate-400"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0F172A] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>
                
                {/* Remember & Forgot */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center justify-between"
                >
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="w-5 h-5 rounded-md bg-slate-100 border border-slate-300 peer-checked:bg-[#3B6CFF] peer-checked:border-[#3B6CFF] transition-all" />
                      <svg className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="none">
                        <path d="M5 10L8.5 13.5L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-sm text-[#64748B] group-hover:text-[#0F172A] transition-colors">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-[#3B6CFF] hover:text-[#5a85ff] transition-colors">
                    Forgot password?
                  </a>
                </motion.div>
                
                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff] hover:from-[#2a5aee] hover:to-[#4a75f0] text-white py-7 rounded-xl font-semibold text-lg shadow-lg shadow-[#3B6CFF]/25 hover:shadow-[#3B6CFF]/40 transition-all duration-300 hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>
              
              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="relative my-8"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-[#64748B]">or continue with</span>
                </div>
              </motion.div>

              {/* Google OAuth Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.5 }}
              >
                <button
                  type="button"
                  onClick={() => { window.location.href = `${BACKEND_URL}/api/auth/google`; }}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  {/* Google logo SVG */}
                  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M47.532 24.552c0-1.636-.132-3.2-.388-4.704H24.48v8.898h12.984c-.56 3.02-2.26 5.576-4.816 7.292v6.056h7.796c4.56-4.196 7.088-10.376 7.088-17.542z" fill="#4285F4"/>
                    <path d="M24.48 48c6.516 0 11.984-2.16 15.98-5.852l-7.796-6.056c-2.16 1.448-4.92 2.308-8.184 2.308-6.296 0-11.632-4.252-13.54-9.968H2.9v6.248C6.88 42.828 15.104 48 24.48 48z" fill="#34A853"/>
                    <path d="M10.94 28.432A14.64 14.64 0 0 1 9.98 24c0-1.54.264-3.036.732-4.432v-6.248H2.9A23.98 23.98 0 0 0 .48 24c0 3.876.928 7.54 2.58 10.68l8.004-6.248h-.124z" fill="#FBBC05"/>
                    <path d="M24.48 9.6c3.548 0 6.728 1.22 9.232 3.616l6.916-6.916C36.46 2.42 30.996 0 24.48 0 15.104 0 6.88 5.172 2.9 13.32l8.04 6.248C12.848 13.852 18.184 9.6 24.48 9.6z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </motion.div>

              {/* Register Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-center mt-6"
              >
                <p className="text-[#64748B]">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-[#3B6CFF] hover:text-[#5a85ff] font-semibold transition-colors">
                    Create one
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
          

        </motion.div>
      </div>
    </div>
  );
}
