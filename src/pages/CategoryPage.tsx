import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getCategoryBySlug, getProductsByCategory } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Seo } from '@/components/Seo';

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const categoryData = getCategoryBySlug(category || '');
  const products = getProductsByCategory(category || '');
  
  if (!categoryData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20">
        <Seo
          title="Category Not Found | RayPrint"
          description="The category you're looking for doesn't exist."
          canonicalPath="/products"
          noIndex
        />
        <div className="rp-container text-center">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-4">Category Not Found</h1>
          <p className="text-[#64748B] mb-8">The category you're looking for doesn't exist.</p>
          <Link to="/products">
            <Button className="bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff] hover:from-[#2a5aee] hover:to-[#4a75f0] text-white shadow-lg shadow-[#3B6CFF]/25">
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20">
      <Seo
        title={`${categoryData.name} Printing UK | RayPrint`}
        description={`${categoryData.description} Order ${categoryData.name.toLowerCase()} online with fast UK delivery.`}
        canonicalPath={`/products/${categoryData.slug}`}
        ogImage="https://rayprint.co.uk/images/hero_collage.jpg"
        keywords={`${categoryData.name.toLowerCase()} printing UK, buy ${categoryData.name.toLowerCase()} online, RayPrint ${categoryData.name.toLowerCase()}`}
      />
      <div className="rp-container">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link to="/products" className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-sm font-medium text-[#3B6CFF] hover:bg-blue-100 hover:border-[#3B6CFF]/50 hover:shadow-md transition-all duration-300">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to All Products
          </Link>
        </motion.div>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="rp-micro-label block mb-4">CATEGORY</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight mb-4">
                {categoryData.name}
              </h1>
              <p className="text-lg text-[#64748B]">
                {categoryData.description}
              </p>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden">
              <img 
                src={categoryData.image} 
                alt={categoryData.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
        
        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link to={`/product/${product.slug}`}>
                  <div className="group rp-card overflow-hidden hover:border-[rgba(59,108,255,0.30)] hover:shadow-lg hover:shadow-[#3B6CFF]/08 transition-all duration-300">
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
                      <h3 className="text-lg font-semibold text-[#0F172A] mb-2 group-hover:text-[#3B6CFF] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[#64748B] line-clamp-2 mb-4">
                        {product.shortDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-[#0F172A]">
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
        ) : (
          <div className="text-center py-20">
            <p className="text-[#64748B] mb-4">No products available in this category yet.</p>
            <Link to="/products">
              <Button className="bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff] hover:from-[#2a5aee] hover:to-[#4a75f0] text-white shadow-lg shadow-[#3B6CFF]/25">
                Browse Other Categories
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
