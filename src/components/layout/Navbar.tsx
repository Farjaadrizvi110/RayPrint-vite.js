import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore, useAuthStore, useUIStore } from '@/store';
import { categories } from '@/data/products';
import { Button } from '@/components/ui/button';

// Build a flat list of searchable items from categories
const searchItems = categories
  .filter(cat => cat.slug !== 'all')
  .map(cat => ({ name: cat.name, slug: cat.slug, image: cat.image, type: 'category' as const }));

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof searchItems>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toggleCart } = useUIStore();
  const { items } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Filter search results as user types
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length === 0) {
      setSearchResults([]);
      return;
    }
    const filtered = searchItems.filter(item => item.name.toLowerCase().includes(q));
    setSearchResults(filtered);
  }, [searchQuery]);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = (slug: string) => {
    setIsSearchOpen(false);
    navigate(`/products/${slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSearchSelect(searchResults[0].slug);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  
  // Show all categories except "View All" in the dropdown
  const mainCategories = categories.filter(cat => cat.slug !== 'all');
  
  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Design Services', href: '/request-design' },
    { name: 'About', href: '/about' },
    { name: 'Support', href: '/contact' },
  ];
  
  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#0B0F17]/90 backdrop-blur-xl border-b border-[rgba(246,248,255,0.08)]' 
            : 'bg-transparent'
        }`}
      >
        <div className="rp-container">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              {/* Icon with pulse glow + shimmer */}
              <div className="relative flex-shrink-0">
                <motion.div
                  className="absolute inset-0 rounded-xl bg-[#3B6CFF] blur-md"
                  animate={{ opacity: [0.3, 0.65, 0.3], scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#3B6CFF] via-[#4f79ff] to-[#7B5AFF] flex items-center justify-center border border-white/15 overflow-hidden shadow-lg shadow-[#3B6CFF]/40"
                  whileHover={{ scale: 1.12, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 16 }}
                >
                  {/* Shimmer sweep */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                    animate={{ x: ['-130%', '230%'] }}
                    transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.8, ease: 'easeInOut' }}
                  />
                  <span className="relative z-10 text-xl font-black text-white tracking-tight">R</span>
                </motion.div>
              </div>

              {/* Text */}
              <motion.div
                className="flex flex-col leading-none"
                whileHover={{ x: 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <div className="flex items-baseline gap-0">
                  <span className="text-[1.55rem] font-black tracking-[-0.03em] text-[#F6F8FF]">Ray</span>
                  <span className="text-[1.55rem] font-black tracking-[-0.03em] bg-gradient-to-r from-[#3B6CFF] via-[#6e8fff] to-[#a78bfa] bg-clip-text text-transparent group-hover:from-[#5a85ff] group-hover:to-[#c4b5fd] transition-all duration-500">Print</span>
                </div>
                <span className="text-[0.48rem] font-bold tracking-[0.28em] text-[#3B6CFF]/70 uppercase mt-[-1px] group-hover:text-[#3B6CFF] transition-colors duration-300">Premium Print · UK</span>
              </motion.div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <div 
                className="relative"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                <motion.button 
                  className="flex items-center gap-1.5 text-sm font-medium text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors"
                  whileHover={{ y: -2 }}
                >
                  Products
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} />
                </motion.button>
                
                <AnimatePresence>
                  {isProductsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-full left-0 pt-4"
                    >
                      <div className="w-[800px] bg-[#0B0F17]/95 backdrop-blur-2xl border border-[rgba(246,248,255,0.10)] rounded-3xl p-6 shadow-2xl shadow-[#3B6CFF]/10">
                        <div className="grid grid-cols-3 gap-3">
                          {mainCategories.map((category, index) => (
                            <motion.div
                              key={category.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                to={`/products/${category.slug}`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[rgba(246,248,255,0.06)] transition-all duration-300 group"
                                onClick={() => setIsProductsOpen(false)}
                              >
                                <motion.div 
                                  className="w-12 h-12 rounded-xl overflow-hidden"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <img 
                                    src={category.image} 
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                </motion.div>
                                <div>
                                  <p className="text-sm font-medium text-[#F6F8FF] group-hover:text-[#3B6CFF] transition-colors">{category.name}</p>
                                  <p className="text-xs text-[#A6B0C5]">{category.productCount} products</p>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-[rgba(246,248,255,0.08)]">
                          <Link 
                            to="/products"
                            className="flex items-center gap-2 text-sm text-[#3B6CFF] hover:text-[#5a85ff] transition-colors group"
                            onClick={() => setIsProductsOpen(false)}
                          >
                            View all products
                            <motion.span
                              className="inline-block"
                              initial={{ x: 0 }}
                              whileHover={{ x: 5 }}
                            >
                              →
                            </motion.span>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {[
                { name: 'Design Services', href: '/request-design' },
                { name: 'About', href: '/about' },
                { name: 'Support', href: '/contact' },
              ].map((link) => (
                <motion.div key={link.name} whileHover={{ y: -2 }}>
                  <Link to={link.href} className="text-sm font-medium text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors relative group">
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3B6CFF] group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div ref={searchContainerRef} className="relative hidden lg:block">
                <AnimatePresence mode="wait">
                  {isSearchOpen ? (
                    <motion.form
                      key="search-open"
                      initial={{ width: 40, opacity: 0 }}
                      animate={{ width: 260, opacity: 1 }}
                      exit={{ width: 40, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      onSubmit={handleSearchSubmit}
                      className="flex items-center bg-[rgba(246,248,255,0.08)] border border-[rgba(246,248,255,0.12)] rounded-xl overflow-hidden"
                    >
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="flex-1 bg-transparent px-3 py-2 text-sm text-[#F6F8FF] placeholder-[#A6B0C5] outline-none"
                      />
                      <button type="submit" className="p-2.5 text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">
                        <Search className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => setIsSearchOpen(false)} className="p-2 text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </motion.form>
                  ) : (
                    <motion.button
                      key="search-closed"
                      className="p-2.5 text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors rounded-xl hover:bg-[rgba(246,248,255,0.06)]"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsSearchOpen(true)}
                    >
                      <Search className="w-5 h-5" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Recommendations Dropdown */}
                <AnimatePresence>
                  {isSearchOpen && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-72 bg-[#0B0F17]/95 backdrop-blur-2xl border border-[rgba(246,248,255,0.10)] rounded-2xl shadow-2xl shadow-[#3B6CFF]/10 overflow-hidden z-50"
                    >
                      <p className="px-4 pt-3 pb-1 text-xs font-medium text-[#A6B0C5] uppercase tracking-wider">Suggestions</p>
                      {searchResults.map((item, index) => (
                        <motion.button
                          key={item.slug}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04 }}
                          onClick={() => handleSearchSelect(item.slug)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[rgba(246,248,255,0.06)] transition-colors text-left"
                        >
                          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-sm text-[#F6F8FF]">{item.name}</span>
                        </motion.button>
                      ))}
                      {searchQuery.trim() && searchResults.length === 0 && (
                        <p className="px-4 py-3 text-sm text-[#A6B0C5]">No results for "{searchQuery}"</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile search icon */}
              <motion.button
                className="lg:hidden p-2.5 text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors rounded-xl hover:bg-[rgba(246,248,255,0.06)]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Search className="w-5 h-5" />
              </motion.button>
              
              <motion.button 
                onClick={toggleCart}
                className="relative p-2.5 text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors rounded-xl hover:bg-[rgba(246,248,255,0.06)]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff] text-white text-xs font-medium rounded-full flex items-center justify-center"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              
              {isAuthenticated ? (
                <div className="relative group hidden lg:block">
                  <motion.button 
                    className="flex items-center gap-2 p-2 text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B6CFF] to-[#5a85ff] flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                  </motion.button>
                  
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="w-52 bg-[#0B0F17]/95 backdrop-blur-2xl border border-[rgba(246,248,255,0.10)] rounded-2xl p-3 shadow-2xl shadow-[#3B6CFF]/10">
                      <div className="px-3 py-3 border-b border-[rgba(246,248,255,0.08)]">
                        <p className="text-sm font-medium text-[#F6F8FF]">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-[#A6B0C5]">{user?.email}</p>
                      </div>
                      <Link to="/account" className="block px-3 py-2.5 mt-2 text-sm text-[#A6B0C5] hover:text-[#F6F8FF] hover:bg-[rgba(246,248,255,0.06)] rounded-xl transition-all">
                        My Account
                      </Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="block px-3 py-2.5 text-sm text-[#3B6CFF] hover:bg-[rgba(59,108,255,0.1)] rounded-xl transition-all">
                          Admin Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={logout}
                        className="w-full text-left px-3 py-2.5 mt-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="hidden lg:block">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[#A6B0C5] hover:text-[#F6F8FF] hover:bg-[rgba(246,248,255,0.06)]"
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </Link>
              )}
              
              {/* Mobile menu button */}
              <motion.button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors rounded-xl hover:bg-[rgba(246,248,255,0.06)]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>
          </nav>
        </div>
      </motion.header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#0B0F17] border-l border-[rgba(246,248,255,0.08)] z-50 lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[rgba(246,248,255,0.08)]">
                <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-lg bg-[#3B6CFF] blur-sm opacity-50" />
                    <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-[#3B6CFF] via-[#4f79ff] to-[#7B5AFF] flex items-center justify-center border border-white/15 overflow-hidden shadow-md shadow-[#3B6CFF]/30">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 translate-x-[-130%]" />
                      <span className="relative z-10 text-base font-black text-white">R</span>
                    </div>
                  </div>
                  <div className="flex flex-col leading-none">
                    <div className="flex items-baseline">
                      <span className="text-xl font-black tracking-[-0.03em] text-[#F6F8FF]">Ray</span>
                      <span className="text-xl font-black tracking-[-0.03em] bg-gradient-to-r from-[#3B6CFF] via-[#6e8fff] to-[#a78bfa] bg-clip-text text-transparent">Print</span>
                    </div>
                    <span className="text-[0.45rem] font-bold tracking-[0.25em] text-[#3B6CFF]/70 uppercase">Premium Print · UK</span>
                  </div>
                </Link>
                <motion.button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors rounded-xl hover:bg-[rgba(246,248,255,0.06)]"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              
              {/* Mobile Search */}
              <div className="px-6 pt-4 pb-2">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (searchResults.length > 0) {
                      setIsMobileMenuOpen(false);
                      navigate(`/products/${searchResults[0].slug}`);
                    }
                  }}
                  className="flex items-center bg-[rgba(246,248,255,0.08)] border border-[rgba(246,248,255,0.12)] rounded-xl overflow-hidden"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-[#F6F8FF] placeholder-[#A6B0C5] outline-none"
                  />
                  <button type="submit" className="p-2.5 text-[#A6B0C5]">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
                {searchQuery.trim() && searchResults.length > 0 && (
                  <div className="mt-2 rounded-xl border border-[rgba(246,248,255,0.10)] overflow-hidden">
                    {searchResults.map(item => (
                      <button
                        key={item.slug}
                        onClick={() => { setIsMobileMenuOpen(false); navigate(`/products/${item.slug}`); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[rgba(246,248,255,0.06)] transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm text-[#F6F8FF]">{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery.trim() && searchResults.length === 0 && (
                  <p className="mt-2 px-1 text-sm text-[#A6B0C5]">No results for "{searchQuery}"</p>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto p-6">
                <nav className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-4 px-4 text-lg font-medium text-[#F6F8FF] hover:bg-[rgba(246,248,255,0.06)] rounded-xl transition-all"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                
                {/* Categories Section */}
                <motion.div 
                  className="mt-8 pt-8 border-t border-[rgba(246,248,255,0.08)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-sm font-medium text-[#A6B0C5] mb-4 px-4">All Categories</p>
                  <div className="space-y-1">
                    {categories.filter(cat => cat.slug !== 'all').map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      >
                        <Link
                          to={`/products/${category.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 py-3 px-4 text-[#A6B0C5] hover:text-[#F6F8FF] hover:bg-[rgba(246,248,255,0.06)] rounded-xl transition-all"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <img 
                              src={category.image} 
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm">{category.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-[rgba(246,248,255,0.08)]">
                {isAuthenticated ? (
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center gap-3 px-4 py-4 bg-[rgba(246,248,255,0.06)] rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B6CFF] to-[#5a85ff] flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#F6F8FF]">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-[#A6B0C5]">{user?.email}</p>
                      </div>
                    </div>
                    <Link 
                      to="/account" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-3.5 px-4 text-center text-[#F6F8FF] bg-[rgba(246,248,255,0.06)] hover:bg-[rgba(246,248,255,0.10)] rounded-xl transition-all font-medium"
                    >
                      My Account
                    </Link>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full py-3.5 px-4 text-center text-[#3B6CFF] bg-[rgba(59,108,255,0.1)] hover:bg-[rgba(59,108,255,0.2)] rounded-xl transition-all font-medium"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3.5 px-4 text-center text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all font-medium"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-3.5 px-4 text-center text-white bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff] hover:from-[#2a5aee] hover:to-[#4a75f0] rounded-xl transition-all font-medium shadow-lg shadow-[#3B6CFF]/25"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-3.5 px-4 text-center text-[#A6B0C5] border border-[rgba(246,248,255,0.20)] hover:bg-[rgba(246,248,255,0.06)] hover:text-[#F6F8FF] rounded-xl transition-all font-medium"
                    >
                      Create Account
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
