import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TourismService } from '../../../core/services/tourism.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { TourismDestination } from '../../../core/models/tourism.models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-tourism-destination-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './tourism-destination-list.component.html',
  styleUrl: './tourism-destination-list.component.css'
})
export class TourismDestinationListComponent implements OnInit {
  destinations: TourismDestination[] = [];
  loading = true;
  showModal = false;
  editingDest: TourismDestination | null = null;
  form: FormGroup;
  saving = false;
  deleteId: number | null = null;
  showDeleteModal = false;
  deleteLoading = false;
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
      city: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.tourismService.getDestinations(
  this.search ? { search: this.search } : undefined
).subscribe({
  next: (d) => {
    this.destinations = d.results; 
    this.loading = false;
    console.log("les destinations :", this.destinations);
  },
  error: () => {
    this.loading = false;
  }
});
  }

  openCreate() { this.editingDest = null; this.form.reset(); this.previewUrl = null; this.selectedFile = null; this.showModal = true; }
  openEdit(d: TourismDestination) {
    this.editingDest = d;
    this.form.patchValue({ name: d.name, city: d.city, description: d.description });
    this.previewUrl = d.image_url;
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
    Object.entries(this.form.value).forEach(([k, v]) => { if (v != null && v !== '') fd.append(k, String(v)); });
    if (this.selectedFile) fd.append('image', this.selectedFile);
    const req = this.editingDest
      ? this.tourismService.updateDestination(this.editingDest.id, fd)
      : this.tourismService.createDestination(fd);
    req.subscribe({
      next: () => { this.toast.success(this.editingDest ? 'Mise à jour.' : 'Destination créée.'); this.showModal = false; this.saving = false; this.load(); },
      error: (e) => { this.toast.error(Object.values(e.error).flat().join(' ') || 'Erreur.'); this.saving = false; }
    });
  }

  confirmDelete(id: number) { this.deleteId = id; this.showDeleteModal = true; }
  doDelete() {
    if (!this.deleteId) return;
    this.deleteLoading = true;
    this.tourismService.deleteDestination(this.deleteId).subscribe({
      next: () => { this.destinations = this.destinations.filter(d => d.id !== this.deleteId); this.toast.success('Supprimée.'); this.showDeleteModal = false; this.deleteLoading = false; },
      error: () => { this.toast.error('Erreur.'); this.deleteLoading = false; }
    });
  }
  f(n: string) { return this.form.get(n); }
}
