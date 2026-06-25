import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { QuizService } from '../../../services/quiz.service';
import { AdminQuizList, QuizStats } from '../../../models/quiz.model';

@Component({
  selector: 'app-view-quiz-stats',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent, FooterComponent, PaginationComponent],
  templateUrl: './view-quiz-stats.component.html',
  styleUrls: ['./view-quiz-stats.component.css']
})
export class ViewQuizStatsComponent implements OnInit {
  stats: QuizStats | null = null;
  quizzes: AdminQuizList[] = [];
  loading = true;
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadQuizzes();
  }

  loadStats(): void {
    this.quizService.getStats().subscribe({
      next: (res) => { this.stats = res; },
      error: () => {}
    });
  }

  loadQuizzes(): void {
    this.loading = true;
    this.quizService.getAllAdmin(this.currentPage, 10).subscribe({
      next: (res) => { this.quizzes = res.items; this.totalPages = res.totalPages; this.totalCount = res.totalCount; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onPageChange(page: number): void { this.currentPage = page; this.loadQuizzes(); }
}
