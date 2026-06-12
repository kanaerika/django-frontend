import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../../core/services/tour.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Schedule } from '../../../core/models/tour.models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ConfirmModalComponent],
  templateUrl: './schedule-list.component.html',
  styleUrl: './schedule-list.component.css'
})
export class ScheduleListComponent implements OnInit {
  schedules: Schedule[] = [];
  loading = true;
  filterAvailable = '';
  deleteId: number | null = null;
  showDeleteModal = false;
  deleteLoading = false;

  constructor(
    private tourService: TourService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = {};
    if (this.filterAvailable !== '') params.available = this.filterAvailable === 'true';
    this.tourService.getSchedules(params).subscribe({
      next: s => { this.schedules = s.results; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  confirmDelete(id: number) { this.deleteId = id; this.showDeleteModal = true; }

  doDelete() {
    if (!this.deleteId) return;
    this.deleteLoading = true;
    this.tourService.deleteSchedule(this.deleteId).subscribe({
      next: () => {
        this.schedules = this.schedules.filter(s => s.id !== this.deleteId);
        this.toast.success('Planning supprimé.');
        this.showDeleteModal = false; this.deleteLoading = false;
      },
      error: () => { this.toast.error('Erreur.'); this.deleteLoading = false; }
    });
  }
}
