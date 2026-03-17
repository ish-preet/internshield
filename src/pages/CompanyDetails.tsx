import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, ThumbsUp, ThumbsDown, ArrowLeft, Info } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Report } from '../hooks/useReports';
import { cn } from '../utils';

export default function CompanyDetails() {
  const { name } = useParams();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const q = query(collection(db, 'reports'), where('companyName', '==', name));
      const snap = await getDocs(q);
      setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Report[]);
      setLoading(false);
    };
    fetchReports();
  }, [name]);

  if (loading) return <div className="p-20 text-center">Loading company details...</div>;

  const avgRiskScore = reports.reduce((acc, r) => acc + (r.riskScore || 0), 0) / reports.length;
  const riskLevel = avgRiskScore > 70 ? 'Scam' : avgRiskScore > 30 ? 'Suspicious' : 'Safe';

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <Link to="/database" className="flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-8 font-bold">
        <ArrowLeft className="w-5 h-5" /> Back to Database
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold">{name}</h1>
              <span className={cn(
                "px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider",
                riskLevel === 'Scam' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
              )}>
                {riskLevel}
              </span>
            </div>
            <p className="text-slate-600 mb-8">
              We have found {reports.length} report(s) associated with this company. 
              Our AI has analyzed these reports to determine the risk level.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Total Reports</div>
                <div className="text-2xl font-bold">{reports.length}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Avg Risk Score</div>
                <div className="text-2xl font-bold">{Math.round(avgRiskScore)}%</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Trust Rating</div>
                <div className="text-2xl font-bold">{reports.length > 5 ? 'Low' : 'Medium'}</div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">Detailed Reports</h2>
          <div className="space-y-6">
            {reports.map(report => (
              <div key={report.id} className="glass-card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{report.role}</h3>
                    <p className="text-sm text-slate-500">{new Date(report.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-red-500 uppercase">AI Risk Score</div>
                    <div className="text-xl font-bold text-red-600">{report.riskScore}%</div>
                  </div>
                </div>
                <p className="text-slate-600 mb-6">{report.description}</p>
                
                {report.redFlags && report.redFlags.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Red Flags Identified
                    </div>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {report.redFlags.map((flag, i) => (
                        <li key={i} className="text-sm text-slate-500 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full" /> {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-4 bg-brand-50 rounded-xl border border-brand-100">
                  <div className="text-sm font-bold text-brand-700 mb-1 flex items-center gap-2">
                    <Info className="w-4 h-4" /> AI Recommendation
                  </div>
                  <p className="text-sm text-brand-600 italic">{report.recommendations}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 sticky top-24">
            <h3 className="text-xl font-bold mb-6">Risk Meter</h3>
            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div 
                className={cn(
                  "absolute top-0 left-0 h-full transition-all duration-1000",
                  avgRiskScore > 70 ? 'bg-red-500' : 'bg-amber-500'
                )}
                style={{ width: `${avgRiskScore}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
              <span>Safe</span>
              <span>Scam</span>
            </div>
            
            <div className="mt-8 p-6 bg-slate-900 text-white rounded-2xl">
              <h4 className="font-bold mb-2">Community Verdict</h4>
              <p className="text-sm text-slate-400 mb-6">Based on community reports and AI analysis, this company is highly likely to be a scam.</p>
              <Link to="/report" className="w-full block text-center bg-white text-slate-900 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
                Add Your Experience
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
