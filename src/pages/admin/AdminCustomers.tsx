import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  ShoppingBag,
  ChevronLeft, 
  ChevronRight,
  Users,
  Eye
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Input } from '@/components/ui/input';

const customers = [
  { id: '1', name: 'John Smith', email: 'john@example.com', orders: 5, total: 1250.00, joined: '2023-06-15' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', orders: 12, total: 3450.00, joined: '2023-03-22' },
  { id: '3', name: 'Mike Brown', email: 'mike@example.com', orders: 3, total: 450.00, joined: '2024-01-08' },
  { id: '4', name: 'Emma Wilson', email: 'emma@example.com', orders: 8, total: 2100.00, joined: '2023-09-10' },
  { id: '5', name: 'David Lee', email: 'david@example.com', orders: 2, total: 320.00, joined: '2024-02-01' },
  { id: '6', name: 'Lisa Chen', email: 'lisa@example.com', orders: 15, total: 5600.00, joined: '2022-11-20' },
];

export function AdminCustomers() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  if (!isAuthenticated || !isAdmin) {
    return null;
  }
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
          className="grid sm:grid-cols-3 gap-6 mb-8"
        >
          <div className="rp-card p-6">
            <Users className="w-8 h-8 text-[#3B6CFF] mb-4" />
            <p className="text-3xl font-bold text-[#F6F8FF]">1,234</p>
            <p className="text-sm text-[#A6B0C5]">Total Customers</p>
          </div>
          <div className="rp-card p-6">
            <ShoppingBag className="w-8 h-8 text-[#3B6CFF] mb-4" />
            <p className="text-3xl font-bold text-[#F6F8FF]">3,456</p>
            <p className="text-sm text-[#A6B0C5]">Total Orders</p>
          </div>
          <div className="rp-card p-6">
            <p className="text-3xl font-bold text-[#F6F8FF]">£156K</p>
            <p className="text-sm text-[#A6B0C5]">Total Revenue</p>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(246,248,255,0.08)]">
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Joined</th>
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Orders</th>
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Total Spent</th>
                  <th className="text-left p-4 text-sm font-medium text-[#A6B0C5]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-[rgba(246,248,255,0.04)] hover:bg-[rgba(246,248,255,0.02)]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[rgba(59,108,255,0.2)] flex items-center justify-center">
                          <span className="text-sm font-medium text-[#3B6CFF]">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#F6F8FF]">{customer.name}</p>
                          <p className="text-xs text-[#A6B0C5]">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-[#A6B0C5]">
                        {new Date(customer.joined).toLocaleDateString('en-GB')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-[#F6F8FF]">{customer.orders}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-[#F6F8FF]">£{customer.total.toFixed(2)}</span>
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
