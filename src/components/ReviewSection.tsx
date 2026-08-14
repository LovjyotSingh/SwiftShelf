'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, Sparkles, ThumbsUp, MessageSquarePlus } from 'lucide-react';
import { Product, ReviewItem } from '@/types';

interface ReviewSectionProps {
  product: Product;
  onAddReview: (review: ReviewItem) => void;
}

export default function ReviewSection({ product, onAddReview }: ReviewSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev_${Date.now()}`,
      userName: authorName.trim(),
      rating,
      title: reviewTitle.trim() || 'Verified Customer Review',
      comment: reviewComment.trim(),
      verifiedPurchase: true,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
    };

    onAddReview(newRev);
    setAuthorName('');
    setReviewTitle('');
    setReviewComment('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 pt-4">
      {/* AI Review Summary Card */}
      {product.aiSummary && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900/60 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                AI Synthesis & Customer Telemetry
              </span>
            </div>
            <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {product.aiSummary.sentimentScore}% Positive
            </div>
          </div>

          <p className="text-xs text-slate-300 italic leading-relaxed">
            "{product.aiSummary.summaryText}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
              <span className="font-bold text-emerald-400">✨ Key Highlights:</span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                {product.aiSummary.pros.map((pro, i) => (
                  <li key={i}>{pro}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
              <span className="font-bold text-amber-400">⚠️ Considerations:</span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                {product.aiSummary.cons.map((con, i) => (
                  <li key={i}>{con}</li>
                ))}
              </ul>
              <div className="pt-1 text-[11px] text-cyan-300">
                <strong>Fit Note:</strong> {product.aiSummary.fitRecommendation}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Header & Add Review Trigger */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h4 className="font-heading text-sm font-bold text-white">
            Customer Reviews ({product.reviews.length})
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-0.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-white font-bold">{product.rating}</span>
            <span className="text-slate-400">out of 5.0</span>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 hover:text-white text-xs font-medium"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-indigo-400" />
          <span>{showAddForm ? 'Cancel' : 'Write Review'}</span>
        </button>
      </div>

      {/* Add Review Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl glass-card space-y-3 text-xs">
          <h5 className="font-bold text-white">Submit Verified Feedback</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Jordan Hayes"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white"
              >
                <option value={5}>5 Stars - Outstanding</option>
                <option value={4}>4 Stars - Great</option>
                <option value={3}>3 Stars - Average</option>
                <option value={2}>2 Stars - Poor</option>
                <option value={1}>1 Star - Flawed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Review Title</label>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="e.g. Flawless acoustic reproduction"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Detailed Feedback</label>
            <textarea
              required
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Describe sound quality, build durability, ergonomics..."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white"
            />
          </div>

          <button
            type="submit"
            className="btn-luxury-primary px-4 py-2 rounded-lg font-bold text-white"
          >
            Publish Review
          </button>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-3">
        {product.reviews.map((rev) => (
          <div key={rev.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{rev.userName}</span>
                {rev.verifiedPurchase && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle className="w-2.5 h-2.5" />
                    <span>Verified Purchase</span>
                  </span>
                )}
              </div>
              <span className="text-slate-500 text-[11px]">{rev.date}</span>
            </div>

            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <h5 className="font-semibold text-slate-200">{rev.title}</h5>
            <p className="text-slate-300 leading-relaxed font-light">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
