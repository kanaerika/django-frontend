export interface Payment {
  id: number;
  booking: number;
  method: 'stripe' | 'paypal' | 'wire';
  stripe_payment_intent_id: string;
  amount_paid: string;
  is_successful: boolean;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';

export interface Booking {
  id: number;
  booking_reference: string;
  user: number;
  user_username: string;
  user_full_name: string;
  schedule: number;
  activity_title: string;
  activity_slug: string;
  city_name: string;
  schedule_date: string;
  schedule_start_time: string;
  number_of_travelers: number;
  total_price: string;
  status: BookingStatus;
  status_display: string;
  special_requests: string;
  payment: Payment | null;
  created_at: string;
  updated_at: string;
}

export interface BookingCreateRequest {
  schedule: number;
  number_of_travelers: number;
  special_requests?: string;
}

export interface PaymentCreateRequest {
  method: 'stripe' | 'paypal' | 'wire';
  stripe_payment_intent_id?: string;
}

export interface BookingStats {
  total_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  total_spent: string;
}
