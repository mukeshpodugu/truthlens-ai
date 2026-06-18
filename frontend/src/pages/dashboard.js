import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../utils/api';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChart3, Database, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6366f1', '#ec4899'];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [perfData, setPerfData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const summaryRes = await API.get('/analytics/summary');
        const datasetRes = await API.get('/analytics/dataset-dashboard');
        
        setData(summaryRes.data);
        
        // Map model performance metrics into Recharts-friendly structure
        const models = datasetRes.data.model_performance;
        const mappedPerf = Object.entries(models).map(([name, metrics]) => ({
          name,
          accuracy: Math.round(metrics.accuracy * 1000) / 10,
          precision: Math.round(metrics.precision * 1000) / 10,
          recall: Math.round(metrics.recall * 1000) / 10,
          f1: Math.round(metrics.f1_score * 1000) / 10,
        }));
        setPerfData(mappedPerf);
      } catch (err) {
        console.error('Error fetching dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Compiling database logs & caching chart nodes...</p>
        </div>
      </Layout>
    );
  }

  const { total_analyzed, classification_distribution, category_distribution, sentiment_distribution, monthly_trends, credibility_trends } = data || {};

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page title */}
        <div>
          <h1 className="text-3xl font-extrabold flex items-center space-x-3">
            <BarChart3 className="text-violet-500" size={28} />
            <span>Platform Dashboard & Model Performance Analytics</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time visual monitoring of fake news spreads, classification category shares, and neural benchmarks.
          </p>
        </div>

        {/* Highlight widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 flex items-center space-x-4">
            <div className="p-3 bg-violet-500/10 text-violet-500 rounded-2xl h-fit"><Database size={24} /></div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Scanned</p>
              <p className="text-2xl font-extrabold mt-1">{total_analyzed}</p>
            </div>
          </div>
          
          <div className="glass-card p-6 flex items-center space-x-4">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl h-fit"><ShieldAlert size={24} /></div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Fake News Ratio</p>
              <p className="text-2xl font-extrabold mt-1">
                {total_analyzed > 0 
                  ? Math.round((classification_distribution.find(c => c.name.includes('Fake'))?.value || 0) / total_analyzed * 100) 
                  : 0}%
              </p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl h-fit"><Cpu size={24} /></div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Default Model</p>
              <p className="text-sm font-bold mt-1 text-indigo-400">BERT Transformer</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl h-fit"><Sparkles size={24} /></div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Avg Credibility Score</p>
              <p className="text-2xl font-extrabold mt-1">
                {credibility_trends.length > 0 
                  ? Math.round(credibility_trends.reduce((acc, c) => acc + c.score, 0) / credibility_trends.length) 
                  : 0}/100
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Monthly Analysis Line Chart */}
          <div className="glass-card p-6 lg:col-span-8">
            <h3 className="text-base font-bold mb-4">Misinformation Analysis Trends (6-Month Scale)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly_trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#f8fafc' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="real" name="Factual Articles" stroke="#10b981" fillOpacity={1} fill="url(#colorReal)" strokeWidth={2} />
                  <Area type="monotone" dataKey="fake" name="Flagged Articles" stroke="#ef4444" fillOpacity={1} fill="url(#colorFake)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fake vs Real Pie Chart */}
          <div className="glass-card p-6 lg:col-span-4 flex flex-col justify-between">
            <h3 className="text-base font-bold mb-4">News Classification Share</h3>
            <div className="h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classification_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {classification_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#f8fafc' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold mt-4">
              {classification_distribution.map((entry, idx) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="truncate text-slate-500 dark:text-slate-400">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Categories distribution */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold mb-4">Misinformation Categories Frequency</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={category_distribution}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#f8fafc' }} />
                  <Bar dataKey="count" name="Articles Scanned" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment breakdown */}
          <div className="glass-card p-6 flex flex-col justify-between">
            <h3 className="text-base font-bold mb-4">Linguistic Bias Sentiment Distribution</h3>
            <div className="h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentiment_distribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    label
                    dataKey="value"
                  >
                    {sentiment_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#10b981', '#ef4444', '#94a3b8'][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#f8fafc' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 text-xs font-semibold mt-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-500">Positive</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-500">Negative</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span className="text-slate-500">Neutral</span>
              </div>
            </div>
          </div>
        </div>

        {/* Model Comparisons Table */}
        <div className="glass-card p-6">
          <h3 className="text-base font-bold mb-4">Model Performance Benchmarks (Dataset Validation)</h3>
          <p className="text-xs text-slate-500 mb-4">
            Validation scores compiled across standard datasets (ISOT, Kaggle, and LIAR corpora). Matches standard recall-precision evaluations.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Model Classifier</th>
                  <th className="pb-3 font-semibold">Accuracy (%)</th>
                  <th className="pb-3 font-semibold">Precision (%)</th>
                  <th className="pb-3 font-semibold">Recall (%)</th>
                  <th className="pb-3 font-semibold">F1-Score (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light/50 dark:divide-border-dark/50">
                {perfData && perfData.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-100/30 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="py-4 font-bold text-slate-800 dark:text-slate-200">{row.name}</td>
                    <td className="py-4 font-semibold text-violet-500 dark:text-violet-400">{row.accuracy}%</td>
                    <td className="py-4">{row.precision}%</td>
                    <td className="py-4">{row.recall}%</td>
                    <td className="py-4 font-semibold">{row.f1}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
