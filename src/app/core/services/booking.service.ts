import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, BookingCreateRequest, BookingStats, Payment, PaymentCreateRequest } from '../models/booking.models';
import { PaginatedResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getBookings(params?: {
    status?: string;
    activity?: number;
    from_date?: string;
    to_date?: string;
  }): Observable<PaginatedResponse<Booking>> {
    let httpParams = new HttpParams();
    Object.entries(params || {}).forEach(([k, v]) => { if (v) httpParams = httpParams.set(k, String(v)); });
    return this.http.get<PaginatedResponse<Booking>>(`${this.apiUrl}/bookings/`, { params: httpParams });
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${id}/`);
  }

  createBooking(data: BookingCreateRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings/`, data);
  }

  cancelBooking(id: number, reason?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings/${id}/cancel/`, { reason: reason || '' });
  }

  payBooking(id: number, data: PaymentCreateRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/bookings/${id}/pay/`, data);
  }

  updateBookingStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/bookings/${id}/status/`, { status });
  }

  getMyStats(): Observable<BookingStats> {
    return this.http.get<BookingStats>(`${this.apiUrl}/bookings/my-stats/`);
  }

  getUpcomingBookings(): Observable<PaginatedResponse<Booking>> {
    return this.http.get<PaginatedResponse<Booking>>(`${this.apiUrl}/bookings/upcoming/`);
  }

  getPastBookings(): Observable<PaginatedResponse<Booking>> {
    return this.http.get<PaginatedResponse<Booking>>(`${this.apiUrl}/bookings/past/`);
  }

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments/`);
  }
}
