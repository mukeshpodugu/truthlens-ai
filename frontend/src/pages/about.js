import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Mail, Phone, MapPin, User, FileCode, Server, Database, Cpu, Layers } from 'lucide-react';

export default function About() {
  const [activeTab, setActiveTab] = useState('profile');

  const docTabs = [
    { id: 'profile', name: 'Developer Profile', icon: User },
    { id: 'architecture', name: 'System Architecture', icon: Layers },
    { id: 'api', name: 'API Specifications', icon: Server },
    { id: 'database', name: 'Database Schema', icon: Database },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">Platform Specifications & Developer Profile</h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Comprehensive system documentations and professional developer resume details for TruthLens AI.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-border-light dark:border-border-dark overflow-x-auto pb-px mb-8 space-x-2">
          {docTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-t-xl text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? 'border-primary-500 text-primary-500 bg-primary-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/20'
                }`}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="glass-card p-8 sm:p-10 min-h-[50vh]">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Profile Card */}
              <div className="lg:col-span-1 space-y-6">
                <div className="flex flex-col items-center text-center p-6 border border-border-light dark:border-border-dark rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-violet-500/20">
                    PM
                  </div>
                  <h2 className="mt-4 text-xl font-bold">PODUGU MUKESH</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Software Engineer (AI/ML & Full-Stack)</p>
                </div>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <Mail className="text-violet-500 shrink-0" size={18} />
                    <a href="mailto:mukeshpodugu123@gmail.com" className="hover:underline">mukeshpodugu123@gmail.com</a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="text-violet-500 shrink-0" size={18} />
                    <span>+91 8143999463</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-violet-500 shrink-0" size={18} />
                    <span>Srikakulam, Andhra Pradesh, India</span>
                  </div>
                </div>
              </div>

              {/* Bio & Resume */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="text-lg font-bold border-b border-border-light dark:border-border-dark pb-2 mb-3">Resume Project Description</h3>
                  <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                    <strong>TruthLens AI:</strong> Developed an NLP and Transformer-based fake news detection platform capable of classifying news credibility, detecting misinformation, analyzing sentiment and emotions, generating explainable AI insights, and visualizing misinformation trends. Built using Python, FastAPI, BERT/RoBERTa, PostgreSQL, React, Tailwind CSS, Redis, Docker, and modern MLOps practices.
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold border-b border-border-light dark:border-border-dark pb-2 mb-3">Technical Proficiencies</h3>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    {['Python', 'FastAPI', 'SQLAlchemy', 'React.js', 'Next.js', 'Tailwind CSS', 'Docker', 'Redis', 'PostgreSQL', 'BERT / RoBERTa', 'Scikit-Learn', 'NLTK', 'Pandas'].map((skill) => (
                      <span key={skill} className="px-3 py-1.5 rounded-full border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-8 text-sm leading-relaxed">
              <div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">System Architecture Overview</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  TruthLens AI is decoupled into a containerized 3-tier SaaS structure designed for horizontal scalability:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-500 dark:text-slate-400">
                  <li><strong>Client Presentation Layer (React/Next.js):</strong> Renders dark/light glassmorphic dashboards using Recharts and Tailwind. Communicates via REST APIs.</li>
                  <li><strong>Core Service Engine (FastAPI):</strong> Asynchronous API serving model routes, running sanitization, compiling credibility factors, and exporting reports.</li>
                  <li><strong>Database & Caching (PostgreSQL & Redis):</strong> Stores user histories, predictions, sentiments, and activity logs. Redis caches analytical sums for immediate response.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">NLP & ML Pipeline Workflows</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  When a news block is uploaded, it is routed through the following data pipeline:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-center">
                  <div className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-950/20">
                    <p className="font-bold text-violet-500">1. Preprocess</p>
                    <p className="text-xs text-slate-500 mt-1">Cleans HTML tags, normalizes casings, tokenizes words, and extracts lemmas.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-950/20">
                    <p className="font-bold text-violet-500">2. Predict</p>
                    <p className="text-xs text-slate-500 mt-1">Infers class weights from fitted TF-IDF ML classifiers (LR, NB, RF) or Transformer weights.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-950/20">
                    <p className="font-bold text-violet-500">3. Attribute</p>
                    <p className="text-xs text-slate-500 mt-1">Estimates sentiments, emotions, publisher trust levels, and LIME/SHAP explanations.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-950/20">
                    <p className="font-bold text-violet-500">4. Score</p>
                    <p className="text-xs text-slate-500 mt-1">Synthesizes a 0-100 credibility index before persisting details into PostgreSQL.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6 text-sm">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">REST API Endpoint Specifications</h3>
              
              <div className="space-y-4">
                <div className="p-5 border border-border-light dark:border-border-dark rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 font-bold text-xs uppercase">POST</span>
                    <span className="font-mono font-bold">/api/v1/news/analyze</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Core analyzer. Accepts form parameters (text, title, source_url, publisher, model_name). Returns full prediction, sentiments, and XAI maps.</p>
                </div>

                <div className="p-5 border border-border-light dark:border-border-dark rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 font-bold text-xs uppercase">GET</span>
                    <span className="font-mono font-bold">/api/v1/analytics/summary</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Fetches statistics for dashboard visualizations (Fake news ratios, sentiment counts, category frequencies).</p>
                </div>

                <div className="p-5 border border-border-light dark:border-border-dark rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 font-bold text-xs uppercase">GET</span>
                    <span className="font-mono font-bold">/api/v1/reports/export/&#123;article_id&#125;/pdf</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Generates and streams a downloadable PDF report matching the requested article analysis.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6 text-sm">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Relational Database Entity Mappings</h3>
              <p className="text-slate-500 dark:text-slate-400">
                The database schema is mapped using PostgreSQL for complete referential integrity.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 border border-border-light dark:border-border-dark rounded-xl bg-slate-50/30 dark:bg-slate-950/10">
                  <h4 className="font-bold text-violet-500 mb-2">Users Table</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-slate-400 text-xs">
                    <li><code>id (PK)</code>: Integer</li>
                    <li><code>username</code>: VarChar(50), Unique</li>
                    <li><code>email</code>: VarChar(100), Unique</li>
                    <li><code>role</code>: VarChar(20) [admin, user, visitor]</li>
                  </ul>
                </div>
                
                <div className="p-5 border border-border-light dark:border-border-dark rounded-xl bg-slate-50/30 dark:bg-slate-950/10">
                  <h4 className="font-bold text-violet-500 mb-2">News Articles Table</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-slate-400 text-xs">
                    <li><code>id (PK)</code>: Integer</li>
                    <li><code>title</code>: VarChar(200)</li>
                    <li><code>text</code>: Text</li>
                    <li><code>user_id (FK)</code>: Nullable Reference to Users</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
