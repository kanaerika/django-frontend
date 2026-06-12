import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Country, City, CountryCreateRequest, CityCreateRequest } from '../models/destination.models';
import { PaginatedResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class DestinationService {
  private readonly apiUrl = `${environment.apiUrl}/destinations`;

  constructor(private http: HttpClient) {}

  // Countries
  getCountries(params?: { search?: string; order_by_activities?: string }): Observable<PaginatedResponse<Country>> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.order_by_activities) httpParams = httpParams.set('order_by_activities', params.order_by_activities);
    return this.http.get<PaginatedResponse<Country>>(`${this.apiUrl}/countries/`, { params: httpParams });
  }

  getCountryById(id: number): Observable<Country> {
    return this.http.get<Country>(`${this.apiUrl}/countries/${id}/`);
  }

  getPopularCountries(): Observable<PaginatedResponse<Country[]>> {
    return this.http.get<PaginatedResponse<Country[]>>(`${this.apiUrl}/countries/popular/`);
  }

  getCountryCities(id: number, page = 1, pageSize = 10): Observable<PaginatedResponse<City>> {
    const params = new HttpParams().set('page', page).set('page_size', pageSize);
    return this.http.get<PaginatedResponse<City>>(`${this.apiUrl}/countries/${id}/cities/`, { params });
  }

  createCountry(data: CountryCreateRequest): Observable<Country> {
    return this.http.post<Country>(`${this.apiUrl}/countries/`, data);
  }

  updateCountry(id: number, data: Partial<CountryCreateRequest>): Observable<Country> {
    return this.http.patch<Country>(`${this.apiUrl}/countries/${id}/`, data);
  }

  deleteCountry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/countries/${id}/`);
  }

  // Cities
  getCities(params?: {
    country?: number;
    search?: string;
    order_by_activities?: string;
    order_by_rating?: string;
  }): Observable<PaginatedResponse<City>> {
    let httpParams = new HttpParams();
    if (params?.country) httpParams = httpParams.set('country', params.country);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.order_by_activities) httpParams = httpParams.set('order_by_activities', params.order_by_activities);
    if (params?.order_by_rating) httpParams = httpParams.set('order_by_rating', params.order_by_rating);
    return this.http.get<PaginatedResponse<City>>(`${this.apiUrl}/cities/`, { params: httpParams });
  }

  getCityById(id: number): Observable<City> {
    return this.http.get<City>(`${this.apiUrl}/cities/${id}/`);
  }

  getFeaturedCities(): Observable<PaginatedResponse<City[]>> {
    return this.http.get<PaginatedResponse<City[]>>(`${this.apiUrl}/cities/featured/`);
  }

  searchCities(q: string): Observable<{ query: string; count: number; results: City[] }> {
    const params = new HttpParams().set('q', q);
    return this.http.get<any>(`${this.apiUrl}/cities/search/`, { params });
  }

  getCityActivities(id: number, params?: any): Observable<PaginatedResponse<any>> {
    let httpParams = new HttpParams();
    Object.entries(params || {}).forEach(([k, v]) => { if (v != null) httpParams = httpParams.set(k, String(v)); });
    return this.http.get<PaginatedResponse<any>>(`${this.apiUrl}/cities/${id}/activities/`, { params: httpParams });
  }

  createCity(data: FormData): Observable<City> {
    return this.http.post<City>(`${this.apiUrl}/cities/`, data);
  }

  updateCity(id: number, data: FormData): Observable<City> {
    return this.http.patch<City>(`${this.apiUrl}/cities/${id}/`, data);
  }

  deleteCity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cities/${id}/`);
  }
}
