export interface Review {
  id: number;
  user: number;
  user_username: string;
  user_full_name: string;
  activity: number;
  activity_title: string;
  activity_slug: string;
  rating: number;
  title: string;
  comment: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewCreateRequest {
  activity: number;
  rating: number;
  title?: string;
  comment: string;
}

export interface ReviewUpdateRequest {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ActivityRatingStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: { [key: string]: number };
  rating_1: number;
  rating_2: number;
  rating_3: number;
  rating_4: number;
  rating_5: number;
}
