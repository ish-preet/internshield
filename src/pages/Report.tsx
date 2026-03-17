import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, PlusCircle, CheckCircle, Lock, Users, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { useReports } from '../hooks/useReports';
import { auth, signInWithGoogle } from '../firebase';
import { cn } from '../utils';

export default function ReportPage() {
  const { addReport } = useReports();
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    description: '',
    scamType: 'fake-job' as any,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const user = auth.currentUser;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addReport(formData);
      setShowSuccess(true);
      setFormData({ companyName: '', role: '', description: '', scamType: 'fake-job' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center">
        <div className="glass-card p-12">
          <Lock className="w-12 h-12 text-slate-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Login to Report a Scam</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            We require authentication to maintain the integrity of our database and prevent spam reports.
          </p>
          <button 
            onClick={signInWithGoogle}
            className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-700 transition-all flex items-center gap-2 mx-auto"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h1 className="text-4xl font-bold mb-6">Report an Internship Scam</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
            Help your fellow students by sharing your experience. Your report will be analyzed by our AI to identify red flags and risk levels.
          </p>
          
          <div className="space-y-6">
            {[
              { icon: Shield, title: 'AI Analysis', desc: 'Every report is analyzed by Gemini to detect scam patterns.' },
              { icon: Lock, title: 'Anonymous Reporting', desc: 'Your identity is never shared publicly.' },
              { icon: Users, title: 'Community Impact', desc: 'Join 10,000+ students fighting fake jobs.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-xl h-fit">
                  <item.icon className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-12 text-center"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Report Submitted!</h2>
                <p className="text-slate-600 mb-8">Our AI is analyzing your report. It will appear in the database shortly.</p>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="bg-brand-600 text-white px-6 py-2 rounded-xl font-bold"
                >
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={handleSubmit} 
                className="glass-card p-8 space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Company Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.companyName}
                      onChange={e => setFormData({...formData, companyName: e.target.value})}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="e.g. Scamy Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Internship Role</label>
                    <input 
                      required
                      type="text" 
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="e.g. Web Dev"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Scam Type</label>
                  <select 
                    value={formData.scamType}
                    onChange={e => setFormData({...formData, scamType: e.target.value as any})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="fake-job">Fake Job Posting</option>
                    <option value="fee-scam">Processing Fee Scam</option>
                    <option value="phishing">Identity Theft / Phishing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Describe what happened..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      AI Analyzing...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      Submit Report
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
