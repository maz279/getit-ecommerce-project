import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_text?: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  pros?: string[];
  cons?: string[];
  photos?: any;
  is_verified_purchase: boolean;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface ProductReviewsProps {
  productId: string;
  vendorId?: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  vendorId
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    review_text: ''
  });
  const [error, setError] = useState('');

  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to write a review",
        variant: "destructive"
      });
      return;
    }

    if (!formData.review_text.trim()) {
      setError('Please write a review');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          vendor_id: vendorId,
          user_id: user.id,
          rating: formData.rating,
          // title: formData.title.trim() || null,
          review_text: formData.review_text.trim(),
          verified_purchase: false // This would be checked against actual purchases
        });

      if (error) throw error;

      toast({
        title: "Review Submitted",
        description: "Thank you for your review!"
      });

      setFormData({ rating: 5, title: '', review_text: '' });
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string, isHelpful: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to vote",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, you'd track user votes to prevent multiple votes
    // For now, this is a simplified version
    toast({
      title: "Vote Recorded",
      description: "Thank you for your feedback!"
    });
  };

  const renderStars = (rating: number, size = 4) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-${size} h-${size} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 
      : 0
  }));

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Customer Reviews ({reviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(averageRating), 6)}
              <p className="text-muted-foreground mt-2">
                Based on {reviews.length} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Write Review Button */}
          {user && !showForm && (
            <div className="mt-6 text-center">
              <Button onClick={() => setShowForm(true)}>
                Write a Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= formData.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-muted-foreground hover:text-yellow-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Title (Optional)
              </label>
              <Input
                placeholder="Summarize your review..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Review *
              </label>
              <Textarea
                placeholder="Share your experience with this product..."
                rows={4}
                value={formData.review_text}
                onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                onClick={submitReview} 
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                 <div className="flex gap-4">
                   <Avatar>
                     <AvatarImage src={review.profiles?.avatar_url} />
                     <AvatarFallback>
                       {review.profiles?.full_name?.charAt(0) || 'U'}
                     </AvatarFallback>
                   </Avatar>

                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-2">
                       <span className="font-medium">
                         {review.profiles?.full_name || 'Anonymous User'}
                       </span>
                       {review.verified_purchase && (
                         <Badge variant="secondary" className="text-xs">
                           <CheckCircle className="w-3 h-3 mr-1" />
                           Verified Purchase
                         </Badge>
                       )}
                     </div>

                     <div className="flex items-center gap-2 mb-2">
                       {renderStars(review.rating)}
                       <span className="text-sm text-muted-foreground">
                         {new Date(review.created_at).toLocaleDateString()}
                       </span>
                     </div>

                     {review.review_text && (
                       <p className="text-muted-foreground mb-3">{review.review_text}</p>
                     )}

                     {/* Helpful Actions */}
                     <div className="flex items-center gap-4 text-sm">
                       <button
                         onClick={() => handleHelpful(review.id, true)}
                         className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                       >
                         <ThumbsUp className="w-4 h-4" />
                         Helpful ({review.helpful_count})
                       </button>
                       <button
                         onClick={() => handleHelpful(review.id, false)}
                         className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                       >
                         <ThumbsDown className="w-4 h-4" />
                         Not Helpful
                       </button>
                     </div>
                   </div>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share your experience with this product
            </p>
            {user && !showForm && (
              <Button onClick={() => setShowForm(true)}>
                Write the First Review
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};