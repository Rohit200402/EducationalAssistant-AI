import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { BookmarkService } from '../../../services/bookmark.service';
import { ToastService } from '../../../services/toast.service';

@Component({ selector: 'app-add-bookmark', standalone: true, imports: [CommonModule, FormsModule, RouterModule, UserNavbarComponent, FooterComponent], templateUrl: './add-bookmark.component.html', styleUrls: ['./add-bookmark.component.css'] })
export class AddBookmarkComponent {
  notes = ''; loading = false; responseId = 0;
  constructor(private bookmarkService: BookmarkService, private route: ActivatedRoute, private router: Router, private toast: ToastService) { this.responseId = +this.route.snapshot.paramMap.get('responseId')!; }
  submit(): void {
    this.loading = true;
    this.bookmarkService.create({ aiResponseId: this.responseId, notes: this.notes }).subscribe({
      next: () => { this.toast.success('Bookmarked!'); this.router.navigate(['/user/bookmarks']); },
      error: (err) => { this.loading = false; this.toast.error(err.error?.message || 'Failed'); }
    });
  }
}
