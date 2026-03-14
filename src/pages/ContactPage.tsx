import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const set = (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/api/contact/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message ?? "Message sent! We'll get back to you soon.");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.message ?? 'Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'info@raydesign.uk',
      link: 'mailto:info@raydesign.uk',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+44 7757 202729',
      link: 'tel:+447757202729',
    },
    {
      icon: MapPin,
      title: 'Address',
      content: '1a Edmundson Street, Blackburn, BB2 1HL, United Kingdom',
      link: 'https://maps.google.com/?q=1a+Edmundson+Street,+Blackburn,+BB2+1HL',
    },
    {
      icon: Clock,
      title: 'Hours',
      content: 'Mon-Fri: 9am – 6pm GMT',
      link: '#',
    },
  ];
  
  return (
    <div className="min-h-screen bg-blue-50">

      {/* ── Hero Banner ── */}
      <div
        className="relative w-full pt-40 pb-24 flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#3B6CFF]/20 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 px-6"
        >
          <span className="rp-micro-label block mb-4">CONTACT US</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Have a question or need help with your order? We're here to help.
          </p>
        </motion.div>
      </div>

      {/* ── Page body ── */}
      <div className="w-full max-w-5xl mx-auto px-6 pb-24">

        {/* ── Contact info cards — 4 columns, overlapping hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14 -mt-6"
        >
          {contactInfo.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="rp-card p-6 text-center hover:border-[#3B6CFF]/40 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-[#3B6CFF]/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-[#3B6CFF]" />
              </div>
              <h3 className="text-sm font-semibold text-[#0F172A] mb-1">{item.title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{item.content}</p>
            </a>
          ))}
        </motion.div>

        {/* ── Form — centred, max 860 px ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-[860px] mx-auto"
        >
          <div className="rounded-[28px] border border-blue-100 bg-blue-50 p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#0F172A] mb-8">Send us a message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-[#475569] mb-2 block">Name</Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={set('name')}
                    placeholder="Your full name"
                    className="bg-slate-50 border-slate-200 text-[#0F172A] focus:border-[#3B6CFF] transition-colors"
                  />
                </div>
                <div>
                  <Label className="text-sm text-[#475569] mb-2 block">Email</Label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={set('email')}
                    placeholder="you@example.com"
                    className="bg-slate-50 border-slate-200 text-[#0F172A] focus:border-[#3B6CFF] transition-colors"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm text-[#475569] mb-2 block">Subject</Label>
                <Input
                  required
                  value={formData.subject}
                  onChange={set('subject')}
                  placeholder="What's this about?"
                  className="bg-slate-50 border-slate-200 text-[#0F172A] focus:border-[#3B6CFF] transition-colors"
                />
              </div>

              <div>
                <Label className="text-sm text-[#475569] mb-2 block">Message</Label>
                <Textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={set('message')}
                  placeholder="Tell us how we can help…"
                  className="bg-slate-50 border-slate-200 text-[#0F172A] focus:border-[#3B6CFF] transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff] hover:from-[#2a5aee] hover:to-[#4a75f0] text-white py-6 rounded-xl font-semibold shadow-lg shadow-[#3B6CFF]/25 transition-all hover:scale-[1.02]"
              >
                {isSubmitting ? 'Sending…' : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </Button>

              <p className="text-xs text-[#64748B] text-center">
                We'll reply to your message within 24 hours.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
