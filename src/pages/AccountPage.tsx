import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, User, MapPin, LogOut, ChevronRight, X, Truck, CheckCircle, Clock } from 'lucide-react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: string;
  shipping: number;
  subtotal: number;
  address: string;
  tracking?: string;
}

export function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F17] pt-32 pb-20">
        <div className="rp-container text-center">
          <h1 className="text-4xl font-bold text-[#F6F8FF] mb-4">Please Sign In</h1>
          <p className="text-[#A6B0C5] mb-8">You need to be signed in to view your account.</p>
          <Link to="/login">
            <Button className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };
  
  // Mock orders data with more details
  const orders: Order[] = [
    {
      id: 'RP-2024-001',
      date: '2024-01-15',
      total: 130.99,
      subtotal: 125.00,
      shipping: 5.99,
      status: 'delivered',
      items: 'Premium Business Cards x 500',
      address: '123 Print Street, London, EC1A 1BB',
      tracking: 'TRK123456789',
    },
    {
      id: 'RP-2024-002',
      date: '2024-02-01',
      total: 350.00,
      subtotal: 350.00,
      shipping: 0,
      status: 'in_production',
      items: 'Custom Mailer Boxes x 100',
      address: '123 Print Street, London, EC1A 1BB',
    },
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      case 'in_production':
        return 'bg-[#3B6CFF]/20 text-[#3B6CFF]';
      case 'shipped':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'in_production':
        return <Clock className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'in_production':
        return 'In Production';
      case 'shipped':
        return 'Shipped';
      default:
        return status.replace('_', ' ');
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0B0F17] pt-32 pb-20">
      <div className="rp-container max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-[#F6F8FF] mb-2">My Account</h1>
          <p className="text-[#A6B0C5]">Welcome back, {user?.firstName}</p>
        </motion.div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="rp-card p-4 space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  activeTab === 'orders' 
                    ? 'bg-[rgba(59,108,255,0.2)] text-[#3B6CFF]' 
                    : 'text-[#A6B0C5] hover:bg-[rgba(246,248,255,0.06)]'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>My Orders</span>
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-[rgba(59,108,255,0.2)] text-[#3B6CFF]' 
                    : 'text-[#A6B0C5] hover:bg-[rgba(246,248,255,0.06)]'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  activeTab === 'addresses' 
                    ? 'bg-[rgba(59,108,255,0.2)] text-[#3B6CFF]' 
                    : 'text-[#A6B0C5] hover:bg-[rgba(246,248,255,0.06)]'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span>Addresses</span>
              </button>
              
              <div className="border-t border-[rgba(246,248,255,0.08)] pt-2 mt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold text-[#F6F8FF] mb-6">Order History</h2>
                
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="rp-card p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="text-sm text-[#A6B0C5] mb-1">Order #{order.id}</p>
                            <p className="text-lg font-semibold text-[#F6F8FF]">{order.items}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-[rgba(246,248,255,0.08)]">
                          <div className="text-sm text-[#A6B0C5]">
                            {new Date(order.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-semibold text-[#F6F8FF]">
                              £{order.total.toFixed(2)}
                            </span>
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="flex items-center gap-1 text-sm text-[#3B6CFF] hover:underline"
                            >
                              Details <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rp-card p-12 text-center">
                    <Package className="w-12 h-12 text-[#A6B0C5] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#F6F8FF] mb-2">No orders yet</h3>
                    <p className="text-[#A6B0C5] mb-6">Start shopping to see your orders here.</p>
                    <Link to="/products">
                      <Button className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-[#F6F8FF] mb-6">Profile Information</h2>
                <div className="rp-card p-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-[#A6B0C5] mb-2 block">First Name</label>
                      <input 
                        type="text" 
                        defaultValue={user?.firstName}
                        className="w-full px-4 py-3 rounded-xl bg-[rgba(246,248,255,0.06)] border border-[rgba(246,248,255,0.10)] text-[#F6F8FF]"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[#A6B0C5] mb-2 block">Last Name</label>
                      <input 
                        type="text" 
                        defaultValue={user?.lastName}
                        className="w-full px-4 py-3 rounded-xl bg-[rgba(246,248,255,0.06)] border border-[rgba(246,248,255,0.10)] text-[#F6F8FF]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm text-[#A6B0C5] mb-2 block">Email</label>
                      <input 
                        type="email" 
                        defaultValue={user?.email}
                        className="w-full px-4 py-3 rounded-xl bg-[rgba(246,248,255,0.06)] border border-[rgba(246,248,255,0.10)] text-[#F6F8FF]"
                      />
                    </div>
                  </div>
                  <Button className="mt-6 bg-[#3B6CFF] hover:bg-[#2a5aee] text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-xl font-semibold text-[#F6F8FF] mb-6">Saved Addresses</h2>
                <div className="rp-card p-12 text-center">
                  <MapPin className="w-12 h-12 text-[#A6B0C5] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#F6F8FF] mb-2">No saved addresses</h3>
                  <p className="text-[#A6B0C5] mb-6">Add an address for faster checkout.</p>
                  <Button className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white">
                    Add Address
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] overflow-auto bg-[#0B0F17] border border-[rgba(246,248,255,0.10)] rounded-2xl z-50"
            >
              <div className="p-6 md:p-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#F6F8FF]">Order Details</h3>
                    <p className="text-sm text-[#A6B0C5]">Order #{selectedOrder.id}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Status */}
                <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  <span className="font-medium">{getStatusLabel(selectedOrder.status)}</span>
                </div>
                
                {/* Order Info */}
                <div className="space-y-6">
                  {/* Items */}
                  <div>
                    <h4 className="text-sm font-medium text-[#A6B0C5] mb-3">Items</h4>
                    <div className="p-4 rounded-xl bg-[rgba(246,248,255,0.04)]">
                      <p className="text-[#F6F8FF]">{selectedOrder.items}</p>
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  <div>
                    <h4 className="text-sm font-medium text-[#A6B0C5] mb-3">Shipping Address</h4>
                    <div className="p-4 rounded-xl bg-[rgba(246,248,255,0.04)]">
                      <p className="text-[#F6F8FF]">{selectedOrder.address}</p>
                    </div>
                  </div>
                  
                  {/* Tracking */}
                  {selectedOrder.tracking && (
                    <div>
                      <h4 className="text-sm font-medium text-[#A6B0C5] mb-3">Tracking Number</h4>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(246,248,255,0.04)]">
                        <Truck className="w-5 h-5 text-[#3B6CFF]" />
                        <span className="text-[#F6F8FF] font-mono">{selectedOrder.tracking}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Order Summary */}
                  <div className="border-t border-[rgba(246,248,255,0.08)] pt-6">
                    <h4 className="text-sm font-medium text-[#A6B0C5] mb-3">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#A6B0C5]">Subtotal</span>
                        <span className="text-[#F6F8FF]">£{selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#A6B0C5]">Shipping</span>
                        <span className="text-[#F6F8FF]">
                          {selectedOrder.shipping === 0 ? 'Free' : `£${selectedOrder.shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold pt-2 border-t border-[rgba(246,248,255,0.08)]">
                        <span className="text-[#F6F8FF]">Total</span>
                        <span className="text-[#F6F8FF]">£{selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Date */}
                  <div className="flex items-center gap-2 text-sm text-[#A6B0C5]">
                    <Clock className="w-4 h-4" />
                    <span>Ordered on {new Date(selectedOrder.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}</span>
                  </div>
                </div>
                
                {/* Close Button */}
                <Button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-full mt-6 bg-[#3B6CFF] hover:bg-[#2a5aee] text-white"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
