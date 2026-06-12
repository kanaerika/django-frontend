import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TourismDestination, Hotel, HotelBooking, HotelBookingCreateRequest,
  DestinationReview, DestinationReviewCreateRequest,PaginatedResponse
} from '../models/tourism.models';


@Injectable({ providedIn: 'root' })
export class TourismService {
  private readonly apiUrl = `${environment.apiUrl}/tourism`;

  constructor(private http: HttpClient) {}

  // Destinations
  getDestinations(params?: {
  search?: string;
  order_by_rating?: string;
  order_by_popular?: string;
}): Observable<PaginatedResponse<TourismDestination>> {

  let httpParams = new HttpParams();

  Object.entries(params || {}).forEach(([k, v]) => {
    if (v) httpParams = httpParams.set(k, v);
  });

  return this.http.get<PaginatedResponse<TourismDestination>>(
    `${this.apiUrl}/destinations/`,
    { params: httpParams }
  );
}

  getDestinationById(id: number): Observable<TourismDestination> {
    return this.http.get<TourismDestination>(`${this.apiUrl}/destinations/${id}/`);
  }

  getPopularDestinations(): Observable<TourismDestination[]> {
    return this.http.get<TourismDestination[]>(`${this.apiUrl}/destinations/popular/`);
  }

  getDestinationHotels(id: number): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/destinations/${id}/hotels/`);
  }

  getDestinationReviews(id: number): Observable<DestinationReview[]> {
    return this.http.get<DestinationReview[]>(`${this.apiUrl}/destinations/${id}/reviews/`);
  }

  createDestination(data: FormData): Observable<TourismDestination> {
    return this.http.post<TourismDestination>(`${this.apiUrl}/destinations/`, data);
  }

  updateDestination(id: number, data: FormData): Observable<TourismDestination> {
    return this.http.patch<TourismDestination>(`${this.apiUrl}/destinations/${id}/`, data);
  }

  deleteDestination(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/destinations/${id}/`);
  }

  // Hotels
  getHotels(params?: { destination?: number; search?: string }): Observable<PaginatedResponse<Hotel>> {
    let httpParams = new HttpParams();
    Object.entries(params || {}).forEach(([k, v]) => { if (v != null) httpParams = httpParams.set(k, String(v)); });
    return this.http.get<PaginatedResponse<Hotel>>(`${this.apiUrl}/hotels/`, { params: httpParams });
  }

  getHotelById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/hotels/${id}/`);
  }

  createHotel(data: FormData): Observable<Hotel> {
    return this.http.post<Hotel>(`${this.apiUrl}/hotels/`, data);
  }

  updateHotel(id: number, data: FormData): Observable<Hotel> {
    return this.http.patch<Hotel>(`${this.apiUrl}/hotels/${id}/`, data);
  }

  deleteHotel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/hotels/${id}/`);
  }

  // Hotel Bookings
  getHotelBookings(params?: { status?: string; hotel?: number }): Observable<HotelBooking[]> {
    let httpParams = new HttpParams();
    Object.entries(params || {}).forEach(([k, v]) => { if (v) httpParams = httpParams.set(k, String(v)); });
    return this.http.get<HotelBooking[]>(`${this.apiUrl}/hotel-bookings/`, { params: httpParams });
  }

  getMyHotelBookings(): Observable<HotelBooking[]> {
    return this.http.get<HotelBooking[]>(`${this.apiUrl}/hotel-bookings/my-bookings/`);
  }

  createHotelBooking(data: HotelBookingCreateRequest): Observable<HotelBooking> {
    return this.http.post<HotelBooking>(`${this.apiUrl}/hotel-bookings/`, data);
  }

  cancelHotelBooking(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/hotel-bookings/${id}/cancel/`, {});
  }

  // Destination Reviews
  getDestinationReviewsList(): Observable<DestinationReview[]> {
    return this.http.get<DestinationReview[]>(`${this.apiUrl}/destination-reviews/`);
  }

  createDestinationReview(data: DestinationReviewCreateRequest): Observable<DestinationReview> {
    return this.http.post<DestinationReview>(`${this.apiUrl}/destination-reviews/`, data);
  }
}
