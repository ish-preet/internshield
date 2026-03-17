import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  ChevronRight, 
  Filter,
  ArrowUpDown,
  Calendar,
  Building2,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReports, Report } from '../hooks/useReports';

export default function Database() {
  const { reports, loading } = useReports();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Scam' | 'Suspicious'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'risk'>('newest');

  const filteredReports = reports
    .filter(r => {
      const matchesSearch = r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           r.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'All' || r.riskLevel === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp;
      if (sortBy === 'oldest') return a.timestamp - b.timestamp;
      if (sortBy === 'risk') return a.riskLevel === 'Scam' ? -1 : 1;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Scam Database</h1>
        <p className="text-slate-500 text-lg max-w-2xl">
          Browse our community-verified database of internship scams and suspicious companies. Stay informed and protect your career.
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search by company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-transparent text-sm font-bold outline-none"
            >
              <option value="All">All Levels</option>
              <option value="Scam">Scams Only</option>
              <option value="Suspicious">Suspicious Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-sm font-bold outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="risk">Risk Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card p-6 h-64 animate-pulse bg-slate-100 dark:bg-slate-800/50" />
          ))}
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredReports.map((report) => (
              <motion.div 
                key={report.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 flex flex-col group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl ${report.riskLevel === 'Scam' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                    <Shield className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    report.riskLevel === 'Scam' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                  }`}>
                    {report.riskLevel}
                  </span>
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-brand-600 transition-colors">{report.companyName}</h3>
                  <p className="text-sm font-medium text-slate-500 mb-4">{report.role}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(report.timestamp).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {report.scamType.replace('-', ' ')}</span>
                  </div>
                  <Link 
                    to={`/company/${report.companyName}`}
                    className="text-brand-600 text-sm font-bold flex items-center gap-1 hover:underline"
                  >
                    Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-24 glass-card">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No reports found</h3>
          <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
          <button 
            onClick={() => { setSearchQuery(''); setFilter('All'); }}
            className="mt-8 text-brand-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
