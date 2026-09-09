import { create } from 'zustand';

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface ReviewState {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => void;
  markHelpful: (id: string) => void;
  getReviewsForProduct: (productId: string) => Review[];
  getAverageRating: (productId: string) => number;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    productId: 'prod_tomato',
    author: 'Priya K.',
    rating: 5,
    comment: 'Extremely fresh tomatoes! Perfect for sambar and chutney. Will order again.',
    date: '08-Sep 2026',
    helpful: 12,
  },
  {
    id: 'rev_2',
    productId: 'prod_tomato',
    author: 'Rajesh M.',
    rating: 4,
    comment: 'Good quality, slightly ripe but taste was excellent. Fast delivery.',
    date: '07-Sep 2026',
    helpful: 8,
  },
  {
    id: 'rev_3',
    productId: 'prod_apple',
    author: 'Anita S.',
    rating: 5,
    comment: 'Kinnaur apples are the best! Crispy and sweet. Farm passport verified.',
    date: '08-Sep 2026',
    helpful: 15,
  },
  {
    id: 'rev_4',
    productId: 'prod_mango',
    author: 'Vikram D.',
    rating: 5,
    comment: 'Alphonso mangoes were divine. Perfectly ripened and fragrant.',
    date: '06-Sep 2026',
    helpful: 22,
  },
  {
    id: 'rev_5',
    productId: 'prod_potato',
    author: 'Lakshmi R.',
    rating: 4,
    comment: 'Fresh and clean potatoes. Good for daily cooking.',
    date: '05-Sep 2026',
    helpful: 5,
  },
  {
    id: 'rev_6',
    productId: 'prod_onion',
    author: 'Suresh P.',
    rating: 4,
    comment: 'Red onions were pungent and fresh. Bulk order was smooth.',
    date: '07-Sep 2026',
    helpful: 9,
  },
  {
    id: 'rev_7',
    productId: 'prod_beans',
    author: 'Meena T.',
    rating: 5,
    comment: 'Tender and crunchy green beans. Best quality from Nilgiris.',
    date: '08-Sep 2026',
    helpful: 7,
  },
  {
    id: 'rev_8',
    productId: 'prod_carrot',
    author: 'Karthik V.',
    rating: 5,
    comment: 'Sweet Ooty carrots! My kids love them raw. Great farm passport product.',
    date: '07-Sep 2026',
    helpful: 11,
  },
];

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: MOCK_REVIEWS,
  addReview: (review) =>
    set((state) => ({
      reviews: [
        {
          ...review,
          id: `rev_${Date.now()}`,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          helpful: 0,
        },
        ...state.reviews,
      ],
    })),
  markHelpful: (id) =>
    set((state) => ({
      reviews: state.reviews.map((r) => (r.id === id ? { ...r, helpful: r.helpful + 1 } : r)),
    })),
  getReviewsForProduct: (productId) => get().reviews.filter((r) => r.productId === productId),
  getAverageRating: (productId) => {
    const productReviews = get().reviews.filter((r) => r.productId === productId);
    if (productReviews.length === 0) return 0;
    return productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length;
  },
}));
