export interface Role {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  current_page: number;
  total_pages: number;
  page_size: number;
  results: T[];
}

export interface Profile {
  id: number;
  user: number;
  user_full_name: string;
  user_email: string;
  phone: string | null;
  avatar: string | null;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: number | null;
  role_name: string | null;
  profile: Profile | null;
  date_joined: string;
  last_login: string | null;
  is_active: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  role_id?: number | null;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password2: string;
}

export interface UserUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface ProfileUpdateRequest {
  phone?: string;
  bio?: string;
  avatar?: File;
}
