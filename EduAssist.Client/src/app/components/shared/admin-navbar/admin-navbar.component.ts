import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { GlobalSearchComponent } from '../global-search/global-search.component';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, GlobalSearchComponent],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
  sidebarOpen = false;

  constructor(public authService: AuthService) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebarOnMobile(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      this.sidebarOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
