import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TourService } from '../../../core/services/tour.service';
import { DestinationService } from '../../../core/services/destination.service';
import { ToastService } from '../../../core/services/toast.service';
import { Category } from '../../../core/models/tour.models';
import { City } from '../../../core/models/destination.models';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './activity-form.component.html',
  styleUrl: './activity-form.component.css'
})
export class ActivityFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  pageLoading = true;
  isEdit = false;
  slug = '';
  categories: Category[] = [];
  cities: City[] = [];
  selectedCategories: number[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService,
    private destService: DestinationService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      city: [null, Validators.required],
      description: ['', Validators.required],
      what_to_bring: [''],
      base_price: [null, [Validators.required, Validators.min(0)]],
      max_travelers: [10, [Validators.required, Validators.min(1)]],
      duration_hours: [1, [Validators.required, Validators.min(0.5)]],
      is_active: [true]
    });
  }

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.isEdit = !!this.slug;
    this.tourService.getCategories().subscribe(c => this.categories = c.results);
    this.destService.getCities().subscribe(c => this.cities = c.results);
    if (this.isEdit) {
      this.tourService.getActivityBySlug(this.slug).subscribe({
        next: a => {
          this.form.patchValue({
            title: a.title, city: a.city?.id || a.city,
            description: a.description, what_to_bring: a.what_to_bring,
            base_price: a.base_price, max_travelers: a.max_travelers,
            duration_hours: a.duration_hours, is_active: a.is_active
          });
          this.selectedCategories = a.categories.map((c: Category) => c.id);
          this.pageLoading = false;
        },
        error: () => { this.pageLoading = false; }
      });
    } else { this.pageLoading = false; }
  }

  toggleCategory(id: number) {
    const idx = this.selectedCategories.indexOf(id);
    if (idx >= 0) this.selectedCategories.splice(idx, 1);
    else this.selectedCategories.push(id);
  }

  isCatSelected(id: number) { return this.selectedCategories.includes(id); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const data = { ...this.form.value, categories: this.selectedCategories };
    const req = this.isEdit
      ? this.tourService.updateActivity(this.slug, data)
      : this.tourService.createActivity(data);
    req.subscribe({
      next: (a) => {
        this.toast.success(this.isEdit ? 'Activité mise à jour !' : 'Activité créée !');
        this.router.navigate(['/activities', a.slug]);
      },
      error: (e) => {
        const errs = e.error;
        this.toast.error(Object.values(errs).flat().join(' ') || 'Erreur.');
        this.loading = false;
      }
    });
  }

  f(n: string) { return this.form.get(n); }
}
