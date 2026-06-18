import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import API from '../utils/api';
import { User, Shield, Calendar, Mail, History, ShieldAlert, CheckCircle } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const profileRes = await API.get('/auth/me');
        setProfile(profileRes.data);

        const historyRes = await API.get('/news/history');
        setHistory(historyRes.data);
      } catch (err) {
        console.error('Failed to load profile details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500">Querying user audit logs...</p>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="max-w-md mx-auto my-20 p-8 glass-card text-center space-y-4">
          <User size={48} className="mx-auto text-violet-500 opacity-40 animate-pulse" />
          <h2 className="text-xl font-bold">Profile Unavailable</h2>
          <p className="text-sm text-slate-500">
            Please register or sign in to access your developer profile and activity logs.
          </p>
          <div className="pt-4">
            <Link href="/login" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-semibold shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 transition-all">
              Sign In Now
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* User Banner */}
        <div className="glass-card p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-violet-500/20 uppercase shrink-0">
            {profile.username[0]}
          </div>
          <div className="text-center sm:text-left space-y-2 flex-grow">
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span className="flex items-center space-x-1.5">
                <Mail size={14} className="text-violet-500" />
                <span>{profile.email}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Shield size={14} className="text-violet-500" />
                <span className="uppercase tracking-wider">Role: {profile.role}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Calendar size={14} className="text-violet-500" />
                <span>Joined: {new Date(profile.date_joined).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Audit History Logs */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold flex items-center space-x-2 border-b border-border-light dark:border-border-dark pb-3">
            <History size={18} className="text-violet-500" />
            <span>Verification Activity History Logs</span>
          </h2>

          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border-light dark:border-border-dark text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-semibold">Headline</th>
                    <th className="pb-3 font-semibold">Classification</th>
                    <th className="pb-3 font-semibold">Credibility Index</th>
                    <th className="pb-3 font-semibold">Date Analyzed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light/50 dark:divide-border-dark/50">
                  {history.map((row) => (
                    <tr key={row.article_id} className="hover:bg-slate-100/30 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="py-4 font-bold max-w-sm truncate pr-4 text-slate-800 dark:text-slate-200" title={row.title}>
                        {row.title}
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center space-x-1 w-fit ${
                          row.classification.includes('Real') 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/15' 
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/15'
                        }`}>
                          <ShieldAlert size={10} />
                          <span>{row.classification}</span>
                        </span>
                      </td>
                      <td className="py-4 font-bold text-violet-500 dark:text-violet-400">{row.credibility_score}/100</td>
                      <td className="py-4 text-slate-500">{new Date(row.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center">
              <History size={36} className="opacity-20 text-violet-500 mb-2" />
              <p className="text-sm font-semibold">No recent activity found</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">Audit reports will show here after verification runs.</p>
              <Link href="/detector" className="mt-4 px-4 py-2 rounded-xl bg-violet-600 text-white font-semibold text-xs shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 transition-all">
                Audit an Article
              </Link>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
