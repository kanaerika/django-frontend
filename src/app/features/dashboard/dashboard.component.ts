import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { TourService } from '../../core/services/tour.service';
import { ReviewService } from '../../core/services/review.service';
import { TourismService } from '../../core/services/tourism.service';
import { BookingStats } from '../../core/models/booking.models';
import { ActivityList } from '../../core/models/tour.models';
import { Booking } from '../../core/models/booking.models';
import { Review } from '../../core/models/review.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats: BookingStats | null = null;
  recentBookings: Booking[] = [];
  featuredActivities: ActivityList[] = [];
  pendingReviews: Review[] = [];
  upcomingBookings: Booking[] = [];
  loading = true;

  constructor(
    public auth: AuthService,
    private bookingService: BookingService,
    private tourService: TourService,
    private reviewService: ReviewService
  ) { }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    this.bookingService.getMyStats().subscribe({
      next: s => this.stats = s,
      error: () => { }
    });
    this.bookingService.getUpcomingBookings().subscribe({
      next: b => this.upcomingBookings = (b?.results ?? []).slice(0, 5),
      error: () => { }
    });
    this.tourService.getFeaturedActivities().subscribe({
      next: a => { this.featuredActivities = a.slice(0, 4); this.loading = false; },
      error: () => { this.loading = false; }
    });
    if (this.auth.isAdmin) {
      this.reviewService.getPendingReviews().subscribe({
        next: r => this.pendingReviews = r.results.slice(0, 5),
        error: () => { }
      });
      this.bookingService.getBookings({ status: 'pending' }).subscribe({
        next: b => this.recentBookings = b.results.slice(0, 5),
        error: () => { }
      });
    }
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'badge-warning', confirmed: 'badge-info',
      completed: 'badge-success', cancelled: 'badge-error', refunded: 'badge-neutral'
    };
    return map[status] || 'badge-neutral';
  }
}
