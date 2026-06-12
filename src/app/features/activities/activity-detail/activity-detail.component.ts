import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../../core/services/tour.service';
import { BookingService } from '../../../core/services/booking.service';
import { ReviewService } from '../../../core/services/review.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { ActivityDetail, Schedule } from '../../../core/models/tour.models';
import { Review } from '../../../core/models/review.models';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, StarRatingComponent],
  templateUrl: './activity-detail.component.html',
  styleUrl: './activity-detail.component.css'
})
export class ActivityDetailComponent implements OnInit {
  activity: ActivityDetail | null = null;
  reviews: Review[] = [];
  loading = true;
  bookingLoading = false;
  selectedSchedule: Schedule | null = null;
  travelers = 1;
  activeTab: 'info' | 'schedules' | 'reviews' = 'info';
  showBookingPanel = false;

  // Review form
  newReview = { rating: 5, title: '', comment: '' };
  reviewLoading = false;

  // Image upload
  imageFile: File | null = null;
  imageLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService,
    private bookingService: BookingService,
    private reviewService: ReviewService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.tourService.getActivityBySlug(slug).subscribe({
      next: a => { this.activity = a; this.loading = false; this.loadReviews(); },
      error: () => { this.loading = false; this.router.navigate(['/activities']); }
    });
  }

  loadReviews() {
    if (!this.activity) return;
    this.tourService.getActivityReviews(this.activity.slug).subscribe({
      next: r => this.reviews = r.results || r,
      error: () => {}
    });
  }

  selectSchedule(s: Schedule) {
    this.selectedSchedule = s;
    this.travelers = Math.min(this.travelers, s.available_spots);
    this.showBookingPanel = true;
  }

  book() {
    if (!this.selectedSchedule) return;
    this.bookingLoading = true;
    this.bookingService.createBooking({ schedule: this.selectedSchedule.id, number_of_travelers: this.travelers }).subscribe({
      next: (b) => { this.toast.success('Réservation créée !'); this.router.navigate(['/bookings', b.id]); },
      error: (e) => { this.toast.error(e.error?.detail || e.error?.non_field_errors?.[0] || 'Erreur.'); this.bookingLoading = false; }
    });
  }

  submitReview() {
    if (!this.activity || !this.newReview.comment) { this.toast.warning('Veuillez écrire un commentaire.'); return; }
    this.reviewLoading = true;
    this.reviewService.createReview({ activity: this.activity.id, ...this.newReview }).subscribe({
      next: () => { this.toast.success('Avis soumis !'); this.newReview = { rating: 5, title: '', comment: '' }; this.loadReviews(); this.reviewLoading = false; },
      error: (e) => { this.toast.error(e.error?.detail || 'Erreur.'); this.reviewLoading = false; }
    });
  }

  uploadImage(event: Event) {
    const f = (event.target as HTMLInputElement).files?.[0];
    if (!f || !this.activity) return;
    this.imageLoading = true;
    const fd = new FormData();
    fd.append('image', f);
    this.tourService.uploadActivityImage(this.activity.slug, fd).subscribe({
      next: (img) => {
        this.activity!.images.push(img);
        this.toast.success('Image ajoutée !');
        this.imageLoading = false;
      },
      error: () => { this.toast.error('Erreur upload.'); this.imageLoading = false; }
    });
  }

  setCover(imgId: number) {
    this.tourService.setImageAsCover(imgId).subscribe({
      next: () => { this.toast.success('Image de couverture mise à jour.'); },
      error: () => {}
    });
  }

  deleteImage(imgId: number) {
    this.tourService.deleteActivityImage(imgId).subscribe({
      next: () => { this.activity!.images = this.activity!.images.filter(i => i.id !== imgId); this.toast.success('Image supprimée.'); },
      error: () => {}
    });
  }

  getStatusBadge(isActive: boolean) { return isActive ? 'badge-success' : 'badge-error'; }
  stars(n: number) { return Array.from({ length: 5 }, (_, i) => i < n); }
}
