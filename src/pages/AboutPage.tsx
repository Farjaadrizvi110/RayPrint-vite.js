import { motion } from 'framer-motion';
import { Target, Heart, Zap, Users, Award, Leaf } from 'lucide-react';

export function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Precision',
      description: 'Every print is checked for quality before it leaves our facility.',
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We love what we do, and it shows in every project we handle.',
    },
    {
      icon: Zap,
      title: 'Speed',
      description: 'Fast turnaround without compromising on quality.',
    },
    {
      icon: Users,
      title: 'Support',
      description: 'Our team is here to help you every step of the way.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We use only the best materials and latest technology.',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Eco-friendly practices are at the heart of our business.',
    },
  ];
  
  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '1M+', label: 'Products Printed' },
    { value: '99.8%', label: 'Satisfaction Rate' },
    { value: '24hr', label: 'Fastest Turnaround' },
  ];
  
  return (
    <div className="min-h-screen bg-[#0B0F17] pt-32 pb-20">
      <div className="rp-container">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="rp-micro-label block mb-4">ABOUT US</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F6F8FF] mb-6">
            Print that moves people
          </h1>
          <p className="text-lg text-[#A6B0C5] max-w-3xl mx-auto">
            RayPrint is a UK-based online printing company dedicated to helping businesses and creators bring their visions to life. From business cards to billboards, we've got you covered.
          </p>
        </motion.div>
        
        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <h2 className="text-3xl font-bold text-[#F6F8FF] mb-4">Our Story</h2>
            <p className="text-[#A6B0C5] mb-4">
              Founded in 2018, RayPrint started with a simple mission: make professional printing accessible to everyone. What began as a small operation in London has grown into one of the UK's most trusted online printing services.
            </p>
            <p className="text-[#A6B0C5] mb-4">
              We believe that great print materials can transform a business. A well-designed business card can open doors. Professional packaging can turn a one-time buyer into a loyal customer. Eye-catching signage can bring foot traffic through your door.
            </p>
            <p className="text-[#A6B0C5]">
              That's why we've invested in state-of-the-art printing technology and assembled a team of passionate experts who care about every detail of your project.
            </p>
          </div>
          <div className="aspect-video rounded-[28px] overflow-hidden">
            <img 
              src="/images/hero_collage.jpg" 
              alt="RayPrint facility"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <div key={index} className="rp-card p-6 text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#3B6CFF] mb-2">{stat.value}</p>
              <p className="text-sm text-[#A6B0C5]">{stat.label}</p>
            </div>
          ))}
        </motion.div>
        
        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-[#F6F8FF] text-center mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div key={index} className="rp-card p-6 hover:border-[rgba(246,248,255,0.20)] transition-colors">
                <value.icon className="w-8 h-8 text-[#3B6CFF] mb-4" />
                <h3 className="text-lg font-semibold text-[#F6F8FF] mb-2">{value.title}</h3>
                <p className="text-sm text-[#A6B0C5]">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
