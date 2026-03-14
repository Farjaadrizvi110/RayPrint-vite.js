import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Target, Heart, Zap, Users, Award, Leaf,
  MapPin, Building2, CalendarCheck, CheckCircle2,
  ShieldCheck, Printer, Palette, PackageCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutPage() {
  const values = [
    { icon: Target,  title: 'Precision',      description: 'Every order is quality-checked before it leaves our facility. We catch issues so you never have to.' },
    { icon: Award,   title: 'Excellence',      description: 'Premium materials, calibrated presses, and experienced operators — every run, every time.' },
    { icon: Zap,     title: 'Speed',           description: 'Fast turnarounds from 24 hours, with no compromise on the finish quality your brand deserves.' },
    { icon: Heart,   title: 'Passion',         description: 'Print is what we live for. That passion drives every design decision and production choice we make.' },
    { icon: Users,   title: 'Real Support',    description: 'A dedicated team answers your questions, reviews your artwork, and keeps your project on track.' },
    { icon: Leaf,    title: 'Sustainability',  description: 'FSC-certified stocks, vegetable inks, and recycled options — doing right by the planet is non-negotiable.' },
  ];

  const stats = [
    { value: '9+',     label: 'Years in Business' },
    { value: '80+',    label: 'Print Products' },
    { value: '99.8%',  label: 'Satisfaction Rate' },
    { value: '24hr',   label: 'Fastest Turnaround' },
  ];

  const expertise = [
    { icon: Printer,     title: 'State-of-the-Art Presses',  desc: 'Cutting-edge digital and litho printing technology for pin-sharp results across every format.' },
    { icon: Palette,     title: 'In-House Design Team',      desc: 'Professional designers who understand print — from colour profiles to bleed and safe zones.' },
    { icon: PackageCheck,title: 'End-to-End Fulfilment',     desc: 'Printed, finished, packed and shipped directly to your door or your customers — tracked every step.' },
    { icon: ShieldCheck, title: 'Registered & Accountable',  desc: 'RAY DESIGN AND PRINT LTD — a fully registered UK Private Limited Company since 2016.' },
  ];
  
  return (
    <div className="min-h-screen bg-blue-50 pt-32 pb-20">
      <div className="rp-container">

        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-20">
          <span className="block mb-4 text-lg font-bold uppercase tracking-[0.22em] text-[#3B6CFF]">About Ray Design and Print Ltd</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] mb-6 leading-tight">
            Where Quality Print<br className="hidden md:block" /> Meets British Craftsmanship
          </h1>
          <p className="text-lg text-[#64748B] max-w-3xl mx-auto leading-relaxed">
            Since 2016, we've been helping UK businesses, brands, and creatives make a lasting impression — one perfectly printed piece at a time. From a single business card to 200,000 flyers, every order is treated like it matters. Because it does.
          </p>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="rp-card p-6 text-center hover:border-[#3B6CFF]/40 hover:shadow-lg transition-all">
              <p className="text-3xl md:text-4xl font-bold text-[#3B6CFF] mb-2">{stat.value}</p>
              <p className="text-sm text-[#64748B]">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Our Story ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <span className="block mb-4 text-lg font-bold uppercase tracking-[0.22em] text-[#3B6CFF]">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-6 leading-tight">
              Built on a belief that great print changes everything
            </h2>
            <p className="text-[#475569] text-base lg:text-[17px] leading-[1.85] mb-5">
              Ray Design and Print Ltd was incorporated on <strong className="text-[#0F172A] font-semibold">12 July 2016</strong> with one clear purpose: to give every business access to print quality that was once reserved for big brands with big budgets. Based in <strong className="text-[#0F172A] font-semibold">Blackburn, Lancashire</strong>, we've grown into a trusted nationwide online print service — but we've never lost that personal, hands-on approach.
            </p>
            <p className="text-[#475569] text-base lg:text-[17px] leading-[1.85] mb-5">
              We believe a well-crafted business card opens doors. A striking flyer fills rooms. Professional packaging turns first-time buyers into loyal advocates. Print is a physical handshake between your brand and your customer — and we take that seriously.
            </p>
            <p className="text-[#475569] text-base lg:text-[17px] leading-[1.85]">
              That's why we've invested in state-of-the-art presses, an expert in-house design team, and a streamlined online ordering system — so you get premium results without the hassle.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-[28px] overflow-hidden">
              <img src="/images/hero_collage.jpg" alt="RayPrint production facility" className="w-full h-full object-cover" />
            </div>
            {/* Floating trust badge */}
            <div className="absolute -bottom-5 -left-5 bg-white border border-[#3B6CFF]/30 rounded-2xl px-5 py-4 shadow-xl">
              <p className="text-xs text-[#64748B] mb-1">Company Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[#0F172A] font-semibold">Active — Est. 2016</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── What We Do ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-20">
          <div className="text-center mb-12">
            <span className="block mb-4 text-lg font-bold uppercase tracking-[0.22em] text-[#3B6CFF]">
              Our Expertise
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">Everything you need, under one roof</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rp-card p-6 hover:border-[#3B6CFF]/40 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#3B6CFF]/10 flex items-center justify-center mb-4 group-hover:bg-[#3B6CFF]/20 transition-colors">
                  <item.icon className="w-6 h-6 text-[#3B6CFF]" />
                </div>
                <h3 className="text-base font-semibold text-[#0F172A] mb-2">{item.title}</h3>
                <p className="text-[#64748B] text-sm lg:text-base leading-[1.8]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Values ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-20">
          <div className="text-center mb-12">
            <span className="block mb-3 text-xl text-rayprintBlue">WHAT WE STAND FOR</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">Our values, in every print</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rp-card p-6 hover:border-[#3B6CFF]/40 hover:shadow-lg transition-all group">
                <value.icon className="w-8 h-8 text-[#3B6CFF] mb-4" />
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{value.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Company Registration ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-20">
          <div className="text-center mb-10">
            <span className="block mb-3 text-xl text-rayprintBlue">REGISTERED BUSINESS</span>
            <h2 className="text-3xl font-bold text-[#0F172A]">Fully registered &amp; accountable</h2>
            <p className="text-[#64748B] mt-3 max-w-xl mx-auto">We're a fully registered UK Private Limited Company — transparent, trustworthy, and here for the long run.</p>
          </div>
          <div className="max-w-3xl mx-auto rp-card p-8 border-[rgba(59,108,255,0.25)]">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-[#3B6CFF]/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#3B6CFF]" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#0F172A]">RAY DESIGN AND PRINT LTD</p>
                <p className="text-sm text-[#64748B]">Company No. <span className="text-[#0F172A] font-semibold">10272806</span></p>
              </div>
              <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-green-600">Active</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-[#3B6CFF] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#64748B] mb-1 uppercase tracking-wider">Registered Address</p>
                  <p className="text-sm text-[#0F172A] font-medium leading-snug">1a Edmundson Street,<br />Blackburn, BB2 1HL<br />United Kingdom</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CalendarCheck className="w-5 h-5 text-[#3B6CFF] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#64748B] mb-1 uppercase tracking-wider">Incorporated On</p>
                  <p className="text-sm text-[#0F172A] font-medium">12 July 2016</p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-[#3B6CFF] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#64748B] mb-1 uppercase tracking-wider">Company Type</p>
                  <p className="text-sm text-[#0F172A] font-medium">Private Limited Company</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center p-12 rounded-[28px] border border-[#3B6CFF]/20 bg-gradient-to-br from-blue-100 to-blue-50">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">Ready to make an impression?</h2>
          <p className="text-[#64748B] mb-8 max-w-xl mx-auto">Browse our full range of print products — or get in touch and let our team help you find the perfect solution for your brand.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button className="bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff] hover:from-[#2a5aee] hover:to-[#4a75f0] text-white px-8 py-6 text-base shadow-lg shadow-[#3B6CFF]/25">Browse Products</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-slate-300 text-[#0F172A] hover:bg-slate-50 px-8 py-6 text-base">Get in Touch</Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
