import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { environment } from '../../../../environments/environment';
import { LeaderboardDto } from '../../../models/leaderboard.model';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterModule, UserNavbarComponent, FooterComponent],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: LeaderboardDto[] = [];
  loading = true;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.http.get<LeaderboardDto[]>(`${environment.apiUrl}/progress/leaderboard`).subscribe({
      next: (data) => { this.leaderboard = data; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.loading = false; }
    });
  }

  getMedalClass(rank: number): string {
    if (rank === 1) return 'medal gold';
    if (rank === 2) return 'medal silver';
    if (rank === 3) return 'medal bronze';
    return '';
  }

  getMedalIcon(rank: number): string {
    if (rank <= 3) return 'fas fa-trophy';
    return 'fas fa-user';
  }
}
