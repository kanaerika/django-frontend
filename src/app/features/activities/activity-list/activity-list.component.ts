import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../../core/services/tour.service';
import { DestinationService } from '../../../core/services/destination.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { ActivityList } from '../../../core/models/tour.models';
import { Category } from '../../../core/models/tour.models';
import { City } from '../../../core/models/destination.models';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ConfirmModalComponent, StarRatingComponent],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.css'
})
export class ActivityListComponent implements OnInit {
  activities: ActivityList[] = [];
  categories: Category[] = [];
  cities: City[] = [];
  loading = true;
  deletingId: string | null = null;
  showDeleteModal = false;
  deleteLoading = false;
  slugToDelete = '';

  filters = { search: '', category: '', city: '', min_price: '', max_price: '', ordering: '' };

  constructor(
    private tourService: TourService,
    private destService: DestinationService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.tourService.getCategories().subscribe(c => this.categories = c.results);
    this.destService.getCities().subscribe(c => this.cities = c.results);
    this.loadActivities();
  }

  loadActivities() {
    this.loading = true;
    const f: any = {};
    if (this.filters.search) f.search = this.filters.search;
    if (this.filters.category) f.category = this.filters.category;
    if (this.filters.city) f.city = this.filters.city;
    if (this.filters.min_price) f.min_price = this.filters.min_price;
    if (this.filters.max_price) f.max_price = this.filters.max_price;
    if (this.filters.ordering) f.ordering = this.filters.ordering;
    this.tourService.getActivities(f).subscribe({
      next: a => { this.activities = a.results; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  resetFilters() {
    this.filters = { search: '', category: '', city: '', min_price: '', max_price: '', ordering: '' };
    this.loadActivities();
  }

  confirmDelete(slug: string) { this.slugToDelete = slug; this.showDeleteModal = true; }

  doDelete() {
    this.deleteLoading = true;
    this.tourService.deleteActivity(this.slugToDelete).subscribe({
      next: () => {
        this.toast.success('Activité supprimée.');
        this.activities = this.activities.filter(a => a.slug !== this.slugToDelete);
        this.showDeleteModal = false; this.deleteLoading = false;
      },
      error: () => { this.toast.error('Erreur lors de la suppression.'); this.deleteLoading = false; }
    });
  }

  canEdit(a: ActivityList): boolean {
    return this.auth.isAdmin || this.auth.isGuide;
  }
}
