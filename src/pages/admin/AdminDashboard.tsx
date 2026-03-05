import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  pendingArtwork: number;
  totalRevenue: number;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    user?: { firstName: string; lastName: string };
    totalAmount: number;
    status: string;
  }>;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, token } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) { navigate('/login'); return; }
    fetch(`${BACKEND_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); })
      .finally(() => setLoading(false));
  }, [isAuthenticated, isAdmin, token, navigate]);

  if (!isAuthenticated || !isAdmin) return null;
  if (loading) return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#3B6CFF] animate-spin" />
    </div>
  );

  const statCards = [
    { title: 'Total Revenue', value: `£${((stats?.totalRevenue ?? 0) / 100).toFixed(2)}`, icon: DollarSign },
    { title: 'Total Orders', value: String(stats?.totalOrders ?? 0), icon: ShoppingBag },
    { title: 'Total Products', value: String(stats?.totalProducts ?? 0), icon: Package },
    { title: 'Total Users', value: String(stats?.totalUsers ?? 0), icon: Users },
  ];
  const recentOrders = stats?.recentOrders ?? [];
  // Placeholder chart data — replace with real analytics when available
  const chartData = [
    { name: 'Mon', revenue: 0 }, { name: 'Tue', revenue: 0 },
    { name: 'Wed', revenue: 0 }, { name: 'Thu', revenue: 0 },
    { name: 'Fri', revenue: 0 }, { name: 'Sat', revenue: 0 }, { name: 'Sun', revenue: 0 },
  ];
  
  return (
    <div className="min-h-screen bg-[#0B0F17] pt-32 pb-20">
      <div className="rp-container max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <span className="rp-micro-label block mb-4">ADMIN PANEL</span>
          <h1 className="text-4xl font-bold text-[#F6F8FF]">Dashboard</h1>
        </motion.div>
        
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <div key={index} className="rp-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[rgba(59,108,255,0.2)] flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[#3B6CFF]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#F6F8FF]">{stat.value}</p>
              <p className="text-sm text-[#A6B0C5]">{stat.title}</p>
            </div>
          ))}
        </motion.div>
        
        {/* Chart & Recent Orders */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 rp-card p-6"
          >
            <h2 className="text-lg font-semibold text-[#F6F8FF] mb-6">Revenue Overview</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(246,248,255,0.08)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#A6B0C5" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#A6B0C5" 
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `£${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0B0F17', 
                      border: '1px solid rgba(246,248,255,0.1)',
                      borderRadius: '12px',
                    }}
                    formatter={(value: number) => [`£${value}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B6CFF" 
                    strokeWidth={2}
                    dot={{ fill: '#3B6CFF', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rp-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#F6F8FF]">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-[#3B6CFF] hover:underline">
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentOrders.length === 0 && (
                <p className="text-sm text-[#A6B0C5] text-center py-4">No orders yet</p>
              )}
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 rounded-xl bg-[rgba(246,248,255,0.04)]">
                  <div>
                    <p className="text-sm font-medium text-[#F6F8FF]">{order.orderNumber}</p>
                    <p className="text-xs text-[#A6B0C5]">
                      {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#F6F8FF]">£{(order.totalAmount / 100).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'shipped' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-[#3B6CFF]/20 text-[#3B6CFF]'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold text-[#F6F8FF] mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/orders">
              <Button className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Manage Orders
              </Button>
            </Link>
            <Link to="/admin/products">
              <Button variant="outline" className="border-[rgba(246,248,255,0.20)] text-[#F6F8FF]">
                <Package className="w-4 h-4 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link to="/admin/customers">
              <Button variant="outline" className="border-[rgba(246,248,255,0.20)] text-[#F6F8FF]">
                <Users className="w-4 h-4 mr-2" />
                View Customers
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
