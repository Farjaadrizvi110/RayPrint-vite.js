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
    <div className="min-h-screen pt-32 pb-20 relative" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #EEF2FF 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3B6CFF 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.04 }} />
      <div className="rp-container max-w-7xl relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/admin" className="text-sm text-[#64748B] hover:text-[#3B6CFF] mb-2 inline-block transition-colors">← Back to Dashboard</Link>
            <h1 className="text-4xl font-bold text-[#0F172A]">Products</h1>
          </div>
          <Button className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
            <Input placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 bg-white border-slate-200 text-[#0F172A] placeholder-slate-400 focus:border-[#3B6CFF]" />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-[#0F172A] focus:outline-none focus:border-[#3B6CFF]">
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat.replace(/-/g, ' ')}</option>)}
          </select>
        </motion.div>

        {/* Products Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-[#3B6CFF] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">
                  {product.category.replace(/-/g, ' ')}
                </span>
                <h3 className="text-base font-semibold text-[#0F172A] mt-2 mb-1">{product.name}</h3>
                <p className="text-sm text-[#64748B] mb-4">From £{product.priceTiers[0]?.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-[#64748B] hover:text-[#3B6CFF] hover:border-blue-200 hover:bg-blue-50 transition-colors text-sm font-medium">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button className="p-2 rounded-xl bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
            <Package className="w-12 h-12 text-[#94a3b8] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No products found</h3>
            <p className="text-[#64748B]">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
