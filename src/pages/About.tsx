import React from 'react';
import { Shield, Users, Heart, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h1 className="text-5xl font-bold mb-6">Our Mission</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
          InternShield was founded with a simple goal: to ensure that every student's first professional experience is safe, legitimate, and rewarding. 
          We believe that no student should have to worry about scams when they are trying to build their future.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12 mb-20">
        {[
          { icon: Shield, title: 'Transparency', desc: 'We provide open access to community-reported data to build a safer job market.' },
          { icon: Users, title: 'Community', desc: 'Our platform is powered by students, for students. Your voice matters.' },
          { icon: Heart, title: 'Integrity', desc: 'We use advanced AI and human verification to maintain the highest data quality.' },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-12 mb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-600/5 -skew-x-12 translate-x-1/4" />
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <div className="space-y-6">
              {[
                'Students report suspicious internship offers.',
                'Our Gemini AI analyzes the report for scam patterns.',
                'The community votes to verify the report\'s accuracy.',
                'Verified data helps thousands of other students stay safe.'
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    {i + 1}
                  </div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Join the Movement</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              We are a team of students and developers dedicated to fixing the broken internship ecosystem. 
              Want to help? Report a scam or share your experience today.
            </p>
            <Link to="/report" className="flex items-center justify-center gap-2 bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-all">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-12">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Countries', value: '45+' },
            { label: 'Universities', value: '1,200+' },
            { label: 'Scams Blocked', value: '15k+' },
            { label: 'Student Users', value: '250k+' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-black text-brand-600 mb-2">{stat.value}</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
