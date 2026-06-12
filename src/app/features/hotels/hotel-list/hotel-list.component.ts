import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TourismService } from '../../../core/services/tourism.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Hotel, TourismDestination } from '../../../core/models/tourism.models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.css'
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] = [];
  destinations: TourismDestination[] = [];
  loading = true;
  showModal = false;
  editingHotel: Hotel | null = null;
  form: FormGroup;
  saving = false;
  deleteId: number | null = null;
  showDeleteModal = false;
  deleteLoading = false;
  destFilter = '';
  search = '';
  previewUrl: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private tourismService: TourismService,
    private toast: ToastService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      destination: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.tourismService.getDestinations().subscribe(d => this.destinations = d.results);
    this.load();
  }

  load() {
    this.loading = true;
    const params: any = {};
    if (this.destFilter) params.destination = +this.destFilter;
    if (this.search) params.search = this.search;
this.tourismService.getHotels(params).subscribe({
  next: h => {
    this.hotels = h.results;
    this.loading = false;
  },
  error: () => {
    this.loading = false;
  }
});
  }

  openCreate() { this.editingHotel = null; this.form.reset(); this.previewUrl = null; this.showModal = true; }
  openEdit(h: Hotel) {
    this.editingHotel = h;
    this.form.patchValue({ name: h.name, address: h.address, destination: h.destination });
    this.previewUrl = h.image_url;
    this.showModal = true;
  }

  onFileSelect(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) { this.selectedFile = f; this.previewUrl = URL.createObjectURL(f); }
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const fd = new FormData();
    Object.entries(this.form.value).forEach(([k, v]) => { if (v != null) fd.append(k, String(v)); });
    if (this.selectedFile) fd.append('image', this.selectedFile);
    const req = this.editingHotel
      ? this.tourismService.updateHotel(this.editingHotel.id, fd)
      : this.tourismService.createHotel(fd);
    req.subscribe({
      next: () => { this.toast.success(this.editingHotel ? 'Hôtel mis à jour.' : 'Hôtel créé.'); this.showModal = false; this.saving = false; this.load(); },
      error: (e) => { this.toast.error(Object.values(e.error).flat().join(' ') || 'Erreur.'); this.saving = false; }
    });
  }

  confirmDelete(id: number) { this.deleteId = id; this.showDeleteModal = true; }
  doDelete() {
    if (!this.deleteId) return;
    this.deleteLoading = true;
    this.tourismService.deleteHotel(this.deleteId).subscribe({
      next: () => { this.hotels = this.hotels.filter(h => h.id !== this.deleteId); this.toast.success('Hôtel supprimé.'); this.showDeleteModal = false; this.deleteLoading = false; },
      error: () => { this.toast.error('Erreur.'); this.deleteLoading = false; }
    });
  }

  f(n: string) { return this.form.get(n); }
}
