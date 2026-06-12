import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TourismService } from '../../../core/services/tourism.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { HotelBooking, Hotel } from '../../../core/models/tourism.models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-hotel-booking-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './hotel-booking-list.component.html',
  styleUrl: './hotel-booking-list.component.css'
})
export class HotelBookingListComponent implements OnInit {
  bookings: HotelBooking[] = [];
  hotels: Hotel[] = [];
  loading = true;
  showModal = false;
  form: FormGroup;
  saving = false;
  cancelId: number | null = null;
  showCancelModal = false;
  cancelLoading = false;
  activeTab: 'all' | 'mine' = 'mine';

  constructor(
    private tourismService: TourismService,
    private toast: ToastService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      hotel: [null, Validators.required],
      check_in: ['', Validators.required],
      check_out: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.tourismService.getHotels().subscribe(h => this.hotels = h.results);
    this.load();
  }

  load() {
    this.loading = true;
    const req = this.activeTab === 'mine' || !this.auth.isAdmin
      ? this.tourismService.getMyHotelBookings()
      : this.tourismService.getHotelBookings();
    req.subscribe({
      next: b => { this.bookings = b; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  setTab(t: typeof this.activeTab) { this.activeTab = t; this.load(); }

  openCreate() { this.form.reset({ guests: 1 }); this.showModal = true; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.tourismService.createHotelBooking(this.form.value).subscribe({
      next: () => { this.toast.success('Réservation hôtel créée !'); this.showModal = false; this.saving = false; this.load(); },
      error: (e) => { this.toast.error(e.error?.non_field_errors?.[0] || Object.values(e.error).flat().join(' ') || 'Erreur.'); this.saving = false; }
    });
  }

  confirmCancel(id: number) { this.cancelId = id; this.showCancelModal = true; }
  doCancel() {
    if (!this.cancelId) return;
    this.cancelLoading = true;
    this.tourismService.cancelHotelBooking(this.cancelId).subscribe({
      next: () => {
        const b = this.bookings.find(x => x.id === this.cancelId);
        if (b) b.status = 'cancelled';
        this.toast.success('Réservation annulée.'); this.showCancelModal = false; this.cancelLoading = false;
      },
      error: () => { this.toast.error('Erreur.'); this.cancelLoading = false; }
    });
  }

  getStatusClass(s: string) { return s === 'confirmed' ? 'badge-success' : s === 'pending' ? 'badge-warning' : 'badge-error'; }
  f(n: string) { return this.form.get(n); }
}
