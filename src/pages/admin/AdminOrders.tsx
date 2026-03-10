import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ChevronDown,
  ChevronUp,
  Package,
  MapPin,
  FileImage,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  options?: Record<string, string>;
  artworkUrl?: string;
}

interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
  phone?: string;
}

interface AdminOrder {
  _id: string;
  orderNumber: string;
  user?: { firstName: string; lastName: string; email: string };
  createdAt: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  trackingNumber?: string;
  adminNotes?: string;
}

const statusColors: Record<string, string> = {
  pending:          'bg-yellow-500/20 text-yellow-400',
  payment_received: 'bg-blue-500/20 text-blue-400',
  artwork_review:   'bg-orange-500/20 text-orange-400',
  in_production:    'bg-[#3B6CFF]/20 text-[#3B6CFF]',
  dispatched:       'bg-purple-500/20 text-purple-400',
  delivered:        'bg-green-500/20 text-green-400',
  cancelled:        'bg-red-500/20 text-red-400',
  refunded:         'bg-pink-500/20 text-pink-400',
};

async function downloadFile(url: string, filename: string) {
  try {
    // Fetch the file as a blob so the browser downloads it
    // (the HTML download attribute is ignored for cross-origin URLs)
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    // Fallback: open in new tab if fetch/CORS fails
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function AdminOrders() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, token } = useAuthStore();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) { navigate('/login'); return; }
    fetch(`${BACKEND_URL}/api/orders/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { if (d.success) setOrders(d.data); })
      .finally(() => setLoading(false));
  }, [isAuthenticated, isAdmin, token, navigate]);

  if (!isAuthenticated || !isAdmin) return null;

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        toast.success('Order status updated');
      } else {
        toast.error(data.message ?? 'Failed to update status');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id: string) =>
    setExpandedId(prev => (prev === id ? null : id));

  const filteredOrders = orders.filter(order => {
    const customerName = order.user ? `${order.user.firstName} ${order.user.lastName}` : '';
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.email ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="min-h-screen bg-[#0B0F17] pt-32 pb-20">
      <div className="rp-container max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <Link to="/admin" className="text-sm text-[#A6B0C5] hover:text-[#F6F8FF] mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-[#F6F8FF]">Orders</h1>
          </div>
          <Button className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </motion.div>
        
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6B0C5]" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-12 bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-[rgba(246,248,255,0.06)] border border-[rgba(246,248,255,0.10)] text-[#F6F8FF]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="payment_received">Payment Received</option>
            <option value="artwork_review">Artwork Review</option>
            <option value="in_production">In Production</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </motion.div>
        
        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rp-card overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-[#3B6CFF] animate-spin" />
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(246,248,255,0.08)]">
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Order ID</th>
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Items</th>
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Total</th>
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Update</th>
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 && (
                  <tr><td colSpan={8} className="p-8 text-center text-[#A6B0C5]">No orders found</td></tr>
                )}
                {filteredOrders.map((order) => (
                  <>
                  <tr key={order._id} className="border-b border-[rgba(246,248,255,0.04)] hover:bg-[rgba(246,248,255,0.02)]">
                    <td className="p-4">
                      <span className="text-sm font-medium text-[#F6F8FF]">{order.orderNumber}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-[#F6F8FF]">
                          {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest'}
                        </p>
                        <p className="text-xs text-[#A6B0C5]">{order.user?.email ?? ''}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-[#A6B0C5]">
                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-[#A6B0C5]">{order.items.length}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-[#F6F8FF]">£{(order.totalAmount / 100).toFixed(2)}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] ?? ''}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      {updatingId === order._id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#3B6CFF]" />
                      ) : (
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order._id, e.target.value)}
                          className="text-xs px-2 py-1 rounded-lg bg-[rgba(246,248,255,0.06)] border border-[rgba(246,248,255,0.10)] text-[#F6F8FF]"
                        >
                          <option value="pending">Pending</option>
                          <option value="payment_received">Payment Received</option>
                          <option value="artwork_review">Artwork Review</option>
                          <option value="in_production">In Production</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleExpand(order._id)}
                        className="flex items-center gap-1 text-xs text-[#3B6CFF] hover:text-[#5a85ff] transition-colors"
                      >
                        {expandedId === order._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {expandedId === order._id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>

                  {/* ── Expanded detail row ── */}
                  <AnimatePresence>
                  {expandedId === order._id && (
                    <tr key={`${order._id}-detail`}>
                      <td colSpan={8} className="bg-[rgba(59,108,255,0.04)] border-b border-[rgba(246,248,255,0.06)]">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-6 grid md:grid-cols-2 gap-6 overflow-hidden"
                        >
                          {/* Items + Design Downloads */}
                          <div>
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-[#F6F8FF] mb-3">
                              <Package className="w-4 h-4 text-[#3B6CFF]" /> Order Items
                            </h4>
                            <div className="space-y-3">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="p-3 rounded-lg bg-[rgba(246,248,255,0.04)] border border-[rgba(246,248,255,0.06)]">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-[#F6F8FF]">{item.productName}</p>
                                      <p className="text-xs text-[#A6B0C5] mt-0.5">
                                        Qty: {item.quantity} &nbsp;·&nbsp; £{(item.unitPrice / 100).toFixed(2)} each
                                      </p>
                                      {item.options && Object.keys(item.options).length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {Object.entries(item.options).map(([k, v]) => (
                                            <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-[rgba(59,108,255,0.15)] text-[#3B6CFF]">
                                              {k}: {v}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    {/* Design Download */}
                                    {item.artworkUrl ? (
                                      <button
                                        onClick={() => downloadFile(item.artworkUrl!, `design-${order.orderNumber}-item${idx + 1}`)}
                                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#3B6CFF] hover:bg-[#2a5aee] text-white transition-colors flex-shrink-0"
                                      >
                                        <FileImage className="w-3.5 h-3.5" />
                                        Download Design
                                      </button>
                                    ) : (
                                      <span className="text-xs text-[#A6B0C5] flex-shrink-0 italic">No artwork</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Totals */}
                            <div className="mt-4 p-3 rounded-lg bg-[rgba(246,248,255,0.04)] space-y-1 text-xs text-[#A6B0C5]">
                              <div className="flex justify-between"><span>Subtotal</span><span>£{(order.subtotal / 100).toFixed(2)}</span></div>
                              <div className="flex justify-between"><span>Shipping</span><span>£{(order.shippingCost / 100).toFixed(2)}</span></div>
                              <div className="flex justify-between"><span>VAT (20%)</span><span>£{(order.tax / 100).toFixed(2)}</span></div>
                              <div className="flex justify-between font-semibold text-[#F6F8FF] pt-1 border-t border-[rgba(246,248,255,0.08)]">
                                <span>Total</span><span>£{(order.totalAmount / 100).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-[#F6F8FF] mb-3">
                              <MapPin className="w-4 h-4 text-[#3B6CFF]" /> Shipping Address
                            </h4>
                            {order.shippingAddress ? (
                              <div className="p-3 rounded-lg bg-[rgba(246,248,255,0.04)] border border-[rgba(246,248,255,0.06)] text-sm text-[#A6B0C5] space-y-0.5">
                                <p className="text-[#F6F8FF] font-medium">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.line1}</p>
                                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                                <p>{order.shippingAddress.city}{order.shippingAddress.county ? `, ${order.shippingAddress.county}` : ''}</p>
                                <p>{order.shippingAddress.postcode}, {order.shippingAddress.country}</p>
                                {order.shippingAddress.phone && <p className="pt-1">📞 {order.shippingAddress.phone}</p>}
                              </div>
                            ) : (
                              <p className="text-xs text-[#A6B0C5] italic">No address on record</p>
                            )}

                            {order.trackingNumber && (
                              <div className="mt-3 p-3 rounded-lg bg-[rgba(246,248,255,0.04)] text-sm">
                                <span className="text-[#A6B0C5]">Tracking: </span>
                                <span className="text-[#F6F8FF] font-mono">{order.trackingNumber}</span>
                              </div>
                            )}
                            {order.adminNotes && (
                              <div className="mt-3 p-3 rounded-lg bg-[rgba(246,248,255,0.04)] text-sm">
                                <p className="text-[#A6B0C5] text-xs mb-1">Admin Notes</p>
                                <p className="text-[#F6F8FF]">{order.adminNotes}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                  </AnimatePresence>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-[rgba(246,248,255,0.08)]">
            <p className="text-sm text-[#A6B0C5]">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-[rgba(246,248,255,0.06)] text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-[rgba(246,248,255,0.06)] text-[#A6B0C5] hover:text-[#F6F8FF] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
