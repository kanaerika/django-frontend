import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Category, ActivityList, ActivityDetail, ActivityCreateRequest,
  Schedule, ScheduleCreateRequest, ActivityFilterParams, AvailableSchedule, ActivityImage
} from '../models/tour.models';
import { PaginatedResponse } from '../models/auth.models';


@Injectable({ providedIn: 'root' })
export class TourService {
  private readonly apiUrl = `${environment.apiUrl}/tour`;

  constructor(private http: HttpClient) {}

  // Categories
  getCategories(): Observable<PaginatedResponse<Category>> {
    return this.http.get<PaginatedResponse<Category>>(`${this.apiUrl}/categories/`);
  }

  getCategoryBySlug(slug: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${slug}/`);
  }

  getCategoryActivities(slug: string, page = 1, pageSize = 12): Observable<PaginatedResponse<any>> {
    const params = new HttpParams().set('page', page).set('page_size', pageSize);
    return this.http.get<PaginatedResponse<any>>(`${this.apiUrl}/categories/${slug}/activities/`, { params });
  }

  createCategory(data: { name: string }): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories/`, data);
  }

  updateCategory(slug: string, data: { name: string }): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/categories/${slug}/`, data);
  }

  deleteCategory(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${slug}/`);
  }

  // Activities
  getActivities(filters?: ActivityFilterParams): Observable<PaginatedResponse<ActivityList>> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v != null && v !== '') params = params.set(k, String(v));
      });
    }
    return this.http.get<PaginatedResponse<ActivityList>>(`${this.apiUrl}/activities/`, { params });
  }

  getActivityBySlug(slug: string): Observable<ActivityDetail> {
    return this.http.get<ActivityDetail>(`${this.apiUrl}/activities/${slug}/`);
  }

  getFeaturedActivities(): Observable<ActivityList[]> {
    return this.http.get<ActivityList[]>(`${this.apiUrl}/activities/featured/`);
  }

  getPopularActivities(): Observable<ActivityList[]> {
    return this.http.get<ActivityList[]>(`${this.apiUrl}/activities/popular/`);
  }

  getActivitySchedules(slug: string, upcoming = true, available = true): Observable<Schedule[]> {
    const params = new HttpParams().set('upcoming', upcoming).set('available', available);
    return this.http.get<Schedule[]>(`${this.apiUrl}/activities/${slug}/schedules/`, { params });
  }

  getAvailableSchedules(slug: string): Observable<AvailableSchedule[]> {
    return this.http.get<AvailableSchedule[]>(`${this.apiUrl}/activities/${slug}/available-schedules/`);
  }

  getActivityReviews(slug: string, page = 1, pageSize = 10): Observable<any> {
    const params = new HttpParams().set('page', page).set('page_size', pageSize);
    return this.http.get<any>(`${this.apiUrl}/activities/${slug}/reviews/`, { params });
  }

  createActivity(data: ActivityCreateRequest): Observable<ActivityDetail> {
    return this.http.post<ActivityDetail>(`${this.apiUrl}/activities/`, data);
  }

  updateActivity(slug: string, data: Partial<ActivityCreateRequest>): Observable<ActivityDetail> {
    return this.http.patch<ActivityDetail>(`${this.apiUrl}/activities/${slug}/`, data);
  }

  deleteActivity(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/activities/${slug}/`);
  }

  uploadActivityImage(slug: string, formData: FormData): Observable<ActivityImage> {
    return this.http.post<ActivityImage>(`${this.apiUrl}/activities/${slug}/images/`, formData);
  }

  // Schedules
  getSchedules(params?: { activity?: number; from_date?: string; to_date?: string; available?: boolean }): Observable<PaginatedResponse<Schedule>> {
    let httpParams = new HttpParams();
    Object.entries(params || {}).forEach(([k, v]) => { if (v != null) httpParams = httpParams.set(k, String(v)); });
    return this.http.get<PaginatedResponse<Schedule>>(`${this.apiUrl}/schedules/`, { params: httpParams });
  }

  createSchedule(data: ScheduleCreateRequest): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.apiUrl}/schedules/`, data);
  }

  updateSchedule(id: number, data: Partial<ScheduleCreateRequest>): Observable<Schedule> {
    return this.http.patch<Schedule>(`${this.apiUrl}/schedules/${id}/`, data);
  }

  deleteSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/schedules/${id}/`);
  }

  setImageAsCover(imageId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/activity-images/${imageId}/set-cover/`, {});
  }

  deleteActivityImage(imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/activity-images/${imageId}/`);
  }
}
