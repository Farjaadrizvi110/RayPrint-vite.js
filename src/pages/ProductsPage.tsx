import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Filter } from 'lucide-react';
import { categories, products } from '@/data/products';
import { Button } from '@/components/ui/button';

export function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;
  
  return (
    <div className="min-h-screen bg-[#0B0F17] pt-32 pb-20">
      <div className="rp-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="rp-micro-label block mb-4">OUR PRODUCTS</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F6F8FF] leading-tight mb-4">
            Browse All Custom<br />Printed Products
          </h1>
          <p className="text-lg text-[#A6B0C5] max-w-xl">
            From business essentials to promotional items, find the perfect print products for your brand.
          </p>
        </motion.div>
        
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-4 h-4 text-[#A6B0C5]" />
            <span className="text-sm text-[#A6B0C5]">Filter by category</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-[#3B6CFF] text-white'
                  : 'bg-[rgba(246,248,255,0.06)] text-[#A6B0C5] hover:bg-[rgba(246,248,255,0.10)]'
              }`}
            >
              All Products
            </button>
            {categories.slice(0, 11).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-[#3B6CFF] text-white'
                    : 'bg-[rgba(246,248,255,0.06)] text-[#A6B0C5] hover:bg-[rgba(246,248,255,0.10)]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link to={`/product/${product.slug}`}>
                <div className="group rp-card overflow-hidden hover:border-[rgba(246,248,255,0.20)] transition-all duration-300">
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <span className="text-xs text-[#3B6CFF] font-medium uppercase tracking-wider">
                      {product.category.replace(/-/g, ' ')}
                    </span>
                    <h3 className="text-lg font-semibold text-[#F6F8FF] mt-2 mb-2 group-hover:text-[#3B6CFF] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#A6B0C5] line-clamp-2 mb-4">
                      {product.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-[#F6F8FF]">
                        From £{product.priceTiers[0]?.price.toFixed(2)}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-[#3B6CFF] opacity-0 group-hover:opacity-100 transition-opacity">
                        View <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#A6B0C5] mb-4">No products found in this category.</p>
            <Button 
              onClick={() => setSelectedCategory(null)}
              className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white"
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
