import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2, Upload } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';

export function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };
  const totalPrice = getTotalPrice();
  
  const shipping = totalPrice > 50 ? 0 : 5.99;
  const finalTotal = totalPrice + shipping;
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20">
        <div className="rp-container">
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-[#64748B]" />
            </div>
            <h1 className="text-3xl font-bold text-[#0F172A] mb-4">Your cart is empty</h1>
            <p className="text-[#64748B] mb-8">Start browsing our products to add items to your cart.</p>
            <Link to="/products">
              <Button className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white px-8 py-6">
                Start Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20">
      <div className="rp-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A]">Shopping Cart</h1>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rp-card p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Image */}
                    <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-[#0F172A]">{item.product.name}</h3>
                          <p className="text-sm text-[#A6B0C5]">
                            {Object.entries(item.options).map(([key, value]) => (
                              <span key={key} className="mr-2">{value}</span>
                            ))}
                          </p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-[#A6B0C5] hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {item.artwork && (
                        <div className="flex items-center gap-2 text-sm text-[#3B6CFF] mb-4">
                          <Upload className="w-4 h-4" />
                          {item.artwork.fileName}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - item.product.priceTiers[0].quantity)}
                            className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium text-[#0F172A] w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + item.product.priceTiers[0].quantity)}
                            className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Price */}
                        <span className="text-lg font-semibold text-[#0F172A]">
                          £{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <button 
              onClick={clearCart}
              className="mt-6 text-sm text-[#A6B0C5] hover:text-red-400 transition-colors"
            >
              Clear Cart
            </button>
          </div>
          
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rp-card p-6 sticky top-32">
              <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
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
                {shipping === 0 && (
                  <p className="text-xs text-[#3B6CFF] font-medium">✓ You qualify for free shipping!</p>
                )}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-lg font-semibold text-[#0F172A]">Total</span>
                  <span className="text-2xl font-bold text-[#0F172A]">£{finalTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                onClick={handleCheckout}
                className="w-full bg-[#3B6CFF] hover:bg-[#2a5aee] text-white py-6 mb-4"
              >
                {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <p className="text-xs text-[#64748B] text-center">
                Shipping & taxes calculated at checkout
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
