import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestinationService } from '../../../core/services/destination.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { City, Country } from '../../../core/models/destination.models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-city-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.css'
})
export class CityListComponent implements OnInit {
  cities: City[] = [];
  countries: Country[] = [];
  loading = true;
  showModal = false;
  editingCity: City | null = null;
  form: FormGroup;
  saving = false;
  deleteId: number | null = null;
  showDeleteModal = false;
  deleteLoading = false;
  search = '';
  countryFilter = '';
  previewUrl: string | null = null;

  constructor(
    private destService: DestinationService,
    private toast: ToastService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      country: [null, Validators.required],
      description: [''],
      latitude: [null],
      longitude: [null]
    });
  }

  ngOnInit() {
    this.destService.getCountries().subscribe(c => this.countries = c.results);
    this.load();
  }

  load() {
    this.loading = true;
    const params: any = {};
    if (this.search) params.search = this.search;
    if (this.countryFilter) params.country = +this.countryFilter;
    this.destService.getCities(params).subscribe({
      next: c => { this.cities = c.results; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openCreate() { this.editingCity = null; this.form.reset(); this.previewUrl = null; this.showModal = true; }

  openEdit(c: City) {
    this.editingCity = c;
    this.form.patchValue({ name: c.name, country: c.country, description: c.description, latitude: c.latitude, longitude: c.longitude });
    this.previewUrl = c.thumbnail_url;
    this.showModal = true;
  }

  selectedFile: File | null = null;
  onFileSelect(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) { this.selectedFile = f; this.previewUrl = URL.createObjectURL(f); }
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const fd = new FormData();
    Object.entries(this.form.value).forEach(([k, v]) => { if (v != null && v !== '') fd.append(k, String(v)); });
    if (this.selectedFile) fd.append('thumbnail', this.selectedFile);
    const req = this.editingCity
      ? this.destService.updateCity(this.editingCity.id, fd)
      : this.destService.createCity(fd);
    req.subscribe({
      next: () => { this.toast.success(this.editingCity ? 'Ville mise à jour.' : 'Ville créée.'); this.showModal = false; this.saving = false; this.load(); },
      error: (e) => { this.toast.error(Object.values(e.error).flat().join(' ') || 'Erreur.'); this.saving = false; }
    });
  }

  confirmDelete(id: number) { this.deleteId = id; this.showDeleteModal = true; }
  doDelete() {
    if (!this.deleteId) return;
    this.deleteLoading = true;
    this.destService.deleteCity(this.deleteId).subscribe({
      next: () => { this.cities = this.cities.filter(c => c.id !== this.deleteId); this.toast.success('Ville supprimée.'); this.showDeleteModal = false; this.deleteLoading = false; },
      error: () => { this.toast.error('Erreur.'); this.deleteLoading = false; }
    });
  }
  f(n: string) { return this.form.get(n); }
}
