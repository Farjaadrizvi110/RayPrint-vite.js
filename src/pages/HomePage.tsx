import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star, Leaf, Package, Zap, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories, reviews, getFeaturedProducts } from '@/data/products';

gsap.registerPlugin(ScrollTrigger);

// Animated Counter
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;

    gsap.fromTo(el, 
      { innerText: 0 },
      {
        innerText: value,
        duration: 2,
        ease: 'power2.out',
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
        },
      }
    );
  }, [value]);

  return <span ref={counterRef}>{value}{suffix}</span>;
}

// Hero Section with 3D effects
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 3D title entrance
      tl.fromTo('.hero-title-line',
        { opacity: 0, y: 120, rotateX: 60, transformOrigin: 'center bottom' },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.4, stagger: 0.15, ease: 'power4.out' }
      )
      .fromTo('.hero-badge',
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' },
        '-=1'
      )
      .fromTo('.hero-desc',
        { opacity: 0, y: 50, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo('.hero-btn',
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
        '-=0.5'
      );

      // Continuous floating animation
      gsap.to('.hero-float-element', {
        y: -20,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // Glow pulse
      gsap.to('.hero-glow', {
        opacity: 0.6,
        scale: 1.1,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background Layers */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        {/* Elegant Printing Background Image */}
        <img 
          src="/images/hero-printing-bg.jpg" 
          alt="Premium printing equipment and typography"
          className="w-full h-full object-cover"
        />
        
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17] via-[#0B0F17]/85 to-[#0B0F17]/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-[#0B0F17]/30 z-10" />
        
        {/* Animated blue glow effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#3B6CFF]/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-[#5a85ff]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </motion.div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#3B6CFF]/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 rp-container pt-32 pb-20"
      >
        <div className="max-w-3xl" style={{ perspective: '1000px' }}>
          {/* Badge */}
          <motion.div
            className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(59,108,255,0.15)] border border-[rgba(59,108,255,0.3)] mb-8"
          >
            <span className="w-2 h-2 bg-[#3B6CFF] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[#3B6CFF] tracking-wide">ONLINE PRINTING</span>
          </motion.div>
          
          {/* 3D Title */}
          <h1 
            ref={titleRef}
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#F6F8FF] leading-[0.9] mb-8"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <span className="hero-title-line block" style={{ transformOrigin: 'center bottom' }}>
              Print that
            </span>
            <span className="hero-title-line block text-transparent bg-clip-text bg-gradient-to-r from-[#3B6CFF] via-[#5a85ff] to-[#3B6CFF]" style={{ transformOrigin: 'center bottom' }}>
              moves people.
            </span>
          </h1>
          
          {/* Description with blur reveal */}
          <motion.p
            className="hero-desc text-xl md:text-2xl text-[#A6B0C5] mb-10 max-w-xl leading-relaxed"
          >
            From business cards to billboards—upload your art or customize a template. 
            <span className="text-[#F6F8FF]"> Fast turnaround</span>, premium finishes, shipped flat.
          </motion.p>
          
          {/* CTA Buttons with 3D hover */}
          <div className="flex flex-wrap gap-4 mb-16">
            <Link to="/products">
              <Button 
                className="hero-btn group relative bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff] hover:from-[#2a5aee] hover:to-[#4a75f0] text-white text-lg px-8 py-7 rounded-2xl font-semibold shadow-lg shadow-[#3B6CFF]/30 hover:shadow-[#3B6CFF]/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start an order
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </Link>
            <Link to="/products">
              <Button 
                variant="outline" 
                className="hero-btn group border-[rgba(246,248,255,0.2)] text-[#F6F8FF] hover:bg-[rgba(246,248,255,0.08)] hover:border-[rgba(246,248,255,0.4)] text-lg px-8 py-7 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2 text-[#3B6CFF]" />
                Browse templates
              </Button>
            </Link>
          </div>
          
          {/* Stats Row */}
          <div className="hero-stats flex flex-wrap gap-8 md:gap-12">
            {[
              { value: 500, suffix: '+', label: 'Happy Customers' },
              { value: 500000, suffix: '+', label: 'Products Printed' },
              { value: 99, suffix: '%', label: 'Satisfaction Rate' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.6 }}
              >
                <p className="text-3xl md:text-4xl font-bold text-[#F6F8FF]">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-[#A6B0C5] mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[#A6B0C5]">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-[rgba(246,248,255,0.3)] flex justify-center pt-2">
            <motion.div 
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#3B6CFF]" 
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Category Grid with 3D Cards
function CategoryGridSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.category-title',
        { opacity: 0, y: 60, rotateX: 30 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.category-title',
            start: 'top 85%',
          },
        }
      );

      gsap.fromTo('.category-card',
        { opacity: 0, y: 80, rotateX: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.category-grid',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-[#0B0F17] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgba(59,108,255,0.3)] to-transparent" />
      
      <div className="rp-container">
        <div className="text-center mb-16" style={{ perspective: '1000px' }}>
          <motion.span 
            className="inline-block text-sm font-medium text-[#3B6CFF] tracking-widest uppercase mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Products
          </motion.span>
          <h2 className="category-title text-5xl md:text-6xl font-bold text-[#F6F8FF] mb-6">
            What are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff]">printing</span> today?
          </h2>
          <p className="text-lg text-[#A6B0C5] max-w-2xl mx-auto">
            Choose from our wide range of premium print products, all with fast turnaround and exceptional quality.
          </p>
        </div>
        
        <div className="category-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" style={{ perspective: '1500px' }}>
          {categories.slice(0, 11).map((category) => (
            <Link key={category.id} to={`/products/${category.slug}`}>
              <motion.div 
                className="category-card group relative aspect-square rounded-3xl overflow-hidden cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{ 
                  rotateY: 5, 
                  rotateX: -5, 
                  scale: 1.05,
                  z: 50,
                }}
                transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#3B6CFF]/0 via-[#3B6CFF]/30 to-[#3B6CFF]/0 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                
                {/* Card content */}
                <div className="relative h-full bg-[rgba(246,248,255,0.03)] border border-[rgba(246,248,255,0.08)] rounded-3xl overflow-hidden group-hover:border-[rgba(59,108,255,0.4)] transition-all duration-500">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/60 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-[#F6F8FF] group-hover:text-[#3B6CFF] transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-[#A6B0C5] mt-1">{category.productCount} products</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[rgba(59,108,255,0.2)] flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <ChevronRight className="w-5 h-5 text-[#3B6CFF]" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Products with 3D showcase
function FeaturedProductSection({ 
  product, 
  index 
}: { 
  product: ReturnType<typeof getFeaturedProducts>[0]; 
  index: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isReversed = index % 2 === 1;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(`.product-content-${index}`,
        { opacity: 0, x: isReversed ? 80 : -80 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(`.product-image-${index}`,
        { opacity: 0, x: isReversed ? -80 : 80, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [index, isReversed]);

  return (
    <section ref={sectionRef} className="py-24 bg-[#0B0F17] relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[rgba(59,108,255,0.3)] to-transparent" />
      
      <div className="rp-container">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
          {/* Content */}
          <div className={`product-content-${index} ${isReversed ? 'lg:order-2' : ''}`}>
            <motion.span 
              className="inline-block text-sm font-medium text-[#3B6CFF] tracking-widest uppercase mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {product.category.replace(/-/g, ' ')}
            </motion.span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F6F8FF] leading-tight mb-6">
              {product.shortDescription.split('.')[0]}.
            </h2>
            
            <p className="text-lg text-[#A6B0C5] mb-8 leading-relaxed">
              {product.description}
            </p>
            
            <div className="flex flex-wrap gap-3 mb-10">
              {product.specs.map((spec, i) => (
                <span 
                  key={i} 
                  className="px-4 py-2 bg-[rgba(246,248,255,0.05)] border border-[rgba(246,248,255,0.1)] rounded-full text-sm text-[#A6B0C5] hover:border-[rgba(59,108,255,0.4)] hover:text-[#F6F8FF] transition-all"
                >
                  {spec}
                </span>
              ))}
            </div>
            
            <Link to={`/product/${product.slug}`}>
              <Button className="group bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff] hover:from-[#2a5aee] hover:to-[#4a75f0] text-white px-8 py-6 rounded-2xl font-semibold shadow-lg shadow-[#3B6CFF]/25 hover:shadow-[#3B6CFF]/40 transition-all duration-300 hover:scale-105">
                Design your {product.name.split(' ').slice(-1)[0].toLowerCase()}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {/* Image with 3D effect */}
          <motion.div
            className={`product-image-${index} relative ${isReversed ? 'lg:order-1' : ''}`}
            style={{ perspective: '1000px' }}
          >
            <motion.div
              className="relative aspect-[4/5] rounded-3xl overflow-hidden"
              whileHover={{ rotateY: isReversed ? -8 : 8, rotateX: -5 }}
              transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#3B6CFF]/30 to-[#5a85ff]/30 rounded-[2rem] blur-2xl opacity-50" />
              
              <img 
                src={product.image} 
                alt={product.name}
                className="relative w-full h-full object-cover rounded-3xl"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17]/60 via-transparent to-transparent rounded-3xl" />
              
              {/* Floating badge */}
              <motion.div 
                className="absolute bottom-6 left-6 right-6 p-4 bg-[rgba(11,15,23,0.8)] backdrop-blur-xl border border-[rgba(246,248,255,0.1)] rounded-2xl"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#A6B0C5]">Starting from</p>
                    <p className="text-2xl font-bold text-[#F6F8FF]">£{product.priceTiers[0]?.price.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#3B6CFF] flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Accent dot */}
            <motion.div 
              className={`absolute ${isReversed ? 'left-6' : 'right-6'} bottom-6 w-4 h-4 rounded-full bg-[#3B6CFF]`}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Design Services Section
function DesignServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.design-title',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.design-title',
            start: 'top 85%',
          },
        }
      );

      gsap.fromTo('.design-feature',
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.design-features',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-[#F4F6FA] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#3B6CFF]/10 rounded-full blur-[100px]" />
      </div>
      
      <div className="rp-container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <motion.span 
              className="inline-block text-sm font-medium text-[#3B6CFF] tracking-widest uppercase mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Design Services
            </motion.span>
            
            <h2 className="design-title text-5xl md:text-6xl font-bold text-[#0B0F17] leading-tight mb-6">
              Need a design?<br />
              <span className="text-[#3B6CFF]">We've got you.</span>
            </h2>
            
            <p className="text-lg text-[#4A5568] mb-10 leading-relaxed">
              Work with our in-house team to build brand-ready artwork—logos, layouts, and campaign systems. Revisions included, timelines tight.
            </p>
            
            <div className="design-features space-y-5 mb-10">
              {[
                { title: 'LOGO DESIGN', desc: 'Clean marks that scale from cards to billboards.', icon: '01' },
                { title: 'LAYOUT HELP', desc: 'Turn rough ideas into print-ready files.', icon: '02' },
                { title: 'BRAND SYSTEM', desc: 'Type, color, and templates that stay consistent.', icon: '03' },
              ].map((service, i) => (
                <motion.div 
                  key={i} 
                  className="design-feature flex gap-5 p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
                  whileHover={{ x: 10 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B6CFF] to-[#5a85ff] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{service.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0B0F17] mb-1">{service.title}</h4>
                    <p className="text-sm text-[#4A5568]">{service.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <Link to="/request-design">
              <Button className="group bg-[#0B0F17] hover:bg-[#1a2030] text-white px-8 py-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105">
                Request design support
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#3B6CFF]/20 to-[#3B6CFF]/5 flex items-center justify-center relative overflow-hidden">
              {/* Animated circles */}
              <motion.div 
                className="absolute w-64 h-64 rounded-full border-2 border-[#3B6CFF]/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div 
                className="absolute w-48 h-48 rounded-full border-2 border-[#3B6CFF]/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
              
              <div className="text-center relative z-10">
                <motion.div 
                  className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#3B6CFF] to-[#5a85ff] flex items-center justify-center shadow-xl shadow-[#3B6CFF]/30"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Zap className="w-10 h-10 text-white" />
                </motion.div>
                <p className="text-5xl font-bold text-[#0B0F17]">48hr</p>
                <p className="text-[#4A5568] mt-2">Turnaround on design</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Sustainability Section
function SustainabilitySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.sustain-stat',
        { opacity: 0, y: 60, rotateX: 20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.sustain-stats',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: '80', suffix: '%+', label: 'FSC-certified paper usage', icon: Leaf },
    { value: '100', suffix: '%', label: 'Recyclable shipping boxes', icon: Package },
    { value: '0', suffix: '', label: 'Carbon offset available', icon: Zap },
  ];

  return (
    <section ref={sectionRef} className="py-32 bg-[#0B0F17] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#3B6CFF]/10 rounded-full blur-[150px]" />
      </div>
      
      <div className="rp-container relative">
        <div className="text-center mb-16">
          <motion.span 
            className="inline-block text-sm font-medium text-[#3B6CFF] tracking-widest uppercase mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Commitment
          </motion.span>
          
          <h2 className="text-5xl md:text-6xl font-bold text-[#F6F8FF] mb-6">
            Print <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff]">responsibly.</span>
          </h2>
          
          <p className="text-lg text-[#A6B0C5] max-w-2xl mx-auto">
            We use FSC-certified papers, water-based inks, and recyclable packaging—so your brand looks good and does good.
          </p>
        </div>
        
        <div className="sustain-stats grid md:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="sustain-stat group relative p-8 rounded-3xl bg-[rgba(246,248,255,0.03)] border border-[rgba(246,248,255,0.08)] hover:border-[rgba(59,108,255,0.4)] transition-all duration-500"
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glow on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#3B6CFF]/0 via-[#3B6CFF]/20 to-[#3B6CFF]/0 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-[rgba(59,108,255,0.15)] flex items-center justify-center mb-6 group-hover:bg-[rgba(59,108,255,0.25)] transition-colors">
                  <stat.icon className="w-7 h-7 text-[#3B6CFF]" />
                </div>
                
                <p className="text-5xl font-bold text-[#F6F8FF] mb-2">
                  {stat.value}{stat.suffix}
                </p>
                <p className="text-[#A6B0C5]">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Reviews Section
function ReviewsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.review-card',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.reviews-grid',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-[#0B0F17] relative overflow-hidden">
      <div className="rp-container">
        <div className="text-center mb-16">
          <motion.span 
            className="inline-block text-sm font-medium text-[#3B6CFF] tracking-widest uppercase mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Testimonials
          </motion.span>
          
          <h2 className="text-5xl md:text-6xl font-bold text-[#F6F8FF] mb-6">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff]">teams</span> everywhere.
          </h2>
          
          <p className="text-lg text-[#A6B0C5] max-w-2xl mx-auto">
            See why creators, founders, and marketing teams choose RayPrint.
          </p>
        </div>
        
        <div className="reviews-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              className="review-card group p-8 rounded-3xl bg-[rgba(246,248,255,0.03)] border border-[rgba(246,248,255,0.08)] hover:border-[rgba(59,108,255,0.4)] transition-all duration-500"
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#3B6CFF] text-[#3B6CFF]" />
                ))}
              </div>
              
              <h4 className="text-xl font-semibold text-[#F6F8FF] mb-3">
                "{review.title}"
              </h4>
              
              <p className="text-[#A6B0C5] mb-6 leading-relaxed">
                {review.content}
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3B6CFF] to-[#5a85ff] flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {review.userName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-[#F6F8FF]">{review.userName}</p>
                  <p className="text-sm text-[#A6B0C5]">{review.userRole}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main HomePage
export function HomePage() {
  const featuredProducts = getFeaturedProducts();
  
  return (
    <div className="bg-[#0B0F17]">
      <HeroSection />
      <CategoryGridSection />
      {featuredProducts.slice(0, 5).map((product, index) => (
        <FeaturedProductSection key={product.id} product={product} index={index} />
      ))}
      <DesignServicesSection />
      <SustainabilitySection />
      <ReviewsSection />
    </div>
  );
}
