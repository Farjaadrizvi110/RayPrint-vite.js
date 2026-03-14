import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, User, MapPin, LogOut, ChevronRight, X, Truck,
  CheckCircle, Clock, Loader2, Download, Lock, Phone,
  Briefcase, Building2, MessageCircle, Save, Eye, EyeOff,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

interface OrderItem {
  product?: { name: string };
  productName?: string;
  quantity: number;
  unitPrice?: number;
  price?: number;
  artworkUrl?: string;
  options?: Record<string, string>;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  subtotal?: number;
  shippingCost?: number;
  tax?: number;
  status: string;
  paymentStatus?: string;
  items: OrderItem[];
  shippingAddress?: {
    fullName?: string;
    line1: string;
    line2?: string;
    city: string;
    county?: string;
    postcode: string;
    country?: string;
    phone?: string;
  };
  trackingNumber?: string;
}

export function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, token, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'security'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    phone:     user?.phone     || '',
    whatsapp:  user?.whatsapp  || '',
    profession:user?.profession|| '',
    business:  user?.business  || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Address form state
  const defaultAddr = user?.addresses?.find((a) => a.isDefault) ?? user?.addresses?.[0];
  const [addrForm, setAddrForm] = useState({
    fullName: defaultAddr?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    line1:    defaultAddr?.line1    || '',
    line2:    defaultAddr?.line2    || '',
    city:     defaultAddr?.city     || '',
    county:   defaultAddr?.county   || '',
    postcode: defaultAddr?.postcode || '',
    phone:    defaultAddr?.phone    || user?.phone || '',
  });
  const [addrSaving, setAddrSaving] = useState(false);

  // Password form state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    setOrdersLoading(true);
    fetch(`${BACKEND_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { if (d.success) setOrders(d.data); })
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20">
        <div className="rp-container text-center">
          <h1 className="text-4xl font-bold text-[#0F172A] mb-4">Please Sign In</h1>
          <p className="text-[#64748B] mb-8">You need to be signed in to view your account.</p>
          <Link to="/login">
            <Button className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white">Sign In</Button>
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

  const handleProfileSave = async () => {
    setProfileSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || 'Failed to update profile'); return; }
      updateUser(data.data);
      toast.success('Profile updated successfully!');
    } catch { toast.error('Network error. Please try again.'); }
    finally { setProfileSaving(false); }
  };

  const handleAddrSave = async () => {
    if (!addrForm.line1 || !addrForm.city || !addrForm.postcode) {
      toast.error('Please fill in address, city and postcode.'); return;
    }
    setAddrSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ address: { ...addrForm, country: 'GB', isDefault: true } }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || 'Failed to save address'); return; }
      updateUser(data.data);
      toast.success('Address saved successfully!');
    } catch { toast.error('Network error. Please try again.'); }
    finally { setAddrSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match.'); return;
    }
    if (pwForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.'); return;
    }
    setPwSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || 'Failed to change password'); return; }
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch { toast.error('Network error. Please try again.'); }
    finally { setPwSaving(false); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-50 text-green-700 border border-green-200';
      case 'in_production': return 'bg-blue-50 text-[#3B6CFF] border border-blue-200';
      case 'dispatched':
      case 'shipped': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'payment_received': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200';
      default: return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'in_production': return <Clock className="w-4 h-4" />;
      case 'dispatched':
      case 'shipped': return <Truck className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      payment_received: 'Payment Received',
      artwork_review: 'Artwork Review',
      in_production: 'In Production',
      dispatched: 'Dispatched',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
    };
    return map[status] ?? status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0F172A] placeholder-[#94a3b8] focus:outline-none focus:border-[#3B6CFF] focus:ring-2 focus:ring-[#3B6CFF]/10 transition-colors';
  const labelCls = 'text-sm text-[#475569] mb-1.5 block font-medium';
  
  const whatsappUrl = `https://wa.me/447757202729?text=Hi%20RayPrint%20UK%2C%20I%20need%20help%20with%20my%20order.`;

  const navItems = [
    { key: 'orders',    label: 'My Orders',    icon: Package },
    { key: 'profile',   label: 'Profile',      icon: User },
    { key: 'addresses', label: 'Address',       icon: MapPin },
    { key: 'security',  label: 'Security',      icon: Lock },
  ] as const;

  return (
    <div
      className="min-h-screen pt-32 pb-20"
      style={{
        backgroundImage:
          'linear-gradient(rgba(248,250,252,0.88), rgba(248,250,252,0.88)), url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="rp-container max-w-6xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#0F172A] mb-1">My Account</h1>
              <p className="text-[#64748B]">Welcome back, <span className="text-[#3B6CFF] font-medium">{user?.firstName}</span> 👋</p>
            </div>
            {/* WhatsApp Support Button */}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 transition-colors font-medium text-sm shadow-sm">
              <MessageCircle className="w-4 h-4" />
              WhatsApp Support
            </a>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="lg:col-span-1">
            <div className="rp-card p-4 space-y-1">
              {navItems.map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === key ? 'bg-[#3B6CFF]/10 text-[#3B6CFF] font-medium' : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]'}`}>
                  <Icon className="w-5 h-5" /><span>{label}</span>
                </button>
              ))}
              <div className="border-t border-slate-200 pt-2 mt-2">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                  <LogOut className="w-5 h-5" /><span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-3">

            {/* ── ORDERS ── */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Order History</h2>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-[#3B6CFF] animate-spin" /></div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="rp-card p-6 hover:border-[rgba(59,108,255,0.3)] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-xs text-[#64748B] font-mono bg-slate-100 px-2 py-1 rounded">#{order.orderNumber}</p>
                              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}{getStatusLabel(order.status)}
                              </span>
                            </div>
                            <p className="text-[#0F172A] font-medium">
                              {order.items.map(i => i.productName ?? i.product?.name ?? 'Item').join(', ')}
                            </p>
                            <p className="text-xs text-[#64748B] mt-1">
                              {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-[#0F172A]">£{(order.totalAmount / 100).toFixed(2)}</span>
                            <button onClick={() => setSelectedOrder(order)}
                              className="flex items-center gap-1 text-sm text-[#3B6CFF] hover:text-white bg-[#3B6CFF]/10 hover:bg-[#3B6CFF] border border-[#3B6CFF]/30 hover:border-[#3B6CFF] px-3 py-1.5 rounded-lg transition-all font-medium">
                              Details <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="rp-card p-12 text-center">
                    <Package className="w-12 h-12 text-[#94a3b8] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#0F172A] mb-2">No orders yet</h3>
                    <p className="text-[#64748B] mb-6">Start shopping to see your orders here.</p>
                    <Link to="/products"><Button className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white">Browse Products</Button></Link>
                  </div>
                )}
              </div>
            )}

            {/* ── PROFILE ── */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Profile Information</h2>
                <div className="rp-card p-6 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div><label className={labelCls}>First Name</label>
                      <input className={inputCls} value={profileForm.firstName} onChange={e => setProfileForm(p => ({ ...p, firstName: e.target.value }))} /></div>
                    <div><label className={labelCls}>Last Name</label>
                      <input className={inputCls} value={profileForm.lastName} onChange={e => setProfileForm(p => ({ ...p, lastName: e.target.value }))} /></div>
                    <div className="sm:col-span-2"><label className={labelCls}>Email (read-only)</label>
                      <input className={inputCls + ' opacity-60 cursor-not-allowed'} value={user?.email} readOnly /></div>
                    <div><label className={labelCls}><Phone className="w-3.5 h-3.5 inline mr-1" />Phone Number</label>
                      <input className={inputCls} placeholder="+44 7700 000000" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} /></div>
                    <div><label className={labelCls}><MessageCircle className="w-3.5 h-3.5 inline mr-1 text-green-400" />WhatsApp Number</label>
                      <input className={inputCls} placeholder="+44 7700 000000" value={profileForm.whatsapp} onChange={e => setProfileForm(p => ({ ...p, whatsapp: e.target.value }))} /></div>
                    <div><label className={labelCls}><Briefcase className="w-3.5 h-3.5 inline mr-1" />Profession</label>
                      <input className={inputCls} placeholder="e.g. Graphic Designer" value={profileForm.profession} onChange={e => setProfileForm(p => ({ ...p, profession: e.target.value }))} /></div>
                    <div><label className={labelCls}><Building2 className="w-3.5 h-3.5 inline mr-1" />Business / Company</label>
                      <input className={inputCls} placeholder="e.g. Acme Ltd" value={profileForm.business} onChange={e => setProfileForm(p => ({ ...p, business: e.target.value }))} /></div>
                  </div>
                  <Button onClick={handleProfileSave} disabled={profileSaving} className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white px-8">
                    {profileSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : <><Save className="w-4 h-4 mr-2" />Save Profile</>}
                  </Button>
                </div>
              </div>
            )}

            {/* ── ADDRESS ── */}
            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Default Delivery Address</h2>
                <div className="rp-card p-6 space-y-5">
                  <p className="text-sm text-[#64748B]">This address will be auto-filled at checkout.</p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2"><label className={labelCls}>Full Name</label>
                      <input className={inputCls} placeholder="John Smith" value={addrForm.fullName} onChange={e => setAddrForm(p => ({ ...p, fullName: e.target.value }))} /></div>
                    <div className="sm:col-span-2"><label className={labelCls}>Address Line 1 *</label>
                      <input className={inputCls} placeholder="123 High Street" value={addrForm.line1} onChange={e => setAddrForm(p => ({ ...p, line1: e.target.value }))} /></div>
                    <div className="sm:col-span-2"><label className={labelCls}>Address Line 2</label>
                      <input className={inputCls} placeholder="Flat / Suite (optional)" value={addrForm.line2} onChange={e => setAddrForm(p => ({ ...p, line2: e.target.value }))} /></div>
                    <div><label className={labelCls}>City *</label>
                      <input className={inputCls} placeholder="London" value={addrForm.city} onChange={e => setAddrForm(p => ({ ...p, city: e.target.value }))} /></div>
                    <div><label className={labelCls}>County</label>
                      <input className={inputCls} placeholder="Greater London" value={addrForm.county} onChange={e => setAddrForm(p => ({ ...p, county: e.target.value }))} /></div>
                    <div><label className={labelCls}>Postcode *</label>
                      <input className={inputCls} placeholder="SW1A 1AA" value={addrForm.postcode} onChange={e => setAddrForm(p => ({ ...p, postcode: e.target.value }))} /></div>
                    <div><label className={labelCls}>Phone</label>
                      <input className={inputCls} placeholder="+44 7700 000000" value={addrForm.phone} onChange={e => setAddrForm(p => ({ ...p, phone: e.target.value }))} /></div>
                  </div>
                  <Button onClick={handleAddrSave} disabled={addrSaving} className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white px-8">
                    {addrSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : <><Save className="w-4 h-4 mr-2" />Save Address</>}
                  </Button>
                </div>
              </div>
            )}

            {/* ── SECURITY ── */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Change Password</h2>
                <div className="rp-card p-6 space-y-5">
                  <p className="text-sm text-[#64748B]">Leave blank if you signed in with Google.</p>
                  <div>
                    <label className={labelCls}>Current Password</label>
                    <div className="relative">
                      <input type={showCurrent ? 'text' : 'password'} className={inputCls + ' pr-12'} placeholder="••••••••"
                        value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} />
                      <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]">
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>New Password</label>
                    <div className="relative">
                      <input type={showNew ? 'text' : 'password'} className={inputCls + ' pr-12'} placeholder="Min 8 characters"
                        value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} />
                      <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Confirm New Password</label>
                    <input type="password" className={inputCls} placeholder="Repeat new password"
                      value={pwForm.confirmPassword} onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} />
                  </div>
                  <Button onClick={handlePasswordChange} disabled={pwSaving} className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white px-8">
                    {pwSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating…</> : <><Lock className="w-4 h-4 mr-2" />Change Password</>}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── ORDER DETAILS MODAL ── */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-2xl"
            >
              <div className="p-6 md:p-8">
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#0F172A]">Order Details</h3>
                    <p className="text-sm text-[#64748B] font-mono mt-0.5">#{selectedOrder.orderNumber}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status + Date */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}{getStatusLabel(selectedOrder.status)}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-[#64748B]">
                    <Clock className="w-4 h-4" />
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">Items Ordered</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex-1">
                          <p className="text-[#0F172A] font-medium">{item.productName ?? item.product?.name ?? 'Item'}</p>
                          <p className="text-xs text-[#64748B] mt-0.5">Qty: {item.quantity}</p>
                          {item.options && Object.keys(item.options).length > 0 && (
                            <p className="text-xs text-[#64748B] mt-0.5">
                              {Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className="text-[#0F172A] font-semibold">
                            £{item.unitPrice ? (item.unitPrice * item.quantity / 100).toFixed(2) : '—'}
                          </span>
                          {item.artworkUrl && (
                            <a href={item.artworkUrl} download target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B6CFF]/15 border border-[#3B6CFF]/30 text-[#3B6CFF] hover:bg-[#3B6CFF] hover:text-white transition-all text-xs font-medium">
                              <Download className="w-3.5 h-3.5" />Download
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">Shipping Address</h4>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      {selectedOrder.shippingAddress.fullName && <p className="text-[#0F172A] font-medium">{selectedOrder.shippingAddress.fullName}</p>}
                      <p className="text-[#64748B] text-sm mt-1">
                        {selectedOrder.shippingAddress.line1}{selectedOrder.shippingAddress.line2 ? `, ${selectedOrder.shippingAddress.line2}` : ''}<br />
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postcode}
                        {selectedOrder.shippingAddress.country ? `, ${selectedOrder.shippingAddress.country}` : ''}
                      </p>
                      {selectedOrder.shippingAddress.phone && <p className="text-xs text-[#64748B] mt-1">📞 {selectedOrder.shippingAddress.phone}</p>}
                    </div>
                  </div>
                )}

                {/* Tracking */}
                {selectedOrder.trackingNumber && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">Tracking</h4>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <Truck className="w-5 h-5 text-[#3B6CFF]" />
                      <span className="text-[#0F172A] font-mono">{selectedOrder.trackingNumber}</span>
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="border-t border-slate-200 pt-5 space-y-2">
                  {selectedOrder.subtotal !== undefined && (
                    <div className="flex justify-between text-sm text-[#64748B]">
                      <span>Subtotal</span><span className="font-medium text-[#0F172A]">£{(selectedOrder.subtotal / 100).toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.shippingCost !== undefined && (
                    <div className="flex justify-between text-sm text-[#64748B]">
                      <span>Shipping</span><span className="font-medium text-[#0F172A]">{selectedOrder.shippingCost === 0 ? 'Free' : `£${(selectedOrder.shippingCost / 100).toFixed(2)}`}</span>
                    </div>
                  )}
                  {selectedOrder.tax !== undefined && (
                    <div className="flex justify-between text-sm text-[#64748B]">
                      <span>VAT (20%)</span><span className="font-medium text-[#0F172A]">£{(selectedOrder.tax / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                    <span className="text-[#0F172A]">Total</span>
                    <span className="text-[#3B6CFF]">£{(selectedOrder.totalAmount / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={() => setSelectedOrder(null)} variant="outline" className="flex-1 border-slate-300 text-[#0F172A] hover:bg-slate-50">Close</Button>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 flex-1 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors text-sm font-medium">
                    <MessageCircle className="w-4 h-4" />Need Help?
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


