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
            <h1 className="text-4xl font-bold text-[#F6F8FF]">Customers</h1>
          </div>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid sm:grid-cols-2 gap-6 mb-8"
        >
          <div className="rp-card p-6">
            <Users className="w-8 h-8 text-[#3B6CFF] mb-4" />
            <p className="text-3xl font-bold text-[#F6F8FF]">{customers.length}</p>
            <p className="text-sm text-[#A6B0C5]">Total Customers</p>
          </div>
          <div className="rp-card p-6">
            <ShoppingBag className="w-8 h-8 text-[#3B6CFF] mb-4" />
            <p className="text-3xl font-bold text-[#F6F8FF]">
              {customers.reduce((s, c) => s + (c.orderCount ?? 0), 0)}
            </p>
            <p className="text-sm text-[#A6B0C5]">Total Orders</p>
          </div>
        </motion.div>
        
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6B0C5]" />
            <Input 
              placeholder="Search customers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-12 bg-[rgba(246,248,255,0.06)] border-[rgba(246,248,255,0.10)] text-[#F6F8FF]"
            />
          </div>
        </motion.div>
        
        {/* Customers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Joined</th>
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 && (
                  <tr><td colSpan={3} className="p-8 text-center text-[#A6B0C5]">No customers found</td></tr>
                )}
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="border-b border-[rgba(246,248,255,0.04)] hover:bg-[rgba(246,248,255,0.02)]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[rgba(59,108,255,0.2)] flex items-center justify-center">
                          <span className="text-sm font-medium text-[#3B6CFF]">
                            {customer.firstName[0]}{customer.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#F6F8FF]">{customer.firstName} {customer.lastName}</p>
                          <p className="text-xs text-[#A6B0C5]">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-[#A6B0C5]">
                        {new Date(customer.createdAt).toLocaleDateString('en-GB')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        customer.role === 'admin' ? 'bg-[#3B6CFF]/20 text-[#3B6CFF]' : 'bg-[rgba(246,248,255,0.06)] text-[#A6B0C5]'
                      }`}>{customer.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-[rgba(246,248,255,0.08)]">
            <p className="text-sm text-[#A6B0C5]">
              Showing {filteredCustomers.length} of {customers.length} customers
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
