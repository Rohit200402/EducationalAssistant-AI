import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';
import { CopyButtonComponent } from '../../shared/copy-button/copy-button.component';
import { UserRequestService } from '../../../services/user-request.service';
import { CategoryService } from '../../../services/category.service';
import { BookmarkService } from '../../../services/bookmark.service';
import { RatingService } from '../../../services/rating.service';
import { ToastService } from '../../../services/toast.service';
import { Category } from '../../../models/category.model';
import { UserRequest } from '../../../models/user-request.model';

@Component({ selector: 'app-ask-question', standalone: true, imports: [CommonModule, FormsModule, RouterModule, UserNavbarComponent, FooterComponent, StarRatingComponent, CopyButtonComponent], templateUrl: './ask-question.component.html', styleUrls: ['./ask-question.component.css'] })
export class AskQuestionComponent implements OnInit {
  categories: Category[] = [];
  query = '';
  categoryId = 0;
  loading = false;
  response: UserRequest | null = null;
  error503 = false;
  failedRequestId = 0;
  userRating = 0;

  constructor(private requestService: UserRequestService, private categoryService: CategoryService, private bookmarkService: BookmarkService, private ratingService: RatingService, private toast: ToastService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.categoryService.getAllNoPagination().subscribe(c => { this.categories = c; this.cdr.detectChanges(); }); }

  submit(): void {
    if (!this.query.trim() || !this.categoryId) { this.toast.warning('Please fill in all fields.'); return; }
    this.loading = true; this.response = null; this.error503 = false;
    this.requestService.create({ query: this.query, categoryId: this.categoryId }).subscribe({
      next: (res) => { this.loading = false; this.response = res; this.toast.success('Response generated!'); this.cdr.detectChanges(); },
      error: (err) => {
        this.loading = false;
        if (err.status === 429) { this.toast.error(err.error?.message || 'Daily limit reached.'); }
        else if (err.status === 503) { this.error503 = true; this.failedRequestId = err.error?.userRequestId; this.toast.warning('AI unavailable. Question saved.'); }
        else { this.toast.error(err.error?.message || 'Failed to submit.'); }
      }
    });
  }

  retry(): void {
    if (!this.failedRequestId) return;
    this.loading = true; this.error503 = false;
    this.requestService.regenerate(this.failedRequestId).subscribe({
      next: (res) => { this.loading = false; this.response = { userRequestId: this.failedRequestId, query: this.query, categoryId: this.categoryId, userId: '', requestedOn: '', aiResponse: res }; this.toast.success('Response generated!'); this.cdr.detectChanges(); },
      error: () => { this.loading = false; this.error503 = true; this.toast.error('Still unavailable. Try later.'); }
    });
  }

  bookmark(): void {
    if (!this.response?.aiResponse) return;
    this.bookmarkService.create({ aiResponseId: this.response.aiResponse.aiResponseId, notes: '' }).subscribe({
      next: () => { this.toast.success('Bookmarked!'); this.cdr.detectChanges(); },
      error: (err) => { this.toast.error(err.error?.message || 'Bookmark failed'); }
    });
  }

  rateResponse(value: number): void {
    if (!this.response?.aiResponse) return;
    this.ratingService.rate({ aiResponseId: this.response.aiResponse.aiResponseId, value }).subscribe({
      next: () => { this.userRating = value; this.toast.success('Rating saved!'); this.cdr.detectChanges(); },
      error: () => { this.toast.error('Failed to rate.'); }
    });
  }

  reset(): void { this.query = ''; this.categoryId = 0; this.response = null; this.error503 = false; this.userRating = 0; }
}
