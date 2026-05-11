import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Check, Upload, ShoppingBag, ChevronDown,
  Info, FileText, Package, Layers, Truck, Loader2,
} from 'lucide-react';
import { getProductBySlug, getFeaturedProducts } from '@/data/products';
import { useCartStore, useAuthStore, useUIStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Seo } from '@/components/Seo';
import { toast } from 'sonner';
import type { Artwork } from '@/types';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

// Recommended default for each option
const RECOMMENDED: Record<string, string> = {
  Size:             'A5 (148×210mm)',
  'Material Type':  'Glossy',
  'Paper Thickness': 'Standard (170gsm)',
  Printing:         'Double-sided printing',
  Bundling:         'Not bundled',
};

// Recommended qty index (5,000 = index 12)
const RECOMMENDED_QTY_IDX = 12;

const getOptionIcon = (name: string) => {
  const l = name.toLowerCase();
  if (l.includes('size'))      return <Package  className="w-4 h-4" />;
  if (l.includes('material'))  return <FileText className="w-4 h-4" />;
  if (l.includes('paper'))     return <Layers   className="w-4 h-4" />;
  if (l.includes('print'))     return <FileText className="w-4 h-4" />;
  if (l.includes('bundl'))     return <Package  className="w-4 h-4" />;
  return <Info className="w-4 h-4" />;
};

export function ClassicFlyersPage() {
  const product = getProductBySlug('classic-flyers');
  const { addItem }     = useCartStore();
  const { token }       = useAuthStore();
  const { setCartOpen } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedOptions,    setSelectedOptions]    = useState<Record<string, string>>(RECOMMENDED);
  const [selectedQtyIdx,     setSelectedQtyIdx]     = useState<number>(RECOMMENDED_QTY_IDX);
  const [uploadedArtwork,    setUploadedArtwork]    = useState<Artwork | null>(null);
  const [expandedOption,     setExpandedOption]     = useState<string | null>(null);
  const [isUploadingArtwork, setIsUploadingArtwork] = useState(false);

  useEffect(() => {
    if (product) setSelectedOptions(RECOMMENDED);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20">
        <Seo
          title="Product Not Found | RayPrint"
          description="The product you're looking for doesn't exist."
          canonicalPath="/products"
          noIndex
        />
        <div className="rp-container text-center">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-4">Product Not Found</h1>
          <p className="text-[#64748B] mb-8">The product you're looking for doesn't exist.</p>
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
    setUploadedArtwork({
      id: Math.random().toString(36).substr(2, 9),
      fileName: file.name, fileUrl: previewUrl,
      fileType: file.type, fileSize: file.size, uploadedAt: new Date(),
    });
    if (!token) { toast.warning('Sign in before checkout so your design can be saved permanently.'); return; }
    setIsUploadingArtwork(true);
    try {
      const fd = new FormData(); fd.append('artwork', file);
      const res  = await fetch(`${BACKEND_URL}/api/artwork/upload`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
      });
      const data = await res.json();
      if (data.success && data.data?.fileUrl) {
        setUploadedArtwork(prev => prev ? { ...prev, fileUrl: data.data.fileUrl } : prev);
        toast.success('Artwork uploaded & saved ✅');
      } else { toast.error(data.message || 'Upload failed — file preview saved locally.'); }
    } catch { toast.error('Could not reach server — file preview saved locally.'); }
    finally  { setIsUploadingArtwork(false); }
  };

  const handleAddToCart = () => {
    const priceTier = product.priceTiers[selectedQtyIdx];
    addItem({
      id: Math.random().toString(36).substr(2, 9),
      product, quantity: priceTier.quantity,
      options: selectedOptions,
      artwork: uploadedArtwork || undefined,
      price:   priceTier.unitPrice,
    });
    toast.success(`${priceTier.quantity.toLocaleString()} flyers added to cart!`);
    setCartOpen(true);
  };

  const currentTier     = product.priceTiers[selectedQtyIdx];
  const totalPrice      = currentTier?.price ?? 0;
  const relatedProducts = getFeaturedProducts().filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <Seo
        title={`${product.name} | RayPrint`}
        description={product.shortDescription || product.description}
        canonicalPath={`/product/${product.slug}`}
        ogImage={`https://rayprint.co.uk${product.image}`}
      />
      <div className="rp-container">

        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
          <Link to="/products/flyers-leaflets" className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-sm font-medium text-[#3B6CFF] hover:text-[#2a5aee] hover:bg-blue-100 hover:border-blue-300 hover:shadow-lg hover:shadow-[#3B6CFF]/10 transition-all duration-300">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />Back to flyers &amp; leaflets
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <span className="rp-micro-label block mb-3">FLYERS &amp; LEAFLETS</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight mb-4">{product.name}</h1>
          <p className="text-lg text-[#64748B] max-w-3xl">{product.description}</p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid xl:grid-cols-12 gap-8 lg:gap-12">

          {/* ── Left: image + specs ── */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="xl:col-span-5">
            <div className="aspect-[4/3] rounded-[24px] overflow-hidden mb-4 bg-[#F8FAFC]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="mt-8 p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-4 uppercase tracking-wider">Product Details</h3>
              <div className="space-y-3">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-[#3B6CFF] flex-shrink-0" />
                    <span className="text-[#64748B]">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right: configurator ── */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="xl:col-span-7">

            {/* Options Accordion */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Configure Your Flyers</h3>

              {product.options.map((option) => {
                const recommended = RECOMMENDED[option.name];
                return (
                  <div key={option.name} className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden">
                    {/* Accordion header */}
                    <button
                      onClick={() => setExpandedOption(expandedOption === option.name ? null : option.name)}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[rgba(59,108,255,0.12)] flex items-center justify-center text-[#3B6CFF]">
                          {getOptionIcon(option.name)}
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-[#64748B]">{option.name}</p>
                          <p className="text-[#0F172A] font-medium">{selectedOptions[option.name] || 'Select option'}</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-[#94A3B8] transition-transform ${expandedOption === option.name ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Accordion body */}
                    <AnimatePresence>
                      {expandedOption === option.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden"
                        >
                          <div className="px-5 pb-4 pt-2 border-t border-[#E2E8F0]">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {option.values.map((value) => {
                                const isRec      = recommended === value;
                                const isSelected = selectedOptions[option.name] === value;
                                return (
                                  <button
                                    key={value}
                                    onClick={() => { handleOptionChange(option.name, value); setExpandedOption(null); }}
                                    className={`relative px-3 py-3 rounded-xl text-sm text-left transition-all ${
                                      isSelected
                                        ? 'bg-[#3B6CFF] text-white'
                                        : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                                    } ${isRec ? 'pb-7' : ''}`}
                                  >
                                    <span>{value}</span>
                                    {isRec && (
                                      <span className="absolute bottom-0 left-0 right-0 bg-[#1a7a3c] text-white text-[8px] font-bold tracking-widest text-center py-[3px] uppercase rounded-b-xl">
                                        Recommended
                                      </span>
                                    )}
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

            {/* Quantity & Price Grid */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-[#0F172A]">Print run:</h3>
                <span className="text-[#3B6CFF] font-semibold">{currentTier?.quantity.toLocaleString()}</span>
                <Info className="w-4 h-4 text-[#94A3B8]" />
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-[500px] overflow-y-auto pr-1">
                {product.priceTiers.map((tier, idx) => {
                  const isSelected = selectedQtyIdx === idx;
                  const isRec      = tier.quantity === 5000;
                  return (
                    <button
                      key={tier.quantity}
                      onClick={() => setSelectedQtyIdx(idx)}
                      className={`relative flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all ${
                        isSelected
                          ? 'border-[#3B6CFF] bg-blue-50'
                          : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]'
                      } ${isRec ? 'mt-5' : ''}`}
                    >
                      {isRec && (
                        <span className="absolute -top-5 left-0 bg-[#1a7a3c] text-white text-[8px] font-bold tracking-widest px-2 py-[2px] uppercase rounded-t-md">
                          Recommended
                        </span>
                      )}
                      <span className={`font-medium ${isSelected ? 'text-[#3B6CFF]' : 'text-[#475569]'}`}>
                        {tier.quantity.toLocaleString()}
                      </span>
                      <span className={`font-semibold ${isSelected ? 'text-[#0F172A]' : 'text-[#475569]'}`}>
                        £{tier.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Artwork Upload */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Upload Your Artwork</h3>
              <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.svg,.ai,.eps" onChange={handleFileUpload} className="hidden" />
              {uploadedArtwork ? (
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  isUploadingArtwork ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isUploadingArtwork ? 'bg-amber-100' : 'bg-[#3B6CFF]'}`}>
                      {isUploadingArtwork ? <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" /> : <Check className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">{uploadedArtwork.fileName}</p>
                      <p className="text-xs text-[#64748B]">{isUploadingArtwork ? 'Uploading to cloud…' : `${(uploadedArtwork.fileSize / 1024 / 1024).toFixed(2)} MB — saved ✅`}</p>
                    </div>
                  </div>
                  {!isUploadingArtwork && (
                    <button onClick={() => setUploadedArtwork(null)} className="text-sm text-[#64748B] hover:text-red-500 transition-colors">Remove</button>
                  )}
                </div>
              ) : (
                <button onClick={() => fileInputRef.current?.click()} className="w-full p-6 rounded-xl border-2 border-dashed border-[#CBD5E1] hover:border-[#3B6CFF] transition-colors text-center group">
                  <Upload className="w-8 h-8 text-[#94A3B8] mx-auto mb-2 group-hover:text-[#3B6CFF] transition-colors" />
                  <p className="text-sm text-[#0F172A] mb-1">Click to upload artwork</p>
                  <p className="text-xs text-[#64748B]">PDF, PNG, JPEG, SVG, AI, EPS (max 100MB)</p>
                </button>
              )}
            </div>

            {/* Price Summary */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-[#64748B] mb-1">Total Price</p>
                  <p className="text-4xl font-bold text-[#0F172A]">£{totalPrice.toFixed(2)}</p>
                  <p className="text-sm text-[#64748B] mt-1">
                    {currentTier?.quantity.toLocaleString()} flyers @ £{currentTier?.unitPrice.toFixed(3)} each
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Truck className="w-4 h-4" /><span>Free UK shipping over £50</span>
                </div>
              </div>
              <div className="mb-6 p-4 rounded-xl bg-[#F1F5F9]">
                <p className="text-xs text-[#64748B] uppercase tracking-wider mb-3">Your Configuration</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedOptions).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <span className="text-[#64748B]">{key}:</span>
                      <span className="text-[#0F172A] font-medium">{value}</span>
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
          <div className="border-t border-[#E2E8F0] mt-20 pt-16">
            <h2 className="text-2xl font-semibold text-[#0F172A] mb-8">You might also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rp, index) => (
                <motion.div key={rp.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Link to={`/product/${rp.slug}`}>
                    <div className="group rp-card overflow-hidden hover:border-blue-200 transition-all duration-300">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-[#0F172A] group-hover:text-[#3B6CFF] transition-colors">{rp.name}</h3>
                        <p className="text-sm text-[#64748B] mt-1">From £{rp.priceTiers[0]?.price.toFixed(2)}</p>
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
