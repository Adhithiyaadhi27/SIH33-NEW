import { useState } from 'react';
import { ThumbsUp, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useReviewStore, type Review } from '../../store/reviewStore';
import StarRating from './StarRating';
import { GlassCard } from '../ui/primitives';

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { reviews, addReview, markHelpful, getReviewsForProduct, getAverageRating } = useReviewStore();
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  const productReviews = getReviewsForProduct(productId);
  const avgRating = getAverageRating(productId);
  const visibleReviews = expanded ? productReviews : productReviews.slice(0, 2);

  const handleSubmit = () => {
    if (!newComment.trim() || !authorName.trim()) return;
    addReview({ productId, author: authorName, rating: newRating, comment: newComment });
    setNewComment('');
    setNewRating(5);
    setAuthorName('');
    setShowForm(false);
  };

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StarRating rating={avgRating} size="md" showValue />
          <span className="text-[10px] text-text-muted">({productReviews.length} reviews)</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-[10px] font-bold text-soil-gold hover:underline cursor-pointer"
        >
          {showForm ? 'Cancel' : '+ Write a Review'}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <GlassCard small className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-text-muted">Your Rating:</span>
            <StarRating rating={newRating} size="md" interactive onRate={setNewRating} />
          </div>
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-soil-emerald placeholder:text-text-muted/50"
          />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-soil-emerald placeholder:text-text-muted/50 resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim() || !authorName.trim()}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-soil-emerald to-soil-leaf text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:brightness-110 transition"
          >
            Submit Review
          </button>
        </GlassCard>
      )}

      {/* Reviews List */}
      {visibleReviews.length === 0 && !showForm ? (
        <p className="text-[11px] text-text-muted text-center py-2">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {visibleReviews.map((review) => (
            <div key={review.id} className="glass-panel-sm p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-soil-emerald/40 flex items-center justify-center text-[9px] font-bold text-white">
                    {review.author.charAt(0)}
                  </div>
                  <span className="text-[11px] font-bold text-text-primary">{review.author}</span>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <span className="text-[9px] text-text-muted">{review.date}</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">{review.comment}</p>
              <button
                onClick={() => markHelpful(review.id)}
                className="flex items-center gap-1 text-[9px] text-text-muted hover:text-soil-gold transition cursor-pointer"
              >
                <ThumbsUp className="w-3 h-3" /> Helpful ({review.helpful})
              </button>
            </div>
          ))}
          {productReviews.length > 2 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mx-auto text-[10px] font-bold text-soil-gold hover:underline cursor-pointer"
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? 'Show less' : `Show all ${productReviews.length} reviews`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
