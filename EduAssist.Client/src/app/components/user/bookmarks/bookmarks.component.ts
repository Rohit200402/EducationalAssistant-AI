import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { SearchComponent } from '../../shared/search/search.component';
import { BookmarkService } from '../../../services/bookmark.service';
import { ToastService } from '../../../services/toast.service';
import { Bookmark } from '../../../models/bookmark.model';

@Component({ selector: 'app-bookmarks', standalone: true, imports: [CommonModule, RouterModule, UserNavbarComponent, FooterComponent, PaginationComponent, SearchComponent], templateUrl: './bookmarks.component.html', styleUrls: ['./bookmarks.component.css'] })
export class BookmarksComponent implements OnInit {
  bookmarks: Bookmark[] = []; loading = true; currentPage = 1; totalPages = 1; totalCount = 0; search = '';
  constructor(private bookmarkService: BookmarkService, private toast: ToastService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.loading = true; this.bookmarkService.getAll(this.currentPage, 5, this.search).subscribe({ next: (res) => { this.bookmarks = res.items; this.totalPages = res.totalPages; this.totalCount = res.totalCount; this.loading = false; this.cdr.detectChanges(); }, error: () => { this.loading = false; } }); }
  onSearch(term: string): void { this.search = term; this.currentPage = 1; this.load(); }
  onPageChange(page: number): void { this.currentPage = page; this.load(); }
  delete(id: number): void { this.bookmarkService.delete(id).subscribe({ next: () => { this.toast.success('Bookmark removed!'); this.load(); this.cdr.detectChanges(); }, error: () => this.toast.error('Failed') }); }
}
