import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Booking } from '../../../core/models/booking.models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ConfirmModalComponent],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.css'
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  activeTab: 'all' | 'upcoming' | 'past' = 'all';
  statusFilter = '';
  cancellingId: number | null = null;
  showCancelModal = false;
  cancelLoading = false;

  constructor(
    private bookingService: BookingService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit() { this.loadBookings(); }

  loadBookings() {
  this.loading = true;

  let obs;

  if (this.activeTab === 'upcoming') {
    obs = this.bookingService.getUpcomingBookings();
  } else if (this.activeTab === 'past') {
    obs = this.bookingService.getPastBookings();
  } else {
    obs = this.bookingService.getBookings(
      this.statusFilter ? { status: this.statusFilter } : undefined
    );
  }

  obs.subscribe({
    next: (b: any) => {
      this.bookings = b.results;
      this.loading = false;
    },
    error: () => {
      this.loading = false;
    }
  });
}

  setTab(t: typeof this.activeTab) { this.activeTab = t; this.loadBookings(); }

  confirmCancel(id: number) { this.cancellingId = id; this.showCancelModal = true; }

  doCancel() {
    if (!this.cancellingId) return;
    this.cancelLoading = true;
    this.bookingService.cancelBooking(this.cancellingId).subscribe({
      next: () => {
        this.toast.success('Réservation annulée.');
        this.showCancelModal = false; this.cancelLoading = false;
        this.loadBookings();
      },
      error: (e) => { this.toast.error(e.error?.detail || 'Erreur.'); this.cancelLoading = false; }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'badge-warning', confirmed: 'badge-info',
      completed: 'badge-success', cancelled: 'badge-error', refunded: 'badge-neutral'
    };
    return map[status] || 'badge-neutral';
  }

  canCancel(b: Booking) { return ['pending', 'confirmed'].includes(b.status); }
}
