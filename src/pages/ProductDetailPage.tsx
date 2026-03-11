import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Upload, ShoppingBag, ChevronDown, Info, FileText, Package, Truck, Loader2 } from 'lucide-react';
import { getProductBySlug, getFeaturedProducts } from '@/data/products';
import { useCartStore, useAuthStore, useUIStore } from '@/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Artwork } from '@/types';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || '');
  const { addItem }     = useCartStore();
  const { token }       = useAuthStore();
  const { setCartOpen } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);
  const [uploadedArtwork, setUploadedArtwork] = useState<Artwork | null>(null);
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const [isUploadingArtwork, setIsUploadingArtwork] = useState(false);
  
  // Initialize default options
  useEffect(() => {
    if (product) {
      const defaults: Record<string, string> = {};
      product.options.forEach(opt => {
        defaults[opt.name] = opt.values[0];
      });
      setSelectedOptions(defaults);
    }
  }, [product]);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B0F17] pt-32 pb-20">
        <div className="rp-container text-center">
          <h1 className="text-4xl font-bold text-[#F6F8FF] mb-4">Product Not Found</h1>
          <p className="text-[#A6B0C5] mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products">
            <Button className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };
  
  const handleQuantitySelect = (index: number) => {
    setSelectedQuantity(index);
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size must be less than 100MB');
      return;
    }

    // Preview immediately using blob URL (local only, for display)
    const previewUrl = URL.createObjectURL(file);
    setUploadedArtwork({
      id: Math.random().toString(36).substr(2, 9),
      fileName: file.name,
      fileUrl: previewUrl,
      fileType: file.type,
      fileSize: file.size,
      uploadedAt: new Date(),
    });

    if (!token) {
      toast.warning('Sign in before checkout so your design can be saved permanently.');
      return;
    }

    // Upload to Cloudinary via backend to get a permanent URL
    setIsUploadingArtwork(true);
    try {
      const formData = new FormData();
      formData.append('artwork', file);
      const res = await fetch(`${BACKEND_URL}/api/artwork/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.fileUrl) {
        setUploadedArtwork(prev => prev ? { ...prev, fileUrl: data.data.fileUrl } : prev);
        toast.success('Artwork uploaded & saved ✅');
      } else {
        toast.error(data.message || 'Upload failed — file preview saved locally.');
      }
    } catch {
      toast.error('Could not reach server — file preview saved locally.');
    } finally {
      setIsUploadingArtwork(false);
    }
  };
  
  const handleAddToCart = () => {
    const missingOptions = product.options.filter(opt => !selectedOptions[opt.name]);
    if (missingOptions.length > 0) {
      toast.error(`Please select: ${missingOptions.map(o => o.name).join(', ')}`);
      return;
    }
    
    const priceTier = product.priceTiers[selectedQuantity];
    
    addItem({
      id: Math.random().toString(36).substr(2, 9),
      product,
      quantity: priceTier.quantity,
      options: selectedOptions,
      artwork: uploadedArtwork || undefined,
      price: priceTier.unitPrice,
    });
    
    toast.success('Added to cart!');
    setCartOpen(true);
  };
  
  const currentPriceTier = product.priceTiers[selectedQuantity];
  const totalPrice = currentPriceTier ? currentPriceTier.price : 0;
  
  const relatedProducts = getFeaturedProducts().filter(p => p.id !== product.id).slice(0, 3);
  
  // Group options for better display
  const getOptionIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('size')) return <Package className="w-4 h-4" />;
    if (lower.includes('material') || lower.includes('paper')) return <FileText className="w-4 h-4" />;
    if (lower.includes('finish') || lower.includes('appearance')) return <Info className="w-4 h-4" />;
    if (lower.includes('print')) return <FileText className="w-4 h-4" />;
    if (lower.includes('fold')) return <Package className="w-4 h-4" />;
    return <Info className="w-4 h-4" />;
  };
  
  return (
    <div className="min-h-screen bg-[#0B0F17] pt-28 pb-20">
      <div className="rp-container">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Link to={`/products/${product.category}`} className="inline-flex items-center gap-2 text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to {product.category.replace(/-/g, ' ')}
          </Link>
        </motion.div>
        
        {/* Product Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="rp-micro-label block mb-3">{product.category.replace(/-/g, ' ').toUpperCase()}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F6F8FF] leading-tight mb-4">
            {product.name}
          </h1>
          <p className="text-lg text-[#A6B0C5] max-w-3xl">
            {product.description}
          </p>
        </motion.div>
        
        {/* Main Content Grid */}
        <div className="grid xl:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Image & Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="xl:col-span-5"
          >
            <div className="aspect-[4/3] rounded-[24px] overflow-hidden mb-4 bg-[rgba(246,248,255,0.03)]">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.gallery && product.gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.gallery.slice(1).map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden">
                    <img src={img} alt={`${product.name} ${i + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            
            {/* Product Specs */}
            <div className="mt-8 p-6 rounded-2xl bg-[rgba(246,248,255,0.03)] border border-[rgba(246,248,255,0.08)]">
              <h3 className="text-sm font-semibold text-[#F6F8FF] mb-4 uppercase tracking-wider">Product Details</h3>
              <div className="space-y-3">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-[#3B6CFF] flex-shrink-0" />
                    <span className="text-[#A6B0C5]">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Options & Pricing */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="xl:col-span-7"
          >
            {/* Options Selector */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-[#F6F8FF] mb-4">Configure Your Product</h3>
              
              {product.options.map((option) => (
                <div 
                  key={option.name} 
                  className="rounded-2xl bg-[rgba(246,248,255,0.03)] border border-[rgba(246,248,255,0.08)] overflow-hidden"
                >
                  {/* Option Header */}
                  <button
                    onClick={() => setExpandedOption(expandedOption === option.name ? null : option.name)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-[rgba(246,248,255,0.02)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(59,108,255,0.15)] flex items-center justify-center text-[#3B6CFF]">
                        {getOptionIcon(option.name)}
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-[#A6B0C5]">{option.name}</p>
                        <p className="text-[#F6F8FF] font-medium">{selectedOptions[option.name] || 'Select option'}</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-[#A6B0C5] transition-transform ${expandedOption === option.name ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Option Values */}
                  <AnimatePresence>
                    {expandedOption === option.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pt-2 border-t border-[rgba(246,248,255,0.06)]">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {option.values.map((value) => (
                              <button
                                key={value}
                                onClick={() => {
                                  handleOptionChange(option.name, value);
                                  setExpandedOption(null);
                                }}
                                className={`px-3 py-3 rounded-xl text-sm text-left transition-all ${
                                  selectedOptions[option.name] === value
                                    ? 'bg-[#3B6CFF] text-white'
                                    : 'bg-[rgba(246,248,255,0.05)] text-[#A6B0C5] hover:bg-[rgba(246,248,255,0.10)] hover:text-[#F6F8FF]'
                                }`}
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#F6F8FF] mb-4">Select Quantity</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {product.priceTiers.map((tier, index) => (
                  <button
                    key={tier.quantity}
                    onClick={() => handleQuantitySelect(index)}
                    className={`p-3 rounded-xl text-center transition-all border ${
                      selectedQuantity === index
                        ? 'bg-[#3B6CFF] text-white border-[#3B6CFF]'
                        : 'bg-[rgba(246,248,255,0.03)] text-[#A6B0C5] border-[rgba(246,248,255,0.08)] hover:border-[rgba(246,248,255,0.15)]'
                    }`}
                  >
                    <p className="text-sm font-semibold">{tier.quantity.toLocaleString()}</p>
                    <p className="text-xs opacity-80">£{tier.unitPrice.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Artwork Upload */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#F6F8FF] mb-4">Upload Your Artwork</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.svg,.ai,.eps"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {uploadedArtwork ? (
                <div className={`p-4 rounded-xl border flex items-center justify-between ${isUploadingArtwork ? 'bg-[rgba(246,168,0,0.08)] border-[rgba(246,168,0,0.3)]' : 'bg-[rgba(59,108,255,0.1)] border-[rgba(59,108,255,0.3)]'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isUploadingArtwork ? 'bg-[rgba(246,168,0,0.2)]' : 'bg-[#3B6CFF]'}`}>
                      {isUploadingArtwork
                        ? <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
                        : <Check className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F6F8FF]">{uploadedArtwork.fileName}</p>
                      <p className="text-xs text-[#A6B0C5]">
                        {isUploadingArtwork ? 'Uploading to cloud…' : `${(uploadedArtwork.fileSize / 1024 / 1024).toFixed(2)} MB — saved ✅`}
                      </p>
                    </div>
                  </div>
                  {!isUploadingArtwork && (
                    <button
                      onClick={() => setUploadedArtwork(null)}
                      className="text-sm text-[#A6B0C5] hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-6 rounded-xl border-2 border-dashed border-[rgba(246,248,255,0.15)] hover:border-[#3B6CFF] transition-colors text-center group"
                >
                  <Upload className="w-8 h-8 text-[#A6B0C5] mx-auto mb-2 group-hover:text-[#3B6CFF] transition-colors" />
                  <p className="text-sm text-[#F6F8FF] mb-1">Click to upload artwork</p>
                  <p className="text-xs text-[#A6B0C5]">PDF, PNG, JPEG, SVG, AI, EPS (max 100MB)</p>
                </button>
              )}
            </div>
            
            {/* Price Summary & Add to Cart */}
            <div className="p-6 rounded-2xl bg-[rgba(246,248,255,0.03)] border border-[rgba(246,248,255,0.08)]">
              {/* Price Display */}
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-[#A6B0C5] mb-1">Total Price</p>
                  <p className="text-4xl font-bold text-[#F6F8FF]">
                    £{totalPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-[#A6B0C5] mt-1">
                    {currentPriceTier?.quantity.toLocaleString()} units @ £{currentPriceTier?.unitPrice.toFixed(2)} each
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-[#A6B0C5]">
                    <Truck className="w-4 h-4" />
                    <span>Free UK shipping over £50</span>
                  </div>
                </div>
              </div>
              
              {/* Configuration Summary */}
              <div className="mb-6 p-4 rounded-xl bg-[rgba(246,248,255,0.03)]">
                <p className="text-xs text-[#A6B0C5] uppercase tracking-wider mb-3">Your Configuration</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedOptions).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <span className="text-[#A6B0C5]">{key}:</span>
                      <span className="text-[#F6F8FF]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#3B6CFF] hover:bg-[#2a5aee] text-white py-6 text-base"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Link to="/request-design" className="sm:w-auto w-full">
                  <Button variant="outline" className="w-full border-[rgba(246,248,255,0.20)] text-[#F6F8FF] py-6 px-6 hover:bg-[rgba(246,248,255,0.05)]">
                    Need Design Help?
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[rgba(246,248,255,0.08)] mt-20 pt-16">
            <h2 className="text-2xl font-semibold text-[#F6F8FF] mb-8">You might also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/product/${product.slug}`}>
                    <div className="group rp-card overflow-hidden hover:border-[rgba(246,248,255,0.20)] transition-all duration-300">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-[#F6F8FF] group-hover:text-[#3B6CFF] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-[#A6B0C5] mt-1">
                          From £{product.priceTiers[0]?.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
