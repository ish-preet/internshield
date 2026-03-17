import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, MessageSquare, PlusCircle, User, CheckCircle } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { cn } from '../utils';

interface Review {
  id: string;
  companyName: string;
  rating: number;
  content: string;
  authorUid: string;
  authorName: string;
  timestamp: number;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ companyName: '', rating: 5, content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Review[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        ...formData,
        authorUid: user.uid,
        authorName: user.displayName || 'Anonymous',
        timestamp: Date.now()
      });
      setFormData({ companyName: '', rating: 5, content: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Student Reviews</h1>
          <p className="text-slate-600 dark:text-slate-400">Share your real internship experiences to help others find legitimate opportunities.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="text-center py-20 italic text-slate-400">Loading reviews...</div>
          ) : reviews.length > 0 ? (
            reviews.map(review => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{review.companyName}</h3>
                    <div className="flex items-center gap-1 text-amber-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-4 h-4 fill-current", i >= review.rating && "text-slate-200 fill-none")} />
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    {new Date(review.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  "{review.content}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">{review.authorName}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 glass-card italic text-slate-400">No reviews yet. Be the first to share!</div>
          )}
        </div>

        <div className="space-y-8">
          {user ? (
            <form onSubmit={handleSubmit} className="glass-card p-8 sticky top-24 space-y-6">
              <h3 className="text-xl font-bold mb-2">Write a Review</h3>
              <div className="space-y-2">
                <label className="text-sm font-bold">Company Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Google"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        formData.rating >= star ? "text-amber-500" : "text-slate-300"
                      )}
                    >
                      <Star className={cn("w-6 h-6 fill-current", formData.rating < star && "fill-none")} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Your Experience</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Tell us about your internship..."
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Posting...' : <><PlusCircle className="w-5 h-5" /> Post Review</>}
              </button>
            </form>
          ) : (
            <div className="glass-card p-8 sticky top-24 text-center">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Join the Conversation</h3>
              <p className="text-sm text-slate-500 mb-6">Login to share your internship experience with the community.</p>
              <button 
                onClick={() => auth.currentUser || alert('Please use the login button in the navbar')}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold"
              >
                Login to Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
