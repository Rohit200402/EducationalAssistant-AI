import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() averageRating: number = 0;
  @Input() totalRatings: number = 0;
  @Input() readonly: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  hoveredStar: number = 0;

  onStarHover(star: number): void {
    if (!this.readonly) this.hoveredStar = star;
  }

  onStarLeave(): void {
    this.hoveredStar = 0;
  }

  onStarClick(star: number): void {
    if (!this.readonly) {
      this.rating = star;
      this.ratingChange.emit(star);
    }
  }

  getStarClass(star: number): string {
    const activeRating = this.hoveredStar || this.rating;
    if (star <= activeRating) return 'fas fa-star star-filled';
    return 'far fa-star star-empty';
  }
}
