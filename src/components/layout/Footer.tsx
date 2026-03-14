import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Facebook, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-[#F8FAFC] border-t border-[rgba(15,23,42,0.08)]">
      {/* Newsletter Section */}
      <div className="rp-container py-16 border-b border-[rgba(15,23,42,0.08)]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-semibold text-[#0F172A] mb-3">
              Get the print playbook.
            </h3>
            <p className="text-[#64748B] mb-6">
              Tips, templates, and product drops—once a week, no noise.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-white border-[rgba(15,23,42,0.15)] text-[#0F172A] placeholder:text-[#64748B]/60"
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
              <span className="text-2xl font-bold tracking-tight text-[#0F172A]">
                Ray<span className="text-[#3B6CFF]">Print</span>
              </span>
            </Link>
            <p className="text-sm text-[#64748B] mb-6 max-w-xs">
              Professional online printing services. Fast, affordable, and custom—made for creators, businesses, and everyone in between.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[#64748B] hover:text-[#3B6CFF] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#64748B] hover:text-[#3B6CFF] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#64748B] hover:text-[#3B6CFF] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#64748B] hover:text-[#3B6CFF] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-[#0F172A] mb-4">Products</h4>
            <ul className="space-y-3">
              <li><Link to="/products/business-cards" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Business Cards</Link></li>
              <li><Link to="/products/postcards-flyers" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Flyers</Link></li>
              <li><Link to="/products/packaging" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Packaging</Link></li>
              <li><Link to="/products/apparel" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Apparel</Link></li>
              <li><Link to="/products/signs-banners" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Signage</Link></li>
              <li><Link to="/products" className="text-sm text-[#3B6CFF] hover:underline">View All</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-[#0F172A] mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Help Center</Link></li>
              <li><Link to="/upload-artwork" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">File Setup</Link></li>
              <li><Link to="/faq" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Shipping Info</Link></li>
              <li><Link to="/faq" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Returns</Link></li>
              <li><Link to="/contact" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-[#0F172A] mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">About Us</Link></li>
              <li><Link to="/about" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Careers</Link></li>
              <li><Link to="/about" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Sustainability</Link></li>
              <li><Link to="/about" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Partners</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-[#0F172A] mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#64748B] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#64748B]">1a Edmundson Street<br />Blackburn, BB2 1HL<br />United Kingdom</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#64748B]" />
                <a href="tel:+447757202729" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">+44 7757 202729</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#64748B]" />
                <a href="mailto:info@raydesign.uk" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">info@raydesign.uk</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-[#64748B]" />
                <a href="https://wa.me/447757202729" target="_blank" rel="noopener noreferrer" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">WhatsApp Us</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[rgba(15,23,42,0.08)]">
        <div className="rp-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#64748B]">
              © {new Date().getFullYear()} RayPrint. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Privacy Policy</Link>
              <Link to="/" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Terms of Service</Link>
              <Link to="/" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
