import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Palette, Layout, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export function DesignRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProjectTypeOpen, setIsProjectTypeOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const projectTypeRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    projectType: '',
    description: '',
    colorPreferences: '',
    budget: '',
    deadline: '',
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectTypeRef.current && !projectTypeRef.current.contains(event.target as Node)) {
        setIsProjectTypeOpen(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(event.target as Node)) {
        setIsBudgetOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/contact/design-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Something went wrong. Please try again.');
        return;
      }
      toast.success("Request sent! We'll be in touch within 24 hours. Check your inbox for a confirmation.");
      setFormData({ projectType: '', description: '', colorPreferences: '', budget: '', deadline: '', name: '', email: '', phone: '', addressLine1: '', addressLine2: '', city: '', postcode: '' });
    } catch {
      toast.error('Network error. Please try again or email us directly at info@raydesign.uk');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const services = [
    {
      icon: Palette,
      title: 'Logo Design',
      description: 'Clean marks that scale from cards to billboards.',
    },
    {
      icon: Layout,
      title: 'Layout Help',
      description: 'Turn rough ideas into print-ready files.',
    },
    {
      icon: Sparkles,
      title: 'Brand System',
      description: 'Type, color, and templates that stay consistent.',
    },
  ];

  const projectTypes = [
    { value: 'logo', label: 'Logo Design' },
    { value: 'layout', label: 'Layout Help' },
    { value: 'brand', label: 'Brand System' },
    { value: 'other', label: 'Other' },
  ];

  const budgetRanges = [
    { value: 'under-500', label: 'Under £500' },
    { value: '500-1000', label: '£500 - £1,000' },
    { value: '1000-2500', label: '£1,000 - £2,500' },
    { value: '2500+', label: '£2,500+' },
  ];
  
  return (
    <div className="min-h-screen bg-[#0B0F17]">

      {/* ── Hero Banner with background image ── */}
      <div
        className="relative w-full pt-40 pb-24 flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F17]/80 via-[#0B0F17]/70 to-[#0B0F17]" />
        {/* Blue accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#3B6CFF]/20 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 px-6"
        >
          <span className="rp-micro-label block mb-4">DESIGN SERVICES</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F6F8FF] mb-4">
            Request a Custom Design
          </h1>
          <p className="text-lg text-[#A6B0C5] max-w-2xl mx-auto">
            Work with our in-house design team to bring your vision to life. Revisions included, timelines tight.
          </p>
        </motion.div>
      </div>

      {/* ── Page body ── */}
      <div className="w-full max-w-5xl mx-auto px-6 pb-24">

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-14 -mt-6"
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="rp-card p-6 text-center hover:border-[rgba(246,248,255,0.20)] transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-[rgba(59,108,255,0.2)] flex items-center justify-center mx-auto mb-4">
                <service.icon className="w-6 h-6 text-[#3B6CFF]" />
              </div>
              <h3 className="text-lg font-semibold text-[#F6F8FF] mb-2">{service.title}</h3>
              <p className="text-sm text-[#A6B0C5]">{service.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Form — centred, max 860 px */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-[860px] mx-auto"
        >
          <div className="rp-card p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-[#F6F8FF] mb-8">Tell us about your project</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Project Type Custom Dropdown */}
                <div className="relative" ref={projectTypeRef}>
                  <Label className="text-sm text-[#A6B0C5] mb-2 block">Project Type</Label>
                  <button
                    type="button"
                    onClick={() => setIsProjectTypeOpen(!isProjectTypeOpen)}
                    className="w-full px-4 py-3 rounded-xl bg-[rgba(246,248,255,0.06)] border border-[rgba(246,248,255,0.10)] text-[#F6F8FF] focus:outline-none focus:border-[#3B6CFF] flex items-center justify-between transition-all hover:border-[rgba(246,248,255,0.20)]"
                  >
                    <span className={formData.projectType ? 'text-[#F6F8FF]' : 'text-[#A6B0C5]'}>
                      {formData.projectType 
                        ? projectTypes.find(p => p.value === formData.projectType)?.label 
                        : 'Select a service'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-[#A6B0C5] transition-transform duration-300 ${isProjectTypeOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isProjectTypeOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-[#0B0F17] border border-[rgba(246,248,255,0.15)] rounded-xl overflow-hidden z-20 shadow-xl"
                    >
                      {projectTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => {
                            setFormData({...formData, projectType: type.value});
                            setIsProjectTypeOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm transition-all hover:bg-[rgba(59,108,255,0.15)] ${
                            formData.projectType === type.value 
                              ? 'bg-[rgba(59,108,255,0.2)] text-[#3B6CFF]' 
                              : 'text-[#F6F8FF]'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm text-[#A6B0C5] mb-2 block">Your Name</Label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] focus:border-[#3B6CFF] transition-colors"
                  />
                </div>
              </div>
              
              {/* Email + Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-[#A6B0C5] mb-2 block">Email Address</Label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] focus:border-[#3B6CFF] transition-colors"
                  />
                </div>
                <div>
                  <Label className="text-sm text-[#A6B0C5] mb-2 block">Phone Number</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g., +44 7700 900000"
                    className="bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] focus:border-[#3B6CFF] transition-colors placeholder:text-[#4A5568]"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <Label className="text-sm text-[#A6B0C5] mb-2 block">Address Line 1</Label>
                <Input
                  value={formData.addressLine1}
                  onChange={e => setFormData({...formData, addressLine1: e.target.value})}
                  placeholder="Street address, building number"
                  className="bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] focus:border-[#3B6CFF] transition-colors placeholder:text-[#4A5568]"
                />
              </div>
              <div>
                <Label className="text-sm text-[#A6B0C5] mb-2 block">Address Line 2 <span className="text-[#4A5568] text-xs">(optional)</span></Label>
                <Input
                  value={formData.addressLine2}
                  onChange={e => setFormData({...formData, addressLine2: e.target.value})}
                  placeholder="Apartment, suite, unit, etc."
                  className="bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] focus:border-[#3B6CFF] transition-colors placeholder:text-[#4A5568]"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-[#A6B0C5] mb-2 block">City / Town</Label>
                  <Input
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    placeholder="e.g., London"
                    className="bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] focus:border-[#3B6CFF] transition-colors placeholder:text-[#4A5568]"
                  />
                </div>
                <div>
                  <Label className="text-sm text-[#A6B0C5] mb-2 block">Postcode</Label>
                  <Input
                    value={formData.postcode}
                    onChange={e => setFormData({...formData, postcode: e.target.value})}
                    placeholder="e.g., SW1A 1AA"
                    className="bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] focus:border-[#3B6CFF] transition-colors placeholder:text-[#4A5568]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm text-[#A6B0C5] mb-2 block">Project Description</Label>
                <Textarea 
                  required
                  rows={5}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell us about your project, goals, and any specific requirements..."
                  className="bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] focus:border-[#3B6CFF] transition-colors resize-none"
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm text-[#A6B0C5] mb-2 block">Color Preferences</Label>
                  <Input 
                    value={formData.colorPreferences}
                    onChange={e => setFormData({...formData, colorPreferences: e.target.value})}
                    placeholder="e.g., Blue, Gold"
                    className="bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] focus:border-[#3B6CFF] transition-colors"
                  />
                </div>
                
                {/* Budget Range Custom Dropdown */}
                <div className="relative" ref={budgetRef}>
                  <Label className="text-sm text-[#A6B0C5] mb-2 block">Budget Range</Label>
                  <button
                    type="button"
                    onClick={() => setIsBudgetOpen(!isBudgetOpen)}
                    className="w-full px-4 py-3 rounded-xl bg-[rgba(246,248,255,0.06)] border border-[rgba(246,248,255,0.10)] text-[#F6F8FF] focus:outline-none focus:border-[#3B6CFF] flex items-center justify-between transition-all hover:border-[rgba(246,248,255,0.20)]"
                  >
                    <span className={formData.budget ? 'text-[#F6F8FF]' : 'text-[#A6B0C5]'}>
                      {formData.budget 
                        ? budgetRanges.find(b => b.value === formData.budget)?.label 
                        : 'Select budget'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-[#A6B0C5] transition-transform duration-300 ${isBudgetOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isBudgetOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-[#0B0F17] border border-[rgba(246,248,255,0.15)] rounded-xl overflow-hidden z-20 shadow-xl"
                    >
                      {budgetRanges.map((budget) => (
                        <button
                          key={budget.value}
                          type="button"
                          onClick={() => {
                            setFormData({...formData, budget: budget.value});
                            setIsBudgetOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm transition-all hover:bg-[rgba(59,108,255,0.15)] ${
                            formData.budget === budget.value 
                              ? 'bg-[rgba(59,108,255,0.2)] text-[#3B6CFF]' 
                              : 'text-[#F6F8FF]'
                          }`}
                        >
                          {budget.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm text-[#A6B0C5] mb-2 block">Desired Deadline</Label>
                  <Input 
                    type="date"
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                    className="bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] focus:border-[#3B6CFF] transition-colors"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff] hover:from-[#2a5aee] hover:to-[#4a75f0] text-white py-6 rounded-xl font-semibold shadow-lg shadow-[#3B6CFF]/25 transition-all hover:scale-[1.02]"
              >
                {isSubmitting ? 'Submitting...' : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
              
              <p className="text-xs text-[#A6B0C5] text-center">
                We'll review your request and get back to you within 24 hours.
              </p>
            </form>
          </div>
        </motion.div>
      </div>{/* end max-w-5xl body */}
    </div>
  );
}
