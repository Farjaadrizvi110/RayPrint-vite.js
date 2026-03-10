import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Upload, ShoppingBag, Loader2, Info, Truck } from 'lucide-react';
import { getProductBySlug } from '@/data/products';
import { useCartStore, useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Artwork } from '@/types';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

// ── SVG card shape icons ─────────────────────────────────────────────────────
const SizeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Standard 85×55mm':
      return (
        <svg viewBox="0 0 56 40" className="w-10 h-8" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="6" width="48" height="28" rx="1" />
        </svg>
      );
    case 'Portrait 55×85mm':
      return (
        <svg viewBox="0 0 40 56" className="w-7 h-10" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="6" y="4" width="28" height="48" rx="1" />
        </svg>
      );
    case 'Folded Portrait 110×85mm':
      return (
        <svg viewBox="0 0 60 50" className="w-10 h-9" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2">
          <rect x="4" y="4" width="52" height="42" rx="1" />
          <line x1="30" y1="4" x2="30" y2="46" />
        </svg>
      );
    case 'Folded Landscape 170×55mm':
      return (
        <svg viewBox="0 0 64 38" className="w-12 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2">
          <rect x="2" y="4" width="60" height="30" rx="1" />
          <line x1="32" y1="4" x2="32" y2="34" />
        </svg>
      );
    case 'Squared 55×55mm':
      return (
        <svg viewBox="0 0 44 44" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="36" height="36" rx="1" />
        </svg>
      );
    case 'American 90×50mm':
      return (
        <svg viewBox="0 0 60 36" className="w-10 h-7" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="52" height="28" rx="1" />
        </svg>
      );
    default:
      return <div className="w-10 h-8 border-2 border-current rounded" />;
  }
};

// ── Finishing icons ──────────────────────────────────────────────────────────
const FinishingIcon = ({ type }: { type: string }) => {
  if (type === 'No finishing') {
    return (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="24" cy="24" r="20" />
        <line x1="8" y1="8" x2="40" y2="40" />
      </svg>
    );
  }
  const hasSparkles = type.includes('Gloss') || type.includes('UV') || type.includes('Velvet');
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="8" y="14" width="32" height="22" rx="2" fill="rgba(255,255,255,0.05)" />
      <path d="M32 14 Q42 18 36 24" strokeLinecap="round" />
      {hasSparkles && (
        <>
          <path d="M28 10 l1.5 3 m2-4 l1.5 3 m-1 4 l1.5 3" strokeLinecap="round" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
};

// ── recommended defaults ──────────────────────────────────────────────────────
const RECOMMENDED: Record<string, string> = {
  'Size': 'Standard 85×55mm',
  'Material Type': 'Matt',
  'Paper Type': 'Matte (Silk) 400gsm',
  'Finishing': 'Double-sided Matte lamination',
  'Printing': 'Double-sided printing',
  'Corners': 'Square corners',
};

// ── Main Component ────────────────────────────────────────────────────────────
export function BusinessCardPage() {
  const product = getProductBySlug('premium-business-cards');
  const { addItem } = useCartStore();
  const { token } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(RECOMMENDED);
  const [selectedQtyIdx, setSelectedQtyIdx] = useState<number>(7); // 500 qty default
  const [uploadedArtwork, setUploadedArtwork] = useState<Artwork | null>(null);
  const [isUploadingArtwork, setIsUploadingArtwork] = useState(false);

  useEffect(() => {
    if (product) setSelectedOptions(RECOMMENDED);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B0F17] pt-32 pb-20 text-center">
        <p className="text-[#A6B0C5]">Product not found.</p>
      </div>
    );
  }

  const handleOption = (name: string, value: string) =>
    setSelectedOptions(prev => ({ ...prev, [name]: value }));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) { toast.error('File must be < 100 MB'); return; }
    const previewUrl = URL.createObjectURL(file);
    setUploadedArtwork({ id: Math.random().toString(36).substr(2,9), fileName: file.name, fileUrl: previewUrl, fileType: file.type, fileSize: file.size, uploadedAt: new Date() });
    if (!token) { toast.warning('Sign in before checkout so your design is saved permanently.'); return; }
    setIsUploadingArtwork(true);
    try {
      const fd = new FormData(); fd.append('artwork', file);
      const res = await fetch(`${BACKEND_URL}/api/artwork/upload`, { method:'POST', headers:{ Authorization:`Bearer ${token}` }, body:fd });
      const data = await res.json();
      if (data.success && data.data?.fileUrl) {
        setUploadedArtwork(prev => prev ? { ...prev, fileUrl: data.data.fileUrl } : prev);
        toast.success('Artwork uploaded & saved ✅');
      } else { toast.error(data.message || 'Upload failed — preview saved locally.'); }
    } catch { toast.error('Could not reach server — preview saved locally.'); }
    finally { setIsUploadingArtwork(false); }
  };

  const handleAddToCart = () => {
    const priceTier = product.priceTiers[selectedQtyIdx];
    addItem({ id: Math.random().toString(36).substr(2,9), product, quantity: priceTier.quantity, options: selectedOptions, artwork: uploadedArtwork || undefined, price: priceTier.unitPrice });
    toast.success(`${priceTier.quantity.toLocaleString()} business cards added to cart!`);
  };

  const currentTier = product.priceTiers[selectedQtyIdx];

  // Helper: option section label
  const SectionLabel = ({ label, selected }: { label: string; selected: string }) => (
    <p className="text-sm font-medium text-[#F6F8FF] mb-3">
      {label}: <span className="text-[#3B6CFF]">{selected}</span>
    </p>
  );

  // Helper: recommended badge
  const RecommendedBadge = () => (
    <span className="absolute bottom-0 left-0 right-0 bg-[#1a7a3c] text-white text-[9px] font-bold tracking-widest text-center py-[3px] uppercase rounded-b-xl">
      Recommended
    </span>
  );

  return (
    <div className="min-h-screen bg-[#0B0F17] pt-28 pb-20">
      <div className="rp-container max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.4 }} className="mb-6">
          <Link to="/products/business-cards" className="inline-flex items-center gap-2 text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Business Cards
          </Link>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5 }} className="mb-10">
          <span className="rp-micro-label block mb-2">BUSINESS CARDS</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F6F8FF] leading-tight mb-3">{product.name}</h1>
          <p className="text-base text-[#A6B0C5] max-w-2xl">{product.description}</p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left – hero image + specs */}
          <motion.div initial={{ opacity:0,x:-30 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.6 }} className="lg:col-span-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 rounded-2xl bg-[rgba(246,248,255,0.03)] border border-[rgba(246,248,255,0.08)]">
              <h3 className="text-xs font-semibold text-[#F6F8FF] uppercase tracking-wider mb-3">Included</h3>
              {product.specs.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#A6B0C5] mb-2">
                  <Check className="w-4 h-4 text-[#3B6CFF] flex-shrink-0" />{s}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right – configurator */}
          <motion.div initial={{ opacity:0,x:30 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.6 }} className="lg:col-span-8 space-y-8">

            {/* ── SIZE ── */}
            <section>
              <SectionLabel label="Size" selected={selectedOptions['Size']} />
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                {product.options.find(o=>o.name==='Size')!.values.map(val => {
                  const isSelected = selectedOptions['Size'] === val;
                  const isRec = RECOMMENDED['Size'] === val;
                  return (
                    <button key={val} onClick={()=>handleOption('Size',val)}
                      className={`relative flex flex-col items-center justify-center gap-2 pt-4 pb-6 px-2 rounded-xl border transition-all text-center ${isSelected ? 'border-[#3B6CFF] bg-[rgba(59,108,255,0.08)]' : 'border-[rgba(246,248,255,0.12)] bg-[rgba(246,248,255,0.03)] hover:border-[rgba(246,248,255,0.25)]'}`}>
                      <span className={isSelected ? 'text-[#3B6CFF]' : 'text-[#A6B0C5]'}>
                        <SizeIcon type={val} />
                      </span>
                      <span className="text-xs font-semibold text-[#F6F8FF] leading-tight">{val.split(' ').slice(0,1).join(' ')}</span>
                      <span className="text-[10px] text-[#A6B0C5]">{val.split(' ').slice(1).join(' ')}</span>
                      {isRec && <RecommendedBadge />}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── MATERIAL TYPE ── */}
            <section>
              <SectionLabel label="Material Type" selected={selectedOptions['Material Type']} />
              <div className="flex flex-wrap gap-2">
                {product.options.find(o=>o.name==='Material Type')!.values.map(val => {
                  const isSelected = selectedOptions['Material Type'] === val;
                  const isRec = RECOMMENDED['Material Type'] === val;
                  return (
                    <button key={val} onClick={()=>handleOption('Material Type',val)}
                      className={`relative px-4 py-2 rounded-xl border text-sm font-medium transition-all ${isSelected ? 'border-[#3B6CFF] bg-[rgba(59,108,255,0.1)] text-[#F6F8FF]' : 'border-[rgba(246,248,255,0.12)] text-[#A6B0C5] hover:border-[rgba(246,248,255,0.3)]'} ${isRec ? 'pb-5' : ''}`}>
                      {val}
                      {isRec && (
                        <span className="absolute bottom-0 left-0 right-0 bg-[#1a7a3c] text-white text-[8px] font-bold tracking-widest text-center py-[2px] uppercase rounded-b-xl">Recommended</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── PAPER TYPE ── */}
            <section>
              <SectionLabel label="Paper type" selected={selectedOptions['Paper Type']} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.options.find(o=>o.name==='Paper Type')!.values.map(val => {
                  const isSelected = selectedOptions['Paper Type'] === val;
                  const isRec = RECOMMENDED['Paper Type'] === val;
                  const [, , gsm] = val.split(' ');
                  return (
                    <button key={val} onClick={()=>handleOption('Paper Type',val)}
                      className={`relative flex flex-col items-center gap-1 pt-4 pb-6 px-2 rounded-xl border transition-all ${isSelected ? 'border-[#3B6CFF] bg-[rgba(59,108,255,0.08)]' : 'border-[rgba(246,248,255,0.12)] bg-[rgba(246,248,255,0.03)] hover:border-[rgba(246,248,255,0.25)]'}`}>
                      <div className="w-10 h-8 rounded bg-[rgba(246,248,255,0.08)] border border-[rgba(246,248,255,0.1)]" />
                      <span className={`text-xs font-medium mt-1 ${isSelected?'text-[#F6F8FF]':'text-[#A6B0C5]'}`}>Matte (Silk)</span>
                      <span className={`text-xs ${isSelected?'text-[#3B6CFF] font-bold':'text-[#A6B0C5]'}`}>{gsm} gsm</span>
                      {isRec && <RecommendedBadge />}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── FINISHING ── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-sm font-medium text-[#F6F8FF]">Finishing: <span className="text-[#3B6CFF]">{selectedOptions['Finishing']}</span></p>
                <Info className="w-4 h-4 text-[#A6B0C5]" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.options.find(o=>o.name==='Finishing')!.values.map(val => {
                  const isSelected = selectedOptions['Finishing'] === val;
                  const isRec = RECOMMENDED['Finishing'] === val;
                  return (
                    <button key={val} onClick={()=>handleOption('Finishing',val)}
                      className={`relative flex flex-col items-center gap-2 pt-4 pb-6 px-2 rounded-xl border text-center transition-all ${isSelected ? 'border-[#3B6CFF] bg-[rgba(59,108,255,0.08)]' : 'border-[rgba(246,248,255,0.12)] bg-[rgba(246,248,255,0.03)] hover:border-[rgba(246,248,255,0.25)]'}`}>
                      <span className={isSelected ? 'text-[#3B6CFF]' : 'text-[#A6B0C5]'}><FinishingIcon type={val} /></span>
                      <span className="text-xs font-medium text-[#F6F8FF] leading-tight">{val}</span>
                      {isRec && <RecommendedBadge />}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── PRINTING ── */}
            <section>
              <SectionLabel label="Printing" selected={selectedOptions['Printing']} />
              <div className="flex gap-3">
                {product.options.find(o=>o.name==='Printing')!.values.map(val => {
                  const isSelected = selectedOptions['Printing'] === val;
                  const isRec = RECOMMENDED['Printing'] === val;
                  return (
                    <button key={val} onClick={()=>handleOption('Printing',val)}
                      className={`relative px-5 py-2 rounded-xl border text-sm font-medium transition-all ${isSelected ? 'border-[#3B6CFF] bg-[rgba(59,108,255,0.1)] text-[#F6F8FF]' : 'border-[rgba(246,248,255,0.12)] text-[#A6B0C5] hover:border-[rgba(246,248,255,0.3)]'} ${isRec ? 'pb-5' : ''}`}>
                      {val}
                      {isRec && <span className="absolute bottom-0 left-0 right-0 bg-[#1a7a3c] text-white text-[8px] font-bold tracking-widest text-center py-[2px] uppercase rounded-b-xl">Recommended</span>}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── CORNERS ── */}
            <section>
              <SectionLabel label="Corners" selected={selectedOptions['Corners']} />
              <div className="flex gap-3">
                {product.options.find(o=>o.name==='Corners')!.values.map(val => {
                  const isSelected = selectedOptions['Corners'] === val;
                  return (
                    <button key={val} onClick={()=>handleOption('Corners',val)}
                      className={`px-5 py-2 rounded-xl border text-sm font-medium transition-all ${isSelected ? 'border-[#3B6CFF] bg-[rgba(59,108,255,0.1)] text-[#F6F8FF]' : 'border-[rgba(246,248,255,0.12)] text-[#A6B0C5] hover:border-[rgba(246,248,255,0.3)]'}`}>
                      {val}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── QUANTITY & PRICE GRID ── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-sm font-medium text-[#F6F8FF]">Print run: <span className="text-[#3B6CFF]">{currentTier.quantity.toLocaleString()}</span></p>
                <Info className="w-4 h-4 text-[#A6B0C5]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {product.priceTiers.map((tier, idx) => {
                  const isSelected = selectedQtyIdx === idx;
                  const isRec = tier.quantity === 500;
                  return (
                    <button key={tier.quantity} onClick={()=>setSelectedQtyIdx(idx)}
                      className={`relative flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all ${isSelected ? 'border-[#3B6CFF] bg-[rgba(59,108,255,0.1)]' : 'border-[rgba(246,248,255,0.10)] bg-[rgba(246,248,255,0.03)] hover:border-[rgba(246,248,255,0.20)]'} ${isRec ? 'mt-1' : ''}`}>
                      {isRec && <span className="absolute -top-4 left-0 bg-[#1a7a3c] text-white text-[8px] font-bold tracking-widest px-2 py-[2px] uppercase rounded-t-md">Recommended</span>}
                      <span className={`font-medium ${isSelected?'text-[#F6F8FF]':'text-[#A6B0C5]'}`}>{tier.quantity.toLocaleString()}</span>
                      <span className={`font-semibold ${isSelected?'text-[#F6F8FF]':'text-[#A6B0C5]'}`}>£{tier.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── ARTWORK UPLOAD ── */}
            <section>
              <h3 className="text-sm font-medium text-[#F6F8FF] mb-3">Upload Your Artwork</h3>
              <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.svg,.ai,.eps" onChange={handleFileUpload} className="hidden" />
              {uploadedArtwork ? (
                <div className={`p-4 rounded-xl border flex items-center justify-between ${isUploadingArtwork ? 'bg-[rgba(246,168,0,0.08)] border-[rgba(246,168,0,0.3)]' : 'bg-[rgba(59,108,255,0.08)] border-[rgba(59,108,255,0.3)]'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isUploadingArtwork?'bg-[rgba(246,168,0,0.2)]':'bg-[#3B6CFF]'}`}>
                      {isUploadingArtwork ? <Loader2 className="w-4 h-4 text-yellow-400 animate-spin"/> : <Check className="w-4 h-4 text-white"/>}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F6F8FF]">{uploadedArtwork.fileName}</p>
                      <p className="text-xs text-[#A6B0C5]">{isUploadingArtwork ? 'Uploading to cloud…' : `${(uploadedArtwork.fileSize/1024/1024).toFixed(2)} MB — saved ✅`}</p>
                    </div>
                  </div>
                  {!isUploadingArtwork && <button onClick={()=>setUploadedArtwork(null)} className="text-xs text-[#A6B0C5] hover:text-red-400 transition-colors">Remove</button>}
                </div>
              ) : (
                <button onClick={()=>fileInputRef.current?.click()} className="w-full p-5 rounded-xl border-2 border-dashed border-[rgba(246,248,255,0.15)] hover:border-[#3B6CFF] transition-colors text-center group">
                  <Upload className="w-7 h-7 text-[#A6B0C5] mx-auto mb-2 group-hover:text-[#3B6CFF] transition-colors" />
                  <p className="text-sm text-[#F6F8FF] mb-1">Click to upload artwork</p>
                  <p className="text-xs text-[#A6B0C5]">PDF, PNG, JPEG, SVG, AI, EPS (max 100 MB)</p>
                </button>
              )}
            </section>

            {/* ── PRICE SUMMARY & ADD TO CART ── */}
            <section className="p-6 rounded-2xl bg-[rgba(246,248,255,0.03)] border border-[rgba(246,248,255,0.08)]">
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-xs text-[#A6B0C5] mb-1">Total Price</p>
                  <p className="text-4xl font-bold text-[#F6F8FF]">£{currentTier.price.toFixed(2)}</p>
                  <p className="text-xs text-[#A6B0C5] mt-1">{currentTier.quantity.toLocaleString()} cards @ £{currentTier.unitPrice.toFixed(3)} each</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#A6B0C5]">
                  <Truck className="w-4 h-4" /> Free UK shipping over £50
                </div>
              </div>
              {/* Config summary */}
              <div className="mb-5 p-3 rounded-xl bg-[rgba(246,248,255,0.03)]">
                <p className="text-[10px] text-[#A6B0C5] uppercase tracking-wider mb-2">Your Configuration</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {Object.entries(selectedOptions).map(([k,v]) => (
                    <div key={k} className="flex items-baseline gap-1 text-xs">
                      <span className="text-[#A6B0C5]">{k}:</span>
                      <span className="text-[#F6F8FF] font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAddToCart} className="flex-1 bg-[#3B6CFF] hover:bg-[#2a5aee] text-white py-6 text-base">
                  <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
                </Button>
                <Link to="/request-design" className="sm:w-auto w-full">
                  <Button variant="outline" className="w-full border-[rgba(246,248,255,0.20)] text-[#F6F8FF] py-6 px-6 hover:bg-[rgba(246,248,255,0.05)]">
                    Need Design Help?
                  </Button>
                </Link>
              </div>
            </section>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

