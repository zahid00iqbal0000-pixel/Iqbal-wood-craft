import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReviewSubmissionModalProps {
  productId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  productId,
  productName,
  isOpen,
  onClose
}) => {
  const { addProductReview, currentUser } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState(currentUser.name || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addProductReview(productId, {
      authorName: authorName.trim() || 'Verified Furniture Patron',
      rating,
      comment: comment.trim(),
      verifiedPurchase: true
    });

    onClose();
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden z-10 text-white p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Patron Review
            </span>
            <h3 className="text-lg font-serif font-bold text-amber-100 mt-0.5">
              Review: {productName}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Star Rating Picker */}
          <div>
            <label className="block font-bold text-amber-200 mb-2">Overall Quality Rating:</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-stone-700'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 font-mono font-bold text-amber-400 text-sm">{rating} / 5 Stars</span>
            </div>
          </div>

          {/* Author Name */}
          <div>
            <label className="block font-bold text-amber-200 mb-1">Your Name / Title:</label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Mian Tariq Hassan"
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-amber-100 outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Comment Textarea */}
          <div>
            <label className="block font-bold text-amber-200 mb-1">Your Craftsmanship Experience:</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe wood finishing, carving detail, durability, delivery time, or customer support..."
              className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-amber-100 outline-none focus:border-[#d4af37] resize-none"
            />
          </div>

          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-[11px] text-stone-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Reviews are automatically attached with a "Verified Buyer" badge to ensure customer trust across Pakistan.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-700 text-stone-300 rounded-xl font-bold hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#d4af37] text-stone-950 font-bold rounded-xl hover:brightness-110 shadow"
            >
              Publish Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
