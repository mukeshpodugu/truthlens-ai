import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShieldAlert, BarChart3, History, FileText, User, Info, Sun, Moon, LogOut, Menu, X } from 'lucide-react';

export default function Layout({ children }) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Sync dark mode preference
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setUsername(storedUsername);
    }
  }, [router.asPath]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUsername(null);
    router.push('/');
  };

  const navItems = [
    { name: 'Fake News Detector', href: '/detector', icon: ShieldAlert },
    { name: 'Analytics Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Saved Reports', href: '/reports', icon: FileText },
    { name: 'About Developer', href: '/about', icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-border-light dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
              <ShieldAlert size={22} />
            </span>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-300 bg-clip-text text-transparent tracking-tight">
              TruthLens AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/15'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {username ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-border-light dark:border-border-dark">
                <Link href="/profile" className="flex items-center space-x-2 text-sm font-medium hover:text-violet-500 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-400 flex items-center justify-center text-white text-xs font-bold uppercase">
                    {username[0]}
                  </div>
                  <span>{username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/10 hover:shadow-violet-500/25 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-border-light dark:border-border-dark text-slate-500 dark:text-slate-400"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-border-light dark:border-border-dark"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-border-light dark:border-border-dark px-4 py-4 space-y-2 flex flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive ? 'bg-primary-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <hr className="border-border-light dark:border-border-dark my-2" />
          {username ? (
            <div className="space-y-2">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <User size={18} />
                <span>Profile ({username})</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-rose-500 hover:bg-rose-500/10"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-border-light dark:border-border-dark text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium shadow-lg shadow-violet-500/20"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-border-light dark:border-border-dark transition-colors py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-300 bg-clip-text text-transparent">
                TruthLens AI
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                A production-grade media credibility analysis platform leveraging cutting-edge NLP, traditional ML models, and Transformer pipelines.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Developer Profile
              </h3>
              <p className="text-sm font-semibold mt-2">PODUGU MUKESH</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Software Engineer (AI/ML & Full-Stack)</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Location: Srikakulam</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Contact Support
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Email: <a href="mailto:mukeshpodugu123@gmail.com" className="text-violet-500 hover:underline">mukeshpodugu123@gmail.com</a></p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Phone: +91 8143999463</p>
            </div>
          </div>
          <hr className="border-border-light dark:border-border-dark my-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <p>&copy; {new Date().getFullYear()} TruthLens AI. All Rights Reserved.</p>
            <div className="flex space-x-4 mt-2 sm:mt-0">
              <Link href="/about" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Documentation</Link>
              <Link href="/about" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link href="/about" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
