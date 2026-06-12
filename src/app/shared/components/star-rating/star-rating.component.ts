import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
  @Input() rating = 0;
  @Input() max = 5;
  get stars(): boolean[] {
    return Array.from({ length: this.max }, (_, i) => i < Math.round(this.rating));
  }
}
