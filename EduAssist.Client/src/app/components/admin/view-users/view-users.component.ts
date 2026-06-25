import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { SearchComponent } from '../../shared/search/search.component';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-view-users',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent, FooterComponent, PaginationComponent, SearchComponent],
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  search = '';

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll(this.currentPage, 5, this.search).subscribe({
      next: (res) => { this.users = res.items; this.totalPages = res.totalPages; this.totalCount = res.totalCount; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.loading = false; }
    });
  }
  onSearch(term: string): void { this.search = term; this.currentPage = 1; this.loadUsers(); }
  onPageChange(page: number): void { this.currentPage = page; this.loadUsers(); }
}
