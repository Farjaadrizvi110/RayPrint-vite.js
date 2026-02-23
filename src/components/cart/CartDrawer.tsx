import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore, useUIStore } from '@/store';
import { Button } from '@/components/ui/button';

export function CartDrawer() {
  const { isCartOpen, setCartOpen } = useUIStore();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  
  const totalPrice = getTotalPrice();
  
  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setCartOpen(false)}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0B0F17] border-l border-[rgba(246,248,255,0.08)] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[rgba(246,248,255,0.08)]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#A6B0C5]" />
                <h2 className="text-lg font-semibold text-[#F6F8FF]">Your Cart</h2>
                <span className="px-2 py-0.5 bg-[rgba(59,108,255,0.2)] text-[#3B6CFF] text-xs font-medium rounded-full">
                  {items.length} items
                </span>
              </div>
              <button 
                onClick={() => setCartOpen(false)}
                className="p-2 text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-[rgba(246,248,255,0.06)] flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-[#A6B0C5]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#F6F8FF] mb-2">Your cart is empty</h3>
                  <p className="text-sm text-[#A6B0C5] mb-6">Start browsing our products to add items to your cart.</p>
                  <Button 
                    onClick={() => setCartOpen(false)}
                    className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 p-4 rounded-2xl bg-[rgba(246,248,255,0.04)] border border-[rgba(246,248,255,0.08)]"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#F6F8FF] truncate">{item.product.name}</h4>
                        <p className="text-xs text-[#A6B0C5] mt-0.5">
                          {Object.entries(item.options).map(([key, value]) => (
                            <span key={key}>{value}</span>
                          )).reduce((prev, curr) => <>{prev}, {curr}</>)}
                        </p>
                        
                        {item.artwork && (
                          <p className="text-xs text-[#3B6CFF] mt-1">
                            Artwork: {item.artwork.fileName}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity */}
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-[rgba(246,248,255,0.08)] flex items-center justify-center text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium text-[#F6F8FF] w-6 text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-[rgba(246,248,255,0.08)] flex items-center justify-center text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          {/* Price */}
                          <span className="text-sm font-medium text-[#F6F8FF]">
                            £{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Remove */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-[#A6B0C5] hover:text-red-400 transition-colors self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[rgba(246,248,255,0.08)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#A6B0C5]">Subtotal</span>
                  <span className="text-lg font-semibold text-[#F6F8FF]">£{totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-[#A6B0C5]">Shipping and taxes calculated at checkout.</p>
                <Link to="/checkout" onClick={() => setCartOpen(false)}>
                  <Button className="w-full bg-[#3B6CFF] hover:bg-[#2a5aee] text-white py-6">
                    Proceed to Checkout
                  </Button>
                </Link>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="w-full text-sm text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
