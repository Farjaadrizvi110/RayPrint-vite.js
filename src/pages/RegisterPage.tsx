import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms');
      return;
    }
    
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    login({
      id: '1',
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: 'customer',
      addresses: [],
      createdAt: new Date(),
    });
    
    toast.success('Account created successfully!');
    navigate('/account');
    setIsLoading(false);
  };
  
  const features = [
    { icon: Sparkles, text: 'Premium Quality Prints' },
    { icon: Shield, text: 'Secure Checkout' },
    { icon: Zap, text: 'Fast Turnaround' },
  ];
  
  return (
    <div className="min-h-screen bg-[#0B0F17] flex">
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent" />
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
              Start your<br />
              <span className="text-[#3B6CFF]">printing</span> journey.
            </h1>
            <p className="text-lg text-[#A6B0C5] mb-10">
              Join thousands of creators and businesses who trust RayPrint for their printing needs.
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
                  <span className="text-[#F6F8FF] font-medium">{feature.text}</span>
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
              <p className="text-sm text-[#A6B0C5]">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">1M+</p>
              <p className="text-sm text-[#A6B0C5]">Products Printed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">99.8%</p>
              <p className="text-sm text-[#A6B0C5]">Satisfaction</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md py-8"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#3B6CFF] flex items-center justify-center">
                <span className="text-xl font-bold text-white">R</span>
              </div>
              <span className="text-2xl font-bold text-white">
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
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F6F8FF] mb-3">
                Create an account
              </h2>
              <p className="text-[#A6B0C5]">
                Join RayPrint and start printing today
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
            
            <div className="relative bg-[rgba(246,248,255,0.03)] backdrop-blur-xl border border-[rgba(246,248,255,0.08)] rounded-3xl p-8 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Fields */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <Label className="text-sm font-medium text-[#A6B0C5] mb-2 block">
                      First Name
                    </Label>
                    <div className={`relative transition-all duration-300 ${
                      focusedField === 'firstName' ? 'transform scale-[1.02]' : ''
                    }`}>
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === 'firstName' ? 'text-[#3B6CFF]' : 'text-[#A6B0C5]'
                      }`} />
                      <Input 
                        required
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        onFocus={() => setFocusedField('firstName')}
                        onBlur={() => setFocusedField(null)}
                        className="pl-12 py-5 bg-[rgba(246,248,255,0.05)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] rounded-xl focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#3B6CFF]/20 transition-all"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#A6B0C5] mb-2 block">
                      Last Name
                    </Label>
                    <div className={`relative transition-all duration-300 ${
                      focusedField === 'lastName' ? 'transform scale-[1.02]' : ''
                    }`}>
                      <Input 
                        required
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        onFocus={() => setFocusedField('lastName')}
                        onBlur={() => setFocusedField(null)}
                        className="px-4 py-5 bg-[rgba(246,248,255,0.05)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] rounded-xl focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#3B6CFF]/20 transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </motion.div>
                
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Label className="text-sm font-medium text-[#A6B0C5] mb-2 block">
                    Email Address
                  </Label>
                  <div className={`relative transition-all duration-300 ${
                    focusedField === 'email' ? 'transform scale-[1.02]' : ''
                  }`}>
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      focusedField === 'email' ? 'text-[#3B6CFF]' : 'text-[#A6B0C5]'
                    }`} />
                    <Input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="pl-12 py-5 bg-[rgba(246,248,255,0.05)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] rounded-xl focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#3B6CFF]/20 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </motion.div>
                
                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Label className="text-sm font-medium text-[#A6B0C5] mb-2 block">
                    Password
                  </Label>
                  <div className={`relative transition-all duration-300 ${
                    focusedField === 'password' ? 'transform scale-[1.02]' : ''
                  }`}>
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      focusedField === 'password' ? 'text-[#3B6CFF]' : 'text-[#A6B0C5]'
                    }`} />
                    <Input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="pl-12 pr-12 py-5 bg-[rgba(246,248,255,0.05)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] rounded-xl focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#3B6CFF]/20 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>
                
                {/* Confirm Password */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <Label className="text-sm font-medium text-[#A6B0C5] mb-2 block">
                    Confirm Password
                  </Label>
                  <div className={`relative transition-all duration-300 ${
                    focusedField === 'confirmPassword' ? 'transform scale-[1.02]' : ''
                  }`}>
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      focusedField === 'confirmPassword' ? 'text-[#3B6CFF]' : 'text-[#A6B0C5]'
                    }`} />
                    <Input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      className="pl-12 py-5 bg-[rgba(246,248,255,0.05)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] rounded-xl focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#3B6CFF]/20 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </motion.div>
                
                {/* Terms */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div className="relative mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={formData.agreeTerms}
                      onChange={e => setFormData({...formData, agreeTerms: e.target.checked})}
                      className="peer sr-only" 
                    />
                    <div className="w-5 h-5 rounded-md bg-[rgba(246,248,255,0.05)] border border-[rgba(246,248,255,0.15)] peer-checked:bg-[#3B6CFF] peer-checked:border-[#3B6CFF] transition-all cursor-pointer" />
                    <svg className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 20 20" fill="none">
                      <path d="M5 10L8.5 13.5L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm text-[#A6B0C5]">
                    I agree to the{' '}
                    <a href="#" className="text-[#3B6CFF] hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-[#3B6CFF] hover:underline">Privacy Policy</a>
                  </span>
                </motion.div>
                
                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
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
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Create Account
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
                transition={{ delay: 1, duration: 0.5 }}
                className="relative my-8"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[rgba(246,248,255,0.08)]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-[#0B0F17] text-sm text-[#A6B0C5]">or</span>
                </div>
              </motion.div>
              
              {/* Login Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="text-center"
              >
                <p className="text-[#A6B0C5]">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#3B6CFF] hover:text-[#5a85ff] font-semibold transition-colors">
                    Sign in
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
