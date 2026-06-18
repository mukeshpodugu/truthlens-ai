import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../utils/api';
import { ShieldAlert, Sparkles, FileSpreadsheet, FileDown, Bookmark, RefreshCw, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://truthlens-ai-a68q.onrender.com/api/v1';

export default function Detector() {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [publisher, setPublisher] = useState('');
  const [category, setCategory] = useState('Politics');
  const [modelName, setModelName] = useState('LogisticRegression');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    // Check if registered user to unlock bookmarking
    const token = localStorage.getItem('token');
    if (token) setIsUser(true);
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please paste or write some news content to analyze.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    setIsSaved(false);

    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('title', title || 'Untitled Analysis');
      if (sourceUrl) formData.append('source_url', sourceUrl);
      if (publisher) formData.append('publisher', publisher);
      formData.append('category', category);
      formData.append('model_name', modelName);

      const res = await API.post('/news/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis service failed. Ensure the server is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!result || !isUser) return;
    try {
      await API.post('/reports/save', {
        article_id: result.article_id,
        title: result.title || 'Saved Analysis Report',
        notes: `Analyzed using ${result.model_used}. Verdict: ${result.classification}`
      });
      setIsSaved(true);
    } catch (err) {
      alert('Failed to save report.');
    }
  };

  const getCredibilityColor = (score) => {
    if (score >= 80) return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 60) return 'text-indigo-500 border-indigo-500/20 bg-indigo-500/5';
    if (score >= 40) return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-500 border-rose-500/20 bg-rose-500/5';
  };

  const getAttentionHighlight = (score) => {
    if (score > 0.7) return 'bg-rose-500/20 border-b-2 border-rose-500 text-rose-900 dark:text-rose-200';
    if (score > 0.4) return 'bg-amber-500/20 border-b border-amber-500 text-amber-900 dark:text-amber-200';
    return '';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Editor Input Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card p-6 sm:p-8">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <Sparkles size={20} className="text-violet-500" />
                <span>Media Verification Console</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Paste article body, select your model engine, and execute verification audits.
              </p>

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start space-x-2 text-sm">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleAnalyze} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Article Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter headline..."
                      className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:border-violet-500 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-transparent dark:bg-slate-900 focus:outline-none focus:border-violet-500 transition-colors text-sm"
                    >
                      {['Politics', 'Technology', 'Sports', 'Health', 'Finance', 'Entertainment', 'World News'].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Article Body Text</label>
                  <textarea
                    rows={8}
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste full news story or statement details here..."
                    className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:border-violet-500 transition-colors text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Source URL (Optional)</label>
                    <input
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://example.com/news..."
                      className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:border-violet-500 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">AI Classifier Model</label>
                    <select
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-transparent dark:bg-slate-900 focus:outline-none focus:border-violet-500 transition-colors text-sm"
                    >
                      <option value="LogisticRegression">Logistic Regression (Fast ML)</option>
                      <option value="NaiveBayes">Naive Bayes (Lexical ML)</option>
                      <option value="RandomForest">Random Forest (Ensemble ML)</option>
                      <option value="BERT">BERT Transformer (HF)</option>
                      <option value="RoBERTa">RoBERTa Transformer (HF)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-violet-500/10 hover:shadow-violet-500/25 hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin text-white" size={18} />
                      <span>Auditing Article Wording...</span>
                    </>
                  ) : (
                    <>
                      <span>Run Verification Pipeline</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Explainable AI Heatmap view */}
            {result && (
              <div className="glass-card p-6 sm:p-8">
                <h3 className="text-lg font-bold mb-2">Explainable AI (XAI) Attention Map</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Heatmap based on linguistic features and model attention. Sentences highlighted in red indicate high-intensity clickbait, exaggeration, or conspiracy words.
                </p>
                
                <div className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-slate-50/30 dark:bg-slate-950/10 leading-relaxed text-sm space-y-2 select-text">
                  {result.explainable_ai.sentence_attention.map((sentence) => (
                    <span
                      key={sentence.index}
                      className={`inline-block px-1 rounded transition-colors ${getAttentionHighlight(sentence.attention_score)}`}
                      title={sentence.triggers.length > 0 ? `Trigger keywords: ${sentence.triggers.join(', ')}` : ''}
                    >
                      {sentence.sentence}{' '}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Analysis Column */}
          <div className="lg:col-span-5 space-y-6">
            {result ? (
              <>
                {/* Score & Verdict Card */}
                <div className="glass-card p-6 sm:p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Classification Verdict</h3>
                      <p className={`text-2xl font-bold mt-1 ${result.classification.includes('Real') ? 'text-emerald-500' : result.classification.includes('Fake') ? 'text-rose-500' : 'text-amber-500'}`}>
                        {result.classification}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Confidence: {round(result.confidence_score * 100, 2)}% | Model: {result.model_used}
                      </p>
                    </div>

                    <div className={`flex flex-col items-center justify-center border rounded-2xl p-3 px-5 ${getCredibilityColor(result.credibility.score)}`}>
                      <span className="text-2xl font-extrabold">{result.credibility.score}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider">Credibility</span>
                    </div>
                  </div>

                  <hr className="border-border-light dark:border-border-dark my-6" />

                  {/* Actions (Save / Export) */}
                  <div className="grid grid-cols-3 gap-2">
                    {isUser ? (
                      <button
                        onClick={handleSaveReport}
                        disabled={isSaved}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                          isSaved 
                            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500' 
                            : 'border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}
                      >
                        <Bookmark size={16} className={isSaved ? 'fill-emerald-500' : ''} />
                        <span className="mt-1.5">{isSaved ? 'Saved' : 'Save'}</span>
                      </button>
                    ) : (
                      <span className="p-3 rounded-xl border border-dashed border-border-light dark:border-border-dark text-[10px] text-center text-slate-500 flex flex-col items-center justify-center">
                        <Bookmark size={14} className="opacity-40" />
                        <span className="mt-1.5">Login to Bookmark</span>
                      </span>
                    )}

                    <a
                      href={`${apiBase}/reports/export/${result.article_id}/pdf`}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-semibold transition-all"
                    >
                      <FileDown size={16} className="text-violet-500" />
                      <span className="mt-1.5">PDF</span>
                    </a>
                    
                    <a
                      href={`${apiBase}/reports/export/${result.article_id}/excel`}
                      className="flex flex-col items-center justify-center p-3 rounded-xl border border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-semibold transition-all"
                    >
                      <FileSpreadsheet size={16} className="text-emerald-500" />
                      <span className="mt-1.5">Excel</span>
                    </a>
                  </div>
                </div>

                {/* Sentiment & Emotion Breakdowns */}
                <div className="glass-card p-6 sm:p-8 space-y-6">
                  <div>
                    <h4 className="text-sm font-bold border-b border-border-light dark:border-border-dark pb-2 mb-3">Linguistic Sentiment Bias</h4>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                        <p className="font-bold">{round(result.sentiment.scores.positive * 100, 1)}%</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Positive</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-500">
                        <p className="font-bold">{round(result.sentiment.scores.neutral * 100, 1)}%</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Neutral</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                        <p className="font-bold">{round(result.sentiment.scores.negative * 100, 1)}%</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Negative</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold border-b border-border-light dark:border-border-dark pb-2 mb-4">Emotion Signature Detection</h4>
                    <div className="space-y-3">
                      {Object.entries(result.sentiment.emotions).map(([emotion, score]) => (
                        <div key={emotion} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold uppercase">
                            <span>{emotion}</span>
                            <span>{round(score * 100, 1)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-primary-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${score * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Findings Card */}
                <div className="glass-card p-6 sm:p-8">
                  <h4 className="text-sm font-bold mb-4 border-b border-border-light dark:border-border-dark pb-2">AI Natural Language Explanations</h4>
                  <ul className="space-y-3">
                    {result.explainable_ai.explanations.map((exp, i) => (
                      <li key={i} className="text-xs text-slate-500 dark:text-slate-400 flex items-start space-x-2 leading-relaxed">
                        <CheckCircle size={14} className="text-violet-500 shrink-0 mt-0.5" />
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="glass-card p-8 text-center text-slate-500 dark:text-slate-400 h-full flex flex-col items-center justify-center min-h-[40vh]">
                <ShieldAlert size={48} className="opacity-25 text-violet-500 animate-pulse" />
                <h3 className="mt-4 font-bold text-slate-700 dark:text-slate-300">Awaiting Verification Parameters</h3>
                <p className="mt-2 text-xs max-w-xs leading-relaxed">
                  Enter news headline, paste content, and run auditing pipelines to view credibility breakdowns.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}

// Utility rounding helper
function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
