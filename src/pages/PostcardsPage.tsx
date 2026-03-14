import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Check, Upload, ShoppingBag, ChevronDown,
  Info, FileText, Package, Truck, Loader2,
} from 'lucide-react';
import { getProductBySlug, getFeaturedProducts } from '@/data/products';
import { useCartStore, useAuthStore, useUIStore } from '@/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Artwork } from '@/types';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

// Recommended defaults per option
const RECOMMENDED: Record<string, string> = {
  Size:          'A6 (105×148mm)',
  Form:          'Portrait',
  Material:      'Silk 300gsm',
  Finishing:     'No finishing',
  Printing:      'Double-sided printing',
  'Material Type': 'Matt',
};

// Finishing add-on prices (+10% markup applied)
const FINISHING_ADDONS: Record<string, number> = {
  'No finishing':                    0,
  'Single-sided Gloss lamination':   3.85,
  'Single-sided UV Glossy':          35.20,
  'Single-sided Matte lamination':   19.25,
  'Single-sided Velvet lamination':  20.90,
};

const getOptionIcon = (name: string) => {
  const l = name.toLowerCase();
  if (l.includes('size'))     return <Package  className="w-4 h-4" />;
  if (l.includes('form'))     return <Package  className="w-4 h-4" />;
  if (l.includes('material')) return <FileText className="w-4 h-4" />;
  if (l.includes('finish'))   return <Info     className="w-4 h-4" />;
  if (l.includes('print'))    return <FileText className="w-4 h-4" />;
  return <Info className="w-4 h-4" />;
};

export function PostcardsPage() {
  const product = getProductBySlug('premium-postcards');
  const { addItem }     = useCartStore();
  const { token }       = useAuthStore();
  const { setCartOpen } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedOptions,    setSelectedOptions]    = useState<Record<string, string>>(RECOMMENDED);
  const [selectedQtyIdx,     setSelectedQtyIdx]     = useState<number>(13); // 500 recommended
  const [uploadedArtwork,    setUploadedArtwork]    = useState<Artwork | null>(null);
  const [expandedOption,     setExpandedOption]     = useState<string | null>(null);
  const [isUploadingArtwork, setIsUploadingArtwork] = useState(false);

  useEffect(() => {
    if (product) setSelectedOptions(RECOMMENDED);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B0F17] pt-32 pb-20">
        <div className="rp-container text-center">
          <h1 className="text-4xl font-bold text-[#F6F8FF] mb-4">Product Not Found</h1>
          <p className="text-[#A6B0C5] mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products"><Button className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white">Browse Products</Button></Link>
        </div>
      </div>
    );
  }

  const handleOptionChange = (name: string, value: string) =>
    setSelectedOptions(prev => ({ ...prev, [name]: value }));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) { toast.error('File size must be less than 100MB'); return; }
    const previewUrl = URL.createObjectURL(file);
    setUploadedArtwork({ id: Math.random().toString(36).substr(2, 9), fileName: file.name, fileUrl: previewUrl, fileType: file.type, fileSize: file.size, uploadedAt: new Date() });
    if (!token) { toast.warning('Sign in before checkout so your design can be saved permanently.'); return; }
    setIsUploadingArtwork(true);
    try {
      const fd = new FormData(); fd.append('artwork', file);
      const res  = await fetch(`${BACKEND_URL}/api/artwork/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (data.success && data.data?.fileUrl) {
        setUploadedArtwork(prev => prev ? { ...prev, fileUrl: data.data.fileUrl } : prev);
        toast.success('Artwork uploaded & saved ✅');
      } else { toast.error(data.message || 'Upload failed — file preview saved locally.'); }
    } catch { toast.error('Could not reach server — file preview saved locally.'); }
    finally { setIsUploadingArtwork(false); }
  };

  const handleAddToCart = () => {
    const priceTier  = product.priceTiers[selectedQtyIdx];
    const finishAdd  = FINISHING_ADDONS[selectedOptions['Finishing']] ?? 0;
    const totalPrice = priceTier.price + finishAdd;
    addItem({
      id: Math.random().toString(36).substr(2, 9),
      product,
      quantity:  priceTier.quantity,
      options:   selectedOptions,
      artwork:   uploadedArtwork || undefined,
      price:     parseFloat((totalPrice / priceTier.quantity).toFixed(4)),
    });
    toast.success(`${priceTier.quantity.toLocaleString()} postcards added to cart!`);
    setCartOpen(true);
  };

  const currentTier    = product.priceTiers[selectedQtyIdx];
  const finishAddon    = FINISHING_ADDONS[selectedOptions['Finishing']] ?? 0;
  const totalPrice     = currentTier ? currentTier.price + finishAddon : 0;
  const relatedProducts = getFeaturedProducts().filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0B0F17] pt-28 pb-20">
      <div className="rp-container">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
          <Link to="/products/postcards-flyers" className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[rgba(59,108,255,0.08)] border border-[rgba(59,108,255,0.25)] text-sm font-medium text-[#A6B0C5] hover:text-[#F6F8FF] hover:bg-[rgba(59,108,255,0.15)] hover:border-[rgba(59,108,255,0.5)] hover:shadow-lg hover:shadow-[#3B6CFF]/20 transition-all duration-300">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />Back to postcards &amp; flyers
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <span className="rp-micro-label block mb-3">POSTCARDS</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F6F8FF] leading-tight mb-4">{product.name}</h1>
          <p className="text-lg text-[#A6B0C5] max-w-3xl">{product.description}</p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid xl:grid-cols-12 gap-8 lg:gap-12">
          {/* Left — image + specs */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="xl:col-span-5">
            <div className="aspect-[4/3] rounded-[24px] overflow-hidden mb-4 bg-[rgba(246,248,255,0.03)]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
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

          {/* Right — configurator */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="xl:col-span-7">

            {/* ── Options Accordion ── */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-[#F6F8FF] mb-4">Configure Your Product</h3>
              {product.options.map((option) => {
                const recommended = RECOMMENDED[option.name];
                return (
                  <div key={option.name} className="rounded-2xl bg-[rgba(246,248,255,0.03)] border border-[rgba(246,248,255,0.08)] overflow-hidden">
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
                    <AnimatePresence>
                      {expandedOption === option.name && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-5 pb-4 pt-2 border-t border-[rgba(246,248,255,0.06)]">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {option.values.map((value) => {
                                const isRec = recommended === value;
                                const addon = option.name === 'Finishing' ? FINISHING_ADDONS[value] : 0;
                                return (
                                  <button key={value} onClick={() => { handleOptionChange(option.name, value); setExpandedOption(null); }}
                                    className={`relative px-3 py-3 rounded-xl text-sm text-left transition-all ${selectedOptions[option.name] === value ? 'bg-[#3B6CFF] text-white' : 'bg-[rgba(246,248,255,0.05)] text-[#A6B0C5] hover:bg-[rgba(246,248,255,0.10)] hover:text-[#F6F8FF]'} ${isRec ? 'pb-7' : ''}`}
                                  >
                                    <span>{value}</span>
                                    {addon > 0 && <span className="block text-xs opacity-75 mt-0.5">+£{addon.toFixed(2)}</span>}
                                    {isRec && <span className="absolute bottom-0 left-0 right-0 bg-[#1a7a3c] text-white text-[8px] font-bold tracking-widest text-center py-[3px] uppercase rounded-b-xl">Recommended</span>}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* ── Quantity & Price Grid ── */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-[#F6F8FF]">Print run:</h3>
                <span className="text-[#3B6CFF] font-semibold">{currentTier?.quantity.toLocaleString()}</span>
                <Info className="w-4 h-4 text-[#A6B0C5]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {product.priceTiers.map((tier, idx) => {
                  const isSelected = selectedQtyIdx === idx;
                  const isRec      = tier.quantity === 500;
                  return (
                    <button key={tier.quantity} onClick={() => setSelectedQtyIdx(idx)}
                      className={`relative flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${isSelected ? 'border-[#3B6CFF] bg-[rgba(59,108,255,0.1)]' : 'border-[rgba(246,248,255,0.10)] bg-[rgba(246,248,255,0.03)] hover:border-[rgba(246,248,255,0.20)]'} ${isRec ? 'mt-1' : ''}`}
                    >
                      {isRec && <span className="absolute -top-4 left-0 bg-[#1a7a3c] text-white text-[8px] font-bold tracking-widest px-2 py-[2px] uppercase rounded-t-md">Recommended</span>}
                      <span className={`font-medium ${isSelected ? 'text-[#F6F8FF]' : 'text-[#A6B0C5]'}`}>{tier.quantity.toLocaleString()}</span>
                      <span className={`font-semibold ${isSelected ? 'text-[#F6F8FF]' : 'text-[#A6B0C5]'}`}>£{tier.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Artwork Upload ── */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#F6F8FF] mb-4">Upload Your Artwork</h3>
              <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.svg,.ai,.eps" onChange={handleFileUpload} className="hidden" />
              {uploadedArtwork ? (
                <div className={`p-4 rounded-xl border flex items-center justify-between ${isUploadingArtwork ? 'bg-[rgba(246,168,0,0.08)] border-[rgba(246,168,0,0.3)]' : 'bg-[rgba(59,108,255,0.1)] border-[rgba(59,108,255,0.3)]'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isUploadingArtwork ? 'bg-[rgba(246,168,0,0.2)]' : 'bg-[#3B6CFF]'}`}>
                      {isUploadingArtwork ? <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" /> : <Check className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F6F8FF]">{uploadedArtwork.fileName}</p>
                      <p className="text-xs text-[#A6B0C5]">{isUploadingArtwork ? 'Uploading to cloud…' : `${(uploadedArtwork.fileSize / 1024 / 1024).toFixed(2)} MB — saved ✅`}</p>
                    </div>
                  </div>
                  {!isUploadingArtwork && <button onClick={() => setUploadedArtwork(null)} className="text-sm text-[#A6B0C5] hover:text-red-400 transition-colors">Remove</button>}
                </div>
              ) : (
                <button onClick={() => fileInputRef.current?.click()} className="w-full p-6 rounded-xl border-2 border-dashed border-[rgba(246,248,255,0.15)] hover:border-[#3B6CFF] transition-colors text-center group">
                  <Upload className="w-8 h-8 text-[#A6B0C5] mx-auto mb-2 group-hover:text-[#3B6CFF] transition-colors" />
                  <p className="text-sm text-[#F6F8FF] mb-1">Click to upload artwork</p>
                  <p className="text-xs text-[#A6B0C5]">PDF, PNG, JPEG, SVG, AI, EPS (max 100MB)</p>
                </button>
              )}
            </div>

            {/* ── Price Summary ── */}
            <div className="p-6 rounded-2xl bg-[rgba(246,248,255,0.03)] border border-[rgba(246,248,255,0.08)]">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-[#A6B0C5] mb-1">Total Price</p>
                  <p className="text-4xl font-bold text-[#F6F8FF]">£{totalPrice.toFixed(2)}</p>
                  {finishAddon > 0 && <p className="text-xs text-[#3B6CFF] mt-1">Includes finishing: +£{finishAddon.toFixed(2)}</p>}
                  <p className="text-sm text-[#A6B0C5] mt-1">{currentTier?.quantity.toLocaleString()} postcards @ £{(totalPrice / (currentTier?.quantity || 1)).toFixed(3)} each</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#A6B0C5]">
                  <Truck className="w-4 h-4" /><span>Free UK shipping over £50</span>
                </div>
              </div>
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
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAddToCart} className="flex-1 bg-[#3B6CFF] hover:bg-[#2a5aee] text-white py-6 text-base">
                  <ShoppingBag className="w-5 h-5 mr-2" />Add to Cart
                </Button>
                <Link to="/request-design" className="sm:w-auto w-full">
                  <Button variant="outline" className="w-full border-[#3B6CFF]/30 bg-blue-50 text-[#3B6CFF] hover:bg-blue-100 hover:border-[#3B6CFF]/60 py-6 px-6 font-semibold transition-all duration-200 shadow-sm">
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
              {relatedProducts.map((rp, index) => (
                <motion.div key={rp.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Link to={`/product/${rp.slug}`}>
                    <div className="group rp-card overflow-hidden hover:border-[rgba(246,248,255,0.20)] transition-all duration-300">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-[#F6F8FF] group-hover:text-[#3B6CFF] transition-colors">{rp.name}</h3>
                        <p className="text-sm text-[#A6B0C5] mt-1">From £{rp.priceTiers[0]?.price.toFixed(2)}</p>
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

