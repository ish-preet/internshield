import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  FileText, 
  Search, 
  MessageSquare,
  Copy,
  Mail,
  Scale,
  Globe,
  ArrowRight
} from 'lucide-react';
import { cn } from '../utils';

export default function Resources() {
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(id);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  const guides = [
    {
      title: "How to Spot a Fake Internship",
      desc: "Learn the common red flags like fee demands, generic emails, and too-good-to-be-true offers.",
      icon: Search,
      color: "text-brand-600",
      bg: "bg-brand-50"
    },
    {
      title: "Safe Job Search Checklist",
      desc: "A step-by-step guide to verifying a company before you apply or share personal data.",
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "What to Do If You've Been Scammed",
      desc: "Immediate steps to take if you've shared PII or paid money to a fraudulent company.",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      title: "Your Rights as an Intern",
      desc: "Understand labor laws and what constitutes a legal unpaid or paid internship.",
      icon: Shield,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    }
  ];

  const templates = [
    {
      id: 'verify-email',
      title: "Verification Request Email",
      desc: "Use this template to verify the legitimacy of an offer with a company's official HR department.",
      content: `Subject: Inquiry Regarding Internship Offer - [Your Name]

Dear [HR Manager Name/HR Department],

I hope this email finds you well. 

I recently received an internship offer for the [Position Name] role at [Company Name] via [Platform Name, e.g., LinkedIn/Email]. Before proceeding with the next steps, I wanted to verify the legitimacy of this offer with your official HR department.

Could you please confirm if this offer was issued by your team? I have attached the offer letter for your reference.

Thank you for your time and assistance in ensuring a safe recruitment process.

Best regards,
[Your Name]
[Your Phone Number]`
    },
    {
      id: 'decline-scam',
      title: "Suspicious Offer Decline",
      desc: "A professional way to decline an offer that shows red flags without being confrontational.",
      content: `Subject: Regarding the Internship Opportunity - [Your Name]

Dear [Sender Name],

Thank you for the offer for the [Position Name] role. 

After careful consideration, I have decided not to move forward with this opportunity at this time. I appreciate your interest in my profile.

Best regards,
[Your Name]`
    }
  ];

  const reportingLinks = [
    { name: "FTC Fraud Reporting", url: "https://reportfraud.ftc.gov/", desc: "Official US Federal Trade Commission reporting tool." },
    { name: "FBI IC3", url: "https://www.ic3.gov/", desc: "Internet Crime Complaint Center for cyber-related scams." },
    { name: "Better Business Bureau", url: "https://www.bbb.org/scamtracker", desc: "Report and track scams in your local area." },
    { name: "LinkedIn Help Center", url: "https://www.linkedin.com/help/linkedin/answer/a1342359", desc: "How to report suspicious jobs on LinkedIn." }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      {/* Header */}
      <div className="mb-16 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-black tracking-tight mb-4">Student Resources</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
            Practical tools, templates, and guides to help you navigate your career journey with confidence and safety.
          </p>
        </motion.div>
      </div>

      {/* Main Guides */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {guides.map((guide, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 group hover:border-brand-500/50 transition-all"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6", guide.bg)}>
              <guide.icon className={cn("w-6 h-6", guide.color)} />
            </div>
            <h3 className="text-lg font-bold mb-2">{guide.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{guide.desc}</p>
            <button className="flex items-center gap-2 text-sm font-bold text-brand-600 group-hover:gap-3 transition-all">
              Learn More <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Real World Solutions: Templates */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg">
                <Mail className="w-6 h-6 text-brand-600" />
              </div>
              <h2 className="text-3xl font-bold">Real-World Solutions</h2>
            </div>
            
            <div className="space-y-6">
              {templates.map((template) => (
                <div key={template.id} className="glass-card overflow-hidden border-slate-200 dark:border-slate-800">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                      <h3 className="font-bold text-lg">{template.title}</h3>
                      <p className="text-sm text-slate-500">{template.desc}</p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(template.content, template.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                        copiedTemplate === template.id 
                          ? "bg-emerald-500 text-white" 
                          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {copiedTemplate === template.id ? (
                        <><CheckCircle className="w-4 h-4" /> Copied!</>
                      ) : (
                        <><Copy className="w-4 h-4" /> Copy Template</>
                      )}
                    </button>
                  </div>
                  <div className="p-6 bg-slate-900">
                    <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                      {template.content}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Verification Checklist */}
          <section className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-500" /> Verification Checklist
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Check the sender's email domain (must match company website)",
                "Verify the company on LinkedIn and Glassdoor",
                "Search for 'Company Name + Scam' on Google",
                "Cross-reference the job ID on the official company career portal",
                "Never share SSN or bank details before a formal contract",
                "Be wary of interviews conducted solely via text/chat apps"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Reporting & Quick Links */}
        <div className="space-y-8">
          <div className="glass-card p-8 border-brand-500/20 bg-brand-50/30 dark:bg-brand-900/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Scale className="w-6 h-6 text-brand-600" /> Where to Report
            </h3>
            <div className="space-y-4">
              {reportingLinks.map((link, i) => (
                <a 
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-brand-500 transition-all group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm group-hover:text-brand-600 transition-colors">{link.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{link.desc}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 bg-slate-900 text-white">
            <Globe className="w-10 h-10 mb-6 text-brand-400" />
            <h3 className="text-xl font-bold mb-2">Global Resources</h3>
            <p className="text-slate-400 text-sm mb-6">
              Internship laws vary by country. Check your local labor department for specific regulations.
            </p>
            <button className="w-full bg-brand-600 py-3 rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2">
              View Global Guide <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
