export interface Category {
  id: number;
  name: string;
  slug: string;
  activities_count: number;
}

export interface ActivityImage {
  id: number;
  activity: number;
  image: string;
  image_url: string | null;
  is_cover: boolean;
  order: number;
}

export interface Schedule {
  id: number;
  activity: number;
  activity_title: string;
  date: string;
  start_time: string;
  available_spots: number;
  available_spots_original: number;
  actual_price: string;
  price_override: string | null;
  is_full: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvailableSchedule {
  id: number;
  activity: number;
  activity_title: string;
  date: string;
  start_time: string;
  formatted_date: string;
  formatted_time: string;
  available_spots: number;
  actual_price: string;
  price_override: string | null;
}

export interface ActivityList {
  id: number;
  title: string;
  slug: string;
  city: number;
  city_name: string;
  city_slug: string;
  country_name: string;
  base_price: string;
  duration_hours: number;
  cached_rating: number;
  average_rating: number;
  categories: Category[];
  cover_image: string | null;
  created_at: string;
}

export interface ActivityDetail {
  id: number;
  title: string;
  slug: string;
  city: any;
  description: string;
  what_to_bring: string;
  base_price: string;
  lowest_price: string;
  max_travelers: number;
  duration_hours: number;
  is_active: boolean;
  cached_rating: number;
  average_rating: number;
  reviews_count: number;
  categories: Category[];
  images: ActivityImage[];
  schedules: Schedule[];
  created_by: any;
  created_at: string;
  updated_at: string;
}

export interface ActivityCreateRequest {
  title: string;
  city: number;
  categories?: number[];
  description: string;
  what_to_bring?: string;
  base_price: number;
  max_travelers?: number;
  duration_hours: number;
  is_active?: boolean;
}

export interface ScheduleCreateRequest {
  activity: number;
  date: string;
  start_time: string;
  available_spots: number;
  price_override?: number | null;
}

export interface ActivityFilterParams {
  city?: string;
  country?: string;
  category?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  min_duration?: number;
  max_duration?: number;
  ordering?: string;
}
