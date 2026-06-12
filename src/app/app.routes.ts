import { Routes } from '@angular/router';
import { authGuard, guestGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Auth (public)
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // Protected
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'stats',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/dashboard/stats/stats.component').then(m => m.StatsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/auth/profile/profile.component').then(m => m.ProfileComponent)
      },

      // Activities
      {
        path: 'activities',
        children: [
          { path: '', loadComponent: () => import('./features/activities/activity-list/activity-list.component').then(m => m.ActivityListComponent) },
          { path: 'new', loadComponent: () => import('./features/activities/activity-form/activity-form.component').then(m => m.ActivityFormComponent) },
          { path: 'categories', loadComponent: () => import('./features/activities/category-list/category-list.component').then(m => m.CategoryListComponent) },
          { path: ':slug', loadComponent: () => import('./features/activities/activity-detail/activity-detail.component').then(m => m.ActivityDetailComponent) },
          { path: ':slug/edit', loadComponent: () => import('./features/activities/activity-form/activity-form.component').then(m => m.ActivityFormComponent) },
        ]
      },

      // Schedules
      {
        path: 'schedules',
        children: [
          { path: '', loadComponent: () => import('./features/schedules/schedule-list/schedule-list.component').then(m => m.ScheduleListComponent) },
          { path: 'new', loadComponent: () => import('./features/schedules/schedule-form/schedule-form.component').then(m => m.ScheduleFormComponent) },
        ]
      },

      // Bookings
      {
        path: 'bookings',
        children: [
          { path: '', loadComponent: () => import('./features/bookings/booking-list/booking-list.component').then(m => m.BookingListComponent) },
          { path: ':id', loadComponent: () => import('./features/bookings/booking-detail/booking-detail.component').then(m => m.BookingDetailComponent) },
        ]
      },

      // Reviews
      {
        path: 'reviews',
        children: [
          { path: '', loadComponent: () => import('./features/reviews/review-list/review-list.component').then(m => m.ReviewListComponent) },
        ]
      },

      // Destinations (geo)
      {
        path: 'destinations',
        children: [
          { path: '', loadComponent: () => import('./features/destinations/destination-list/destination-list.component').then(m => m.DestinationListComponent) },
          { path: 'countries', loadComponent: () => import('./features/destinations/country-list/country-list.component').then(m => m.CountryListComponent) },
          { path: 'cities', loadComponent: () => import('./features/destinations/city-list/city-list.component').then(m => m.CityListComponent) },
        ]
      },

      // Hotels / tourism module
      {
        path: 'hotels',
        children: [
          { path: '', loadComponent: () => import('./features/hotels/hotel-list/hotel-list.component').then(m => m.HotelListComponent) },
          { path: 'destinations', loadComponent: () => import('./features/hotels/tourism-destination-list/tourism-destination-list.component').then(m => m.TourismDestinationListComponent) },
          { path: 'bookings', loadComponent: () => import('./features/hotels/hotel-booking-list/hotel-booking-list.component').then(m => m.HotelBookingListComponent) },
        ]
      },

      // Users (admin)
      {
        path: 'users',
        canActivate: [adminGuard],
        children: [
          { path: '', loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent) },
          { path: ':id', loadComponent: () => import('./features/users/user-detail/user-detail.component').then(m => m.UserDetailComponent) },
        ]
      },

      { path: '**', redirectTo: '/dashboard' }
    ]
  }
];
