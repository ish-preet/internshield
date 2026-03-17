import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  ArrowRight,
  ChevronRight,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReports, Report } from '../hooks/useReports';

const StatCard = ({ icon: Icon, value, label, color }: any) => (
  <div className="text-center">
    <div className={`inline-flex p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 mb-4 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</div>
  </div>
);

export default function Home() {
  const { reports } = useReports();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Report | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery) return;
    setIsSearching(true);
    setTimeout(() => {
      const found = reports.find(r => r.companyName.toLowerCase().includes(searchQuery.toLowerCase()));
      setSearchResult(found || null);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-400/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 blur-3xl rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase text-brand-600 bg-brand-50 dark:bg-brand-900/30 rounded-full">
              Protecting the Future Workforce
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Protect Students From <br />
              <span className="text-brand-600">Fake Internships</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The world's first community-driven database to verify internship opportunities. 
              Don't let scammers steal your time, money, or identity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
              >
                <Search className="w-5 h-5" />
                Check Company
              </button>
              <Link to="/report" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Report a Scam
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <StatCard icon={AlertTriangle} value="1,284" label="Scams Reported" color="text-amber-500" />
            <StatCard icon={CheckCircle} value="450+" label="Verified Companies" color="text-emerald-500" />
            <StatCard icon={Users} value="15k+" label="Students Protected" color="text-brand-500" />
            <StatCard icon={TrendingUp} value="99.9%" label="Success Rate" color="text-indigo-500" />
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Check Company Reputation</h2>
            <p className="text-slate-600 dark:text-slate-400">Search our database of reported scams and verified companies.</p>
          </div>

          <div className="relative mb-8">
            <input 
              type="text" 
              placeholder="Enter company name (e.g. 'Global Tech')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-14 pr-32 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-brand-500/5 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <button 
              onClick={handleSearch}
              disabled={isSearching}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isSearching ? 'Checking...' : 'Check Now'}
            </button>
          </div>

          {searchResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 border-l-8 border-l-red-500"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">{searchResult.companyName}</h3>
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 text-xs font-bold rounded-full uppercase tracking-wider">
                      {searchResult.riskLevel}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{searchResult.description}</p>
                  <div className="flex gap-4 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {searchResult.role}</span>
                    <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> {searchResult.scamType.replace('-', ' ')}</span>
                  </div>
                </div>
                <Link 
                  to={`/company/${searchResult.companyName}`}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  View Details <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8">
              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">AI Scam Detection</h3>
              <p className="text-slate-500 leading-relaxed">
                Our advanced AI analyzes reports in real-time to identify patterns and flag potential scams before they harm others.
              </p>
            </div>
            <div className="glass-card p-8">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Community Verified</h3>
              <p className="text-slate-500 leading-relaxed">
                Leverage the power of thousands of students sharing their experiences to build a safer internship ecosystem.
              </p>
            </div>
            <div className="glass-card p-8">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Verified Partners</h3>
              <p className="text-slate-500 leading-relaxed">
                We work with legitimate companies to provide a list of verified, safe internship opportunities for students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-brand-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to secure your future?</h2>
          <p className="text-brand-100 text-lg mb-10">
            Join thousands of students who use InternShield to navigate the job market safely.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/report" className="w-full sm:w-auto bg-white text-brand-600 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">
              Report a Scam
            </Link>
            <Link to="/database" className="w-full sm:w-auto bg-brand-700 text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-800 transition-colors">
              Browse Database
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
