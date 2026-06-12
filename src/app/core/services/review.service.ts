import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review, ReviewCreateRequest, ReviewUpdateRequest, ActivityRatingStats } from '../models/review.models';
import { PaginatedResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getReviews(params?: { activity?: number; user?: number; rating?: number; show_all?: boolean }): Observable<PaginatedResponse<Review>> {
    let httpParams = new HttpParams();
    Object.entries(params || {}).forEach(([k, v]) => { if (v != null) httpParams = httpParams.set(k, String(v)); });
    return this.http.get<PaginatedResponse<Review>>(`${this.apiUrl}/reviews/`, { params: httpParams });
  }

  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/reviews/${id}/`);
  }

  getMyReviews(): Observable<PaginatedResponse<Review>> {
    return this.http.get<PaginatedResponse<Review>>(`${this.apiUrl}/reviews/my-reviews/`);
  }

  getPendingReviews(): Observable<PaginatedResponse<Review>> {
    return this.http.get<PaginatedResponse<Review>>(`${this.apiUrl}/reviews/pending/`);
  }

  getActivityRatings(activitySlug: string): Observable<ActivityRatingStats> {
    return this.http.get<ActivityRatingStats>(`${this.apiUrl}/reviews/activity/${activitySlug}/ratings/`);
  }

  createReview(data: ReviewCreateRequest): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews/`, data);
  }

  updateReview(id: number, data: ReviewUpdateRequest): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/reviews/${id}/`, data);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reviews/${id}/`);
  }

  moderateReview(id: number, isVisible: boolean): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/reviews/${id}/moderate/`, { is_visible: isVisible });
  }
}
