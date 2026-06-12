import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TourService } from '../../../core/services/tour.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivityList } from '../../../core/models/tour.models';

@Component({
  selector: 'app-schedule-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './schedule-form.component.html',
  styleUrl: './schedule-form.component.css'
})
export class ScheduleFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  activities: ActivityList[] = [];

  constructor(
    private fb: FormBuilder,
    private tourService: TourService,
    private toast: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      activity: [null, Validators.required],
      date: ['', Validators.required],
      start_time: ['', Validators.required],
      available_spots: [10, [Validators.required, Validators.min(1)]],
      price_override: [null]
    });
  }

  ngOnInit() {
    this.tourService.getActivities().subscribe(a => this.activities = a.results);
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.tourService.createSchedule(this.form.value).subscribe({
      next: () => { this.toast.success('Créneau créé !'); this.router.navigate(['/schedules']); },
      error: (e) => { this.toast.error(Object.values(e.error).flat().join(' ') || 'Erreur.'); this.loading = false; }
    });
  }

  f(n: string) { return this.form.get(n); }
}
