import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestinationService } from '../../../core/services/destination.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Country } from '../../../core/models/destination.models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.css'
})
export class CountryListComponent implements OnInit {
  countries: Country[] = [];
  loading = true;
  showModal = false;
  editingCountry: Country | null = null;
  form: FormGroup;
  saving = false;
  deleteId: number | null = null;
  showDeleteModal = false;
  deleteLoading = false;
  search = '';

  constructor(
    private destService: DestinationService,
    private toast: ToastService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      iso_code: ['', [Validators.required, Validators.maxLength(3)]]
    });
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.destService.getCountries(this.search ? { search: this.search } : undefined).subscribe({
      next: c => { this.countries = c.results; this.loading = false;console.log("countrie : ", c.results ) },
      error: () => { this.loading = false; }
    });
  }

  openCreate() { this.editingCountry = null; this.form.reset(); this.showModal = true; }
  openEdit(c: Country) { this.editingCountry = c; this.form.patchValue({ name: c.name, iso_code: c.iso_code }); this.showModal = true; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const req = this.editingCountry
      ? this.destService.updateCountry(this.editingCountry.id, this.form.value)
      : this.destService.createCountry(this.form.value);
    req.subscribe({
      next: () => { this.toast.success(this.editingCountry ? 'Pays mis à jour.' : 'Pays créé.'); this.showModal = false; this.saving = false; this.load(); },
      error: (e) => { this.toast.error(Object.values(e.error).flat().join(' ') || 'Erreur.'); this.saving = false; }
    });
  }

  confirmDelete(id: number) { this.deleteId = id; this.showDeleteModal = true; }
  doDelete() {
    if (!this.deleteId) return;
    this.deleteLoading = true;
    this.destService.deleteCountry(this.deleteId).subscribe({
      next: () => { this.countries = this.countries.filter(c => c.id !== this.deleteId); this.toast.success('Pays supprimé.'); this.showDeleteModal = false; this.deleteLoading = false; },
      error: () => { this.toast.error('Erreur.'); this.deleteLoading = false; }
    });
  }
  f(n: string) { return this.form.get(n); }
}
