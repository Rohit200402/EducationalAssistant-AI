import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { QuizService } from '../../../services/quiz.service';
import { QuizList } from '../../../models/quiz.model';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule, RouterModule, UserNavbarComponent, FooterComponent],
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {
  quizzes: QuizList[] = [];
  loading = true;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(private quizService: QuizService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.loadQuizzes(); }

  loadQuizzes(): void {
    this.loading = true;
    this.quizService.getAll(this.pageNumber, this.pageSize).subscribe({
      next: (res) => { this.quizzes = res.items; this.totalPages = res.totalPages; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.loading = false; }
    });
  }

  openQuiz(id: number): void { this.router.navigate(['/user/quiz', id]); }
  viewResults(id: number): void { this.router.navigate(['/user/quiz', id, 'results']); }
  generateNew(): void { this.router.navigate(['/user/quiz/generate']); }
  changePage(page: number): void { this.pageNumber = page; this.loadQuizzes(); }
}
