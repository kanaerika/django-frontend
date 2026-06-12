import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { BookingService } from '../../../core/services/booking.service';
import { User } from '../../../core/models/auth.models';
import { Booking } from '../../../core/models/booking.models';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  bookings: Booking[] = [];
  loading = true;

  constructor(private route: ActivatedRoute, private authService: AuthService, private bookingService: BookingService) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.authService.getUserById(id).subscribe({
      next: u => {
        this.user = u;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  initials(u: User) { return (u.first_name?.[0] || u.username[0] || 'U').toUpperCase(); }
}
