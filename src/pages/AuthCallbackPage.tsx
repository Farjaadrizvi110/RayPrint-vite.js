import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  useEffect(() => {
    // With HashRouter the URL is /#/auth/callback?token=JWT
    // useLocation().search gives us '?token=JWT' correctly inside the hash
    console.log('[AuthCallback] location.search:', location.search);
    console.log('[AuthCallback] window.location.href:', window.location.href);
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    console.log('[AuthCallback] token present:', !!token);

    if (!token) {
      setStatus('error');
      toast.error('Google sign-in failed — no token in URL. Check browser console.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Fetch user profile from backend using the token
    console.log('[AuthCallback] Token found, calling /api/auth/me ...');
    fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          console.error('[AuthCallback] /api/auth/me failed:', res.status, errText);
          throw new Error(`HTTP ${res.status}: ${errText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('[AuthCallback] Profile fetched OK:', data);
        const user = data.data ?? data.user ?? data;
        loginWithToken(token, {
          id: user._id ?? user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role ?? 'customer',
          addresses: user.addresses ?? [],
          createdAt: new Date(user.createdAt ?? Date.now()),
          avatar: user.avatar,
        });
        toast.success(`Welcome, ${user.firstName}! 🎉`);
        navigate('/account');
      })
      .catch((err) => {
        console.error('[AuthCallback] Error:', err.message);
        setStatus('error');
        toast.error(`Google sign-in failed: ${err.message}`);
        setTimeout(() => navigate('/login'), 3000);
      });
  }, [loginWithToken, navigate]);

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {status === 'loading' ? (
          <>
            {/* Spinning logo */}
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3B6CFF] to-[#5a85ff] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#3B6CFF]/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <span className="text-3xl font-bold text-white">R</span>
            </motion.div>
            <h2 className="text-2xl font-bold text-[#F6F8FF] mb-2">Signing you in…</h2>
            <p className="text-[#A6B0C5]">Completing Google authentication</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-[#F6F8FF] mb-2">Sign-in failed</h2>
            <p className="text-[#A6B0C5]">Redirecting you back to login…</p>
          </>
        )}
      </motion.div>
    </div>
  );
}

