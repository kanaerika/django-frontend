import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest, LoginResponse, RegisterRequest,Role,PaginatedResponse,
  User, ChangePasswordRequest, UserUpdateRequest, Profile, ProfileUpdateRequest
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('currentUser');
    if (stored) this.currentUser.set(JSON.parse(stored));
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, credentials).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        this.currentUser.set(res.user);
      })
    );
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/`, data);
  }

  logout(): void {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      this.http.post(`${this.apiUrl}/logout/`, { refresh }).subscribe({ error: () => {} });
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('currentUser');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me/`).pipe(
      tap(user => {
        this.currentUser.set(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  updateMe(data: UserUpdateRequest): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/me/`, data).pipe(
      tap(user => {
        this.currentUser.set(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  changePassword(data: ChangePasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/users/change-password/`, data);
  }

  getMyProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/profiles/me/`);
  }

  updateMyProfile(data: FormData): Observable<Profile> {
    return this.http.patch<Profile>(`${this.apiUrl}/profiles/me/`, data);
  }

  getUsers(): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>(`${this.apiUrl}/users/`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}/`);
  }

  assignRole(userId: number, roleId: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/${userId}/assign-role/`, { role_id: roleId });
  }

  getRoles(): Observable<PaginatedResponse<Role>> {
  return this.http.get<PaginatedResponse<Role>>(
    `${this.apiUrl}/roles/`
  );
}

  refreshToken(): Observable<{ access: string }> {
    const refresh = localStorage.getItem('refresh_token');
    return this.http.post<{ access: string }>(`${environment.apiUrl.replace('/api','')}/api/token/refresh/`, { refresh }).pipe(
      tap(res => localStorage.setItem('access_token', res.access))
    );
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  get isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role_name === 'Admin' || user?.role_name === 'admin' || false;
  }

  get isGuide(): boolean {
    const user = this.currentUser();
    return user?.role_name === 'Guide' || user?.role_name === 'guide' || false;
  }

  get isTourist(): boolean {
    const user = this.currentUser();
    return user?.role_name === 'Tourist' || user?.role_name === 'tourist' || false;
  }

  get accessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
