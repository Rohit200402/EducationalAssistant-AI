import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { QuizService } from '../../../services/quiz.service';
import { ToastService } from '../../../services/toast.service';
import { QuizDetail, QuizQuestion, QuizAnswer } from '../../../models/quiz.model';

@Component({
  selector: 'app-take-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule, UserNavbarComponent, FooterComponent],
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.css']
})
export class TakeQuizComponent implements OnInit {
  quiz: QuizDetail | null = null;
  currentIndex = 0;
  answers: Map<number, string> = new Map();
  loading = true;
  submitting = false;

  constructor(private quizService: QuizService, private route: ActivatedRoute, private router: Router, private toast: ToastService) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.quizService.getById(id).subscribe({
      next: (q) => { this.quiz = q; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Quiz not found'); this.router.navigate(['/user/quiz']); }
    });
  }

  get currentQuestion(): QuizQuestion | null {
    return this.quiz?.questions[this.currentIndex] ?? null;
  }

  get progress(): number {
    return this.quiz ? ((this.currentIndex + 1) / this.quiz.questions.length) * 100 : 0;
  }

  selectOption(option: string): void {
    if (this.currentQuestion) this.answers.set(this.currentQuestion.questionId, option);
  }

  getSelected(): string { return this.currentQuestion ? (this.answers.get(this.currentQuestion.questionId) || '') : ''; }

  next(): void { if (this.currentIndex < (this.quiz?.questions.length ?? 0) - 1) this.currentIndex++; }
  prev(): void { if (this.currentIndex > 0) this.currentIndex--; }

  submit(): void {
    if (!this.quiz) return;
    const answerList: QuizAnswer[] = this.quiz.questions.map(q => ({
      questionId: q.questionId,
      selectedOption: this.answers.get(q.questionId) || ''
    }));
    this.submitting = true;
    this.quizService.submit(this.quiz.quizId, { answers: answerList }).subscribe({
      next: () => { this.toast.success('Quiz submitted!'); this.router.navigate(['/user/quiz', this.quiz!.quizId, 'results']); },
      error: () => { this.submitting = false; this.toast.error('Failed to submit quiz'); }
    });
  }
}
