import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import API from '../utils/api';
import { FileDown, FileSpreadsheet, Trash2, Search, Filter, AlertCircle, FileText } from 'lucide-react';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://truthlens-ai-a68q.onrender.com/api/v1';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [minCredibility, setMinCredibility] = useState('');

  const fetchReports = async () => {
    try {
      let url = '/reports/list?';
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (category) url += `category=${encodeURIComponent(category)}&`;
      if (sentiment) url += `sentiment=${encodeURIComponent(sentiment)}&`;
      if (minCredibility) url += `min_credibility=${minCredibility}&`;
      
      const res = await API.get(url);
      setReports(res.data);
    } catch (err) {
      console.error('Failed to load saved reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsUser(true);
      fetchReports();
    } else {
      setLoading(false);
    }
  }, [search, category, sentiment, minCredibility]);

  const handleDelete = async (reportId) => {
    if (!confirm('Are you sure you want to remove this saved report bookmark?')) return;
    try {
      await API.delete(`/reports/delete/${reportId}`);
      setReports(reports.filter(r => r.id !== reportId));
    } catch (err) {
      alert('Error deleting saved report.');
    }
  };

  if (!isUser) {
    return (
      <Layout>
        <div className="max-w-md mx-auto my-20 p-8 glass-card text-center space-y-4">
          <FileText size={48} className="mx-auto text-violet-500 opacity-40 animate-pulse" />
          <h2 className="text-xl font-bold">Authentication Required</h2>
          <p className="text-sm text-slate-500">
            Please register or sign in to your developer profile to bookmarks analyses, save reports, and download documents.
          </p>
          <div className="pt-4 flex justify-center space-x-3">
            <Link href="/login" className="px-5 py-2.5 rounded-xl border border-border-light dark:border-border-dark text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-semibold shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 transition-all">
              Sign Up Free
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center space-x-3">
            <FileText className="text-violet-500" size={28} />
            <span>Saved Reports & Archive</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access previous media scans, filter records, and export files as PDF or Excel spreadsheets.
          </p>
        </div>

        {/* Filter bar */}
        <div className="glass-card p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Search</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Keywords, headings..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:border-violet-500 transition-colors text-xs"
              />
              <Search className="absolute left-3.5 top-3 text-slate-400" size={14} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-transparent dark:bg-slate-900 focus:outline-none focus:border-violet-500 transition-colors text-xs"
            >
              <option value="">All Categories</option>
              {['Politics', 'Technology', 'Sports', 'Health', 'Finance', 'Entertainment', 'World News'].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Sentiment</label>
            <select
              value={sentiment}
              onChange={(e) => setSentiment(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-transparent dark:bg-slate-900 focus:outline-none focus:border-violet-500 transition-colors text-xs"
            >
              <option value="">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Min Credibility</label>
            <input
              type="number"
              min="0"
              max="100"
              value={minCredibility}
              onChange={(e) => setMinCredibility(e.target.value)}
              placeholder="e.g. 50"
              className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:border-violet-500 transition-colors text-xs"
            />
          </div>

          <button
            onClick={() => { setSearch(''); setCategory(''); setSentiment(''); setMinCredibility(''); }}
            className="py-2.5 rounded-xl border border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-900 font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
          >
            <Filter size={14} />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Saved list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500">Querying database indexes...</p>
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="glass-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 pr-2 line-clamp-1">{report.title}</h3>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                      title="Delete Bookmark"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Bookmarked on: {new Date(report.created_at).toLocaleDateString()}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-400 mt-3 italic line-clamp-2">"{report.notes}"</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-6">
                  <a
                    href={`${apiBase}/reports/export/${report.article_id}/pdf`}
                    className="py-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-900 text-[10px] font-semibold text-center transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <FileDown size={12} />
                    <span>PDF Document</span>
                  </a>
                  <a
                    href={`${apiBase}/reports/export/${report.article_id}/excel`}
                    className="py-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-900 text-[10px] font-semibold text-center transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <FileSpreadsheet size={12} />
                    <span>Excel Sheet</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center min-h-[30vh]">
            <AlertCircle size={40} className="opacity-25 text-violet-500" />
            <h3 className="mt-4 font-bold text-slate-700 dark:text-slate-300">No Archives Found</h3>
            <p className="mt-2 text-xs max-w-xs leading-relaxed">
              We couldn't find any saved reports matching your parameters. Navigate to the Fake News Detector to audit articles.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
