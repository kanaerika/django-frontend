import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Booking } from '../../../core/models/booking.models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ConfirmModalComponent],
  templateUrl: './booking-detail.component.html',
  styleUrl: './booking-detail.component.css'
})
export class BookingDetailComponent implements OnInit {
  booking: Booking | null = null;
  loading = true;
  paymentMethod = 'wire';
  payLoading = false;
  showCancelModal = false;
  cancelLoading = false;
  paymentSuccess = false;
  newStatus = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.bookingService.getBookingById(id).subscribe({
      next: b => { this.booking = b; this.newStatus = b.status; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  pay() {
    if (!this.booking) return;
    this.payLoading = true;
    this.bookingService.payBooking(this.booking.id, { method: this.paymentMethod as any }).subscribe({
      next: () => {
        this.toast.success('Paiement enregistré !');
        this.paymentSuccess = true;
        this.booking!.status = 'confirmed';
        this.payLoading = false;
      },
      error: (e) => { this.toast.error(e.error?.detail || 'Erreur de paiement.'); this.payLoading = false; }
    });
  }

  cancel() {
    if (!this.booking) return;
    this.cancelLoading = true;
    this.bookingService.cancelBooking(this.booking.id).subscribe({
      next: () => {
        this.toast.success('Réservation annulée.');
        this.booking!.status = 'cancelled';
        this.booking!.status_display = 'Annulée';
        this.showCancelModal = false; this.cancelLoading = false;
      },
      error: (e) => { this.toast.error(e.error?.detail || 'Erreur.'); this.cancelLoading = false; }
    });
  }

  updateStatus() {
    if (!this.booking || !this.newStatus) return;
    this.bookingService.updateBookingStatus(this.booking.id, this.newStatus).subscribe({
      next: () => { this.toast.success('Statut mis à jour.'); this.booking!.status = this.newStatus as any; },
      error: () => { this.toast.error('Erreur.'); }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'badge-warning', confirmed: 'badge-info',
      completed: 'badge-success', cancelled: 'badge-error', refunded: 'badge-neutral'
    };
    return map[status] || 'badge-neutral';
  }
}
