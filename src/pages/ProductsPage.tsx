import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '@/data/products';

// Exclude the meta "View All" entry from the grid
const displayCategories = categories.filter((c) => c.slug !== 'all');

export function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] pt-32 pb-20">
      <div className="rp-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="rp-micro-label block mb-4">OUR PRODUCTS</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F6F8FF] leading-tight mb-4">
            What are you <span className="text-[#3B6CFF]">printing</span> today?
          </h1>
          <p className="text-base text-[#A6B0C5] max-w-lg mx-auto">
            Choose from our wide range of premium print products, all with fast
            turnaround and exceptional quality.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
            >
              <Link to={`/products/${category.slug}`}>
                <div className="group relative overflow-hidden rounded-2xl cursor-pointer border border-[rgba(246,248,255,0.06)] hover:border-[rgba(59,108,255,0.4)] transition-all duration-300">
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[rgba(11,15,23,0.45)] to-transparent" />
                  </div>

                  {/* Label at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-[15px] font-semibold text-[#F6F8FF] leading-tight group-hover:text-[#3B6CFF] transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-xs text-[#A6B0C5] mt-0.5">
                      {category.productCount} products
                    </p>
                  </div>

                  {/* Hover glow border */}
                  <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 group-hover:ring-[#3B6CFF]/30 transition-all duration-300 pointer-events-none" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
