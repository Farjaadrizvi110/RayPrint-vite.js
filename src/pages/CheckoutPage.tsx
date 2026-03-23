import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock, Truck } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore, useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');

// ─── Inner form — must live inside <Elements> ────────────────────────────────
function StripePaymentForm({
  finalTotal,
  onBack,
  onSuccess,
}: {
  finalTotal: number;
  onBack: () => void;
  onSuccess: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/#/account` },
        redirect: 'if_required',
      });
      if (error) {
        toast.error(error.message || 'Payment failed. Please try again.');
      } else {
        onSuccess(paymentIntent?.id ?? '');
      }
    } catch {
      toast.error('Unexpected error during payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="rp-card p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-5 h-5 text-[#3B6CFF]" />
        <h2 className="text-xl font-semibold text-[#0F172A]">Secure Payment</h2>
      </div>

      {/* Stripe Payment Element — handles card, Apple Pay, Google Pay, etc. */}
      <div className="mb-8 stripe-element-wrapper">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 border-slate-300 text-[#0F172A] hover:bg-slate-50 py-6"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="flex-1 bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff] hover:from-[#2a5aee] hover:to-[#4a75f0] text-white py-6 shadow-lg shadow-[#3B6CFF]/25"
        >
          {isProcessing ? 'Processing...' : `Pay £${finalTotal.toFixed(2)}`}
        </Button>
      </div>
    </motion.form>
  );
}

// ─── Main CheckoutPage ────────────────────────────────────────────────────────
export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, token } = useAuthStore();

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');

  // Auto-fill from user's saved default address
  const defaultAddr = user?.addresses?.find((a) => a.isDefault) ?? user?.addresses?.[0];
  const [shippingInfo, setShippingInfo] = useState({
    firstName: defaultAddr?.fullName?.split(' ')[0] || user?.firstName || '',
    lastName:  defaultAddr?.fullName?.split(' ').slice(1).join(' ') || user?.lastName || '',
    email:     user?.email || '',
    address:   defaultAddr?.line1 || '',
    city:      defaultAddr?.city || '',
    postcode:  defaultAddr?.postcode || '',
    phone:     defaultAddr?.phone || user?.phone || '',
  });

  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 50 ? 0 : 5.99;
  const finalTotal = totalPrice + shipping;

  // ── Guard: must be logged in ──────────────────────────────────────────────
  if (!user || !token) {
    return (
      <div
        className="min-h-screen pt-32 pb-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(248,250,252,0.88), rgba(248,250,252,0.88)), url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="rp-container text-center">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-4">Please sign in to checkout</h1>
          <p className="text-[#64748B] mb-8">You need an account to place an order.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button className="bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff] hover:from-[#2a5aee] hover:to-[#4a75f0] text-white px-8 py-3 shadow-lg shadow-[#3B6CFF]/25">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="border-slate-300 text-[#0F172A] hover:bg-slate-50 px-8 py-3">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen pt-32 pb-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(248,250,252,0.88), rgba(248,250,252,0.88)), url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="rp-container text-center">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-4">Your cart is empty</h1>
          <p className="text-[#64748B] mb-8">Add some items to proceed with checkout.</p>
          <Link to="/products">
            <Button className="bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff] hover:from-[#2a5aee] hover:to-[#4a75f0] text-white shadow-lg shadow-[#3B6CFF]/25">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const amountPence = Math.round(finalTotal * 100);
      const res = await fetch(`${BACKEND_URL}/api/payments/checkout-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amountPence,
          currency: 'gbp',
          customerEmail: shippingInfo.email,
          items: items.map(i => ({ name: i.product.name, quantity: i.quantity })),
        }),
      });

      // Safely parse JSON — server may return HTML if Stripe/env keys are missing
      let data: Record<string, unknown> | null = null;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      }

      if (!res.ok) {
        const msg =
          (data as { message?: string } | null)?.message ||
          `Server error (${res.status}). Please check backend environment variables (STRIPE_SECRET_KEY).`;
        toast.error(msg);
        return;
      }

      const payload = data as { data?: { clientSecret?: string; paymentIntentId?: string } } | null;
      setClientSecret(payload?.data?.clientSecret ?? '');
      setPaymentIntentId(payload?.data?.paymentIntentId ?? '');
      setStep('payment');
      window.scrollTo(0, 0);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Payment setup failed: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = useCallback(async (intentId: string) => {
    try {
      // Create the order record in MongoDB
      await fetch(`${BACKEND_URL}/api/orders/from-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentIntentId: intentId || paymentIntentId,
          items: items.map(i => ({
            name:          i.product.name,
            quantity:      i.quantity,
            unitPricePence: Math.round(i.price * 100),
            options:       i.options,
            artworkUrl:    i.artwork?.fileUrl || '',
          })),
          shippingAddress: {
            fullName: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
            line1:    shippingInfo.address,
            city:     shippingInfo.city,
            postcode: shippingInfo.postcode,
            country:  'GB',
            phone:    shippingInfo.phone,
          },
          shippingCostPence: Math.round(shipping * 100),
        }),
      });
    } catch {
      // Order creation failure is non-fatal — payment already succeeded
    }
    toast.success('🎉 Payment successful! Your order is confirmed.');
    clearCart();
    navigate('/account');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentIntentId, items, shippingInfo, shipping, token]);
  
  return (
    <div
      className="min-h-screen pt-32 pb-20"
      style={{
        backgroundImage:
          'linear-gradient(rgba(248,250,252,0.88), rgba(248,250,252,0.88)), url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="rp-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A]">Checkout</h1>
        </motion.div>
        
        {/* Progress */}
        <div className="flex items-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-[#3B6CFF]' : 'text-[#0F172A]'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step === 'shipping' ? 'bg-[#3B6CFF]' : 'bg-slate-300'}`}>
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Shipping</span>
          </div>
          <div className="flex-1 h-px bg-slate-200" />
          <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-[#3B6CFF]' : 'text-[#64748B]'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step === 'payment' ? 'bg-[#3B6CFF]' : 'bg-slate-300'}`}>
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Payment</span>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 'shipping' ? (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleShippingSubmit}
                className="rp-card p-8"
              >
                <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Shipping Information</h2>

                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label className="text-sm text-[#475569] mb-2 block">First Name</Label>
                    <Input
                      required
                      value={shippingInfo.firstName}
                      onChange={e => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      className="bg-slate-50 border-slate-200 text-[#0F172A] focus:border-[#3B6CFF]"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#475569] mb-2 block">Last Name</Label>
                    <Input
                      required
                      value={shippingInfo.lastName}
                      onChange={e => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      className="bg-slate-50 border-slate-200 text-[#0F172A] focus:border-[#3B6CFF]"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-sm text-[#475569] mb-2 block">Email</Label>
                  <Input
                    type="email"
                    required
                    value={shippingInfo.email}
                    onChange={e => setShippingInfo({...shippingInfo, email: e.target.value})}
                    className="bg-slate-50 border-slate-200 text-[#0F172A] focus:border-[#3B6CFF]"
                  />
                </div>

                <div className="mb-6">
                  <Label className="text-sm text-[#475569] mb-2 block">Address</Label>
                  <Input
                    required
                    value={shippingInfo.address}
                    onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="bg-slate-50 border-slate-200 text-[#0F172A] focus:border-[#3B6CFF]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label className="text-sm text-[#475569] mb-2 block">City</Label>
                    <Input
                      required
                      value={shippingInfo.city}
                      onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="bg-slate-50 border-slate-200 text-[#0F172A] focus:border-[#3B6CFF]"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#475569] mb-2 block">Postcode</Label>
                    <Input
                      required
                      value={shippingInfo.postcode}
                      onChange={e => setShippingInfo({...shippingInfo, postcode: e.target.value})}
                      className="bg-slate-50 border-slate-200 text-[#0F172A] focus:border-[#3B6CFF]"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <Label className="text-sm text-[#475569] mb-2 block">Phone</Label>
                  <Input
                    type="tel"
                    required
                    value={shippingInfo.phone}
                    onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="bg-slate-50 border-slate-200 text-[#0F172A] focus:border-[#3B6CFF]"
                  />
                </div>
                
                <Button type="submit" disabled={isProcessing} className="w-full bg-gradient-to-r from-[#3B6CFF] to-[#5a85ff] hover:from-[#2a5aee] hover:to-[#4a75f0] text-white py-6 shadow-lg shadow-[#3B6CFF]/25 transition-all hover:scale-[1.01]">
                  {isProcessing ? 'Preparing payment…' : 'Continue to Payment'}
                </Button>
              </motion.form>
            ) : clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#3B6CFF',
                      colorBackground: '#ffffff',
                      colorText: '#0F172A',
                      colorTextSecondary: '#64748B',
                      borderRadius: '8px',
                      fontFamily: 'inherit',
                    },
                  },
                }}
              >
                <StripePaymentForm
                  finalTotal={finalTotal}
                  onBack={() => setStep('shipping')}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            ) : (
              <div className="rp-card p-8 flex items-center justify-center min-h-[200px]">
                <p className="text-[#64748B]">Initialising payment…</p>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rp-card p-6 sticky top-32">
              <h2 className="text-lg font-semibold text-[#0F172A] mb-6">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F172A] truncate">{item.product.name}</p>
                      <p className="text-xs text-[#64748B]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-[#0F172A]">£{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">Subtotal</span>
                  <span className="text-[#0F172A] font-medium">£{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748B]">Shipping</span>
                  <span className="text-[#0F172A] font-medium">
                    {shipping === 0 ? 'Free' : `£${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-lg font-semibold text-[#0F172A]">Total</span>
                  <span className="text-2xl font-bold text-[#0F172A]">£{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
