import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ProgressService } from '../../../services/progress.service';
import { ProgressStats } from '../../../models/progress.model';

@Component({ selector: 'app-progress-tracking', standalone: true, imports: [CommonModule, RouterModule, UserNavbarComponent, FooterComponent], templateUrl: './progress-tracking.component.html', styleUrls: ['./progress-tracking.component.css'] })
export class ProgressTrackingComponent implements OnInit {
  stats: ProgressStats | null = null; loading = true;
  constructor(private progressService: ProgressService) {}
  ngOnInit(): void { this.progressService.getProgress().subscribe({ next: (data) => { this.stats = data; this.loading = false; }, error: () => { this.loading = false; } }); }
}
