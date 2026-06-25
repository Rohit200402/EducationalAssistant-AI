import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SearchService } from '../../../services/search.service';
import { CategoryService } from '../../../services/category.service';
import { SearchResult } from '../../../models/search.model';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UserNavbarComponent, FooterComponent],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  query = '';
  type = '';
  categoryId: number | null = null;
  results: SearchResult[] = [];
  categories: Category[] = [];
  loading = false;
  totalCount = 0;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(private searchService: SearchService, private categoryService: CategoryService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.categoryService.getAllNoPagination().subscribe(c => this.categories = c);
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      if (this.query) this.search();
    });
  }

  search(): void {
    if (!this.query.trim()) return;
    this.loading = true;
    const t = this.type || undefined;
    const c = this.categoryId || undefined;
    this.searchService.search(this.query, t, c, this.pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.results = res.items;
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  changePage(page: number): void {
    this.pageNumber = page;
    this.search();
  }

  navigate(result: SearchResult): void {
    if (result.type === 'question' || result.type === 'response') this.router.navigate(['/user/responses', result.id]);
    else if (result.type === 'bookmark') this.router.navigate(['/user/bookmarks']);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'question': return 'fa-question-circle text-primary';
      case 'response': return 'fa-robot text-success';
      case 'bookmark': return 'fa-bookmark text-warning';
      default: return 'fa-file text-muted';
    }
  }
}
