import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { SearchComponent } from '../../shared/search/search.component';
import { AIResponseService } from '../../../services/ai-response.service';
import { AIResponse } from '../../../models/ai-response.model';

@Component({ selector: 'app-view-all-responses', standalone: true, imports: [CommonModule, RouterModule, AdminNavbarComponent, FooterComponent, PaginationComponent, SearchComponent], templateUrl: './view-all-responses.component.html', styleUrls: ['./view-all-responses.component.css'] })
export class ViewAllResponsesComponent implements OnInit {
  responses: AIResponse[] = []; loading = true; currentPage = 1; totalPages = 1; totalCount = 0; search = '';
  constructor(private aiResponseService: AIResponseService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.loading = true; this.aiResponseService.getAll(this.currentPage, 5, this.search).subscribe({ next: (res) => { this.responses = res.items; this.totalPages = res.totalPages; this.totalCount = res.totalCount; this.loading = false; this.cdr.detectChanges(); }, error: () => { this.loading = false; } }); }
  onSearch(term: string): void { this.search = term; this.currentPage = 1; this.load(); }
  onPageChange(page: number): void { this.currentPage = page; this.load(); }
}
