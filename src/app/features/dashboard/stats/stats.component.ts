import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { TourService } from '../../../core/services/tour.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { DestinationService } from '../../../core/services/destination.service';
import { TourismService } from '../../../core/services/tourism.service';
import { forkJoin } from 'rxjs';

interface AdminStat {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  route?: string;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit {
  loading = true;
  stats: AdminStat[] = [];

  activitiesCount = 0;
  bookingsTotal = 0;
  bookingsPending = 0;
  bookingsConfirmed = 0;
  bookingsCompleted = 0;
  bookingsCancelled = 0;
  reviewsTotal = 0;
  reviewsPending = 0;
  countriesCount = 0;
  citiesCount = 0;
  hotelsCount = 0;
  hotelBookingsCount = 0;

  recentBookings: any[] = [];
  pendingReviews: any[] = [];

  constructor(
    private bookingService: BookingService,
    private tourService: TourService,
    private reviewService: ReviewService,
    private destService: DestinationService,
    private tourismService: TourismService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    forkJoin({
      activities: this.tourService.getActivities(),
      bookings: this.bookingService.getBookings(),
      reviews: this.reviewService.getReviews({ show_all: true }),
      pendingReviews: this.reviewService.getPendingReviews(),
      countries: this.destService.getCountries(),
      cities: this.destService.getCities(),
      hotels: this.tourismService.getHotels(),
      hotelBookings: this.tourismService.getHotelBookings()
    }).subscribe({
      next: (data) => {
        this.activitiesCount = data.activities.results.length;

        this.bookingsTotal = data.bookings.results.length;
        this.bookingsPending = data.bookings.results.filter((b: any) => b.status === 'pending').length;
        this.bookingsConfirmed = data.bookings.results.filter((b: any) => b.status === 'confirmed').length;
        this.bookingsCompleted = data.bookings.results.filter((b: any) => b.status === 'completed').length;
        this.bookingsCancelled = data.bookings.results.filter((b: any) => b.status === 'cancelled').length;

        this.reviewsTotal = data.reviews.results.length;
        this.reviewsPending = data.pendingReviews.results.length;

        this.countriesCount = data.countries.results.length;
        this.citiesCount = data.cities.results.length;
        this.hotelsCount = data.hotels.results.length;
        this.hotelBookingsCount = data.hotelBookings.length;

        this.recentBookings = data.bookings.results.slice(0, 8);
        this.pendingReviews = data.pendingReviews.results.slice(0, 5);

        this.buildStats();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  buildStats() {
    this.stats = [
      { label: 'Activités', value: this.activitiesCount, icon: '🏄', color: '#eaf4f1', route: '/activities' },
      { label: 'Réservations', value: this.bookingsTotal, icon: '🎫', color: '#eff6ff', route: '/bookings' },
      { label: 'En attente', value: this.bookingsPending, icon: '⏳', color: '#fffbeb', route: '/bookings' },
      { label: 'Confirmées', value: this.bookingsConfirmed, icon: '✅', color: '#ecfdf5', route: '/bookings' },
      { label: 'Avis total', value: this.reviewsTotal, icon: '⭐', color: '#fdf4ff', route: '/reviews' },
      { label: 'Avis en attente', value: this.reviewsPending, icon: '🔍', color: '#fffbeb', route: '/reviews' },
      { label: 'Pays', value: this.countriesCount, icon: '🏳️', color: '#eaf4f1', route: '/destinations/countries' },
      { label: 'Villes', value: this.citiesCount, icon: '🏙️', color: '#eff6ff', route: '/destinations/cities' },
      { label: 'Hôtels', value: this.hotelsCount, icon: '🏨', color: '#eaf4f1', route: '/hotels' },
      { label: 'Réserv. hôtels', value: this.hotelBookingsCount, icon: '🛏️', color: '#fdf4ff', route: '/hotels/bookings' },
    ];
  }

  getBookingStatusClass(status: string) {
    const m: Record<string, string> = {
      pending: 'badge-warning', confirmed: 'badge-info',
      completed: 'badge-success', cancelled: 'badge-error', refunded: 'badge-neutral'
    };
    return m[status] || 'badge-neutral';
  }

  get completionRate(): number {
    if (!this.bookingsTotal) return 0;
    return Math.round((this.bookingsCompleted / this.bookingsTotal) * 100);
  }

  get cancellationRate(): number {
    if (!this.bookingsTotal) return 0;
    return Math.round((this.bookingsCancelled / this.bookingsTotal) * 100);
  }
}
