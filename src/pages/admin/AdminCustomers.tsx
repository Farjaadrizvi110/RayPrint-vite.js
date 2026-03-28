import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Users,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Input } from '@/components/ui/input';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  orderCount?: number;
  totalSpent?: number;
}

export function AdminCustomers() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, token } = useAuthStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) { navigate('/login'); return; }
    fetch(`${BACKEND_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { if (d.success) setCustomers(d.data); })
      .finally(() => setLoading(false));
  }, [isAuthenticated, isAdmin, token, navigate]);

  if (!isAuthenticated || !isAdmin) return null;

  const filteredCustomers = customers.filter(customer => {
    const name = `${customer.firstName} ${customer.lastName}`;
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  return (
    <div className="min-h-screen pt-32 pb-20 relative" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #EEF2FF 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3B6CFF 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.04 }} />
      <div className="rp-container max-w-7xl relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/admin" className="text-sm text-[#64748B] hover:text-[#3B6CFF] mb-2 inline-block transition-colors">← Back to Dashboard</Link>
            <h1 className="text-4xl font-bold text-[#0F172A]">Customers</h1>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid sm:grid-cols-2 gap-5 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-[#0F172A]">{customers.length}</p>
            <p className="text-sm text-[#64748B] mt-0.5">Total Customers</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
              <ShoppingBag className="w-5 h-5 text-violet-600" />
            </div>
            <p className="text-3xl font-bold text-[#0F172A]">{customers.reduce((s, c) => s + (c.orderCount ?? 0), 0)}</p>
            <p className="text-sm text-[#64748B] mt-0.5">Total Orders</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-5">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
            <Input placeholder="Search customers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 bg-white border-slate-200 text-[#0F172A] placeholder-slate-400 focus:border-[#3B6CFF]" />
          </div>
        </motion.div>

        {/* Customers Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-[#3B6CFF] animate-spin" />
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left p-4 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Customer</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Joined</th>
                  <th className="text-left p-4 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 && (
                  <tr><td colSpan={3} className="p-10 text-center text-[#94a3b8]">No customers found</td></tr>
                )}
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                          <span className="text-sm font-semibold text-white">{customer.firstName[0]}{customer.lastName[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0F172A]">{customer.firstName} {customer.lastName}</p>
                          <p className="text-xs text-[#64748B]">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><span className="text-sm text-[#64748B]">{new Date(customer.createdAt).toLocaleDateString('en-GB')}</span></td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${
                        customer.role === 'admin' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>{customer.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
            <p className="text-sm text-[#64748B]">Showing <span className="font-semibold text-[#0F172A]">{filteredCustomers.length}</span> of {customers.length} customers</p>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white border border-slate-200 text-[#64748B] hover:text-[#3B6CFF] hover:border-blue-200 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-2 rounded-lg bg-white border border-slate-200 text-[#64748B] hover:text-[#3B6CFF] hover:border-blue-200 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
