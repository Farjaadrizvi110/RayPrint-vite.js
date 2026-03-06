import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Facebook, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-[#0B0F17] border-t border-[rgba(246,248,255,0.08)]">
      {/* Newsletter Section */}
      <div className="rp-container py-16 border-b border-[rgba(246,248,255,0.08)]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-semibold text-[#F6F8FF] mb-3">
              Get the print playbook.
            </h3>
            <p className="text-[#A6B0C5] mb-6">
              Tips, templates, and product drops—once a week, no noise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Email address"
                className="flex-1 bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF] placeholder:text-[#A6B0C5]/50"
              />
              <Button className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white px-6">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="rp-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-tight text-[#F6F8FF]">
                Ray<span className="text-[#3B6CFF]">Print</span>
              </span>
            </Link>
            <p className="text-sm text-[#A6B0C5] mb-6 max-w-xs">
              Professional online printing services. Fast, affordable, and custom—made for creators, businesses, and everyone in between.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[#A6B0C5] hover:text-[#3B6CFF] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#A6B0C5] hover:text-[#3B6CFF] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#A6B0C5] hover:text-[#3B6CFF] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#A6B0C5] hover:text-[#3B6CFF] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Products */}
          <div>
            <h4 className="font-semibold text-[#F6F8FF] mb-4">Products</h4>
            <ul className="space-y-3">
              <li><Link to="/products/business-cards" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Business Cards</Link></li>
              <li><Link to="/products/postcards-flyers" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Flyers</Link></li>
              <li><Link to="/products/packaging" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Packaging</Link></li>
              <li><Link to="/products/apparel" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Apparel</Link></li>
              <li><Link to="/products/signs-banners" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Signage</Link></li>
              <li><Link to="/products" className="text-sm text-[#3B6CFF] hover:underline">View All</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold text-[#F6F8FF] mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Help Center</Link></li>
              <li><Link to="/upload-artwork" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">File Setup</Link></li>
              <li><Link to="/faq" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Shipping Info</Link></li>
              <li><Link to="/faq" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Returns</Link></li>
              <li><Link to="/contact" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold text-[#F6F8FF] mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">About Us</Link></li>
              <li><Link to="/about" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Careers</Link></li>
              <li><Link to="/about" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Sustainability</Link></li>
              <li><Link to="/about" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Partners</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold text-[#F6F8FF] mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#A6B0C5] mt-0.5" />
                <span className="text-sm text-[#A6B0C5]">123 Print Street<br />London, EC1A 1BB</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#A6B0C5]" />
                <a href="tel:+442012345678" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">+44 20 1234 5678</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#A6B0C5]" />
                <a href="mailto:hello@rayprint.co.uk" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">hello@rayprint.co.uk</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-[#A6B0C5]" />
                <a href="https://wa.me/447757202729" target="_blank" rel="noopener noreferrer" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">+44 7757 202729</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-[rgba(246,248,255,0.08)]">
        <div className="rp-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#A6B0C5]">
              © {new Date().getFullYear()} RayPrint. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Privacy Policy</Link>
              <Link to="/" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Terms of Service</Link>
              <Link to="/" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
