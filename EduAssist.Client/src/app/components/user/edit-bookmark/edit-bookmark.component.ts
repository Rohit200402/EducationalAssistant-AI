import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { BookmarkService } from '../../../services/bookmark.service';
import { ToastService } from '../../../services/toast.service';

@Component({ selector: 'app-edit-bookmark', standalone: true, imports: [CommonModule, FormsModule, RouterModule, UserNavbarComponent, FooterComponent], templateUrl: './edit-bookmark.component.html', styleUrls: ['./edit-bookmark.component.css'] })
export class EditBookmarkComponent implements OnInit {
  notes = ''; loading = false; bookmarkId = 0;
  constructor(private bookmarkService: BookmarkService, private route: ActivatedRoute, private router: Router, private toast: ToastService) {}
  ngOnInit(): void { this.bookmarkId = +this.route.snapshot.paramMap.get('id')!; this.bookmarkService.getById(this.bookmarkId).subscribe(b => this.notes = b.notes); }
  submit(): void {
    this.loading = true;
    this.bookmarkService.update(this.bookmarkId, { bookmarkId: this.bookmarkId, notes: this.notes }).subscribe({
      next: () => { this.toast.success('Bookmark updated!'); this.router.navigate(['/user/bookmarks']); },
      error: () => { this.loading = false; this.toast.error('Failed'); }
    });
  }
}
