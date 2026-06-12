import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Review } from '../../../core/models/review.models';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StarRatingComponent, ConfirmModalComponent],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css'
})
export class ReviewListComponent implements OnInit {
  reviews: Review[] = [];
  loading = true;
  activeTab: 'all' | 'mine' | 'pending' = 'all';
  deleteId: number | null = null;
  showDeleteModal = false;
  deleteLoading = false;

  constructor(
    private reviewService: ReviewService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit() { this.loadReviews(); }

  loadReviews() {
    this.loading = true;
    const req = this.activeTab === 'mine'
      ? this.reviewService.getMyReviews()
      : this.activeTab === 'pending'
      ? this.reviewService.getPendingReviews()
      : this.reviewService.getReviews(this.auth.isAdmin ? { show_all: true } : {});
    req.subscribe({
      next: r => { this.reviews = r.results; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  setTab(t: typeof this.activeTab) { this.activeTab = t; this.loadReviews(); }

  moderate(id: number, visible: boolean) {
    this.reviewService.moderateReview(id, visible).subscribe({
      next: () => {
        this.toast.success(visible ? 'Avis approuvé.' : 'Avis masqué.');
        const r = this.reviews.find(x => x.id === id);
        if (r) r.is_visible = visible;
      },
      error: () => this.toast.error('Erreur.')
    });
  }

  confirmDelete(id: number) { this.deleteId = id; this.showDeleteModal = true; }

  doDelete() {
    if (!this.deleteId) return;
    this.deleteLoading = true;
    this.reviewService.deleteReview(this.deleteId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== this.deleteId);
        this.toast.success('Avis supprimé.');
        this.showDeleteModal = false; this.deleteLoading = false;
      },
      error: () => { this.toast.error('Erreur.'); this.deleteLoading = false; }
    });
  }
}
