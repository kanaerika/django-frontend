import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DestinationService } from '../../../core/services/destination.service';
import { TourismService } from '../../../core/services/tourism.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { City } from '../../../core/models/destination.models';
import { TourismDestination } from '../../../core/models/tourism.models';

@Component({
  selector: 'app-destination-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './destination-list.component.html',
  styleUrl: './destination-list.component.css'
})
export class DestinationListComponent implements OnInit {
  cities: City[] = [];
  tourismDests: TourismDestination[] = [];
  loading = true;
  activeTab: 'cities' | 'tourism' = 'cities';
  search = '';

  constructor(
    private destService: DestinationService,
    private tourismService: TourismService,
    public auth: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    if (this.activeTab === 'cities') {
      this.destService.getCities({ search: this.search || undefined }).subscribe({
        next: c => { this.cities = c.results; this.loading = false; },
        error: () => { this.loading = false; }
      });
    } else {
      this.tourismService.getDestinations({ search: this.search || undefined }).subscribe({
        next: d => { this.tourismDests = d.results; this.loading = false; },
        error: () => { this.loading = false; }
      });
    }
  }

  setTab(t: typeof this.activeTab) { this.activeTab = t; this.search = ''; this.load(); }
}
