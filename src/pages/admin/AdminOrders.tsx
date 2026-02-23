import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Eye
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const orders = [
  { id: 'RP-2024-001', customer: 'John Smith', email: 'john@example.com', date: '2024-01-15', total: 125.00, status: 'delivered', items: 2 },
  { id: 'RP-2024-002', customer: 'Sarah Johnson', email: 'sarah@example.com', date: '2024-02-01', total: 350.00, status: 'in_production', items: 1 },
  { id: 'RP-2024-003', customer: 'Mike Brown', email: 'mike@example.com', date: '2024-02-05', total: 89.50, status: 'shipped', items: 3 },
  { id: 'RP-2024-004', customer: 'Emma Wilson', email: 'emma@example.com', date: '2024-02-08', total: 230.00, status: 'pending', items: 1 },
  { id: 'RP-2024-005', customer: 'David Lee', email: 'david@example.com', date: '2024-02-10', total: 450.00, status: 'in_production', items: 2 },
  { id: 'RP-2024-006', customer: 'Lisa Chen', email: 'lisa@example.com', date: '2024-02-12', total: 175.00, status: 'delivered', items: 4 },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  payment_confirmed: 'bg-blue-500/20 text-blue-400',
  in_production: 'bg-[#3B6CFF]/20 text-[#3B6CFF]',
  shipped: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

export function AdminOrders() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  if (!isAuthenticated || !isAdmin) {
    return null;
  }
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
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
            <option value="in_production">In Production</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </motion.div>
        
        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rp-card overflow-hidden"
        >
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
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[rgba(246,248,255,0.04)] hover:bg-[rgba(246,248,255,0.02)]">
                    <td className="p-4">
                      <span className="text-sm font-medium text-[#F6F8FF]">{order.id}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-[#F6F8FF]">{order.customer}</p>
                        <p className="text-xs text-[#A6B0C5]">{order.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-[#A6B0C5]">
                        {new Date(order.date).toLocaleDateString('en-GB')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-[#A6B0C5]">{order.items}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-[#F6F8FF]">£{order.total.toFixed(2)}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="p-2 text-[#A6B0C5] hover:text-[#3B6CFF] transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
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
