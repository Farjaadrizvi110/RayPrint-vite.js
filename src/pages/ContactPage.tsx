import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Message sent! We\'ll get back to you soon.');
    setIsSubmitting(false);
  };
  
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'hello@rayprint.co.uk',
      link: 'mailto:hello@rayprint.co.uk',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+44 20 1234 5678',
      link: 'tel:+442012345678',
    },
    {
      icon: MapPin,
      title: 'Address',
      content: '123 Print Street, London, EC1A 1BB',
      link: '#',
    },
    {
      icon: Clock,
      title: 'Hours',
      content: 'Mon-Fri: 9am - 6pm GMT',
      link: '#',
    },
  ];
  
  return (
    <div className="min-h-screen bg-[#0B0F17] pt-32 pb-20">
      <div className="rp-container max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="rp-micro-label block mb-4">CONTACT US</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F6F8FF] mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-[#A6B0C5] max-w-2xl mx-auto">
            Have a question or need help with your order? We're here to help.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {contactInfo.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="flex items-start gap-4 p-4 rounded-xl bg-[rgba(246,248,255,0.04)] border border-[rgba(246,248,255,0.08)] hover:border-[rgba(246,248,255,0.15)] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[rgba(59,108,255,0.2)] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#3B6CFF]" />
                </div>
                <div>
                  <p className="text-sm text-[#A6B0C5] mb-1">{item.title}</p>
                  <p className="text-[#F6F8FF]">{item.content}</p>
                </div>
              </a>
            ))}
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rp-card p-8">
              <h2 className="text-xl font-semibold text-[#F6F8FF] mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm text-[#A6B0C5] mb-2 block">Name</Label>
                    <Input 
                      required
                      className="bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF]"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#A6B0C5] mb-2 block">Email</Label>
                    <Input 
                      type="email"
                      required
                      className="bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF]"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-[#A6B0C5] mb-2 block">Subject</Label>
                  <Input 
                    required
                    className="bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF]"
                  />
                </div>
                
                <div>
                  <Label className="text-sm text-[#A6B0C5] mb-2 block">Message</Label>
                  <Textarea 
                    required
                    rows={6}
                    className="bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white py-6"
                >
                  {isSubmitting ? 'Sending...' : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
