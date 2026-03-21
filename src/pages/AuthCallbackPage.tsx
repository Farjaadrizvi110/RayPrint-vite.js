import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

/** Decode a JWT payload without verifying the signature (verification happens on the server). */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  useEffect(() => {
    // With HashRouter the URL is /#/auth/callback?token=JWT
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      toast.error('Google sign-in failed — no token received.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Decode the JWT payload directly — no extra API call needed.
    // The backend now embeds firstName, lastName, avatar in the token.
    const payload = decodeJwtPayload(token);
    if (!payload || !payload.email) {
      setStatus('error');
      toast.error('Google sign-in failed — could not read token.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    loginWithToken(token, {
      id: (payload.id as string) ?? '',
      email: payload.email as string,
      firstName: (payload.firstName as string) ?? '',
      lastName: (payload.lastName as string) ?? '',
      role: (payload.role as 'customer' | 'admin') ?? 'customer',
      addresses: [],
      createdAt: new Date(),
      avatar: (payload.avatar as string) ?? undefined,
    });
    toast.success(`Welcome, ${payload.firstName || 'back'}! 🎉`);
    navigate('/account');
  }, [loginWithToken, navigate, location.search]);

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

