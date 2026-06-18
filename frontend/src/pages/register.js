import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import API from '../utils/api';
import { ShieldAlert, UserPlus, AlertCircle, Check } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/auth/register', formData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try a different username/email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute top-1/3 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[80px] animate-pulse-glow"></div>
        <div className="max-w-md w-full space-y-8 glass-card p-10">
          <div className="text-center">
            <span className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/20">
              <ShieldAlert size={28} />
            </span>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight">Create Account</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Unlock unlimited audits, reports export & trends
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start space-x-3 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center space-x-3 text-sm">
              <Check size={18} className="shrink-0" />
              <span>Registration successful! Redirecting to login...</span>
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Username</label>
                <input
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="mukeshp"
                  className="w-full px-4 py-3.5 rounded-xl border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:border-violet-500 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="mukesh@example.com"
                  className="w-full px-4 py-3.5 rounded-xl border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:border-violet-500 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-xl border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:border-violet-500 transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-violet-500/10 hover:shadow-violet-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Sign Up Free'}</span>
              {!loading && <UserPlus size={16} />}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-violet-500 hover:text-violet-400 hover:underline">
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
