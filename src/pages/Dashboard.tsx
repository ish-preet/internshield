import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  User,
  Settings,
  Bell,
  MessageSquare
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useReports, Report } from '../hooks/useReports';

export default function Dashboard() {
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchUserReports = async () => {
      try {
        const q = query(
          collection(db, 'reports'),
          where('reporterId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const reportsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Report[];
        setUserReports(reportsData);
      } catch (error) {
        console.error("Error fetching user reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReports();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <div className="p-6 glass-card mb-6 text-center">
            <div className="w-20 h-20 rounded-full border-4 border-brand-500 mx-auto mb-4 overflow-hidden">
              <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-full h-full object-cover" />
            </div>
            <h2 className="font-bold text-lg">{user.displayName}</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Student Member</p>
          </div>

          <nav className="space-y-1">
            {[
              { name: 'Overview', icon: Shield, active: true },
              { name: 'My Reports', icon: AlertTriangle },
              { name: 'My Reviews', icon: MessageSquare },
              { name: 'Notifications', icon: Bell },
              { name: 'Settings', icon: Settings },
            ].map((item) => (
              <button 
                key={item.name}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  item.active 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-grow space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.displayName?.split(' ')[0]}!</h1>
              <p className="text-slate-500">Here's what's happening with your reports and the community.</p>
            </div>
            <Link 
              to="/report"
              className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20"
            >
              <PlusCircle className="w-5 h-5" />
              New Report
            </Link>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Your Reports', value: userReports.length, icon: AlertTriangle, color: 'text-amber-500' },
              { label: 'Trust Score', value: '98', icon: Shield, color: 'text-brand-500' },
              { label: 'Impact', value: '1.2k', icon: CheckCircle, color: 'text-emerald-500' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Total</span>
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Reports */}
          <section className="glass-card overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-lg">Your Recent Reports</h3>
              <Link to="/database" className="text-sm font-bold text-brand-600 hover:underline">View All</Link>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <div className="p-12 text-center text-slate-400">Loading your reports...</div>
              ) : userReports.length > 0 ? (
                userReports.map((report) => (
                  <div key={report.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${report.riskLevel === 'Scam' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold">{report.companyName}</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(report.timestamp).toLocaleDateString()}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold uppercase tracking-wider">{report.riskLevel}</span>
                          </div>
                        </div>
                      </div>
                      <Link 
                        to={`/company/${report.companyName}`}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="font-bold text-slate-400">No reports yet</h4>
                  <p className="text-sm text-slate-500 mt-2">Your reports will appear here once you submit them.</p>
                  <Link to="/report" className="inline-block mt-6 text-brand-600 font-bold hover:underline">Submit your first report</Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
