import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Package
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AdminProducts() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  if (!isAuthenticated || !isAdmin) {
    return null;
  }
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  const categories = [...new Set(products.map(p => p.category))];
  
  return (
    <div className="min-h-screen bg-[#0B0F17] pt-32 pb-20">
      <div className="rp-container max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <Link to="/admin" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-[#F6F8FF]">Products</h1>
          </div>
          <Button className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </motion.div>
        
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6B0C5]" />
            <Input 
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-12 bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF]"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-[rgba(246,248,255,0.06)] border border-[rgba(246,248,255,0.10)] text-[#F6F8FF]"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.replace(/-/g, ' ')}</option>
            ))}
          </select>
        </motion.div>
        
        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => (
            <div key={product.id} className="rp-card overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <span className="text-xs text-[#3B6CFF] uppercase tracking-wider">
                  {product.category.replace(/-/g, ' ')}
                </span>
                <h3 className="text-lg font-semibold text-[#F6F8FF] mt-1 mb-2">{product.name}</h3>
                <p className="text-sm text-[#A6B0C5] mb-4">
                  From £{product.priceTiers[0]?.price.toFixed(2)}
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-[rgba(246,248,255,0.06)] text-[#A6B0C5] hover:text-[#F6F8FF] hover:bg-[rgba(246,248,255,0.10)] transition-colors">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-[#A6B0C5] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#F6F8FF] mb-2">No products found</h3>
            <p className="text-[#A6B0C5]">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
