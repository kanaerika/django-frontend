import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TourService } from '../../../core/services/tour.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Category } from '../../../core/models/tour.models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ConfirmModalComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  showModal = false;
  editingCategory: Category | null = null;
  form: FormGroup;
  saving = false;
  deleteSlug: string | null = null;
  showDeleteModal = false;
  deleteLoading = false;

  constructor(
    private tourService: TourService,
    private toast: ToastService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.tourService.getCategories().subscribe({
      next: c => { this.categories = c.results; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openCreate() { this.editingCategory = null; this.form.reset(); this.showModal = true; }
  openEdit(c: Category) { this.editingCategory = c; this.form.patchValue({ name: c.name }); this.showModal = true; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const req = this.editingCategory
      ? this.tourService.updateCategory(this.editingCategory.slug, this.form.value)
      : this.tourService.createCategory(this.form.value);
    req.subscribe({
      next: () => {
        this.toast.success(this.editingCategory ? 'Catégorie mise à jour.' : 'Catégorie créée.');
        this.showModal = false; this.saving = false; this.load();
      },
      error: (e) => { this.toast.error(Object.values(e.error).flat().join(' ') || 'Erreur.'); this.saving = false; }
    });
  }

  confirmDelete(slug: string) { this.deleteSlug = slug; this.showDeleteModal = true; }
  doDelete() {
    if (!this.deleteSlug) return;
    this.deleteLoading = true;
    this.tourService.deleteCategory(this.deleteSlug).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.slug !== this.deleteSlug);
        this.toast.success('Catégorie supprimée.');
        this.showDeleteModal = false; this.deleteLoading = false;
      },
      error: () => { this.toast.error('Erreur.'); this.deleteLoading = false; }
    });
  }

  f(n: string) { return this.form.get(n); }
}
