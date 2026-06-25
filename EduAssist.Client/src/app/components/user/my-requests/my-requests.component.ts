import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { SearchComponent } from '../../shared/search/search.component';
import { UserRequestService } from '../../../services/user-request.service';
import { UserRequest } from '../../../models/user-request.model';

@Component({ selector: 'app-my-requests', standalone: true, imports: [CommonModule, RouterModule, UserNavbarComponent, FooterComponent, PaginationComponent, SearchComponent], templateUrl: './my-requests.component.html', styleUrls: ['./my-requests.component.css'] })
export class MyRequestsComponent implements OnInit {
  requests: UserRequest[] = []; loading = true; currentPage = 1; totalPages = 1; totalCount = 0; search = '';
  constructor(private requestService: UserRequestService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.loading = true; this.requestService.getMyRequests(this.currentPage, 5, this.search).subscribe({ next: (res) => { this.requests = res.items; this.totalPages = res.totalPages; this.totalCount = res.totalCount; this.loading = false; this.cdr.detectChanges(); }, error: () => { this.loading = false; } }); }
  onSearch(term: string): void { this.search = term; this.currentPage = 1; this.load(); }
  onPageChange(page: number): void { this.currentPage = page; this.load(); }
}
