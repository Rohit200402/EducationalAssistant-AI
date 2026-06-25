import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { DashboardService } from '../../../services/dashboard.service';
import { UserDashboardStats } from '../../../models/dashboard.model';

@Component({ selector: 'app-user-dashboard', standalone: true, imports: [CommonModule, RouterModule, UserNavbarComponent, FooterComponent], templateUrl: './user-dashboard.component.html', styleUrls: ['./user-dashboard.component.css'] })
export class UserDashboardComponent implements OnInit {
  stats: UserDashboardStats | null = null; loading = true;
  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void { this.dashboardService.getUserStats().subscribe({ next: (data) => { this.stats = data; this.loading = false; this.cdr.detectChanges(); }, error: () => { this.loading = false; } }); }
}
