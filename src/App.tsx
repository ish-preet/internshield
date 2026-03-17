import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  PlusCircle, 
  Database as DbIcon, 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  X,
  MessageSquare,
  Info,
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import { auth, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Database from './pages/Database';
import Report from './pages/Report';
import CompanyDetails from './pages/CompanyDetails';
import Reviews from './pages/Reviews';
import Statistics from './pages/Statistics';
import About from './pages/About';
import Resources from './pages/Resources';

// Components
import { GeminiLiveAssistant } from './components/GeminiLiveAssistant';

function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const navLinks = [
    { name: 'Database', path: '/database', icon: DbIcon },
    { name: 'Report', path: '/report', icon: PlusCircle },
    { name: 'Reviews', path: '/reviews', icon: MessageSquare },
    { name: 'Stats', path: '/statistics', icon: BarChart3 },
    { name: 'Resources', path: '/resources', icon: BookOpen },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-brand-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">InternShield</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                isActive(link.path) 
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all">
                <User className="w-4 h-4" /> Dashboard
              </Link>
              <button 
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-8 space-y-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 text-lg font-bold p-4 rounded-2xl bg-slate-50 dark:bg-slate-800"
              >
                <link.icon className="w-6 h-6 text-brand-600" />
                {link.name}
              </Link>
            ))}
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 text-lg font-bold p-4 rounded-2xl bg-slate-900 text-white"
              >
                <User className="w-6 h-6" /> Dashboard
              </Link>
            ) : (
              <button 
                onClick={() => { signInWithGoogle(); setIsMenuOpen(false); }}
                className="w-full bg-brand-600 text-white p-4 rounded-2xl font-bold"
              >
                Sign In
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <Shield className="w-8 h-8 text-brand-600" />
            <span className="text-2xl font-black tracking-tighter">InternShield</span>
          </Link>
          <p className="text-slate-500 max-w-sm leading-relaxed">
            The world's first AI-powered student internship scam detector. Protecting your future, one report at a time.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Platform</h4>
          <ul className="space-y-4 text-slate-500">
            <li><Link to="/database" className="hover:text-brand-600">Scam Database</Link></li>
            <li><Link to="/report" className="hover:text-brand-600">Report a Scam</Link></li>
            <li><Link to="/statistics" className="hover:text-brand-600">Live Stats</Link></li>
            <li><Link to="/resources" className="hover:text-brand-600">Resources</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-slate-500">
            <li><Link to="/about" className="hover:text-brand-600">About Us</Link></li>
            <li><a href="#" className="hover:text-brand-600">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-600">Terms of Service</a></li>
            <li><a href="#" className="hover:text-brand-600">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm text-slate-400">
        <p>© 2026 InternShield. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-brand-600">Twitter</a>
          <a href="#" className="hover:text-brand-600">LinkedIn</a>
          <a href="#" className="hover:text-brand-600">GitHub</a>
        </div>
      </div>
    </footer>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <div className="glass-card p-12 max-w-xl w-full text-center">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            <p className="text-slate-600 mb-8">
              We encountered an error while processing your request. This might be due to a connection issue or security permissions.
            </p>
            <div className="bg-slate-900 text-slate-400 p-4 rounded-xl text-left text-xs font-mono mb-8 overflow-auto max-h-40">
              {JSON.stringify(this.state.error, null, 2)}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition-all"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-brand-100 selection:text-brand-900">
          <Navbar />
          
          <main className="min-h-[calc(100vh-80px)]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/database" element={<Database />} />
              <Route path="/report" element={<Report />} />
              <Route path="/company/:name" element={<CompanyDetails />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<Resources />} />
            </Routes>
          </main>

          <Footer />
          <GeminiLiveAssistant />
        </div>
      </Router>
    </ErrorBoundary>
  );
}
