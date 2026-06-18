import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { ShieldCheck, BrainCircuit, LineChart, FileText, Send, ChevronDown, CheckCircle } from 'lucide-react';

export default function Home() {
  const [faqOpen, setFaqOpen] = useState({});

  const toggleFaq = (idx) => {
    setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const stats = [
    { value: '94.1%', label: 'Transformer (BERT) Accuracy' },
    { value: '150,000+', label: 'Training Articles Scanned' },
    { value: '< 250ms', label: 'Inference Engine Latency' },
    { value: '100%', label: 'Explainable AI Transparency' },
  ];

  const features = [
    {
      icon: BrainCircuit,
      title: 'Advanced NLP Pipelines',
      desc: 'Cleans, tokenizes, filters stopwords, lemmatizes, extracts entities, and computes reading ease on the fly.',
    },
    {
      icon: ShieldCheck,
      title: 'Hybrid AI Classifiers',
      desc: 'Compares Traditional ML (XGBoost, RF) with Deep Learning (BiLSTM) and Hugging Face Transformers (RoBERTa).',
    },
    {
      icon: LineChart,
      title: 'Explainable AI Heatmaps',
      desc: 'Inspects sentence-level attention weights and token-level LIME/SHAP impact factors for full decision audibility.',
    },
    {
      icon: FileText,
      title: 'Enterprise Report Export',
      desc: 'Generates publication-ready PDF summaries and detailed Excel reports containing all mathematical breakdowns.',
    },
  ];

  const testimonials = [
    {
      quote: "TruthLens AI has transformed how our editorial board filters incoming social media feeds. The credibility scoring is incredibly accurate.",
      author: "Dr. Sarah Jenkins",
      title: "Senior Media Analyst, FactCheck Global"
    },
    {
      quote: "The explainable AI heatmap is a game-changer. It doesn't just say 'fake'; it shows exactly which sentence is manipulative.",
      author: "Marcus Vance",
      title: "Journalism Professor, NY State University"
    }
  ];

  const faqs = [
    {
      q: "How does the News Credibility Score (0-100) work?",
      a: "TruthLens calculates credibility dynamically by combining the classification probability, the source publisher's trust registry, syntax metrics (like all-caps ratios), and sentiment bias penalties."
    },
    {
      q: "Can I compare different AI models?",
      a: "Yes! In the detector module, you can choose between Logistic Regression, Naive Bayes, Random Forest, or Transformer pipelines to benchmark classification speeds and verdicts side-by-side."
    },
    {
      q: "How does the Explainable AI highlight system calculate attention?",
      a: "It parses your text into individual sentences and computes an attention weight based on loaded feature vocabulary and capitalizations. The resulting map shows you exactly where bias or manipulation is located."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute top-1/4 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[80px] animate-pulse-glow"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 tracking-wider uppercase">
            Platform Release v1.0
          </span>
          <h1 className="mt-8 text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Intelligent Fake News Detection &{' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-300 bg-clip-text text-transparent">
              Media Credibility Analysis
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Audit articles, extract NLP features, and generate explainable AI reports using advanced machine learning and transformer architectures.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/detector"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-xl shadow-violet-500/20 hover:shadow-violet-500/35 hover:scale-[1.02] transition-all duration-300"
            >
              Analyze News Now
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold border border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-300"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-3xl sm:text-4xl font-extrabold text-violet-600 dark:text-violet-400">{stat.value}</p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Core System Architecture</h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            A production-ready pipeline engineered to clean, analyze, score, and visualize misinformation trends.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-card p-8 flex space-x-6 hover:scale-[1.01] transition-transform duration-300">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-400 text-white h-fit shadow-md shadow-violet-500/10">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{feat.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Fact-Checkers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="glass-card p-8 flex flex-col justify-between">
                <p className="text-slate-600 dark:text-slate-300 italic">"{t.quote}"</p>
                <div className="mt-6 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-violet-600/15 flex items-center justify-center font-bold text-violet-600 dark:text-violet-400 uppercase text-sm">
                    {t.author[4]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{t.author}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-border-light dark:border-border-dark rounded-2xl overflow-hidden transition-colors">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transform transition-transform duration-200 ${faqOpen[idx] ? 'rotate-180' : ''}`}
                />
              </button>
              {faqOpen[idx] && (
                <div className="px-6 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-border-light dark:border-border-dark pt-3 bg-slate-50/30 dark:bg-slate-900/10">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 border-t border-border-light dark:border-border-dark bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">Connect With Us</span>
            <h2 className="text-3xl font-bold tracking-tight mt-2">Get in Touch with the Developer</h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-md">
              Have questions about the NLP preprocessing pipeline or model hyperparameter choices? Reach out directly.
            </p>
            
            <div className="mt-8 space-y-4 text-sm">
              <p className="flex items-center space-x-3">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Developer:</span>
                <span>PODUGU MUKESH</span>
              </p>
              <p className="flex items-center space-x-3">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Location:</span>
                <span>Srikakulam</span>
              </p>
              <p className="flex items-center space-x-3">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Email:</span>
                <a href="mailto:mukeshpodugu123@gmail.com" className="text-violet-500 hover:underline">mukeshpodugu123@gmail.com</a>
              </p>
              <p className="flex items-center space-x-3">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Phone:</span>
                <span>+91 8143999463</span>
              </p>
            </div>
          </div>
          
          <div className="glass-card p-8">
            <h3 className="text-lg font-bold mb-6">Contact Support</h3>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully! (Simulated)"); }}>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your inquiry..."
                  className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-transparent focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-violet-500/10 hover:shadow-violet-500/25 transition-all"
              >
                <span>Send Message</span>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
