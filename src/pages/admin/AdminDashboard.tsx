import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  Loader2,
  TrendingUp,
  LayoutDashboard,
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
  ResponsiveContainer,
  Area,
  AreaChart,
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
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #EEF2FF 100%)' }}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 text-[#3B6CFF] animate-spin" />
        <p className="text-sm text-[#64748B] font-medium">Loading dashboard…</p>
      </div>
    </div>
  );

  const statCards = [
    { title: 'Total Revenue',  value: `£${((stats?.totalRevenue ?? 0) / 100).toFixed(2)}`, icon: DollarSign, color: 'from-blue-500 to-blue-600',   bg: 'bg-blue-50',  iconColor: 'text-blue-600' },
    { title: 'Total Orders',   value: String(stats?.totalOrders ?? 0),   icon: ShoppingBag, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', iconColor: 'text-violet-600' },
    { title: 'Total Products', value: String(stats?.totalProducts ?? 0), icon: Package,    color: 'from-amber-500 to-orange-500',  bg: 'bg-amber-50',  iconColor: 'text-amber-600' },
    { title: 'Total Users',    value: String(stats?.totalUsers ?? 0),    icon: Users,      color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50',iconColor: 'text-emerald-600' },
  ];
  const recentOrders = stats?.recentOrders ?? [];
  const chartData = [
    { name: 'Mon', revenue: 0 }, { name: 'Tue', revenue: 0 },
    { name: 'Wed', revenue: 0 }, { name: 'Thu', revenue: 0 },
    { name: 'Fri', revenue: 0 }, { name: 'Sat', revenue: 0 }, { name: 'Sun', revenue: 0 },
  ];
  
  return (
    <div className="min-h-screen pt-32 pb-20 relative" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #EEF2FF 100%)' }}>
      {/* Dot grid background pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3B6CFF 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.04 }} />

      <div className="rp-container max-w-7xl relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#3B6CFF] flex items-center justify-center shadow-md shadow-blue-200">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold text-[#3B6CFF] uppercase tracking-widest">Admin Panel</span>
          </div>
          <h1 className="text-4xl font-bold text-[#0F172A] mt-3">Dashboard</h1>
          <p className="text-[#64748B] mt-1 text-sm">Welcome back — here's what's happening with RayPrint today.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-[#0F172A]">{stat.value}</p>
              <p className="text-sm text-[#64748B] mt-0.5">{stat.title}</p>
            </div>
          ))}
        </motion.div>
        
        {/* Chart & Recent Orders */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">Revenue Overview</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Weekly revenue trend</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">This Week</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B6CFF" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3B6CFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.07)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `£${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 16px rgba(15,23,42,0.08)' }}
                    labelStyle={{ color: '#0F172A', fontWeight: 600 }}
                    formatter={(value: number) => [`£${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3B6CFF" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: '#3B6CFF', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#3B6CFF' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#0F172A]">Recent Orders</h2>
              <Link to="/admin/orders" className="text-xs font-medium text-[#3B6CFF] hover:underline bg-blue-50 px-3 py-1 rounded-full">View all</Link>
            </div>
            <div className="space-y-3">
              {recentOrders.length === 0 && (
                <p className="text-sm text-[#94a3b8] text-center py-8">No orders yet</p>
              )}
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-100 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{order.orderNumber}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#0F172A]">£{(order.totalAmount / 100).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'dispatched' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-semibold text-[#0F172A] mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/orders">
              <Button className="bg-[#3B6CFF] hover:bg-[#2a5aee] text-white shadow-sm shadow-blue-200">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Manage Orders
              </Button>
            </Link>
            <Link to="/admin/products">
              <Button variant="outline" className="border-slate-200 text-[#0F172A] hover:bg-slate-50">
                <Package className="w-4 h-4 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link to="/admin/customers">
              <Button variant="outline" className="border-slate-200 text-[#0F172A] hover:bg-slate-50">
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
