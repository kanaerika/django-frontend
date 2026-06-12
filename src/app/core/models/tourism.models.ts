export interface TourismDestination {
  id: number;
  name: string;
  city: string;
  description: string;
  image: string | null;
  image_url: string | null;
  hotels_count: number;
  reviews_count: number;
  average_rating: number;
  created_at: string;
}
export interface PaginatedResponse<T> {
  links: any;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  results: T[];
}


export interface Hotel {
  id: number;
  name: string;
  address: string;
  image: string | null;
  image_url: string | null;
  destination: number;
  destination_name: string;
  bookings_count: number;
}

export type HotelBookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface HotelBooking {
  id: number;
  user: number;
  user_username: string;
  hotel: number;
  hotel_name: string;
  destination_name: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  status: HotelBookingStatus;
  status_display: string;
  created_at: string;
}

export interface HotelBookingCreateRequest {
  hotel: number;
  check_in: string;
  check_out: string;
  guests: number;
}

export interface DestinationReview {
  id: number;
  user: number;
  user_username: string;
  destination: number;
  destination_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface DestinationReviewCreateRequest {
  destination: number;
  rating: number;
  comment: string;
}
