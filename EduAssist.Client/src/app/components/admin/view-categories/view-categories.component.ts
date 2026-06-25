import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { SearchComponent } from '../../shared/search/search.component';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-view-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent, FooterComponent, PaginationComponent, SearchComponent],
  templateUrl: './view-categories.component.html',
  styleUrls: ['./view-categories.component.css']
})
export class ViewCategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  search = '';

  constructor(private categoryService: CategoryService) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.categoryService.getAll(this.currentPage, 5, this.search).subscribe({
      next: (res) => { this.categories = res.items; this.totalPages = res.totalPages; this.totalCount = res.totalCount; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
  onSearch(term: string): void { this.search = term; this.currentPage = 1; this.load(); }
  onPageChange(page: number): void { this.currentPage = page; this.load(); }
}
