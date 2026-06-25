import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SearchService } from '../../../services/search.service';
import { SearchResult } from '../../../models/search.model';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css']
})
export class GlobalSearchComponent {
  query = '';
  results: SearchResult[] = [];
  showDropdown = false;
  loading = false;

  constructor(private searchService: SearchService, private router: Router) {}

  onSearch(): void {
    if (!this.query.trim()) { this.results = []; this.showDropdown = false; return; }
    this.loading = true;
    this.searchService.search(this.query, undefined, undefined, 1, 5).subscribe({
      next: (res) => { this.results = res.items; this.showDropdown = true; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  viewAll(): void {
    this.showDropdown = false;
    this.router.navigate(['/user/search'], { queryParams: { q: this.query } });
  }

  navigateToResult(result: SearchResult): void {
    this.showDropdown = false;
    if (result.type === 'question') this.router.navigate(['/user/responses', result.id]);
    else if (result.type === 'response') this.router.navigate(['/user/responses', result.id]);
    else if (result.type === 'bookmark') this.router.navigate(['/user/bookmarks']);
  }

  hideDropdown(): void {
    setTimeout(() => this.showDropdown = false, 200);
  }
}
