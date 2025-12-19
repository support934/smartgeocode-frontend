'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        // Activate premium if Stripe success
        if (sessionId) {
          await fetch('/api/set-premium', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
        }
        router.push('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Network error—try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <i className="fas fa-check-circle text-6xl text-red-500 mb-4"></i>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Subscription Success!</h1>
          <div className="bg-red-100 border border-red-200 rounded-full px-4 py-2 inline-block mb-4">
            <i className="fas fa-crown text-yellow-500 mr-2"></i>
            <span className="font-semibold text-red-800">Premium Unlocked</span>
          </div>
          <p className="text-gray-600">Log in to access your dashboard.</p>
        </div>
        {error && <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />
          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 disabled:opacity-50">
            {loading ? 'Logging in...' : 'Log In to Dashboard'}
          </button>
        </form>
        <p className="text-center mt-6">
          Forgot password? <a href="/forgot-password" className="text-red-600 underline">Reset here</a>
        </p>
      </div>
    </div>
  );
}

export default function Success() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}