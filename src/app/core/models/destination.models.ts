export interface Country {
  id: number;
  name: string;
  iso_code: string;
  cities_count: number;
  activities_count: number;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: number;
  name: string;
  slug: string;
  country: number;
  country_name: string;
  country_iso_code: string;
  description: string;
  thumbnail: string | null;
  thumbnail_url: string | null;
  latitude: number | null;
  longitude: number | null;
  activities_count: number;
  active_activities_count: number;
  created_at: string;
  updated_at: string;
}

export interface CityCreateRequest {
  name: string;
  country: number;
  description?: string;
  thumbnail?: File;
  latitude?: number;
  longitude?: number;
}

export interface CountryCreateRequest {
  name: string;
  iso_code: string;
}

export interface PaginatedResponse<T> {
  count: number;
  page: number;
  page_size: number;
  results: T[];
}
